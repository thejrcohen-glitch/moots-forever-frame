/**
 * Analytics router — admin-only summary statistics for the Admin dashboard.
 * Aggregates counts from event_rsvps, configurator_leads, community_photos,
 * and booking requests (booking requests are not persisted to DB yet, so we
 * return a placeholder for that metric).
 */

import { sql } from "drizzle-orm";
import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import { eventRsvps, configuratorLeads, communityPhotos, bookings } from "../drizzle/schema";

export const analyticsRouter = router({
  /** Return aggregate stats for the admin analytics tab */
  summary: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only." });
    }

    const db = await getDb();
    if (!db) {
      return {
        rsvps: { total: 0, thisMonth: 0 },
        leads: { total: 0, thisMonth: 0 },
        photos: { total: 0, pending: 0, approved: 0, rejected: 0 },
        bookings: { total: 0, thisMonth: 0 },
      };
    }

    // Start of current calendar month (UTC)
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const monthStartMs = monthStart.getTime();

    // ── RSVPs ──────────────────────────────────────────────────────────────────
    const [rsvpTotal] = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventRsvps);

    const [rsvpMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(eventRsvps)
      .where(sql`${eventRsvps.createdAt} >= ${monthStartMs}`);

    // ── Configurator Leads ─────────────────────────────────────────────────────
    const [leadTotal] = await db
      .select({ count: sql<number>`count(*)` })
      .from(configuratorLeads);

    const [leadMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(configuratorLeads)
      .where(sql`${configuratorLeads.createdAt} >= ${monthStartMs}`);

    // ── Community Photos ───────────────────────────────────────────────────────
    const [photoTotal] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPhotos);

    const [photoPending] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPhotos)
      .where(sql`${communityPhotos.approved} = 'pending'`);

    const [photoApproved] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPhotos)
      .where(sql`${communityPhotos.approved} = 'approved'`);

    const [photoRejected] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPhotos)
      .where(sql`${communityPhotos.approved} = 'rejected'`);

    // ── Territory breakdown for RSVPs ─────────────────────────────────────────
    const rsvpByTerritory = await db
      .select({
        territory: eventRsvps.territory,
        count: sql<number>`count(*)`,
      })
      .from(eventRsvps)
      .groupBy(eventRsvps.territory);

    const territoryMap: Record<string, number> = {};
    for (const row of rsvpByTerritory) {
      territoryMap[row.territory] = Number(row.count);
    }

    // ── Top events by RSVP count ──────────────────────────────────────────────
    const topEvents = await db
      .select({
        eventTitle: eventRsvps.eventTitle,
        count: sql<number>`count(*)`,
      })
      .from(eventRsvps)
      .groupBy(eventRsvps.eventTitle)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    // ── Top models from configurator leads ────────────────────────────────
    const topModels = await db
      .select({
        model: configuratorLeads.recommendedModel,
        count: sql<number>`count(*)`,
      })
      .from(configuratorLeads)
      .groupBy(configuratorLeads.recommendedModel)
      .orderBy(sql`count(*) desc`)
      .limit(5);

    // ── Bookings ──────────────────────────────────────────────────────────────
    const [bookingTotal] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings);

    const [bookingMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(sql`${bookings.createdAt} >= ${monthStartMs}`);

    return {
      rsvps: {
        total: Number(rsvpTotal?.count ?? 0),
        thisMonth: Number(rsvpMonth?.count ?? 0),
        byTerritory: territoryMap,
        topEvents: topEvents.map(e => ({ title: e.eventTitle, count: Number(e.count) })),
      },
      leads: {
        total: Number(leadTotal?.count ?? 0),
        thisMonth: Number(leadMonth?.count ?? 0),
        topModels: topModels.map(m => ({ model: m.model ?? "Unknown", count: Number(m.count) })),
      },
      photos: {
        total: Number(photoTotal?.count ?? 0),
        pending: Number(photoPending?.count ?? 0),
        approved: Number(photoApproved?.count ?? 0),
        rejected: Number(photoRejected?.count ?? 0),
      },
      bookings: {
        total: Number(bookingTotal?.count ?? 0),
        thisMonth: Number(bookingMonth?.count ?? 0),
      },
    };
  }),
});
