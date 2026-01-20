import express from "express";
import { getAdminNotifications, getFullChatHistory, markNotificationAsRead, replyToUserNotification,  } from "../controller/notificationController.js";

const router = express.Router();

// URL: /api/notifications/getNotifications
router.get("/getNotifications", getAdminNotifications);

// URL: /api/notifications/reply/:userId
router.post("/reply/:userId", replyToUserNotification);
router.get("/getChat/:userId", getFullChatHistory);

router.post("/markRead", markNotificationAsRead);

export default router;
