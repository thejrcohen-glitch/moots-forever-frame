import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { communityPhotos } from "../drizzle/schema";
import { storagePut } from "./storage";
import { getDb } from "./db";
import { publicProcedure, router } from "./_core/trpc";

export const communityRouter = router({
  // List all approved photos, optionally filtered by territory
  list: publicProcedure
    .input(
      z.object({
        territory: z.enum(["TX", "OK", "AR", "ALL"]).optional().default("ALL"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select()
        .from(communityPhotos)
        .where(
          input.territory === "ALL"
            ? undefined
            : eq(communityPhotos.territory, input.territory)
        )
        .orderBy(desc(communityPhotos.createdAt))
        .limit(100);

      return rows;
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
      await db.insert(communityPhotos).values({
        riderName: input.riderName,
        territory: input.territory,
        location: input.location,
        venue: input.venue ?? null,
        mootsModel: input.mootsModel ?? null,
        caption: input.caption ?? null,
        imageUrl: url,
        imageKey: key,
        approved: "approved",
      });

      return { success: true, url };
    }),
});
