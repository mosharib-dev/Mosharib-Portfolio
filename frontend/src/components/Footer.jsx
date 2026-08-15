import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="readout">
          © {new Date().getFullYear()} {profile.name} · built with React, Express & MongoDB
        </p>
        <div className="flex gap-5 font-mono text-xs uppercase tracking-wider">
          <a href={profile.github} className="hover:text-signal">GitHub</a>
          <a href={profile.linkedin} className="hover:text-signal">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-signal">Email</a>
        </div>
      </div>
    </footer>
  );
}
