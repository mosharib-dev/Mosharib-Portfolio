import SectionHeading from "../components/SectionHeading";

const stack = [
  {
    layer: "Frontend",
    detail: "React 19 + Vite, deployed on Vercel. React Router handles client-side routing; Tailwind for styling.",
  },
  {
    layer: "Backend",
    detail: "Express 5 on Node.js, deployed on Render. All routes live under /api — health checks, projects, blog, contact, GitHub/LeetCode integrations, and auth.",
  },
  {
    layer: "Database",
    detail: "MongoDB Atlas. Projects and blog posts are seeded via a script; contact messages are written directly from the public form.",
  },
  {
    layer: "Auth",
    detail: "A single-admin JWT flow — no user accounts. Login checks an email + bcrypt-hashed password against env vars, issues a signed token, and every write route (viewing/deleting contact messages) requires it.",
  },
  {
    layer: "Live data",
    detail: "The homepage's activity feed, the contribution heatmap, and the LeetCode panel all call real external APIs server-side (GitHub REST + GraphQL, LeetCode's public GraphQL) with short-lived in-memory caching, so the site never hammers rate limits.",
  },
];

const decisions = [
  {
    q: "Why a separate backend instead of just calling GitHub's API from the browser?",
    a: "Two reasons: the GitHub GraphQL API (used for the contribution heatmap) requires a token, and tokens can't safely live in frontend code — anyone could read it from the network tab. Routing through the backend keeps it server-side only. It also lets every visitor share one cached response instead of each browser hitting GitHub's rate limit independently.",
  },
  {
    q: "Why JWT instead of just a shared password everyone knows?",
    a: "An earlier version of the admin panel used a single shared API key in a header. It worked, but a leaked key has no expiry and no way to tell it apart from a legitimate request. A JWT session at least expires (7 days here) and is scoped to an actual login event.",
  },
  {
    q: "Why does the homepage show a fallback project list if the API fails?",
    a: "A portfolio should never show an empty homepage to a recruiter because a free-tier server was cold. The featured projects have hardcoded fallback data that only renders if the live fetch fails — the honest tradeoff is that fallback can drift out of sync with the database if the real project data changes without updating the fallback too.",
  },
];

export default function Architecture() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeading
        index="09"
        label="Meta"
        title="How this site is built"
        sub="This portfolio isn't just a list of projects — it's a small full-stack app in its own right. Here's what's actually running under it."
      />

      <div className="panel overflow-hidden">
        <div className="border-b border-line bg-surface2 px-4 py-2.5">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">stack.yaml</span>
        </div>
        <div className="divide-y divide-line">
          {stack.map((s) => (
            <div key={s.layer} className="grid gap-1 p-5 sm:grid-cols-[140px_1fr] sm:gap-4">
              <p className="font-mono text-sm font-semibold text-signal">{s.layer}</p>
              <p className="text-sm text-muted">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <p className="eyebrow">Decisions worth explaining</p>
        <div className="mt-4 space-y-6">
          {decisions.map((d, i) => (
            <div key={i} className="panel p-6">
              <p className="font-display text-base font-semibold text-ink">{d.q}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted">
        Curious about a specific part?{" "}
        <a href="/contact" className="text-signal hover:underline">
          Ask me directly
        </a>
        , or browse the source on{" "}
        <a
          href="https://github.com/mosharib-dev"
          target="_blank"
          rel="noreferrer"
          className="text-signal hover:underline"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  );
}