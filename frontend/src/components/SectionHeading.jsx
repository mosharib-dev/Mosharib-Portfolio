export default function SectionHeading({ index, label, title, sub }) {
  return (
    <div className="mb-10">
      <p className="eyebrow">
        {index ? `${index} / ` : ""}
        {label}
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 max-w-2xl text-muted">{sub}</p>}
    </div>
  );
}
