import mongoose from "mongoose";

const userToAdminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);

export default userToAdminMessage;
