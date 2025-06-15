import { useState } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeBookings } from "@/hooks/useRealtimeBookings";
import { supabase } from "@/integrations/supabase/client";

const notificationIcons = {
  'info': Info,
  'success': CheckCircle,
  'warning': AlertCircle,
  'error': AlertCircle,
  'update': Clock,
};

const notificationColors = {
  'info': 'text-blue-500',
  'success': 'text-green-500', 
  'warning': 'text-yellow-500',
  'error': 'text-red-500',
  'update': 'text-primary',
};

export function RealtimeNotifications() {
  const { notifications, getUnreadNotificationsCount } = useRealtimeBookings();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = getUnreadNotificationsCount();

  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(notif => notif.status === 'pending')
      .map(notif => notif.id);

    if (unreadIds.length > 0) {
      await supabase
        .from('notifications')
        .update({ status: 'read' })
        .in('id', unreadIds);
    }
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-card/90"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 max-h-96 shadow-2xl animate-slide-in-right border-primary/20 bg-card/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-display">
                Live Notifications
              </CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-6 px-2"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;
                    const iconColor = notificationColors[notification.type as keyof typeof notificationColors] || 'text-muted-foreground';
                    const isUnread = notification.status === 'pending';

                    return (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group ${
                          isUnread ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => isUnread && markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${iconColor}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-sm font-medium truncate ${
                                isUnread ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </p>
                              {isUnread && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}