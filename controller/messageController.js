import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
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

// මැසේජ් එකක් යැවීම
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1️⃣ @admin case (Admin ට මැසේජ් එකක් යන විට)
    if (message.includes("@admin")) {
      await userToAdminMessage.findOneAndUpdate(
        { userId },
        { $push: { messages: { sender: "user", text: message } } },
        { upsert: true }
      );

      return res.status(201).json({
        messages: [
          { sender: "user", text: message, createdAt: new Date() },
          { sender: "ai", text: "Admin will reply soon", createdAt: new Date() },
        ],
      });
    }

    // 2️⃣ Normal AI Chat (අලුත් Schema එකට අනුව)
    let chat = await userMessage.findOne({ userId });

    // User ගේ මැසේජ් එක Object එකක් විදිහට හදනවා
    const userMsgObj = { sender: "user", text: message };

    if (!chat) {
      chat = await userMessage.create({
        userId,
        messages: [userMsgObj], // ✅ Array of Objects
      });
    } else {
      chat.messages.push(userMsgObj);
      await chat.save();
    }

    // AI පිළිතුර ලබා ගැනීම
    const aiReply = await getAIReply(message);
    const aiMsgObj = { sender: "ai", text: aiReply };

    // AI පිළිතුරත් push කරනවා
    chat.messages.push(aiMsgObj);
    await chat.save();

    // Frontend එකට මුළු message array එකම යවනවා
    res.status(201).json({ messages: chat.messages });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// පරණ මැසේජ් සියල්ල ලබා ගැනීම
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    // ✅ දැන් මෙතන map කරන්න ඕන නෑ, Database එකේ දැනටමත් තියෙන්නේ Objects
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin ගේ පිළිතුරු ලබා ගැනීම
export const getAdminReplies = async (req, res) => {

    
  try {
    const userId = req.user.id;
  
    const chat = await userToAdminMessage.findOne({ userId });

    if (!chat || !chat.messages) return res.status(200).json({ messages: [] });

    const adminMessages = chat.messages.filter((msg) => msg.sender === "admin");
    res.status(200).json({ messages: adminMessages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};