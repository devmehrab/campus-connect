import fs from "fs";
import path from "path";
import { LlamaParseReader } from "llama-cloud-services";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { mongoClient } from "../config/db";
import { LocalEmbeddings } from "../utils/embeddings";

export async function ingestDocument(
  filePath: string,
  originalFileName: string,
) {
  const ext = path.extname(originalFileName).toLowerCase();
  let chunks: Document[] = [];

  if (ext === ".pdf") {
    const reader = new LlamaParseReader({
      apiKey: process.env.LLAMA_CLOUD_API_KEY,
      resultType: "markdown",
    });

    const parsedDocuments = await reader.loadData(filePath);
    const rawMarkdownText = parsedDocuments.map((doc) => doc.text).join("\n\n");

    if (!rawMarkdownText || rawMarkdownText.trim() === "") {
      throw new Error("No text could be extracted from this PDF.");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
    });

    chunks = await splitter.createDocuments(
      [rawMarkdownText],
      [{ source: originalFileName }],
    );
  } else if (ext === ".json") {
    const rawJson = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(rawJson);

    if (Array.isArray(parsedData)) {
      chunks = parsedData.map(
        (item) =>
          new Document({
            pageContent: JSON.stringify(item, null, 2),
            metadata: { source: originalFileName },
          }),
      );
    } else {
      chunks = [
        new Document({
          pageContent: JSON.stringify(parsedData, null, 2),
          metadata: { source: originalFileName },
        }),
      ];
    }

    if (chunks.length === 0) {
      throw new Error("No valid JSON structure found in this file.");
    }
  } else {
    throw new Error(
      `Unsupported file format: "${ext}". Currently supported: .pdf, .json`,
    );
  }

  const embeddings = new LocalEmbeddings();

  const collection = mongoClient.db("campus-connect").collection("vectors");

  await MongoDBAtlasVectorSearch.fromDocuments(chunks, embeddings, {
    collection: collection as any,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  return {
    message: "File ingested successfully!",
    fileType: ext,
    chunksCreated: chunks.length,
  };
}
