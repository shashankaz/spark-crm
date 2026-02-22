import { parentPort } from "worker_threads";
import { calcDashboardStats, calcTenantDashboardStats } from "./tasks.js";

if (!parentPort) {
  throw new Error("This file must be run as a Worker thread");
}

parentPort.on("message", ({ id, task, payload }) => {
  try {
    let result;

    switch (task) {
      case "calcDashboardStats":
        result = calcDashboardStats(payload);
        break;
      case "calcTenantDashboardStats":
        result = calcTenantDashboardStats(payload);
        break;
      default:
        throw new Error(`Unknown task: ${task}`);
    }

    parentPort.postMessage({ id, task, result });
  } catch (err) {
    parentPort.postMessage({
      id,
      task,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});
