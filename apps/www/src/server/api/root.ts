import { createTRPCRouter } from "@/server/api/trpc";
import { jobRouter } from "./routers/job";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  job: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
