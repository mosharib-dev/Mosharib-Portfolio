import { Router } from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  try {
    await Contact.create({ name, email, subject, message });

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject: subject || `New message from ${name}`,
        text: message,
      });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Could not send message. Please try again." });
  }
});

// GET /api/contact — list all messages, newest first (admin only)
router.get("/", requireAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// PATCH /api/contact/:id/read — toggle read state (admin only)
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    msg.read = req.body.read ?? !msg.read;
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: "Failed to update message" });
  }
});

// DELETE /api/contact/:id (admin only)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete message" });
  }
});

export default router;