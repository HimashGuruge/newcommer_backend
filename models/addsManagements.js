// models/Ads.js
import mongoose from "mongoose";

const AdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["banner", "video", "popup", "native"],
      default: "banner",
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
    },

    videoUrl: {
      type: String,
    },

    targetAudience: {
      type: String,
      default: "All",
    },

    budget: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ads", AdSchema);
