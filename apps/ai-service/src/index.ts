import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { config } from "./config/env";
import ragRoutes from "./routes/rag.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "ai-service" });
});

app.use("/api/rag", ragRoutes);

async function startServer() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`AI Service is running on http://localhost:${config.port}`);
  });
}

startServer();
