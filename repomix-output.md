This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
adminOnly.js
controller/addressController.js
controller/messageController.js
controller/orderController.js
controller/paymentController.js
controller/productsController.js
controller/usersController.js
Dockerfile
index.js
middleware.js
models/address.js
models/addsManagements.js
models/orders.js
models/products.js
models/userMessage.js
models/users.js
models/userToAdminMessage.js
package.json
repomix.config.json
routes/addressRouter.js
routes/messageRouter.js
routes/orderRouter.js
routes/paymentRouter.js
routes/productsRouter.js
routes/usersRouter.js
temp.mp3
```

# Files

## File: controller/paymentController.js
```javascript
import md5 from "md5";
import Order from "../models/orders.js";
import { v4 as uuidv4 } from "uuid";

const MERCHANT_ID = "1233257";
const MERCHANT_SECRET = "Mzc1ODUzMjkyNDM4NzI5NTU1MDQxNTMyMDYxMjE1NTcyNTg0MjI=";

// 1️⃣ Generate PayHere hash
export const generatePayHereHash = async (req, res) => {





  try {
    const { items, userDetails } = req.body; // userDetails පාවිච්චි කරන්නේ පේමන්ට් පේජ් එකට විතරයි (Model එකේ නැති නිසා save වෙන්නේ නැහැ)

    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderId = "ORD-" + Date.now();
    const currency = "LKR";

    const hash = md5(
      MERCHANT_ID + orderId + amount.toFixed(2) + currency + md5(MERCHANT_SECRET).toUpperCase()
    ).toUpperCase();

    // 🔐 ඔයාගේ Model එකේ හැඩයට දත්ත සකස් කිරීම
    const pendingOrder = new Order({
      userId: req.user.id,
      items: items.map(item => ({
        orderId: orderId, // ඔයාගේ Model එකේ තියෙන්නේ මෙතන ✅
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      paymentMethod: "CARD",
      totalAmount: amount,
      isPaid: false,
      status: "Pending"
    });

    await pendingOrder.save();

    res.json({
      sandbox: true,
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      items: "Online Purchase",
      amount: amount.toFixed(2),
      currency,
      hash,
      first_name: userDetails?.firstName || "Customer",
      last_name: userDetails?.lastName || "",
      email: userDetails?.email || "",
      phone: userDetails?.phone || ""
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






// 2️⃣ PayHere Notify (Webhook)

export const payHereNotify = async (req, res) => {
  try {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

    // 🔐 PayHere එකෙන් එවන දත්ත ඇත්තද කියලා බලන්න Hash එක ආපහු හදනවා
    // වැදගත්: payhere_amount එක දශම 2ක් සහිත String එකක් විය යුතුයි
    const localMd5 = md5(
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      md5(MERCHANT_SECRET).toUpperCase()
    ).toUpperCase();

    // Verification check
    if (localMd5 === md5sig) {
      if (status_code === "2") {
        // ✅ පේමන්ට් එක සාර්ථකයි නම් Database එක Update කරන්න
        await Order.findOneAndUpdate(
          { "items.orderId": order_id }, 
          { $set: { isPaid: true, status: "Confirmed" } },
          { new: true }
        );
        console.log(`Order ${order_id} marked as Paid.`);
      } else if (status_code === "0") {
        console.log(`Order ${order_id} is Pending.`);
      } else {
        // අසාර්ථක පේමන්ට් එකක් නම් status එක Cancelled කරන්නත් පුළුවන්
        await Order.findOneAndUpdate(
          { "items.orderId": order_id },
          { $set: { status: "Cancelled" } }
        );
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Notify Error:", err.message);
    res.status(500).send("Error");
  }
};





























// 3️⃣ Cash on Delivery


export const placeCODOrder = async (req, res) => {
  const user = req.user;
  const orderedData = req.body;

  // 1. කලින්ම Order ID එක generate කරගන්න
  const generatedOrderId = "ORD-COD-" + uuidv4();

  const newOrder = new Order({
    userId: user.id,
    orderId: generatedOrderId, 
    items: orderedData.orderedItems.map((item) => ({
      productId: item.productId,
      orderId: generatedOrderId, // <--- මේක තමයි අඩු වෙලා තිබුණේ!
      name: item.productName,
      qty: item.qty,
      price: item.lastPrice,
    })),
    totalAmount: orderedData.total,
    paymentMethod: "COD",
    isPaid: false,
    status: "Pending"
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    // Error එක ලේසියෙන් අඳුරගන්න console එකෙත් දාමු
    console.error("Order Save Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
```

## File: models/userMessage.js
```javascript
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: [String], // user message + AI replies
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
```

## File: models/userToAdminMessage.js
```javascript
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
```

## File: routes/paymentRouter.js
```javascript
import express from "express";

import authMiddleware from "../middleware.js";
import { generatePayHereHash, payHereNotify, placeCODOrder } from "../controller/paymentController.js";


const router = express.Router();

router.post("/generate-hash", authMiddleware, generatePayHereHash);
router.post("/notify", payHereNotify); // PayHere IPN (NO auth)
router.post("/cod", authMiddleware, placeCODOrder);

export default router;
```

## File: .gitignore
```
.env

node_modules
```

## File: adminOnly.js
```javascript
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, "himashguruge"); // Replace with your secret

    // 2. Role validation
    if (decoded.role === "admin" || decoded.role === "user") {
      req.user = decoded; // Pass user info to next middleware
      next();
    } else {
      return res.status(403).json({ message: "Access Denied: Unknown role!" });
    }

  } catch (err) {
    // 3. Token errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  }
}
```

## File: controller/addressController.js
```javascript
// controllers/addressController.js
import Address from "../models/address.js";

// Get all addresses for current user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = { ...req.body, userId };

    // If setting as default, update all other addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create(addressData);
    return res.status(201).json(newAddress);
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Check ownership
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting as default, unset others
    if (updateData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findByIdAndUpdate(addressId, updateData, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.findByIdAndDelete(addressId);

    // Optional: if deleted address was default, optionally set another as default
    const remaining = await Address.find({ userId }).sort({ createdAt: -1 });
    if (remaining.length && !remaining.some(a => a.isDefault)) {
      // make the first remaining the default
      await Address.findByIdAndUpdate(remaining[0]._id, { isDefault: true });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json(address);
  } catch (error) {
    console.error("Get address by ID error:", error);
    return res.status(500).json({ error: error.message });
  }
};
```

## File: controller/messageController.js
```javascript
import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL =
  "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// Utility to get AI reply
const getAIReply = async (userText) => {
  try {
    const response = await axios.post(
      SIM_WORKFLOW_URL,
      { input: userText },
      {
        headers: {
          "X-API-Key": SIM_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    let aiReply = "No response from AI.";
    if (response.data?.output) {
      if (typeof response.data.output === "string")
        aiReply = response.data.output;
      else if (response.data.output.content)
        aiReply = response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    else if (response.data?.result) aiReply = response.data.result;

    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.response?.data || error.message);
    return "AI failed to respond.";
  }
};

// Send user message + AI reply
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Special @admin case
    if (message.includes("@admin")) {
      const adminMsg = await userToAdminMessage.create({ userId, message });
      // Immediate pseudo reply for user
      return res.status(201).json({
        messages: [`user: ${message}`, `ai: Admin will reply soon`],
        adminMsg,
      });
    }

    // Normal user message
    const formattedUserMessage = `user: ${message}`;
    let chat = await userMessage.findOne({ userId });

    if (!chat) {
      chat = await userMessage.create({
        userId,
        message: [formattedUserMessage],
      });
    } else {
      chat.message.push(formattedUserMessage);
      await chat.save();
    }

    // Get AI reply
    const aiReply = await getAIReply(message);
    const formattedAIReply = `ai: ${aiReply}`;

    // Save AI reply in the same chat
    chat.message.push(formattedAIReply);
    await chat.save();

    // Return full conversation
    res.status(201).json({ messages: chat.message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all messages by userId
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(404).json({ messages: [] });

    res.status(200).json({ messages: chat.message }); // return full conversation array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
```

## File: controller/orderController.js
```javascript
import Order from "../models/orders.js";
import Product from "../models/products.js";

// Existing getQote function
export async function getQote(req, res) {
  try {
    const newOrderData = req.body;

    console.log(newOrderData)

    let labelTotal = 0; // Original Price
    let total = 0; // Final Price after discount

    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      let productId = newOrderData.orderedItems[i].productId;
      
      const product = await Product.findOne({
        productId: productId,
      });

      if (product == null) {
        return res.status(404).json({
          message: "product with id " + productId + " not found",
        });
      }
      
      // Check stock availability
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}. Only ${product.stock} available.`
        });
      }
      
      labelTotal += newOrderData.orderedItems[i].qty * product.price;
      total += newOrderData.orderedItems[i].qty * product.lastPrices;

      newProductArray.push({
        productId: productId,
        productName: product.productName,
        price: product.price,
        lastPrice: product.lastPrices,
        description: product.description,
        images: product.images,
        qty: newOrderData.orderedItems[i].qty,
      });
    }

    const discountAmount = labelTotal - total;

    return res.status(200).json({
      orderedItems: newProductArray,
      total: total,
      labeledTotal: labelTotal,
      discount: discountAmount > 0 ? discountAmount : 0,
      message: "Quote data generated successfully",
    });
  } catch (error) {
    console.error("Quote generation error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Create new order
// Create new order
export async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const {
      items,
      shippingAddress,
      paymentMethod = "card",
      paymentStatus = "pending"
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.province ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({ message: "Shipping address is incomplete" });
    }

    // Calculate order totals and validate stock
    let subtotal = 0;
    let discount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ productId: item.productId });
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.productId} not found` 
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Requested: ${item.qty}` 
        });
      }

      const itemPrice = item.lastPrice || product.lastPrices;
      const itemTotal = itemPrice * item.qty;
      const originalPrice = product.price * item.qty;
      
      subtotal += itemTotal;
      discount += (originalPrice - itemTotal);

      orderItems.push({
        productId: product._id,
        productName: product.productName,
        image: product.images?.[0] || "",
        qty: item.qty,
        lastPrice: itemPrice
      });

      // Update product stock
      product.stock -= item.qty;
      await product.save();
    }

    const shippingFee = 0; // You can add shipping fee logic here
    const total = subtotal + shippingFee - (discount > 0 ? discount : 0);

    // Generate unique order ID
    const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;

    // Create new order
    const newOrder = new Order({
      userId,
      orderId,
      items: orderItems,
      subtotal,
      discount: discount > 0 ? discount : 0,
      shippingFee,
      total,
      paymentStatus,
      paymentMethod,
      shippingAddress,
      status: "processing"
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create order", 
      error: error.message 
    });
  }
}


// Get all orders for current user
export async function getOrdersByUser(req, res) {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      orders,
      count: orders.length
    });

  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders", 
      error: error.message 
    });
  }
}

// Get order by ID
export async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderId, userId }).lean();

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch order", 
      error: error.message 
    });
  }
}

// Cancel order
export async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({ 
        success: false, 
        message: `Order cannot be cancelled. Current status: ${order.status}` 
      });
    }

    // Update order status
    order.status = "cancelled";
    
    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.qty;
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel order", 
      error: error.message 
    });
  }
}

// Get all orders (admin only)
export async function getAllOrders(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    const { 
      status, 
      paymentStatus, 
      startDate, 
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders", 
      error: error.message 
    });
  }
}

// Update order status (admin only)
export async function updateOrderStatus(req, res) {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !["processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update order status", 
      error: error.message 
    });
  }
}










export function payment(req, res) {

  const user = req.user;

  const order = req.body;



 


 
}
```

## File: controller/productsController.js
```javascript
import Product from "../models/products.js";

export async function addproduct(req, res) {
  try {
    const {
      productId,
      productName,
      altNames,
      price,
      lastPrices,
      stock,
      description,
      category,
      brand,
      images,
    } = req.body;

    if (!productId || !productName || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await Product.create({
      productId,
      productName,
      altNames,
      price,
      lastPrices,
      stock,
      description,
      category,
      brand,
      images,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const updateData = { ...req.body };

    // Validate status if provided
    if (
      updateData.status &&
      !["pending", "ready", "delivered"].includes(updateData.status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Controller function
export async function productFindById(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "Product found successfully",
      product,
    });
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
```

## File: controller/usersController.js
```javascript
import User from "../models/users.js";
import jwt from "jsonwebtoken";




export function createNewUser(req, res) {
  const newuserdata = req.body;

  if(newuserdata.role == 'admin'){
    if(req.user == null){
       res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
      return;
    }

    if(req.user.role !== 'admin'){
      res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
      return;
    }
  }


  const user = new User(newuserdata);
  user
    .save()
    .then((user) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error creating user",
        error: err.message,
      });
    });

 
  }





export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    if (findUser.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: findUser._id,
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
        phone: findUser.phone || "",
        role: findUser.role,
        profileImage: findUser.profileImage,
      },
      "himashguruge"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
        phone: findUser.phone || "",
        role: findUser.role,
        profileImage: findUser.profileImage,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

export const getCurrentUserHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "himashguruge");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    console.error("getAllUsers error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("getUserById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export async function currentuser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ ADD THIS MISSING FUNCTION:
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, lastname, phone, email } = req.body;

    if (!name || !lastname || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, lastname, phone, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Corrected route handler
export function me(req, res) {
  const userId = req.user._id;

  // Assuming 'users' is your in-memory array or DB fetch
  const user = users.find((u) => u._id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
}
```

## File: Dockerfile
```dockerfile
# Use Node.js official image
FROM node:18-alpine

# Create app directory inside container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (use your app's port)
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
```

## File: models/address.js
```javascript
import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Address", AddressSchema);
```

## File: models/addsManagements.js
```javascript
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
```

## File: models/orders.js
```javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    orderId : {
      type: String,
      required: true,
    },
    productId: {
      type: String, // ObjectId වෙනුවට String ✅
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      default: "COD",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
```

## File: models/products.js
```javascript
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
```

## File: models/users.js
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Name fields
    name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    
    // Contact info
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {  // ✅ ADD THIS FIELD
      type: String,
      trim: true,
      default: "",
    },
    
    // Address (optional - for basic storage)
    address: {  // ✅ Make this optional since we have separate Address model
      type: String,
      trim: true,
      default: "",
    },
    
    // Authentication
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    
    // Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    // Profile
    profileImage: {
      type: String,
      default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
export default User;
```

## File: package.json
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.js"
  },
  "type": "module",
  "dependencies": {
    "axios": "^1.13.2",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "gtts": "^0.2.1",
    "jsonwebtoken": "^9.0.3",
    "md5": "^2.3.0",
    "module-alias": "^2.2.3",
    "mongoose": "^9.0.1",
    "nodemon": "^3.1.11",
    "react-hot-toast": "^2.6.0",
    "uuid": "^13.0.0"
  },
  "_moduleAliases": {
    "@": ".",
    "@controllers": "controllers",
    "@models": "models",
    "@utils": "utils",
    "@services": "services"
  }
}
```

## File: repomix.config.json
```json
{
  "$schema": "https://repomix.com/schemas/latest/schema.json",
  "input": {
    "maxFileSize": 52428800
  },
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "truncateBase64": false,
    "copyToClipboard": false,
    "includeFullDirectoryStructure": false,
    "tokenCountTree": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false,
      "includeLogs": false,
      "includeLogsCount": 50
    }
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDotIgnore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

## File: routes/addressRouter.js
```javascript
import express from "express";
import {
  addAddress,
  deleteAddress,
  getUserAddresses,
  updateAddress,
  getAddressById
} from "../controller/addressController.js";
import authMiddleware from "../adminOnly.js";

const router = express.Router();

// Change from /address to /addresses
router.get("/", authMiddleware, getUserAddresses);
router.get("/:addressId", authMiddleware, getAddressById);
router.post("/", authMiddleware, addAddress);
router.put("/:addressId", authMiddleware, updateAddress);
router.delete("/:addressId", authMiddleware, deleteAddress);

export default router;
```

## File: routes/messageRouter.js
```javascript
import express from "express";
import { getUserMessages, sendUserMessage } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Send user message + AI reply
router.post("/sendmessage", authMiddleware, sendUserMessage);

// Get all messages for logged-in user
router.get("/getmessages", authMiddleware, getUserMessages);

export default router;
```

## File: routes/orderRouter.js
```javascript
import express from "express";
import { 
  getQote, 
  createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders, 
  payment
} from "../controller/orderController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Public route for getting quote
router.post("/quote", getQote);

// User routes (require authentication)
router.post("/", authMiddleware, createOrder); // Create new order
router.get("/my-orders", authMiddleware, getOrdersByUser); // Get user's orders
router.get("/:orderId", authMiddleware, getOrderById); // Get specific order
router.put("/:orderId/cancel", authMiddleware, cancelOrder); // Cancel order

// Admin routes (require admin role - check inside controller)
router.get("/", authMiddleware, getAllOrders); // Get all orders (admin only)
router.put("/:orderId/status", authMiddleware, updateOrderStatus); // Update order status (admin only)


router.post("/payment", authMiddleware, payment); 


export default router;
```

## File: routes/productsRouter.js
```javascript
import express from "express";
import {
  addproduct,
  deleteProduct,
  getAllProducts,
  productFindById,
  updateProduct,
} from "../controller/productsController.js";
import adminOnly from "../middleware.js";

const router = express.Router();

router.post("/", adminOnly, addproduct);
router.get("/", getAllProducts);
router.get("/:productId", productFindById);
router.patch("/:productId", adminOnly, updateProduct);
router.delete("/:productId", adminOnly, deleteProduct);

export default router;
```

## File: routes/usersRouter.js
```javascript
import express from "express";
import adminOnly from "../middleware.js"; // admin role check
import authMiddleware from "../middleware.js"; // only token check
import { 
  createNewUser, 
  currentuser, 
  getAllUsers, 
  getCurrentUserHandler, 
  getUserByIdHandler, 
  Loginuser,
  me,
  updateUserInfo
} from "../controller/usersController.js";

const userRouter = express.Router();

// Admin-only routes
userRouter.post("/", createNewUser); 

userRouter.get("/", adminOnly, getAllUsers);

// Logged-in user routes
userRouter.get("/me", authMiddleware, getCurrentUserHandler);
userRouter.put("/me", authMiddleware, updateUserInfo);

// Public routes
userRouter.post("/login", Loginuser);
userRouter.get("/me", authMiddleware, me);

// Admin or public route to get specific user by ID
userRouter.get("/:userId", adminOnly, getUserByIdHandler); 

export default userRouter;
```

## File: index.js
```javascript
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
```

## File: middleware.js
```javascript
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Get the Authorization header
  const secretKey = process.env.SECRET_KEY;

  // Check if secret key is defined
  if (!secretKey) {
    console.error("SECRET_KEY not defined in .env");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  // No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, secretKey); // Verify token

    // Only allow 'admin' or 'user'
    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access Denied: Unknown role!" });
    }

    req.user = decoded; // Attach decoded token (user info) to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" }); // unified invalid token response
  }
}
```
