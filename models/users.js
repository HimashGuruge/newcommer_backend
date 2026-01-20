import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "First name is required"], trim: true },
    lastname: { type: String, required: false, trim: true, default: "" },
    email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "No phone Number" },
    address: { type: String, trim: true, default: "No address" },
    password: {
      type: String,
      required: function() { return !this.googleId; },
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profileImage: { type: String, default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" },
    
    // --- මෙන්න මේ පේළි දෙක අනිවාර්යයෙන්ම තිබිය යුතුයි ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
    // -----------------------------------------------
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;