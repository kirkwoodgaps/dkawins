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
      // Visible <h1>, when it should differ from the SEO title.
      heading: z.string().optional(),
      intro: z.string().optional(),
    })
    .passthrough(),
});

/**
 * One entry per client. `kind` splits case studies from testimonials, per the
 * content model in CLAUDE.md. Authored and edited through Keystatic.
 */
const successStories = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/success-stories' }),
  schema: z.object({
    client: z.string(),
    kind: z.enum(['caseStudy', 'testimonial']),
    order: z.number().default(99),
    // Shown on the homepage proof block as well as the stories page.
    featured: z.boolean().default(false),
    // Path string rather than image() — the logos are not downloaded yet and
    // image() fails the build on a missing file. Swap once they land.
    logo: z.string().optional(),
    heading: z.string().optional(),
    author: z.string().optional(),
    role: z.string().optional(),
    body: z.string(),
  }),
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

export const collections = { pages, successStories, archive };
