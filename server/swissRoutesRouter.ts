import { z } from "zod";
import { getDb } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { swissRoutes } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Admin-only procedure wrapper
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const swissRoutesRouter = router({
  // Public: List only verified routes
  listPublic: publicProcedure
    .input(z.object({
      difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
      limit: z.number().default(50),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query = db
        .select()
        .from(swissRoutes)
        .where(eq(swissRoutes.status, "verified"))
        .orderBy(desc(swissRoutes.createdAt));

      const rows = await query.limit(input?.limit || 50);

      if (!input?.difficulty) return rows;
      return rows.filter(r => r.difficulty === input.difficulty);
    }),

  // Admin: List all routes with status
  listAdmin: adminProcedure
    .input(z.object({
      status: z.enum(["pending", "verified", "rejected"]).optional(),
      limit: z.number().default(100),
    }).optional())
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      let rows: any[] = [];
      if (input?.status) {
        rows = await db
          .select()
          .from(swissRoutes)
          .where(eq(swissRoutes.status, input.status))
          .orderBy(desc(swissRoutes.createdAt))
          .limit(input?.limit || 100);
      } else {
        rows = await db
          .select()
          .from(swissRoutes)
          .orderBy(desc(swissRoutes.createdAt))
          .limit(input?.limit || 100);
      }

      return rows;
    }),

  // Admin: Create new route
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1, "Route name required"),
      description: z.string().optional(),
      distance: z.number().optional(),
      elevationGain: z.number().optional(),
      difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
      bikeModels: z.array(z.string()).optional(),
      routeUrl: z.string().url().optional(),
      imageUrl: z.string().optional(),
      imageKey: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const result = await db.insert(swissRoutes).values({
        name: input.name,
        description: input.description,
        distance: input.distance ? input.distance.toString() : undefined,
        elevationGain: input.elevationGain,
        difficulty: input.difficulty,
        bikeModels: input.bikeModels ? JSON.stringify(input.bikeModels) : undefined,
        routeUrl: input.routeUrl,
        imageUrl: input.imageUrl,
        imageKey: input.imageKey,
        status: "pending",
      });

      return { success: true, id: result[0] };
    }),

  // Admin: Update route
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      distance: z.number().optional(),
      elevationGain: z.number().optional(),
      difficulty: z.enum(["easy", "moderate", "hard"]).optional(),
      bikeModels: z.array(z.string()).optional(),
      routeUrl: z.string().url().optional(),
      imageUrl: z.string().optional(),
      imageKey: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.description !== undefined) updates.description = input.description;
      if (input.distance) updates.distance = input.distance.toString();
      if (input.elevationGain) updates.elevationGain = input.elevationGain;
      if (input.difficulty) updates.difficulty = input.difficulty;
      if (input.bikeModels) updates.bikeModels = JSON.stringify(input.bikeModels);
      if (input.routeUrl) updates.routeUrl = input.routeUrl;
      if (input.imageUrl) updates.imageUrl = input.imageUrl;
      if (input.imageKey) updates.imageKey = input.imageKey;

      await db
        .update(swissRoutes)
        .set(updates)
        .where(eq(swissRoutes.id, input.id));

      return { success: true };
    }),

  // Admin: Verify route
  verify: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(swissRoutes)
        .set({
          status: "verified",
          verifiedBy: ctx.user.openId,
          verifiedAt: new Date(),
        })
        .where(eq(swissRoutes.id, input.id));

      return { success: true };
    }),

  // Admin: Reject route
  reject: adminProcedure
    .input(z.object({
      id: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(swissRoutes)
        .set({
          status: "rejected",
          rejectionReason: input.reason,
          verifiedBy: ctx.user.openId,
          verifiedAt: new Date(),
        })
        .where(eq(swissRoutes.id, input.id));

      return { success: true };
    }),

  // Admin: Delete route
  delete: adminProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .delete(swissRoutes)
        .where(eq(swissRoutes.id, input.id));

      return { success: true };
    }),
});
