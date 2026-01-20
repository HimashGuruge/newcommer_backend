import axios from "axios";
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import nodemailer from "nodemailer";
import crypto from "crypto"; 


const JWT_SECRET = "himashguruge";

/**
 * 1. අලුත් User කෙනෙක් සෑදීම (Registration)
 */
export function createNewUser(req, res) {
  const newuserdata = req.body;

  // Admin කෙනෙක්ව හදන්න හදනවා නම් ඉල්ලන පුද්ගලයා Admin විය යුතුයි
  if (newuserdata.role == "admin") {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }
  }

  const user = new User(newuserdata);
  user
    .save()
    .then((savedUser) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: savedUser,
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

/**
 * 2. Login වීම සහ Token එක ලබා දීම
 */
export const Loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Password එක කෙලින්ම check කිරීම (Hashing පාවිච්චි කරන්නේ නැතිනම්)
    if (findUser.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
      JWT_SECRET
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
        address: findUser.address || "",
        profileImage: findUser.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

/**
 * 3. Log වී සිටින User ගේ විස්තර ලබා ගැනීම
 */
export const getCurrentUserHandler = async (req, res) => {
  try {
    // Middleware එකෙන් එන user id එක පාවිච්චි කරයි
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * 4. Profile එක Update කිරීම (Frontend 'Save' Button එකට)
 */
export const updateUserInfo = async (req, res) => {

  try {
    const userId = req.user.id;
    // Extract profileImage from the request body
    const { name, lastname, phone, email, address, profileImage } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Email are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        lastname, 
        phone, 
        email, 
        address, 
        profileImage // 🟢 Added this line to save the URL to the database
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. සියලුම Users ලා ලබා ගැනීම (Admin සඳහා)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * 6. ID එක මගින් නිශ්චිත User කෙනෙක් සෙවීම
 */
export const getUserByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Invalid User ID format or Server error",
    });
  }
};


















// --- HARDCODED VALUES ---
const GOOGLE_CLIENT_ID = "865120672100-nhmc7gk52kqk7h1obfhl2cv2v3an6e9d.apps.googleusercontent.com";
const JWT_SECRET_KEY = "himashguruge"; 

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function googleLogin(req, res) {
  // 1. Google Redirect mode එවන්නේ 'credential' නමින්
  const token = req.body.credential || req.body.token; 

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, // ඔයාගේ අලුත් ID එක
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture, sub } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = new User({
        name: given_name,
        lastname: family_name || "",
        email: email,
        googleId: sub,
        role: "user",
        profileImage: picture,
        address: "No address",
        phone: "No phone Number",
      });
      await user.save();
      isNewUser = true;
    } else {
      if (!user.googleId) {
        user.googleId = sub;
        if (!user.profileImage || user.profileImage.includes("img.freepik.com")) {
          user.profileImage = picture;
        }
        await user.save();
      }
    }

    const jwtToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // 2. Redirect mode එකේදී JSON එකක් දෙනවා වෙනුවට Frontend එකට Redirect කරන්න
    // අපි Token එක URL params විදිහට යවනවා
    const frontendURL = `http://localhost:3001/login-success?token=${jwtToken}&role=${user.role}`;
    return res.redirect(frontendURL);

  } catch (err) {
    console.error("Google Auth Error:", err.message);
    // Error එකක් ආවොත් ලොගින් පේජ් එකටම යවන්න
    return res.redirect("http://localhost:3001/login?error=auth_failed");
  }
}




























export const forgotPassword = async (req, res) => {
  const { email } = req.body;



  try {
    const user = await User.findOne({ email: email.toLowerCase() });



    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // අහඹු Token එකක් සෑදීම
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token එක Hash කර DB එකේ Save කිරීම (ආරක්ෂාව සඳහා)
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // පැය 1කින් කාලය අවසන් වේ (1 hour)

    await user.save();

    // Reset URL එක සෑදීම (Frontend URL එක මෙතනට දාන්න)
    const resetUrl = `http://localhost:3001/reset-password/${resetToken}`;

    // Email එක යැවීම සඳහා Transporter එක සෑදීම
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "himezguruge@gmail.com", // ඔබේ Email එක
        pass: "dajy csmv lcco whmt",    // Google App Password එක
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h3>You requested a password reset</h3>
        <p>Please click on the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Email could not be sent", error: error.message });
  }
};









export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;


    // 1. ලැබෙන Token එක Hash කිරීම (Trim කිරීම අමතක කරන්න එපා)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token.trim())
      .digest("hex");

    console.log("Token from URL:", token);
    console.log("Hashed Token to search:", hashedToken);

    // 2. User සෙවීම
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // වැරැද්ද කුමක්දැයි හරියටම හඳුනා ගැනීමට (Debugging):
      const userExistsButExpired = await User.findOne({ resetPasswordToken: hashedToken });
      
      if (!userExistsButExpired) {
        return res.status(400).json({ success: false, message: "මෙම Token එක Database එකේ නැත." });
      } else {
        return res.status(400).json({ success: false, message: "Token එකේ කාලය ඉකුත් වී ඇත." });
      }
    }

    // 3. Password එක සේව් කිරීම
    // ඔබේ Model එකේ auto-hash වෙන්නේ නැත්නම් මෙතනදී bcrypt භාවිතා කරන්න
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};













