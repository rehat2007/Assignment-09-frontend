import { headers } from "next/headers";

export type ApiMeta = Record<string, unknown>;

export type ApiEnvelope<T> = {
  data: T;
  meta: ApiMeta;
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown[];
  };
};

type ApiFetchOptions = {
  /** ISR window for public data. Ignored when cookies or `cache` are used. */
  revalidate?: number;
  /** Cache tags that can be invalidated after catalog mutations. */
  tags?: string[];
  /** Forward the browser cookie and opt out of caching. */
  withCookies?: boolean;
  cache?: RequestCache;
  searchParams?: Record<string, string | number | undefined>;
};

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiEnvelope<T>> {
  const url = new URL(path, `${API_URL.replace(/\/+$/, "")}/`);

  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const cookie = options.withCookies
    ? ((await headers()).get("cookie") ?? "")
    : "";

  const init: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {};

  if (cookie) {
    init.headers = { cookie };
  }

  if (options.cache) {
    init.cache = options.cache;
  } else if (options.withCookies) {
    init.cache = "no-store";
  } else {
    init.next = {
      revalidate: options.revalidate ?? 60,
      ...(options.tags ? { tags: options.tags } : {}),
    };
  }

  const response = await fetch(url, init);
  const body = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | ApiErrorBody
    | null;

  if (!response.ok) {
    const error = body && "error" in body ? body.error : undefined;

    throw new ApiRequestError(
      response.status,
      error?.message ?? `API request failed with ${response.status}.`,
      error?.code,
    );
  }

  if (!body || !("data" in body)) {
    throw new ApiRequestError(502, "The API returned an invalid response.");
  }

  return body;
}
