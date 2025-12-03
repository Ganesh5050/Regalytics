import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Play,
  Pause,
  Square,
  RefreshCw,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Settings,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import N8nService, { N8nWorkflow, N8nExecution } from '@/services/N8nService';
import { useNotifications } from '@/hooks/useNotifications';

export function N8nDashboard() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [executions, setExecutions] = useState<N8nExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Check if n8n is available
      const healthCheck = await N8nService.healthCheck();
      setIsConnected(healthCheck);
      
      let workflowsData: N8nWorkflow[];
      let executionsData: N8nExecution[];
      
      if (healthCheck) {
        // Load real data from n8n
        workflowsData = await N8nService.getWorkflows();
        executionsData = await N8nService.getExecutions();
      } else {
        // Use mock data for development
        workflowsData = N8nService.getMockWorkflows();
        executionsData = N8nService.getMockExecutions();
      }
      
      setWorkflows(workflowsData);
      setExecutions(executionsData);
    } catch (error) {
      console.error('Error loading n8n data:', error);
      addNotification({
        type: 'error',
        title: 'N8n Connection Error',
        message: 'Failed to load workflow data',
      });
      
      // Fallback to mock data
      setWorkflows(N8nService.getMockWorkflows());
      setExecutions(N8nService.getMockExecutions());
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWorkflow = async (workflow: N8nWorkflow) => {
    try {
      const success = workflow.active 
        ? await N8nService.deactivateWorkflow(workflow.id)
        : await N8nService.activateWorkflow(workflow.id);
      
      if (success) {
        addNotification({
          type: 'success',
          title: 'Workflow Updated',
          message: `Workflow ${workflow.active ? 'deactivated' : 'activated'} successfully`,
        });
        await loadData();
      } else {
        throw new Error('Failed to toggle workflow');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update workflow status',
      });
    }
  };

  const handleExecuteWorkflow = async (workflow: N8nWorkflow) => {
    try {
      const execution = await N8nService.executeWorkflow(workflow.id);
      if (execution) {
        addNotification({
          type: 'success',
          title: 'Workflow Executed',
          message: `Workflow "${workflow.name}" started successfully`,
        });
        await loadData();
      } else {
        throw new Error('Failed to execute workflow');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Execution Error',
        message: 'Failed to execute workflow',
      });
    }
  };

  const getStatusIcon = (execution: N8nExecution) => {
    if (!execution.finished) {
      return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
    }
    
    return execution.data?.success !== false 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (execution: N8nExecution) => {
    if (!execution.finished) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Running</Badge>;
    }
    
    return execution.data?.success !== false
      ? <Badge variant="outline" className="text-green-600 border-green-300">Success</Badge>
      : <Badge variant="outline" className="text-red-600 border-red-300">Failed</Badge>;
  };

  const activeWorkflows = workflows.filter(w => w.active).length;
  const totalExecutions = executions.length;
  const successfulExecutions = executions.filter(e => e.finished && e.data?.success !== false).length;
  const failedExecutions = executions.filter(e => e.finished && e.data?.success === false).length;

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">N8n Workflow Dashboard</h2>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        <Button 
          onClick={loadData} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeWorkflows} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulExecutions}</div>
            <p className="text-xs text-muted-foreground">
              {totalExecutions > 0 ? Math.round((successfulExecutions / totalExecutions) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedExecutions}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
          <CardDescription>
            Manage and monitor your automation workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">{workflow.name}</TableCell>
                  <TableCell>
                    <Badge variant={workflow.active ? "default" : "secondary"}>
                      {workflow.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleWorkflow(workflow)}
                        disabled={!isConnected}
                      >
                        {workflow.active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExecuteWorkflow(workflow)}
                        disabled={!isConnected || !workflow.active}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!isConnected}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>
            Latest workflow execution results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell className="font-medium">
                    {execution.workflowData.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution)}
                      {getStatusBadge(execution)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{execution.mode}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(execution.startedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {execution.finished && execution.stoppedAt
                      ? `${Math.round((new Date(execution.stoppedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)}s`
                      : execution.finished 
                        ? 'Unknown'
                        : 'Running...'
                    }
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!isConnected}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
