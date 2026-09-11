import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Keystatic content schema.
 *
 * ---------------------------------------------------------------------------
 * TWO THINGS TO KNOW BEFORE EDITING THIS FILE
 *
 * 1. Keystatic writes only the fields declared here. Any key present in a YAML
 *    file but missing from its schema is DELETED the first time that page is
 *    saved. `path` in particular must stay declared on every singleton — it is
 *    what the router builds URLs from, and those URLs are live and indexed.
 *
 * 2. Saving through Keystatic rewrites the YAML and strips its comments. The
 *    per-field provenance notes currently in src/content/pages/*.yaml will not
 *    survive the first save. That is expected and acceptable: the same record
 *    is kept in MIGRATION-NOTES.md § 7, which Keystatic never touches.
 * ---------------------------------------------------------------------------
 *
 * Storage is `local`: Keystatic edits files in the working tree and changes are
 * committed with git. Switching to GitHub mode needs an app registration and
 * three env vars, and is worth doing only once there is a deployed URL for Nate
 * to log in to.
 */

// Shared across every page singleton. Declared once so no page can quietly
// drop one of them.
const pageMeta = {
  title: fields.text({
    label: 'Page title',
    description: 'The browser tab and search-result headline. Changing this affects SEO.',
    validation: { length: { min: 1 } },
  }),
  path: fields.text({
    label: 'URL path',
    description:
      'DO NOT CHANGE. These URLs are live and indexed. Must start and end with a slash.',
    validation: { length: { min: 1 } },
  }),
  metaDescription: fields.text({
    label: 'Meta description',
    description: 'The search-result snippet. Aim for 150-160 characters.',
    multiline: true,
  }),
  heading: fields.text({
    label: 'Visible heading',
    description:
      'The headline shown on the page. Leave empty to reuse the page title. Set it when the page title carries an SEO suffix you do not want on screen.',
  }),
};

// The closing call to action, used at the bottom of every page.
const ctaBlock = fields.object(
  {
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({ label: 'Body', multiline: true }),
    label: fields.text({ label: 'Button label' }),
    href: fields.text({ label: 'Button link' }),
  },
  { label: 'Closing call to action' }
);

const statsBlock = fields.array(
  fields.object({
    value: fields.text({ label: 'Figure', description: 'e.g. 350+, $1.7B+, 1995' }),
    label: fields.text({ label: 'Caption', multiline: true }),
  }),
  {
    label: 'Stat row',
    itemLabel: (props) => props.fields.value.value || 'Stat',
  }
);

// Narrative sections: a heading and one or more paragraphs. Used by the
// service and about pages, which are prose rather than cards or lists.
const sectionsBlock = fields.array(
  fields.object({
    heading: fields.text({ label: 'Heading' }),
    body: fields.text({
      label: 'Body',
      description: 'Separate paragraphs with a blank line.',
      multiline: true,
    }),
  }),
  {
    label: 'Sections',
    itemLabel: (props) => props.fields.heading.value || 'Section',
  }
);

