# Aryan Sharma — Cinematic Portfolio

A premium, cinematic portfolio for **Aryan Sharma** — creative frontend developer and cybersecurity-focused builder (BCA, Trinity Institute of Professional Studies / GGSIPU, Delhi).

Built with Vite + React + TypeScript + Tailwind CSS.

## Stack & Systems

- GSAP + ScrollTrigger animation choreography
- Lenis smooth momentum scrolling synced with ScrollTrigger
- Framer Motion spring physics and staggered reveals
- Custom desktop trailing cursor (auto-disabled on touch / coarse pointers)
- Interactive repository workbench + archive powered by the live GitHub API dataset
- Recruiter View — 30-second executive summary modal
- Full keyboard accessibility, ESC-closable modals, focus management
- prefers-reduced-motion support throughout
- 8 verified certificates (EY × Anudip, EY × Microsoft, IBM, HP LIFE, WsCube Tech, Network Bulls, TIPS)

## Run locally

npm install
npm run dev

Then open the URL shown by Vite, usually http://localhost:5173.

## Production build

npm run build
npm run preview

Deployment is handled automatically by .github/workflows/deploy.yml (GitHub Actions → GitHub Pages, base path /aryan-portfolio-cinematic/).

## Data files

- src/data/projects.ts — flagship project showcase (6 projects)
- src/data/githubRepos.ts — 15-repository catalog derived from repos.json (live GitHub API snapshot)
- src/data/certifications.ts — verified certificate archive
- src/data/skills.ts — capability groups linked to real projects/certificates

## Portfolio implementation notes

- The repository snapshot includes all 15 public repositories currently represented in `src/data/githubRepos.ts`.
- Repository/project previews use the existing local assets in `src/assets/photos/`.
- The entry portal is an original Canvas implementation; no React Bits Pro registry package or license key is required.
- Lenis remains the site-wide smooth-scroll layer.
- The certificate viewer uses CSS 3D transforms with pointer drag/swipe and reduced-motion fallback.
