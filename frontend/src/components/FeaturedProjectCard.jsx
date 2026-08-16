import { useState } from "react";
import { resolveProjectImage } from "../utils/projectImage";

export default function FeaturedProjectCard({ project, rank }) {
  const image = resolveProjectImage(project);
  const [expanded, setExpanded] = useState(false);
  const cs = project.caseStudy;
  const hasCaseStudy = cs && (cs.problem || cs.approach || cs.tradeoffs || cs.result);

  return (
    <div className="panel relative overflow-hidden border-signal/50">
      <div className="absolute right-0 top-0 z-10 border-b border-l border-signal/50 bg-base/90 px-3 py-1">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-signal">
          ★ Featured
        </span>
      </div>

      {image && (
        <div className="aspect-video w-full overflow-hidden border-b border-line bg-surface2">
          <img
            src={image}
            alt={`${project.title} preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top"
            onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          />
        </div>
      )}

      <div className="p-8">
        <div className="flex items-start gap-4">
          <span className="font-mono text-3xl font-semibold text-signal/40">
            {String(rank).padStart(2, "0")}
          </span>
          <div>
            <p className="eyebrow">{project.status?.toUpperCase() || "LIVE"}</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-ink">{project.title}</h3>
            <p className="mt-1 text-sm text-muted">{project.tagline}</p>
          </div>
        </div>

        <p className="mt-5 max-w-2xl leading-relaxed text-ink/85">{project.description}</p>

        {project.highlights?.length > 0 && (
          <div className="mt-5">
            <p className="eyebrow">Features</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.stack?.length > 0 && (
          <div className="mt-6">
            <p className="eyebrow">Tools used</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] text-data">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasCaseStudy && (
          <div className="mt-6 border-t border-line pt-5">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal hover:underline"
              aria-expanded={expanded}
            >
              <span className={`inline-block transition-transform ${expanded ? "rotate-90" : ""}`}>›</span>
              {expanded ? "Hide case study" : "Read full case study"}
            </button>

            {expanded && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {cs.problem && (
                  <div>
                    <p className="eyebrow">Problem</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.problem}</p>
                  </div>
                )}
                {cs.approach && (
                  <div>
                    <p className="eyebrow">Approach</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.approach}</p>
                  </div>
                )}
                {cs.tradeoffs && (
                  <div>
                    <p className="eyebrow">Tradeoffs</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.tradeoffs}</p>
                  </div>
                )}
                {cs.result && (
                  <div>
                    <p className="eyebrow">Result</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{cs.result}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wider">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded bg-signal px-4 py-2 font-semibold text-base transition-opacity hover:opacity-90"
            >
              View on GitHub →
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-data px-4 py-2 text-data transition-colors hover:bg-data/10"
            >
              Live site ↗
            </a>
          )}
          {project.stars !== undefined && <span className="readout">★ {project.stars} stars</span>}
        </div>
      </div>
    </div>
  );
}