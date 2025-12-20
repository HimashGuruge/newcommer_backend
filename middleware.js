import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Get the Authorization header
  const secretKey = process.env.SECRET_KEY;

  // Check if secret key is defined
  if (!secretKey) {
    console.error("SECRET_KEY not defined in .env");
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  // No token provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided!" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, secretKey); // Verify token

    // Only allow 'admin' or 'user'
    const allowedRoles = ["admin", "user"];
    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Access Denied: Unknown role!" });
    }

    req.user = decoded; // Attach decoded token (user info) to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" }); // unified invalid token response
  }
}
