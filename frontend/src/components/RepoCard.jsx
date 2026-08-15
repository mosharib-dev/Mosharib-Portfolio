import { resolveRepoImage } from "../utils/projectImage";

export default function RepoCard({ repo }) {
  const image = resolveRepoImage(repo);

  return (
    <div className="panel flex flex-col overflow-hidden transition-colors hover:border-data/40">
      {image && (
        <div className="aspect-video w-full overflow-hidden border-b border-line bg-surface2">
          <img
            src={image}
            alt={`${repo.name} preview`}
            loading="lazy"
            className="h-full w-full object-cover object-top"
            onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-mono text-sm text-ink">{repo.name}</h4>
          {repo.stars > 0 && <span className="readout shrink-0">★ {repo.stars}</span>}
        </div>

        <p className="line-clamp-2 flex-1 text-sm text-muted">
          {repo.description || "No description provided."}
        </p>

        {(repo.language || repo.topics?.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {repo.language && (
              <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-data">
                {repo.language}
              </span>
            )}
            {repo.topics?.slice(0, 4).map((t) => (
              <span key={t} className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-data">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center gap-4 border-t border-line pt-3 font-mono text-xs uppercase tracking-wider">
          <a href={repo.url} target="_blank" rel="noreferrer" className="text-signal hover:underline">
            GitHub →
          </a>
          {repo.homepage && (
            <a href={repo.homepage} target="_blank" rel="noreferrer" className="text-data hover:underline">
              Live ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
