import { Database } from "./db";
import { RedisService } from "./redis";

export const registerGracefulShutdown = (label: string): void => {
  const handler = async () => {
    console.log(`\n🛑 SIGTERM/SIGINT received. Shutting down ${label}...`);

    Database.disconnect()
      .then(() => {
        console.log("🔌 MongoDB disconnected");
      })
      .catch((error) => {
        console.error("❌ Error disconnecting MongoDB:", error);
      });

    RedisService.disconnect();

    process.exit(0);
  };

  process.on("SIGINT", handler);
  process.on("SIGTERM", handler);
};
