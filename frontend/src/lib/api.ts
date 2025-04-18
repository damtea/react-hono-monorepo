import { type ApiRoutes } from "@/server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/", {
  fetch: async (url: RequestInfo | URL, options?: RequestInit) => {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export const api = client.api;
