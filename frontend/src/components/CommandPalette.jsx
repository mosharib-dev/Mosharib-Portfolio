import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const staticPages = [
  { label: "Home", to: "/", hint: "page" },
  { label: "About", to: "/about", hint: "page" },
  { label: "Projects", to: "/projects", hint: "page" },
  { label: "Skills", to: "/skills", hint: "page" },
  { label: "Blog", to: "/blog", hint: "page" },
  { label: "Resume", to: "/resume", hint: "page" },
  { label: "Contact", to: "/contact", hint: "page" },
];

// Cheap fuzzy-ish scorer: rewards substring matches, and in-order
// (but non-contiguous) character matches, so "bnk" still finds "BankEase".
function score(query, target) {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 1;
  if (t.includes(q)) return 100 - t.indexOf(q);
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length ? 10 : 0;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && projects.length === 0) {
      client
        .get("/projects")
        .then((res) =>
          setProjects(res.data.map((p) => ({ label: p.title, to: `/projects/${p.slug}`, hint: "project" })))
        )
        .catch(() => {});
    }
  }, [open, projects.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const results = useMemo(() => {
    const all = [...staticPages, ...projects];
    return all
      .map((item) => ({ item, s: score(query, item.label) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.item)
      .slice(0, 8);
  }, [query, projects]);

  const go = (to) => {
    navigate(to);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].to);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-base/80 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="panel w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="font-mono text-signal">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="jump to a page or project…"
            className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="readout hidden rounded border border-line px-1.5 py-0.5 sm:inline">esc</kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center font-mono text-sm text-muted">no matches</li>
          ) : (
            results.map((item, i) => (
              <li key={item.to}>
                <button
                  onClick={() => go(item.to)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                    i === activeIndex ? "bg-surface2 text-ink" : "text-muted"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-wider text-signal">{item.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}