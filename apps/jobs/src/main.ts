import "dotenv/config";
import { CronJob } from "cron";
import logger from "./lib/logger";
import { env } from "./lib/utils";
import { grabHighFrequencyAction, grabLowFrequencyAction } from "./grab";

function boot() {
  if (!process.env.GEMINI_AI_API_KEY) {
    throw new Error("GEMINI_AI_API_KEY is not set");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  try {
    logger.info(`SERVER start env:`, env);

    const jobHighFrequency = new CronJob(
      // At 08:00 AM, 10:00 AM, 01:00 PM, 03:00 PM, 06:00 PM and 11:00 PM
      "0 8,10,13,15,18,23 * * *",
      function () {
        logger.info(`CRON start at: ${new Date().toLocaleString()}`);
        grabHighFrequencyAction();
      },
      null,
      false,
      "Asia/Shanghai"
    );

    jobHighFrequency.start();

    const jobLowFrequency = new CronJob(
      // At 12 AM
      "0 12 * * *",
      function () {
        logger.info(`CRON start at: ${new Date().toLocaleString()}`);
        grabLowFrequencyAction();
      },
      null,
      false,
      "Asia/Shanghai"
    );

    jobLowFrequency.start();
  } catch (err) {
    logger.error("SERVER start error:", err);
    process.exit(1);
  }
}

boot();
