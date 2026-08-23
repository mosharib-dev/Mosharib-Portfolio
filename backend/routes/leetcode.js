import { Router } from "express";

const router = Router();

let cache = { data: null, ts: 0 };
const CACHE_TTL = 1000 * 60 * 60; // 1 hour — this data changes slowly

// GET /api/leetcode/stats — problems solved by difficulty + current streak,
// via LeetCode's public (unofficial) GraphQL endpoint. No auth needed since
// this only reads a public profile, but LeetCode does sometimes rate-limit
// or block non-browser requests — this degrades gracefully if so.
router.get("/stats", async (req, res) => {
  const username = process.env.LEETCODE_USERNAME;
  if (!username) return res.status(400).json({ error: "LEETCODE_USERNAME not configured" });

  if (cache.data && Date.now() - cache.ts < CACHE_TTL) {
    return res.json(cache.data);
  }

  const query = `
    query userStats($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
    }
  `;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (portfolio-site)",
      },
      body: JSON.stringify({ query, variables: { username } }),
    });
    if (!response.ok) throw new Error(`LeetCode responded ${response.status}`);
    const json = await response.json();
    const user = json.data?.matchedUser;
    if (!user) throw new Error("User not found");

    const byDifficulty = Object.fromEntries(
      user.submitStats.acSubmissionNum.map((d) => [d.difficulty.toLowerCase(), d.count])
    );

    const result = {
      total: byDifficulty.all || 0,
      easy: byDifficulty.easy || 0,
      medium: byDifficulty.medium || 0,
      hard: byDifficulty.hard || 0,
      streak: user.userCalendar?.streak || 0,
      totalActiveDays: user.userCalendar?.totalActiveDays || 0,
    };

    cache = { data: result, ts: Date.now() };
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: "Could not reach LeetCode", detail: err.message });
  }
});

export default router;