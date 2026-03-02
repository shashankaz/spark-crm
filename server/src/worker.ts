import dns from "dns";
import "dotenv/config";

import { Database } from "./utils/db";
import { startLeadExportWorker, startEmailWorker } from "./workers";
import { registerGracefulShutdown } from "./utils/graceful-shut-down";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

Database.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    startLeadExportWorker();
    startEmailWorker();
    console.log("[Worker] All workers started.");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

registerGracefulShutdown("worker process");
