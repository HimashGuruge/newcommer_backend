import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Name fields
    name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    
    // Contact info
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {  // ✅ ADD THIS FIELD
      type: String,
      trim: true,
      default: "",
    },
    
    // Address (optional - for basic storage)
    address: {  // ✅ Make this optional since we have separate Address model
      type: String,
      trim: true,
      default: "",
    },
    
    // Authentication
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    
    // Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
    // Profile
    profileImage: {
      type: String,
      default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    },
  },
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);
export default User;