const faqGroups = fields.array(
  fields.object({
    heading: fields.text({ label: 'Group heading' }),
    items: fields.array(
      fields.object({
        q: fields.text({ label: 'Question' }),
        a: fields.text({
          label: 'Answer',
          description: 'Leave empty to hide this question from the page.',
          multiline: true,
        }),
      }),
      {
        label: 'Questions',
        itemLabel: (props) => props.fields.q.value || 'Question',
      }
    ),
  }),
  {
    label: 'Question groups',
    itemLabel: (props) => props.fields.heading.value || 'Group',
  }
);

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'DKA' },
    navigation: {
      Pages: [
        'home',
        'about',
        'successStoriesPage',
        'industriesWeServe',
        'faq',
        'contact',
      ],
      Services: [
        'whatWeDo',
        'proposalWriting',
        'gsaScheduleServices',
        'masConsolidation',
        'cmas',
        'txmas',
      ],
      'Success Stories': ['successStories'],
    },
  },

  collections: {
    /**
     * One entry per client. `kind` is the case-study/testimonial flag from the
     * content model in CLAUDE.md. Files land at
     * src/content/success-stories/<slug>.yaml, which is exactly what the Astro
     * `successStories` collection reads.
     */
    successStories: collection({
      label: 'Success Stories',
      path: 'src/content/success-stories/*',
      format: { data: 'yaml' },
      slugField: 'client',
      columns: ['client', 'kind'],
      entryLayout: 'form',
      schema: {
        client: fields.slug({
          name: {
            label: 'Client name',
            description: 'The company name as it should appear on the page.',
            validation: { length: { min: 1 } },
          },
        }),
        kind: fields.select({
          label: 'Type',
          description:
            'Case studies render as a narrative with a headline. Testimonials render as a pull quote with attribution.',
          options: [
            { label: 'Case study', value: 'caseStudy' },
            { label: 'Testimonial', value: 'testimonial' },
          ],
          defaultValue: 'testimonial',
        }),
        order: fields.integer({
          label: 'Display order',
          description: 'Lower numbers appear first.',
          defaultValue: 99,
        }),
        featured: fields.checkbox({
          label: 'Show on the homepage',
          description:
            'Featured entries also appear in the proof block on the homepage.',
          defaultValue: false,
        }),
        // A bare filename, resolved against src/assets/clients at build time so
        // astro:assets optimises it and can read its dimensions. The template
        // sizes every logo to equal optical AREA from those dimensions, which is
        // why this field is not a width or a height.
        logo: fields.text({
          label: 'Logo file',
          description:
            'Filename inside src/assets/clients, e.g. acme.png. No path.',
        }),
        heading: fields.text({
          label: 'Headline',
          description: 'Case studies only. Leave empty for testimonials.',
        }),
        author: fields.text({
          label: 'Quoted person',
          description: 'Testimonials only.',
        }),
        role: fields.text({
          label: 'Their title',
          description: 'Testimonials only. Optional.',
        }),
        body: fields.text({
          label: 'Body',
          description:
            'The case-study narrative, or the testimonial quote without surrounding quotation marks. Separate paragraphs with a blank line.',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
      },
    }),
  },

  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/pages/home',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        hero: fields.object(
          {
            headline: fields.text({ label: 'Headline' }),
            subhead: fields.text({ label: 'Subhead', multiline: true }),
            cta: fields.object({
              label: fields.text({ label: 'Button label' }),
              href: fields.text({ label: 'Button link' }),
            }),
          },
          { label: 'Hero' }
        ),
        stats: statsBlock,
        services: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Service' }),
                body: fields.text({ label: 'Description', multiline: true }),
                href: fields.text({ label: 'Links to' }),
              }),
              {
                label: 'Services',
                itemLabel: (props) => props.fields.title.value || 'Service',
              }
            ),
          },
          { label: 'Services' }
        ),
        whyDka: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            items: fields.array(fields.text({ label: 'Reason' }), {
              label: 'Reasons',
              itemLabel: (props) => props.value || 'Reason',
            }),
          },
          { label: 'Why companies choose DKA' }
        ),
        clientStories: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            linkLabel: fields.text({ label: 'Link label' }),
            linkHref: fields.text({ label: 'Link target' }),
          },
          { label: 'Client proof block' }
        ),
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    // The page frame only. The case studies and testimonials on it come from
    // the Success Stories collection above.
    successStoriesPage: singleton({
      label: 'Success Stories (page)',
      path: 'src/content/pages/success-stories',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        stats: statsBlock,
        testimonialsIntro: fields.text({
          label: 'Testimonials intro',
          description:
            'Sits above the client quotes. Keep it to what the quotes themselves support.',
          multiline: true,
        }),
        cta: ctaBlock,
      },
    }),

    industriesWeServe: singleton({
      label: 'Industries We Serve',
      path: 'src/content/pages/industries-we-serve',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        industries: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            items: fields.array(
              fields.object({ name: fields.text({ label: 'Industry' }) }),
              {
                label: 'Industries',
                itemLabel: (props) => props.fields.name.value || 'Industry',
              }
            ),
          },
          { label: 'Industries' }
        ),
        body: fields.text({ label: 'Closing paragraph', multiline: true }),
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    faq: singleton({
      label: 'FAQ',
      path: 'src/content/pages/faq',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    about: singleton({
      label: 'About (Who We Are)',
      path: 'src/content/pages/who-we-are',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        stats: statsBlock,
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    whatWeDo: singleton({
      label: 'What We Do (services hub)',
      path: 'src/content/pages/what-we-do',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        stats: statsBlock,
        services: fields.object(
          {
            heading: fields.text({ label: 'Heading' }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            items: fields.array(
              fields.object({
                title: fields.text({ label: 'Service' }),
                body: fields.text({ label: 'Description', multiline: true }),
                href: fields.text({ label: 'Links to' }),
              }),
              {
                label: 'Services',
                itemLabel: (props) => props.fields.title.value || 'Service',
              }
            ),
          },
          { label: 'Services' }
        ),
        sections: sectionsBlock,
        cta: ctaBlock,
      },
    }),

    gsaScheduleServices: singleton({
      label: 'GSA Schedule Services',
      path: 'src/content/pages/gsa-schedule-services',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        stats: statsBlock,
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    masConsolidation: singleton({
      label: 'GSA MAS Consolidation',
      path: 'src/content/pages/gsa-multiple-award-schedules-mas-consolidation',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    proposalWriting: singleton({
      label: 'Government Proposal Writing',
      path: 'src/content/pages/government-proposal-writing-services',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        stats: statsBlock,
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    cmas: singleton({
      label: 'California Schedules (CMAS)',
      path: 'src/content/pages/california-multiple-award-schedules-cmas',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    contact: singleton({
      label: 'Contact Us',
      path: 'src/content/pages/contact-us',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),

    txmas: singleton({
      label: 'Texas Schedules (TXMAS)',
      path: 'src/content/pages/texas-multiple-award-schedule-program',
      format: { data: 'yaml' },
      schema: {
        ...pageMeta,
        intro: fields.text({ label: 'Intro', multiline: true }),
        sections: sectionsBlock,
        groups: faqGroups,
        cta: ctaBlock,
      },
    }),
  },
});
