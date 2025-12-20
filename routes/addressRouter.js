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