import jwt from "jsonwebtoken";

// Protects routes behind a valid JWT issued by POST /api/auth/login.
// Client sends it as: Authorization: Bearer <token>
export default function requireAuth(req, res, next) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(503).json({ error: "Admin login is not configured on this server" });
  }

  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  try {
    req.admin = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}