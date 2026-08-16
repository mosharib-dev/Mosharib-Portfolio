import SectionHeading from "../components/SectionHeading";
import ContributionHeatmap from "../components/ContributionHeatmap";
import { profile, education, experience, achievements } from "../data/profile";

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading index="02" label="Profile" title="About" sub={profile.summary} />

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="eyebrow">Experience log</p>
          <div className="mt-4 space-y-8">
            {experience.map((e) => (
              <div key={e.role} className="panel p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{e.role}</h3>
                  <span className="readout">{e.period}</span>
                </div>
                <p className="mt-1 text-sm text-data">
                  {e.org} <span className="text-muted">· {e.orgNote}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {e.points.map((pt, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 panel p-6">
            <p className="eyebrow">GitHub activity</p>
            <div className="mt-4">
              <ContributionHeatmap />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="panel p-6">
            <p className="eyebrow">Education</p>
            <h3 className="mt-2 font-display text-base font-semibold text-ink">{education.school}</h3>
            <p className="mt-1 text-sm text-muted">{education.degree}</p>
            <div className="mt-4 flex justify-between font-mono text-xs text-muted">
              <span>{education.period}</span>
              <span className="text-signal">CGPA {education.cgpa}</span>
            </div>
          </div>

          <div className="panel p-6">
            <p className="eyebrow">Achievements</p>
            <ul className="mt-3 space-y-3">
              {achievements.map((a, i) => (
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