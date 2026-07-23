"use server";

import { fetcher } from "@/lib/fetcher";

import { revalidatePath } from "next/cache";

export async function getUserProfileAction() {
  try {
    const result: any = await fetcher("/users/me", {
      method: "GET",
      cache: "no-store",
    });
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Get Profile Error:", error.message);
    return { success: false, error: error.message };
  }
}
export async function getUserByIdAction(userId: string) {
  try {
    const result = await fetcher(`/users/${userId}`, {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUserPostsAction() {
  try {
    const result: any = await fetcher("/posts/my-posts", {
      method: "GET",
      cache: "no-store",
    });
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Get User Posts Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getSpecificUserPostsAction(userId: string) {
  try {
    const result: any = await fetcher(`/posts/user/${userId}`, {
      method: "GET",
      cache: "no-store",
    });

    return { success: true, data: result.data || result };
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("Get Specific User Posts Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateProfileAction(payload: {
  name?: string;
  bio?: string;
}) {
  try {
    const result: any = await fetcher("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    revalidatePath("/profile");

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Update Profile Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const result: any = await fetcher("/users/me/avatar", {
      method: "PATCH",
      body: formData,
    });

    revalidatePath("/profile");
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Avatar Upload Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getAllUsersAction() {
  try {
    const result: any = await fetcher("/users", {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getReceiverProfileAction(userId: string) {
  try {
    const result: any = await fetcher(`/users/${userId}`, {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message };
  }
}

export async function toggleFollowAction(userId: string) {
  try {
    const result: any = await fetcher(`/users/${userId}/follow`, {
      method: "PUT",
    });

    revalidatePath(`/profile/${userId}`);
    revalidatePath("/profile");
    return { success: true, data: result.data || result };
  } catch (error: any) {
    console.error("Toggle Follow Error:", error.message);
    return { success: false, error: error.message };
  }
}
