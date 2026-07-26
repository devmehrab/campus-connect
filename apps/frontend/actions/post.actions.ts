"use server";

import { revalidatePath } from "next/cache";
import { fetcher } from "@/lib/fetcher";

export async function createPostAction(formData: FormData) {
  try {
    const result: any = await fetcher("/posts", {
      method: "POST",
      body: formData,
    });

    revalidatePath("/feed");

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Create Post Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updatePostAction(postId: string, formData: FormData) {
  try {
    const result: any = await fetcher(`/posts/${postId}`, {
      method: "PUT",
      body: formData,
    });

    revalidatePath("/feed");
    revalidatePath(`/posts/${postId}`);

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Update Post Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function likePostAction(postId: string) {
  try {
    await fetcher(`/posts/${postId}/like`, {
      method: "PUT",
    });

    revalidatePath("/feed");

    return { success: true };
  } catch (error: any) {
    console.error("Like Post Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deletePostAction(postId: string) {
  try {
    await fetcher(`/posts/${postId}`, {
      method: "DELETE",
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Post Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getPostByIdAction(postId: string) {
  try {
    const result: any = await fetcher(`/posts/${postId}`, {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message };
  }
}
