import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const cookieStore = cookies();

  let res = await fetch(`${API_URL}${input}`, {
    ...init,
    headers: { ...init.headers, cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status !== 401) return res;

  // Refresh token
  const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });

  if (!refreshRes.ok) throw new Error("Session expired");

  // Retry original request
  return fetch(`${API_URL}${input}`, {
    ...init,
    headers: { ...init.headers, cookie: cookieStore.toString() },
    credentials: "include",
    cache: "no-store",
  });
}
