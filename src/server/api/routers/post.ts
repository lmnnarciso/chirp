import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

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
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const authorId = ctx.session.user.id;

      if (!authorId) {
        throw "Unauthorize Action";
      }

      const content = ctx.prisma.post.create({
        data: {
          content: input.content,
          authorId: authorId,
        },
      });

      console.log({ content });
      return content;
    }),
  getPost: protectedProcedure.query(async ({ ctx }) => {
    console.log({ ctx: ctx.session.user.id });
    return await ctx.prisma.post.findMany({});
  }),
  deletePost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      if (!authorId) {
        throw "Unauthorize Action";
      }

      const deletePost = ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });

      return deletePost;
    }),
  createPostTransaction: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.session.user.id;

      if (!authorId) {
        throw "Unauthorize Action";
      }
      const [post, totalPosts] = await ctx.prisma.$transaction([
        ctx.prisma.post.create({
          data: {
            content: input.content,
            authorId: authorId,
          },
        }),
        ctx.prisma.post.count(),
      ]);

      return {
        post,
        totalPosts,
      };
    }),
});
