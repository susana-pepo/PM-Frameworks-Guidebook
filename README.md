# PM Frameworks: a field guide

A study reference for product managers: 24 frameworks across six families
(prioritization, design, strategy, growth, execution, communication), each
taught well enough to use the same day, plus one guide per family on choosing
between them.

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173/PM-Frameworks-Guidebook/
npm run check    # validate every guide against docs/content-spec.md
npm run build    # production build in dist/
```

Pushing to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## How it is built

A vanilla JavaScript single-page app on Vite with a hash router.

| Route | Page |
|---|---|
| `#/` | Home: search, "start from your situation", the six families as an index |
| `#/category/:id` | A family: its four frameworks and its comparison guide |
| `#/framework/:slug[/:section]` | A framework guide |
| `#/compare/:slug[/:section]` | A comparison guide |

**Content and chrome are separate.** Each guide is a content fragment in
`public/guides/<File>.html`: an `article.guide` made of chapters and a fixed
set of content components, plus, where a guide has an interactive tool, one
scoped `<style data-guide-style>` and one `<script data-guide-script>`. The
app (`src/pages/guide.js`) adds everything else: breadcrumbs, the header and
meta, the contents rail that shows one section at a time (each with its own
URL), chapter numbers and previous/next links, the "Where next" footer, and the shared behaviour (quizzes,
copy buttons, links, result feedback, scrollable tables).

**One design system.** `src/styles/tokens.css` holds every colour, size,
space, radius, shadow and duration, in light and dark. `base.css`, `shell.css`,
`pages.css` and `guide.css` are the only stylesheets; guide widgets may only
use tokens. The design context is in `.impeccable.md`.

**Metadata is data.** `src/data/frameworks.js` holds the families, the
frameworks (name, question, origin, aliases, related frameworks with a
sentence on how they connect), the comparison guides and the home page
situations. Search, the index panel, family pages and guide footers all read
from it.

## Writing or editing a guide

1. Read `docs/content-spec.md` (markup, components, writing rules, script
   contract).
2. Check facts, names and shared examples against `docs/content-glossary.md`.
   It holds the canonical definitions, the resolved cross-guide
   contradictions, and the case file for Larkwell, the fictional piano-learning
   app used as the shared worked example.
3. Run `npm run check` until every guide passes.

## Checking the whole app

- `npm run check` validates structure, writing rules and widget scripts (in
  jsdom) for every guide.
- `node scripts/screenshots.mjs <dir> 375 light mobile` (or `1366 dark`)
  captures every page for a visual pass.

The old v1 page URLs (`/RICE-Framework-Guide.html` and so on) are kept as
small redirects to the new routes, so existing links keep working.

`docs/archive/` keeps the v1 brief, design research and QA plan for history.
