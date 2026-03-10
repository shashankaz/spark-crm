import Redis, { RedisOptions } from "ioredis";
import { env } from "../config/env";

export class RedisService {
  private static client: Redis | null = null;

  private static get options(): RedisOptions {
    return {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USERNAME,
      password: env.REDIS_PASSWORD,
      tls: env.REDIS_TLS ? {} : undefined,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 300, 3000);
      },
    };
  }

  static getClient(): Redis {
    if (!this.client) {
      this.client = new Redis(this.options);

      this.client.once("connect", () => {
        console.log("Connected to Redis");
      });

      this.client.on("reconnecting", () => {
        console.log("Reconnecting to Redis...");
      });

      this.client.on("error", (err) => {
        console.error("Redis error:", err.message);
      });
    }

    return this.client;
  }

  static disconnect(): void {
    if (this.client) {
      this.client.removeAllListeners();
      this.client.disconnect();
      this.client = null;
    }
  }
}

export const redis = RedisService.getClient();
