/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0C1116",
        surface: "#121924",
        surface2: "#1A2330",
        line: "#26313F",
        ink: "#E7ECF2",
        muted: "#8A96A6",
        signal: "#FFB454",
        data: "#4FD8C4",
        danger: "#FF6B6B",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(#1A2330 1px, transparent 1px), linear-gradient(90deg, #1A2330 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pageFade: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "page-fade": "pageFade 0.35s ease-out both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};