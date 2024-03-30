import { db } from "@actijob/db";
import { withAiAnalysis } from "../lib/with-ai/analysis";
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
import { randomInt, sleep } from "../lib/utils";
import {
  filterAvailableTags,
  isAvailableCategory,
  isAvailableContent,
} from "./filter";
import logger from "../lib/logger";

// 同步比较最小判断数
const MIN_SYNC_DIFF = 5;

// 最大单次同步数
const MAX_SYNC_CHECK = 300;

const v2exDataCapture = async () => {
  try {
    const latestSlice = await db.job.findMany({
      select: {
        id: true,
        originId: true,
      },
      where: {
        originSite: "V2EX",
      },
      orderBy: {
        originCreateAt: "desc",
      },
      take: MAX_SYNC_CHECK,
    });
    if (latestSlice.length === 0) {
      // 第一次抓取
      logger.info("[V2EX] 第一次抓取");
    }
    const savedOriginIds = latestSlice.map((item) => item.originId);

    let page = 1;
    const fetchArticles = new Map<string, V2EXArticle>();
    const syncedIds: string[] = [];

    // 遍历抓取
    while (true) {
      if (syncedIds.length > MIN_SYNC_DIFF) {
        break;
      }
      if (fetchArticles.size > MAX_SYNC_CHECK) {
        break;
      }

      // 列表
      const articles = await v2exListRoute(page.toString());
      if (!articles?.length) {
        logger.warn("[V2EX] 未抓取到文章");
        break;
      }

      // 同步判断
      articles.forEach((article) => {
        const syncIdx = savedOriginIds.indexOf(article.id);
        if (syncIdx === -1) {
          logger.info(`[V2EX] 未同步过 ${article.id}`);
          fetchArticles.set(article.id, article);
        } else {
          logger.warn(`[V2EX] 已同步过 ${article.id}`);
          syncedIds.push(article.id);
        }
      });

      page += 1;
      // 等待⌛️
      await sleep(randomInt(500, 1000));
    }

    if (!fetchArticles.size) {
      logger.warn("[V2EX] 无新文章");
      return;
    }

    logger.info(`[V2EX] 新文章数量 ${fetchArticles.size}`);

    // 详情
    for (const article of fetchArticles.values()) {
      const saveInvalid = async () => {
        logger.warn(`[V2EX] 文章摘要无效 ${article.id}`);
        const articleData = await db.job.create({
          data: {
            originSite: "V2EX",
            originId: article.id,
            originUrl: article.href,
            originTitle: article.title,
            invalid: true,
          },
        });
        logger.info(`[V2EX] 无效文章数据已保存 ${articleData.id}`);
      };
      // 判断招聘是否有效
      if (!isAvailableContent(article.title)) {
        await saveInvalid();
        continue;
      }

      logger.info(`[V2EX] 查询文章详情 ${article.id}`);
      const abstract = await v2exDetailRoute(article.id);
      if (!abstract) {
        await saveInvalid();
        continue;
      }
      logger.info(`[V2EX] 分析文章摘要 ${article.id}`);
      const analysis = await withAiAnalysis(
        `${article.title}\n${abstract.content}`
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

      logger.info(`[V2EX] 保持文章到数据库 ${article.id}`);
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
          tags: filterAvailableTags(analysis.tags),
          generatedContent: analysis.content,
          generatedAt: new Date(),
        },
      });

      logger.info(`[V2EX] 文章数据已保存 ${articleData.id}`);
      // 等待⌛️
      await sleep(randomInt(800, 1200));
    }
  } catch (err) {
    console.error("[V2EX] 抓取失败 error", err);
  }
};

const eleDuckDataCapture = async () => {
  try {
    const latestSlice = await db.job.findMany({
      select: {
        id: true,
        originId: true,
      },
      where: {
        originSite: "ELE_DUCK",
      },
      orderBy: {
        originCreateAt: "desc",
      },
      take: MAX_SYNC_CHECK,
    });
    if (latestSlice.length === 0) {
      // 第一次抓取
      logger.info("[ELE_DUCK] 第一次抓取");
    }
    const savedOriginIds = latestSlice.map((item) => item.originId);

    let page = 1;
    const fetchArticles = new Map<string, EleDuckArticle>();
    const syncedIds: string[] = [];

    // 列表
    while (true) {
      if (syncedIds.length > MIN_SYNC_DIFF) {
        break;
      }
      if (fetchArticles.size > MAX_SYNC_CHECK) {
        break;
      }

      const articles = await eleDuckListRoute(page.toString());
      if (!articles?.length) {
        logger.warn("[ELE_DUCK] 未抓取到文章");
        break;
      }

      // 同步判断
      articles.forEach((article) => {
        const syncIdx = savedOriginIds.indexOf(article.id);
        if (syncIdx === -1) {
          logger.info(`[ELE_DUCK] 未同步过 ${article.id}`);
          fetchArticles.set(article.id, article);
        } else {
          logger.warn(`[ELE_DUCK] 已同步过 ${article.id}`);
          syncedIds.push(article.id);
        }
      });

      page += 1;
      // 等待⌛️
      await sleep(randomInt(500, 1000));
    }

    if (!fetchArticles.size) {
      logger.warn("无新文章");
      return;
    }

    logger.info(`[ELE_DUCK] 新文章数量 ${fetchArticles.size}`);

    // 详情
    for (const article of fetchArticles.values()) {
      const saveInvalid = async () => {
        logger.warn(`[ELE_DUCK] 文章摘要无效 ${article.id}`);
        const articleData = await db.job.create({
          data: {
            originSite: "ELE_DUCK",
            originId: article.id,
            originUrl: article.href,
            originTitle: article.title,
            invalid: true,
          },
        });
        logger.info(`[ELE_DUCK] 无效文章数据已保存 ${articleData.id}`);
        await sleep(randomInt(500, 1000));
      };

      // 判断招聘是否有效
      if (!isAvailableCategory(article.category)) {
        await saveInvalid();
        continue;
      }

      logger.info(`[ELE_DUCK] 查询文章详情 ${article.id}`);
      const abstract = await eleDuckDetailRoute(article.id);
      if (!abstract) {
        await saveInvalid();
        continue;
      }
      logger.info(`[ELE_DUCK] 分析文章摘要 ${article.id}`);
      const analysis = await withAiAnalysis(
        `${article.title}\n${abstract.content}`
      );

      if (
        !analysis?.title.trim() ||
        !analysis.content ||
        analysis.content === "无"
      ) {
        await saveInvalid();
        continue;
      }

      logger.info(`[ELE_DUCK] 保持文章到数据库 ${article.id}`);
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
          tags: filterAvailableTags(analysis.tags),
          generatedContent: analysis.content,
          generatedAt: new Date(),
        },
      });

      logger.info(`[ELE_DUCK] 文章数据已保存 ${articleData.id}`);
      // 等待⌛️
      await sleep(randomInt(800, 1200));
    }
  } catch (err) {
    console.error("[ELE_DUCK] 抓取失败 error", err);
  }
};

export async function grabAction() {
  logger.info("抓取开始");
  await v2exDataCapture();
  await eleDuckDataCapture();
  logger.info("抓取结束");
}
