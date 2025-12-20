// models/AdminMessage.js
import mongoose from "mongoose";

const adminMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to your User model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false, // Admin or user can mark it as read
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminMessage = mongoose.model("AdminMessage", adminMessageSchema);
export default AdminMessage;
