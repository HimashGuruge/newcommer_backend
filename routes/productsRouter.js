import express from "express";
import {
  addproduct,
  deleteProduct,
  getAllProducts,
  productFindById,
  updateProduct,
} from "../controller/productsController.js";
import adminOnly from "../middleware.js";

const router = express.Router();

router.post("/", adminOnly, addproduct);
router.get("/", getAllProducts);
router.get("/:productId", productFindById);
router.patch("/", adminOnly, updateProduct);
router.delete("/:productId", adminOnly, deleteProduct);

export default router;
