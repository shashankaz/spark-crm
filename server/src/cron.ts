import "dotenv/config";

import { Database } from "./utils/db";
import { startLeadReminderJob } from "./jobs";
import { registerGracefulShutdown } from "./utils/graceful-shut-down";

Database.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    startLeadReminderJob();
    console.log("[Cron] All cron jobs started.");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

registerGracefulShutdown("cron process");
