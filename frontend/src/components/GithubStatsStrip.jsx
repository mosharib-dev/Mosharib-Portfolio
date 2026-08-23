import { useEffect, useState } from "react";
import client from "../api/client";

export default function GithubStatsStrip() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client
      .get("/github/aggregate-stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-wider text-muted">
      <span>
        <span className="text-signal">{stats.publicRepos}</span> public repos
      </span>
      <span>
        <span className="text-signal">★ {stats.totalStars}</span> stars earned
      </span>
      <span>
        <span className="text-signal">{stats.accountAgeYears}+</span> years on GitHub
      </span>
    </div>
  );
}