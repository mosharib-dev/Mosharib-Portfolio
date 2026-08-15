# Mohammad Mosharib — Portfolio (Full-Stack)

A multi-page developer portfolio built with **React (Vite) + Express + MongoDB**.
Design direction: an "engineering console" aesthetic — graphite-navy background,
amber/teal signal accents, HUD corner-bracket panels, and a live diagnostic-style
status bar — built to echo the dashboards you've actually shipped (BankEase,
InterviewAI) instead of a generic template.

## Structure

```
portfolio/
  backend/     Express API + MongoDB models (projects, blog, contact, GitHub feed)
  frontend/    React + Vite + Tailwind, 8 routed pages
```

## Pages

Home · About · Projects (+ project detail) · Skills · Blog (+ post detail) ·
Resume · Contact.

**Projects page is three tiers:**
1. **Flagship builds** — InterviewAI (real repo: `AI-Interview-Preparation`) and BankEase (real repo: `BankEase---Multi-Role-Bank-Management-System`), large "★ Featured" cards with full write-ups
2. **Verified project write-ups** — 6 more of your real repos (WanderLust, WeatherOS, Connect Four AI, E-Commerce Layout, Calculator, Authentication System), hardcoded with real descriptions/features/stacks pulled from each repo directly — except **Authentication System**, where GitHub blocked automated access to the README, so that one's description is inferred from the repo name only. Replace it with the real feature list in `backend/seed.js` when you can.
3. **Everything else** — any remaining public repos, pulled live via the GitHub API

GitHub blocks automated browsing of a user's full repository list page, so repos outside the 8 above can only be enumerated through the live API at runtime — they can't be hardcoded ahead of time. Send more repo URLs any time and I'll add them to tier 2 with the same real-data treatment.

**Preview images**, for both the featured cards and every repo card, resolve in this order:
1. An explicit `image` you set on a curated project (best quality — see below)
2. If the project/repo has a live deploy link, an auto screenshot of that site (via microlink.io, no key required)
3. Otherwise, GitHub's own auto-generated social preview card for the repo

**Live deploy links** for the two featured cards come from `liveUrl` in
`backend/seed.js` if you set it, or automatically from the repo's GitHub
"Website" field (`homepage`) if you set one on GitHub itself
(repo → Settings → add a URL under "Website"). Every other repo card shows
a "Live ↗" link the same way, whenever GitHub reports a homepage URL.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — get a free cluster at mongodb.com/atlas
- `GITHUB_USERNAME` — your GitHub username, powers the live repo feed
- `GITHUB_TOKEN` — optional, raises the GitHub API rate limit
- `SMTP_*` — optional, lets the contact form email you (e.g. a Gmail app password)

```bash
npm run seed   # loads InterviewAI + BankEase into MongoDB
npm run dev    # starts the API on http://localhost:5000
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173, proxies /api to the backend
```

Add your real resume as `frontend/public/resume.pdf` so the Resume page's
download button works, and update `GITHUB_USERNAME` and social links in
`frontend/src/data/profile.js`.

## 3. Deploying (matches tools already on your resume)

- **Backend → Render**: new Web Service, root `backend/`, build `npm install`,
  start `npm start`. Add the same environment variables from `.env`.
- **Frontend → Vercel**: root `frontend/`, framework preset "Vite". Set an
  environment-based API URL if your backend isn't proxied (see note below).
- **Database → MongoDB Atlas** free tier, whitelist `0.0.0.0/0` for Render.

Note: in production the frontend and backend usually live on different
domains, so `frontend/src/api/client.js`'s `baseURL: "/api"` proxy trick
(which only works in local dev) should be swapped for your deployed API URL,
e.g. `baseURL: "https://your-api.onrender.com/api"`.

## 4. Before you launch

- [ ] Update `GITHUB_USERNAME` in both `backend/.env` and `frontend/src/data/profile.js`
- [ ] Add real `liveUrl` / `githubUrl` values to the two projects in `backend/seed.js`, then re-run `npm run seed`
- [ ] (Optional, best quality) Add real screenshots: drop images in `frontend/public/projects/`, then set e.g. `image: "/projects/interviewai.png"` in `backend/seed.js` and re-seed — otherwise an auto screenshot/GitHub preview is used
- [ ] On GitHub, set the "Website" field (repo → Settings → add a URL) for any deployed repo so its live link and screenshot show up automatically
- [ ] Drop your resume PDF into `frontend/public/resume.pdf`
- [ ] Fill in your real LinkedIn URL in `frontend/src/data/profile.js`
- [ ] Lock down `POST /api/projects` and `POST /api/blog` behind auth before deploying (they're open for local seeding right now)
- [ ] Set `CLIENT_ORIGIN` in backend `.env` to your deployed frontend URL for CORS

## Notes on the design

- Signature motif: HUD corner-bracket "panels" (`.panel` in `index.css`) used
  for every card/module — a nod to the role-based dashboards in BankEase.
- Typography: Space Grotesk (display) + Inter (body) + JetBrains Mono (data/labels).
- Palette: graphite-navy base (`#0C1116`), amber signal (`#FFB454`), teal data accent (`#4FD8C4`).
- Fully responsive, visible keyboard focus states, and `prefers-reduced-motion` respected.
