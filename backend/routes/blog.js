import { Router } from "express";
import BlogPost from "../models/BlogPost.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true }).sort({ publishedAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to load posts" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to load post" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;