import SectionHeading from "../components/SectionHeading";
import { profile } from "../data/profile";

export default function Resume() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <SectionHeading index="07" label="CV" title="Resume" sub="Download the full PDF, or reach out directly." />
      <div className="panel mx-auto mt-4 flex max-w-md flex-col items-center gap-6 p-10">
        <p className="readout">MOHAMMAD_MOSHARIB_RESUME.PDF</p>
        <a
          href="/resume.pdf"
          download
          className="rounded bg-signal px-6 py-3 font-mono text-sm font-semibold text-base transition-opacity hover:opacity-90"
        >
          Download PDF
        </a>
      </div>
      <p className="mt-10 text-sm text-muted">
        Prefer email? <a href={`mailto:${profile.email}`} className="text-signal hover:underline">{profile.email}</a>
      </p>
    </div>
  );
}
