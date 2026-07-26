"use server";

import { revalidatePath } from "next/cache";
import { fetcher } from "@/lib/fetcher";

export async function getCommentsAction(postId: string) {
  try {
    const result: any = await fetcher(`/comments/${postId}`, {
      method: "GET",
    });

    const commentsArray = Array.isArray(result.data)
      ? result.data
      : result.data?.data || [];

    return { success: true, data: commentsArray };
  } catch (error: any) {
    console.error("Get Comments Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function addCommentAction(postId: string, content: string) {
  try {
    const result: any = await fetcher(`/comments/${postId}`, {
      method: "POST",
      body: JSON.stringify({ postId, content }),
    });

    revalidatePath("/feed");

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Add Comment Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateCommentAction(commentId: string, content: string) {
  try {
    const result: any = await fetcher(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });

    revalidatePath("/feed");

    return { success: true, data: result.data };
  } catch (error: any) {
    console.error("Update Comment Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteCommentAction(commentId: string) {
  try {
    await fetcher(`/comments/${commentId}`, {
      method: "DELETE",
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Comment Error:", error.message);
    return { success: false, error: error.message };
  }
}
