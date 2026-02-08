import Message from "../models/userMessage.js"; // 👈 අලුත් Unified Model එක

// 1. Admin හට ලැබෙන notifications (සියලුම users ලාගෙන් ලැබුණු මැසේජ්)
export const getAdminNotifications = async (req, res) => {
  try {
    // 1. සියලුම chat threads ලබාගෙන User විස්තර populate කිරීම
    const allChats = await Message.find()
      .populate("userId", "name profileImage")
      .sort({ updatedAt: -1 });

    let individualNotifications = [];

    // 2. හැම thread එකකම තියෙන පණිවිඩ එකින් එක වෙන් කර ගැනීම
    allChats.forEach(doc => {
      doc.messages.forEach(msg => {
        // අපි පෙන්වන්නේ User එවපු පණිවිඩ පමණක් නම්:
        if (msg.sender === "user") {
          individualNotifications.push({
            _id: msg._id, // Message එකේ unique ID එක
            userId: doc.userId?._id || doc.userId,
            userName: doc.userId?.name || "Unknown User",
            userImage: doc.userId?.profileImage || null,
            message: msg.text, // මේ පේළියේ පෙන්වන මැසේජ් එක
            isRead: msg.isRead || doc.isRead, 
            sentAt: msg.createdAt,
            // 👇 වැදගත්ම කොටස: මේ මැසේජ් එක අයිති මුළු conversation එකම මෙතනට දානවා
            fullHistory: doc.messages 
          });
        }
      });
    });

    // 3. අලුත්ම පණිවිඩය මුලට එන ලෙස Sort කිරීම
    individualNotifications.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    res.status(200).json(individualNotifications);
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







export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.body; // Frontend එකෙන් body එකේ එවන userId

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // අදාළ userId එකට ඇති chat document එකේ isRead field එක true කිරීම
    const updatedChat = await Message.findOneAndUpdate(
      { userId: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ error: "Chat thread not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Notification marked as read" 
    });

  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



