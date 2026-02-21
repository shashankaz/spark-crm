import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { AppError } from "./utils/app-error.js";
import { Database } from "./utils/db.js";
import router from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

const PORT = env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(helmet());
app.use(cookieParser());

morgan.token("localdate", function () {
  const now = new Date();
  return now.toISOString().replace("Z", "");
});
app.use(
  morgan(
    ':remote-addr - :remote-user [:localdate] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"',
  ),
);

Database.connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ status: true, message: "API is Live!", uptime: process.uptime() });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/v1", router);

app.use((req, res, next) => {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const gracefulShutdown = async () => {
  console.log("\n🛑 SIGTERM/SIGINT received. Shutting down server...");

  Database.disconnect()
    .then(() => {
      console.log("🔌 MongoDB disconnected");
    })
    .catch((error) => {
      console.error("❌ Error disconnecting MongoDB:", error);
    });

  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
