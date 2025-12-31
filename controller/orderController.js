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