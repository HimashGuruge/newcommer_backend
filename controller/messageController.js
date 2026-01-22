import Message from "../models/userMessage.js"; // 👈 අනිවාර්යයෙන්ම මෙය පාවිච්චි කරන්න
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL = "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// AI එකෙන් පිළිතුරක් ලබාගන්නා Function එක
const getAIReply = async (userText) => {
  try {
    const response = await axios.post(
      SIM_WORKFLOW_URL,
      { input: userText },
      {
        headers: {
          "X-API-Key": SIM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    let aiReply = "No response from AI.";
    if (response.data?.output) {
      aiReply = typeof response.data.output === "string" ? response.data.output : response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    
    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.message);
    return "AI failed to respond.";
  }
};

/**
 * 1. මැසේජ් එකක් යැවීම (User & AI/Admin logic)
 */
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // එකම Unified Model එකෙන් Chat එක සොයා ගැනීම
    let chat = await Message.findOne({ userId });

    if (!chat) {
      chat = new Message({ userId, messages: [] });
    }

    // User ගේ පණිවිඩය ඇතුළු කිරීම
    chat.messages.push({ sender: "user", text: message });

    // Logic: Admin ට ද නැද්ද යන්න පරීක්ෂාව
    if (message.includes("@admin")) {
      chat.isRead = false; 
      chat.messages.push({
        sender: "ai",
        text: "I've notified our support team. An admin will get back to you soon.",
      });
    } else {
      const aiReply = await getAIReply(message); 
      chat.messages.push({ sender: "ai", text: aiReply });
    }

    const savedChat = await chat.save();

    // සම්පූර්ණ පණිවිඩ ලැයිස්තුවම ආපසු යැවීම
    res.status(201).json({ 
      success: true,
      messages: savedChat.messages 
    });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * 2. පරිශීලකයාගේ සියලුම පණිවිඩ ලබා ගැනීම
 */
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    // මෙතනත් අලුත් Message model එකම පාවිච්චි කළ යුතුය
    const chat = await Message.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: error.message });
  }
};


