import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  MoreHorizontal,
  Server,
  Database,
  Activity
} from 'lucide-react';
import { useAPIHealth } from '@/hooks/useRealAPI';

export function APIStatusIndicator() {
  const { health, loading, error, refetch } = useAPIHealth();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'api':
        return <Server className="h-3 w-3" />;
      case 'clients':
      case 'transactions':
      case 'alerts':
      case 'reports':
      case 'audit':
        return <Database className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  if (loading && !health) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Checking...
      </Badge>
    );
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }

  if (!health) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${getStatusColor(health.status)}`}
          >
            {getStatusIcon(health.status)}
            <span className="hidden sm:inline">
              {health.status === 'healthy' ? 'All Systems' : 'Issues Detected'}
            </span>
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">API Status</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              disabled={loading}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="px-3 py-2 space-y-2">
          {Object.entries(health.services).map(([service, isHealthy]) => (
            <div key={service} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getServiceIcon(service)}
                <span className="text-sm capitalize">
                  {service === 'api' ? 'API Gateway' : service}
                </span>
              </div>
              {isHealthy ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          ))}
        </div>
        
        <div className="px-3 py-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall Status</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(health.status)}`}
            >
              {health.status}
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
