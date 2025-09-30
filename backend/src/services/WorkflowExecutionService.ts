import { io } from '../server';
import { allQuery, runQuery } from '../database/init';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt: string;
  finishedAt?: string;
  progress: number; // 0-100
  currentStep?: string;
  error?: string;
  data?: any;
  userId?: string;
}

export class WorkflowExecutionService {
  private static instance: WorkflowExecutionService;
  private activeExecutions: Map<string, WorkflowExecution> = new Map();
  private executionInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): WorkflowExecutionService {
    if (!WorkflowExecutionService.instance) {
      WorkflowExecutionService.instance = new WorkflowExecutionService();
    }
    return WorkflowExecutionService.instance;
  }

  // Start a new workflow execution
  public async startExecution(workflowId: string, workflowName: string, userId?: string, data?: any): Promise<WorkflowExecution> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: WorkflowExecution = {
      id: executionId,
      workflowId,
      workflowName,
      status: 'running',
      startedAt: new Date().toISOString(),
      progress: 0,
      currentStep: 'Initializing workflow...',
      data,
      userId
    };

    // Store in memory
    this.activeExecutions.set(executionId, execution);

    // Store in database
    await runQuery(`
      INSERT INTO workflow_executions (id, workflowId, workflowName, status, startedAt, progress, currentStep, userId, data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      executionId,
      workflowId,
      workflowName,
      'running',
      execution.startedAt,
      0,
      execution.currentStep,
      userId || null,
      JSON.stringify(data || {})
    ]);

    // Broadcast to all connected clients
    io.emit('workflow-execution-started', execution);

    console.log(`🚀 Workflow execution started: ${executionId} (${workflowName})`);

    // Start the workflow simulation
    this.simulateWorkflowExecution(executionId);

    return execution;
  }

  // Update execution progress
  public async updateExecution(executionId: string, updates: Partial<WorkflowExecution>): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    // Update in memory
    Object.assign(execution, updates);

    // Update in database
    const updateFields = [];
    const updateValues = [];

    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(updates.status);
    }
    if (updates.progress !== undefined) {
      updateFields.push('progress = ?');
      updateValues.push(updates.progress);
    }
    if (updates.currentStep !== undefined) {
      updateFields.push('currentStep = ?');
      updateValues.push(updates.currentStep);
    }
    if (updates.error !== undefined) {
      updateFields.push('error = ?');
      updateValues.push(updates.error);
    }
    if (updates.finishedAt !== undefined) {
      updateFields.push('finishedAt = ?');
      updateValues.push(updates.finishedAt);
    }

    if (updateFields.length > 0) {
      updateValues.push(executionId);
      await runQuery(`
        UPDATE workflow_executions 
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `, updateValues);
    }

    // Broadcast update to all connected clients
    io.emit('workflow-execution-update', execution);

    console.log(`📊 Workflow execution updated: ${executionId} - ${updates.currentStep || 'Progress'} (${updates.progress || execution.progress}%)`);
  }

  // Complete execution
  public async completeExecution(executionId: string, status: 'succeeded' | 'failed' | 'cancelled', error?: string): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const updates: Partial<WorkflowExecution> = {
      status,
      progress: 100,
      finishedAt: new Date().toISOString(),
      currentStep: status === 'succeeded' ? 'Workflow completed successfully' : 'Workflow failed',
      error
    };

    await this.updateExecution(executionId, updates);

    // Remove from active executions
    this.activeExecutions.delete(executionId);

    // Broadcast completion
    io.emit('workflow-execution-completed', { ...execution, ...updates });

    console.log(`✅ Workflow execution completed: ${executionId} - ${status}`);
  }

  // Get all active executions
  public getActiveExecutions(): WorkflowExecution[] {
    return Array.from(this.activeExecutions.values());
  }

  // Get execution by ID
  public getExecution(executionId: string): WorkflowExecution | undefined {
    return this.activeExecutions.get(executionId);
  }

  // Get execution history from database
  public async getExecutionHistory(limit: number = 50): Promise<WorkflowExecution[]> {
    try {
      const rows = await allQuery(`
        SELECT id, workflowId, workflowName, status, startedAt, finishedAt, progress, currentStep, error, userId, data
        FROM workflow_executions
        ORDER BY startedAt DESC
        LIMIT ?
      `, [limit]);

      return rows.map(row => ({
        ...row,
        data: row.data ? JSON.parse(row.data) : undefined
      }));
    } catch (error) {
      console.error('Error fetching execution history:', error);
      return [];
    }
  }

  // Simulate workflow execution (for demo purposes)
  private async simulateWorkflowExecution(executionId: string): Promise<void> {
    const steps = [
      { step: 'Validating input data...', progress: 10, delay: 1000 },
      { step: 'Connecting to external services...', progress: 25, delay: 1500 },
      { step: 'Processing business logic...', progress: 50, delay: 2000 },
      { step: 'Generating reports...', progress: 75, delay: 1500 },
      { step: 'Finalizing workflow...', progress: 90, delay: 1000 }
    ];

    for (const stepInfo of steps) {
      await new Promise(resolve => setTimeout(resolve, stepInfo.delay));
      
      const execution = this.activeExecutions.get(executionId);
      if (!execution || execution.status !== 'running') break;

      await this.updateExecution(executionId, {
        currentStep: stepInfo.step,
        progress: stepInfo.progress
      });
    }

    // Complete the execution
    const execution = this.activeExecutions.get(executionId);
    if (execution && execution.status === 'running') {
      await this.completeExecution(executionId, 'succeeded');
    }
  }

  // Start monitoring service
  public startMonitoring(): void {
    if (this.executionInterval) return;

    // Update execution status every 5 seconds
    this.executionInterval = setInterval(() => {
      this.broadcastExecutionStatus();
    }, 5000);

    console.log('🔄 Workflow execution monitoring started');
  }

  // Stop monitoring service
  public stopMonitoring(): void {
    if (this.executionInterval) {
      clearInterval(this.executionInterval);
      this.executionInterval = null;
    }
    console.log('⏹️ Workflow execution monitoring stopped');
  }

  // Broadcast current execution status
  private async broadcastExecutionStatus(): Promise<void> {
    const activeExecutions = this.getActiveExecutions();
    
    if (activeExecutions.length > 0) {
      io.emit('workflow-executions-status', {
        timestamp: new Date().toISOString(),
        activeExecutions,
        totalActive: activeExecutions.length
      });
    }
  }

  // Cancel execution
  public async cancelExecution(executionId: string): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    await this.completeExecution(executionId, 'cancelled', 'Execution cancelled by user');
  }

  // Get execution statistics
  public async getExecutionStats(): Promise<{
    total: number;
    running: number;
    succeeded: number;
    failed: number;
    cancelled: number;
    averageDuration: number;
  }> {
    try {
      const stats = await allQuery(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running,
          SUM(CASE WHEN status = 'succeeded' THEN 1 ELSE 0 END) as succeeded,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          AVG(CASE 
            WHEN finishedAt IS NOT NULL AND startedAt IS NOT NULL 
            THEN (julianday(finishedAt) - julianday(startedAt)) * 24 * 60 * 60 
            ELSE NULL 
          END) as averageDuration
        FROM workflow_executions
      `);

      return stats[0] || {
        total: 0,
        running: 0,
        succeeded: 0,
        failed: 0,
        cancelled: 0,
        averageDuration: 0
      };
    } catch (error) {
      console.error('Error fetching execution stats:', error);
      return {
        total: 0,
        running: 0,
        succeeded: 0,
        failed: 0,
        cancelled: 0,
        averageDuration: 0
      };
    }
  }
}
