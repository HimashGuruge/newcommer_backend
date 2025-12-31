import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import userRouter from "./routes/usersRouter.js";
import productRouter from "./routes/productsRouter.js";
import orderRouter from "./routes/orderRouter.js";

import dotenv from "dotenv";

import addressRouter from "./routes/addressRouter.js";

import paymentRouter from "./routes/paymentRouter.js";

import messageRouter from "./routes/messageRouter.js";

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (hardcoded for now)

const MongoDB_URI = process.env._M_B_DB;

mongoose
  .connect(MongoDB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.use("/api/orders", orderRouter);

app.use("/api/addresses", addressRouter);

app.use("/api/payment", paymentRouter);

app.use("/api/messages", messageRouter);

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
