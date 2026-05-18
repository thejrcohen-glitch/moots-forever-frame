import { z } from "zod";
import { getDb } from "./db";
import { notifications, notificationPreferences } from "../drizzle/schema";
import { adminProcedure, protectedProcedure, router } from "./_core/trpc";
import { eq, isNull, desc } from "drizzle-orm";

export const notificationRouter = router({
  /**
   * List all notifications (admin-only)
   * Can filter by type and territory
   */
  list: adminProcedure
    .input(
      z.object({
        type: z
          .enum(["rsvp", "booking", "community_upload", "lead", "admin_message", "event_reminder", "dealer_announcement"])
          .optional(),
        territory: z.enum(["TX", "OK", "AR", "ALL"]).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select().from(notifications);

      if (input.type) {
        query = query.where(eq(notifications.type, input.type));
      }
      if (input.territory) {
        query = query.where(eq(notifications.territory, input.territory));
      }

      const results = await query.orderBy(desc(notifications.createdAt)).limit(input.limit);
      return results;
    }),

  /**
   * Get unread notification count for admin
   */
  unreadCount: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return 0;

    const result = await db.select().from(notifications).where(isNull(notifications.readAt));
    return result.length;
  }),

  /**
   * Mark notification as read
   */
  markAsRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db
        .update(notifications)
        .set({ readAt: new Date() })
        .where(eq(notifications.id, input.id));
      return { success: true };
    }),

  /**
   * Delete notification
   */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.delete(notifications).where(eq(notifications.id, input.id));
      return { success: true };
    }),

  /**
   * Create a new notification (admin-only)
   * Used for custom admin messages, announcements, etc.
   */
  create: adminProcedure
    .input(
      z.object({
        type: z.enum(["rsvp", "booking", "community_upload", "lead", "admin_message", "event_reminder", "dealer_announcement"]),
        title: z.string().min(1).max(256),
        message: z.string().min(1),
        territory: z.enum(["TX", "OK", "AR", "ALL"]).default("ALL"),
        relatedId: z.number().optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return { success: false };

      await db.insert(notifications).values({
        type: input.type,
        title: input.title,
        message: input.message,
        territory: input.territory,
        relatedId: input.relatedId,
      });
      return { success: true };
    }),

  /**
   * Get user's notification preferences
   */
  getPreferences: protectedProcedure.query(async ({ ctx }: any) => {
    const db = await getDb();
    if (!db) return null;

    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, ctx.user.id));

    if (prefs.length === 0) {
      // Create default preferences if they don't exist
      await db.insert(notificationPreferences).values({
        userId: ctx.user.id,
        emailNotifications: 1,
        inAppNotifications: 1,
        territory: "ALL",
      });
      return {
        userId: ctx.user.id,
        emailNotifications: true,
        inAppNotifications: true,
        territory: "ALL",
      };
    }

    return {
      ...prefs[0],
      emailNotifications: Boolean(prefs[0].emailNotifications),
      inAppNotifications: Boolean(prefs[0].inAppNotifications),
    };
  }),

  /**
   * Update user's notification preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        emailNotifications: z.boolean().optional(),
        inAppNotifications: z.boolean().optional(),
        territory: z.enum(["TX", "OK", "AR", "ALL"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) return { success: false };

      const existing = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id));

      if (existing.length === 0) {
        await db.insert(notificationPreferences).values({
          userId: ctx.user.id,
          emailNotifications: input.emailNotifications ? 1 : 0,
          inAppNotifications: input.inAppNotifications ? 1 : 0,
          territory: input.territory ?? "ALL",
        });
      } else {
        await db
          .update(notificationPreferences)
          .set({
            emailNotifications: input.emailNotifications !== undefined ? (input.emailNotifications ? 1 : 0) : existing[0].emailNotifications,
            inAppNotifications: input.inAppNotifications !== undefined ? (input.inAppNotifications ? 1 : 0) : existing[0].inAppNotifications,
            territory: input.territory ?? existing[0].territory,
          })
          .where(eq(notificationPreferences.userId, ctx.user.id));
      }

      return { success: true };
    }),
});
