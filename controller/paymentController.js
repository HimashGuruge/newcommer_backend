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