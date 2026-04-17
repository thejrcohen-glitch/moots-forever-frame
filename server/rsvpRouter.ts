import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { router, publicProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { eventRsvps } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

export const rsvpRouter = router({
  /** Submit an RSVP for a ride calendar event */
  submit: publicProcedure
    .input(
      z.object({
        eventId: z.number().int().positive(),
        eventTitle: z.string().min(1).max(256),
        eventDate: z.string().min(1).max(32),
        territory: z.enum(["TX", "OK", "AR"]),
        riderName: z.string().min(1).max(128),
        email: z.string().email(),
        notes: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available." });

      // Check for duplicate RSVP by email + eventId
      const existing = await db
        .select({ id: eventRsvps.id })
        .from(eventRsvps)
        .where(
          and(
            eq(eventRsvps.eventId, input.eventId),
            eq(eventRsvps.email, input.email)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        return { success: true, alreadyRegistered: true };
      }

      await db.insert(eventRsvps).values({
        eventId: input.eventId,
        eventTitle: input.eventTitle,
        eventDate: input.eventDate,
        territory: input.territory,
        riderName: input.riderName,
        email: input.email,
        notes: input.notes ?? null,
      });

      // Notify Ian
      const territoryLabel = { TX: "Texas", OK: "Oklahoma", AR: "Arkansas" }[input.territory];
      await notifyOwner({
        title: `🚲 New RSVP — ${input.eventTitle} — ${input.riderName}`,
        content: [
          `New RSVP from ${input.riderName} (${input.email})`,
          ``,
          `Event: ${input.eventTitle}`,
          `Date: ${input.eventDate}`,
          `Territory: ${territoryLabel} (${input.territory})`,
          input.notes ? `\nNotes:\n${input.notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      }).catch(() => {/* non-blocking */});

      return { success: true, alreadyRegistered: false };
    }),

  /** Get RSVP count for a specific event */
  count: publicProcedure
    .input(z.object({ eventId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { count: 0 };
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(eventRsvps)
        .where(eq(eventRsvps.eventId, input.eventId));
      return { count: Number(result[0]?.count ?? 0) };
    }),

  /** Get RSVP counts for multiple events at once */
  counts: publicProcedure
    .input(z.object({ eventIds: z.array(z.number().int().positive()) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return {};
      if (input.eventIds.length === 0) return {};
      const results = await db
        .select({ eventId: eventRsvps.eventId, count: sql<number>`count(*)` })
        .from(eventRsvps)
        .where(sql`${eventRsvps.eventId} IN (${sql.join(input.eventIds.map(id => sql`${id}`), sql`, `)})`)
        .groupBy(eventRsvps.eventId);
      const map: Record<number, number> = {};
      for (const r of results) {
        map[r.eventId] = Number(r.count);
      }
      return map;
    }),
});
