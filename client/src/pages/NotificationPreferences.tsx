import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const NOTIFICATION_TYPES = [
  { id: "photo_approved", label: "Photo Approved", description: "When your community photo is approved" },
  { id: "photo_rejected", label: "Photo Rejected", description: "When your community photo is rejected" },
  { id: "route_verified", label: "Route Verified", description: "When a Swiss route you submitted is verified" },
  { id: "testimonial_approved", label: "Testimonial Approved", description: "When your testimonial is published" },
  { id: "new_routes", label: "New Routes", description: "When new verified routes are added" },
  { id: "community_updates", label: "Community Updates", description: "General community announcements" },
];

export default function NotificationPreferences() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: preferences, isLoading } = trpc.notifications.getPreferences.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const updatePreferencesMutation = trpc.notifications.updatePreferences.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to manage notifications</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const handleToggle = (notificationType: string) => {
    if (!preferences) return;
    const currentPrefs = preferences as any;
    const newPrefs = {
      ...currentPrefs,
      [notificationType]: !currentPrefs[notificationType],
    };
    updatePreferencesMutation.mutate(newPrefs);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
          <p className="text-gray-600 mt-2">
            Manage how you receive notifications about community activity and updates.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Choose which notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {NOTIFICATION_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(type.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences && (preferences as any)[type.id]
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences && (preferences as any)[type.id]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
