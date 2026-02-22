import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKER_PATH = join(__dirname, "../worker/index.js");

export class WorkerService {
  static worker = null;
  static pending = new Map();

  static getWorker() {
    if (this.worker) {
      return this.worker;
    }

    this.worker = new Worker(WORKER_PATH);

    this.worker.on("message", ({ id, result, error }) => {
      const pending = this.pending.get(id);
      if (!pending) return;

      this.pending.delete(id);

      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    });

    this.worker.on("error", (err) => {
      console.error("Worker error:", err);
      this.pending.forEach(({ reject }) =>
        reject(new Error("Worker encountered a fatal error")),
      );
      this.pending.clear();
      this.worker = null;
    });

    this.worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker exited with code ${code}`);
        this.pending.forEach(({ reject }) =>
          reject(new Error(`Worker exited with code ${code}`)),
        );
        this.pending.clear();
        this.worker = null;
      }
    });

    return this.worker;
  }

  static run(task, payload) {
    return new Promise((resolve, reject) => {
      const id = `${task}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const worker = this.getWorker();

      this.pending.set(id, { resolve, reject });
      worker.postMessage({ id, task, payload });
    });
  }

  static terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pending.forEach(({ reject }) =>
      reject(new Error("Worker terminated")),
    );
    this.pending.clear();
  }
}
