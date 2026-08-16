import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Single-owner login: credentials live in env vars, not a database, since
// there's exactly one admin. POST { email, password } -> { token }.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPasswordHash || !jwtSecret) {
    return res.status(503).json({ error: "Admin login is not configured on this server" });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ email: adminEmail, role: "admin" }, jwtSecret, { expiresIn: "7d" });
  res.json({ token });
});

export default router;