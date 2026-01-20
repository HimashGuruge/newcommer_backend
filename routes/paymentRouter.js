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