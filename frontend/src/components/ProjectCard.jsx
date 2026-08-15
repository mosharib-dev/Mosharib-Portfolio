import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="panel flex flex-col gap-4 p-6 transition-colors hover:border-signal/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">{project.status?.toUpperCase() || "LIVE"}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{project.title}</h3>
        </div>
        <span className="readout">{String(project.order ?? "").padStart(2, "0")}</span>
      </div>

      <p className="text-sm text-muted">{project.tagline}</p>

      {project.stack?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 6).map((t) => (
            <span key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] text-data">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-4 pt-2 font-mono text-xs uppercase tracking-wider">
        <Link to={`/projects/${project.slug}`} className="text-signal hover:underline">
          View details →
        </Link>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-data hover:underline">
            Live ↗
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
            Source
          </a>
        )}
      </div>
    </div>
  );
}
