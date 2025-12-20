import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import userRouter from "./routes/usersRouter.js";
import productRouter from "./routes/productsRouter.js";
import orderRouter from "./routes/orderRouter.js";

import dotenv from "dotenv";

import messagesRouter from "./routes/messageRouter.js";

import AireplyRouter from "./routes/aiReplyRouter.js";

import addressRouter from "./routes/addressRouter.js";

import notificationRouter from "./routes/notificationRouter.js";

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (hardcoded for now)

const MongoDB_URI = process.env.MongodbUrl;

mongoose
  .connect(MongoDB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.use("/api/orders", orderRouter);

app.use("/api/addresses", addressRouter);

app.use("/api/messages", messagesRouter);

app.use("/api/admin", AireplyRouter);

app.use("/api/notifications", notificationRouter);

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
