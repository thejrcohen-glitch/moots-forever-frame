import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Edit2 } from "lucide-react";

interface VerifiableItem {
  id: string;
  title: string;
  type: "route" | "photo";
  verificationStatus: "draft" | "verified" | "featured";
  moderationStatus?: "pending" | "approved" | "rejected";
  sourceType?: "editorial" | "official" | "community";
  sourceUrl?: string;
  lastVerifiedAt?: string;
  published: boolean;
}

interface AdminVerificationPanelProps {
  items?: VerifiableItem[];
  onStatusChange?: (itemId: string, newStatus: VerifiableItem["verificationStatus"]) => void;
  onPublishToggle?: (itemId: string, published: boolean) => void;
}

/**
 * Admin Verification Framework Stub
 * 
 * Phase 1: Lightweight verification status display and state handling.
 * - Display verification/moderation status
 * - Toggle published/unpublished
 * - Update verification status (draft → verified → featured)
 * - Show source tracking
 * 
 * Phase 2: Will add full admin dashboard with bulk actions, filtering, and workflows.
 */
export default function AdminVerificationPanel({
  items = DEFAULT_ITEMS,
  onStatusChange,
  onPublishToggle,
}: AdminVerificationPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "route" | "photo">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "verified" | "featured">("all");

  const filteredItems = items.filter((item) => {
    const typeMatch = filterType === "all" || item.type === filterType;
    const statusMatch = filterStatus === "all" || item.verificationStatus === filterStatus;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return "bg-green-100 text-green-800";
      case "featured":
        return "bg-blue-100 text-blue-800";
      case "draft":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "featured":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Verification Framework</h2>
        <p className="text-gray-600 text-sm">
          Manage verification status, moderation, and publishing for routes and photos.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="text-sm font-semibold mb-2 block">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Items</option>
            <option value="route">Routes</option>
            <option value="photo">Photos</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="verified">Verified</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-4">
              {/* Header Row */}
              <div
                className="flex items-start justify-between cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold uppercase px-2 py-1 bg-gray-100 rounded">
                      {item.type}
                    </span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.verificationStatus)}`}>
                      {getStatusIcon(item.verificationStatus)}
                      {item.verificationStatus}
                    </div>

                    {item.moderationStatus && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.moderationStatus)}`}>
                        {getStatusIcon(item.moderationStatus)}
                        {item.moderationStatus}
                      </div>
                    )}

                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${item.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {item.published ? "Published" : "Unpublished"}
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <div className="text-gray-400">
                  {expandedId === item.id ? "▼" : "▶"}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === item.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Source Info */}
                  {item.sourceType && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Source</p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold">Type:</span> {item.sourceType}
                        </p>
                        {item.sourceUrl && (
                          <p>
                            <span className="font-semibold">URL:</span>{" "}
                            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                              {item.sourceUrl}
                            </a>
                          </p>
                        )}
                        {item.lastVerifiedAt && (
                          <p>
                            <span className="font-semibold">Last Verified:</span> {item.lastVerifiedAt}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {/* Verification Status Buttons */}
                    {item.type === "route" && (
                      <>
                        <Button
                          size="sm"
                          variant={item.verificationStatus === "draft" ? "default" : "outline"}
                          onClick={() => onStatusChange?.(item.id, "draft")}
                        >
                          Draft
                        </Button>
                        <Button
                          size="sm"
                          variant={item.verificationStatus === "verified" ? "default" : "outline"}
                          onClick={() => onStatusChange?.(item.id, "verified")}
                        >
                          Verified
                        </Button>
                        <Button
                          size="sm"
                          variant={item.verificationStatus === "featured" ? "default" : "outline"}
                          onClick={() => onStatusChange?.(item.id, "featured")}
                        >
                          Featured
                        </Button>
                      </>
                    )}

                    {/* Publish Toggle */}
                    <Button
                      size="sm"
                      variant={item.published ? "default" : "outline"}
                      onClick={() => onPublishToggle?.(item.id, !item.published)}
                    >
                      {item.published ? "Unpublish" : "Publish"}
                    </Button>

                    {/* Edit Button (placeholder for Phase 2) */}
                    <Button size="sm" variant="ghost" disabled>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit (Phase 2)
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <p className="font-semibold mb-1">Verification Rules</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Draft: Not ready for publishing</li>
                      <li>Verified: Checked against source</li>
                      <li>Featured: Verified and approved for prominent display</li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>No items match your filters.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 rounded-lg text-sm">
        <p className="text-gray-600">
          <span className="font-semibold">{filteredItems.length}</span> items shown
          {filteredItems.filter((i) => i.published).length > 0 && (
            <>
              {" "}
              • <span className="font-semibold">{filteredItems.filter((i) => i.published).length}</span> published
            </>
          )}
          {filteredItems.filter((i) => i.verificationStatus === "verified" || i.verificationStatus === "featured").length > 0 && (
            <>
              {" "}
              • <span className="font-semibold">{filteredItems.filter((i) => i.verificationStatus === "verified" || i.verificationStatus === "featured").length}</span> verified
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// Phase 1: Default verification items for demo
const DEFAULT_ITEMS: VerifiableItem[] = [
  {
    id: "route_001",
    title: "The Tremola Climb (Gotthard Pass)",
    type: "route",
    verificationStatus: "draft",
    sourceType: "editorial",
    sourceUrl: "https://cyclingthread.com/cycling-switzerland-5-most-beautiful-swiss-cycle-routes-2026",
    published: false,
  },
  {
    id: "route_002",
    title: "Gravel Trans Jura Range",
    type: "route",
    verificationStatus: "verified",
    sourceType: "official",
    sourceUrl: "https://www.switzerlandmobility.ch",
    lastVerifiedAt: "2026-05-18",
    published: true,
  },
  {
    id: "route_003",
    title: "Bernina Express Route",
    type: "route",
    verificationStatus: "draft",
    sourceType: "editorial",
    sourceUrl: "https://cyclingthread.com",
    published: false,
  },
  {
    id: "photo_001",
    title: "Bentonville Pop-Up Event Photo",
    type: "photo",
    verificationStatus: "verified",
    moderationStatus: "approved",
    published: true,
  },
  {
    id: "photo_002",
    title: "Austin Gravel Classic Riders",
    type: "photo",
    verificationStatus: "draft",
    moderationStatus: "pending",
    published: false,
  },
  {
    id: "photo_003",
    title: "Bikepacking Setup",
    type: "photo",
    verificationStatus: "featured",
    moderationStatus: "approved",
    published: true,
  },
];
