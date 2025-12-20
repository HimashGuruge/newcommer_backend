import AdminMessage from "../models/adminMessage.js";
import Message from "../models/message.js";

// 1️⃣ Get all admin notifications
export async function getAdminNotifications(req, res) {
  try {
    const notifications = await AdminMessage.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({ error: error.message });
  }
}

// 2️⃣ Mark a notification as read
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    await AdminMessage.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}

// 3️⃣ Reply to a notification (send a message to the user)
export const replyNotification = async (req, res) => {
  const { id } = req.params; // userId
  const { message } = req.body;

  try {
    const updatedChat = await Message.findOneAndUpdate(
      { userId: id },
      {
        $push: {
          messages: {
            sender: "admin",
            text: message,
            timestamp: new Date(),
          },
        },
      },
      {
        new: true, // return updated document
        upsert: true, // create if not exists
      }
    );

    res.status(200).json({
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    console.error("Reply notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
};
