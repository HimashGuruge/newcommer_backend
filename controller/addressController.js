// controllers/addressController.js
import Address from "../models/address.js";

// Get all addresses for current user
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    return res.status(200).json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = { ...req.body, userId };

    // If setting as default, update all other addresses
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create(addressData);
    return res.status(201).json(newAddress);
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Check ownership
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting as default, unset others
    if (updateData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findByIdAndUpdate(addressId, updateData, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.findByIdAndDelete(addressId);

    // Optional: if deleted address was default, optionally set another as default
    const remaining = await Address.find({ userId }).sort({ createdAt: -1 });
    if (remaining.length && !remaining.some(a => a.isDefault)) {
      // make the first remaining the default
      await Address.findByIdAndUpdate(remaining[0]._id, { isDefault: true });
    }

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get address by ID
export const getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json(address);
  } catch (error) {
    console.error("Get address by ID error:", error);
    return res.status(500).json({ error: error.message });
  }
};
