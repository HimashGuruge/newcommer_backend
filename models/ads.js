import mongoose from "mongoose";

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },

  category: {
    type: String,
    default: "home",
  },

  status: { type: String, enum: ["active", "paused"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const Ad = mongoose.models.Ad || mongoose.model("Ad", AdSchema);
export default Ad;
