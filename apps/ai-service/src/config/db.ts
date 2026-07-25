import { MongoClient } from "mongodb";
import { config } from "./env";

export const mongoClient = new MongoClient(config.mongoUri);

export async function connectDB() {
  try {
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas");

    return mongoClient.db("campus_connect_ai");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
