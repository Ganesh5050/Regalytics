import { useState, useCallback } from 'react';

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationData = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount,
  };
}
