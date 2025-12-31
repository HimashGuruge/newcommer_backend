import express from "express";

import authMiddleware from "../middleware.js";
import { generatePayHereHash, payHereNotify, placeCODOrder } from "../controller/paymentController.js";


const router = express.Router();

router.post("/generate-hash", authMiddleware, generatePayHereHash);
router.post("/notify", payHereNotify); // PayHere IPN (NO auth)
router.post("/cod", authMiddleware, placeCODOrder);

export default router;
