import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import ProjectCard from "../components/ProjectCard";
import RepoCard from "../components/RepoCard";
import Loader from "../components/Loader";
import client from "../api/client";

const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Projects() {
  const [state, setState] = useState({ loading: true, error: false, featured: [], detailed: [], rest: [] });

  useEffect(() => {
    Promise.allSettled([client.get("/projects"), client.get("/github/repos")]).then(
      ([projectsRes, reposRes]) => {
        const projects = projectsRes.status === "fulfilled" ? projectsRes.value.data : [];
        const repos = reposRes.status === "fulfilled" ? reposRes.value.data : null;

        const featured = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
        const detailed = projects.filter((p) => !p.featured).sort((a, b) => a.order - b.order);

        if (repos === null) {
          setState({ loading: false, error: reposRes.status === "rejected", featured, detailed, rest: [] });
          return;
        }

        // Enrich the flagship cards with live star counts + repo links if a match exists.
        // Prefer the explicit repoName (real GitHub repo name) over slug, since
        // slugs are simplified and don't always match the actual repo name.
        const matchKey = (p) => normalize(p.repoName || p.slug);
        const knownSlugs = new Set(projects.map(matchKey));
        const enrichedFeatured = featured.map((p) => {
          const match = repos.find((r) => normalize(r.name) === matchKey(p));
          return match
            ? { ...p, stars: match.stars, githubUrl: p.githubUrl || match.url, liveUrl: p.liveUrl || match.homepage || "" }
            : p;
        });

        // Everything else, live from GitHub, that isn't already shown above in detail.
        const rest = repos
          .filter((r) => !knownSlugs.has(normalize(r.name)))
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setState({ loading: false, error: false, featured: enrichedFeatured, detailed, rest });
      }
    );
  }, []);

  const { loading, error, featured, detailed, rest } = state;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        index="03"
        label="Build log"
        title="Projects"
        sub="Two flagship builds up top, verified project write-ups below that, and the full repository list pulled live from GitHub after that."
      />

      {loading ? (
        <Loader label="Loading projects" />
      ) : (
        <>
          {featured.length > 0 && (
            <div className="space-y-6">
              {featured.map((p, i) => (
                <FeaturedProjectCard key={p.slug} project={p} rank={i + 1} />
              ))}
            </div>
          )}

          {detailed.length > 0 && (
            <div className="mt-16">
              <p className="eyebrow">04 / More builds</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Verified project write-ups</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {detailed.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-16">
            <p className="eyebrow">05 / All repositories</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Everything else, straight from source</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Pulled live via the GitHub API — set GITHUB_USERNAME in the backend .env to point this at your account.
            </p>

            <div className="mt-8">
              {error ? (
                <p className="readout">Could not reach GitHub — check GITHUB_USERNAME in backend/.env.</p>
              ) : rest.length === 0 ? (
                <p className="readout">No additional public repositories found.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((r) => (
                    <RepoCard key={r.name} repo={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
