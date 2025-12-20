import express from "express";
import adminOnly from "../middleware.js"; // admin role check
import authMiddleware from "../middleware.js"; // only token check
import { 
  createNewUser, 
  currentuser, 
  getAllUsers, 
  getCurrentUserHandler, 
  getUserByIdHandler, 
  Loginuser,
  me,
  updateUserInfo
} from "../controller/usersController.js";

const userRouter = express.Router();

// Admin-only routes
userRouter.post("/", createNewUser); 

userRouter.get("/", adminOnly, getAllUsers);

// Logged-in user routes
userRouter.get("/me", authMiddleware, getCurrentUserHandler);
userRouter.put("/me", authMiddleware, updateUserInfo);

// Public routes
userRouter.post("/login", Loginuser);
userRouter.get("/me", authMiddleware, me);

// Admin or public route to get specific user by ID
userRouter.get("/:userId", adminOnly, getUserByIdHandler); 

export default userRouter;
