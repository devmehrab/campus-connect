import { Request, Response } from "express";
import { generateAnswer } from "../services/chat.service";

export const handleQuery = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { question, chatHistory } = req.body;

    if (!question || typeof question !== "string") {
      res.status(400).json({ error: "A valid question string is required." });
      return;
    }

    const result = await generateAnswer(question, chatHistory || []);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in Query Controller:", error);
    res.status(500).json({
      error: "An internal server error occurred while processing the query.",
    });
  }
};
