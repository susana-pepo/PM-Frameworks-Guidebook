/**
 * Monoline glyphs, one per category and per framework: 24×24, currentColor
 * stroke at 1.5px, round caps and joins, so each takes its family's accent
 * from the tile it sits on.
 */

const SVG_OPEN =
  '<svg class="glyph-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ' +
  'aria-hidden="true" focusable="false">';

const svg = (body) => SVG_OPEN + body + '</svg>';

/* ---- CATEGORY ICONS (6) ---- */
const CATEGORY_ICONS = {
  // Prioritization — a target: aim, rank, hit what matters.
  prioritization: svg(
    '<circle cx="12" cy="12" r="8"/>' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>'
  ),
  // Design — overlapping square + circle: composing, shaping form.
  design: svg(
    '<rect x="4.5" y="4.5" width="11" height="11" rx="2.5"/>' +
    '<circle cx="15" cy="15" r="4.7"/>'
  ),
  // Strategy — a pennant on its pole: stake a position, chart the path.
  strategy: svg(
    '<path d="M6.5 21V3.8"/>' +
    '<path d="M6.5 5h10.2l-2.4 3.3 2.4 3.3H6.5"/>'
  ),
  // Growth — a rising trend line with an arrowhead.
  growth: svg(
    '<path d="M4 16l4.5-4.5 3 3L18 7"/>' +
    '<path d="M13.5 7H18v4.5"/>'
  ),
  // Execution — a board of columns: work moving to done.
  execution: svg(
    '<rect x="3.5" y="5" width="17" height="14" rx="2.2"/>' +
    '<path d="M9.17 5v14"/>' +
    '<path d="M14.83 5v14"/>'
  ),
  // Communication — a speech bubble.
  communication: svg(
    '<path d="M4 7a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5v-3.5H6.5A2.5 2.5 0 0 1 4 13z"/>'
  ),
};

