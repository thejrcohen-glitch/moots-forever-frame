import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, CheckCircle2, AlertCircle, Mail, Users, Image, Zap, Send } from "lucide-react";
import { toast } from "sonner";

export function NotificationCenter() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({
    type: "admin_message",
    title: "",
    message: "",
    territory: "ALL",
  });

  // Fetch notifications
  const { data: notifications = [], refetch } = trpc.notification.list.useQuery({
    type: selectedType as any,
    territory: selectedTerritory as any,
    limit: 100,
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = trpc.notification.unreadCount.useQuery();

  // Mark as read mutation
  const markAsReadMutation = trpc.notification.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  // Delete mutation
  const deleteMutation = trpc.notification.delete.useMutation({
    onSuccess: () => refetch(),
  });

  // Create notification mutation
  const createMutation = trpc.notification.create.useMutation({
    onSuccess: () => {
      toast.success("Notification sent!");
      setComposeForm({ type: "admin_message", title: "", message: "", territory: "ALL" });
      setShowCompose(false);
      refetch();
    },
    onError: () => toast.error("Failed to send notification"),
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ id });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id });
  };

  const handleCompose = () => {
    if (!composeForm.title || !composeForm.message) {
      toast.error("Please fill in title and message");
      return;
    }
    createMutation.mutate({
      type: composeForm.type as any,
      title: composeForm.title,
      message: composeForm.message,
      territory: composeForm.territory as any,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rsvp":
        return <Users className="w-4 h-4" />;
      case "booking":
        return <Calendar className="w-4 h-4" />;
      case "community_upload":
        return <Image className="w-4 h-4" />;
      case "lead":
        return <Zap className="w-4 h-4" />;
      case "admin_message":
        return <Mail className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, " ").toUpperCase();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "rsvp":
        return "bg-blue-500/10 text-blue-700";
      case "booking":
        return "bg-purple-500/10 text-purple-700";
      case "community_upload":
        return "bg-green-500/10 text-green-700";
      case "lead":
        return "bg-orange-500/10 text-orange-700";
      case "admin_message":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with unread badge */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-block px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button onClick={() => setShowCompose(!showCompose)} variant="default" className="gap-2">
          <Send className="w-4 h-4" />
          {showCompose ? "Cancel" : "Compose"}
        </Button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <Card className="p-6 space-y-4 bg-blue-50/5 border-blue-500/20">
          <h3 className="font-semibold">Send Custom Notification</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={composeForm.type}
                onChange={(e) => setComposeForm({ ...composeForm, type: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value="admin_message">Admin Message</option>
                <option value="event_reminder">Event Reminder</option>
                <option value="dealer_announcement">Dealer Announcement</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Territory</label>
              <select
                value={composeForm.territory}
                onChange={(e) => setComposeForm({ ...composeForm, territory: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value="ALL">All Territories</option>
                <option value="TX">Texas</option>
                <option value="OK">Oklahoma</option>
                <option value="AR">Arkansas</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={composeForm.title}
                onChange={(e) => setComposeForm({ ...composeForm, title: e.target.value })}
                placeholder="Notification title"
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={composeForm.message}
                onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                placeholder="Notification message"
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background h-24"
              />
            </div>
            <Button
              onClick={handleCompose}
              disabled={!composeForm.title || !composeForm.message || createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => setSelectedType(null)}
          size="sm"
        >
          All Types
        </Button>
        {["rsvp", "booking", "community_upload", "lead", "admin_message"].map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type)}
            size="sm"
          >
            {getTypeLabel(type)}
          </Button>
        ))}

        <div className="w-full border-t my-2" />

        <Button
          variant={selectedTerritory === null ? "default" : "outline"}
          onClick={() => setSelectedTerritory(null)}
          size="sm"
        >
          All Territories
        </Button>
        {["TX", "OK", "AR", "ALL"].map((territory) => (
          <Button
            key={territory}
            variant={selectedTerritory === territory ? "default" : "outline"}
            onClick={() => setSelectedTerritory(territory)}
            size="sm"
          >
            {territory}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <p>No notifications to display</p>
          </Card>
        ) : (
          notifications.map((notification: any) => (
            <Card
              key={notification.id}
              className={`p-4 flex items-start justify-between gap-4 ${
                notification.readAt ? "opacity-60" : "border-blue-500/50 bg-blue-50/5"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                    {getTypeLabel(notification.type)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notification.territory !== "ALL" && `[${notification.territory}]`}
                  </span>
                </div>
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {!notification.readAt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(notification.id)}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Calendar icon component (not imported from lucide)
function Calendar(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
