import express from "express";
// මෙහිදී authMiddleware පමණක් import කරගන්න
import authMiddleware from "../middleware.js";
import {
  createNewUser,
  forgotPassword,
  getAllUsers,
  getCurrentUserHandler,
  getUserByIdHandler,
  googleLogin,
  Loginuser,
  resetPassword,
  updateUserInfo,
} from "../controller/usersController.js";

const userRouter = express.Router();

userRouter.post("/login", Loginuser);

userRouter.get("/me", authMiddleware, getCurrentUserHandler);

userRouter.put("/me", authMiddleware, updateUserInfo);

userRouter.post("/", createNewUser);

userRouter.get("/", authMiddleware, getAllUsers);

userRouter.get("/:userId", authMiddleware, getUserByIdHandler);

userRouter.post("/google", googleLogin);




userRouter.post("/forgot-password", forgotPassword);
userRouter.put("/reset-password/:token", resetPassword);

export default userRouter;
