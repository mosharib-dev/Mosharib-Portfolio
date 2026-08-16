import { useEffect, useState } from "react";
import client from "../api/client";

function levelFor(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const levelClasses = [
  "bg-surface2",
  "bg-signal/25",
  "bg-signal/45",
  "bg-signal/70",
  "bg-signal",
];

export default function ContributionHeatmap() {
  const [state, setState] = useState({ loading: true, error: false, weeks: [], total: 0 });

  useEffect(() => {
    client
      .get("/github/contributions")
      .then((res) => setState({ loading: false, error: false, weeks: res.data.weeks, total: res.data.total }))
      .catch(() => setState({ loading: false, error: true, weeks: [], total: 0 }));
  }, []);

  if (state.loading) return <p className="readout">loading contribution history…</p>;

  if (state.error) {
    return (
      <p className="readout">
        contribution data unavailable — set GITHUB_TOKEN in backend/.env (required for this endpoint only)
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {state.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                className={`h-[11px] w-[11px] rounded-sm ${levelClasses[levelFor(day.count)]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
        <span>{state.total} contributions in the last year</span>
        <div className="flex items-center gap-1">
          <span>less</span>
          {levelClasses.map((c, i) => (
            <span key={i} className={`h-[10px] w-[10px] rounded-sm ${c}`} />
          ))}
          <span>more</span>
        </div>
      </div>
    </div>
  );
}