import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), avatar: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: input,
      });
      return user;
    }),
});
