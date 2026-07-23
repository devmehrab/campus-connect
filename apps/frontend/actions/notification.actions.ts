"use server";

import { fetcher } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export async function getNotificationsAction(page = 1, limit = 10) {
  try {
    const result: any = await fetcher(
      `/notifications?page=${page}&limit=${limit}`,
      {
        method: "GET",
      },
    );
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message };
  }
}

export async function markAllAsReadAction() {
  try {
    const result: any = await fetcher("/notifications/read-all", {
      method: "PATCH",
    });
    revalidatePath("/notifications");
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message };
  }
}

export async function markSingleAsReadAction(notificationId: string) {
  try {
    const result: any = await fetcher(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });

    revalidatePath("/notifications");

    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return { success: false, error: error.message };
  }
}
