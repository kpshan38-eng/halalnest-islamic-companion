import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

export const NotificationBar = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add welcome notification
    const welcomeNotification: Notification = {
      id: '1',
      title: 'Welcome to HalalNest',
      message: 'Your comprehensive Islamic companion is ready to use!',
      type: 'success',
      timestamp: new Date(),
    };
    
    setNotifications([welcomeNotification]);
    setIsVisible(true);

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length <= 1) {
      setIsVisible(false);
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm space-y-2 animate-slide-in-right">
      {notifications.map((notification) => (
        <Card 
          key={notification.id}
          className="p-4 shadow-elegant border-l-4 border-l-primary bg-card/95 backdrop-blur-sm animate-fade-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-islamic flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-primary">
                  {notification.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground/70 mt-1 block">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};