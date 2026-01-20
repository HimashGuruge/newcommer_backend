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
    // 1. Body එකෙන් productId සහ අනෙකුත් දත්ත වෙන් කර ලබා ගැනීම
    const { productId, ...updateData } = req.body;

    // productId එක නැත්නම් error එකක් දීම
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required in body" });
    }

    // 2. MongoDB එකේ 'productId' කියන field එකෙන් සොයා update කිරීම
    // ඔබේ Schema එකේ තියෙන්නේ 'productId' නම් පහත ආකාරයට ලියන්න
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId }, // Search filter
      { $set: updateData },      // Update කරන දත්ත
      { new: true, runValidators: true } 
    );

    // 3. භාණ්ඩය සොයාගත නොහැකි නම්
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found with this ID" });
    }

    // සාර්ථක ප්‍රතිඵලය
    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Product update error:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Internal Server error" });
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
