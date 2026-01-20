import mongoose from "mongoose";

// models/userToAdminMessage.js
const userToAdminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // ✅ මේක අලුතින් එක් කරන්න
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // මෙතන තියෙන isRead එක මුළු chat එකේම status එක විදිහට පාවිච්චි කරන්න පුළුවන්
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);
export default userToAdminMessage;