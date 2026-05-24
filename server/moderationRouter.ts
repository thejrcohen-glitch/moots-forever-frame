import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { communityPhotos } from "../drizzle/schema";
import { parseCommunityPhotoTags, type CommunityPhotoTagSlug } from "../shared/const";

function projectPhotoRow<T extends { tags: string | null }>(row: T): Omit<T, "tags"> & { tags: CommunityPhotoTagSlug[] } {
  const { tags, ...rest } = row;
  return { ...rest, tags: parseCommunityPhotoTags(tags) };
}

// Helper: enforce admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  }
  return next({ ctx });
});

export const moderationRouter = router({
  /** List all photos pending moderation (admin only) */
  listPending: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(communityPhotos)
      .where(eq(communityPhotos.approved, "pending"))
      .orderBy(communityPhotos.createdAt);
    return rows.map(projectPhotoRow);
  }),

  /** List all photos with any status (admin only) */
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(communityPhotos)
      .orderBy(communityPhotos.createdAt);
    return rows.map(projectPhotoRow);
  }),

  /** Approve a photo */
  approve: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available." });
      await db
        .update(communityPhotos)
        .set({ approved: "approved" })
        .where(eq(communityPhotos.id, input.id));
      return { success: true };
    }),

  /** Reject a photo */
  reject: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available." });
      await db
        .update(communityPhotos)
        .set({ approved: "rejected" })
        .where(eq(communityPhotos.id, input.id));
      return { success: true };
    }),

  /** Delete a photo permanently */
  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available." });
      await db.delete(communityPhotos).where(eq(communityPhotos.id, input.id));
      return { success: true };
    }),
});
