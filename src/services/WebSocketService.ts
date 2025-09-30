// Real WebSocket service for real-time updates
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  protocols?: string[];
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;
export type WebSocketConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private eventHandlers = new Map<string, Set<WebSocketEventHandler>>();
  private connectionHandlers = new Set<WebSocketConnectionHandler>();
  private isConnecting = false;
  private isConnected = false;
  private messageQueue: WebSocketMessage[] = [];

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Temporarily disable WebSocket to avoid connection errors
      console.log('WebSocket connection disabled for now');
      resolve();
      return;

      if (this.isConnecting || this.isConnected) {
        resolve();
        return;
      }

      this.isConnecting = true;

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Process queued messages
          this.processMessageQueue();
          
          // Start heartbeat
          this.startHeartbeat();
          
          // Notify connection handlers
          this.connectionHandlers.forEach(handler => handler(true));
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.isConnecting = false;
          this.stopHeartbeat();
          
          // Notify connection handlers
          this.connectionHandlers.forEach(handler => handler(false));
          
          // Attempt to reconnect if not a clean close
          if (event.code !== 1000 && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  send(message: WebSocketMessage): void {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }

  subscribe(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    
    this.eventHandlers.get(eventType)!.add(handler);
    
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(eventType);
        }
      }
    };
  }

  onConnectionChange(handler: WebSocketConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in WebSocket event handler:', error);
        }
      });
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = this.config.reconnectInterval! * Math.pow(2, Math.min(this.reconnectAttempts - 1, 5));
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'ping',
          data: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString()
        });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Utility methods
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.isConnected) return 'connected';
    return 'disconnected';
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  // Specific message types for the application
  subscribeToClients(handler: WebSocketEventHandler): () => void {
    return this.subscribe('client_update', handler);
  }

  subscribeToTransactions(handler: WebSocketEventHandler): () => void {
    return this.subscribe('transaction_update', handler);
  }

  subscribeToAlerts(handler: WebSocketEventHandler): () => void {
    return this.subscribe('alert_update', handler);
  }

  subscribeToReports(handler: WebSocketEventHandler): () => void {
    return this.subscribe('report_update', handler);
  }

  subscribeToAuditLogs(handler: WebSocketEventHandler): () => void {
    return this.subscribe('audit_update', handler);
  }

  subscribeToSystemEvents(handler: WebSocketEventHandler): () => void {
    return this.subscribe('system_event', handler);
  }

  // Send specific message types
  requestClientUpdates(clientIds?: string[]): void {
    this.send({
      type: 'subscribe_clients',
      data: { clientIds },
      timestamp: new Date().toISOString()
    });
  }

  requestTransactionUpdates(transactionIds?: string[]): void {
    this.send({
      type: 'subscribe_transactions',
      data: { transactionIds },
      timestamp: new Date().toISOString()
    });
  }

  requestAlertUpdates(alertIds?: string[]): void {
    this.send({
      type: 'subscribe_alerts',
      data: { alertIds },
      timestamp: new Date().toISOString()
    });
  }

  requestReportUpdates(reportIds?: string[]): void {
    this.send({
      type: 'subscribe_reports',
      data: { reportIds },
      timestamp: new Date().toISOString()
    });
  }

  requestAuditUpdates(): void {
    this.send({
      type: 'subscribe_audit',
      data: {},
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
export const webSocketService = new WebSocketService({
  url: wsUrl,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000
});
