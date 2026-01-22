import mongoose from "mongoose";

// 1️⃣ තනි මැසේජ් එකක් සඳහා වෙනම Schema එකක් (Sub-schema)
const singleMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "ai", "admin"], // කවුද එවන්නේ කියලා හරියටම fix කරලා තියෙනවා
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // ✅ මෙන්න අපි හොයපු Timestamp එක!
    },
  },
  { _id: true } // Sub-document වලට අමුතුවෙන් ID ඕන නෑ (Database එක cleanව තියාගන්න)
);

// 2️⃣ Main Schema එක
const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // එක් User කෙනෙක්ට එක් Chat history එකයි
    },

    // String Array එක වෙනුවට Object Array එකක්
    messages: {
      type: [singleMessageSchema], 
      default: [],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // මුළු Chat එකේම last update එක බලාගන්න
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;