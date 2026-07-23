import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

export const fetcher = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (response.status === 204) return {} as T;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An error occurred during the request");
  }

  return data;
};
