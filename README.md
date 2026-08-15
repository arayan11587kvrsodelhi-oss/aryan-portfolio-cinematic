# Aryan Sharma — Cinematic Portfolio

A Vite + React + TypeScript portfolio focused on cinematic scrolling and interaction.

## Included
- GSAP + ScrollTrigger animations
- Lenis smooth scrolling synced with ScrollTrigger
- Scroll-driven portrait morph
- Cinematic project showcase with parallax and image reveals
- Animated typography
- Magnetic CTA
- Desktop custom cursor
- Responsive mobile animation strategy
- Reduced-motion support
- Local SVG visual assets so the project works without external image hosts

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Personalize before publishing
- Replace the local portrait SVG in `src/assets/portrait.svg` with your own photo if desired.
- Replace project SVGs in `src/assets/` with your real project images/videos.
- Update project URLs in `src/data/projects.ts`.
- Update social links in `src/components/Contact.tsx`.
- Replace `hello@aryansharma.dev` with your real email.

## Recent visual improvements
- Replaced placeholder portrait with a real local portrait asset.
- Added local project preview imagery from the supplied project screenshots/screen recordings.
- Reworked the Projects section with large visual previews, project category labels, project notes, technology tags, and dedicated “About the project” descriptions.
- Reworked the Profile/About section into a more editorial profile layout with portrait, role, location, focus, security interest, education, and resume CTA.
