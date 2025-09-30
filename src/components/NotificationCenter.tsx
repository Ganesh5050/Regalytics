import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function NotificationCenter() {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.slice(0, 3).map((notification) => {
        const Icon = iconMap[notification.type];
        
        return (
          <Card 
            key={notification.id}
            className={`glass-card border-border/50 shadow-large transition-all duration-300 ${
              notification.read ? 'opacity-70' : 'border-l-4 border-primary'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${
                  notification.type === 'success' ? 'text-success' :
                  notification.type === 'error' ? 'text-destructive' :
                  notification.type === 'warning' ? 'text-warning' :
                  'text-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted/50"
                  onClick={() => markAsRead(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {notifications.length > 3 && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-3 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full"
            >
              {isOpen ? 'Show Less' : `Show ${notifications.length - 3} More`}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {isOpen && notifications.slice(3).map((notification) => {
        const Icon = iconMap[notification.type];
        
        return (
          <Card 
            key={notification.id}
            className="glass-card border-border/50 shadow-large transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${
                  notification.type === 'success' ? 'text-success' :
                  notification.type === 'error' ? 'text-destructive' :
                  notification.type === 'warning' ? 'text-warning' :
                  'text-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted/50"
                  onClick={() => markAsRead(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
