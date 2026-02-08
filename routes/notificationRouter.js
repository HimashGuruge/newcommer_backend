import express from "express";
import { 
  getAdminNotifications, 
  getFullChatHistory, 
  replyToUserNotification, 
  markNotificationAsRead // 👈 අලුත් function එක
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/getNotifications", getAdminNotifications);
router.post("/markRead", markNotificationAsRead); // 👈 Notification එක කියවූ බව mark කිරීමට
router.post("/reply/:userId", replyToUserNotification);
router.get("/getChat/:userId", getFullChatHistory);

export default router;