# Mohammad Mosharib — Portfolio

A full-stack developer portfolio built with **React (Vite) + Express + MongoDB**.

The design direction is an "engineering console" aesthetic — graphite-navy
background, amber/teal signal accents, HUD corner-bracket panels, and a live
diagnostic-style status bar — built to echo the role-based dashboards this
portfolio is actually showcasing (BankEase, InterviewAI) rather than a
generic template.

---

## Tech stack

| Layer      | Stack                                                             |
| ---------- | ------------------------------------------------------------------ |
| Frontend   | React 19, Vite, React Router 7, Tailwind CSS, Axios                |
| Backend    | Node.js, Express 5, Mongoose                                       |
| Database   | MongoDB (Atlas in production)                                      |
| Integrations | GitHub API (live repo feed), Nodemailer (contact form), Microlink (auto screenshots) |

## Project structure

```
portfolio/
  backend/     Express API + MongoDB models (projects, blog, contact, GitHub feed)
  frontend/    React + Vite + Tailwind, 8 routed pages
```

## Pages

Home · About · Projects (+ project detail) · Skills · Blog (+ post detail) · Resume · Contact

**Home** leads with a boot-sequence hero, a live status bar (CGPA, DSA problems
solved, and a project count pulled straight from the API so it never goes
stale), a scrolling tech-stack strip generated from the real skills data, and
the two featured builds.

**Projects** is three tiers:

1. **Flagship builds** — InterviewAI (`AI-Interview-Preparation`) and BankEase
   (`BankEase---Multi-Role-Bank-Management-System`), large "★ Featured" cards
   with full write-ups.
2. **Verified project write-ups** — additional real repos (WanderLust,
   WeatherOS, Connect Four AI, E-Commerce Layout, Calculator, Authentication
   System), each hardcoded with a real description, feature list, and stack
   pulled from the repo itself.
3. **Everything else** — any remaining public repos, fetched live via the
   GitHub API at runtime (GitHub doesn't allow the full repo list to be
   scraped ahead of time, so this tier is always fresh rather than hardcoded).

**Preview images**, for featured cards and every repo card, resolve in this order:

1. An explicit `image` set on a curated project (highest quality — see below)
2. An auto screenshot of the live deploy URL, if one exists (via Microlink, no API key required)
3. GitHub's own auto-generated social preview card for the repo

**Live deploy links** on featured cards come from `liveUrl` in
`backend/seed.js` if set, or automatically from the repo's GitHub "Website"
field (`homepage`) if configured under repo → Settings. Every other repo
card follows the same rule.

## Design system

- **Signature motif**: HUD corner-bracket "panels" (`.panel` in `index.css`),
  used for every card and module — a nod to the role-based dashboards in
  BankEase.
- **Typography**: Space Grotesk (display) · Inter (body) · JetBrains Mono (data/labels).
- **Palette**: graphite-navy base (`#0C1116`), amber signal (`#FFB454`), teal data accent (`#4FD8C4`).
- Fully responsive, visible keyboard focus states, `prefers-reduced-motion` respected throughout (including the hero fade-ins and tech-stack marquee).

---

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable          | Required | Notes                                                        |
| ------------------ | :------: | -------------------------------------------------------------- |
| `MONGODB_URI`       |    ✅    | Free cluster at mongodb.com/atlas                              |
| `GITHUB_USERNAME`   |    ✅    | Powers the live repo feed                                      |
| `PORT`              |    —    | Defaults to `5000`                                              |
| `CLIENT_ORIGIN`     |    —    | Frontend origin, for CORS (defaults to `http://localhost:5173`) |
| `GITHUB_TOKEN`      |    —    | Optional — raises the GitHub API rate limit from 60/hr to 5000/hr |
| `SMTP_*`            |    —    | Optional — lets the contact form actually email you             |

```bash
npm run seed   # loads projects from seed.js into MongoDB
npm run dev    # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173, proxies /api to the backend
```

Also:

- Add your resume as `frontend/public/resume.pdf` so the Resume page's download button works.
- Update `GITHUB_USERNAME` and social links in `frontend/src/data/profile.js`.

---

## Adding content

The site is built so new content never requires touching component code:

**New project** — add an entry to the array in `backend/seed.js`, then run
`npm run seed`. Set `featured: true` to surface it on Home and at the top of
`/projects`; otherwise it lands in the "More builds" grid. The homepage
project count updates automatically.

**New skill** — add it to the relevant category (or a new category) in
`frontend/src/data/profile.js`'s `skills` object. It appears on `/skills`
immediately, and in Home's tech-stack strip, without further changes.

Both pages use responsive Tailwind grids, so they reflow cleanly regardless
of how many items you add.

---

## Deployment

This stack deploys as three independent pieces:

| Piece    | Suggested host                        |
| -------- | -------------------------------------- |
| Database | MongoDB Atlas (free tier)              |
| Backend  | Render / Railway / Fly.io              |
| Frontend | Vercel / Netlify                       |

**Steps:**

1. **Database** — create a free Atlas cluster, add a database user, and
   whitelist `0.0.0.0/0` for now. Copy the connection string as your
   production `MONGODB_URI`.
2. **Backend** — push to GitHub, then deploy `backend/` as a Web Service
   (build: `npm install`, start: `npm start`). Set `MONGODB_URI`,
   `CLIENT_ORIGIN`, `GITHUB_USERNAME`, and optional vars from `.env.example`.
3. **Seed production** — run `npm run seed` once against the production
   database (via the host's shell, or locally with `MONGODB_URI` pointed at Atlas).
4. **Frontend** — deploy `frontend/` (root: `frontend/`, build:
   `npm run build`, output: `dist`). Set `VITE_API_URL` to your deployed
   backend URL + `/api`, e.g. `https://your-backend.onrender.com/api`
   (see `frontend/.env.example` — in local dev this is left unset and Vite's
   proxy handles it instead).
5. **Close the loop** — once the frontend has a live URL, set the backend's
   `CLIENT_ORIGIN` to that exact URL and redeploy the backend so CORS allows
   requests from the live site.
6. **Verify** — open the live frontend, check the Network tab, and confirm
   `/api/projects` returns 200 with real data rather than a CORS error.

---

## Pre-launch checklist

- [ ] Set `GITHUB_USERNAME` in both `backend/.env` and `frontend/src/data/profile.js`
- [ ] Add real `liveUrl` / `githubUrl` values in `backend/seed.js`, then re-run `npm run seed`
- [ ] *(Optional, best quality)* Add real screenshots to `frontend/public/projects/`, reference them via `image` in `backend/seed.js`, and re-seed
- [ ] On GitHub, set the "Website" field for any deployed repo so its live link and screenshot show up automatically
- [ ] Drop your resume PDF into `frontend/public/resume.pdf`
- [ ] Fill in your real LinkedIn URL in `frontend/src/data/profile.js`
- [ ] **Lock down `POST /api/projects` and `POST /api/blog` behind auth** before deploying — they're intentionally open right now for local seeding
- [ ] Set `CLIENT_ORIGIN` (backend) and `VITE_API_URL` (frontend) for production
- [ ] Fill in the real feature list for **Authentication System** in `backend/seed.js` — GitHub blocked automated README access for that repo, so its current description is inferred from the repo name only
