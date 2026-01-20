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
  markOrdersAsSeen, 
  getDashboardStats,

  // payment
} from "../controller/orderController.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

// Public route for getting quote
router.post("/quote", getQote);

// User routes (require authentication)
//router.post("/", authMiddleware, createOrder); // Create new order
router.get("/my-orders", authMiddleware, getOrdersByUser); // Get user's orders
router.get("/stats", authMiddleware, getDashboardStats);
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


router.put("/mark-seen", authMiddleware, markOrdersAsSeen);




// router.post("/payment", authMiddleware, payment); 


export default router;