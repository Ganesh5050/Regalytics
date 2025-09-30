import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt: string;
  finishedAt?: string;
  progress: number;
  currentStep?: string;
  error?: string;
  data?: any;
  userId?: string;
}

export interface ExecutionStats {
  total: number;
  running: number;
  succeeded: number;
  failed: number;
  cancelled: number;
  averageDuration: number;
}

class WorkflowExecutionService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Get all active executions
  async getActiveExecutions(): Promise<WorkflowExecution[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/workflow-executions/active`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active executions:', error);
      return [];
    }
  }

  // Get execution history
  async getExecutionHistory(limit: number = 50): Promise<WorkflowExecution[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/workflow-executions/history?limit=${limit}`, {
        headers: this.getHeaders()
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching execution history:', error);
      return [];
    }
  }

  // Get execution by ID
  async getExecution(executionId: string): Promise<WorkflowExecution | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/workflow-executions/${executionId}`, {
        headers: this.getHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching execution ${executionId}:`, error);
      return null;
    }
  }

  // Start new execution
  async startExecution(workflowId: string, workflowName: string, data?: any): Promise<WorkflowExecution | null> {
    try {
      const response = await axios.post(`${this.apiUrl}/workflow-executions/start`, {
        workflowId,
        workflowName,
        data
      }, {
        headers: this.getHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error starting execution:', error);
      throw error;
    }
  }

  // Cancel execution
  async cancelExecution(executionId: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/workflow-executions/${executionId}/cancel`, {}, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Error cancelling execution:', error);
      throw error;
    }
  }

  // Get execution statistics
  async getExecutionStats(): Promise<ExecutionStats> {
    try {
      const response = await axios.get(`${this.apiUrl}/workflow-executions/stats/overview`, {
        headers: this.getHeaders()
      });
      return response.data.data;
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

  // Get live execution status
  async getLiveStatus(): Promise<{
    timestamp: string;
    activeExecutions: WorkflowExecution[];
    totalActive: number;
  }> {
    try {
      const response = await axios.get(`${this.apiUrl}/workflow-executions/status/live`, {
        headers: this.getHeaders()
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching live status:', error);
      return {
        timestamp: new Date().toISOString(),
        activeExecutions: [],
        totalActive: 0
      };
    }
  }

  // Format duration for display
  formatDuration(startedAt: string, finishedAt?: string): string {
    const start = new Date(startedAt);
    const end = finishedAt ? new Date(finishedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Get status color for UI
  getStatusColor(status: WorkflowExecution['status']): string {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'succeeded': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  // Get status icon for UI
  getStatusIcon(status: WorkflowExecution['status']): string {
    switch (status) {
      case 'running': return '⏳';
      case 'succeeded': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '⏹️';
      default: return '❓';
    }
  }
}

export default new WorkflowExecutionService();
