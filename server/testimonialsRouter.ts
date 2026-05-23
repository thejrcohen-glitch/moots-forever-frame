import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { testimonials } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const testimonialsRouter = router({
  // Public: Get verified testimonials only
  listPublic: publicProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(10),
      })
    )
    .query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) return [];

      const rows = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.status, "verified"))
        .orderBy(desc(testimonials.displayOrder), desc(testimonials.createdAt))
        .limit(input.limit);

      return rows;
    }),

  // Admin: List all testimonials with status
  listAdmin: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  }).query(async () => {
    const db = await getDb();
    if (!db) return [];

    const rows = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    return rows;
  }),

  // Admin: Create new testimonial (starts as pending)
  create: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  })
    .input(
      z.object({
        personName: z.string().min(1).max(128),
        organization: z.string().min(1).max(256),
        territory: z.enum(["TX", "OK", "AR", "CH"]),
        quote: z.string().min(10).max(1000),
        imageUrl: z.string().url().optional(),
        imageKey: z.string().optional(),
        displayOrder: z.number().int().default(0),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const result = await db.insert(testimonials).values({
        personName: input.personName,
        organization: input.organization,
        territory: input.territory,
        quote: input.quote,
        imageUrl: input.imageUrl,
        imageKey: input.imageKey,
        displayOrder: input.displayOrder,
        status: "pending",
      });

      return { success: true, id: (result as any).insertId };
    }),

  // Admin: Update testimonial (only if pending or rejected)
  update: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  })
    .input(
      z.object({
        id: z.number().int().positive(),
        personName: z.string().min(1).max(128).optional(),
        organization: z.string().min(1).max(256).optional(),
        territory: z.enum(["TX", "OK", "AR", "CH"]).optional(),
        quote: z.string().min(10).max(1000).optional(),
        imageUrl: z.string().url().optional(),
        imageKey: z.string().optional(),
        displayOrder: z.number().int().optional(),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      // Check current status
      const existing = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.id, input.id))
        .limit(1);

      if (!existing.length) throw new Error("Testimonial not found");
      if (existing[0].status === "verified") {
        throw new Error("Cannot edit verified testimonials");
      }

      const updateData: any = {};
      if (input.personName) updateData.personName = input.personName;
      if (input.organization) updateData.organization = input.organization;
      if (input.territory) updateData.territory = input.territory;
      if (input.quote) updateData.quote = input.quote;
      if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
      if (input.imageKey !== undefined) updateData.imageKey = input.imageKey;
      if (input.displayOrder !== undefined) updateData.displayOrder = input.displayOrder;

      await db.update(testimonials).set(updateData).where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Verify testimonial (publish)
  verify: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  })
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db
        .update(testimonials)
        .set({
          status: "verified",
          verifiedAt: new Date(),
          verifiedBy: ctx.user.openId,
        })
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Reject testimonial
  reject: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  })
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db
        .update(testimonials)
        .set({ status: "rejected" })
        .where(eq(testimonials.id, input.id));

      return { success: true };
    }),

  // Admin: Delete testimonial
  delete: protectedProcedure.use(async ({ ctx, next }) => {
    if (ctx.user?.role !== 'admin') throw new Error('Admin access required');
    return next({ ctx });
  })
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      await db.delete(testimonials).where(eq(testimonials.id, input.id));

      return { success: true };
    }),
});
