// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8788";

type ApiErrorShape = { error?: string };

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as ApiErrorShape).error || "request_failed")
        : "request_failed";
    throw new Error(msg);
  }

  return data as T;
}

export async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const data = (await res.json()) as unknown;

  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as ApiErrorShape).error || "request_failed")
        : "request_failed";
    throw new Error(msg);
  }

  return data as T;
}

/** ✅ Aliases para compatibilidad con el código existente */
export const apiPost = postJSON;
export const apiGet = getJSON;