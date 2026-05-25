import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, X, Check, AlertCircle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications, isLoading, refetch } = trpc.notifications.list.useQuery(
    { limit: 10 },
    { enabled: isAuthenticated }
  );

  const { data: unreadCount } = trpc.notifications.unreadCount.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, refetch]);

  if (!isAuthenticated) return null;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ id });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "success":
        return <Check className="w-4 h-4 text-green-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount && unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full" />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification: any) => (
                  <div
                    key={Number(notification.id)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>

          {notifications && notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <a href="/notifications">View all notifications</a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
