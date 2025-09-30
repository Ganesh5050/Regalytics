import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketService, WebSocketMessage, WebSocketEventHandler } from '@/services/WebSocketService';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected';
  reconnectAttempts: number;
  lastMessage: WebSocketMessage | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (message: WebSocketMessage) => void;
  subscribe: (eventType: string, handler: WebSocketEventHandler) => () => void;
  error: string | null;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectOnMount = true
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const connectionHandlerRef = useRef<(() => void) | null>(null);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await webSocketService.connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    webSocketService.send(message);
  }, []);

  const subscribe = useCallback((eventType: string, handler: WebSocketEventHandler) => {
    return webSocketService.subscribe(eventType, (message) => {
      setLastMessage(message);
      handler(message);
    });
  }, []);

  // Set up connection state monitoring
  useEffect(() => {
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
      setConnectionState(webSocketService.getConnectionState());
      setReconnectAttempts(webSocketService.getReconnectAttempts());
      
      if (!connected) {
        setError(null); // Clear error on disconnect
      }
    };

    connectionHandlerRef.current = webSocketService.onConnectionChange(handleConnectionChange);
    
    // Set initial state
    setConnectionState(webSocketService.getConnectionState());
    setIsConnected(webSocketService.getConnectionState() === 'connected');
    setReconnectAttempts(webSocketService.getReconnectAttempts());

    return () => {
      if (connectionHandlerRef.current) {
        connectionHandlerRef.current();
      }
    };
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && reconnectOnMount && connectionState === 'disconnected') {
      connect().catch(console.error);
    }
  }, [autoConnect, reconnectOnMount, connect, connectionState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionHandlerRef.current) {
        connectionHandlerRef.current();
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    connectionState,
    reconnectAttempts,
    lastMessage,
    connect,
    disconnect,
    send,
    subscribe,
    error
  };
}

// Specialized hooks for different data types
export function useClientWebSocket() {
  const { subscribe, ...rest } = useWebSocket();
  
  const subscribeToClientUpdates = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('client_update', handler);
  }, [subscribe]);

  const subscribeToClientCreated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('client_created', handler);
  }, [subscribe]);

  const subscribeToClientUpdated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('client_updated', handler);
  }, [subscribe]);

  const subscribeToClientDeleted = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('client_deleted', handler);
  }, [subscribe]);

  return {
    ...rest,
    subscribeToClientUpdates,
    subscribeToClientCreated,
    subscribeToClientUpdated,
    subscribeToClientDeleted
  };
}

export function useTransactionWebSocket() {
  const { subscribe, ...rest } = useWebSocket();
  
  const subscribeToTransactionUpdates = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('transaction_update', handler);
  }, [subscribe]);

  const subscribeToTransactionCreated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('transaction_created', handler);
  }, [subscribe]);

  const subscribeToTransactionUpdated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('transaction_updated', handler);
  }, [subscribe]);

  const subscribeToTransactionFlagged = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('transaction_flagged', handler);
  }, [subscribe]);

  return {
    ...rest,
    subscribeToTransactionUpdates,
    subscribeToTransactionCreated,
    subscribeToTransactionUpdated,
    subscribeToTransactionFlagged
  };
}

export function useAlertWebSocket() {
  const { subscribe, ...rest } = useWebSocket();
  
  const subscribeToAlertUpdates = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('alert_update', handler);
  }, [subscribe]);

  const subscribeToAlertCreated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('alert_created', handler);
  }, [subscribe]);

  const subscribeToAlertUpdated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('alert_updated', handler);
  }, [subscribe]);

  const subscribeToAlertResolved = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('alert_resolved', handler);
  }, [subscribe]);

  const subscribeToAlertEscalated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('alert_escalated', handler);
  }, [subscribe]);

  return {
    ...rest,
    subscribeToAlertUpdates,
    subscribeToAlertCreated,
    subscribeToAlertUpdated,
    subscribeToAlertResolved,
    subscribeToAlertEscalated
  };
}

export function useReportWebSocket() {
  const { subscribe, ...rest } = useWebSocket();
  
  const subscribeToReportUpdates = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('report_update', handler);
  }, [subscribe]);

  const subscribeToReportGenerated = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('report_generated', handler);
  }, [subscribe]);

  const subscribeToReportFailed = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('report_failed', handler);
  }, [subscribe]);

  return {
    ...rest,
    subscribeToReportUpdates,
    subscribeToReportGenerated,
    subscribeToReportFailed
  };
}

export function useSystemWebSocket() {
  const { subscribe, ...rest } = useWebSocket();
  
  const subscribeToSystemEvents = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('system_event', handler);
  }, [subscribe]);

  const subscribeToUserActivity = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('user_activity', handler);
  }, [subscribe]);

  const subscribeToSystemAlerts = useCallback((handler: WebSocketEventHandler) => {
    return subscribe('system_alert', handler);
  }, [subscribe]);

  return {
    ...rest,
    subscribeToSystemEvents,
    subscribeToUserActivity,
    subscribeToSystemAlerts
  };
}
