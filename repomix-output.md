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
backend.md
controller/adController.js
controller/addressController.js
controller/messageController.js
controller/notificationController.js
controller/orderController.js
controller/paymentController.js
controller/productsController.js
controller/usersController.js
Dockerfile
index.js
middleware.js
models/address.js
models/ads.js
models/orders.js
models/products.js
models/userMessage.js
models/users.js
models/userToAdminMessage.js
package.json
repomix.config.json
routes/addressRouter.js
routes/adRoutes.js
routes/messageRouter.js
routes/notificationRouter.js
routes/orderRouter.js
routes/paymentRouter.js
routes/productsRouter.js
routes/usersRouter.js
temp.mp3
```

# Files

## File: backend.md
`````markdown
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
backend.md
controller/addressController.js
controller/messageController.js
controller/notificationController.js
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
routes/notificationRouter.js
routes/orderRouter.js
routes/paymentRouter.js
routes/productsRouter.js
routes/usersRouter.js
temp.mp3
```

# Files

## File: backend.md
````markdown
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
controller/notificationController.js
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
routes/notificationRouter.js
routes/orderRouter.js
routes/paymentRouter.js
routes/productsRouter.js
routes/usersRouter.js
temp.mp3
```

# Files

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

## File: models/userMessage.js
```javascript
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
  { _id: false } // Sub-document වලට අමුතුවෙන් ID ඕන නෑ (Database එක cleanව තියාගන්න)
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

## File: routes/orderRouter.js
```javascript
import express from "express";
import { 
  getQote, 
  // createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders, 
  // payment
} from "../controller/orderController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Public route for getting quote
router.post("/quote", getQote);

// User routes (require authentication)
//router.post("/", authMiddleware, createOrder); // Create new order
router.get("/my-orders", authMiddleware, getOrdersByUser); // Get user's orders
router.get("/:orderId", authMiddleware, getOrderById); // Get specific order
router.put("/:orderId/cancel", authMiddleware, cancelOrder); // Cancel order

// Admin routes (require admin role - check inside controller)
router.get("/", authMiddleware, getAllOrders); // Get all orders (admin only)
router.put("/:orderId/status", authMiddleware, updateOrderStatus); // Update order status (admin only)


// router.post("/payment", authMiddleware, payment); 


export default router;
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

## File: controller/messageController.js
```javascript
import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL = "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// AI එකෙන් පිළිතුරක් ලබාගන්නා Function එක
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
      aiReply = typeof response.data.output === "string" ? response.data.output : response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    
    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.message);
    return "AI failed to respond.";
  }
};

// මැසේජ් එකක් යැවීම
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1️⃣ @admin case (Admin ට මැසේජ් එකක් යන විට)
    if (message.includes("@admin")) {
      await userToAdminMessage.findOneAndUpdate(
        { userId },
        { $push: { messages: { sender: "user", text: message } } },
        { upsert: true }
      );

      return res.status(201).json({
        messages: [
          { sender: "user", text: message, createdAt: new Date() },
          { sender: "ai", text: "Admin will reply soon", createdAt: new Date() },
        ],
      });
    }

    // 2️⃣ Normal AI Chat (අලුත් Schema එකට අනුව)
    let chat = await userMessage.findOne({ userId });

    // User ගේ මැසේජ් එක Object එකක් විදිහට හදනවා
    const userMsgObj = { sender: "user", text: message };

    if (!chat) {
      chat = await userMessage.create({
        userId,
        messages: [userMsgObj], // ✅ Array of Objects
      });
    } else {
      chat.messages.push(userMsgObj);
      await chat.save();
    }

    // AI පිළිතුර ලබා ගැනීම
    const aiReply = await getAIReply(message);
    const aiMsgObj = { sender: "ai", text: aiReply };

    // AI පිළිතුරත් push කරනවා
    chat.messages.push(aiMsgObj);
    await chat.save();

    // Frontend එකට මුළු message array එකම යවනවා
    res.status(201).json({ messages: chat.messages });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// පරණ මැසේජ් සියල්ල ලබා ගැනීම
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    // ✅ දැන් මෙතන map කරන්න ඕන නෑ, Database එකේ දැනටමත් තියෙන්නේ Objects
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin ගේ පිළිතුරු ලබා ගැනීම
export const getAdminReplies = async (req, res) => {

    
  try {
    const userId = req.user.id;
  
    const chat = await userToAdminMessage.findOne({ userId });

    if (!chat || !chat.messages) return res.status(200).json({ messages: [] });

    const adminMessages = chat.messages.filter((msg) => msg.sender === "admin");
    res.status(200).json({ messages: adminMessages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
```

