# Guide content spec (v2)

Every guide (25 frameworks and 6 comparison guides) is one HTML fragment in
`public/guides/<File>.html`. The fragment contains **content only**. The app
supplies all chrome: the page header, origin line, contents rail, section
numbers, the "Where next" footer, quiz behaviour, copy buttons and link
routing.

Guides are read **one section at a time**: the `header.guide-intro` and each
`section.chapter` become panels, and only the current panel is shown. Write
each chapter so it stands on its own (no "as shown above" pointing at another
chapter; name it and link it with `data-section-link`). A widget script runs
once for the whole guide, while its panel may be hidden: size things with
CSS or a `ResizeObserver`, never by measuring once at start-up.

The design system (`src/styles/guide.css`) styles every component below.
A guide must not restyle them. If a guide needs something the vocabulary
cannot express, that is a bespoke widget (see "Widgets").

The reference implementation is `public/guides/RICE-Framework-Guide.html`.
Read it before writing a guide.

---

## 1. File shape

```html
<article class="guide" data-guide="rice">

  <header class="guide-intro">
    <p class="lede">One or two sentences: what it is and what it is for.</p>
    <figure class="figure" data-hero> … the signature diagram … </figure>
    <div class="summary">
      <p class="summary-title">In short</p>
      <p>Two or three sentences a reader could repeat in a meeting.</p>
    </div>
  </header>

  <section class="chapter" id="understand" data-nav="How it works">
    <header class="chapter-head">
      <h2>The four factors</h2>
      <p class="chapter-dek">Three multiply the score, one divides it</p>
    </header>
    … components …
  </section>

  … more sections …
</article>

<style data-guide-style>
  /* only bespoke widget CSS, scoped: .guide[data-guide="rice"] … */
</style>

<script data-guide-script>
  /* only bespoke widget behaviour; see "Scripts" */
</script>
```

Rules:

- No `<html>`, `<head>`, `<body>`, `<link>`, font imports, progress bars,
  back links, tab rails, prev/next buttons or footers. The app draws those.
- No inline `style=""` attributes, except the coordinates of plotted points
  in a diagram, written as custom properties: `style="--x: 0.72; --y: 0.30"`.
- No inline event handlers (`onclick`, `oninput` …). Scripts attach listeners.
- No emoji anywhere, including in scripts and CSS `content`.
- No colours written in the markup. Colour comes from components or from
  `data-series` (see "Colour").
- `id` values are unique within the file. Section ids are short lowercase
  words (`understand`, `score`, `example`, `try`, `when`, `pitfalls`,
  `session`, `quiz`).

## 2. Section skeleton

### Framework guides

Use this order. Keep the sections the source has; rename them to these
labels where they match. A guide may add framework-specific sections (for
example "Scoring" for RICE, "The map" for Wardley) between "How it works"
and "Example". `data-nav` is the short label in the contents rail (1–3 words,
sentence case). The `<h2>` is the fuller section title.

| id | data-nav | Purpose |
|---|---|---|
| `understand` | How it works | The core idea and its parts |
| (specific) | e.g. Scoring, The map, The steps | Framework-specific mechanics |
| `example` | Example | One worked example with real numbers or content |
| `try` | Try it | The calculator, builder or template |
| `when` | When to use | Use it when / skip it when |
| `pitfalls` | Pitfalls | Common mistakes and their fixes |
| `session` | Run a session | Who, prep, agenda, facilitation tips (optional) |
| `quiz` | Quiz | Five or more questions; h2 "Test yourself on <name>" |

### Comparison guides

| id | data-nav | Holds |
|---|---|---|
| `overview` | At a glance | Each framework in one line, then the side-by-side table |
| `picker` | Choose | The picker tool; the static decision path sits under it in a `<details>` ("The rules behind the picker") so it is never on screen twice |
| `scenarios` | Scenarios | Situations and the framework each one calls for |
| `combine` | Using them together | How the frameworks hand off to each other |

The header question of a comparison guide is the family's "when" line, so
the lede states how the frameworks differ, never "this guide sets them side by
side".

