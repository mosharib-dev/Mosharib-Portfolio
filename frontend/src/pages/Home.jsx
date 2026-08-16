import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { profile, skills } from "../data/profile";
import StatusBar from "../components/StatusBar";
import client from "../api/client";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import ActivityFeed from "../components/ActivityFeed";
import Loader from "../components/Loader";

const fallbackFeatured = [
  {
    slug: "interviewai",
    title: "InterviewAI",
    tagline: "AI-powered interview preparation platform",
    description:
      "A full-stack MERN platform that generates a tailored interview prep plan — technical and behavioral questions with model answers, a resume-to-job match score, and skill-gap analysis — from an uploaded job description and resume.",
    stack: ["React 19", "React Router 7", "Vite", "Node.js", "Express 5", "MongoDB", "Mongoose", "JWT", "Multer", "Puppeteer", "Google Gemini API"],
    highlights: [
      "Integrated Google Gemini API for AI-driven report generation",
      "Puppeteer-based automated PDF generation for tailored resumes and reports",
      "Secure JWT authentication with protected routes",
    ],
    caseStudy: {
      problem:
        "Generic interview prep treats every candidate the same. Someone prepping for a frontend role at a startup needs different questions than someone prepping for a backend role at an enterprise — most tools ignore that entirely.",
      approach:
        "Built a pipeline that takes a resume and a specific job description as input, sends both to the Gemini API with a structured prompt, and parses the response into a typed report: match score, skill gaps, and question sets split into technical and behavioral. Puppeteer then renders that report into a downloadable PDF server-side.",
      tradeoffs:
        "Chose Puppeteer over a lighter library like PDFKit because the report needed real CSS layout — that cost more memory per request, so PDF generation runs as a queued job rather than synchronously on upload.",
      result:
        "A working end-to-end flow from upload to downloadable, tailored report, with JWT-protected routes so reports are private to the account that generated them.",
    },
    githubUrl: "https://github.com/mosharib-dev/AI-Interview-Preparation",
    status: "live",
    order: 1,
  },
  {
    slug: "bankease",
    title: "BankEase",
    tagline: "Multi-role bank management system",
    description:
      "A full-stack banking system with 4 role-based dashboards (Manager, Account Creator, Cashier, Updater), KYC workflow, transaction limits, and a multi-level freeze-request approval chain.",
    stack: ["Node.js", "Express.js", "MongoDB", "EJS", "REST API", "node-cron"],
    highlights: [
      "Auto EMI deduction via node-cron with startup recovery for missed EMIs",
      "4 role-based dashboards with a multi-level freeze-request approval chain",
      "Generates printable loan letters, statements, and audit logs",
    ],
    caseStudy: {
      problem:
        "A single admin role for a banking system is a liability — a cashier processing withdrawals shouldn't have the same permissions as a manager approving a loan freeze.",
      approach:
        "Modeled four distinct roles (Manager, Account Creator, Cashier, Updater), each with a scoped dashboard and permission set. Freeze requests route through a multi-level approval chain rather than a single approve/deny toggle. EMI deductions run on node-cron, with a startup-recovery check so a server restart doesn't silently skip a due payment.",
      tradeoffs:
        "Used EJS server-rendered views instead of a separate SPA frontend to keep the auth/session model simple for a role-based system where every page needs a permission check.",
      result:
        "Four working role-based dashboards with a functioning approval chain and self-healing scheduled job, seeded and testable with realistic demo data.",
    },
    githubUrl: "https://github.com/mosharib-dev/BankEase---Multi-Role-Bank-Management-System",
    status: "live",
    order: 2,
  },
];

const techStrip = [...new Set(Object.values(skills).flat())];

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    client
      .get("/projects")
      .then((res) => {
        setFeatured(res.data.filter((p) => p.featured).slice(0, 2));
        setProjectCount(res.data.length);
      })
      .catch(() => {
        setFeatured(fallbackFeatured);
        setProjectCount(null);
      });
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-grid bg-grid">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="eyebrow animate-fade-in-up flex items-center gap-2">
            init --profile=mohammad-mosharib
            <span className="inline-block h-3 w-[7px] animate-pulse bg-signal" />
          </p>
          <h1 className="mt-4 max-w-3xl animate-fade-in-up font-display text-4xl font-semibold leading-tight tracking-tight text-ink [animation-delay:120ms] sm:text-6xl">
            Full-stack developer,
            <br />
            <span className="text-signal">building systems that work</span> — not just demos.
          </h1>
          <p className="mt-6 max-w-xl animate-fade-in-up text-lg text-muted [animation-delay:240ms]">
            {profile.summary}
          </p>
          <div className="mt-10 flex animate-fade-in-up flex-wrap gap-4 font-mono text-sm [animation-delay:360ms]">
            <Link
              to="/projects"
              className="rounded bg-signal px-5 py-3 font-semibold text-base transition-transform hover:-translate-y-0.5 hover:opacity-90"
            >
              View projects
            </Link>
            <Link
              to="/contact"
              className="rounded border border-line px-5 py-3 text-ink transition-colors hover:border-signal"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <StatusBar
          stats={[
            { label: "CGPA", value: "8.99", unit: "/10" },
            { label: "DSA SOLVED", value: "100+" },
            { label: "PROJECTS SHIPPED", value: projectCount ? `${projectCount}` : "8" },
            { label: "FULL-STACK APPS LIVE", value: "3" },
          ]}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <ActivityFeed />
      </section>

      <section className="border-y border-line bg-surface/60 py-4">
        <div className="group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">
            {[...techStrip, ...techStrip].map((t, i) => (
              <span key={i} className="whitespace-nowrap font-mono text-xs uppercase tracking-wider text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Featured builds</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Selected work</h2>
          </div>
          <Link to="/projects" className="font-mono text-xs uppercase tracking-wider text-signal hover:underline">
            All projects →
          </Link>
        </div>

        {!featured ? (
          <Loader label="Fetching projects" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((p, i) => (
              <FeaturedProjectCard key={p.slug} project={p} rank={i + 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}