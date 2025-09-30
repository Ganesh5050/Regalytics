import { useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useNotifications } from './useNotifications';
import { WebSocketMessage } from '@/services/WebSocketService';

export interface RealTimeUpdateOptions {
  enableNotifications?: boolean;
  enableSound?: boolean;
  enableDesktopNotifications?: boolean;
}

export function useRealTimeUpdates(options: RealTimeUpdateOptions = {}) {
  const {
    enableNotifications = true,
    enableSound = false,
    enableDesktopNotifications = false
  } = options;

  const { addNotification } = useNotifications();
  const { isConnected, subscribe } = useWebSocket();
  const lastUpdateRef = useRef<{ [key: string]: number }>({});

  // Helper function to check if we should show notification
  const shouldShowNotification = useCallback((messageType: string, timestamp: string) => {
    const lastUpdate = lastUpdateRef.current[messageType] || 0;
    const messageTime = new Date(timestamp).getTime();
    
    // Only show notification if this is a new message (not a reconnection replay)
    if (messageTime > lastUpdate) {
      lastUpdateRef.current[messageType] = messageTime;
      return true;
    }
    
    return false;
  }, []);

  // Helper function to play notification sound
  const playNotificationSound = useCallback(() => {
    if (enableSound) {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(console.error);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }, [enableSound]);

  // Helper function to show desktop notification
  const showDesktopNotification = useCallback((title: string, message: string) => {
    if (enableDesktopNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: 'regalytics-notification'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              body: message,
              icon: '/favicon.ico',
              tag: 'regalytics-notification'
            });
          }
        });
      }
    }
  }, [enableDesktopNotifications]);

  // Client updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('client_update', (message: WebSocketMessage) => {
      if (!shouldShowNotification('client_update', message.timestamp)) return;

      const { data } = message;
      const notificationTitle = 'Client Update';
      let notificationMessage = '';

      switch (data.action) {
        case 'created':
          notificationMessage = `New client "${data.client.name}" has been added`;
          break;
        case 'updated':
          notificationMessage = `Client "${data.client.name}" has been updated`;
          break;
        case 'kyc_completed':
          notificationMessage = `KYC completed for client "${data.client.name}"`;
          break;
        case 'risk_updated':
          notificationMessage = `Risk score updated for client "${data.client.name}"`;
          break;
        default:
          notificationMessage = `Client "${data.client.name}" has been updated`;
      }

      if (enableNotifications) {
        addNotification({
          type: 'info',
          title: notificationTitle,
          message: notificationMessage
        });
      }

      playNotificationSound();
      showDesktopNotification(notificationTitle, notificationMessage);
    });

    return unsubscribe;
  }, [isConnected, subscribe, shouldShowNotification, enableNotifications, addNotification, playNotificationSound, showDesktopNotification]);

  // Transaction updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('transaction_update', (message: WebSocketMessage) => {
      if (!shouldShowNotification('transaction_update', message.timestamp)) return;

      const { data } = message;
      const notificationTitle = 'Transaction Update';
      let notificationMessage = '';

      switch (data.action) {
        case 'created':
          notificationMessage = `New transaction of ₹${data.transaction.amount} has been processed`;
          break;
        case 'flagged':
          notificationMessage = `Transaction of ₹${data.transaction.amount} has been flagged for review`;
          break;
        case 'cleared':
          notificationMessage = `Transaction of ₹${data.transaction.amount} has been cleared`;
          break;
        case 'rejected':
          notificationMessage = `Transaction of ₹${data.transaction.amount} has been rejected`;
          break;
        default:
          notificationMessage = `Transaction of ₹${data.transaction.amount} has been updated`;
      }

      if (enableNotifications) {
        addNotification({
          type: data.action === 'flagged' ? 'warning' : 'info',
          title: notificationTitle,
          message: notificationMessage
        });
      }

      playNotificationSound();
      showDesktopNotification(notificationTitle, notificationMessage);
    });

    return unsubscribe;
  }, [isConnected, subscribe, shouldShowNotification, enableNotifications, addNotification, playNotificationSound, showDesktopNotification]);

  // Alert updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('alert_update', (message: WebSocketMessage) => {
      if (!shouldShowNotification('alert_update', message.timestamp)) return;

      const { data } = message;
      const notificationTitle = 'Alert Update';
      let notificationMessage = '';
      let notificationType: 'info' | 'warning' | 'error' = 'info';

      switch (data.action) {
        case 'created':
          notificationMessage = `New ${data.alert.severity.toLowerCase()} alert: ${data.alert.title}`;
          notificationType = data.alert.severity === 'HIGH' || data.alert.severity === 'CRITICAL' ? 'error' : 'warning';
          break;
        case 'assigned':
          notificationMessage = `Alert "${data.alert.title}" has been assigned to you`;
          notificationType = 'info';
          break;
        case 'escalated':
          notificationMessage = `Alert "${data.alert.title}" has been escalated`;
          notificationType = 'warning';
          break;
        case 'resolved':
          notificationMessage = `Alert "${data.alert.title}" has been resolved`;
          notificationType = 'info';
          break;
        default:
          notificationMessage = `Alert "${data.alert.title}" has been updated`;
      }

      if (enableNotifications) {
        addNotification({
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage
        });
      }

      playNotificationSound();
      showDesktopNotification(notificationTitle, notificationMessage);
    });

    return unsubscribe;
  }, [isConnected, subscribe, shouldShowNotification, enableNotifications, addNotification, playNotificationSound, showDesktopNotification]);

  // Report updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('report_update', (message: WebSocketMessage) => {
      if (!shouldShowNotification('report_update', message.timestamp)) return;

      const { data } = message;
      const notificationTitle = 'Report Update';
      let notificationMessage = '';

      switch (data.action) {
        case 'generated':
          notificationMessage = `Report "${data.report.name}" has been generated successfully`;
          break;
        case 'failed':
          notificationMessage = `Report "${data.report.name}" generation failed`;
          break;
        case 'scheduled':
          notificationMessage = `Report "${data.report.name}" has been scheduled`;
          break;
        default:
          notificationMessage = `Report "${data.report.name}" has been updated`;
      }

      if (enableNotifications) {
        addNotification({
          type: data.action === 'failed' ? 'error' : 'info',
          title: notificationTitle,
          message: notificationMessage
        });
      }

      playNotificationSound();
      showDesktopNotification(notificationTitle, notificationMessage);
    });

    return unsubscribe;
  }, [isConnected, subscribe, shouldShowNotification, enableNotifications, addNotification, playNotificationSound, showDesktopNotification]);

  // System events
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('system_event', (message: WebSocketMessage) => {
      if (!shouldShowNotification('system_event', message.timestamp)) return;

      const { data } = message;
      const notificationTitle = 'System Event';
      let notificationMessage = '';
      let notificationType: 'info' | 'warning' | 'error' = 'info';

      switch (data.event) {
        case 'maintenance_scheduled':
          notificationMessage = `System maintenance scheduled for ${data.scheduledTime}`;
          notificationType = 'warning';
          break;
        case 'maintenance_started':
          notificationMessage = 'System maintenance has started';
          notificationType = 'warning';
          break;
        case 'maintenance_completed':
          notificationMessage = 'System maintenance has been completed';
          notificationType = 'info';
          break;
        case 'security_breach':
          notificationMessage = 'Security breach detected - immediate action required';
          notificationType = 'error';
          break;
        case 'backup_completed':
          notificationMessage = 'System backup completed successfully';
          notificationType = 'info';
          break;
        case 'backup_failed':
          notificationMessage = 'System backup failed - please check logs';
          notificationType = 'error';
          break;
        default:
          notificationMessage = data.message || 'System event occurred';
      }

      if (enableNotifications) {
        addNotification({
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage
        });
      }

      playNotificationSound();
      showDesktopNotification(notificationTitle, notificationMessage);
    });

    return unsubscribe;
  }, [isConnected, subscribe, shouldShowNotification, enableNotifications, addNotification, playNotificationSound, showDesktopNotification]);

  // Request permission for desktop notifications on mount
  useEffect(() => {
    if (enableDesktopNotifications && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enableDesktopNotifications]);

  return {
    isConnected,
    lastUpdate: lastUpdateRef.current
  };
}