## 3. Components

All class names below are the complete vocabulary. Nothing else gets a class
unless it is inside a bespoke widget.

### Prose
Plain `p`, `ul`, `ol`, `h3`, `h4`, `strong`, `a`, `dfn`, `kbd` inside a
section. Lists are styled. Use `h3` for sub-heads inside a section and `h4`
below that. Do not skip levels.

### Callout
```html
<div class="callout">                 <!-- a key idea or takeaway -->
  <p class="callout-title">Why effort divides</p>
  <p>…</p>
</div>
<div class="callout callout--tip">…</div>      <!-- a rule of thumb -->
<div class="callout callout--caution">…</div>  <!-- a warning -->
```
`callout-title` is optional. Use at most two callouts per section. Never
title one "Pro tip", "Key insight", "Remember" or "Note"; name the idea
("Why effort divides", "The 20% rule").

### Cards
```html
<div class="cards" data-cols="2">            <!-- data-cols: 2 or 3 -->
  <div class="card">
    <span class="card-key" data-series="1">R</span>   <!-- optional: letter, number or short label -->
    <h3 class="card-title">Reach</h3>
    <p class="card-q">How many people will this affect?</p>   <!-- optional guiding question -->
    <p>Body text.</p>
    <p class="card-meta">Unit: users per quarter</p>          <!-- optional -->
  </div>
</div>
```
For definitions of parts, categories, quadrants, roles, forces.

- `card-key` holds one or two characters (a letter, a number) set as a
  serif mark. A longer key ("Music learning", "7 steps") is a label: the
  app sets it in the interface face (`card-key--tag`) automatically.
- `card-key card-key--sm` is the small key beside a tool field's label:
  `<label for="…"><span class="card-key card-key--sm" data-series="1">S</span>Situation</label>`.

### Steps
```html
<ol class="steps">
  <li>
    <h3 class="step-title">List the candidates</h3>
    <p>…</p>
  </li>
</ol>
```
Numbered automatically. For an ordered process. When the list sits under an `h3`, use `h4 class="step-title"` (same for `card-title` and `pitfall-title`) so heading levels never skip or repeat. A step may contain a
`<p class="step-note">` for a key question or rule.

### Scale
```html
<ol class="scale" aria-label="Impact scale">
  <li><span class="scale-value">3</span><span class="scale-label">Massive</span><span class="scale-note">Changes how people use the product</span></li>
  …
</ol>
```
For any rubric of ordered values. Order from highest to lowest unless the
source clearly reads the other way.

### Formula
```html
<p class="formula" role="img" aria-label="RICE score equals reach times impact times confidence, divided by effort">
  <var data-series="1">Reach</var><span class="op">×</span><var data-series="2">Impact</var>
  <span class="op">×</span><var data-series="3">Confidence</var><span class="op">÷</span><var data-series="4">Effort</var>
  <span class="op">=</span><span class="formula-result">RICE score</span>
</p>
```
Group anything that must not break across lines in a `formula-term`: an
operator with the term after it, a bracketed term, or one side of a
comparison. Lines then break only between groups, never leaving an operator
or a bracket at the end of a line.
```html
<var data-series="1">Reach</var>
<span class="formula-term"><span class="op">×</span><var data-series="2">Impact</var></span>
<span class="formula-term">( <var>Actual</var> <span class="op">−</span> <var>Start</var> )</span>
<span class="formula-term"><span class="op">=</span><span class="formula-result">Score</span></span>
```
Slots are bare words in `<var>` (`<var>user type</var>`, not `[user type]`):
the colour already marks the slot.

### Table
```html
<div class="table-wrap">
  <table class="table">
    <caption>Three features scored with RICE</caption>
    <thead><tr><th scope="col">Feature</th><th scope="col" class="num">Reach</th>…</tr></thead>
    <tbody>
      <tr class="is-top"><th scope="row">Smart shuffle</th><td class="num">40,000</td>…</tr>
    </tbody>
  </table>
</div>
```
- Always a real `<table>` (never a div grid) with a `caption`, `th scope`.
- `class="num"` on numeric columns (right-aligned, tabular figures).
- `class="table table--compare"` when the first column names the rows and
  the other columns are options being compared.
