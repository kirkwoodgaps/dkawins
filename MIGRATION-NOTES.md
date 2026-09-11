# Migration Notes — dkawins.com content extraction

Extracted from the live site on 2026-09-10 by fetching the rendered HTML of each
of the 10 indexed URLs and converting the `<main>` region to Markdoc. Content in
`src/content/pages/*.mdoc` is verbatim: no copy, client name, dollar figure, or
contract count was rewritten, summarized, or invented.

Source platform: WordPress 6.1.12, Themify-based theme ("themify_builder"),
Yoast SEO. Nothing was downloaded — images are recorded as comments only.

---

## 1. Files created

| File | Path | Has live meta description? |
|---|---|---|
| `home.mdoc` | `/` | yes |
| `gsa-schedule-services.mdoc` | `/gsa-schedule-services/` | **no** |
| `gsa-multiple-award-schedules-mas-consolidation.mdoc` | `/gsa-multiple-award-schedules-mas-consolidation/` | **no** |
| `california-multiple-award-schedules-cmas.mdoc` | `/california-multiple-award-schedules-cmas/` | **no** |
| `texas-multiple-award-schedule-program.mdoc` | `/texas-multiple-award-schedule-program/` | **no** |
| `government-proposal-writing-services.mdoc` | `/government-proposal-writing-services/` | **no** |
| `what-we-do.mdoc` | `/what-we-do/` | yes |
| `who-we-are.mdoc` | `/who-we-are/` | yes (but see 3.2) |
| `success-stories.mdoc` | `/success-stories/` | yes |
| `contact-us.mdoc` | `/contact-us/` | yes |

---

## 2. Image URLs encountered

Nothing downloaded yet. Every image is noted inline in the `.mdoc` files as
`<!-- IMAGE: url (alt: "...") -->` at the position it appears.

### 2.1 Content images

| URL | Appears on |
|---|---|
| `/wp-content/uploads/2017/10/handshake-icon-29-min-1024x1024.png` | home |
| `/wp-content/uploads/2017/10/analysis-icon-14-min.png` | home |
| `/wp-content/uploads/2017/10/target-icon-png-17.png` | home |
| `http://dkawins.com/wp-content/uploads/2017/10/handshake-icon-29-min-1024x1024.png` | what-we-do |
| `http://dkawins.com/wp-content/uploads/2017/10/analysis-icon-14-min.png` | what-we-do |
| `http://dkawins.com/wp-content/uploads/2017/10/target-icon-png-17.png` | what-we-do |
| `https://dkawins.com/wp-content/uploads/2017/10/gsa-logo-1.jpg` | what-we-do |
| `https://dkawins.com/wp-content/uploads/2017/10/img.png` | what-we-do |
| `https://dkawins.com/wp-content/uploads/2017/10/Seal_of_the_United_States_Department_of_the_Navy.svg.png` | what-we-do |
| `https://www.dkawins.com/wp-content/uploads/2020/07/CSJG-logo-129x100.png` | home |
| `https://www.dkawins.com/wp-content/uploads/2020/07/CSJG-logo.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2020/07/esheader5-1024x146-701x100.jpg` | home |
| `https://www.dkawins.com/wp-content/uploads/2020/07/esheader5.jpg` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2020/07/2-min-1.jpg` | home, success-stories |
| `https://www.dkawins.com/wp-content/uploads/2020/07/kaatsu-logo.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2017/10/Ideum.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2017/10/547114_539122169459467_11946938_n.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2017/10/547114_539122169459467_11946938_n-340x100.png` | home |
| `https://www.dkawins.com/wp-content/uploads/2017/10/Thumb.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2017/10/Thumb-629x100.png` | home |
| `https://www.dkawins.com/wp-content/uploads/2017/10/maxsent.png` | success-stories |
| `https://www.dkawins.com/wp-content/uploads/2017/10/mcfarlane.png` | success-stories |

### 2.2 Site chrome (header/footer, all 10 pages)

| URL | Where |
|---|---|
| `https://www.dkawins.com/wp-content/uploads/2025/03/DKA-30-year-logo.png` | header logo |
| `https://dkawins.com/wp-content/uploads/2017/10/dka_logo.png` | footer logo |

### 2.3 `og:image` only (not rendered in page body)

