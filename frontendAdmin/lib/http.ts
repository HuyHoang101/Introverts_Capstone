// src/lib/api/http.ts
import * as SecureStore from 'expo-secure-store';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
  'https://greensyncintroverts.online'; // đổi theo server của bạn

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
};

function buildQuery(params?: ApiOptions['params']) {
  if (!params) return '';
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
}

async function getAccessToken() {
  return SecureStore.getItemAsync('accessToken');
}

export async function api<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const url = `${BASE_URL}${path}${buildQuery(opts.params)}`;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), opts.timeoutMs ?? 15000);

  try {
    const res = await fetch(url, {
      method: opts.method ?? 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opts.headers ?? {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // non-JSON
      data = text;
    }

    if (!res.ok) {
      const error = new Error(
        (data && (data.error || data.message)) || `HTTP ${res.status}`
      ) as any;
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data as T;
  } finally {
    clearTimeout(id);
  }
}
