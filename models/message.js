import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the user
      required: true,
      ref: "User",
    },



    userEmail: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ["user", "admin", "ai"], // Added "ai" to the enum
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Message = mongoose.model("Message", messageSchema);

export default Message;