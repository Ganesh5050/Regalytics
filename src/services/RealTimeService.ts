// Real-time service using Socket.IO for live data updates
import { io, Socket } from 'socket.io-client';

export interface RealTimeData {
  timestamp: string;
  clients: any[];
  transactions: any[];
  alerts: any[];
  reports: any[];
}

export interface RealTimeEventHandler {
  (data: any): void;
}

class RealTimeService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private eventHandlers = new Map<string, Set<RealTimeEventHandler>>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      this.socket.on('connect', () => {
        console.log('🔄 Real-time connection established');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection', { connected: true });
      });

      this.socket.on('data-update', (data: RealTimeData) => {
        console.log('📡 Real-time data update received:', data);
        this.emit('data-update', data);
      });

      this.socket.on('new-client', (data: any) => {
        console.log('👤 New client received:', data);
        this.emit('new-client', data);
      });

      this.socket.on('new-transaction', (data: any) => {
        console.log('💰 New transaction received:', data);
        this.emit('new-transaction', data);
      });

      this.socket.on('new-alert', (data: any) => {
        console.log('🚨 New alert received:', data);
        this.emit('new-alert', data);
      });

      this.socket.on('disconnect', (reason: string) => {
        console.log('❌ Real-time connection lost:', reason);
        this.isConnected = false;
        this.emit('connection', { connected: false });
        this.attemptReconnect();
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('❌ Real-time connection error:', error);
        this.emit('connection', { connected: false, error });
      });

    } catch (error) {
      console.error('❌ Failed to initialize real-time connection:', error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect();
      }
    }, delay);
  }

  public subscribe(event: string, handler: RealTimeEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event)!.add(handler);
    
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(event);
        }
      }
    };
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in real-time event handler:', error);
        }
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.eventHandlers.clear();
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Specific subscription methods
  public onDataUpdate(handler: (data: RealTimeData) => void): () => void {
    return this.subscribe('data-update', handler);
  }

  public onNewClient(handler: (client: any) => void): () => void {
    return this.subscribe('new-client', handler);
  }

  public onNewTransaction(handler: (transaction: any) => void): () => void {
    return this.subscribe('new-transaction', handler);
  }

  public onNewAlert(handler: (alert: any) => void): () => void {
    return this.subscribe('new-alert', handler);
  }

  public onConnectionChange(handler: (status: { connected: boolean; error?: any }) => void): () => void {
    return this.subscribe('connection', handler);
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();
