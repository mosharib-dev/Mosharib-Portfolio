import { useEffect, useState } from "react";
import client from "../api/client";

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ["y", 31536000],
    ["mo", 2592000],
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
  ];
  for (const [label, secs] of units) {
    const v = Math.floor(seconds / secs);
    if (v >= 1) return `${v}${label} ago`;
  }
  return "just now";
}

// Live diagnostics panel — real recent GitHub activity, not decoration.
// Styled like a terminal window to match the console identity.
export default function ActivityFeed() {
  const [state, setState] = useState({ loading: true, error: false, events: [] });

  useEffect(() => {
    client
      .get("/github/activity")
      .then((res) => setState({ loading: false, error: false, events: res.data }))
      .catch(() => setState({ loading: false, error: true, events: [] }));
  }, []);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-data/70" />
        <span className="ml-2 font-mono text-xs uppercase tracking-wider text-muted">
          live-activity.log
        </span>
      </div>

      <div className="min-h-[220px] px-5 py-4 font-mono text-sm">
        {state.loading ? (
          <p className="readout">connecting to github…</p>
        ) : state.error || state.events.length === 0 ? (
          <p className="readout">
            {state.error
              ? "could not reach github — set GITHUB_USERNAME in backend/.env"
              : "no recent public activity"}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {state.events.map((e, i) => (
              <li key={i} className="flex gap-3 text-ink">
                <span className="shrink-0 text-data">$</span>
                <span className="flex-1">{e.line}</span>
                <span className="shrink-0 text-xs text-muted">{timeAgo(e.at)}</span>
              </li>
            ))}
            <li className="flex gap-3 text-muted">
              <span className="shrink-0 text-data">$</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-signal/70" />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}