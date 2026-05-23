import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { communityRouter } from "./communityRouter";
import { bookingRouter } from "./bookingRouter";
import { moderationRouter } from "./moderationRouter";
import { rsvpRouter } from "./rsvpRouter";
import { configuratorRouter } from "./configuratorRouter";
import { analyticsRouter } from "./analyticsRouter";
import { newsletterRouter } from "./newsletterRouter";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  community: communityRouter,
  booking: bookingRouter,
  moderation: moderationRouter,
  rsvp: rsvpRouter,
  configurator: configuratorRouter,
  analytics: analyticsRouter,
  newsletter: newsletterRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
