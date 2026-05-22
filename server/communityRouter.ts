import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { communityPhotos, photoTags } from "../drizzle/schema";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { sendEmail, communityUploadAcknowledgmentEmail } from "./_core/email";

export const communityRouter = router({
  // List all approved photos, optionally filtered by territory (with tags)
  list: publicProcedure
    .input(
      z.object({
        territory: z.enum(["TX", "OK", "AR", "CH", "ALL"]).optional().default("ALL"),
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
                eq(communityPhotos.territory, input.territory as "TX" | "OK" | "AR" | "CH"),
                eq(communityPhotos.approved, "approved")
              )
        )
        .orderBy(desc(communityPhotos.createdAt))
        .limit(100);

      // Fetch tags for each photo
      const photosWithTags = await Promise.all(
        rows.map(async (photo) => {
          const tags = await db
            .select({ tagName: photoTags.tagName })
            .from(photoTags)
            .where(eq(photoTags.photoId, photo.id));
          return {
            ...photo,
            tags: tags.map((t) => t.tagName),
          };
        })
      );

      return photosWithTags;
    }),

  // Upload a new community photo
  upload: publicProcedure
    .input(
      z.object({
        riderName: z.string().min(1).max(128),
        territory: z.enum(["TX", "OK", "AR", "CH"]),
        location: z.string().min(1).max(256),
        venue: z.string().max(256).optional(),
        mootsModel: z.string().max(128).optional(),
        caption: z.string().max(500).optional(),
        email: z.string().email().optional(), // Optional — for acknowledgment email
        tags: z.array(z.string()).optional(), // Photo tags (e.g., "bikepacking", "coffee_stop")
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

      // Save metadata to database
      const result = await db.insert(communityPhotos).values({
        riderName: input.riderName,
        territory: input.territory,
        location: input.location,
        venue: input.venue ?? null,
        mootsModel: input.mootsModel ?? null,
        caption: input.caption ?? null,
        imageUrl: url,
        imageKey: key,
        approved: "pending", // Requires admin moderation before appearing on the wall
      });

      // Get the inserted photo ID
      const photoId = (result as any).insertId || (result as any).lastInsertRowid;

      // Save tags if provided
      if (input.tags && input.tags.length > 0) {
        const { photoTags: photoTagsTable } = await import("../drizzle/schema");
        await db.insert(photoTagsTable).values(
          input.tags.map((tagName) => ({
            photoId: Number(photoId),
            tagName,
          }))
        );
      }

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
            territory: { TX: "Texas", OK: "Oklahoma", AR: "Arkansas", CH: "Switzerland" }[input.territory] ?? input.territory,
          }),
        }).catch(() => {/* non-blocking */});
      }

      return { success: true, url, photoId: Number(photoId) };
    }),
});
