import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { grabAction } from "@/server/functions/grab";

export const grabRouter = createTRPCRouter({
  trigger: protectedProcedure.mutation(async ({ ctx }) => {
    const sig = ctx.headers.get("signature");
    if (sig !== "xxx") {
      console.log("sig error");
      throw new Error("sig error");
    }
    await grabAction();
    return;
  }),
});
