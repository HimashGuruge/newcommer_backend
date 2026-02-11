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
import notificationRouter from "./routes/notificationRouter.js";

import adsRouter from "./routes/adRoutes.js";
import Category from "./routes/categoryRouter.js";

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // මෙයද අවශ්‍ය විය හැක
  next();
});

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

app.use("/api/categories", Category);

app.use("/api/notifications", notificationRouter);


app.use("/api/ads", adsRouter);



// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
