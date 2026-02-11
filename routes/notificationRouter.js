import express from "express";
import { 
  getAdminNotifications, 
  getFullChatHistory, 
  replyToUserNotification, 
  markNotificationAsRead,
  getUnreadCount
} from "../controller/notificationController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// 1. "unread-count" රූට් එක අනිවාර්යයෙන්ම ":userId" එකට ඉහළින් තබන්න
router.get("/unread-count", authMiddleware, getUnreadCount);

// 2. අනෙකුත් ස්ථාවර රූට්ස්
router.get("/getNotifications", getAdminNotifications);
router.post("/markRead", markNotificationAsRead);

// 3. ඩයිනමික් (Dynamic) රූට්ස් අගට තබන්න
router.get("/getChat/:userId", getFullChatHistory);
router.post("/reply/:userId", replyToUserNotification);

export default router;