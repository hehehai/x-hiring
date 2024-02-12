import { db } from "@/server/db";
import { type Prisma } from "@prisma/client";

interface JobQueryParams {
  s?: string;
  dateRange?: string[];
  type?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export async function jobQuery(params: JobQueryParams) {
  "use server";

  const {
    s = "",
    dateRange = [],
    type = "news",
    tags = [],
    limit = 10,
    offset = 0,
  } = params;

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
      take: limit,
      skip: offset * limit,
      include: {
        tags: {
          include: {
            jobTag: true,
          },
        },
      },
    });

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function jobDetail(id: string) {
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
  if (data) {
    await db.job.update({
      where: {
        id,
      },
      data: {
        showCount: {
          increment: 1,
        },
      },
    });
  }
  return data;
}
