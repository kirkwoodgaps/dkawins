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
