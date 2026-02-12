import Order from "../models/orders.js";
import Product from "../models/products.js";
import User from "../models/users.js";
import nodemailer from "nodemailer";
// Existing getQote function
export async function getQote(req, res) {
  try {
    const newOrderData = req.body;

    // 1. Array එක තිබේදැයි පරීක්ෂා කිරීම (Safety Check)
    if (
      !newOrderData.orderedItems ||
      !Array.isArray(newOrderData.orderedItems)
    ) {
      return res
        .status(400)
        .json({ message: "orderedItems array is required" });
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
          message: `Insufficient stock for ${product.productName}.`,
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
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();



    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
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
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
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
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
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
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
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
        message: "Access denied. Admin privileges required.",
      });
    }

    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      page = 1,
      limit = 20,
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
      .populate("userId", "name email phone")
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
        totalOrders,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
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
        message: "Access denied. Admin privileges required.",
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["processing", "shipped", "delivered", "cancelled"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
}

export const getAllUserOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });



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

const ALLOWED_STATUSES = ["Pending", "Confirmed", "Delivered", "Cancelled"];

export const AdminupdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // 1. වලංගු Status එකක්දැයි බැලීම
    const ALLOWED_STATUSES = ["Pending", "Confirmed", "Delivered", "Cancelled"];
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // 2. Order එක සොයාගෙන User විස්තර ලබා ගැනීම (Populate userId)
    const order = await Order.findById(orderId).populate("userId", "email name");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 3. Status එක වෙනස් වී ඇත්නම් පමණක් Update කිරීම
    if (order.status !== status) {
      order.status = status;
      order.isViewedByUser = false; // User ට notification පෙන්වීමට
      await order.save();

      // 4. Email එක යැවීමේ කොටස
      if (order.userId && order.userId.email) {
        // Status එක අනුව පාට තෝරා ගැනීම
        const statusColors = {
          Pending: "#f59e0b",
          Confirmed: "#2563eb",
          Delivered: "#10b981",
          Cancelled: "#ef4444"
        };
        const activeColor = statusColors[status] || "#2563eb";

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "himezguruge@gmail.com",
            pass: "dajy csmv lcco whmt", // App Password
          },
        });

        const mailOptions = {
          to: order.userId.email,
          subject: `Order Update: #${order._id.toString().slice(-6)} is now ${status}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                .wrapper { font-family: 'Arial', sans-serif; background-color: #f4f7f6; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .header { background-color: ${activeColor}; color: white; padding: 30px; text-align: center; }
                .body { padding: 40px; color: #333; line-height: 1.6; }
                .status-badge { display: inline-block; padding: 8px 20px; background: ${activeColor}20; color: ${activeColor}; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 14px; margin: 15px 0; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
                .btn { display: inline-block; padding: 12px 25px; background: ${activeColor}; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="container">
                  <div class="header">
                    <h1 style="margin:0; font-size: 24px;">Order Status Update</h1>
                  </div>
                  <div class="body">
                    <p>Hi <b>${order.userId.name || "Valued Customer"}</b>,</p>
                    <p>Your order <b>#${order._id.toString().slice(-6)}</b> has a new update.</p>
                    
                    <div style="text-align: center;">
                      <div class="status-badge">${status}</div>
                    </div>

                    <p>We're moving things along! You can track your order status in real-time on your dashboard.</p>
                    
                    <div style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL}/my-orders" class="btn">View My Order</a>
                    </div>
                  </div>
                  <div class="footer">
                    <p>Thank you for shopping with us!</p>
                    <p>&copy; ${new Date().getFullYear()} Your Brand Name</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        // Email එක Background එකේ යවන්න (Response එක ප්‍රමාද නොවීමට)
        transporter.sendMail(mailOptions).catch(err => console.error("Email Error: ", err));
      }
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      order
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

// මේක ඔයාගේ controller file එකේ ලියන්න
export const markOrdersAsSeen = async (req, res) => {
  try {
    // req.user.id එන්නේ verifyToken middleware එකෙන්
    const userId = req.user.id;

    const result = await Order.updateMany(
      { userId: userId, isViewedByUser: false },
      { $set: { isViewedByUser: true } }
    );

    res.status(200).json({
      success: true,
      message: "Orders marked as seen successfully",
      modifiedCount: result.modifiedCount, // කීයක් update වුණාද කියලා බලාගන්න (optional)
    });
  } catch (error) {
    console.error("Mark as seen error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order visibility status",
    });
  }
};

export async function getDashboardStats(req, res) {
  try {
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
    ]);

    // Schema එකේ තියෙන 'totalAmount' field එක මෙතන පාවිච්චි කළා
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Confirmed", "Delivered"] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" }, // 👈 මෙතන "$totalAmount" විය යුතුයි
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.revenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue, // මේක දැන් අංකයක් විදිහට යන්නේ
        newUsers: totalUsers,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
}
