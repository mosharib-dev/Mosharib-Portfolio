import { NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/blog", label: "Blog" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <NavLink to="/" className="font-display text-lg font-semibold tracking-tight text-ink">
          MM<span className="text-signal">.</span>
          <span className="ml-2 hidden font-mono text-xs font-normal tracking-widest text-muted sm:inline">
            DEV.CONSOLE
          </span>
        </NavLink>

        <button
          onClick={onOpenPalette}
          className="hidden items-center gap-2 rounded border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-signal hover:text-ink md:flex"
          aria-label="Open command palette"
        >
          <span>Jump to…</span>
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px]">{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </button>

        <button
          className="font-mono text-xs text-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "[ CLOSE ]" : "[ MENU ]"}
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                    isActive ? "text-signal" : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {open && (
        <button
          onClick={() => {
            setOpen(false);
            onOpenPalette();
          }}
          className="flex w-full items-center justify-between border-t border-line px-6 py-3 font-mono text-xs uppercase tracking-wider text-muted md:hidden"
        >
          <span>Jump to…</span>
          <span>{isMac ? "⌘K" : "Ctrl K"}</span>
        </button>
      )}

      {open && (
        <ul className="flex flex-col border-t border-line bg-base md:hidden">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-3 font-mono text-xs uppercase tracking-wider ${
                    isActive ? "text-signal" : "text-muted"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}