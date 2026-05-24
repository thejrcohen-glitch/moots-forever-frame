import { z } from "zod";
import { getDb } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifications, notificationPreferences } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  // Protected: Get user's notifications
  list: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
      offset: z.number().default(0),
      unreadOnly: z.boolean().default(false),
    }).optional())
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(notifications.userId, ctx.user.id)];
      if (input?.unreadOnly) {
        conditions.push(eq(notifications.read, false));
      }

      const rows = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);

      return rows;
    }),

  // Protected: Get unread count
  unreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return 0;

      const result = await db
        .select()
        .from(notifications)
        .where(and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false)
        ));

      return result.length;
    }),

  // Protected: Mark notification as read
  markAsRead: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Protected: Mark all as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.userId, ctx.user.id));

      return { success: true };
    }),

  // Protected: Delete notification
  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .delete(notifications)
        .where(eq(notifications.id, input.id));

      return { success: true };
    }),

  // Protected: Get user's notification preferences
  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const prefs = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id));

      return prefs[0] || null;
    }),

  // Protected: Update notification preferences
  updatePreferences: protectedProcedure
    .input(z.object({
      emailOnBooking: z.boolean().optional(),
      emailOnPhotoApproved: z.boolean().optional(),
      emailOnTestimonialVerified: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updates: any = {};
      if (input.emailOnBooking !== undefined) updates.emailOnBooking = input.emailOnBooking;
      if (input.emailOnPhotoApproved !== undefined) updates.emailOnPhotoApproved = input.emailOnPhotoApproved;
      if (input.emailOnTestimonialVerified !== undefined) updates.emailOnTestimonialVerified = input.emailOnTestimonialVerified;
      if (input.pushNotifications !== undefined) updates.pushNotifications = input.pushNotifications;

      // Upsert: update if exists, create if not
      const existing = await db
        .select()
        .from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id));

      if (existing.length > 0) {
        await db
          .update(notificationPreferences)
          .set(updates)
          .where(eq(notificationPreferences.userId, ctx.user.id));
      } else {
        await db.insert(notificationPreferences).values({
          userId: ctx.user.id,
          ...updates,
        });
      }

      return { success: true };
    }),
});
