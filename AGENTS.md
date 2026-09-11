# DKA Website (dkawins.com)

Astro + Keystatic rebuild replacing a WordPress site for DeSutter, Kerr &
Associates, a government contracting / GSA Schedule consultancy operating
since 1995. Deploys to Vercel. Nate is the only content editor.

## Hard constraints — do not violate

These URLs are live and indexed. Paths must not change:

- /
- /gsa-schedule-services/
- /gsa-multiple-award-schedules-mas-consolidation/
- /california-multiple-award-schedules-cmas/
- /texas-multiple-award-schedule-program/
- /government-proposal-writing-services/
- /what-we-do/
- /who-we-are/
- /success-stories/
- /contact-us/

- Trailing slashes are REQUIRED. Keep `trailingSlash: 'always'` in astro.config.mjs.
- `www.dkawins.com` is canonical. The apex redirects to www.
- Never rename, merge, or "clean up" a route without being asked.
- Preserve the existing `<title>` and meta description of each page unless
  told otherwise.

## Structure

- `src/content/` — Markdoc content, managed by Keystatic
- `src/pages/` — route templates
- `src/layouts/`, `src/components/` — shared UI
- `keystatic.config.tsx` — content schema (collections and singletons)
- `public/images/` — images migrated off /wp-content/uploads/

## Content model

- Success Stories: a Keystatic collection. Fields: client name, logo,
  body, and a flag for testimonial vs. case study.
- All other pages: Keystatic singletons. They are one-offs, not a collection.

## Conventions

- Static output. Do not introduce server-rendered routes except Keystatic's
  own admin route and the contact form endpoint.
- No CSS framework unless asked. Plain CSS in Astro components.
- Use Astro's `<Image />` for anything in public/images so it gets optimized.
- Contact form posts to a Vercel function that sends via Mailgun. Include a
  honeypot field. No form data is stored.

## Working style

- Ask before adding a dependency.
- Do not run `git push` or any deploy command. Nate handles those.
- When migrating a page, extract the real copy from the live site. Never
  invent or paraphrase marketing copy, client names, contract figures, or
  testimonials — this is a real business with real numbers.

## Design direction

Reference sites: coleygsa.com for credibility structure, govdash.com for
visual craft and restraint. The goal is a serious professional services firm
that happens to be modern — not a startup, not a government agency.

### Never use
- Flags, eagles, Capitol domes, patriotic gradients
- Stock photos of people in suits shaking hands
- Clip-art icons (the current site's handshake/target/analysis icons are out)
- Drop shadows on everything, glassmorphism, purple-to-blue gradients

### Typography
- Two families maximum. Headings get a distinctive face; body gets a readable
  one at 17-18px minimum.
- Fluid sizing with clamp(). Big jump between h1 and body — hierarchy should
  be obvious at a glance.
- Body line-height 1.6+, measure capped around 70ch.
- Self-host fonts in public/fonts. No Google Fonts CDN.

### Color
- Mostly neutral: near-black text on off-white, not pure #000 on #fff.
- One accent color, used sparingly for links and CTAs.
- Define everything as CSS custom properties in src/styles/tokens.css.
  No hard-coded hex values in components.

### Layout
- Content max-width ~1100px, prose sections narrower.
- Generous vertical section padding. Whitespace is the main upgrade over the
  old site.
- A 4px or 8px spacing scale as tokens. No arbitrary margins.

### Homepage structure
1. Hero: headline, one-line positioning, primary CTA.
2. Stat row immediately below the hero — 350+ contract wins, $1.7B+ in
   contract value, operating since 1995. These are DKA's strongest assets and
   are currently buried. They go above the fold.
3. Services: the four GSA offerings plus proposal writing.
4. Success stories: real client logos at consistent optical height, with the
   named testimonials and contract figures.
5. Contact CTA.

### Client logos
The existing logos are different dimensions and sit at mismatched heights.
Normalize them to a consistent optical size in a grid. Do not stretch them.

### Accessibility
- WCAG AA contrast minimum.
- Visible focus states. Don't remove outlines without replacing them.
- Real semantic headings in order. The current site has h2/h3 used for styling.
