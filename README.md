# web-portfolio

Personal portfolio for Garth Dustin P. Ayang-ang — a SvelteKit 5 + Tailwind CSS 4 rebuild of the
original Create React App site, keeping the same visual identity (periwinkle `#747fe0` on
ghostwhite, JetBrains Mono wordmark, Ubuntu-style terminal) with a reworked layout.

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
  routes/
    +layout.svelte      shell
    layout.css          Tailwind v4 @theme tokens, base + component layers
    +page.svelte        section order, <head> metadata
  lib/
    data/               all copy lives here — edit these, not the components
      site.ts           name, role, contact details, nav
      experience.ts     roles, education, achievements, skill groups
      projects.ts       project cards
      gallery.ts        "Away from the keyboard" photos, crops and captions
      terminal.ts       the terminal's commands and JSON output
    components/         Header, Work, Projects, ProjectArt, About, Terminal,
                        AwayFromKeyboard, Contact, Icon
    actions/reveal.ts   scroll-reveal action (replaces the old AOS dependency)
    assets/             photos and project screenshots
```

## Notes on the rebuild

- **No runtime dependencies.** Font Awesome (CDN) became inline SVG in `Icon.svelte`, and AOS
  became the `reveal` action. Fonts still come from Google Fonts via `app.html`.
- **Content is data-driven.** Every string a visitor reads lives under `src/lib/data/`, so
  updating the site after a job change or a new project is a one-file edit.
- **The terminal** types itself out when scrolled into view. All lines stay in the DOM (hidden
  with `opacity`) so the panel never changes height mid-animation and the content is available to
  screen readers and with JS disabled. There is a **skip** button in its title bar.
- **Motion is opt-out.** `prefers-reduced-motion` disables the typewriter, the reveals, and the
  terminal sequence; without JS everything renders visible.
- **Project artwork.** Projects without a screenshot (Retinal Disease Classification, iSkor,
  Online Voting System) get purpose-drawn inline SVG in `ProjectArt.svelte`, coloured from the
  same CSS custom properties as the rest of the site so they stay in step with the palette.
- **Photo mosaic.** The "Away from the keyboard" grid is a 4-column mosaic with one 2×2 feature
  tile, collapsing to 2 columns on phones. Per-photo `object-position` values in `gallery.ts` keep
  faces in frame; captions are hover-revealed on pointer devices and always shown on touch.

## Deployment

The project uses `@sveltejs/adapter-auto`, which detects Vercel/Netlify/Cloudflare automatically
but has no target configured for anything else. The site is fully static — for GitHub Pages (where
the old portfolio lived) swap in `@sveltejs/adapter-static` with `prerender = true` and set
`paths.base` to the repository name.
