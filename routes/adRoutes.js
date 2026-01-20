import express from "express";
import { createAd, getAds, deleteAd, toggleAdStatus } from "../controller/adController.js";

const router = express.Router();

router.post("/", createAd);
router.get("/", getAds);

// අලුතින් එක් කළ යුතු කොටස්:
router.delete("/:id", deleteAd); // Ad එකක් මකා දැමීමට
router.patch("/:id/status", toggleAdStatus); // Ad එක active/inactive කිරීමට

export default router;