/* ---- FRAMEWORK ICONS (25) ---- */
const FRAMEWORK_ICONS = {
  /* Prioritization */
  // RICE — four ascending bars on a baseline: a score from weighted factors.
  rice: svg(
    '<path d="M3.5 20h17"/>' +
    '<path d="M6 20v-3.5"/><path d="M10 20v-6.5"/>' +
    '<path d="M14 20v-9.5"/><path d="M18 20v-12.5"/>'
  ),
  // Value vs Effort — a 2×2 matrix.
  'value-effort': svg(
    '<rect x="4" y="4" width="16" height="16" rx="2.2"/>' +
    '<path d="M12 4.3v15.4"/><path d="M4.3 12h15.4"/>'
  ),
  // Kano — a rising satisfaction curve against an L-axis.
  kano: svg(
    '<path d="M4.5 4.5v15h15"/>' +
    '<path d="M5.5 16.5c5.5 .5 4.5-8.5 13-9.2"/>'
  ),
  // ICE — a gauge with a needle: a fast read.
  ice: svg(
    '<path d="M4.5 17a7.5 7.5 0 0 1 15 0"/>' +
    '<path d="M12 17l4.2-4.6"/>' +
    '<circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none"/>'
  ),

  /* Design */
  // CIRCLES — a structured breakdown: a central node branching to sub-nodes.
  circles: svg(
    '<circle cx="12" cy="12" r="2.6"/>' +
    '<circle cx="5" cy="6" r="1.7"/><circle cx="19" cy="7.5" r="1.7"/>' +
    '<circle cx="17.5" cy="18.5" r="1.7"/>' +
    '<path d="M10.1 10.6 6.3 7.2"/><path d="M14.4 11 17.4 8.7"/>' +
    '<path d="M13.5 13.9 16.4 17"/>'
  ),
  // Jobs to Be Done — a briefcase: the "job" the product is hired for.
  jtbd: svg(
    '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/>' +
    '<path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/>' +
    '<path d="M3.5 12.5h17"/><path d="M12 11.5v2"/>'
  ),
  // User Story Mapping — a backbone with cards mapped beneath it.
  'user-story-mapping': svg(
    '<path d="M3.5 6h17"/>' +
    '<rect x="3.5" y="10" width="4" height="3.2" rx="0.7"/>' +
    '<rect x="10" y="10" width="4" height="3.2" rx="0.7"/>' +
    '<rect x="16.5" y="10" width="4" height="3.2" rx="0.7"/>' +
    '<rect x="3.5" y="15.5" width="4" height="3.2" rx="0.7"/>' +
    '<rect x="10" y="15.5" width="4" height="3.2" rx="0.7"/>'
  ),
  // Design Thinking — the double diamond (diverge / converge, twice).
  'design-thinking': svg(
    '<path d="M3 12 7.5 7 12 12 7.5 17Z"/>' +
    '<path d="M12 12 16.5 7 21 12 16.5 17Z"/>'
  ),

  /* Strategy */
  // Porter's 5 Forces — four forces pressing in on the centre.
  'porters-5-forces': svg(
    '<rect x="9.5" y="9.5" width="5" height="5" rx="1"/>' +
    '<path d="M12 2.8v3.4"/><path d="M10.7 4.8 12 6.4 13.3 4.8"/>' +
    '<path d="M12 21.2v-3.4"/><path d="M10.7 19.2 12 17.6 13.3 19.2"/>' +
    '<path d="M2.8 12h3.4"/><path d="M4.8 10.7 6.4 12 4.8 13.3"/>' +
    '<path d="M21.2 12h-3.4"/><path d="M19.2 10.7 17.6 12 19.2 13.3"/>'
  ),
  // Blue Ocean — calm open water.
  'blue-ocean': svg(
    '<path d="M2.5 8c1.7-2 3.5-2 5.2 0s3.5 2 5.2 0 3.5-2 5.2 0"/>' +
    '<path d="M2.5 13c1.7-2 3.5-2 5.2 0s3.5 2 5.2 0 3.5-2 5.2 0"/>' +
    '<path d="M2.5 18c1.7-2 3.5-2 5.2 0s3.5 2 5.2 0 3.5-2 5.2 0"/>'
  ),
  // Playing to Win — a trophy.
  'playing-to-win': svg(
    '<path d="M7.5 4.5h9v3a4.5 4.5 0 0 1-9 0z"/>' +
    '<path d="M7.5 5.5H5.2A2.1 2.1 0 0 0 7.6 8.9"/>' +
    '<path d="M16.5 5.5h2.3A2.1 2.1 0 0 1 16.4 8.9"/>' +
    '<path d="M12 12v3"/>' +
    '<path d="M9.2 19.5h5.6l-.8-4.5H10z"/>'
  ),
  // Wardley Mapping — components positioned on a value-chain map.
  'wardley-mapping': svg(
    '<path d="M4.5 4v15.5h15.5"/>' +
    '<circle cx="8" cy="9" r="1.4"/><circle cx="13" cy="13.5" r="1.4"/>' +
    '<circle cx="18" cy="8" r="1.4"/>' +
    '<path d="M9.3 9.7 11.7 12.8"/><path d="M14.3 12.9 16.7 8.6"/>'
  ),

  /* Growth */
  // AARRR — a funnel: the pirate metrics flow.
  aarrr: svg('<path d="M4 5.5h16l-5.5 7v5l-5 2v-7z"/>'),
  // Growth Loops — two arrows chasing in a self-reinforcing cycle.
  'growth-loops': svg(
    '<path d="M6.8 8.2A6.5 6.5 0 0 1 17 6.5"/>' +
    '<path d="M17.4 3.4 17.2 6.8 13.8 6.4"/>' +
    '<path d="M17.2 15.8A6.5 6.5 0 0 1 7 17.5"/>' +
    '<path d="M6.6 20.6 6.8 17.2 10.2 17.6"/>'
  ),
  // North Star — a single guiding star.
  'north-star': svg(
    '<path d="M12 3.5 14 9.25 20.1 9.37 15.23 13.05 17 18.88 12 15.4 7 18.88 8.77 13.05 3.92 9.37 10 9.25Z"/>'
  ),
  // Input/Output — work transformed: an input in, an output out.
  'input-output': svg(
    '<rect x="8.5" y="8.5" width="7" height="7" rx="1.5"/>' +
    '<path d="M2.5 12h6"/><path d="M6.5 10 8.5 12 6.5 14"/>' +
    '<path d="M15.5 12h6"/><path d="M19.5 10 21.5 12 19.5 14"/>'
  ),

  /* Execution */
  // Agile / Scrum — an iteration cycle.
  'agile-scrum': svg(
    '<path d="M20 11.5A8 8 0 1 0 18 16.2"/>' +
    '<path d="M20 6.3v5.2h-5.2"/>'
  ),
  // Kanban — a board: three columns, cards moving left to right.
  kanban: svg(
    '<rect x="3.5" y="4" width="17" height="16" rx="2"/>' +
    '<path d="M9.2 4v16"/><path d="M14.8 4v16"/>' +
    '<path d="M5.4 7.5h1.9"/><path d="M5.4 10.5h1.9"/><path d="M11.1 7.5h1.8"/><path d="M16.7 7.5h1.9"/>'
  ),
  // Shape Up — the hill chart, with a piece cresting the top.
  'shape-up': svg(
    '<path d="M3.5 18.5C7 18.5 8.5 6 12 6s5 12.5 8.5 12.5"/>' +
    '<path d="M3.5 18.5h17"/>' +
    '<circle cx="12" cy="6" r="1.3" fill="currentColor" stroke="none"/>'
  ),
  // Dual Track — discovery and delivery running in parallel.
  'dual-track': svg(
    '<path d="M3 8.5h13.5"/><path d="M14.5 6.5 17 8.5 14.5 10.5"/>' +
    '<path d="M3 15.5h13.5"/><path d="M14.5 13.5 17 15.5 14.5 17.5"/>'
  ),
  // OKRs — an objective (the flag) over its key results (the bars).
  okrs: svg(
    '<path d="M6.5 4v6.5"/>' +
    '<path d="M6.5 4.5h6l-1.4 1.9 1.4 1.9h-6"/>' +
    '<path d="M6.5 14h11"/><path d="M6.5 17.5h8"/><path d="M6.5 21h5"/>'
  ),

  /* Communication */
  // STAR Method — a four-step path: Situation, Task, Action, Result.
  star: svg(
    '<path d="M4 16.5 9 11.5 14 14.5 20 6.5"/>' +
    '<circle cx="4" cy="16.5" r="1.4"/><circle cx="9" cy="11.5" r="1.4"/>' +
    '<circle cx="14" cy="14.5" r="1.4"/><circle cx="20" cy="6.5" r="1.4"/>'
  ),
  // Pyramid Principle — a tiered pyramid: answer on top, support below.
  pyramid: svg(
    '<path d="M12 4 20 19H4Z"/>' +
    '<path d="M8 12h8"/><path d="M6 15.5h12"/>'
  ),
  // Narrative Arc — an open book.
  'narrative-arc': svg(
    '<path d="M12 6.5C10 5 7 4.7 4 5.2v13c3-.5 6-.2 8 1.3 2-1.5 5-1.8 8-1.3v-13c-3-.5-6-.2-8 1.3z"/>' +
    '<path d="M12 6.5v13.3"/>'
  ),
  // Executive Summary — a document distilled to its key lines.
  'exec-summary': svg(
    '<path d="M6 3.5h8l4 4v13H6z"/>' +
    '<path d="M14 3.5v4h4"/>' +
    '<path d="M9 12h6"/><path d="M9 15h6"/><path d="M9 18h3.5"/>'
  ),
};

/** Glyph markup for a framework. */
export function frameworkGlyph(slug) {
  return FRAMEWORK_ICONS[slug];
}

/** Glyph markup for a category. */
export function categoryGlyph(id) {
  return CATEGORY_ICONS[id] || '';
}

/** Chrome icons: inline 24×24 strokes sized by the control they sit in. */
export const UI_ICONS = {
  arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>',
};