| URL | Page |
|---|---|
| `https://www.dkawins.com/wp-content/uploads/2017/10/handshake-icon-29-min-1024x1024.png` | home |
| `https://dkawins.com/wp-content/uploads/2017/10/gsa-logo-1.jpg` | what-we-do |
| `https://www.dkawins.com/wp-content/uploads/2019/11/unnamed.png` | gsa-schedule-services |

### 2.4 Image issues to resolve before downloading

- **Mixed protocols and hosts.** The same three process icons are referenced
  three different ways: root-relative on home, `http://dkawins.com` (insecure,
  apex) on what-we-do, and `https://dkawins.com` (apex) elsewhere. The apex
  redirects to www. Normalize all of these to local `/images/` paths.
- **Resized derivatives vs. originals.** home uses WordPress-generated crops
  (`-340x100`, `-129x100`, `-629x100`, `-1024x146-701x100`) while
  success-stories uses the full-size original of the same logo. Download the
  originals only and let Astro's `<Image />` do the resizing.
- **`2-min-1.jpg` is unidentified.** It has empty `alt`, no caption, and no
  adjacent copy on either home or success-stories. Could not determine whether
  it is a client logo, a decorative banner, or a leftover. **Needs Nate's call.**
- **Two client logos have meaningless filenames.** From surrounding copy:
  `547114_539122169459467_11946938_n.png` is Argent World Services, and
  `Thumb.png` is Greene Respiratory Services. Rename on download, but worth
  confirming.
- `Seal_of_the_United_States_Department_of_the_Navy.svg.png` is a US Navy seal
  used as a generic icon for "Government Contracting Vehicles". Flagging because
  reusing a federal agency seal as decoration may not be intended.

---

## 3. Meta descriptions — read this before building templates

### 3.1 Five pages have no meta description at all

`gsa-schedule-services`, `gsa-multiple-award-schedules-mas-consolidation`,
`california-multiple-award-schedules-cmas`,
`texas-multiple-award-schedule-program`, and
`government-proposal-writing-services` have **no `<meta name="description">`**
on the live site. Yoast emits only an `og:description`, which is an
auto-generated excerpt — truncated with a literal `[…]` and, on some pages,
drawn from copy that no longer appears on the page (see 4.1).

I left `description: ""` in those files with a comment rather than inventing
copy or promoting the truncated excerpt. CLAUDE.md says to preserve the existing
meta description; for these five there is nothing to preserve. **Nate needs to
write five descriptions**, or we ship without them as today.

### 3.2 `who-we-are` shares the homepage's title and description

