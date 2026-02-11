import Ad from "../models/ads.js"; 

// 🟢 1. Ad එකක් Create කිරීම (Admin Panel එකෙන්)
export const createAd = async (req, res) => {
  try {
    // category එකත් body එකෙන් ලබා ගන්නවා
    const { title, imageUrl, category } = req.body;

    // Validation
    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "මාතෘකාව (title) සහ රූපය (imageUrl) අනිවාර්ය වේ.",
      });
    }

    // Database එකේ save කිරීම
    const ad = await Ad.create({
      title,
      imageUrl,
      category: category || 'home', // category එකක් නැත්නම් 'home' ලෙස default සේව් වේ
    });

    return res.status(201).json({
      success: true,
      message: "Ad එක සාර්ථකව Database එකට ඇතුළත් කළා.",
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

// 🟢 2. Ads ලබා ගැනීම (Category අනුව Filter කිරීමේ හැකියාව සහිතව)
export const getAds = async (req, res) => {
  try {
    const { category } = req.query; // URL එකේ ?category=mens-fashion වගේ එන query එක ගන්නවා
    
    let filter = {};
    
    // ඉදිරිපසින් (Frontend) category එකක් එවා ඇත්නම් පමණක් filter එකට එක් කරයි
    if (category && category !== 'all') {
      filter.category = category;
    }

    const ads = await Ad.find(filter).sort({ createdAt: -1 }); 
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Ads ලබා ගැනීමට නොහැකි විය.", error });
  }
};

// 🟢 3. Ad එකක් මකා දැමීම
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await Ad.findByIdAndDelete(id);

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad එක හමු නොවීය." });
    }

    res.status(200).json({ message: "Ad එක සාර්ථකව මකා දැමුවා." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ad", error });
  }
};

// 🟢 4. Ad එකක Status එක (Active/Inactive) වෙනස් කිරීම
export const toggleAdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.status = ad.status === 'active' ? 'paused' : 'active'; 
    await ad.save();

    res.status(200).json({
      message: `Ad is now ${ad.status}`,
      ad,
    });
  } catch (error) {
    res.status(500).json({ message: "Status update failed", error });
  }
};