import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";

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
        territory: z.enum(["TX", "OK", "AR"]),
        city: z.string().min(1).max(128),
        venue: z.string().max(256).optional(),
        preferredDate: z.string().optional(), // ISO date string YYYY-MM-DD
        message: z.string().max(1000).optional(),
        eventType: z.enum(["pop-up-espresso", "gravel-demo", "group-ride", "other"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const territoryLabel = { TX: "Texas", OK: "Oklahoma", AR: "Arkansas" }[input.territory];
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

      const sent = await notifyOwner({
        title: `🚲 New Pop-Up Request — ${input.city}, ${input.territory} — ${input.name}`,
        content,
      });

      return { success: true, notified: sent };
    }),
});
