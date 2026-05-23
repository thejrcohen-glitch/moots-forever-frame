import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { communityPhotos } from "../drizzle/schema";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { sendEmail, communityUploadAcknowledgmentEmail } from "./_core/email";
import {
  COMMUNITY_PHOTO_TAG_SLUGS,
  MAX_COMMUNITY_PHOTO_TAGS,
  MOOTS_MODEL_NAMES,
  parseCommunityPhotoTags,
  type CommunityPhotoTagSlug,
  type MootsModelName,
} from "../shared/const";

const tagSlugSchema = z.enum(
  COMMUNITY_PHOTO_TAG_SLUGS as unknown as [CommunityPhotoTagSlug, ...CommunityPhotoTagSlug[]]
);

const mootsModelSchema = z.enum(
  MOOTS_MODEL_NAMES as unknown as [MootsModelName, ...MootsModelName[]]
);

// Project DB rows into a list-friendly shape with a decoded tags array. Keeps
// the existing row shape intact except tags is now an array of slugs (always
// present, possibly empty) instead of a raw JSON string.
function projectPhotoRow<T extends { tags: string | null }>(row: T): Omit<T, "tags"> & { tags: CommunityPhotoTagSlug[] } {
  const { tags, ...rest } = row;
  return { ...rest, tags: parseCommunityPhotoTags(tags) };
}

export const communityRouter = router({
  // List all approved photos, optionally filtered by territory, tags, and/or
  // bike models. Tag and model filters use OR-match semantics within a filter
  // and AND across filters (e.g. (gravel OR coffee) AND (Routt RSL OR Routt 45)).
  // Filtering happens in JS because tags are stored as a JSON string, not a
  // relational join — the result set is capped at 100 so this stays cheap.
  list: publicProcedure
    .input(
      z.object({
        territory: z.enum(["TX", "OK", "AR", "ALL"]).optional().default("ALL"),
        tags: z.array(tagSlugSchema).max(MAX_COMMUNITY_PHOTO_TAGS).optional(),
        models: z.array(mootsModelSchema).max(MOOTS_MODEL_NAMES.length).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Only return approved photos on the public wall
      const rows = await db
        .select()
        .from(communityPhotos)
        .where(
          input.territory === "ALL"
            ? eq(communityPhotos.approved, "approved")
            : and(
                eq(communityPhotos.territory, input.territory),
                eq(communityPhotos.approved, "approved")
              )
        )
        .orderBy(desc(communityPhotos.createdAt))
        .limit(100);

      const projected = rows.map(projectPhotoRow);
      
      // Apply tag filtering (OR-match)
      let filtered = projected;
      if (input.tags && input.tags.length > 0) {
        const wanted = new Set<string>(input.tags);
        filtered = filtered.filter(p => p.tags.some(t => wanted.has(t)));
      }
      
      // Apply model filtering (OR-match)
      if (input.models && input.models.length > 0) {
        const wantedModels = new Set<string>(input.models);
        filtered = filtered.filter(p => p.mootsModel && wantedModels.has(p.mootsModel));
      }
      
      return filtered;
    }),

  // Upload a new community photo
  upload: publicProcedure
    .input(
      z.object({
        riderName: z.string().min(1).max(128),
        territory: z.enum(["TX", "OK", "AR"]),
        location: z.string().min(1).max(256),
        venue: z.string().max(256).optional(),
        mootsModel: z.string().max(128).optional(),
        caption: z.string().max(500).optional(),
        email: z.string().email().optional(), // Optional — for acknowledgment email
        tags: z.array(tagSlugSchema).max(MAX_COMMUNITY_PHOTO_TAGS).optional(),
        // Base64-encoded image data with data URI prefix
        imageData: z.string().min(1),
        imageMimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Strip the data URI prefix and decode base64
      const base64Data = input.imageData.replace(/^data:[^;]+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Validate file size (max 8MB)
      if (imageBuffer.length > 8 * 1024 * 1024) {
        throw new Error("Image too large. Maximum size is 8MB.");
      }

      const ext = input.imageMimeType.split("/")[1];
      const relKey = `community/${input.territory.toLowerCase()}/${Date.now()}.${ext}`;

      // Upload to S3
      const { key, url } = await storagePut(relKey, imageBuffer, input.imageMimeType);

      // Dedupe + sort tags so storage shape is deterministic regardless of
      // client ordering. Empty array stored as null to match legacy rows.
      const normalizedTags = input.tags
        ? Array.from(new Set(input.tags)).sort()
        : [];
      const tagsColumn = normalizedTags.length > 0 ? JSON.stringify(normalizedTags) : null;

      // Save metadata to database
      await db.insert(communityPhotos).values({
        riderName: input.riderName,
        territory: input.territory,
        location: input.location,
        venue: input.venue ?? null,
        mootsModel: input.mootsModel ?? null,
        caption: input.caption ?? null,
        imageUrl: url,
        imageKey: key,
        tags: tagsColumn,
        approved: "pending", // Requires admin moderation before appearing on the wall
      });

      // Notify Ian that a new photo is waiting for moderation
      await notifyOwner({
        title: `📸 New Community Photo — ${input.riderName} (${input.territory})`,
        content: `${input.riderName} submitted a photo from ${input.location}${input.venue ? ` at ${input.venue}` : ""}${input.mootsModel ? ` riding a ${input.mootsModel}` : ""}. Review at /admin.`,
      }).catch(() => {/* non-blocking */});

      // Send acknowledgment email to uploader if they provided an email (non-blocking)
      if (input.email) {
        sendEmail({
          to: input.email,
          subject: `Photo Submitted — Moots Community Wall`,
          html: communityUploadAcknowledgmentEmail({
            riderName: input.riderName,
            territory: { TX: "Texas", OK: "Oklahoma", AR: "Arkansas" }[input.territory] ?? input.territory,
          }),
        }).catch(() => {/* non-blocking */});
      }

      return { success: true, url };
    }),
});