- Ratings in cells: `<td data-rating="high">High</td>` with `high`,
  `midhigh`, `mid` or `low`. Always keep the word; colour alone never carries meaning.
- `tr.is-top` highlights the winning row of a worked example (one per table).
- Totals go in a `<tfoot>` (a stronger rule above, semibold), never as one
  more `tbody` row.
- The app shows the caption as a title above the table and lets the table
  scroll sideways inside its frame on narrow screens, with a "Scroll for
  more columns" note. Write captions as a full phrase; they are never cut.
- `class="table table--stack"` for a text table whose rows do not need
  comparing column by column (a feature, its category and why): on phones
  each row becomes a record with its column names as small labels. Keep
  numeric and comparison tables as tables.
- A table must not be used for layout.
- When the heading right above already names the table, keep the caption for
  screen readers with `<caption class="visually-hidden">`; the app then
  shows no title above the table.

### Fit (use it when / skip it when)
```html
<div class="fit">
  <div class="fit-col" data-fit="use">
    <h3>Use it when</h3>
    <ul><li>…</li></ul>
  </div>
  <div class="fit-col" data-fit="skip">
    <h3>Skip it when</h3>
    <ul><li>… Use <a data-guide-link="ice">ICE</a> instead.</li></ul>
  </div>
</div>
```

### Contrast (two things set side by side)
```html
<div class="contrast">
  <div class="contrast-col"><p class="contrast-label">Flat backlog</p> …</div>
  <div class="contrast-col"><p class="contrast-label">Story map</p> …</div>
</div>
```
For before/after, weak/strong, input/output, bad/good examples. Add
`data-tone="weak"` or `data-tone="strong"` on a column when one side is the
one to avoid or the one to copy.

### Pitfalls
```html
<ol class="pitfalls">
  <li>
    <h3 class="pitfall-title">Inflating impact</h3>
    <p>What goes wrong and why.</p>
    <p class="pitfall-fix"><strong>Fix:</strong> what to do instead.</p>
  </li>
</ol>
```

### Example
```html
<div class="example">
  <p class="example-label">Worked example</p>
  <h3>A music app with three candidate features</h3>
  … prose, table, figure …
  <div class="example-reading">
    <h4>What the scores tell us</h4>
    <p>…</p>
  </div>
</div>
```

### Figure
```html
<figure class="figure">
  … diagram (bespoke markup or inline SVG) …
  <figcaption>What the figure shows, in one sentence.</figcaption>
</figure>
```
`data-hero` marks the one figure that opens the guide (in `guide-intro`).
A section that reads the hero figure shows it again: put
`<div data-hero-ref></div>` where the figure should appear and the app
places a copy there (ids removed). Do not hand-copy the figure.

Inside an `.example` a figure sits flat on the example's paper (no second
frame). A wide diagram keeps its `min-width` and scrolls: either the
`.figure` itself scrolls, or wrap the wide part in
`<div class="figure-scroll">`. The app adds the "Scroll sideways to see the
whole figure" hint and keyboard focus while it is wider than the screen; do
not add your own hint.

### Facts (a labelled list)
```html
<dl class="facts">
  <div><dt>Must attend</dt><dd>PM, tech lead, designer</dd></div>
  <div><dt>Nice to have</dt><dd>Data analyst</dd></div>
</dl>
```
For rosters, prep lists, metadata, short definitions.

### Agenda
```html
<ol class="agenda">
  <li>
    <span class="agenda-time">0–10 min</span>
    <div><p class="agenda-title">Frame the goal</p><p>…</p></div>
  </li>
</ol>
```

### Template (copyable text)
```html
<div class="template">
  <p class="template-title">Executive summary template</p>
  <pre>Recommendation: …
Why now: …</pre>
</div>
```
The app adds the copy button.

### Chain (a sequence of tools or stages)
```html
<ol class="chain">
  <li><span class="chain-name">Five Forces</span><span class="chain-note">Is the market attractive?</span></li>
  …
</ol>
```

