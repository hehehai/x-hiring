import "dotenv/config";
import { CronJob } from "cron";
import logger from "./lib/logger";
import { env } from "./lib/utils";
import { grabAction } from "./grab";

function boot() {
  try {
    logger.info(`SERVER start env:`, env);

    const job = new CronJob(
      // At 08:00 AM, 10:00 AM, 01:00 PM, 03:00 PM, 06:00 PM and 11:00 PM
      "0 8,10,13,15,18,23 * * *",
      function () {
        logger.info(`CRON start at: ${new Date().toLocaleString()}`);
        grabAction();
      },
      null,
      false,
      "Asia/Shanghai"
    );

    job.start();
  } catch (err) {
    logger.error("SERVER start error:", err);
    process.exit(1);
  }
}

boot();
