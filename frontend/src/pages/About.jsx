import SectionHeading from "../components/SectionHeading";
import ContributionHeatmap from "../components/ContributionHeatmap";
import {
  profile,
  education,
  experience,
  achievements,
  certifications,
  currentStatus,
  quickFacts,
} from "../data/profile";
import LeetCodeActivity from "../components/LeetCodeActivity";

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="02" label="Profile" title="About" sub={profile?.summary} />

      {quickFacts?.length > 0 && (
        <div className="panel mb-6 grid grid-cols-2 divide-x divide-line sm:grid-cols-4">
          {quickFacts.map((f, i) => (
            <div key={i} className="px-5 py-4">
              <p className="readout">{f.label}</p>
              <p className="mt-1 font-mono text-sm text-ink">{f.value}</p>
            </div>
          ))}
        </div>
      )}

      {currentStatus && (
        <div className="panel mb-10 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line bg-surface2 px-4 py-2.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-data" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted">right-now.status</span>
          </div>
          <div className="grid gap-4 px-5 py-4 font-mono text-sm sm:grid-cols-3">
            {currentStatus.building && (
              <div className="flex gap-2">
                <span className="shrink-0 text-signal">Building →</span>
                <span className="text-ink">{currentStatus.building}</span>
              </div>
            )}
            {currentStatus.learning && (
              <div className="flex gap-2">
                <span className="shrink-0 text-data">Learning →</span>
                <span className="text-ink">{currentStatus.learning}</span>
              </div>
            )}
            {currentStatus.availability && (
              <div className="flex gap-2">
                <span className="shrink-0 text-muted">Status →</span>
                <span className="text-ink">{currentStatus.availability}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="eyebrow">Experience log</p>

          <div className="relative mt-4 space-y-8 pl-6">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true" />
            {(experience || []).map((e, ei) => (
              <div key={e.role || ei} className="relative">
                <span className="absolute -left-6 top-2 h-3.5 w-3.5 rounded-full border-2 border-signal bg-base" />
                <div className="panel p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-ink">{e.role}</h3>
                    <span className="readout">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-data">
                    {e.org} <span className="text-muted">· {e.orgNote}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {(e.points || []).map((pt, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 panel p-6">
            <p className="eyebrow">GitHub activity</p>
            <div className="mt-4">
              <ContributionHeatmap />
            </div>
          </div>

          <div className="mt-6 panel p-6">
            <p className="eyebrow">LeetCode activity</p>
            <div className="mt-4">
              <LeetCodeActivity />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="panel p-6">
            <p className="eyebrow">Education</p>
            <h3 className="mt-2 font-display text-base font-semibold text-ink">{education?.school}</h3>
            <p className="mt-1 text-sm text-muted">{education?.degree}</p>
            <div className="mt-4 flex justify-between font-mono text-xs text-muted">
              <span>{education?.period}</span>
              <span className="text-signal">CGPA {education?.cgpa}</span>
            </div>
          </div>

          {certifications?.length > 0 && (
            <div className="panel p-6">
              <p className="eyebrow">Certifications</p>
              <ul className="mt-3 space-y-4">
                {certifications.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-signal">✓</span>
                    <div>
                      <p className="text-sm text-ink">{c.title}</p>
                      <p className="text-xs text-muted">{c.issuer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="panel p-6">
            <p className="eyebrow">Achievements</p>
            <ul className="mt-3 space-y-3">
              {(achievements || []).map((a, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted">
                  <span className="font-mono text-xs text-data">{String(i + 1).padStart(2, "0")}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
