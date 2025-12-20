import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  const secretKey = process.env.SECRET_KEY;

  // 1. No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decoded = jwt.verify(token, secretKey); // Replace with your secret

    // 2. Role validation
    if (decoded.role === "admin" || decoded.role === "user") {
      req.user = decoded; // Pass user info to next middleware
      next();
    } else {
      return res.status(403).json({ message: "Access Denied: Unknown role!" });
    }

  } catch (err) {
    // 3. Token errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  }
}
