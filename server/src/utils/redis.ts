import Redis, { RedisOptions } from "ioredis";

export class RedisService {
  private static client: Redis | null = null;

  private static get options(): RedisOptions {
    return {
      host: "127.0.0.1",
      port: 6379,
      username: "default",
      maxRetriesPerRequest: null,
      lazyConnect: true,
    };
  }

  static getClient(): Redis {
    if (!this.client) {
      this.client = new Redis(this.options);

      this.client.on("connect", () => {
        console.log("Connected to Redis");
      });

      this.client.on("error", (err) => {
        console.error("Redis error:", err);
      });
    }

    return this.client;
  }

  static disconnect(): void {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

export const redis = RedisService.getClient();
