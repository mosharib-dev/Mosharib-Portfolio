import { useEffect, useState } from "react";
import client from "../api/client";

export default function SystemStatus() {
  const [state, setState] = useState({ checking: true, online: null, latency: null });

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const start = performance.now();
      try {
        await client.get("/health");
        if (!cancelled) setState({ checking: false, online: true, latency: Math.round(performance.now() - start) });
      } catch {
        if (!cancelled) setState({ checking: false, online: false, latency: null });
      }
    };
    check();
    const id = setInterval(check, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const label = state.checking
    ? "CHECKING…"
    : state.online
    ? `API ONLINE · ${state.latency}ms`
    : "API UNREACHABLE";

  return (
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
      <span
        className={`h-2 w-2 rounded-full ${
          state.checking ? "bg-muted" : state.online ? "bg-data" : "bg-danger"
        }`}
      />
      {label}
    </div>
  );
}