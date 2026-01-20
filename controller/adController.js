import Ad from "../models/ads.js"; // Ensure your model is imported

export const createAd = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // 1. Validation
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title and imageUrl are mandatory.",
      });
    }

    // 2. Create entry in MongoDB
    const ad = await Ad.create({
      title,
      imageUrl,
    });

    // 3. Success Response
    return res.status(201).json({
      success: true,
      message: "Ad successfully published to database",
      data: ad,
    });
  } catch (error) {
    console.error("Ad Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// සියලුම Ads ලබා ගැනීම (Frontend එකේ Slider එක සඳහා)
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 }); // අලුත්ම ඒවා මුලට
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ads", error });
  }
};

// 🟢 Ad එකක් මකා දැමීම
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await Ad.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ad", error });
  }
};

// 🟢 Ad එකක Status එක (Active/Inactive) වෙනස් කිරීම
export const toggleAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.isActive = !ad.isActive; // තිබෙන status එක මාරු කිරීම
    await ad.save();

    res
      .status(200)
      .json({
        message: `Ad is now ${ad.isActive ? "Active" : "Inactive"}`,
        ad,
      });
  } catch (error) {
    res.status(500).json({ message: "Status update failed", error });
  }
};
