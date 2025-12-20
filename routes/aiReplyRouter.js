import express from "express";
import { adminMessage, simChat } from "../controller/aiReplyController.js";
import authMiddleware from "../middleware.js";


const router = express.Router();

router.post("/reply", authMiddleware, simChat)
router.post("/message", authMiddleware, adminMessage)






export default router;