### Decision (a static decision path)
```html
<ol class="decision">
  <li>
    <p class="decision-q">Do you have usage data for each idea?</p>
    <ul>
      <li><span class="decision-if">Yes</span> <a data-guide-link="rice">Use RICE</a></li>
      <li><span class="decision-if">No</span> Go to the next question</li>
    </ul>
  </li>
</ol>
```

### Scenarios
```html
<ul class="scenarios">
  <li>
    <p class="scenario-q">“We have 40 ideas and a quarter to choose from.”</p>
    <p class="scenario-a"><a data-guide-link="rice">RICE</a>: because …</p>
  </li>
</ul>
```

### Tool (any interactive calculator, builder or picker)
```html
<div class="tool" data-tool="rice-calculator">
  <div class="tool-head">
    <h3 class="tool-title">RICE calculator</h3>
    <p class="tool-hint">Change any value and the score updates.</p>
  </div>
  <div class="fields" data-cols="2">
    <div class="field">
      <label for="rice-reach">Reach</label>
      <input id="rice-reach" type="number" min="0" value="5000" inputmode="numeric">
      <p class="field-help">People per quarter</p>
    </div>
    …
  </div>
  <div class="tool-actions"><button type="button" class="btn">Reset</button></div>
  <div class="tool-output" aria-live="polite">
    <p class="tool-output-label">Score</p>
    <output class="tool-result" for="rice-reach …">2,000</output>
    <p class="tool-output-note">5,000 × 1 × 0.8 ÷ 2</p>
  </div>
</div>
```
- Every control has a bound `<label for>`.
- Buttons are `<button type="button" class="btn">`; the main action gets
  `btn btn--primary`; one primary per tool.
- Results go in `<output class="tool-result">` inside `.tool-output`.
  The app animates changes to `.tool-result`.
