import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = ["MONGO_URI", "GEMINI_API_KEY"];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
}

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI as string,
  geminiApiKey: process.env.GEMINI_API_KEY as string,
};
