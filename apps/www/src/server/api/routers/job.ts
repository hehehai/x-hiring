import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { correlation, jobDetail } from "@/server/functions/job/query";
import { db, type Prisma } from "@actijob/db";
import { z } from "zod";

export const jobRouter = createTRPCRouter({
  // 查询 - 游标
  queryWithCursor: publicProcedure
    .input(
      z.object({
        s: z
          .array(z.string())
          .max(20, { message: "最多 20 个" })
          .optional()
          .default([])
          .transform((value) =>
            value.map((item) => item.trim()).filter(Boolean),
          ),
        dateRange: z.array(z.string()).max(2).optional().default([]),
        type: z.enum(["news", "trending"]).optional().default("news"),
        limit: z.number().min(1).max(50).optional().default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { s = [], dateRange = [], type = "news", limit, cursor } = input;

      try {
        const withWhere: Prisma.JobWhereInput = {
          invalid: false,
        };
        // 关键词
        if (s.length) {
          withWhere.AND = s.map((item) => ({
            title: {
              mode: "insensitive",
              contains: item,
            },
          }));
        }
        // 日期查询
        if (dateRange.length) {
          const [start, end] = dateRange;
          withWhere.syncAt = {
            gte: start,
            lte: end,
          };
        }

        const withOrderBy: Prisma.JobOrderByWithRelationInput = {};
        if (type === "news") {
          withOrderBy.originCreateAt = "desc";
        } else if (type === "trending") {
          withOrderBy.showCount = "desc";
        }

        const data = await db.job.findMany({
          select: {
            id: true,
            originSite: true,
            originCreateAt: true,
            originUsername: true,
            originUserAvatar: true,
            title: true,
            tags: true,
          },
          where: withWhere,
          orderBy: withOrderBy,
          take: limit + 1,
          cursor: cursor
            ? {
                id: cursor,
              }
            : undefined,
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (data.length > limit) {
          const nextItem = data.pop();
          nextCursor = nextItem!.id;
        }

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
      return jobDetail(input.id);
    }),

  // 关联
  correlation: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const job = await jobDetail(input.id);
      if (!job) return null;

      return correlation(job.fullTags, [job.id]);
    }),
});
