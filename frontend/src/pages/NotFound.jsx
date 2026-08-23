import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="panel w-full overflow-hidden text-left">
        <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-data/70" />
          <span className="ml-2 font-mono text-xs uppercase tracking-wider text-muted">
            route-diagnostic.log
          </span>
        </div>
        <div className="px-6 py-8 font-mono text-sm">
          <p className="text-danger">$ GET {typeof window !== "undefined" ? window.location.pathname : "/unknown"}</p>
          <p className="mt-3 text-ink">
            <span className="text-danger">✗</span> 404 — no route matched this path
          </p>
          <p className="mt-1 text-muted">The page you're looking for doesn't exist, or the link is out of date.</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 font-mono text-sm">
        <Link
          to="/"
          className="rounded bg-signal px-5 py-3 font-semibold text-base transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          to="/projects"
          className="rounded border border-line px-5 py-3 text-ink transition-colors hover:border-signal"
        >
          View projects
        </Link>
      </div>
    </div>
  );
}