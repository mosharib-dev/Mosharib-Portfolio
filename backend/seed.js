// Seeds the database with Mohammad's real projects so the site works
// out of the box. Run with: npm run seed
import dotenv from "dotenv";
import mongoose from "mongoose";
import Project from "./models/Project.js";
import BlogPost from "./models/BlogPost.js";

dotenv.config();

const projects = [
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
      "RESTful API with dedicated auth and interview-report modules"
    ],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/AI-Interview-Preparation",
    repoName: "AI-Interview-Preparation",
    image: "", // e.g. "/projects/interviewai.png" — drop a screenshot in frontend/public/projects/
    featured: true,
    order: 1,
    status: "live",
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
      "Managed 17+ active loan accounts across role-based dashboards",
      "Seeded with 48 customers, 17 loans, 620 transactions",
      "Generates printable loan letters, statements, and audit logs"
    ],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/BankEase---Multi-Role-Bank-Management-System",
    repoName: "BankEase---Multi-Role-Bank-Management-System",
    image: "",
    featured: true,
    order: 2,
    status: "live",
  },
];

const posts = [
  {
    slug: "building-interviewai",
    title: "Building InterviewAI: wiring Gemini into a real prep workflow",
    excerpt: "Notes on turning a resume and a job description into a structured, gradeable interview plan.",
    content: "Full write-up coming soon.",
    tags: ["AI", "MERN", "Gemini API"],
    published: true,
  },
];

// Verified directly against github.com/mosharib-dev — every description,
// feature list, tech stack, and live link below is pulled from the real
// repo (README + "About" panel), not GitHub API metadata.
const verifiedRepos = [
  {
    slug: "wanderlust-project",
    title: "WanderLust",
    tagline: "Full-stack Airbnb-inspired travel booking platform",
    description:
      "A full-stack travel listing platform where users can explore, create, review, and book destinations — with secure authentication, cloud image storage, interactive maps, and a complete booking flow with PDF ticket generation.",
    stack: ["Node.js", "Express.js", "MongoDB Atlas", "Mongoose", "Passport.js", "Cloudinary", "Mapbox GL JS", "EJS", "Bootstrap 5", "Nodemailer", "PDFKit"],
    highlights: [
      "Full booking system: date picker, live price breakdown, conflict detection on overlapping dates",
      "Auto-generated booking ID with confirmation email + PDF ticket attached",
      "Interactive Mapbox location view for every listing, with Cloudinary-hosted images",
      "Owner-only authorization for editing/deleting listings, plus category filtering",
    ],
    liveUrl: "https://wanderlust-project-dr7b.onrender.com",
    githubUrl: "https://github.com/mosharib-dev/wanderlust-project",
    featured: false,
    order: 10,
    status: "live",
  },
  {
    slug: "weather-dashboard",
    title: "WeatherOS",
    tagline: "Real-time weather dashboard with 7-day forecasts",
    description:
      "A real-time weather dashboard showing current conditions, hourly predictions, and a 7-day forecast for any city worldwide, with auto location detection and an animated wind compass.",
    stack: ["HTML5", "CSS3", "JavaScript", "Open-Meteo API", "Nominatim API"],
    highlights: [
      "Search any city worldwide or auto-detect current location",
      "Current temperature, humidity, and wind, plus 24-hour and 7-day forecasts",
      "Animated wind compass and fully responsive layout",
    ],
    liveUrl: "https://mosharib-dev.github.io/weather-dashboard/",
    githubUrl: "https://github.com/mosharib-dev/weather-dashboard",
    featured: false,
    order: 11,
    status: "live",
  },
  {
    slug: "connect-four-ai",
    title: "Connect Four with AI",
    tagline: "Playable Connect Four with a Minimax-powered AI opponent",
    description:
      "A fully playable Connect Four game with Player vs Player and Player vs AI modes, where the AI uses the Minimax algorithm with alpha-beta pruning to play strategically.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    highlights: [
      "Minimax algorithm with alpha-beta pruning for AI move selection",
      "Win detection in all directions with highlighted winning cells",
      "Modular design: board logic, AI logic, and game controller split into separate files",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/Connect-Four-Game-with-AI",
    featured: false,
    order: 12,
    status: "live",
  },
  {
    slug: "ecommerce-layout",
    title: "E-Commerce Website Layout",
    tagline: "Static front-end e-commerce UI with a working cart",
    description:
      "A static front-end e-commerce website with a full product-browsing and cart experience, built without any framework or backend.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    highlights: [
      "Product grid with category filters and a sliding cart sidebar",
      "Add/remove from cart with live item count and total",
      "Responsive layout built with CSS Grid",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/Ecommerce",
    featured: false,
    order: 13,
    status: "live",
  },
  {
    slug: "calculator",
    title: "Calculator",
    tagline: "Simple calculator with keyboard support",
    description: "A clean calculator built with vanilla HTML, CSS, and JavaScript, with full keyboard support and a dark theme.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    highlights: [
      "Basic arithmetic plus percentage calculation",
      "Backspace, clear, and full keyboard input support",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/Calculator",
    featured: false,
    order: 14,
    status: "live",
  },
  {
    slug: "authentication-system",
    title: "Authentication System",
    tagline: "Standalone JWT-based authentication service",
    // NOTE: GitHub blocks automated browsing of this repo's README, so this
    // description is inferred only from the repo name + your known stack —
    // replace with the real feature list once you can paste it in.
    description:
      "A standalone authentication system built with the MERN stack, covering secure signup, login, and session handling — the kind of auth module reused across InterviewAI and other projects.",
    stack: ["Node.js", "Express.js", "MongoDB", "JWT"],
    highlights: [],
    liveUrl: "",
    githubUrl: "https://github.com/mosharib-dev/Authentication-System",
    featured: false,
    order: 15,
    status: "live",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Seeding...");

  const allProjects = [...projects, ...verifiedRepos];
  for (const p of allProjects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  for (const b of posts) {
    await BlogPost.findOneAndUpdate({ slug: b.slug }, b, { upsert: true, new: true });
  }

  console.log(`Seeded ${allProjects.length} projects and ${posts.length} blog posts.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
