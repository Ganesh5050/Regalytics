import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Activity, Server, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/AuthService';

interface BackendStatus {
  name: string;
  baseUrl: string;
  priority: number;
  isHealthy: boolean;
  lastChecked: number;
}

export function BackendStatus() {
  const [backends, setBackends] = useState<BackendStatus[]>([]);
  const [currentBackend, setCurrentBackend] = useState<BackendStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const updateStatus = () => {
    const status = authService.getBackendStatus();
    setBackends(status);
    setCurrentBackend(status.find(b => b.isHealthy) || status[0]);
  };

  const handleForceHealthCheck = async () => {
    setIsChecking(true);
    try {
      await authService.forceHealthCheck();
      updateStatus();
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    updateStatus();
    
    // Update status every 30 seconds
    const interval = setInterval(updateStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (backend: BackendStatus) => {
    if (backend.isHealthy) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else {
      return <XCircle className="h-3 w-3 text-red-500" />;
    }
  };

  const getStatusColor = (backend: BackendStatus) => {
    if (backend.isHealthy) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (!currentBackend) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white shadow-lg border-0 hover:shadow-xl transition-all"
          >
            <Server className="h-4 w-4" />
            <span className="text-xs font-medium">{currentBackend.name}</span>
            {getStatusIcon(currentBackend)}
            <Activity className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backend Status</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleForceHealthCheck}
                disabled={isChecking}
                className="h-6 px-2 text-xs"
              >
                {isChecking ? 'Checking...' : 'Check Now'}
              </Button>
            </div>
          </div>
          
          {backends.map((backend) => (
            <DropdownMenuItem
              key={backend.name}
              className="flex items-center justify-between p-3 cursor-default"
              disabled
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(backend)}
                <div>
                  <div className="text-sm font-medium">{backend.name}</div>
                  <div className="text-xs text-gray-500">
                    Priority: {backend.priority}
                  </div>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(backend)}`}
              >
                {backend.isHealthy ? 'Healthy' : 'Unhealthy'}
              </Badge>
            </DropdownMenuItem>
          ))}
          
          <div className="p-2 border-t">
            <div className="text-xs text-gray-500">
              Last checked: {new Date(currentBackend.lastChecked).toLocaleTimeString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Auto-failover enabled
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
