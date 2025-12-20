import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    altNames: {
      type: [String],
      default: [],
    },

    images: {
      type: [String], // store URLs or file paths
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    lastPrices: {
      type: Number, // keep history of past prices
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
    },

    brand: {
      type: String,
      default: "Unbranded",
    },

    status: {
      type: String,
      enum: ["pending", "ready", "delivered"], // allowed values
      default: "pending", // default status
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