`/who-we-are/` serves the exact same `<title>` ("Government Proposal Writing &
GSA Schedule Services") and meta description as `/`. This looks like the WordPress
site-wide default leaking through rather than a deliberate choice. I preserved it
verbatim as instructed, but it is almost certainly an SEO bug worth fixing.

### 3.3 Typo preserved in `what-we-do` title

The live `<title>` is `Government Contract Succcess | Winning Government
Contracts` — "Succcess" with three c's. Preserved verbatim per the hard
constraint. Flagging it as an intentional-looking mistake.

### 3.4 Homepage description contradicts homepage body copy

The meta description says "**more than 300** government contracts". The body of
the same page says "**more than 350** wins with a combined value in excess of
$1.7 Billion", and the body's Who We Are section says "hundreds". The
success-stories page says "hundreds ... with a combined value well in excess of
**$1 billion**". All four preserved exactly as found in the `.mdoc` extraction.

**RESOLVED 2026-09-11.** Nate confirmed these are two separate metrics:

| Metric | Correct figure | What the live site publishes |
|---|---|---|
| Contract awards won for clients | **350+** | 300 (home `<meta>`), 350 (home body), "hundreds" |
| GSA Schedules awarded | **500+** | "more than 400" (`/who-we-are/`, CMAS, TXMAS, MAS) |

So the homepage body copy was right all along and only the `<meta>` tag's "300"
was stale. The `.yaml` rebuild content now reads *more than 350* for awards and
*more than 500* for GSA Schedules. The homepage `<meta>` tag is the one indexed
tag edited, on that instruction; only the number moved.

The `.mdoc` files are left untouched — they are the record of what the live site
says today, not the copy being shipped.

**Both remaining figures resolved 2026-09-11.** Nate confirmed the combined
value is **$1.7 Billion**, and that the "Over 400 Schedule Contracts" credential
on the CMAS, TXMAS and MAS pages is the same GSA metric, now **over 500 GSA
Schedules**.

Applied as follows:

- `/success-stories/` published "$1 billion" for the same claim the homepage
  put at "$1.7 Billion". It now reads $1.7 Billion and the two pages agree.
- The CMAS and TXMAS pages said "Over 400 Schedule Contracts Awarded" without
  naming GSA. Since the figure *is* the GSA count, the wording is now explicit:
  "Over 500 GSA Schedules Awarded". **Judgment call** — it makes a GSA
  credential explicit on two state-schedule pages. Revert to generic wording if
  that reads wrong in context.
- `/who-we-are/` "more than 400 companies get on the Schedule" is now 500.

**Every number in the content is now confirmed.**

One consistency point deliberately left alone: `/who-we-are/` still says DKA has
won "hundreds of government contracts" where the settled figure is 350+.
"Hundreds" is not wrong at 350, and tightening it was not asked for. Flagging it
in case you want the pages to use one phrasing.

---

## 4. Content that could not be extracted cleanly

### 4.1 `gsa-schedule-services` renders far less copy than it used to

The rendered page is short: a heading, three bullet-style lines, a form, and a
closing CTA. But its Yoast excerpt (and the `twitter:data1` "Est. reading time:
3 minutes") references copy that is **not present anywhere in the served HTML**:

> "Get On The GSA Schedule DKA makes getting on the GSA Schedule fast, easy and
> affordable. With decades of GSA Schedule experience, not only will we
> efficiently guide you throughout the entire process, we'll do all the heavy
> lifting. Hundreds of GSA Schedule Contracts Awarded. We've helped hundreds of
> companies list their products and services, […]"

That text lives in WordPress's `post_content` while the Themify builder renders
a different layout from postmeta. I extracted **only what the live page actually
renders** — I did not resurrect the orphaned copy, since I can't see its full
text (the excerpt is truncated) and can't confirm it is meant to be live.
**If this page is supposed to be longer, the full copy has to come out of the
WordPress database or an older backup.** I verified there is no hidden or
lazy-loaded content in the served markup.

### 4.2 `success-stories` promises a list it does not contain

The page's intro reads "The following is a partial list of agencies and
locations of these contracts." No such list of agencies or locations appears on
the page — it goes straight into the C&S Jones and E&S case studies followed by
testimonials. Either the list was removed and the intro was not updated, or the
list is missing. Preserved verbatim.

### 4.3 WordPress quote-escaping artifacts

Several testimonials contain literal backslashes in the source HTML — `\"` and
`DKA\'s` — a WordPress over-escaping bug that renders visibly on the live site.
I stripped the stray backslashes since they are a storage artifact, not copy.

One related artifact I did **not** silently fix: four testimonials (Argent World,
Greene Respiratory, Maxsent, McFarlane) open with a **closing** curly quote `”`
instead of an opening `“`, because the original `\”` mangled both ends. This is
how it renders live. Left as-is — flag if you want them normalized.

### 4.4 Anchor links with no target

The CMAS, TXMAS, and MAS-consolidation pages each have a "Get Started Today"
button linking to `#contact`. There is **no element with `id="contact"`** on any
of those pages, so the button currently does nothing. It should point at the
form section in the rebuild.

### 4.5 Internal links lack trailing slashes

Body links point to `/what-we-do`, `/who-we-are`, `/success-stories`,
`/contact-us` — no trailing slash — while `trailingSlash: 'always'` is required.
Preserved as found in the `.mdoc` files; **add the trailing slashes when
templating**, or every internal click takes a redirect.

### 4.6 Heading levels are not semantic

The Themify layout uses heading tags for visual sizing, not structure. Notably
`government-proposal-writing-services` has **two `<h1>`s**, whole testimonial
paragraphs are marked up as `<h3>`, and case-study body copy is split so that
the first sentence is an `<h2>` and the rest is a plain paragraph — which is why
those sections read as a heading that runs directly into lowercase prose
("...in pursuit of 2 specific contracts" / "which were set-aside for
HUBZone-certified contractors"). I preserved the source levels verbatim so
nothing is lost, but **the heading hierarchy should be redesigned when templates
are built** rather than copied.

---

## 5. Forms found

Two different form systems are in use, neither matching the Mailgun-via-Vercel
approach in CLAUDE.md. All are recorded in the `.mdoc` files as
`<!-- FORM ... -->` comments; no form markup was migrated.

### 5.1 Themify "builder-contact" forms — 8 instances across 5 pages

| Page | Count | Fields |
|---|---|---|
| `gsa-schedule-services` | 1 | name, email, message |
| `government-proposal-writing-services` | 1 | name, email, subject, message |
| `california-multiple-award-schedules-cmas` | 2 | name, email, subject, message |
| `texas-multiple-award-schedule-program` | 2 | name, email, subject, message |
| `gsa-multiple-award-schedules-mas-consolidation` | 2 | name, email, subject, message |

- `POST`s to the page's own URL with a `bc_nonce` hidden field.
- Field names: `contact-name`, `contact-email`, `contact-subject`,
  `contact-message`. Name and email always required; message never is.
- **The three Schedule pages each carry the same form twice** — once under
  "Speak to the DKA Team" and again in the closing CTA. Worth collapsing to one.
- Labels differ between instances ("Name" vs. "Your Name"), and the submit
  button reads "Send" everywhere except gsa-schedule-services, where it is
  "Send Contact Request".
- **No honeypot field exists today.** CLAUDE.md requires one in the rebuild.

### 5.2 HubSpot embedded form — contact-us

`/contact-us/` has **no HTML form**. Under the "CONTACT FORM" heading there is a
HubSpot JS embed:

```
portalId: 6193097
formId:   340b9a91-b870-416e-98ab-8ed4cce99b3e
region:   na1
```

**The field list could not be extracted** — HubSpot injects it client-side, so
it is not in the served HTML. To replicate it you need either the HubSpot
account or a rendered-browser capture of the page.

This is the one blocking decision: CLAUDE.md specifies a Vercel function posting
to Mailgun with no data stored, but the current contact page sends submissions
into HubSpot CRM. **Confirm with Nate whether leads must keep flowing into
HubSpot** before the form is rebuilt — switching to Mailgun silently would drop
them out of whatever CRM workflow exists.

---

## 6. Other observations

- **Contact details** (consistent site-wide): phone `561-640-9171`, email
  `info@dkahome.com` (note: `dkahome.com`, not `dkawins.com`), address
  5713 Corporate Way, Suite 102, West Palm Beach, FL 33407; hours Weekdays
  8:00am to 5:00pm.
- Phone number formatting varies between pages: `(561) 640-9171` and
  `561-640-9171` both appear, sometimes linked as `tel:5616409171` and sometimes
  as plain text.
- The footer copyright reads "© DeSutter, Kerr & Associates 2026".
- The footer logo is served from the **apex** domain
  (`https://dkawins.com/...`), which redirects to www — an extra hop on every
  page load today.
- `who-we-are` and `what-we-do` both end with the same CTA block ("Talk with a
  member of our team about how DKA can help your company grow in the public
  sector." + CONTACT US button), and home/success-stories share the Argent World
  and Greene Respiratory testimonials verbatim. These are good candidates for
  shared components / the Success Stories collection rather than duplicated
  content.
- `success-stories` contains 6 testimonials plus 2 case studies, which maps
  cleanly onto the planned Success Stories collection and its
  testimonial-vs-case-study flag:
  - Case studies: C&S Jones Group, E&S Diversified Services
  - Testimonials: John Doolittle (Global Chief Revenue Officer, KAATSU);
    Jim Spadaccini (Founder & CEO, Ideum); Scott Geroux (Argent World
    Services, LLC); Steve Russell (CFO, Greene Respiratory Services);
    Todd Pattison (President, Maxsent); Dave McFarlane (McFarlane Sheet Metal)
  - Of these, only the Argent World and Greene Respiratory testimonials also
    appear on the homepage.

---

## 7. Reconciliation of the submitted `home` / `success-stories` / `industries-we-serve` drafts

Three YAML drafts were submitted for these pages. They were checked line by line
against the verbatim `.mdoc` extractions in `src/content/pages/`. Sourced copy was
kept, unsourced copy was replaced with the site's own wording or blanked with a
TODO, following the convention already set in `faq.yaml`. Per-field provenance is
recorded as comments in each YAML file.

### 7.1 Hard-constraint violations, corrected

| Page | Field | Draft | Restored to |
|---|---|---|---|
| home | `<title>` | "…GSA Schedule **Experts**" | "…GSA Schedule **Services**" |
| home | meta description | rewritten, "more than 350 … $1.7 billion" | live tag verbatim, "more than 300 …" |
| success-stories | `<title>` | "Success Stories" | "Government Contract Success Stories \| Winning Government Contracts" |
| success-stories | meta description | rewritten | live tag verbatim |

CLAUDE.md requires preserving the title and meta description of each indexed page.
All four are back to what is indexed today. The 300-vs-350 question in § 3.4 is
still open and is Nate's to settle — but it gets settled deliberately, not by a
rewrite.

### 7.2 Invented copy replaced with attested copy

- **home hero.** The draft's headline and subhead appear nowhere on the site. The
  live H1 is "WINNING GOVERNMENT CONTRACTS" and the live sub-line is "Business
  development services focused on increasing each client's public sector success."
  Both restored. The all-caps rendering is Themify styling, not copy, so the text
  is stored in sentence case and cased in CSS.
- **home services.** All four draft card bodies were written fresh. Each is now
  quoted from the service page it links to.
- **"two of the largest state markets in the country"** (CMAS/TXMAS). Not on the
  site, not sourced anywhere. Removed.
- **home services.intro** had lost its middle sentence. Restored.
- **All three CTA blocks** were invented. Replaced with the CTA that
  `/what-we-do/` and `/who-we-are/` already share.
- **industries-we-serve body.** The per-industry compliance claim has no source.
  Blanked with a TODO pointing at material that could ground it.

### 7.3 Content the drafts dropped, restored

- **Four testimonials.** The draft carried 2 of the 6 on `/success-stories/` — the
  2 that also appear on the homepage. KAATSU (John Doolittle), Ideum (Jim
  Spadaccini), Maxsent (Todd Pattison) and McFarlane Sheet Metal (Dave McFarlane)
  are restored verbatim, with roles.
- **Two case-study bodies** were paraphrased. The dollar figures survived intact,
  but the prose did not. Restored to live wording, with the § 4.6 split-heading
  artifact rejoined into single paragraphs.
- **Two service pages.** The draft's homepage collapsed CMAS and TXMAS into one
  card and omitted MAS Consolidation entirely, leaving two indexed URLs with no
  link from the homepage. The row is now five cards, one per indexed service page,
  matching what CLAUDE.md specifies. The draft's Post-Award Support card is
  preserved as a commented-out sixth option; it was well sourced but pointed at
  the same URL as the proposal-writing card.
- **"More than 400 companies"** placed on Schedule contracts. Attested on four
  separate pages and absent from the draft. Added to the homepage reasons list.
  Note it contradicts the homepage's own "hundreds of companies" — another § 3.4
  number to settle.

### 7.4 The industries list is sourceable after all

The draft flagged its own industry list as generated. It is closer to the truth
than that flag suggests: `/who-we-are/` names Logistics Management, IT,
Professional Staffing, Medical Services, Environmental Services and Mobile Asphalt
Plants outright, and the homepage adds custodial, ambulance transport and real
estate appraisal. Five of the draft's six labels map onto those. The list is now
eight entries, each traceable to live copy, and uses the site's own specific
wording rather than generic sector labels.

The draft's removal of the "Federal Agencies We Support" section was correct and
is upheld. Related: `/what-we-do/` uses a US Navy seal as decoration, which reads
as a Navy affiliation for the same reason. Do not carry it over.

### 7.4b When a `.mdoc` file may be edited

The `.mdoc` files started as a pure extraction record. They are no longer only
that: the catch-all route renders a `.mdoc` for any URL that has no `.yaml` yet,
so eight of them are **shipping content** today. The rule now in force:

| File | Has a `.yaml`? | Status |
|---|---|---|
| `home.mdoc`, `success-stories.mdoc` | yes | **Archive. Do not edit.** The `.yaml` wins the route. |
| the other eight | no | **Shipping.** Corrections apply here until each gets a `.yaml`. |

That is why the 2026-09-11 figure corrections touched `who-we-are.mdoc`, the
CMAS, TXMAS and MAS pages, but not `success-stories.mdoc` — which still reads
"$1 billion" and is correct to, as a record of what the old site published.

The pristine extraction of all ten pages is preserved in git at commit `9fa29d9`
if the original wording is ever needed.

### 7.5 Still open

0. **THE SITE IS SERVED `noindex` AND MUST BE FLIPPED AT LAUNCH.** Every page
   carries `<meta name="robots" content="noindex, nofollow">`, because the
   Vercel URL is publicly crawlable and this content duplicates the live,
   indexed www.dkawins.com. **To launch: set `NOINDEX = false` in
   `src/layouts/BaseLayout.astro`.** Nothing else gates it. Forgetting this
   means the relaunched site never ranks.

1. ~~**300 vs. 350 vs. "hundreds" vs. 400**~~ — **RESOLVED**: 350+ contract
   awards won, 500+ GSA Schedules. Two metrics, not one. Applied across both the
   `.yaml` content and the shipping `.mdoc` pages. § 3.4.
2. ~~**$1 billion vs. $1.7 billion**~~ — **RESOLVED**: $1.7 Billion. Applied to
   `/success-stories/`, which now agrees with the homepage. § 3.4.
3. **The "partial list of agencies and locations"** promised by the
   success-stories intro still does not exist. § 4.2.
4. **`2-min-1.jpg`** is still unidentified and is referenced by nothing. § 2.4.
5. **MAS Consolidation page is dated** — it describes the consolidation as
   upcoming on October 1, 2019. The copy is preserved as published, but the page
   needs a rewrite from Nate before launch.
6. **No logos are downloaded.** The YAML references `/images/clients/*`;
   `public/images/` does not exist yet. Source URL for each file is in a comment
   beside it.
7. **Nothing is wired up.** There is no `src/content.config.ts` and no
   `keystatic.config.tsx`, so neither the `.mdoc` files nor these `.yaml` files
   are loaded by Astro yet. The two formats currently describe the same pages in
   parallel — `home.mdoc` and `home.yaml`, `success-stories.mdoc` and
   `success-stories.yaml`. The `.mdoc` files are the verbatim extraction record;
   the `.yaml` files are the structured content for the rebuilt templates. Decide
   which one Keystatic edits before building the schema, and keep the other as a
   reference or retire it.

---

## 8. FAQ content — what Terry needs to confirm

18 draft answers were supplied on 2026-09-11. 12 are live on `/faq/`, 1 is still
awaiting copy, and 7 are held in `src/content/pages/faq.yaml` as commented
blocks because each asserts something the business does not currently say about
itself. Full text and per-item flags are in that file.

Each row below is a single question for Terry. A yes unlocks the answer as
drafted; anything else needs his wording.

| # | The claim | Why it is held |
|---|---|---|
| 1 | DKA supports **WOSB, EDWOSB and SDVOSB** set-asides | The site claims HUBZone and 8(a) only. These are three new certification types. |
| 2 | DKA works **across civilian and defense agencies** | Nothing on the site names a customer agency. § 7.4 already removed a DoD/GSA/VA/DHS/HHS section for this reason. State work *is* attested via CMAS and TXMAS. |
| 3 | DKA supports **IDIQ task orders and BPA calls** | Plausible, unsourced. |
| 4 | DKA offers **graphic design** and **compliance matrix development** | Neither appears on the site. The rest of that answer matches the attested Proposal Development Services copy, so it may only need these two removed. |
| 5 | DKA sells **review-only engagements** (color-team reviews, editing) | The site describes evaluator-standpoint review as a step *inside* full proposal development, not a separate product. |
| 6 | DKA produces **capability statements and resumes** | Past performance write-ups are attested. These two are not. |
| 7 | GSA Schedule award takes **roughly 6 to 12 months** | No timeline appears anywhere on the site. A published range is one prospects will hold DKA to, so it has to be Terry's number. |

Two edits were made to answers that did go live:

- "Nearly three decades" became "Since 1995". DKA was formed in August 1995, so
  it is past three decades, and the 30-year logo already says so.
- "Over 500 GSA Schedule **contracts**" became "more than 500 **GSA Schedules**",
  matching the metric settled in § 3.4. The two are different counts and the
  wording was blurring them.

Still open from § 7.5 and unchanged: `/faq/` question "Does DKA work with
businesses across the country?" has no answer. "Nationwide" appears nowhere on
the live site; the strongest attested claim is one client with 26 contracts
across 9 states.
