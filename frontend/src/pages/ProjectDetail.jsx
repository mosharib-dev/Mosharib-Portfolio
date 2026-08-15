import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import Loader from "../components/Loader";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setProject(null);
    setError(false);
    client
      .get(`/projects/${slug}`)
      .then((res) => setProject(res.data))
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 font-display text-2xl text-ink">Project not found</h1>
        <Link to="/projects" className="mt-6 inline-block font-mono text-sm text-signal hover:underline">
          ← Back to all projects
        </Link>
      </div>
    );
  }

  if (!project) return <div className="mx-auto max-w-3xl px-6 py-24"><Loader label="Loading project" /></div>;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-muted hover:text-signal">
        ← All projects
      </Link>

      <p className="eyebrow mt-6">{project.status?.toUpperCase()}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">{project.title}</h1>
      <p className="mt-3 text-lg text-muted">{project.tagline}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack?.map((t) => (
          <span key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] text-data">
            {t}
          </span>
        ))}
      </div>

      <p className="mt-8 leading-relaxed text-ink/90">{project.description}</p>

      {project.highlights?.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow">Highlights</p>
          <ul className="mt-4 space-y-3">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 flex gap-4 font-mono text-sm">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded bg-signal px-5 py-3 font-semibold text-base">
            Live demo
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="rounded border border-line px-5 py-3 text-ink hover:border-signal">
            Source code
          </a>
        )}
      </div>
    </article>
  );
}
