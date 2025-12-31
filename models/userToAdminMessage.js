import mongoose from "mongoose";

const userToAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // එක් user කෙනෙක්ට තියෙන්නේ එක chat document එකයි
    },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"] },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);
export default userToAdminMessage;