"use server";

export async function askAssistant(
  question: string,
  chatHistory: { role: string; content: string }[],
) {
  try {
    const response = await fetch(`${process.env.AI_SERVICE_URL}/api/rag/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, chatHistory }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from AI backend");
    }

    return await response.json();
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return {
      answer: "Sorry, I am having trouble connecting to the server right now.",
      sources: [],
    };
  }
}
