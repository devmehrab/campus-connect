"use server";

import { fetcher } from "@/lib/fetcher";

export async function getMessagesAction(receiverId: string) {
  try {
    const result: any = await fetcher(`/messages/${receiverId}`, {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: error.message };
  }
}

export async function sendMessageAction(receiverId: string, text: string) {
  try {
    const result: any = await fetcher(`/messages/send/${receiverId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: error.message };
  }
}

export async function getConversationsAction() {
  try {
    const result: any = await fetcher(`/messages/conversations`, {
      method: "GET",
    });
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
