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
    // එකම අවස්ථාවේ භාණ්ඩ කිහිපයක් update කිරීමට Promise.all භාවිතා කිරීම වඩා වේගවත් වේ
    const updatePromises = items.map((item) =>
      Product.findOneAndUpdate(
        {
          productId: item.productId,
          stock: { $gte: item.qty }, // ආරක්‍ෂිත පියවරක්: stock එක qty එකට වඩා වැඩි නම් පමණක් අඩු කරන්න
        },
        { $inc: { stock: -item.qty } },
        { new: true },
      ),
    );

    const results = await Promise.all(updatePromises);

    // යම් හෙයකින් එක් භාණ්ඩයක් හෝ update නොවූයේ නම් (Null ලැබුණොත්) එය දැනුම් දීම
    if (results.includes(null)) {
      console.warn("Update failed: Some items have insufficient stock.");
    } else {
      console.log("Success: All item stock levels have been updated.");
    }
  } catch (error) {
    console.error("Stock Update Error:", error.message);
    throw new Error("Stock update process failed."); // Controller එකට error එක pass කිරීම
  }
};

// --- 1. Place COD Order ---
export const placeCODOrder = async (req, res) => {
  try {
    const user = req.user;
    const orderedData = req.body;

    // --- 1. STOCK VALIDATION (Stock තිබේදැයි කලින් පරීක්ෂා කිරීම) ---
    for (const item of orderedData.orderedItems) {
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productName}`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.productName}. (Available: ${product.stock})`,
        });
      }
    }

    // --- 2. GENERATE ORDER ---
    const generatedOrderId = "ORD-COD-" + uuidv4().slice(0, 8).toUpperCase();

    const newOrder = new Order({
      userId: user.id,
      orderId: generatedOrderId,
      items: orderedData.orderedItems.map((item) => ({
        productId: item.productId,
        name: item.productName || item.name,
        imageUrl:
          item.image || item.imageUrl || (item.images && item.images[0]),
        qty: item.qty,
        price: item.lastPrice || item.price,
      })),
      totalAmount: orderedData.total,
      paymentMethod: "COD",
      isPaid: false,
      status: "Pending",
      shippingAddress: {
        address: orderedData.shippingAddress,
        phone: orderedData.contactPhone,
        customerName: `${user.firstName} ${user.lastName || ""}`.trim(),
        email: user.email,
      },
    });

    // --- 3. SAVE ORDER & UPDATE STOCK ---
    const savedOrder = await newOrder.save();

    // ඇණවුම සාර්ථක වූ පසු Stock ප්‍රමාණය අඩු කිරීම
    // මෙහිදී try-catch එකක් භාවිතා කිරීම වඩාත් ආරක්ෂිතයි
    try {
      await updateProductStock(newOrder.items);
    } catch (stockError) {
      // යම් හෙයකින් stock update එක fail වුවහොත් order එක roll back කිරීම හෝ log කිරීම කළ හැක
      console.error("Stock Update Failed:", stockError);
    }

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
    const { amount, currency, orderedItems, shippingAddress, contactPhone } =
      req.body;

    if (!MERCHANT_ID || !MERCHANT_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
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
        String(hashedSecret),
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
      hash: hash,
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

    const diffInMinutes =
      (new Date() - new Date(order.createdAt)) / (1000 * 60);

    if (diffInMinutes > 10) {
      return res.status(400).json({
        success: false,
        message:
          "Time limit exceeded! You can only cancel orders within 10 minutes.",
      });
    }

    order.status = "Cancelled";
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
