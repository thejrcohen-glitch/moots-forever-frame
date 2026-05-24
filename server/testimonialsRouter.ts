import { z } from "zod";
import { getDb } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { testimonials } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const testimonialsRouter = router({
  // Public: List only verified testimonials
  listPublic: publicProcedure
    .input(z.object({
      territory: z.enum(["TX", "OK", "AR", "ALL"]).optional().default("ALL"),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const query = db
        .select()
        .from(testimonials)
        .where(eq(testimonials.status, "verified"))
        .orderBy(testimonials.createdAt);

      const rows = await query;

      if (!input || input.territory === "ALL") return rows;
      return rows.filter(t => t.territory === input.territory);
    }),

  // Admin: List all testimonials with status
  listAdmin: adminProcedure
    .input(z.object({
      status: z.enum(["pending", "verified", "rejected"]).optional(),
      territory: z.enum(["TX", "OK", "AR", "ALL"]).optional().default("ALL"),
    }).optional())
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      let rows: any[] = [];
      if (input?.status) {
        rows = await db
          .select()
          .from(testimonials)
          .where(eq(testimonials.status, input.status))
          .orderBy(testimonials.createdAt);
      } else {
        rows = await db
          .select()
          .from(testimonials)
          .orderBy(testimonials.createdAt);
      }

      if (!input || input.territory === "ALL") return rows;
      return rows.filter(t => t.territory === input.territory);
    }),

  // Admin: Create new testimonial
  create: adminProcedure
    .input(z.object({
      dealerName: z.string().min(1, "Dealer name required"),
      personName: z.string().min(1, "Person name required"),
      territory: z.enum(["TX", "OK", "AR"]),
      quote: z.string().min(10, "Quote must be at least 10 characters"),
      context: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(testimonials).values({
        dealerName: input.dealerName,
        personName: input.personName,
        territory: input.territory,
        quote: input.quote,
        context: input.context,
        status: "pending",
      });

      return { success: true, id: result[0] };
    }),

  // Admin: Update testimonial
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      dealerName: z.string().optional(),
      personName: z.string().optional(),
      territory: z.enum(["TX", "OK", "AR"]).optional(),
      quote: z.string().optional(),
      context: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updates: any = {};
      if (input.dealerName) updates.dealerName = input.dealerName;
      if (input.personName) updates.personName = input.personName;
      if (input.territory) updates.territory = input.territory;
      if (input.quote) updates.quote = input.quote;
      if (input.context !== undefined) updates.context = input.context;

      await db
        .update(testimonials)
        .set(updates)
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Verify testimonial
  verify: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(testimonials)
        .set({
          status: "verified",
          verifiedBy: ctx.user.openId,
          verifiedAt: new Date(),
        })
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Reject testimonial
  reject: adminProcedure
    .input(z.object({
      id: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(testimonials)
        .set({
          status: "rejected",
          rejectionReason: input.reason,
          verifiedBy: ctx.user.openId,
          verifiedAt: new Date(),
        })
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Delete testimonial
  delete: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .delete(testimonials)
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),
});
