import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { sendEmail, bookingConfirmationEmail } from "./_core/email";
import { getDb } from "./db";
import { bookings } from "../drizzle/schema";

const TERRITORY_LABELS: Record<string, string> = {
  TX: "Texas",
  OK: "Oklahoma",
  AR: "Arkansas",
  CH: "Whistler / BC",
};

export const bookingRouter = router({
  /**
   * Submit a pop-up booking request.
   * Sends an owner notification to Ian Zakrocki via the Manus notification service.
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(128),
        email: z.string().email(),
        territory: z.enum(["TX", "OK", "AR", "CH"]),
        city: z.string().min(1).max(128),
        venue: z.string().max(256).optional(),
        preferredDate: z.string().optional(), // ISO date string YYYY-MM-DD
        message: z.string().max(1000).optional(),
        eventType: z.enum(["pop-up-espresso", "gravel-demo", "group-ride", "other"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const territoryLabel = TERRITORY_LABELS[input.territory] ?? input.territory;
      const dateStr = input.preferredDate
        ? new Date(input.preferredDate + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "No date specified";

      const eventTypeLabel =
        input.eventType === "pop-up-espresso"
          ? "Pop-Up Espresso & Demo"
          : input.eventType === "gravel-demo"
          ? "Gravel Demo Ride"
          : input.eventType === "group-ride"
          ? "Group Ride"
          : "General Inquiry";

      const content = [
        `New booking request from ${input.name} (${input.email})`,
        ``,
        `Territory: ${territoryLabel} (${input.territory})`,
        `City: ${input.city}`,
        input.venue ? `Venue: ${input.venue}` : null,
        `Event Type: ${eventTypeLabel}`,
        `Preferred Date: ${dateStr}`,
        input.message ? `\nMessage:\n${input.message}` : null,
        ``,
        `Reply to: ${input.email}`,
      ]
        .filter(Boolean)
        .join("\n");

      // Persist booking to database
      const db = await getDb();
      if (db) {
        await db.insert(bookings).values({
          riderName: input.name,
          email: input.email,
          territory: input.territory,
          popUpCity: input.city,
          popUpVenue: input.venue ?? null,
          popUpDate: input.preferredDate || "TBD",
          notes: input.message || null,
        });
      }

      const sent = await notifyOwner({
        title: `🚲 New Pop-Up Request — ${input.city}, ${input.territory} — ${input.name}`,
        content,
      });

      // Send confirmation email to requester (non-blocking)
      sendEmail({
        to: input.email,
        subject: `Pop-Up Request Received — Moots Forever Frame`,
        html: bookingConfirmationEmail({
          name: input.name,
          territory: territoryLabel,
          city: input.city,
          date: input.preferredDate ? dateStr : undefined,
        }),
      }).catch(() => {/* non-blocking */});

      return { success: true, notified: sent };
    }),

  /** List all bookings — admin only, for the Admin dashboard */
  listAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only." });
    }
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(500);
  }),

  /** Update a booking's status — admin only */
  setStatus: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only." });
      }
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available." });
      }
      await db
        .update(bookings)
        .set({ status: input.status })
        .where(eq(bookings.id, input.id));
      return { success: true };
    }),

  /**
   * Approximate capacity hint for a given territory + date.
   * Counts confirmed/pending requests for the same date in the same territory.
   * Returns a soft "remaining slots" hint based on a per-pop-up rider cap.
   * Gracefully falls back to nulls when the database is unavailable.
   */
  capacityHint: publicProcedure
    .input(
      z.object({
        territory: z.enum(["TX", "OK", "AR", "CH"]),
        date: z.string().min(1).max(32),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { available: null as null | boolean, taken: 0, cap: null as null | number };
      const RIDER_CAP_PER_POPUP = 25; // soft cap per pop-up — ample for a coffee shop demo fleet
      const [row] = await db
        .select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(
          and(
            eq(bookings.territory, input.territory),
            eq(bookings.popUpDate, input.date),
            sql`${bookings.status} <> 'cancelled'`
          )
        );
      const taken = Number(row?.count ?? 0);
      return {
        taken,
        cap: RIDER_CAP_PER_POPUP,
        available: taken < RIDER_CAP_PER_POPUP,
      };
    }),
});
