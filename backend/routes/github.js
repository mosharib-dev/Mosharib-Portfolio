import { Router } from "express";

const router = Router();

// Simple in-memory cache so we don't hammer the unauthenticated
// GitHub rate limit (60 req/hr) every time someone visits the site.
let cache = { data: null, ts: 0 };
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

router.get("/repos", async (req, res) => {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return res.status(400).json({ error: "GITHUB_USERNAME not configured" });

  if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
    return res.json(cache.data);
  }

  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
      { headers }
    );
    if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
    const repos = await response.json();

    const cleaned = repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        homepage: r.homepage && r.homepage.trim() ? r.homepage.trim() : null, // live deploy link, if set on GitHub
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        updatedAt: r.updated_at,
        topics: r.topics || [],
      }));

    cache = { data: cleaned, ts: Date.now() };
    res.json(cleaned);
  } catch (err) {
    res.status(502).json({ error: "Could not reach GitHub", detail: err.message });
  }
});

export default router;
