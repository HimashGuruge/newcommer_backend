import express from "express";
import { getUserMessages, sendUserMessage } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Send user message + AI reply
router.post("/sendmessage", authMiddleware, sendUserMessage);

// Get all messages for logged-in user
router.get("/getmessages", authMiddleware, getUserMessages);

export default router;
