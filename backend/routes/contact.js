import { Router } from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }

  try {
    await Contact.create({ name, email, subject, message });

    // Optional: send an email notification if SMTP is configured
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

export default router;
