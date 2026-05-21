import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { newsletterSubscribers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        territory: z.enum(["TX", "OK", "AR", "CH", "ALL"]).optional(),
      })
    )
    .mutation(async ({ input }): Promise<any> => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection unavailable",
          });
        }

        // Check if email already subscribed
        const existing = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already subscribed to newsletter",
          });
        }

        // Insert new subscriber
        await db.insert(newsletterSubscribers).values({
          email: input.email,
          territory: input.territory || "ALL",
          subscribed: 1,
        });

        return {
          success: true,
          message: "Successfully subscribed to newsletter",
          email: input.email,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
        });
      }
    }),

  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }): Promise<any> => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database connection unavailable",
          });
        }
        await db
          .update(newsletterSubscribers)
          .set({ subscribed: 0, unsubscribedAt: new Date() })
          .where(eq(newsletterSubscribers.email, input.email));

        return { success: true, message: "Unsubscribed from newsletter" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unsubscribe",
        });
      }
    }),

  listSubscribers: publicProcedure.query(async (): Promise<any> => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection unavailable",
        });
      }
      const subscribers = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.subscribed, 1));

      return subscribers;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch subscribers",
      });
    }
  }),
});
