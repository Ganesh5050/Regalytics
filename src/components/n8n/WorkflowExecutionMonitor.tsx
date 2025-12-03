import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Play,
  Square,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import WorkflowExecutionService, { WorkflowExecution, ExecutionStats } from '@/services/WorkflowExecutionService';
import { useNotifications } from '@/hooks/useNotifications';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WorkflowExecutionMonitor() {
  const [activeExecutions, setActiveExecutions] = useState<WorkflowExecution[]>([]);
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([]);
  const [stats, setStats] = useState<ExecutionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { addNotification } = useNotifications();
  const { realTimeData } = useRealTimeData();

  // Load initial data
  useEffect(() => {
    loadExecutionData();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (realTimeData?.workflowExecutions) {
      setActiveExecutions(realTimeData.workflowExecutions.activeExecutions || []);
    }
  }, [realTimeData]);

  const loadExecutionData = async () => {
    setLoading(true);
    try {
      const [active, history, executionStats] = await Promise.all([
        WorkflowExecutionService.getActiveExecutions(),
        WorkflowExecutionService.getExecutionHistory(20),
        WorkflowExecutionService.getExecutionStats()
      ]);

      setActiveExecutions(active);
      setExecutionHistory(history);
      setStats(executionStats);
    } catch (error) {
      console.error('Error loading execution data:', error);
      addNotification({
        title: "Error Loading Data",
        description: "Failed to load workflow execution data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartExecution = async (workflowId: string, workflowName: string) => {
    try {
      const execution = await WorkflowExecutionService.startExecution(workflowId, workflowName);
      if (execution) {
        addNotification({
          title: "Workflow Started",
          description: `"${workflowName}" execution started successfully.`,
          type: "success",
        });
        loadExecutionData(); // Refresh data
      }
    } catch (error) {
      addNotification({
        title: "Error Starting Workflow",
        description: "Failed to start workflow execution.",
        type: "error",
      });
    }
  };

  const handleCancelExecution = async (executionId: string) => {
    try {
      await WorkflowExecutionService.cancelExecution(executionId);
      addNotification({
        title: "Workflow Cancelled",
        description: "Workflow execution cancelled successfully.",
        type: "info",
      });
      loadExecutionData(); // Refresh data
    } catch (error) {
      addNotification({
        title: "Error Cancelling Workflow",
        description: "Failed to cancel workflow execution.",
        type: "error",
      });
    }
  };

  const handleViewDetails = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: WorkflowExecution['status']) => {
    const colorClass = WorkflowExecutionService.getStatusColor(status);
    const icon = WorkflowExecutionService.getStatusIcon(status);
    
    return (
      <Badge className={`${colorClass} border-0`}>
        <span className="mr-1">{icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (startedAt: string, finishedAt?: string) => {
    return WorkflowExecutionService.formatDuration(startedAt, finishedAt);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading workflow execution data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time executions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Executions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round((stats.succeeded / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.succeeded} successful
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageDuration > 0 ? `${Math.round(stats.averageDuration)}s` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                Average execution time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Executions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Executions</CardTitle>
              <CardDescription>Currently running workflow executions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadExecutionData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleStartExecution('demo-workflow', 'Demo Workflow')}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Demo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeExecutions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active executions
            </div>
          ) : (
            <div className="space-y-4">
              {activeExecutions.map((execution) => (
                <div key={execution.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{execution.workflowName}</h4>
                      {getStatusBadge(execution.status)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(execution)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {execution.status === 'running' && (
                          <DropdownMenuItem 
                            onClick={() => handleCancelExecution(execution.id)}
                            className="text-red-600"
                          >
                            <Square className="mr-2 h-4 w-4" /> Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{execution.progress}%</span>
                    </div>
                    <Progress value={execution.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{execution.currentStep}</span>
                      <span>{formatDuration(execution.startedAt, execution.finishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>Latest workflow execution history</CardDescription>
        </CardHeader>
        <CardContent>
          {executionHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No execution history
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executionHistory.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell className="font-medium">{execution.workflowName}</TableCell>
                    <TableCell>{getStatusBadge(execution.status)}</TableCell>
                    <TableCell>{new Date(execution.startedAt).toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(execution.startedAt, execution.finishedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(execution)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Execution Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Execution Details</DialogTitle>
            <DialogDescription>
              Detailed information about workflow execution
            </DialogDescription>
          </DialogHeader>
          {selectedExecution && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Workflow Name</label>
                  <p className="text-sm">{selectedExecution.workflowName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedExecution.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Started At</label>
                  <p className="text-sm">{new Date(selectedExecution.startedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm">{formatDuration(selectedExecution.startedAt, selectedExecution.finishedAt)}</p>
                </div>
              </div>
              {selectedExecution.currentStep && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Step</label>
                  <p className="text-sm">{selectedExecution.currentStep}</p>
                </div>
              )}
              {selectedExecution.error && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Error</label>
                  <p className="text-sm text-red-600">{selectedExecution.error}</p>
                </div>
              )}
              {selectedExecution.status === 'running' && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Progress</label>
                  <div className="mt-2">
                    <Progress value={selectedExecution.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">{selectedExecution.progress}% complete</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
