import { db } from "@/server/db";
import { withAiAnalysis } from "../with-ai/analysis";
import {
  type EleDuckArticle,
  eleDuckDetailRoute,
  eleDuckListRoute,
} from "./routes/ele-duck";
import {
  type V2EXArticle,
  v2exDetailRoute,
  v2exListRoute,
} from "./routes/v2ex";
import { randomInt, sleep } from "@/lib/utils";
import {
  filterAvailableTags,
  isAvailableCategory,
  isAvailableContent,
} from "./filter";

// 同步比较最小判断数
const MIN_SYNC_DIFF = 5;

// 最大单次同步数
const MAX_SYNC_CHECK = 100;

const v2exDataCapture = async () => {
  try {
    const latest100 = await db.job.findMany({
      select: {
        id: true,
        originId: true,
      },
      where: {
        originSite: "V2EX",
      },
      orderBy: {
        syncAt: "desc",
      },
      take: 100,
    });
    if (latest100.length === 0) {
      // 第一次抓取
      console.log("第一次抓取");
    }
    const savedOriginIds = latest100.map((item) => item.originId);

    let page = 1;
    const fetchArticles: V2EXArticle[] = [];
    const syncedIds: string[] = [];

    // 遍历抓取
    while (true) {
      if (syncedIds.length > MIN_SYNC_DIFF) {
        break;
      }
      if (fetchArticles.length > MAX_SYNC_CHECK) {
        break;
      }

      // 列表
      const articles = await v2exListRoute(page.toString());
      if (!articles?.length) {
        console.log("未抓取到文章");
        break;
      }

      // 同步判断
      articles.forEach((article) => {
        const syncIdx = savedOriginIds.indexOf(article.id);
        if (syncIdx === -1) {
          console.log("未同步过", article.id);
          fetchArticles.push(article);
        } else {
          console.log("已同步过", article.id);
          syncedIds.push(article.id);
        }
        savedOriginIds.splice(syncIdx, 1);
      });

      page += 1;
      // 等待⌛️
      await sleep(randomInt(500, 1000));
    }

    if (!fetchArticles.length) {
      console.log("无新文章");
      return;
    }

    // 详情
    for (const article of fetchArticles) {
      const saveInvalid = async () => {
        console.log("文章摘要无效", article.id);
        const articleData = await db.job.create({
          data: {
            originSite: "V2EX",
            originId: article.id,
            originUrl: article.href,
            originTitle: article.title,
            invalid: true,
          },
        });
        console.log("无效文章数据已保存", articleData.id);
      };
      // 判断招聘是否有效
      if (!isAvailableContent(article.title)) {
        await saveInvalid();
        continue;
      }

      console.log("查询文章详情", article.id);
      const abstract = await v2exDetailRoute(article.id);
      if (!abstract) {
        await saveInvalid();
        continue;
      }
      console.log("分析文章摘要", article.id);
      const analysis = await withAiAnalysis(
        `${article.title}\n${abstract.content}`,
      );

      if (
        !analysis?.title.trim() ||
        !analysis.content ||
        analysis.content === "无"
      ) {
        await saveInvalid();
        await sleep(randomInt(500, 1000));
        continue;
      }

      console.log("保持文章到数据库", article.id);
      const articleData = await db.job.create({
        data: {
          originSite: "V2EX",
          originId: article.id,
          originUrl: article.href,
          originTitle: article.title,
          originContent: abstract.content,
          originCreateAt: new Date(abstract.createdAt),
          originUsername: article.authorName,
          originUserAvatar: article.authorAvatar,
          title: analysis.title,
          tags: {
            create: filterAvailableTags(analysis.tags).map((tag) => ({
              jobTag: {
                connectOrCreate: {
                  create: {
                    name: tag,
                  },
                  where: {
                    name: tag,
                  },
                },
              },
            })),
          },
          generatedContent: analysis.content,
          generatedAt: new Date(),
        },
      });

      console.log("文章数据已保存", articleData.id);
      // 等待⌛️
      await sleep(randomInt(800, 1200));
    }
  } catch (err) {
    console.error("v2exDataCapture error", err);
  }
};

