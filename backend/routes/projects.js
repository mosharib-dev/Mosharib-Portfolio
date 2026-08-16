import { Router } from "express";
import Project from "../models/Project.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// GET /api/projects/:slug
router.get("/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Failed to load project" });
  }
});

// POST /api/projects  (requires admin login — see middleware/requireAuth.js)
router.post("/", requireAuth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;