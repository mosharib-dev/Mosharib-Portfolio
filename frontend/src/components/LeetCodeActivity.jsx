import { useEffect, useState } from "react";
import client from "../api/client";

export default function LeetCodeActivity() {
  const [state, setState] = useState({ loading: true, error: false, data: null });

  useEffect(() => {
    client
      .get("/leetcode/stats")
      .then((res) => setState({ loading: false, error: false, data: res.data }))
      .catch(() => setState({ loading: false, error: true, data: null }));
  }, []);

  if (state.loading) return <p className="readout">loading leetcode stats…</p>;

  if (state.error || !state.data) {
    return (
      <p className="readout">
        LeetCode data unavailable — set LEETCODE_USERNAME in backend/.env
      </p>
    );
  }

  const { total, easy, medium, hard, streak, totalActiveDays } = state.data;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="readout">Total solved</p>
          <p className="mt-1 font-mono text-xl text-ink">{total}</p>
        </div>
        <div>
          <p className="readout">Current streak</p>
          <p className="mt-1 font-mono text-xl text-signal">{streak}d</p>
        </div>
        <div>
          <p className="readout">Active days</p>
          <p className="mt-1 font-mono text-xl text-ink">{totalActiveDays}</p>
        </div>
        <div>
          <p className="readout">Difficulty</p>
          <p className="mt-1 font-mono text-xs text-muted">
            <span className="text-data">{easy}E</span> · <span className="text-signal">{medium}M</span> ·{" "}
            <span className="text-danger">{hard}H</span>
          </p>
        </div>
      </div>
    </div>
  );
}