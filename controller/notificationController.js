import Message from "../models/userMessage.js"; // 👈 අලුත් Unified Model එක

// 1. Admin හට ලැබෙන notifications (සියලුම users ලාගෙන් ලැබුණු මැසේජ්)
export const getAdminNotifications = async (req, res) => {
  try {
    // 1. .populate භාවිතා කර User model එකෙන් image එක සහ නම ලබාගන්න
    // මෙහි "userId" යනු Message Schema එකේ ඔබ User model එකට ref කර ඇති නමයි.
    const allChats = await Message.find()
      .populate("userId", "name profileImage") 
      .sort({ updatedAt: -1 });
    
    const notifications = allChats.map(doc => {
      const lastMsg = doc.messages[doc.messages.length - 1];
      
      return {
        _id: doc._id,
        userId: doc.userId?._id || doc.userId, // userId එක object එකක් ලෙස ලැබෙන බැවිනි
        userName: doc.userId?.name || "Unknown User", // පරිශීලක නම
        userImage: doc.userId?.profileImage || null, // පරිශීලක රූපය (Image URL)
        message: lastMsg ? lastMsg.text : "No messages yet",
        isRead: doc.isRead || false, 
        updatedAt: doc.updatedAt, // Frontend එකේ sorting වලට වැදගත් වේ
        sentAt: lastMsg ? lastMsg.createdAt : doc.updatedAt
      };
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Admin විසින් රිප්ලයි කිරීම (Admin Reply Logic)
export const replyToUserNotification = async (req, res) => {
  try {
    const { userId } = req.params; 
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // එකම Unified Model එකට Admin ගේ රිප්ලයි එක push කිරීම
    const chat = await Message.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: { 
            sender: "admin", 
            text: message,
            createdAt: new Date()
          } 
        },
        $set: { isRead: true } // Admin කියෙව්වා සහ රිප්ලයි කළා ලෙස සලකුණු කරයි
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found" });
    }

    res.status(200).json({ success: true, messages: chat.messages });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. සම්පූර්ණ Chat ඉතිහාසය ලබා ගැනීම (Admin Panel එක සඳහා)
export const getFullChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await Message.findOne({ userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};