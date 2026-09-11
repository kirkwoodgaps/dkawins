import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Two collections over the same directory, split by extension.
 *
 * `pages`   — *.yaml: structured page data written for the new design
 *             (hero / stats / services / caseStudies / testimonials / cta).
 *             These drive the rendered site.
 *
 * `archive` — *.mdoc: the verbatim extraction from the live WordPress site.
 *             Source of truth for wording, NOT for layout — it carries the old
 *             site's non-semantic heading levels (two <h1>s on one page,
 *             testimonials marked up as <h3>). Used as a fallback for routes
 *             that have no .yaml yet, so no indexed URL 404s in the meantime.
 *
 * Splitting by glob is what keeps `/` and `/success-stories/` from being
 * defined twice — home.mdoc and home.yaml both claim `/`, and a single
 * collection over the directory would collide on them.
 */

// Page data is heterogeneous by design — home has `hero`/`services`, FAQ has
// `groups`, success-stories has `caseStudies`. Validate the fields every page
// must have and let the section keys through untouched. Tighten per-page once
// the section shapes stop moving.
const pages = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/pages' }),
  schema: z
    .object({
      title: z.string(),
      path: z.string().startsWith('/').endsWith('/').or(z.literal('/')),
      metaDescription: z.string().optional(),
      intro: z.string().optional(),
    })
    .passthrough(),
});

const archive = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    // .mdoc files use `description`; .yaml files use `metaDescription`.
    // Five of these are intentionally empty — those pages have no
    // <meta name="description"> on the live site. See MIGRATION-NOTES.md § 3.1.
    description: z.string().optional(),
    path: z.string(),
  }),
});

export const collections = { pages, archive };
