import express from "express";
import {
  addproduct,
  deleteProduct,
  getAllProducts,
  productFindById,
  updateProduct,
  getProductsByCategory,
} from "../controller/productsController.js";
import adminOnly from "../middleware.js";

const router = express.Router();

router.post("/", adminOnly, addproduct);
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:productId", productFindById);
router.patch("/:productId", adminOnly, updateProduct);
router.delete("/:productId", adminOnly, deleteProduct);

export default router;
