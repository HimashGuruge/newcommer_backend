import express from "express";
import { getMessages, sendMessages } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";




const router = express.Router();

router.post("/sendMessages", authMiddleware, sendMessages);
router.get("/getMessages", authMiddleware, getMessages);







export default router;