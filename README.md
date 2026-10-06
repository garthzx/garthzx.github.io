# web-portfolio

Personal portfolio for Garth Dustin Ayang-ang, built in SvelteKit 5 and Tailwind CSS 4. The design
— army green on warm paper, Newsreader / IBM Plex Sans / JetBrains Mono, architecture diagrams as
the signature — comes from the Claude Design project "Screens design system files" (`Home.dc.html`,
`Case Study.dc.html`, `System Diagram.dc.html`).

## Running it

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run check` (svelte-check),
`npm run lint`, `npm run format`.

## Structure

```
src/
  app.html              fonts; pre-paint script for theme, motion and the intro
  routes/
    layout.css          design tokens (light + dark), shared primitives, motion
    +page.svelte        home: section order, <head> metadata
    work/[slug]/        case-study pages, one per system, prerendered
  lib/
    data/               all copy lives here — edit these, not the components
      site.ts           name, role, location, contact, nav, hero facts
      cases.ts          the three case studies (home summary + full write-up)
      diagrams.ts       diagram geometry: nodes, edges, lanes, notes
      experience.ts     roles, education and recognition
      projects.ts       featured project + early work
      toolkit.ts        skill groups, tools, orbit layout
      tool-icons.ts     Simple Icons paths for the toolkit field
      trips.ts          stops, photos, captions, slideshow layouts
    components/         one per section, plus SystemDiagram, Lightbox, Loader, Icon
    motion.svelte.ts    `inview` reveal action; intro state
    theme.svelte.ts     light/dark toggle, persisted per visitor
    assets/             portrait, trip photos, project screenshots
static/                 résumé PDF, favicon, OG card, .nojekyll
```

## How it behaves

- **Nothing is hidden without JS.** `app.html` sets `html[data-motion="on"]` before first paint,
  and only when the visitor hasn't asked for reduced motion; every hidden-until-revealed style is
  gated on that attribute. Add `?motion=off` to any URL to see the static version.
- **Intro curtain** plays once per browser session on the home page (`?intro=off` skips it).
  Reveals, the toolkit cycle and the trips slideshow wait for it to lift.
- **Diagrams** are SVG drawn from `diagrams.ts`. The draw-in is pure CSS keyed off a
  `data-drawn` attribute, so they prerender complete and animate when scrolled into view.
- **Toolkit field** is sized in container-query units (`--u` is one pixel of the 680px design
  square), so it scales correctly from the prerendered HTML with no resize observer.
- **Theme** defaults to light; the toggle is saved in `localStorage` and `?theme=dark` overrides
  it. The contact band, loader and lightbox are always dark.
- **Location** appears in the hero, loader and contact section, all from `site.city`.

## Deployment

Deployed to GitHub Pages at <https://garthzx.github.io> via `.github/workflows/deploy.yml`, which
builds on every push to `main` and publishes with `actions/deploy-pages`.

The build is fully static: `@sveltejs/adapter-static` with `prerender = true` in `+layout.ts`. Two
details matter for Pages — `static/.nojekyll`, because Jekyll otherwise strips the `_app` directory
and the site loads with no CSS or JS; and **Settings → Pages → Source must be "GitHub Actions"**,
not "Deploy from a branch", or GitHub's legacy Jekyll builder races this workflow and publishes a
rendered `README.md` instead of the site.

The repo is the user site `garthzx.github.io`, so there is no `paths.base` to configure. The share
card is regenerated with `python3 scripts/build-og-image.py`.
