import { Request, Response } from "express";
import { ingestDocument } from "../services/ingestion.service";
import fs from "fs";

export const uploadDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No PDF file uploaded" });
      return;
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const result = await ingestDocument(filePath, originalName);

    fs.unlinkSync(filePath);

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to process document" });
  }
};
