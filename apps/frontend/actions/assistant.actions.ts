"use server";

import { fetcher } from "@/lib/fetcher";

export async function askAssistantAction(message: string) {
  try {
    const result: any = await fetcher(`/assistant/chat`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });

    return result;
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: error.message };
  }
}
