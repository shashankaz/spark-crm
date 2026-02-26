import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dns from "dns";
import "dotenv/config";

import { AppError } from "./shared/app-error";
import { Database } from "./utils/db";
import { router } from "./routes/index";
import { env } from "./config/env";
import { globalErrorHandler } from "./middlewares/global-error.middleware";
import { registerGracefulShutdown } from "./utils/graceful-shut-down";

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

dns.setServers(["1.1.1.1", "8.8.8.8"]);
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

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: true, message: "API is Live!", uptime: process.uptime() });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/v1", router);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
});

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server Error",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

registerGracefulShutdown("server");