- Inputs: `input`, `select`, `textarea`, `input[type=range]` are all styled.
  Choice buttons (pick one of several) use
  `<div class="choices" role="group" aria-label="…"><button type="button" class="choice" aria-pressed="false">…</button></div>`.
  Add `data-stack` to `.choices` for a vertical list of full-width options
  (a picker's answers), like the quiz.
- `<div class="fields" data-cols="3" data-compact>` keeps two columns on
  phones; use it for short numeric fields (counts, scores), not for text.
- Feedback on a draft (pass, revise, missing) is one shared list, placed
  inside `.tool-output` after the note:
  ```html
  <ul class="checks">
    <li data-state="ok"><span class="check-state">Clear</span><span>The answer comes first.</span></li>
    <li data-state="revise"><span class="check-state">Revise</span><span>…</span></li>
    <li data-state="missing"><span class="check-state">Missing</span><span>…</span></li>
  </ul>
  ```
  States are `ok`, `revise`, `missing` and `info`; the state word is shown,
  colour only supports it. Do not build a guide-specific feedback list.

A tool that recommends other guides puts the links in
`<p class="tool-links" id="…"></p>`; the app lays them out in a row and
hides the row while it is empty. A note that reports a problem adds
`is-error` to its `.tool-output-note`.

### Quiz
```html
<ol class="quiz">
  <li class="quiz-item" data-answer="1">
    <p class="quiz-q">In RICE, which factor goes in the denominator?</p>
    <ul class="quiz-options">
      <li><button type="button">Reach</button></li>
      <li><button type="button">Effort</button></li>
      <li><button type="button">Confidence</button></li>
    </ul>
    <div class="quiz-why"><p>Effort is the cost …</p></div>
  </li>
</ol>
```
- `data-answer` is the zero-based index of the correct option.
- `data-section="<chapter id>"` names the section that teaches the
  question; the app adds a "Revisit" link under the explanation.
- `quiz-why` is shown after any answer, so write it neutrally, never
  starting with "Correct" or "Wrong" (the app adds the verdict line). In
  one or two sentences, say why the right answer is right in new words, and
  why the most tempting wrong option is wrong. Do not paste a sentence from
  the guide; the Revisit link is there for rereading.
- The quiz h2 names the guide ("Test yourself on RICE"); no dek.
- No script needed; the app runs every quiz.

### More (a collapsed block)
```html
<details class="more">
  <summary>The rules behind the picker</summary>
  … components …
</details>
```
For material a reader opens on purpose, such as the static decision path
under a comparison guide's picker. Never for teaching content a reader
needs to follow the section.

### Links
- To another guide: `<a data-guide-link="ice">ICE Score</a>`; to a chapter of
  another guide add `data-guide-section="scqa"`; for a
  comparison guide `data-guide-link="compare-prioritization"`. Never link
  to `*.html` files.
- To a section in the same guide: `<a href="#try" data-section-link>the calculator</a>`.
- External sources: normal `<a href="https://…">` (the app opens them in a new tab).

### Inline
`<strong>` for the one phrase that matters in a paragraph (not whole
sentences). `<dfn>` when a term is defined. `<kbd>` for keys. `<span class="num">`
for a figure inside prose that should use tabular digits. No `<em>`/`<i>`
for emphasis, no underline, no ALL CAPS.

## 4. Colour

The chrome is neutral; colour belongs to the content's moments.

- `data-series="1"` … `"7"` on any element sets `--series` to a fixed
  categorical colour. Use it when the reader must tell several things apart
  (RICE's four factors, Kano's five categories, the seven CIRCLES steps,
  AARRR's five stages). Keep the same number for the same thing across the
  whole guide.
- In widget CSS use `var(--series)`, `var(--cat)` (this guide's category
  colour), `var(--cat-ink)` (text-safe), `var(--cat-wash)`, the neutrals
  (`--paper`, `--paper-raised`, `--paper-sunk`, `--ink`, `--ink-2`,
  `--ink-3`, `--rule`, `--rule-strong`) and the semantic set (`--good`,
  `--bad`, `--warn` and their `-wash` variants). Never a hex, rgb or named
  colour. Every value must work in both light and dark themes.
- Derived series colours: `var(--series-ink)` (text), `var(--series-wash)`
  (a fill) and `var(--series-line)` (a border), set wherever `data-series`
  is. When you mix your own, mix `in oklab`, never `in oklch`: an OKLCH mix
  of a series with the warm neutrals turns the hue (blue goes violet in
  light, teal in dark). Mixes with `transparent` are safe in either.
- Series colour enters a box as a key dot (`<span class="key-dot"
  data-series="2"></span>`), a numeral or coloured text, never as a side
  border. A top rule on a figure's boxes is the one border motif.

## 5. Widgets (bespoke diagrams and tools)

A widget is anything the vocabulary cannot express: a 2×2 you can drag
items onto, the Kano curve, a Wardley map, a loop diagram.

- Wrap it in a `figure.figure` (a diagram) or a `div.tool` (interactive).
- Style it in the file's `<style data-guide-style>` block. Every selector
  starts with `.guide[data-guide="<slug>"]`. Use tokens only: colours as
  above, spacing `--s-1`…`--s-24` (4px grid), radii `--r-sm`, `--r-md`,
  `--r-lg`, type sizes `--fs-12` … `--fs-30`, `font-family: var(--font-sans)`
  or `var(--font-serif)`. No font sizes below 12px. No shadows beyond
  `--shadow-1`/`--shadow-2`, no gradients, no glows, no transforms on hover,
  no infinite animations.
- Diagrams must reflow: at 360px wide they either stack into a readable
  list or scroll horizontally inside the figure; text never overlaps.
- Prefer inline SVG with `currentColor`/token colours for curves and maps.

## 6. Scripts

```html
<script data-guide-script>
  // `root` is the <article class="guide"> element.
  // `api.onCleanup(fn)` registers teardown (timers, window listeners).
  // `api.goTo(sectionId)` opens that section (or the section holding that id).
  const reach = root.querySelector('#rice-reach');
  …
</script>
```

- The app runs the code as a function body with `root` and `api` in scope.
  Do not declare globals, do not touch `window` except through listeners
  you remove in `api.onCleanup`, do not use `document.getElementById`
  (query inside `root`).
- Never write user input into `innerHTML`. Build nodes with
  `textContent` / `createElement`.
- Validate input: no silent coercion (an empty Effort must show a hint,
  not divide by 0.1). Format numbers with `toLocaleString('en-US')`.
- Every interactive element works with the keyboard. Drag-and-drop must
  have a keyboard or select-based alternative.
- Quiz behaviour, copy buttons and links need no script.
- When a script creates a link to another guide (a picker result, for
  example), set `href` to `#/framework/<slug>` or `#/compare/<slug>` using
  the slugs in `src/data/frameworks.js`.
- Run `node scripts/check-guide.mjs <File>.html` until it prints PASS. It
  validates this spec and runs the script in jsdom, typing into every input,
  changing every select and clicking every button.

## 7. Writing

### One section at a time, said once

Readers see one section at a time and arrive at any section by link, so:
- Never point at another section by position ("above", "the previous
  chapter", "at the top of this guide", "the next section covers").
  Name it and link it: `<a href="#score" data-section-link>Scoring</a>`.
  Do not announce what the next section covers; the contents rail does
  that.
- Say each thing once in its natural home. The introduction defines; the
  sections teach. Chapter 1 does not re-open with the lede.
- The hero caption tells the reader how to read the figure (axes,
  direction, what the colours mean). It does not restate the thesis.
- The lede does not paraphrase the header question; "In short" adds what
  the lede leaves out (the rule of thumb, the numbers to remember).
- A dek is optional and must add a fact the h2 lacks (a number, a limit,
  an audience). Delete deks that paraphrase their heading. A heading that
  needs a dek to make its point should become that point ("RICE needs data
  and a list long enough to be worth the setup", not "When RICE fits, and
  when it does not" plus a dek).
- No headings that only list what follows ("Smart Shuffle, Social
  Playlists and Lyrics Display" above a table of those three). The
  reading of an example is headed by its finding ("Low confidence, not low
  impact, held back Social Playlists"), not "What the scores tell us".
- No callout that repeats the paragraph or cards next to it, and never two
  callouts in a row.
- Larkwell is introduced once per guide, at its first mention: "Larkwell, a
  fictional piano-learning app for adults (figures are illustrative)".
  After that it is just Larkwell. Hero captions do not repeat it.
- A rule may appear in its teaching section, in Pitfalls and in the quiz;
  not in every tool hint and step as well.
- At most one "X, not Y" construction across a guide's deks and callout
  titles.
- Card keys (`.card-key`) spell something (R, I, C, E; the CIRCLES
  letters). Do not put a lone initial on a card whose title starts with it.

Voice: a knowledgeable colleague explaining clearly. Calm, concrete,
specific. American spelling ("prioritize", "behavior"), to match the
existing guides.

Keep:
- Every teaching point, step, number, example and quiz question from the
  source. You may merge exact duplicates, fix errors and tighten wording.
  You may not drop a concept.

Fix:
- Factual errors and internal contradictions (for example two different
  notations for the same value). Pick one notation and use it everywhere.
- Quiz explanations that claim "Correct" regardless of the answer.

Remove:
- Emoji, exclamation marks, ALL-CAPS emphasis, "Pro tip"/"Pro move",
  rhetorical-question openers.
- Hype and filler: game-changer, move the needle, supercharge, unlock,
  powerful, seamless, magic, secret sauce, the gold, brutally honest,
  BS detector, future-you will thank you, at the end of the day,
  it's not just X, it's Y.
- Em-dash chains. Use at most one em dash per paragraph; prefer a comma,
  colon or full stop.
- Trailing periods on headings, labels, button text and captions of one
  phrase.

Headings are sentence case and say something ("Effort is the only
divisor", not "Key insight"). The `data-nav` label is short and plain.

Numbers: one format per guide. Thousands with commas (40,000), ranges with
an en dash (2–3 weeks), multipliers with × (2×), percentages with % (80%).
