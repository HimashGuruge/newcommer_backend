import Message from "../models/userMessage.js"; 
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL = "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

/**
 * SIM.AI (Gemini) එකෙන් පිළිතුර ලබාගන්නා Function එක
 */
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
    } else if (response.data?.message) {
      aiReply = response.data.message;
    }
    
    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.message);
    return "AI failed to respond. Please try again later.";
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

    // පරිශීලකයාගේ Chat එක සොයා ගැනීම හෝ අලුතින් සෑදීම
    let chat = await Message.findOne({ userId });

    if (!chat) {
      chat = new Message({ userId, messages: [] });
    }

    // User ගේ පණිවිඩය Save කිරීම
    chat.messages.push({ sender: "user", text: message });

    let finalReply = "";

    // Logic: Admin ට ද නැද්ද යන්න පරීක්ෂාව
    if (message.includes("@admin")) {
      chat.isRead = false; 
      finalReply = "I've notified our support team. An admin will get back to you soon.";
    } else {
      // SIM.AI (Gemini) හරහා පිළිතුර ලබා ගැනීම
      finalReply = await getAIReply(message); 
    }

    // AI ගේ පණිවිඩය Save කිරීම
    chat.messages.push({ sender: "ai", text: finalReply });

    const savedChat = await chat.save();

    // සම්පූර්ණ පණිවිඩ ලැයිස්තුව සහ අන්තිමට ලැබුණු AI Reply එක (හඬ සඳහා) යැවීම
    res.status(201).json({ 
      success: true,
      messages: savedChat.messages,
      latestReply: finalReply // 👈 Frontend එකේ හඬ Play කිරීමට මෙය ඉතා වැදගත් වේ
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
    const chat = await Message.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 3. Admin ගේ පිළිතුරු ලබා ගැනීම (Polling සඳහා)
 */
export const getAdminReplies = async (req, res) => {
  try {
    const userId = req.user.id;

    const chat = await Message.findOne({ userId });
    
    if (!chat) return res.status(200).json({ messages: [] });

    // Admin එවූ පණිවිඩ පමණක් filter කර යැවීම (අවශ්‍ය නම් පමණක්)
    // සාමාන්‍යයෙන් මුළු chat එකම යැවීම වඩාත් හොඳයි
    res.status(200).json({
      success: true,
      messages: chat.messages
    });
  } catch (error) {
    console.error("Admin replies fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching admin replies" });
  }
};