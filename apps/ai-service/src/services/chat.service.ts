import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { LocalEmbeddings } from "../utils/embeddings";
import { mongoClient } from "../config/db";

export const generateAnswer = async (
  question: string,
  chatHistory: { role: string; content: string }[] = [],
) => {
  const embeddings = new LocalEmbeddings();
  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: mongoClient.db("campus-connect").collection("vectors") as any,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  });

  const formattedHistory = chatHistory.map((msg) =>
    msg.role === "user"
      ? new HumanMessage(msg.content)
      : new AIMessage(msg.content),
  );

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Given a chat history and the latest user question, formulate a standalone question that can be understood without the chat history. 
    If the question is already self-contained, return it EXACTLY as it is. 
    Do NOT answer the question, just reformulate it if necessary.`,
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
  ]);

  const rephraseChain = RunnableSequence.from([
    contextualizeQPrompt,
    llm,
    new StringOutputParser(),
  ]);

  const qaPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful AI assistant for Campus Connect.
    Use the following pieces of retrieved context to answer the question.
    If you don't know the answer, just say that you don't know.
    
    Context:
    {context}`,
    ],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
  ]);

  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: async (input: { question: string; chat_history: any[] }) => {
        const standaloneQuery =
          input.chat_history.length > 0
            ? await rephraseChain.invoke(input)
            : input.question;

        const docs = await vectorStore
          .asRetriever({ k: 10 })
          .invoke(standaloneQuery);

        return docs;
      },
    }),

    RunnablePassthrough.assign({
      answer: RunnableSequence.from([
        (input) => ({
          ...input,
          context: input.context
            .map((doc: any) => doc.pageContent)
            .join("\n\n"),
        }),
        qaPrompt,
        llm,
        new StringOutputParser(),
      ]),
    }),
  ]);

  const response = await ragChain.invoke({
    question: question,
    chat_history: formattedHistory,
  });

  return {
    answer: response.answer,
    sources: response.context,
  };
};
