import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useRealTimeConnection } from '@/hooks/useRealTimeData';

export function RealTimeIndicator() {
  const { isConnected, connectionStatus } = useRealTimeConnection();

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </Badge>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Real-time updates</span>
      </div>
    </div>
  );
}