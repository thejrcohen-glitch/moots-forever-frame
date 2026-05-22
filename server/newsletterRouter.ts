import { z } from "zod";
import { desc, eq, isNull } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { newsletterSubscribers } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";
import { sendEmail, newsletterWelcomeEmail } from "./_core/email";

export const newsletterRouter = router({
  /** Subscribe an email to the campaign newsletter */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(320),
        territory: z.enum(["TX", "OK", "AR"]).optional(),
        source: z.string().max(64).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available.",
        });
      }

      const normalizedEmail = input.email.trim().toLowerCase();

      const existing = await db
        .select({
          id: newsletterSubscribers.id,
          unsubscribedAt: newsletterSubscribers.unsubscribedAt,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        // Re-subscribe if previously unsubscribed; otherwise treat as a no-op success.
        if (existing[0].unsubscribedAt) {
          await db
            .update(newsletterSubscribers)
            .set({ unsubscribedAt: null, territory: input.territory ?? null, source: input.source ?? null })
            .where(eq(newsletterSubscribers.id, existing[0].id));
          return { success: true, alreadySubscribed: false, resubscribed: true };
        }
        return { success: true, alreadySubscribed: true, resubscribed: false };
      }

      await db.insert(newsletterSubscribers).values({
        email: normalizedEmail,
        territory: input.territory ?? null,
        source: input.source ?? null,
      });

      // Notify Ian (non-blocking)
      notifyOwner({
        title: `📬 Newsletter signup — ${normalizedEmail}`,
        content: [
          `New newsletter subscriber: ${normalizedEmail}`,
          input.territory ? `Territory: ${input.territory}` : null,
          input.source ? `Source: ${input.source}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => {/* non-blocking */});

      // Send welcome email (non-blocking)
      sendEmail({
        to: normalizedEmail,
        subject: "You're on the list — Moots Forever Frame",
        html: newsletterWelcomeEmail({ territory: input.territory }),
      }).catch(() => {/* non-blocking */});

      return { success: true, alreadySubscribed: false, resubscribed: false };
    }),

  /** Unsubscribe an email from the newsletter */
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email().max(320) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available.",
        });
      }
      const normalizedEmail = input.email.trim().toLowerCase();
      await db
        .update(newsletterSubscribers)
        .set({ unsubscribedAt: new Date() })
        .where(eq(newsletterSubscribers.email, normalizedEmail));
      return { success: true };
    }),

  /** List all active subscribers — admin only */
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only." });
    }
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(newsletterSubscribers)
      .where(isNull(newsletterSubscribers.unsubscribedAt))
      .orderBy(desc(newsletterSubscribers.createdAt))
      .limit(1000);
  }),
});
