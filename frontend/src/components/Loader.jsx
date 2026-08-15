export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 py-10 font-mono text-xs text-muted">
      <span className="h-2 w-2 animate-pulse rounded-full bg-signal" />
      {label}...
    </div>
  );
}
