import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { type Prisma } from "@prisma/client";
import { z } from "zod";

export const jobRouter = createTRPCRouter({
  // 查询 - 游标
  queryWithCursor: publicProcedure
    .input(
      z.object({
        s: z.string().max(256).optional().default(""),
        dateRange: z.array(z.string()).max(2).optional().default([]),
        type: z.enum(["news", "trending"]).optional().default("news"),
        tags: z
          .array(z.string())
          .max(12, { message: "最多 12 个" })
          .optional()
          .default([]),
        limit: z.number().min(1).max(50).optional().default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const {
        s = "",
        dateRange = [],
        type = "news",
        tags = [],
        limit,
        cursor,
      } = input;

      try {
        const withWhere: Prisma.JobWhereInput = {
          invalid: false,
        };
        // 标题查询
        if (s) {
          withWhere.title = {
            contains: s,
          };
        }
        // 日期查询
        if (dateRange.length) {
          const [start, end] = dateRange;
          withWhere.syncAt = {
            gte: start,
            lte: end,
          };
        }

        // 标签查询
        if (tags.length) {
          withWhere.tags = {
            some: {
              jobTagId: {
                in: tags,
              },
            },
          };
        }

        const withOrderBy: Prisma.JobOrderByWithRelationInput = {};
        if (type === "news") {
          withOrderBy.originCreateAt = "desc";
        } else if (type === "trending") {
          withOrderBy.showCount = "desc";
        }

        const data = await db.job.findMany({
          where: withWhere,
          orderBy: withOrderBy,
          take: limit + 1,
          cursor: cursor
            ? {
                id: cursor,
              }
            : undefined,
          include: {
            tags: {
              include: {
                jobTag: true,
              },
            },
          },
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const nextItem = data.pop();
          nextCursor = nextItem!.id;
        }

        // TODO: 非同步更新， showCount
        return {
          data,
          nextCursor,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    }),

  // 详情
  detail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      const data = await db.job.findUnique({
        where: {
          id,
        },
        include: {
          tags: {
            include: {
              jobTag: true,
            },
          },
        },
      });
      return data;
    }),
});
