import Category from "../models/categoryModel.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // 1. දැනටමත් තිබේදැයි පරීක්ෂාව
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // 2. Slug එකක් සෑදීම (e.g., "Mobile Phones" -> "mobile-phones")
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 3. Schema එකට අනුව දත්ත සකස් කිරීම
    // ඔයාට Frontend එකෙන් image එකක් එවන්න පුළුවන් නම් ඒක මෙතනට දාන්න. 
    // නැත්නම් දැනට default image එකක් දාමු.
    const newCategory = new Category({
      name: name.trim(),
      slug: slug,
      image: req.body.image || "https://example.com/default-category.png" 
    });

    await newCategory.save();
    res.status(201).json(newCategory);

  } catch (error) {
    res.status(500).json({ message: "Error saving category", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};