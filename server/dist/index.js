"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dns_1 = __importDefault(require("dns"));
require("dotenv/config");
const app_error_js_1 = require("./shared/app-error.js");
const db_js_1 = require("./utils/db.js");
const index_js_1 = require("./routes/index.js");
const env_js_1 = require("./config/env.js");
const global_error_middleware_js_1 = require("./middlewares/global-error.middleware.js");
const app = (0, express_1.default)();
const PORT = env_js_1.env.PORT || 5000;
const allowedOrigins = ["http://localhost:5173"];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));
dns_1.default.setServers(["1.1.1.1", "8.8.8.8"]);
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
morgan_1.default.token("localdate", function () {
    const now = new Date();
    return now.toISOString().replace("Z", "");
});
app.use((0, morgan_1.default)(':remote-addr - :remote-user [:localdate] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"'));
db_js_1.Database.connect()
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
app.use("/api/v1", index_js_1.router);
app.use((req, _res, next) => {
    next(new app_error_js_1.AppError(`Not found - ${req.originalUrl}`, 404));
});
app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json(Object.assign({ success: false, message: err.message || "Server Error" }, (env_js_1.env.NODE_ENV === "development" && { stack: err.stack })));
});
app.use(global_error_middleware_js_1.globalErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("\n🛑 SIGTERM/SIGINT received. Shutting down server...");
    db_js_1.Database.disconnect()
        .then(() => {
        console.log("🔌 MongoDB disconnected");
    })
        .catch((error) => {
        console.error("❌ Error disconnecting MongoDB:", error);
    });
    process.exit(0);
});
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
