export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export class ApiClientError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.body = body;
  }
}

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

type QueryValue = string | number | boolean | null | undefined;

const withQuery = (path: string, query?: Record<string, QueryValue>) => {
  const url = new URL(path, getApiBaseUrl());
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData;

export async function apiRequest<T>(
  path: string,
  options?: RequestInit & { query?: Record<string, QueryValue> }
): Promise<ApiEnvelope<T>> {
  const url = withQuery(path, options?.query);

  const headers = new Headers(options?.headers);
  const body = options?.body;

  if (!isFormData(body) && body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const text = await res.text();
  const contentType = res.headers.get('content-type') ?? '';
  const parsed = contentType.includes('application/json') && text ? (JSON.parse(text) as unknown) : text;

  if (!res.ok) {
    const message =
      typeof parsed === 'object' && parsed !== null && 'message' in parsed && typeof (parsed as any).message === 'string'
        ? (parsed as any).message
        : `Request failed with status ${res.status}`;
    throw new ApiClientError(message, res.status, parsed);
  }

  if (typeof parsed !== 'object' || parsed === null || !('success' in parsed) || !('data' in parsed)) {
    throw new ApiClientError('Invalid API response', res.status, parsed);
  }

  return parsed as ApiEnvelope<T>;
}

export async function apiGet<T>(path: string, query?: Record<string, QueryValue>, init?: RequestInit) {
  return apiRequest<T>(path, { ...init, method: 'GET', query });
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...init,
    method: 'POST',
    body: body instanceof FormData ? body : body == null ? undefined : JSON.stringify(body),
  });
}

export async function apiPut<T>(path: string, body?: unknown, init?: RequestInit) {
  return apiRequest<T>(path, {
    ...init,
    method: 'PUT',
    body: body instanceof FormData ? body : body == null ? undefined : JSON.stringify(body),
  });
}

export async function apiDelete<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, { ...init, method: 'DELETE' });
}

