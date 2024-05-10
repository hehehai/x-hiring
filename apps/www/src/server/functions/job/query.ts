import { db, Prisma, type Job } from "@actijob/db";

interface JobQueryParams {
  s?: string[];
  dateRange?: string[];
  type?: string;
  limit?: number;
  offset?: number;
}

export async function jobQuery(params: JobQueryParams) {
  "use server";

  const {
    s = [],
    dateRange = [],
    type = "news",
    limit = 10,
    offset = 0,
  } = params;

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
      where: withWhere,
      orderBy: withOrderBy,
      take: limit,
      skip: offset * limit,
    });

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function jobDetail(id: string) {
  const data = await db.job.findUnique({
    select: {
      id: true,
      originId: true,
      originUrl: true,
      originSite: true,
      originCreateAt: true,
      originUsername: true,
      originUserAvatar: true,
      title: true,
      tags: true,
      fullTags: true,
      generatedContent: true,
    },
    where: {
      id,
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

export async function correlation(tags: string[], excludeIds?: string[]) {
  const sql = Prisma.sql`SELECT
	*
FROM
	job
WHERE
	"fullTags" && ARRAY [${Prisma.join(tags)}] -- 包含任意一个标签
  ${excludeIds?.length ? Prisma.sql`AND id NOT IN (${Prisma.join(excludeIds)})` : Prisma.empty} -- 排除指定项
ORDER BY
	(
		SELECT
			COUNT(*) -- 计算匹配项数量
		FROM
			unnest("fullTags") AS t
		WHERE
			t IN(${Prisma.join(tags)})    
  ) DESC,
  "originCreateAt" DESC 
LIMIT 6;
`;

  const sites: Job[] = await db.$queryRaw(sql);

  return sites.map((site) => ({
    id: site.id,
    originId: site.originId,
    originUrl: site.originUrl,
    originSite: site.originSite,
    title: site.title,
    originCreateAt: site.originCreateAt,
    originUsername: site.originUsername,
    originUserAvatar: site.originUserAvatar,
    tags: site.tags,
  }));
}
