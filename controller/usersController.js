import User from "../models/users.js";
import jwt from "jsonwebtoken";




export function createNewUser(req, res) {
  const newuserdata = req.body;

  if(newuserdata.role == 'admin'){
    if(req.user == null){
       res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
      return;
    }

    if(req.user.role !== 'admin'){
      res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
      return;
    }
  }


  const user = new User(newuserdata);
  user
    .save()
    .then((user) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Error creating user",
        error: err.message,
      });
    });

 
  }





export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    if (findUser.password !== password) {
      return res.status(401).json({
        success: false,
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: findUser._id,
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
        phone: findUser.phone || "",
        role: findUser.role,
        profileImage: findUser.profileImage,
      },
      "himashguruge"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: findUser._id,
        name: findUser.name,
        lastname: findUser.lastname,
        email: findUser.email,
        phone: findUser.phone || "",
        role: findUser.role,
        profileImage: findUser.profileImage,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: err.message,
    });
  }
};

export const getCurrentUserHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "himashguruge");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error("getCurrentUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    console.error("getAllUsers error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("getUserById error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export async function currentuser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ✅ ADD THIS MISSING FUNCTION:
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, lastname, phone, email } = req.body;

    if (!name || !lastname || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, lastname, phone, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Corrected route handler
export function me(req, res) {
  const userId = req.user._id;

  // Assuming 'users' is your in-memory array or DB fetch
  const user = users.find((u) => u._id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
}
