import { z } from "zod";
import { router, publicProcedure } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { configuratorLeads } from "../drizzle/schema";

export const configuratorRouter = router({
  /** Submit a build configurator lead — saved to DB then notifies Ian */
  submitLead: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(128),
        email: z.string().email(),
        territory: z.enum(["TX", "OK", "AR"]),
        useCase: z.enum(["gravel", "road", "adventure", "commute"]),
        terrain: z.enum(["pavement", "mixed", "dirt", "technical"]),
        budget: z.enum(["under-5k", "5k-8k", "8k-12k", "12k-plus"]),
        recommendedModel: z.string().min(1).max(128),
        notes: z.string().max(1000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // 1. Persist to DB first — lead is never lost even if notification fails
      const db = await getDb();
      if (db) {
        await db.insert(configuratorLeads).values({
          name: input.name,
          email: input.email,
          territory: input.territory,
          useCase: input.useCase,
          terrain: input.terrain,
          budget: input.budget,
          recommendedModel: input.recommendedModel,
          notes: input.notes ?? null,
        }).catch(() => {/* non-blocking */});
      }

      // 2. Notify Ian
      const territoryLabel = { TX: "Texas", OK: "Oklahoma", AR: "Arkansas" }[input.territory];
      const useCaseLabel = { gravel: "Gravel / Adventure", road: "Road Racing", adventure: "Bikepacking / Touring", commute: "Daily Commute + Weekend Rides" }[input.useCase];
      const terrainLabel = { pavement: "Mostly Pavement", mixed: "Mixed Surfaces", dirt: "Mostly Dirt / Gravel", technical: "Technical Off-Road" }[input.terrain];
      const budgetLabel = { "under-5k": "Under $5,000", "5k-8k": "$5,000 – $8,000", "8k-12k": "$8,000 – $12,000", "12k-plus": "$12,000+" }[input.budget];

      const content = [
        `New build configurator lead from ${input.name} (${input.email})`,
        ``,
        `Recommended Model: ${input.recommendedModel}`,
        `Territory: ${territoryLabel} (${input.territory})`,
        `Use Case: ${useCaseLabel}`,
        `Terrain: ${terrainLabel}`,
        `Budget: ${budgetLabel}`,
        input.notes ? `\nNotes:\n${input.notes}` : null,
        ``,
        `Reply to: ${input.email}`,
      ]
        .filter(Boolean)
        .join("\n");

      await notifyOwner({
        title: `🔧 New Build Lead — ${input.recommendedModel} — ${input.name} (${input.territory})`,
        content,
      }).catch(() => {/* non-blocking */});

      return { success: true };
    }),
});
