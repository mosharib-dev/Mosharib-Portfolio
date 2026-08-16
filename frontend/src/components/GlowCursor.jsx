import { useEffect } from "react";

export default function GlowCursor() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !isFinePointer) return;

    let current = null;
    let raf = null;

    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const panel = e.target.closest(".panel");

        if (panel !== current && current) {
          current.style.setProperty("--mx", "-1000px");
          current.style.setProperty("--my", "-1000px");
        }
        current = panel;

        if (panel) {
          const rect = panel.getBoundingClientRect();
          panel.style.setProperty("--mx", `${e.clientX - rect.left}px`);
          panel.style.setProperty("--my", `${e.clientY - rect.top}px`);
        }
      });
    };

    document.addEventListener("pointermove", onMove);
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      if (current) {
        current.style.setProperty("--mx", "-1000px");
        current.style.setProperty("--my", "-1000px");
      }
    };
  }, []);

  return null;
}