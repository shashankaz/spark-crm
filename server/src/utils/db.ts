import mongoose from "mongoose";
import { env } from "../config/env";

export class Database {
  static connection: typeof mongoose | null = null;

  static async connect() {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }

    try {
      const uri = env.MONGODB_URI;
      if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      this.connection = await mongoose.connect(uri, {
        dbName: "spark",
      });

      return this.connection;
    } catch (error) {
      throw error;
    }
  }

  static async disconnect() {
    if (!this.connection) {
      return Promise.resolve();
    }

    try {
      await mongoose.disconnect();
      this.connection = null;
    } catch (error) {
      throw error;
    }
  }
}
