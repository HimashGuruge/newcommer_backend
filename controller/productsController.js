import Product from "../models/products.js";

export async function addproduct(req, res) {
  try {
    const {
      productId,
      productName,
      altNames,
      price,
      lastPrices,
      stock,
      description,
      category,
      brand,
      images,
    } = req.body;

    if (!productId || !productName || !price || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = await Product.create({
      productId,
      productName,
      altNames,
      price,
      lastPrices,
      stock,
      description,
      category,
      brand,
      images,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Product creation error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const updateData = { ...req.body };

    // Validate status if provided
    if (
      updateData.status &&
      !["pending", "ready", "delivered"].includes(updateData.status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Controller function
export async function productFindById(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: "Product found successfully",
      product,
    });
  } catch (error) {
    console.error("Product update error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
