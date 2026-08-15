import { Router } from "express";

const router = Router();

// Simple in-memory cache so we don't hammer the unauthenticated
// GitHub rate limit (60 req/hr) every time someone visits the site.
let cache = { data: null, ts: 0 };
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes
let activityCache = { data: null, ts: 0 };

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
        homepage: r.homepage && r.homepage.trim() ? r.homepage.trim() : null,
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

// GET /api/github/activity — recent public GitHub activity, reshaped into
// short human-readable log lines for the "live diagnostics" feed on Home.
router.get("/activity", async (req, res) => {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return res.status(400).json({ error: "GITHUB_USERNAME not configured" });

  if (activityCache.data && Date.now() - activityCache.ts < CACHE_TTL) {
    return res.json(activityCache.data);
  }

  try {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=30`,
      { headers }
    );
    if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
    const events = await response.json();

    const toLine = (e) => {
      const repo = e.repo?.name?.split("/")[1] || e.repo?.name;
      switch (e.type) {
        case "PushEvent": {
          const n = e.payload?.commits?.length || 1;
          return `pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`;
        }
        case "CreateEvent":
          if (e.payload?.ref_type === "repository") return `created repository ${repo}`;
          if (e.payload?.ref_type === "branch") return `created branch ${e.payload.ref} on ${repo}`;
          return null;
        case "PullRequestEvent":
          return `${e.payload?.action} a pull request on ${repo}`;
        case "IssuesEvent":
          return `${e.payload?.action} an issue on ${repo}`;
        case "ReleaseEvent":
          return `published a release on ${repo}`;
        case "PublicEvent":
          return `made ${repo} public`;
        default:
          return null;
      }
    };

    const cleaned = events
      .map((e) => ({ line: toLine(e), at: e.created_at }))
      .filter((e) => e.line)
      .slice(0, 8);

    activityCache = { data: cleaned, ts: Date.now() };
    res.json(cleaned);
  } catch (err) {
    res.status(502).json({ error: "Could not reach GitHub", detail: err.message });
  }
});

export default router;