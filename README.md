# Yuvaraj S Yali — Portfolio

Cinematic dark-editorial portfolio built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion, React Three Fiber and Lucide.

## Run it

**Windows, one click:** double-click **`Open Portfolio.bat`**. The first time it installs packages and builds the site (needs [Node.js LTS](https://nodejs.org)); after that it starts in a few seconds and opens http://localhost:3000 in your browser. It rebuilds automatically when you've changed anything in `app/`, `components/`, `lib/` or `public/`. Keep the black window open while viewing; close it to stop the site.

Or from a terminal:

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Static hosting instead of a Node server: `STATIC_EXPORT=1 npm run build` writes a fully static site to `out/`.

Set `NEXT_PUBLIC_SITE_URL` to the production domain (used for canonical URL, Open Graph, sitemap and robots). It falls back to `https://portfolio-indol-psi-55.vercel.app`.

## Where things live

| What | Where |
| --- | --- |
| **All content** (bio, experience, projects, research, skills, links) | `lib/portfolio-data.ts` |
| Nav items, section ids, media paths | `lib/constants.ts` |
| Design tokens (colours, fonts, keyframes) | `app/globals.css` (`@theme`) |
| Shared motion variants | `lib/animations.ts` |
| Hero video / poster / background | `public/videos/hero-reel.mp4`, `public/videos/hero-poster.webp`, `public/images/hero-bg.webp` |
| Résumé download | `public/resume/Yuvaraj_S_Yali_Resume.pdf` |
| Open Graph image | `app/opengraph-image.png` |

## Replacing placeholders

- **Hero reel** – the current `hero-reel.mp4` is an original 16-second rendered film (a luminous waterfall that becomes a neural network, then flowing EEG signals). The two full-width film strips between sections reuse it from different start times. To use your own footage (e.g. a free waterfall clip from pexels.com or pixabay.com), run:
  `bash scripts/add-hero-video.sh ~/Downloads/your-clip.mp4`
  It trims to 15 s, removes audio, compresses to H.264 and regenerates the poster and blurred background. Needs `ffmpeg`.
- **Project screenshots** – every project shows an abstract, clearly labelled illustrative visual. Put a real screenshot in `public/images/projects/` and set `image: "/images/projects/<file>.webp"` on that project in `portfolio-data.ts`; it replaces the visual everywhere (case study + hover preview).
- **Organisation logos** – experience items render monogram tiles. Add a verified logo and set `logo` on the item to use it.

## Component notes (21st.dev)

21st.dev component source is behind a sign-in, so each component was rebuilt from its published behaviour and credited in a header comment:

| File | Based on |
| --- | --- |
| `components/ui/scroll-expansion-hero.tsx` | Scroll Expansion Hero — @arunachalam |
| `components/ui/tubelight-navbar.tsx` | Tubelight Navbar — Ayushmaan Singh |
| `components/ui/text-reveal.tsx` | Text Reveal — Dillion Verma |
| `components/ui/bento-grid.tsx` | Bento Grid — Manu Arora (Aceternity) |
| `components/ui/spotlight-card.tsx` | Spotlight Card — Hossain Jahed |
| `components/ui/portfolio-projects-showcase.tsx` | Portfolio Projects Showcase — @wrapcoders |
| `components/ui/interactive-icon-cloud.tsx` | Interactive Icon Cloud — Dillion Verma |
| `components/ui/animated-counter.tsx` | Animated Counter — Preet Suthar |
| `components/ui/motion-footer.tsx` | Motion Footer — Hossain Jahed |
| `components/ui/aurora-background.tsx` | Aurora Background — Aceternity |

**Hero scroll behaviour.** The original listens to `wheel`/`touchmove` on `window` and calls `preventDefault()` until the media is expanded, which can trap visitors and breaks keyboard and scrollbar scrolling. This version drives the same animation from native scroll over a section-scoped sticky container (`280vh` tall), so touch, trackpad momentum, keyboard and backward scrolling all work and nothing is intercepted after the intro. Sizes come from a single CSS variable (`--e`, expansion 0→1), so there is no measurement or hydration mismatch. Reduced-motion users get a static full-bleed version; data-saver connections get the poster instead of the video.

**Icon cloud.** It uses the locally bundled `simple-icons` package (no runtime CDN fetch). XGBoost, SHAP and Grad-CAM have no official logo and LinkedIn is not distributed in simple-icons, so they appear in the text list only.

**GSAP.** Not installed. Every scroll-linked effect here is covered by Motion's `useScroll`, so adding GSAP + ScrollTrigger would only add a second animation runtime.

**3D.** Three.js/R3F is used once, for the A-VITAL PRO neural core. It is code-split with `next/dynamic` and only mounts near the viewport on fine-pointer devices without reduced motion; everywhere else an SVG version renders.

## Accessibility & performance

Semantic landmarks, skip link, visible focus rings, keyboard-operable nav and mobile dialog (focus trap, Escape), `aria-current` on the active section, reduced-motion support throughout, self-hosted fonts (no build-time network), lazy 3D and icon cloud, video paused off-screen, SEO metadata, JSON-LD `Person`, sitemap and robots.
