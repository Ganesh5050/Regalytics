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
  Wifi, 
  WifiOff, 
  RefreshCw, 
  MoreHorizontal,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function WebSocketIndicator() {
  const { 
    isConnected, 
    isConnecting, 
    connectionState, 
    reconnectAttempts, 
    connect, 
    disconnect,
    error 
  } = useWebSocket();

  const getStatusIcon = () => {
    if (isConnecting) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    if (isConnected) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    }
    
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = () => {
    if (isConnecting) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    
    if (isConnected) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusText = () => {
    if (isConnecting) {
      return 'Connecting...';
    }
    
    if (isConnected) {
      return 'Connected';
    }
    
    if (reconnectAttempts > 0) {
      return `Reconnecting (${reconnectAttempts})`;
    }
    
    return 'Disconnected';
  };

  const handleReconnect = () => {
    if (!isConnected && !isConnecting) {
      connect().catch(console.error);
    }
  };

  const handleDisconnect = () => {
    if (isConnected) {
      disconnect();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="hidden sm:inline">
              {getStatusText()}
            </span>
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">WebSocket Status</h4>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        <div className="px-3 py-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Connection State</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor()}`}
            >
              {connectionState}
            </Badge>
          </div>
          
          {reconnectAttempts > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Reconnect Attempts</span>
              <span className="text-sm font-medium">{reconnectAttempts}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600">Last Error</span>
              <span className="text-xs text-red-600 truncate max-w-32">{error}</span>
            </div>
          )}
        </div>
        
        <div className="px-3 py-2 border-t">
          <div className="flex gap-2">
            {!isConnected && !isConnecting && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReconnect}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reconnect
              </Button>
            )}
            
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex-1"
              >
                <WifiOff className="h-3 w-3 mr-1" />
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
