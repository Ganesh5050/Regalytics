import { useEffect, useState } from 'react';
import { realTimeService, RealTimeData } from '@/services/RealTimeService';

export function useRealTimeData() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [data, setData] = useState<RealTimeData | null>(null);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribeConnection = realTimeService.onConnectionChange((status) => {
      setIsConnected(status.connected);
    });

    // Subscribe to data updates
    const unsubscribeData = realTimeService.onDataUpdate((newData) => {
      setData(newData);
      setLastUpdate(new Date());
    });

    // Subscribe to new clients
    const unsubscribeNewClient = realTimeService.onNewClient((client) => {
      console.log('New client added:', client);
      // Trigger a refresh of client data
      setLastUpdate(new Date());
    });

    // Subscribe to new transactions
    const unsubscribeNewTransaction = realTimeService.onNewTransaction((transaction) => {
      console.log('New transaction added:', transaction);
      // Trigger a refresh of transaction data
      setLastUpdate(new Date());
    });

    // Subscribe to new alerts
    const unsubscribeNewAlert = realTimeService.onNewAlert((alert) => {
      console.log('New alert added:', alert);
      // Trigger a refresh of alert data
      setLastUpdate(new Date());
    });

    return () => {
      unsubscribeConnection();
      unsubscribeData();
      unsubscribeNewClient();
      unsubscribeNewTransaction();
      unsubscribeNewAlert();
    };
  }, []);

  return {
    isConnected,
    lastUpdate,
    data,
    connectionStatus: isConnected ? 'connected' : 'disconnected'
  };
}

export function useRealTimeConnection() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = realTimeService.onConnectionChange((status) => {
      setIsConnected(status.connected);
    });

    return unsubscribe;
  }, []);

  return {
    isConnected,
    connectionStatus: isConnected ? 'connected' : 'disconnected'
  };
}