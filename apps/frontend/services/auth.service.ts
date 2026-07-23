import { fetcher } from "../lib/fetcher";
import { ILoginPayload, IRegisterPayload } from "../types";
import { cookies } from "next/headers";

export async function getCurrentUserId() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("currentUserId");

  return userIdCookie?.value || null;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("currentUserId");
}

export const AuthService = {
  login: async (payload: ILoginPayload) => {
    const data = await fetcher<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return data;
  },

  logout: async () => {
    await fetcher("/auth/logout", { method: "POST" });
    window.location.href = "/login";
  },
};
