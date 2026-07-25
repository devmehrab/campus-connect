import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { uploadDocument } from "../controllers/rag.controller";
import { handleQuery } from "../controllers/chat.controller";

const router = Router();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });
router.post("/upload", upload.single("document"), uploadDocument);
router.post("/chat", handleQuery);
export default router;