## File: controller/notificationController.js
```javascript
// controller/notificationController.js

import userToAdminMessage from "../models/userToAdminMessage.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const allMessages = await userToAdminMessage.find().sort({ updatedAt: -1 });
    
    const notifications = allMessages.map(doc => {
      const lastMsg = doc.messages[doc.messages.length - 1];
      return {
        _id: doc._id,
        userId: doc.userId,
        message: lastMsg.text,
        // ✅ අන්තිම මැසේජ් එකේ isRead අගය කෙලින්ම යවන්න
        isRead: lastMsg.isRead || false, 
        sentAt: lastMsg.createdAt
      };
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.body; // ඔයා Frontend එකෙන් එවන්නේ userId එක

    // සියලුම user messages read ලෙස mark කිරීම
    await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $set: { "messages.$[elem].isRead": true, isRead: true } 
      },
      { 
        arrayFilters: [{ "elem.sender": "user" }], 
        new: true 
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// controller/notificationController.js

export const replyToUserNotification = async (req, res) => {
  try {
    const { userId } = req.params; // URL එකෙන් userId එක ගනී (:userId)
    const { message } = req.body;  // Frontend එකෙන් එවන පණිවිඩය

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // 1. User ගේ chat document එක සොයාගෙන පණිවිඩය ඇතුළත් කිරීම
    const chat = await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: { 
            sender: "admin", 
            text: message,
            isRead: true // Admin යවන මැසේජ් එක Admin ටම Notification එකක් වෙන්නේ නැති නිසා true කරයි
          } 
        },
        // 2. මුළු Chat එකම 'Read' ලෙස සලකුණු කරයි (Notification Badge එක අයින් වීමට)
        $set: { isRead: true } 
      },
      { new: true } // Update වූ පසු අලුත් දත්ත ලබා ගැනීමට
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found for this user" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: error.message });
  }
};










export const getFullChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await userToAdminMessage.findOne({ userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages); // සියලුම පණිවිඩ Array එක යවයි
  } catch (error) {
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

    // 1. Array එක තිබේදැයි පරීක්ෂා කිරීම (Safety Check)
    if (!newOrderData.orderedItems || !Array.isArray(newOrderData.orderedItems)) {
      return res.status(400).json({ message: "orderedItems array is required" });
    }

    let labelTotal = 0;
    let total = 0;
    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      let productId = newOrderData.orderedItems[i].productId;
      
      const product = await Product.findOne({ productId: productId });

      if (!product) {
        return res.status(404).json({
          message: "product with id " + productId + " not found",
        });
      }
      
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}.`
        });
      }
      
      // වැදගත්: මෙතැන field names හරියටම database එකට සමාන විය යුතුයි
      labelTotal += newOrderData.orderedItems[i].qty * product.price;
      
      // මෙතන 'lastPrices' ද නැත්නම් 'lastPrice' ද කියලා schema එක බලන්න
      const unitPrice = product.lastPrice || product.price; 
      total += newOrderData.orderedItems[i].qty * unitPrice;

      newProductArray.push({
        productId: productId,
        productName: product.productName,
        price: product.price,
        lastPrice: unitPrice, // schema එකට අනුව වෙනස් කරන්න
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
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


// Create new order
// export async function createOrder(req, res) {
//   try {
//     const userId = req.user.id;
//     const {
//       items,
//       shippingAddress,
//       paymentMethod = "card",
//       paymentStatus = "pending"
//     } = req.body;

//     // Validate required fields
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Order items are required" });
//     }

//     if (
//       !shippingAddress ||
//       !shippingAddress.name ||
//       !shippingAddress.addressLine1 ||
//       !shippingAddress.city ||
//       !shippingAddress.province ||
//       !shippingAddress.postalCode
//     ) {
//       return res.status(400).json({ message: "Shipping address is incomplete" });
//     }

//     // Calculate order totals and validate stock
//     let subtotal = 0;
//     let discount = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const product = await Product.findOne({ productId: item.productId });
      
//       if (!product) {
//         return res.status(404).json({ 
//           message: `Product ${item.productId} not found` 
//         });
//       }

//       if (product.stock < item.qty) {
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Requested: ${item.qty}` 
//         });
//       }

//       const itemPrice = item.lastPrice || product.lastPrices;
//       const itemTotal = itemPrice * item.qty;
//       const originalPrice = product.price * item.qty;
      
//       subtotal += itemTotal;
//       discount += (originalPrice - itemTotal);

//       orderItems.push({
//         productId: product._id,
//         productName: product.productName,
//         image: product.images?.[0] || "",
//         qty: item.qty,
//         lastPrice: itemPrice
//       });

//       // Update product stock
//       product.stock -= item.qty;
//       await product.save();
//     }

//     const shippingFee = 0; // You can add shipping fee logic here
//     const total = subtotal + shippingFee - (discount > 0 ? discount : 0);

//     // Generate unique order ID
//     const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;

//     // Create new order
//     const newOrder = new Order({
//       userId,
//       orderId,
//       items: orderItems,
//       subtotal,
//       discount: discount > 0 ? discount : 0,
//       shippingFee,
//       total,
//       paymentStatus,
//       paymentMethod,
//       shippingAddress,
//       status: "processing"
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to create order", 
//       error: error.message 
//     });
//   }
// }


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

## File: models/orders.js
```javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // ❌ මෙතන තිබුණ orderId එක අයින් කරන්න. 
    // (Item එකක් ඇතුලේ Order ID එක දාන්න අවශ්‍ය නෑ)
    
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
    // ✅ නිවැරදි තැන: Order ID එක මෙතනට දාන්න
    orderId: {
      type: String,
      required: true,
      unique: true, // එකම ID එක දෙපාරක් එන්න බැහැ
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // හෝ String නම් type: String
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
    
    // අවශ්‍ය නම් වෙනත් fields (discount, shippingFee) මෙතනට එකතු කරන්න

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

## File: models/userToAdminMessage.js
```javascript
import mongoose from "mongoose";

// models/userToAdminMessage.js
const userToAdminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // ✅ මේක අලුතින් එක් කරන්න
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // මෙතන තියෙන isRead එක මුළු chat එකේම status එක විදිහට පාවිච්චි කරන්න පුළුවන්
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);
export default userToAdminMessage;
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

## File: routes/messageRouter.js
```javascript
import express from "express";
import {  getAdminReplies, getUserMessages, sendUserMessage } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Send user message + AI reply
router.post("/sendmessage", authMiddleware, sendUserMessage);

// Get all messages for logged-in user
router.get("/getmessages", authMiddleware, getUserMessages);

router.get("/getadminreplies", authMiddleware, getAdminReplies);

export default router;
```

## File: routes/notificationRouter.js
```javascript
import express from "express";
import { getAdminNotifications, getFullChatHistory, markNotificationAsRead, replyToUserNotification,  } from "../controller/notificationController.js";

const router = express.Router();

// URL: /api/notifications/getNotifications
router.get("/getNotifications", getAdminNotifications);

// URL: /api/notifications/reply/:userId
router.post("/reply/:userId", replyToUserNotification);
router.get("/getChat/:userId", getFullChatHistory);

router.post("/markRead", markNotificationAsRead);

export default router;
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
import notificationRouter from "./routes/notificationRouter.js";

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

app.use("/api/notifications", notificationRouter);

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
```
````

## File: .gitignore
````
.env

node_modules
````

## File: adminOnly.js
````javascript
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
````

## File: controller/addressController.js
````javascript
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
````

## File: controller/paymentController.js
````javascript
import md5 from "md5";
import Order from "../models/orders.js";
import { v4 as uuidv4 } from "uuid";

const MERCHANT_ID = "1233257";
const MERCHANT_SECRET = "Mzc1ODUzMjkyNDM4NzI5NTU1MDQxNTMyMDYxMjE1NTcyNTg0MjI=";

// 1️⃣ Generate PayHere hash

export const generatePayHereHash = async (req, res) => {
  try {
    const { items, userDetails } = req.body;

    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // ✅ වඩාත් හොඳ Order ID එකක් සාදාගැනීමේ ක්‍රමය
    const generateOrderID = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `ORD-${Date.now().toString().slice(-4)}-${result}`; 
      // Output Example: ORD-8231-K7P9X2 (වර්තමාන කාලය + අහඹු අගය)
    };

    const orderId = generateOrderID(); 
    const currency = "LKR";

    const hash = md5(
      MERCHANT_ID + orderId + amount.toFixed(2) + currency + md5(MERCHANT_SECRET).toUpperCase()
    ).toUpperCase();

    // 🔐 Database එකේ Order එක Save කිරීම
    const pendingOrder = new Order({
      userId: req.user.id,
      items: items.map(item => ({
        orderId: orderId, 
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
````

## File: controller/productsController.js
````javascript
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
````

## File: controller/usersController.js
````javascript
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
````

## File: Dockerfile
````dockerfile
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
````

## File: models/address.js
````javascript
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
````

## File: models/addsManagements.js
````javascript
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
````

## File: models/products.js
````javascript
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
````

## File: models/userMessage.js
````javascript
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
  { _id: false } // Sub-document වලට අමුතුවෙන් ID ඕන නෑ (Database එක cleanව තියාගන්න)
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
````

## File: models/users.js
````javascript
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
````

## File: repomix.config.json
````json
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
````

## File: routes/addressRouter.js
````javascript
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
````

## File: routes/orderRouter.js
````javascript
import express from "express";
import { 
  getQote, 
  // createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders, 
  // payment
} from "../controller/orderController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Public route for getting quote
router.post("/quote", getQote);

// User routes (require authentication)
//router.post("/", authMiddleware, createOrder); // Create new order
router.get("/my-orders", authMiddleware, getOrdersByUser); // Get user's orders
router.get("/:orderId", authMiddleware, getOrderById); // Get specific order
router.put("/:orderId/cancel", authMiddleware, cancelOrder); // Cancel order

// Admin routes (require admin role - check inside controller)
router.get("/", authMiddleware, getAllOrders); // Get all orders (admin only)
router.put("/:orderId/status", authMiddleware, updateOrderStatus); // Update order status (admin only)


// router.post("/payment", authMiddleware, payment); 


export default router;
````

## File: routes/paymentRouter.js
````javascript
import express from "express";

import authMiddleware from "../middleware.js";
import { generatePayHereHash, payHereNotify, placeCODOrder } from "../controller/paymentController.js";


const router = express.Router();

router.post("/generate-hash", authMiddleware, generatePayHereHash);
router.post("/notify", payHereNotify); // PayHere IPN (NO auth)
router.post("/cod", authMiddleware, placeCODOrder);

export default router;
````

## File: routes/productsRouter.js
````javascript
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
````

## File: routes/usersRouter.js
````javascript
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
````

## File: controller/messageController.js
````javascript
import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL = "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// AI එකෙන් පිළිතුරක් ලබාගන්නා Function එක
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
      aiReply = typeof response.data.output === "string" ? response.data.output : response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    
    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.message);
    return "AI failed to respond.";
  }
};

// මැසේජ් එකක් යැවීම
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1️⃣ @admin case (Admin ට මැසේජ් එකක් යන විට)
    if (message.includes("@admin")) {
      await userToAdminMessage.findOneAndUpdate(
        { userId },
        { $push: { messages: { sender: "user", text: message } } },
        { upsert: true }
      );

      return res.status(201).json({
        messages: [
          { sender: "user", text: message, createdAt: new Date() },
          { sender: "ai", text: "Admin will reply soon", createdAt: new Date() },
        ],
      });
    }

    // 2️⃣ Normal AI Chat (අලුත් Schema එකට අනුව)
    let chat = await userMessage.findOne({ userId });

    // User ගේ මැසේජ් එක Object එකක් විදිහට හදනවා
    const userMsgObj = { sender: "user", text: message };

    if (!chat) {
      chat = await userMessage.create({
        userId,
        messages: [userMsgObj], // ✅ Array of Objects
      });
    } else {
      chat.messages.push(userMsgObj);
      await chat.save();
    }

    // AI පිළිතුර ලබා ගැනීම
    const aiReply = await getAIReply(message);
    const aiMsgObj = { sender: "ai", text: aiReply };

    // AI පිළිතුරත් push කරනවා
    chat.messages.push(aiMsgObj);
    await chat.save();

    // Frontend එකට මුළු message array එකම යවනවා
    res.status(201).json({ messages: chat.messages });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// පරණ මැසේජ් සියල්ල ලබා ගැනීම
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    // ✅ දැන් මෙතන map කරන්න ඕන නෑ, Database එකේ දැනටමත් තියෙන්නේ Objects
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin ගේ පිළිතුරු ලබා ගැනීම
export const getAdminReplies = async (req, res) => {

    
  try {
    const userId = req.user.id;
  
    const chat = await userToAdminMessage.findOne({ userId });

    if (!chat || !chat.messages) return res.status(200).json({ messages: [] });

    const adminMessages = chat.messages.filter((msg) => msg.sender === "admin");
    res.status(200).json({ messages: adminMessages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
````

## File: controller/notificationController.js
````javascript
// controller/notificationController.js

import userToAdminMessage from "../models/userToAdminMessage.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const allMessages = await userToAdminMessage.find().sort({ updatedAt: -1 });
    
    const notifications = allMessages.map(doc => {
      const lastMsg = doc.messages[doc.messages.length - 1];
      return {
        _id: doc._id,
        userId: doc.userId,
        message: lastMsg.text,
        // ✅ අන්තිම මැසේජ් එකේ isRead අගය කෙලින්ම යවන්න
        isRead: lastMsg.isRead || false, 
        sentAt: lastMsg.createdAt
      };
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.body; // ඔයා Frontend එකෙන් එවන්නේ userId එක

    // සියලුම user messages read ලෙස mark කිරීම
    await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $set: { "messages.$[elem].isRead": true, isRead: true } 
      },
      { 
        arrayFilters: [{ "elem.sender": "user" }], 
        new: true 
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// controller/notificationController.js

export const replyToUserNotification = async (req, res) => {
  try {
    const { userId } = req.params; // URL එකෙන් userId එක ගනී (:userId)
    const { message } = req.body;  // Frontend එකෙන් එවන පණිවිඩය

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // 1. User ගේ chat document එක සොයාගෙන පණිවිඩය ඇතුළත් කිරීම
    const chat = await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: { 
            sender: "admin", 
            text: message,
            isRead: true // Admin යවන මැසේජ් එක Admin ටම Notification එකක් වෙන්නේ නැති නිසා true කරයි
          } 
        },
        // 2. මුළු Chat එකම 'Read' ලෙස සලකුණු කරයි (Notification Badge එක අයින් වීමට)
        $set: { isRead: true } 
      },
      { new: true } // Update වූ පසු අලුත් දත්ත ලබා ගැනීමට
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found for this user" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: error.message });
  }
};










export const getFullChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await userToAdminMessage.findOne({ userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages); // සියලුම පණිවිඩ Array එක යවයි
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
````

## File: controller/orderController.js
````javascript
import Order from "../models/orders.js";
import Product from "../models/products.js";

// Existing getQote function
export async function getQote(req, res) {
  try {
    const newOrderData = req.body;

    // 1. Array එක තිබේදැයි පරීක්ෂා කිරීම (Safety Check)
    if (!newOrderData.orderedItems || !Array.isArray(newOrderData.orderedItems)) {
      return res.status(400).json({ message: "orderedItems array is required" });
    }

    let labelTotal = 0;
    let total = 0;
    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      let productId = newOrderData.orderedItems[i].productId;
      
      const product = await Product.findOne({ productId: productId });

      if (!product) {
        return res.status(404).json({
          message: "product with id " + productId + " not found",
        });
      }
      
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}.`
        });
      }
      
      // වැදගත්: මෙතැන field names හරියටම database එකට සමාන විය යුතුයි
      labelTotal += newOrderData.orderedItems[i].qty * product.price;
      
      // මෙතන 'lastPrices' ද නැත්නම් 'lastPrice' ද කියලා schema එක බලන්න
      const unitPrice = product.lastPrice || product.price; 
      total += newOrderData.orderedItems[i].qty * unitPrice;

      newProductArray.push({
        productId: productId,
        productName: product.productName,
        price: product.price,
        lastPrice: unitPrice, // schema එකට අනුව වෙනස් කරන්න
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
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


// Create new order
// export async function createOrder(req, res) {
//   try {
//     const userId = req.user.id;
//     const {
//       items,
//       shippingAddress,
//       paymentMethod = "card",
//       paymentStatus = "pending"
//     } = req.body;

//     // Validate required fields
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Order items are required" });
//     }

//     if (
//       !shippingAddress ||
//       !shippingAddress.name ||
//       !shippingAddress.addressLine1 ||
//       !shippingAddress.city ||
//       !shippingAddress.province ||
//       !shippingAddress.postalCode
//     ) {
//       return res.status(400).json({ message: "Shipping address is incomplete" });
//     }

//     // Calculate order totals and validate stock
//     let subtotal = 0;
//     let discount = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const product = await Product.findOne({ productId: item.productId });
      
//       if (!product) {
//         return res.status(404).json({ 
//           message: `Product ${item.productId} not found` 
//         });
//       }

//       if (product.stock < item.qty) {
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Requested: ${item.qty}` 
//         });
//       }

//       const itemPrice = item.lastPrice || product.lastPrices;
//       const itemTotal = itemPrice * item.qty;
//       const originalPrice = product.price * item.qty;
      
//       subtotal += itemTotal;
//       discount += (originalPrice - itemTotal);

//       orderItems.push({
//         productId: product._id,
//         productName: product.productName,
//         image: product.images?.[0] || "",
//         qty: item.qty,
//         lastPrice: itemPrice
//       });

//       // Update product stock
//       product.stock -= item.qty;
//       await product.save();
//     }

//     const shippingFee = 0; // You can add shipping fee logic here
//     const total = subtotal + shippingFee - (discount > 0 ? discount : 0);

//     // Generate unique order ID
//     const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;

//     // Create new order
//     const newOrder = new Order({
//       userId,
//       orderId,
//       items: orderItems,
//       subtotal,
//       discount: discount > 0 ? discount : 0,
//       shippingFee,
//       total,
//       paymentStatus,
//       paymentMethod,
//       shippingAddress,
//       status: "processing"
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to create order", 
//       error: error.message 
//     });
//   }
// }


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
````

## File: middleware.js
````javascript
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
````

## File: models/orders.js
````javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    // ❌ මෙතන තිබුණ orderId එක අයින් කරන්න. 
    // (Item එකක් ඇතුලේ Order ID එක දාන්න අවශ්‍ය නෑ)
    
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
    // ✅ නිවැරදි තැන: Order ID එක මෙතනට දාන්න
    orderId: {
      type: String,
      required: true,
      unique: true, // එකම ID එක දෙපාරක් එන්න බැහැ
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // හෝ String නම් type: String
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
    
    // අවශ්‍ය නම් වෙනත් fields (discount, shippingFee) මෙතනට එකතු කරන්න

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
````

## File: models/userToAdminMessage.js
````javascript
import mongoose from "mongoose";

// models/userToAdminMessage.js
const userToAdminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // ✅ මේක අලුතින් එක් කරන්න
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // මෙතන තියෙන isRead එක මුළු chat එකේම status එක විදිහට පාවිච්චි කරන්න පුළුවන්
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);
export default userToAdminMessage;
````

## File: package.json
````json
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
````

## File: routes/messageRouter.js
````javascript
import express from "express";
import {  getAdminReplies, getUserMessages, sendUserMessage } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Send user message + AI reply
router.post("/sendmessage", authMiddleware, sendUserMessage);

// Get all messages for logged-in user
router.get("/getmessages", authMiddleware, getUserMessages);

router.get("/getadminreplies", authMiddleware, getAdminReplies);

export default router;
````

## File: routes/notificationRouter.js
````javascript
import express from "express";
import { getAdminNotifications, getFullChatHistory, markNotificationAsRead, replyToUserNotification,  } from "../controller/notificationController.js";

const router = express.Router();

// URL: /api/notifications/getNotifications
router.get("/getNotifications", getAdminNotifications);

// URL: /api/notifications/reply/:userId
router.post("/reply/:userId", replyToUserNotification);
router.get("/getChat/:userId", getFullChatHistory);

router.post("/markRead", markNotificationAsRead);

export default router;
````

## File: index.js
````javascript
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

app.use("/api/notifications", notificationRouter);

// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
````
`````

## File: controller/adController.js
`````javascript
import Ad from "../models/ads.js"; // Ensure your model is imported

export const createAd = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // 1. Validation
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title and imageUrl are mandatory.",
      });
    }

    // 2. Create entry in MongoDB
    const ad = await Ad.create({
      title,
      imageUrl,
    });

    // 3. Success Response
    return res.status(201).json({
      success: true,
      message: "Ad successfully published to database",
      data: ad,
    });
    
  } catch (error) {
    console.error("Ad Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};











// සියලුම Ads ලබා ගැනීම (Frontend එකේ Slider එක සඳහා)
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 }); // අලුත්ම ඒවා මුලට
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ads", error });
  }
};
`````

## File: models/ads.js
`````javascript
import mongoose from "mongoose";

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['active', 'paused'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Ad = mongoose.models.Ad || mongoose.model('Ad', AdSchema);
export default Ad;
`````

## File: routes/adRoutes.js
`````javascript
import express from "express";
import { createAd, getAds } from "../controller/adController.js";

const router = express.Router();

// This matches the axios.post('.../api/ads', ...) call
router.post("/", createAd);
router.get("/", getAds);

export default router;
`````

## File: .gitignore
`````
.env

node_modules
`````

## File: adminOnly.js
`````javascript
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
`````

## File: controller/addressController.js
`````javascript
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
`````

## File: controller/paymentController.js
`````javascript
import md5 from "md5";
import Order from "../models/orders.js";
import Product from "../models/products.js"; // Product Model එක import කරගන්න
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_SECRET = process.env.MERCHANT_SECRET;

// --- Helper Function: Stock ප්‍රමාණය අඩු කිරීම ---
const updateProductStock = async (items) => {
  try {
    for (const item of items) {
      // ඔබේ Product Model එකේ ID එක productId නම් එය මෙහිදී භාවිතා කරන්න
      await Product.findOneAndUpdate(
        { productId: item.productId }, 
        { $inc: { stock: -item.qty } }, // තොගයෙන් අදාළ ප්‍රමාණය අඩු කරයි
        { new: true }
      );
    }
    console.log("Stock updated successfully.");
  } catch (error) {
    console.error("Stock Update Error:", error.message);
  }
};

// --- 1. Place COD Order ---
export const placeCODOrder = async (req, res) => {
  try {
    const user = req.user;
    const orderedData = req.body;

    const generatedOrderId = "ORD-COD-" + uuidv4().slice(0, 8).toUpperCase();

    const newOrder = new Order({
      userId: user.id,
      orderId: generatedOrderId,
      items: orderedData.orderedItems.map((item) => ({
        productId: item.productId,
        name: item.productName || item.name,
        imageUrl: item.image || item.imageUrl || (item.images && item.images[0]),
        qty: item.qty,
        price: item.lastPrice || item.price,
      })),
      totalAmount: orderedData.total,
      paymentMethod: "COD",
      isPaid: false,
      status: "Confirmed", // COD ඇණවුමක් නිසා කෙලින්ම Confirm කළ හැක
      shippingAddress: {
        address: orderedData.shippingAddress,
        phone: orderedData.contactPhone,
        customerName: `${user.firstName} ${user.lastName || ""}`.trim(),
        email: user.email,
      },
    });

    const savedOrder = await newOrder.save();

    // --- STOCK UPDATE ---
    // ඇණවුම සාර්ථක වූ පසු Stock ප්‍රමාණය අඩු කිරීම
    await updateProductStock(newOrder.items);

    res.status(200).json({
      success: true,
      message: "Order placed and stock updated successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("COD Error:", error);
    res.status(500).json({
      success: false,
      message: "ඇණවුම සිදු කිරීමේදී දෝෂයක් ඇති විය: " + error.message,
    });
  }
};

// --- 2. Generate PayHere Hash & Save Pending Order ---
export const generatePayHereHash = async (req, res) => {
  try {
    const user = req.user;
    const { amount, currency, orderedItems, shippingAddress, contactPhone } = req.body;

    if (!MERCHANT_ID || !MERCHANT_SECRET) {
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const formattedAmount = parseFloat(amount).toFixed(2);
    const selectedCurrency = currency || "LKR";
    const orderId = `ORD-PAY-${Date.now()}`;

    // Hash එක සෑදීම
    const hashedSecret = md5(String(MERCHANT_SECRET)).toUpperCase();
    const hash = md5(
      String(MERCHANT_ID) + 
      String(orderId) + 
      String(formattedAmount) + 
      String(selectedCurrency) + 
      String(hashedSecret)
    ).toUpperCase();

    // --- DATABASE එකේ ORDER එක SAVE කිරීම ---
    // ගෙවීමට පෙර "Pending" ඇණවුමක් ලෙස මෙහිදී save කරගන්නවා
    const pendingOrder = new Order({
      userId: user.id,
      orderId: orderId,
      items: orderedItems.map((item) => ({
        productId: item.productId,
        name: item.productName || item.name,
        imageUrl: item.image || item.imageUrl,
        qty: item.qty,
        price: item.lastPrice || item.price,
      })),
      totalAmount: amount,
      paymentMethod: "CARD",
      isPaid: false,
      status: "Pending",
      shippingAddress: {
        address: shippingAddress,
        phone: contactPhone,
        customerName: `${user.firstName} ${user.lastName || ""}`.trim(),
        email: user.email,
      },
    });

    await pendingOrder.save();

    res.status(200).json({
      success: true,
      merchant_id: MERCHANT_ID,
      order_id: orderId,
      amount: formattedAmount,
      currency: selectedCurrency,
      hash: hash
    });

  } catch (err) {
    console.error("Hash Generation Error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// --- 3. PayHere Notify URL (මෙය ඔබගේ routes වලට අනිවාර්යයෙන් එක් කරන්න) ---
export const payhereNotify = async (req, res) => {
  try {
    const { order_id, status_code } = req.body;

    // Status 2 යනු සාර්ථක ගෙවීමකි
    if (status_code === "2") {
      const order = await Order.findOne({ orderId: order_id });

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.status = "Confirmed";
        await order.save();

        // --- STOCK UPDATE ---
        // ගෙවීම ස්ථිර වූ පසු පමණක් Card Payment වල stock එක අඩු කරයි
        await updateProductStock(order.items);
      }
    }
    res.status(200).send();
  } catch (err) {
    console.error("Notify Error:", err);
    res.status(500).send();
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const diffInMinutes = (new Date() - new Date(order.createdAt)) / (1000 * 60);

    if (diffInMinutes > 10) {
      return res.status(400).json({
        success: false,
        message: "Time limit exceeded! You can only cancel orders within 10 minutes.",
      });
    }

    order.status = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
`````

## File: controller/productsController.js
`````javascript
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
`````

## File: controller/usersController.js
`````javascript
import axios from "axios";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "himashguruge";

/**
 * 1. අලුත් User කෙනෙක් සෑදීම (Registration)
 */
export function createNewUser(req, res) {
  const newuserdata = req.body;

  // Admin කෙනෙක්ව හදන්න හදනවා නම් ඉල්ලන පුද්ගලයා Admin විය යුතුයි
  if (newuserdata.role == "admin") {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
  }

  const user = new User(newuserdata);
  user
    .save()
    .then((savedUser) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: savedUser,
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

/**
 * 2. Login වීම සහ Token එක ලබා දීම
 */
export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Password එක කෙලින්ම check කිරීම (Hashing පාවිච්චි කරන්නේ නැතිනම්)
    if (findUser.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
      JWT_SECRET
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
        address: findUser.address || "",
        profileImage: findUser.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/**
 * 3. Log වී සිටින User ගේ විස්තර ලබා ගැනීම
 */
export const getCurrentUserHandler = async (req, res) => {
  try {
    // Middleware එකෙන් එන user id එක පාවිච්චි කරයි
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 4. Profile එක Update කිරීම (Frontend 'Save' Button එකට)
 */
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, lastname, phone, email, address } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Email are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, lastname, phone, email, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. සියලුම Users ලා ලබා ගැනීම (Admin සඳහා)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 6. ID එක මගින් නිශ්චිත User කෙනෙක් සෙවීම
 */
export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Invalid User ID format or Server error",
    });
  }
};




















export async function googleLogin(req, res) {
  const token = req.body.token;

  try {
    // 1. Google User Info ලබා ගැනීම
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email, given_name, family_name, picture } = response.data;

    // 2. User ඉන්නවද කියලා බලනවා
    let user = await User.findOne({ email: email });

    if (user) {
      // --- දැනට ඉන්න User කෙනෙක් නම් ---
      const jwtToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          role: user.role,
          profileImage: user.profileImage,
        },
        "himashguruge",
        { expiresIn: "7d" }
      );

      // User info යවන්නේ නැහැ, token එක විතරයි
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: jwtToken,
        role: user.role,
      });
    } else {
      // --- අලුත් User කෙනෙක් නම් Create කරනවා ---
      const NewUserData = {
        name: given_name,
        lastname: family_name || "",
        email: email,
        address: "No address",
        phone: "No phone Number",
        role: "user",
        profileImage: picture,
        password: Math.random().toString(36).slice(-10), 
      };

      const newUser = new User(NewUserData);
      const savedUser = await newUser.save();

      // අලුත් User ටත් Token එකක් හදනවා
      const jwtToken = jwt.sign(
        {
          id: savedUser._id,
          name: savedUser.name,
          lastname: savedUser.lastname,
          email: savedUser.email,
          phone: savedUser.phone,
          address: savedUser.address,
          role: savedUser.role,
          profileImage: savedUser.profileImage,
        },
        "himashguruge",
        { expiresIn: "7d" }
      );

      // User info යවන්නේ නැහැ, token එක විතරයි
      return res.status(201).json({
        success: true,
        message: "User created",
        token: jwtToken,
        role: savedUser.role,
      });
    }
  } catch (err) {
    console.error("Error details:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
      error: err.message,
    });
  }
}
`````

## File: Dockerfile
`````dockerfile
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
`````

## File: models/address.js
`````javascript
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
`````

## File: models/products.js
`````javascript
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
`````

## File: models/userMessage.js
`````javascript
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
  { _id: false } // Sub-document වලට අමුතුවෙන් ID ඕන නෑ (Database එක cleanව තියාගන්න)
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
`````

## File: models/users.js
`````javascript
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
      required: true,
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
`````

## File: repomix.config.json
`````json
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
`````

## File: routes/addressRouter.js
`````javascript
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
`````

## File: routes/orderRouter.js
`````javascript
import express from "express";
import { 
  getQote, 
  // createOrder, 
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getAllUserOrdersForAdmin,
  AdminupdateOrderStatus, 
  // payment
} from "../controller/orderController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Public route for getting quote
router.post("/quote", getQote);

// User routes (require authentication)
//router.post("/", authMiddleware, createOrder); // Create new order
router.get("/my-orders", authMiddleware, getOrdersByUser); // Get user's orders
router.get("/:orderId", authMiddleware, getOrderById); // Get specific order
router.put("/:orderId/cancel", authMiddleware, cancelOrder); // Cancel order
router.get("/my-orders", authMiddleware, getOrdersByUser);
router.get("/:orderId", authMiddleware, getOrderById);
router.put("/:orderId/cancel", authMiddleware, cancelOrder);

// Admin routes (require admin role - check inside controller)
router.get("/", authMiddleware, getAllOrders); // Get all orders (admin only)
router.put("/:orderId/status", authMiddleware, updateOrderStatus); // Update order status (admin only)
router.get("/", authMiddleware, getAllOrders);
router.put("/:orderId/status", authMiddleware, updateOrderStatus);

router.get("/userplace/orders", authMiddleware, getAllUserOrdersForAdmin);

router.put("/admin/getplaceorders/:orderId", authMiddleware, AdminupdateOrderStatus);


// router.post("/payment", authMiddleware, payment); 


export default router;
`````

## File: routes/paymentRouter.js
`````javascript
import express from "express";
import authMiddleware from "../middleware.js";
import { 
    generatePayHereHash, 
    placeCODOrder,
    cancelOrder // <--- මේක අලුතින් එකතු කරන්න ඕනේ
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/generate-hash", authMiddleware, generatePayHereHash);
router.post("/notify", generatePayHereHash); 
router.post("/cod", authMiddleware, placeCODOrder);

// Order එක cancel කරන route එක ✅
router.post("/cancel/:id", authMiddleware, cancelOrder);

export default router;
`````

## File: routes/productsRouter.js
`````javascript
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
`````

## File: routes/usersRouter.js
`````javascript
import express from "express";
// මෙහිදී authMiddleware පමණක් import කරගන්න
import authMiddleware from "../middleware.js";
import { 
  createNewUser, 
  getAllUsers, 
  getCurrentUserHandler, 
  getUserByIdHandler, 
  googleLogin, 
  Loginuser,
  updateUserInfo
} from "../controller/usersController.js";

const userRouter = express.Router();

// --- Public Routes ---
userRouter.post("/login", Loginuser); 

// --- Protected Routes (Log වුණු ඕනෑම අයෙකුට) ---
// තමන්ගේ profile එක බලන්න
userRouter.get("/me", authMiddleware, getCurrentUserHandler); 

// තමන්ගේ profile එක update කරන්න
userRouter.put("/me", authMiddleware, updateUserInfo);

// --- General User/Admin Routes (Login වී සිටීම පමණක් අවශ්‍යයි) ---
// අලුත් user කෙනෙක් හැදීම (Register)
userRouter.post("/" , createNewUser); 

// සියලුම users ලාගේ ලැයිස්තුව ලබා ගැනීම
userRouter.get("/", authMiddleware, getAllUsers); 

// ID එක හරහා ඕනෑම user කෙනෙක්ගේ විස්තර බැලීම
userRouter.get("/:userId", authMiddleware, getUserByIdHandler); 

userRouter.post("/google", googleLogin);



export default userRouter;
`````

## File: controller/messageController.js
`````javascript
import userMessage from "../models/userMessage.js";
import userToAdminMessage from "../models/userToAdminMessage.js";
import axios from "axios";

// SIM.AI Config
const SIM_API_KEY = "sk-sim-1hKrpaWkFkH8TTfxd80FNenD5ojZz7GI";
const SIM_WORKFLOW_URL = "https://www.sim.ai/api/workflows/6f0cb809-a0cd-46e9-bad6-ca662c83af26/execute";

// AI එකෙන් පිළිතුරක් ලබාගන්නා Function එක
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
      aiReply = typeof response.data.output === "string" ? response.data.output : response.data.output.content;
    } else if (response.data?.message) aiReply = response.data.message;
    
    return aiReply;
  } catch (error) {
    console.error("SIM.AI Error:", error.message);
    return "AI failed to respond.";
  }
};

// මැසේජ් එකක් යැවීම
export const sendUserMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1️⃣ @admin case (Admin ට මැසේජ් එකක් යන විට)
    if (message.includes("@admin")) {
      await userToAdminMessage.findOneAndUpdate(
        { userId },
        { $push: { messages: { sender: "user", text: message } } },
        { upsert: true }
      );

      return res.status(201).json({
        messages: [
          { sender: "user", text: message, createdAt: new Date() },
          { sender: "ai", text: "Admin will reply soon", createdAt: new Date() },
        ],
      });
    }

    // 2️⃣ Normal AI Chat (අලුත් Schema එකට අනුව)
    let chat = await userMessage.findOne({ userId });

    // User ගේ මැසේජ් එක Object එකක් විදිහට හදනවා
    const userMsgObj = { sender: "user", text: message };

    if (!chat) {
      chat = await userMessage.create({
        userId,
        messages: [userMsgObj], // ✅ Array of Objects
      });
    } else {
      chat.messages.push(userMsgObj);
      await chat.save();
    }

    // AI පිළිතුර ලබා ගැනීම
    const aiReply = await getAIReply(message);
    const aiMsgObj = { sender: "ai", text: aiReply };

    // AI පිළිතුරත් push කරනවා
    chat.messages.push(aiMsgObj);
    await chat.save();

    // Frontend එකට මුළු message array එකම යවනවා
    res.status(201).json({ messages: chat.messages });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: error.message });
  }
};

// පරණ මැසේජ් සියල්ල ලබා ගැනීම
export const getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const chat = await userMessage.findOne({ userId });

    if (!chat) return res.status(200).json({ messages: [] });

    // ✅ දැන් මෙතන map කරන්න ඕන නෑ, Database එකේ දැනටමත් තියෙන්නේ Objects
    res.status(200).json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin ගේ පිළිතුරු ලබා ගැනීම
export const getAdminReplies = async (req, res) => {

    
  try {
    const userId = req.user.id;
  
    const chat = await userToAdminMessage.findOne({ userId });

    if (!chat || !chat.messages) return res.status(200).json({ messages: [] });

    const adminMessages = chat.messages.filter((msg) => msg.sender === "admin");
    res.status(200).json({ messages: adminMessages });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
`````

## File: controller/notificationController.js
`````javascript
// controller/notificationController.js

import userToAdminMessage from "../models/userToAdminMessage.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const allMessages = await userToAdminMessage.find().sort({ updatedAt: -1 });
    
    const notifications = allMessages.map(doc => {
      const lastMsg = doc.messages[doc.messages.length - 1];
      return {
        _id: doc._id,
        userId: doc.userId,
        message: lastMsg.text,
        // ✅ අන්තිම මැසේජ් එකේ isRead අගය කෙලින්ම යවන්න
        isRead: lastMsg.isRead || false, 
        sentAt: lastMsg.createdAt
      };
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req.body; // ඔයා Frontend එකෙන් එවන්නේ userId එක

    // සියලුම user messages read ලෙස mark කිරීම
    await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $set: { "messages.$[elem].isRead": true, isRead: true } 
      },
      { 
        arrayFilters: [{ "elem.sender": "user" }], 
        new: true 
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







// controller/notificationController.js

export const replyToUserNotification = async (req, res) => {
  try {
    const { userId } = req.params; // URL එකෙන් userId එක ගනී (:userId)
    const { message } = req.body;  // Frontend එකෙන් එවන පණිවිඩය

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    // 1. User ගේ chat document එක සොයාගෙන පණිවිඩය ඇතුළත් කිරීම
    const chat = await userToAdminMessage.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          messages: { 
            sender: "admin", 
            text: message,
            isRead: true // Admin යවන මැසේජ් එක Admin ටම Notification එකක් වෙන්නේ නැති නිසා true කරයි
          } 
        },
        // 2. මුළු Chat එකම 'Read' ලෙස සලකුණු කරයි (Notification Badge එක අයින් වීමට)
        $set: { isRead: true } 
      },
      { new: true } // Update වූ පසු අලුත් දත්ත ලබා ගැනීමට
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat history not found for this user" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Reply Error:", error);
    res.status(500).json({ error: error.message });
  }
};










export const getFullChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chat = await userToAdminMessage.findOne({ userId });
    
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages); // සියලුම පණිවිඩ Array එක යවයි
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
`````

## File: controller/orderController.js
`````javascript
import Order from "../models/orders.js";
import Product from "../models/products.js";
import User from "../models/users.js";

// Existing getQote function
export async function getQote(req, res) {
  try {
    const newOrderData = req.body;

    // 1. Array එක තිබේදැයි පරීක්ෂා කිරීම (Safety Check)
    if (!newOrderData.orderedItems || !Array.isArray(newOrderData.orderedItems)) {
      return res.status(400).json({ message: "orderedItems array is required" });
    }

    let labelTotal = 0;
    let total = 0;
    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      let productId = newOrderData.orderedItems[i].productId;
      
      const product = await Product.findOne({ productId: productId });

      if (!product) {
        return res.status(404).json({
          message: "product with id " + productId + " not found",
        });
      }
      
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}.`
        });
      }
      
      // වැදගත්: මෙතැන field names හරියටම database එකට සමාන විය යුතුයි
      labelTotal += newOrderData.orderedItems[i].qty * product.price;
      
      // මෙතන 'lastPrices' ද නැත්නම් 'lastPrice' ද කියලා schema එක බලන්න
      const unitPrice = product.lastPrice || product.price; 
      total += newOrderData.orderedItems[i].qty * unitPrice;

      newProductArray.push({
        productId: productId,
        productName: product.productName,
        price: product.price,
        lastPrice: unitPrice, // schema එකට අනුව වෙනස් කරන්න
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
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


// Create new order
// export async function createOrder(req, res) {
//   try {
//     const userId = req.user.id;
//     const {
//       items,
//       shippingAddress,
//       paymentMethod = "card",
//       paymentStatus = "pending"
//     } = req.body;

//     // Validate required fields
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Order items are required" });
//     }

//     if (
//       !shippingAddress ||
//       !shippingAddress.name ||
//       !shippingAddress.addressLine1 ||
//       !shippingAddress.city ||
//       !shippingAddress.province ||
//       !shippingAddress.postalCode
//     ) {
//       return res.status(400).json({ message: "Shipping address is incomplete" });
//     }

//     // Calculate order totals and validate stock
//     let subtotal = 0;
//     let discount = 0;
//     const orderItems = [];

//     for (const item of items) {
//       const product = await Product.findOne({ productId: item.productId });
      
//       if (!product) {
//         return res.status(404).json({ 
//           message: `Product ${item.productId} not found` 
//         });
//       }

//       if (product.stock < item.qty) {
//         return res.status(400).json({ 
//           message: `Insufficient stock for ${product.productName}. Available: ${product.stock}, Requested: ${item.qty}` 
//         });
//       }

//       const itemPrice = item.lastPrice || product.lastPrices;
//       const itemTotal = itemPrice * item.qty;
//       const originalPrice = product.price * item.qty;
      
//       subtotal += itemTotal;
//       discount += (originalPrice - itemTotal);

//       orderItems.push({
//         productId: product._id,
//         productName: product.productName,
//         image: product.images?.[0] || "",
//         qty: item.qty,
//         lastPrice: itemPrice
//       });

//       // Update product stock
//       product.stock -= item.qty;
//       await product.save();
//     }

//     const shippingFee = 0; // You can add shipping fee logic here
//     const total = subtotal + shippingFee - (discount > 0 ? discount : 0);

//     // Generate unique order ID
//     const orderId = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;

//     // Create new order
//     const newOrder = new Order({
//       userId,
//       orderId,
//       items: orderItems,
//       subtotal,
//       discount: discount > 0 ? discount : 0,
//       shippingFee,
//       total,
//       paymentStatus,
//       paymentMethod,
//       shippingAddress,
//       status: "processing"
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: savedOrder
//     });

//   } catch (error) {
//     console.error("Create order error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to create order", 
//       error: error.message 
//     });
//   }
// }


// Get all orders for current user
export async function getOrdersByUser(req, res) {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

      console.log(orders)

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

















export const getAllUserOrdersForAdmin = async (req, res) => {
  try {

    

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

      console.log(orders)

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};













const ALLOWED_STATUSES = [
  "Pending",
  "Confirmed",
  "Delivered",
  "Cancelled",
];

export const AdminupdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;



    

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
};
`````

## File: middleware.js
`````javascript
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
`````

## File: models/orders.js
`````javascript
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
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
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

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
`````

## File: models/userToAdminMessage.js
`````javascript
import mongoose from "mongoose";

// models/userToAdminMessage.js
const userToAdminSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        text: { type: String, required: true },
        isRead: { type: Boolean, default: false }, // ✅ මේක අලුතින් එක් කරන්න
        createdAt: { type: Date, default: Date.now }
      }
    ],
    // මෙතන තියෙන isRead එක මුළු chat එකේම status එක විදිහට පාවිච්චි කරන්න පුළුවන්
    isRead: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const userToAdminMessage = mongoose.model("userToAdminMessage", userToAdminSchema);
export default userToAdminMessage;
`````

## File: package.json
`````json
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
`````

## File: routes/messageRouter.js
`````javascript
import express from "express";
import {  getAdminReplies, getUserMessages, sendUserMessage } from "../controller/messageController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Send user message + AI reply
router.post("/sendmessage", authMiddleware, sendUserMessage);

// Get all messages for logged-in user
router.get("/getmessages", authMiddleware, getUserMessages);

router.get("/getadminreplies", authMiddleware, getAdminReplies);

export default router;
`````

## File: routes/notificationRouter.js
`````javascript
import express from "express";
import { getAdminNotifications, getFullChatHistory, markNotificationAsRead, replyToUserNotification,  } from "../controller/notificationController.js";

const router = express.Router();

// URL: /api/notifications/getNotifications
router.get("/getNotifications", getAdminNotifications);

// URL: /api/notifications/reply/:userId
router.post("/reply/:userId", replyToUserNotification);
router.get("/getChat/:userId", getFullChatHistory);

router.post("/markRead", markNotificationAsRead);

export default router;
`````

## File: index.js
`````javascript
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

app.use("/api/notifications", notificationRouter);


app.use("/api/ads", adsRouter);



// Start Server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
`````
