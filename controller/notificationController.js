// controller/notificationController.js

import userToAdminMessage from "../models/userToAdminMessage.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const allMessages = await userToAdminMessage.find().sort({ updatedAt: -1 });
    
    const notifications = allMessages.map(doc => {
      const lastMsg = doc.messages[doc.messages.length - 1];
      return {
        _id: doc._id,
        userId: doc.userId,
        message: lastMsg.text,
        // ✅ අන්තිම මැසේජ් එකේ isRead අගය කෙලින්ම යවන්න
        isRead: lastMsg.isRead || false, 
        sentAt: lastMsg.createdAt
      };
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.body; // ඔයා Frontend එකෙන් එවන්නේ userId එක

    // සියලුම user messages read ලෙස mark කිරීම
    await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $set: { "messages.$[elem].isRead": true, isRead: true } 
      },
      { 
        arrayFilters: [{ "elem.sender": "user" }], 
        new: true 
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// controller/notificationController.js

export const replyToUserNotification = async (req, res) => {
  try {
    const { userId } = req.params; // URL එකෙන් userId එක ගනී (:userId)
    const { message } = req.body;  // Frontend එකෙන් එවන පණිවිඩය

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // 1. User ගේ chat document එක සොයාගෙන පණිවිඩය ඇතුළත් කිරීම
    const chat = await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: { 
            sender: "admin", 
            text: message,
            isRead: true // Admin යවන මැසේජ් එක Admin ටම Notification එකක් වෙන්නේ නැති නිසා true කරයි
          } 
        },
        // 2. මුළු Chat එකම 'Read' ලෙස සලකුණු කරයි (Notification Badge එක අයින් වීමට)
        $set: { isRead: true } 
      },
      { new: true } // Update වූ පසු අලුත් දත්ත ලබා ගැනීමට
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found for this user" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: error.message });
  }
};










export const getFullChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await userToAdminMessage.findOne({ userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages); // සියලුම පණිවිඩ Array එක යවයි
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};