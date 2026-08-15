import SectionHeading from "../components/SectionHeading";
import { skills } from "../data/profile";

export default function Skills() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        index="05"
        label="Toolchain"
        title="Skills"
        sub="Grouped the way I actually reach for them — languages, frameworks, data, tools, and CS fundamentals."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="panel p-6">
            <p className="eyebrow">{group}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {items.map((s) => (
                <span
                  key={s}
                  className="rounded border border-line bg-surface2 px-3 py-1.5 text-sm text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
