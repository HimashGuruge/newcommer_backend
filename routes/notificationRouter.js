import express from "express";
import {} from "mongoose";
import {
  getAdminNotifications,
  markAsRead,
  replyNotification,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/getNotifications", getAdminNotifications);

router.post("/markRead/:id", markAsRead);

router.post("/reply/:id", replyNotification);

export default router;
