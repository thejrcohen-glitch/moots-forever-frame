export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

// Canonical tag vocabulary for community photo submissions.
// Stored as JSON-encoded slug array in community_photos.tags. Kept here so
// frontend chips, the upload validator, and the list filter share one source.
export const COMMUNITY_PHOTO_TAGS = [
  { slug: "gravel", label: "Gravel" },
  { slug: "road", label: "Road" },
  { slug: "mountain", label: "Mountain" },
  { slug: "coffee", label: "Coffee Shop" },
  { slug: "sunrise", label: "Sunrise" },
  { slug: "sunset", label: "Sunset" },
  { slug: "group-ride", label: "Group Ride" },
  { slug: "solo", label: "Solo" },
  { slug: "trailhead", label: "Trailhead" },
  { slug: "race", label: "Race" },
] as const;

export type CommunityPhotoTagSlug = (typeof COMMUNITY_PHOTO_TAGS)[number]["slug"];
export const COMMUNITY_PHOTO_TAG_SLUGS = COMMUNITY_PHOTO_TAGS.map(t => t.slug) as readonly CommunityPhotoTagSlug[];
export const COMMUNITY_PHOTO_TAG_LABELS: Record<CommunityPhotoTagSlug, string> =
  Object.fromEntries(COMMUNITY_PHOTO_TAGS.map(t => [t.slug, t.label])) as Record<CommunityPhotoTagSlug, string>;
export const MAX_COMMUNITY_PHOTO_TAGS = 5;

// Canonical Moots model list shared between the upload form, the community
// wall model filter, and BikeModelsShowcase. The `name` is the user-facing
// label and is also what we store in community_photos.mootsModel — so the
// list filter compares against these strings directly.
export const MOOTS_MODELS = [
  { name: "Routt 45", category: "gravel" },
  { name: "Routt RSL", category: "gravel" },
  { name: "Vamoots RSL", category: "adventure" },
  { name: "Routt ESC", category: "adventure" },
  { name: "Routt Legacy", category: "legacy" },
  { name: "Vamoots Legacy", category: "legacy" },
] as const;

export type MootsModelName = (typeof MOOTS_MODELS)[number]["name"];
export const MOOTS_MODEL_NAMES = MOOTS_MODELS.map(m => m.name) as readonly MootsModelName[];

/** Parse the JSON-encoded tags column into a safe slug array (drops unknown values). */
export function parseCommunityPhotoTags(raw: string | null | undefined): CommunityPhotoTagSlug[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const allowed = new Set<string>(COMMUNITY_PHOTO_TAG_SLUGS);
    const seen = new Set<string>();
    const out: CommunityPhotoTagSlug[] = [];
    for (const v of parsed) {
      if (typeof v !== "string" || !allowed.has(v) || seen.has(v)) continue;
      seen.add(v);
      out.push(v as CommunityPhotoTagSlug);
    }
    return out;
  } catch {
    return [];
  }
}
