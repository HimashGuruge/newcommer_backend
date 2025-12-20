import Message from "../models/message.js";

// POST /api/messages/sendMessages
export async function sendMessages(req, res) {
  try {
    const user = req.user;
    const userId = user.id;
    const { text, sender } = req.body; // match frontend

    if (!text) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chat = await Message.findOne({ userId });

    const newMessage = {
      sender: sender || "user", // default to 'user'
      text,
      timestamp: new Date()
    };

    if (!chat) {
      // Create new chat
      chat = new Message({
        userId,
        userEmail: user.email,
        messages: [newMessage]
      });
    } else {
      chat.messages.push(newMessage);
    }

    await chat.save();

    res.status(200).json({
      success: true,
      messageData: newMessage
    });
  } catch (error) {
    console.error("sendMessages error:", error);
    res.status(500).json({ error: error.message });
  }
}

// GET /api/messages/getMessages
export async function getMessages(req, res) {
  try {
    const user = req.user;
    const userId = user.id;

    const chat = await Message.findOne({ userId });

    if (!chat) {
      return res.status(200).json({ success: true, messages: [] }); // return empty array
    }

    res.status(200).json({
      success: true,
      messages: chat.messages
    });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ error: error.message });
  }
}
