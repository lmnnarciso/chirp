import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
    // return ctx.prisma.example.findMany();
  }),
  createPost: publicProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(({ input }) => {
      return {
        post: {
          content: input.content,
        },
      };
    }),
  getPost: protectedProcedure.query(({ ctx }) => {
    console.log({ ctx: ctx.session.user.id });
    return ctx.prisma.post.findMany();
  }),
});
