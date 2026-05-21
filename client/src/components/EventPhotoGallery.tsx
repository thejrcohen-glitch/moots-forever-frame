import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, X, MapPin, Calendar } from "lucide-react";

interface EventPhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  eventName: string;
  eventDate: string;
  territory: string;
  tags: string[];
  uploadedBy?: string;
  moderationStatus: "approved" | "pending" | "rejected";
}

interface EventPhotoGalleryProps {
  photos?: EventPhoto[];
  onUploadClick?: () => void;
}

/**
 * Event Photo Gallery Component
 * 
 * Phase 1: Manual event photo structure with filtering by event/territory/tags.
 * Phase 2: Will integrate with community photo uploads and moderation workflow.
 */
export default function EventPhotoGallery({ photos = DEFAULT_PHOTOS, onUploadClick }: EventPhotoGalleryProps) {
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Get unique values for filters
  const territories = Array.from(new Set(photos.map((p) => p.territory)));
  const events = Array.from(new Set(photos.map((p) => p.eventName)));
  const allTags = Array.from(new Set(photos.flatMap((p) => p.tags)));

  // Filter photos
  const filteredPhotos = photos.filter((photo) => {
    const territoryMatch = selectedTerritories.length === 0 || selectedTerritories.includes(photo.territory);
    const eventMatch = !selectedEvent || photo.eventName === selectedEvent;
    const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => photo.tags.includes(tag));
    const statusMatch = photo.moderationStatus === "approved";

    return territoryMatch && eventMatch && tagMatch && statusMatch;
  });

  const toggleTerritory = (territory: string) => {
    setSelectedTerritories((prev) =>
      prev.includes(territory) ? prev.filter((t) => t !== territory) : [...prev, territory]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Event Photos</h2>
          <p className="text-gray-600 mb-6">
            Moments from Moots pop-ups, rides, and races. Tag your photos to help the community discover events in your region.
          </p>
          <Button onClick={onUploadClick} className="mb-6">
            Upload Your Photo
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-white rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h3 className="font-semibold">Filter Photos</h3>
          </div>

          {/* Territory Filter */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 block">Territory</label>
            <div className="flex flex-wrap gap-2">
              {territories.map((territory) => (
                <button
                  key={territory}
                  onClick={() => toggleTerritory(territory)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedTerritories.includes(territory)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {territory}
                </button>
              ))}
            </div>
          </div>

          {/* Event Filter */}
          <div className="mb-6">
            <label className="text-sm font-semibold mb-3 block">Event</label>
            <select
              value={selectedEvent || ""}
              onChange={(e) => setSelectedEvent(e.target.value || null)}
              className="w-full max-w-xs px-4 py-2 border rounded-lg"
            >
              <option value="">All Events</option>
              {events.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded text-xs transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-amber-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedTerritories.length > 0 || selectedTags.length > 0 || selectedEvent) && (
            <button
              onClick={() => {
                setSelectedTerritories([]);
                setSelectedTags([]);
                setSelectedEvent(null);
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-200">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || photo.eventName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Event Info */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-sm mb-2">{photo.eventName}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {photo.eventDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {photo.territory}
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  {photo.caption && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{photo.caption}</p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Uploaded By */}
                  {photo.uploadedBy && (
                    <p className="text-xs text-gray-500 mt-3">by {photo.uploadedBy}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No photos match your filters.</p>
            <Button variant="outline" onClick={() => setSelectedTerritories([])}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Result Count */}
        <div className="text-center mt-8 text-sm text-gray-600">
          Showing {filteredPhotos.length} of {photos.length} photos
        </div>
      </div>
    </div>
  );
}

// Phase 1: Manual event photo data
const DEFAULT_PHOTOS: EventPhoto[] = [
  {
    id: "event_001",
    imageUrl: "https://via.placeholder.com/400x400?text=Bentonville+Pop-Up",
    caption: "Riders gathering at Coler Mountain Bike Preserve before the Bentonville pop-up.",
    eventName: "Moots Bentonville Pop-Up",
    eventDate: "2026-04-15",
    territory: "AR",
    tags: ["badge_event_photo", "ride_style_adventure"],
    uploadedBy: "Sarah M.",
    moderationStatus: "approved",
  },
  {
    id: "event_002",
    imageUrl: "https://via.placeholder.com/400x400?text=Austin+Gravel+Race",
    caption: "Titanium frames lined up at the start line of the Austin Gravel Classic.",
    eventName: "Austin Gravel Classic",
    eventDate: "2026-03-22",
    territory: "TX",
    tags: ["badge_event_photo", "ride_style_race", "terrain_limestone"],
    uploadedBy: "Marcus C.",
    moderationStatus: "approved",
  },
  {
    id: "event_003",
    imageUrl: "https://via.placeholder.com/400x400?text=OKC+Sunrise+Ride",
    caption: "Golden hour on the Midtown OKC gravel trails.",
    eventName: "OKC Sunrise Ride",
    eventDate: "2026-05-10",
    territory: "OK",
    tags: ["badge_event_photo", "ride_style_day_ride"],
    uploadedBy: "James P.",
    moderationStatus: "approved",
  },
  {
    id: "event_004",
    imageUrl: "https://via.placeholder.com/400x400?text=Bikepacking+Setup",
    caption: "Fully loaded Routt RSL ready for a multi-day adventure.",
    eventName: "Moots Bentonville Pop-Up",
    eventDate: "2026-04-15",
    territory: "AR",
    tags: ["badge_fully_loaded", "ride_style_bikepacking"],
    uploadedBy: "Elena R.",
    moderationStatus: "approved",
  },
  {
    id: "event_005",
    imageUrl: "https://via.placeholder.com/400x400?text=Titanium+vs+Texture",
    caption: "Polished titanium against the raw limestone of the Jura.",
    eventName: "Swiss Gravel Explorer",
    eventDate: "2026-06-01",
    territory: "CH",
    tags: ["badge_titanium_vs_texture", "terrain_limestone"],
    uploadedBy: "Marco L.",
    moderationStatus: "approved",
  },
  {
    id: "event_006",
    imageUrl: "https://via.placeholder.com/400x400?text=Pass+Sign+Trophy",
    caption: "2,328m elevation at the Bernina Pass.",
    eventName: "Swiss Gravel Explorer",
    eventDate: "2026-06-01",
    territory: "CH",
    tags: ["badge_pass_sign", "terrain_high_alpine"],
    uploadedBy: "Anna S.",
    moderationStatus: "approved",
  },
];
