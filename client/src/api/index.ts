import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

interface RetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const refreshToken = async (signal?: AbortSignal): Promise<void> => {
  await api.post("/auth/refresh", null, { signal });
};

let isRefreshing = false;

let requestQueue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
  config: RetryRequestConfig;
}[] = [];

const processQueue = (error?: unknown) => {
  requestQueue.forEach(async ({ resolve, reject, config }) => {
    if (config.signal?.aborted) {
      reject(new DOMException("Request aborted", "AbortError"));
      return;
    }

    if (error) {
      reject(error);
    } else {
      resolve(await api(config));
    }
  });

  requestQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (originalRequest.signal?.aborted) {
      return Promise.reject(new DOMException("Request aborted", "AbortError"));
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const activeController = new AbortController();

    const timeoutId = setTimeout(() => activeController.abort(), 5000);

    try {
      await refreshToken(activeController.signal);

      processQueue();
      return api(originalRequest);
    } catch (error) {
      processQueue(error);
      return Promise.reject(error);
    } finally {
      clearTimeout(timeoutId);
      isRefreshing = false;
    }
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);
