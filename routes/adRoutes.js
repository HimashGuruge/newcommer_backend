import express from "express";
import {
  createAd,
  getAds,
  deleteAd,
  toggleAdStatus,
} from "../controller/adController.js";

const router = express.Router();

router.post("/", createAd);

router.get("/", getAds);

router.delete("/:id", deleteAd);

router.patch("/:id/status", toggleAdStatus);

export default router;
