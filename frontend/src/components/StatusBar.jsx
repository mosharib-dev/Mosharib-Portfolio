import { useEffect, useState } from "react";

// The site's signature element: a diagnostic-readout style status bar,
// echoing the dashboards Mohammad has actually built (BankEase's
// role-based panels, InterviewAI's report views).
export default function StatusBar({ stats }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel grid grid-cols-2 divide-x divide-line border-line sm:grid-cols-4">
      {stats.map((s, i) => (
        <div key={i} className="px-5 py-4">
          <p className="readout">{s.label}</p>
          <p className="mt-1 font-mono text-xl font-medium text-ink">
            {s.value}
            {s.unit && <span className="ml-1 text-sm text-muted">{s.unit}</span>}
          </p>
        </div>
      ))}
      <div className="col-span-2 flex items-center gap-2 border-t border-line px-5 py-3 sm:col-span-4">
        <span
          className="inline-block h-2 w-2 rounded-full bg-data"
          style={{ opacity: tick % 2 === 0 ? 1 : 0.35 }}
        />
        <span className="readout">SYSTEM STATUS: AVAILABLE FOR OPPORTUNITIES</span>
      </div>
    </div>
  );
}
