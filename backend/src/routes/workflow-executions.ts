import { Router } from 'express';
import { WorkflowExecutionService } from '../services/WorkflowExecutionService';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const workflowExecutionService = WorkflowExecutionService.getInstance();

// Get all active executions
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const activeExecutions = workflowExecutionService.getActiveExecutions();
    res.json({
      success: true,
      data: activeExecutions,
      count: activeExecutions.length
    });
  } catch (error) {
    console.error('Error fetching active executions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active executions'
    });
  }
});

// Get execution history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const history = await workflowExecutionService.getExecutionHistory(limit);
    
    res.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    console.error('Error fetching execution history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution history'
    });
  }
});

// Get execution by ID
router.get('/:executionId', authenticateToken, async (req, res) => {
  try {
    const { executionId } = req.params;
    const execution = workflowExecutionService.getExecution(executionId);
    
    if (!execution) {
      return res.status(404).json({
        success: false,
        message: 'Execution not found'
      });
    }

    res.json({
      success: true,
      data: execution
    });
  } catch (error) {
    console.error('Error fetching execution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution'
    });
  }
});

// Start new execution
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { workflowId, workflowName, data } = req.body;
    const userId = (req as any).user?.id;

    if (!workflowId || !workflowName) {
      return res.status(400).json({
        success: false,
        message: 'workflowId and workflowName are required'
      });
    }

    const execution = await workflowExecutionService.startExecution(
      workflowId,
      workflowName,
      userId,
      data
    );

    res.json({
      success: true,
      data: execution,
      message: 'Workflow execution started successfully'
    });
  } catch (error) {
    console.error('Error starting execution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start workflow execution'
    });
  }
});

// Cancel execution
router.post('/:executionId/cancel', authenticateToken, async (req, res) => {
  try {
    const { executionId } = req.params;
    
    await workflowExecutionService.cancelExecution(executionId);

    res.json({
      success: true,
      message: 'Workflow execution cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling execution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel workflow execution'
    });
  }
});

// Get execution statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await workflowExecutionService.getExecutionStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching execution stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution statistics'
    });
  }
});

// Get real-time execution status (WebSocket endpoint for testing)
router.get('/status/live', authenticateToken, async (req, res) => {
  try {
    const activeExecutions = workflowExecutionService.getActiveExecutions();
    
    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        activeExecutions,
        totalActive: activeExecutions.length
      }
    });
  } catch (error) {
    console.error('Error fetching live status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch live execution status'
    });
  }
});

export default router;
