import axios from "axios";
import User from "../models/users.js";
import AdminMessage from "../models/adminMessage.js";
import Message from "../models/message.js";

/* ⚠️ NOTE: move this to .env in production */
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL =
  "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

/* ======================================================
   🤖 AI CHAT (USER -> AI)
====================================================== */
export async function simChat(req, res) {
  const userInput = req.body.query;

  if (!userInput || !userInput.trim()) {
    return res.status(400).json({
      success: false,
      error: "Input is required",
    });
  }

  try {
    const response = await axios.post(
      SIM_WORKFLOW_URL,
      { input: userInput },
      {
        headers: {
          "X-API-Key": SIM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    let reply = "No response from AI.";

    if (response.data?.output) {
      if (typeof response.data.output === "string") {
        reply = response.data.output;
      } else if (response.data.output?.content) {
        reply = response.data.output.content;
      }
    } else if (response.data?.message) {
      reply = response.data.message;
    } else if (response.data?.result) {
      reply = response.data.result;
    }

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("❌ SIM.AI Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to connect to AI workflow",
    });
  }
}

/* ======================================================
   📩 USER -> ADMIN
====================================================== */
export async function adminMessage(req, res) {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const adminMsg = new AdminMessage({
      userId,
      message: message.trim(),
    });

    await adminMsg.save();

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/* ======================================================
   📤 ADMIN -> USER (REPLY)
====================================================== */
export async function adminReplyMessage(req, res) {
  try {
    const adminId = req.user.id;
    const { userId, text } = req.body; // <-- match frontend

    if (!userId || !text?.trim()) {
      return res.status(400).json({ message: "Invalid input" });
    }

    let chat = await Message.findOne({ userId });

    if (!chat) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      chat = new Message({
        userId,
        adminId,
        userEmail: user.email,
        messages: [],
      });
    }

    chat.messages.push({
      sender: "admin",
      text: text.trim(),
      timestamp: new Date(),
    });

    await chat.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