const eleDuckDataCapture = async () => {
  try {
    const latest100 = await db.job.findMany({
      select: {
        id: true,
        originId: true,
      },
      where: {
        originSite: "ELE_DUCK",
      },
      orderBy: {
        syncAt: "desc",
      },
      take: 100,
    });
    if (latest100.length === 0) {
      // 第一次抓取
      console.log("第一次抓取");
    }
    const savedOriginIds = latest100.map((item) => item.originId);

    let page = 1;
    const fetchArticles: EleDuckArticle[] = [];
    const syncedIds: string[] = [];

    // 列表
    while (true) {
      if (syncedIds.length > MIN_SYNC_DIFF) {
        break;
      }
      if (fetchArticles.length > MAX_SYNC_CHECK) {
        break;
      }

      const articles = await eleDuckListRoute(page.toString());
      if (!articles?.length) {
        console.log("未抓取到文章");
        break;
      }

      // 同步判断
      articles.forEach((article) => {
        const syncIdx = savedOriginIds.indexOf(article.id);
        if (syncIdx === -1) {
          console.log("未同步过", article.id);
          fetchArticles.push(article);
        } else {
          console.log("已同步过", article.id);
          syncedIds.push(article.id);
        }
        savedOriginIds.splice(syncIdx, 1);
      });

      page += 1;
      // 等待⌛️
      await sleep(randomInt(500, 1000));
    }

    if (!fetchArticles.length) {
      console.log("无新文章");
      return;
    }

    // 详情
    for (const article of fetchArticles) {
      const saveInvalid = async () => {
        console.log("文章摘要无效", article.id);
        const articleData = await db.job.create({
          data: {
            originSite: "ELE_DUCK",
            originId: article.id,
            originUrl: article.href,
            originTitle: article.title,
            invalid: true,
          },
        });
        console.log("无效文章数据已保存", articleData.id);
        await sleep(randomInt(500, 1000));
      };

      // 判断招聘是否有效
      if (!isAvailableCategory(article.category)) {
        await saveInvalid();
        continue;
      }

      console.log("查询文章详情", article.id);
      const abstract = await eleDuckDetailRoute(article.id);
      if (!abstract) {
        await saveInvalid();
        continue;
      }
      console.log("分析文章摘要", article.id);
      const analysis = await withAiAnalysis(
        `${article.title}\n${abstract.content}`,
      );

      if (
        !analysis?.title.trim() ||
        !analysis.content ||
        analysis.content === "无"
      ) {
        await saveInvalid();
        continue;
      }

      console.log("保持文章到数据库", article.id);
      const articleData = await db.job.create({
        data: {
          originSite: "ELE_DUCK",
          originId: article.id,
          originUrl: article.href,
          originTitle: article.title,
          originContent: abstract.content,
          originCreateAt: new Date(article.createdAt),
          originUsername: article.authorName,
          originUserAvatar: article.authorAvatar,
          title: analysis.title,
          tags: {
            create: filterAvailableTags(analysis.tags).map((tag) => ({
              jobTag: {
                connectOrCreate: {
                  create: {
                    name: tag,
                  },
                  where: {
                    name: tag,
                  },
                },
              },
            })),
          },
          generatedContent: analysis.content,
          generatedAt: new Date(),
        },
      });

      console.log("文章数据已保存", articleData.id);
      // 等待⌛️
      await sleep(randomInt(800, 1200));
    }
  } catch (err) {
    console.error("eleDuckDataCapture error", err);
  }
};

export async function grabAction() {
  console.log("抓取开始");
  await v2exDataCapture();
  await eleDuckDataCapture();
  console.log("抓取结束");
}
