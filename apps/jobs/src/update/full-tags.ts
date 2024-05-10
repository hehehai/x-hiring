// 每次读取 10 条数据， 分页请求， 条件： 有效、fullTags 为空
// 分析每个 job 的 fullTags， 更新到数据库

import { db } from "@actijob/db";
import { getFullTags } from "../lib/utils";
import logger from "../lib/logger";

async function update() {
  logger.info(`Start update: fullTags...`);
  try {
    let lastCursor = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
      logger.info(`Start update: ${lastCursor || "start"}`);
      const params: Parameters<typeof db.job.findMany>[0] = {
        where: {
          invalid: false,
          fullTags: {
            isEmpty: true,
          },
        },
        select: {
          id: true,
          title: true,
          tags: true,
        },
        take: 3200,
      };
      if (lastCursor) {
        params.cursor = {
          id: lastCursor,
        };
      }

      const jobs = await db.job.findMany(params);
      if (jobs.length === 0) {
        logger.info(`Start update: fullTags finished`);
        break;
      }
      lastCursor = jobs[jobs.length - 1].id;
      for (const job of jobs) {
        const fullTags = getFullTags(job.title || "", job.tags);
        await db.job.update({
          where: {
            id: job.id,
          },
          data: {
            fullTags,
          },
        });
      }
    }
  } catch (error) {
    logger.error(`Start update: ${error}`);
    console.error(error);
    process.exit(1);
  }
}

update();
