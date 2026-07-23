"use server";

import { cookies } from "next/headers";
import { ILoginPayload, IRegisterPayload, IApiResponse, IUser } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction(
  payload: ILoginPayload,
): Promise<{ success: boolean; error?: string; data?: IUser }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: IApiResponse<{ user: IUser; accessToken: string }> =
      await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Invalid credentials" };
    }

    const { accessToken, user } = result.data;
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    const userId = (user as any)._id || (user as any).id;
    if (userId) {
      cookieStore.set("currentUserId", userId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((cookieString) => {
      if (cookieString.startsWith("refreshToken=")) {
        const tokenValue = cookieString.split(";")[0].split("=")[1];

        cookieStore.set("refreshToken", tokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    });

    return { success: true, data: user };
  } catch (error) {
    console.error("Login Action Error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function registerAction(
  payload: IRegisterPayload,
): Promise<{ success: boolean; error?: string; data?: IUser }> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result: IApiResponse<{ user: IUser; accessToken: string }> =
      await response.json();

    if (!response.ok || !result.success) {
      return { success: false, error: result.message || "Registration failed" };
    }

    const { accessToken, user } = result.data;
    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    const userId = (user as any)._id || (user as any).id;
    if (userId) {
      cookieStore.set("currentUserId", userId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((cookieString) => {
      if (cookieString.startsWith("refreshToken=")) {
        const tokenValue = cookieString.split(";")[0].split("=")[1];
        cookieStore.set("refreshToken", tokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });
      }
    });

    return { success: true, data: user };
  } catch (error) {
    console.error("Register Action Error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction() {
  try {
    await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  } catch (error) {
    console.error("Logout Action Error:", error);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("currentUserId");
  }
}
