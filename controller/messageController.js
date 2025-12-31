import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL =
  "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// Utility to get AI reply
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
      if (typeof response.data.output === "string")
        aiReply = response.data.output;
      else if (response.data.output.content)
        aiReply = response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    else if (response.data?.result) aiReply = response.data.result;

    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.response?.data || error.message);
    return "AI failed to respond.";
  }
};

// Send user message + AI reply
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Special @admin case
    if (message.includes("@admin")) {
      const adminMsg = await userToAdminMessage.create({ userId, message });
      // Immediate pseudo reply for user
      return res.status(201).json({
        messages: [`user: ${message}`, `ai: Admin will reply soon`],
        adminMsg,
      });
    }

    // Normal user message
    const formattedUserMessage = `user: ${message}`;
    let chat = await userMessage.findOne({ userId });

    if (!chat) {
      chat = await userMessage.create({
        userId,
        message: [formattedUserMessage],
      });
    } else {
      chat.message.push(formattedUserMessage);
      await chat.save();
    }

    // Get AI reply
    const aiReply = await getAIReply(message);
    const formattedAIReply = `ai: ${aiReply}`;

    // Save AI reply in the same chat
    chat.message.push(formattedAIReply);
    await chat.save();

    // Return full conversation
    res.status(201).json({ messages: chat.message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all messages by userId
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(404).json({ messages: [] });

    res.status(200).json({ messages: chat.message }); // return full conversation array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};






