import { toast } from "sonner";

import { env } from "~/env";
import * as m from "~/i18n/messages";
import { HttpError } from "~/utils/error";
import { getAccessTokenFromSession } from "~/utils/session";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  searchParams?: Record<string, string>;
}

async function readBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as unknown;
  }
  const text = await response.text();
  return text === "" ? undefined : text;
}

function messageFor(status: number, data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "object" && data !== null && "message" in data) {
    const { message } = data;
    if (typeof message === "string") {
      return message;
    }
  }
  return `Request failed with status ${String(status)}`;
}

async function request<T>(
  path: string,
  { body, searchParams, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), `${env.API_URL}/`);
  for (const [key, value] of Object.entries(searchParams ?? {})) {
    url.searchParams.set(key, value);
  }

  const accessToken = await getAccessTokenFromSession();

  // Headers, not an object literal: RequestOptions["headers"] is HeadersInit,
  // which may be an array of tuples and cannot be safely spread.
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await readBody(response);
    if (response.status === 401) {
      toast.error(m.authSessionExpiredTitle(), {
        description: m.authSessionExpiredMessage(),
      });
    }
    throw new HttpError(
      response.status,
      messageFor(response.status, data),
      data,
    );
  }

  return (await readBody(response)) as T;
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export type HttpClient = typeof httpClient;
