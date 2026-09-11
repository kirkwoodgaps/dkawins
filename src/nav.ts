/**
 * Site navigation, in one place.
 *
 * The header nav was originally hardcoded in BaseLayout with four links, and
 * seven pages were added afterwards without it being updated. Keeping the list
 * here — and checking it against the real routes at build time (see
 * getStaticPaths in src/pages/[...slug].astro) — is what stops that recurring.
 *
 * WHEN YOU ADD A PAGE: add it here too, or explicitly list it in NAV_EXEMPT
 * below. The build prints a warning otherwise.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Renders as a dropdown. The parent stays a real link, listed as "Overview". */
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  {
    label: 'What We Do',
    href: '/what-we-do/',
    children: [
      {
        label: 'Government Proposal Writing',
        href: '/government-proposal-writing-services/',
      },
      { label: 'GSA Schedule Services', href: '/gsa-schedule-services/' },
      {
        label: 'GSA MAS Consolidation',
        href: '/gsa-multiple-award-schedules-mas-consolidation/',
      },
      {
        label: 'California Schedules (CMAS)',
        href: '/california-multiple-award-schedules-cmas/',
      },
      {
        label: 'Texas Schedules (TXMAS)',
        href: '/texas-multiple-award-schedule-program/',
      },
    ],
  },
  { label: 'Industries We Serve', href: '/industries-we-serve/' },
  { label: 'Success Stories', href: '/success-stories/' },
  { label: 'Who We Are', href: '/who-we-are/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

/** Routes that intentionally have no nav entry. Home is the logo link. */
export const NAV_EXEMPT = new Set(['/']);

/** Every href reachable from the nav, parents and children alike. */
export function navHrefs(): Set<string> {
  const out = new Set<string>();
  for (const item of primaryNav) {
    out.add(item.href);
    for (const child of item.children ?? []) out.add(child.href);
  }
  return out;
}

/** True when `path` is the current page or an ancestor of it. */
export function isCurrent(item: NavItem, path: string): boolean {
  if (item.href === path) return true;
  return (item.children ?? []).some((c) => c.href === path);
}
