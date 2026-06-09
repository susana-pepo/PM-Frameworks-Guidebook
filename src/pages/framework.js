import { getFramework, getCategory } from '../data/frameworks.js';
import { frameworkGlyph, categoryGlyph } from '../data/icons.js';
import { extractAndCleanCSS, injectStyles, cleanInlineFonts, cleanScriptFonts, normalizeContent } from '../utils/style-injector.js';
import { decorateGlyphs, wrapTables, observeGlyphs } from '../data/content-glyphs.js';

/**
 * Framework page renderer.
 * Loads the original HTML source file, extracts the body content,
 * reinjects cleaned CSS (with font/global overrides stripped), and then
 * rebuilds it into a single editorial reading document.
 */

// Cache loaded framework content — stores { html, css }
const contentCache = new Map();

export async function renderFrameworkPage(container, slug, initialStep) {
  const fw = getFramework(slug);
  if (!fw) {
    container.innerHTML = '<p>Framework not found.</p>';
    return;
  }

  const cat = getCategory(fw.category);

  // Show loading state
  container.innerHTML = `
    <div class="fw-loading" role="status" aria-live="polite">
      <div class="fw-loading-emoji">${fw.emoji}</div>
      <p>Loading ${fw.name}…</p>
    </div>
  `;

  try {
    const { html, css } = await loadFrameworkContent(fw.sourceFile);

    // Inject framework-specific styles (cleaned of globals + font overrides)
    injectStyles(css);

    container.innerHTML = `<div class="fw-page" data-category="${cat.id}" style="--accent-color:${cat.color}; --accent-light:${cat.colorLight};">
      <div class="fw-page-header">
        <div class="fw-category-badge"><span class="fw-badge-glyph" aria-hidden="true">${categoryGlyph(cat.id, cat.emoji)}</span> ${cat.name}</div>
      </div>
      ${html}
    </div>`;

    // Set category on .app-content so page background matches category fill
    const appContent = container.closest('.app-content') || container;
    appContent.setAttribute('data-category', cat.id);

    // Strip leading emojis from H1 — the SPA identity already shows the emoji
    stripLeadingEmoji(container);

    // Clean inline font-family references (480 elements across HTML files)
    cleanInlineFonts(container);

    // Elevate readability: lift tiny inline font sizes to a legible floor and
    // strip decorative side-stripes across all inline-styled content.
    normalizeContent(container);

    // Execute any inline scripts from the loaded content
    executeScripts(container);

    // Replace the emoji still living inside the content (decorative glyphs,
    // semantic ✅/❌/⚠️ signals, status dots) with the bespoke monoline family.
    decorateGlyphs(container);
    wrapTables(container);

    // Rebuild the raw content into the editorial reading document
    buildReadingDocument(container, {
      slug, emoji: fw.emoji, glyph: frameworkGlyph(fw.slug, fw.emoji),
      title: fw.name, initialStep,
    });

    // Keep de-emojifying content that interactive widgets inject after load.
    observeGlyphs(container);

    // Give live computed numbers (calculator scores, factor echoes) a brief
    // "the system heard you" pulse whenever their value changes.
    observeLiveNumbers(container);
  } catch (err) {
    container.innerHTML = `
      <div class="fw-error" role="alert">
        <p class="fw-error-title">We couldn't load this framework.</p>
        <p class="fw-error-detail">${err.message}</p>
        <a class="btn btn-sm" href="#/">Back to all frameworks</a>
      </div>
    `;
  }
}

async function loadFrameworkContent(sourceFile) {
  if (contentCache.has(sourceFile)) {
    return contentCache.get(sourceFile);
  }

  // Fetch the original HTML file
  const response = await fetch(`${import.meta.env.BASE_URL}${sourceFile}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const fullHtml = await response.text();

  // Parse and extract body content
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHtml, 'text/html');

  // Extract and clean CSS BEFORE removing style elements
  const css = extractAndCleanCSS(doc);

  // Remove the <style> tags from the DOM (CSS text already extracted)
  doc.querySelectorAll('style').forEach(el => el.remove());

  // Get body content
  const bodyContent = doc.body.innerHTML;

  // Extract scripts separately (we'll re-execute them)
  const scripts = [];
  doc.querySelectorAll('script').forEach(script => {
    scripts.push(script.textContent);
  });

  // Build the final content: body HTML without scripts + scripts as data
  const cleanBody = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Store scripts as a data attribute we can extract later
  const html = cleanBody + scripts.map(s =>
    `<script type="text/framework-script">${s}</script>`
  ).join('');

  const result = { html, css };
  contentCache.set(sourceFile, result);
  return result;
}

function executeScripts(container) {
  // Use indirect eval — (0, eval)(code) — to execute in global scope.
  // This ensures function declarations attach to window, which is
  // required for onclick="goTo(...)" handlers in the original HTML.
  const globalEval = (0, eval);
  const scripts = container.querySelectorAll('script[type="text/framework-script"]');
  scripts.forEach(oldScript => {
    let code = oldScript.textContent;
    oldScript.remove();
    if (code.trim()) {
      // Clean font references in JS strings so dynamically generated
      // elements use design system fonts instead of Lilita One/Outfit
      code = cleanScriptFonts(code);
      try {
        globalEval(code);
      } catch (err) {
        console.warn('Framework script error:', err.message);
      }
    }
  });
}

/**
 * Animate live computed numbers with a brief pulse when their value changes.
 *
 * Result displays are heterogeneous across the 24 frameworks (only `.calc-
 * result-num` is shared; most use framework-specific ids), so rather than wire
 * per-file selectors this watches the whole content for any *leaf* element
 * whose text is a pure number and whose value just changed — a calculator
 * score, a factor echo, a running total. On change it adds `.fw-num-pulse`
 * (a GPU-only scale + accent flash, auto-removed). It NEVER rewrites the
 * number, so each framework's own math and formatting stay the source of truth
 * and there's no observer feedback loop (the class is an attribute mutation).
 *
 * Tuned to ignore prose and equation strings: the element must be childless and
 * its full trimmed text must read as a single number (commas/decimal/%/× ok).
 *
 * @param {HTMLElement} root — container to watch (e.g. .fw-page)
 */
function observeLiveNumbers(root) {
  if (!root || typeof MutationObserver === 'undefined') return;

  // A single number: optional sign/currency, digits with thousands/decimals,
  // optional trailing unit (%, ×, x). Equations ("5,000 × 1 ÷ 2") have inner
  // markup so they're never childless — and so never match here.
  const NUM_RE = /^[\s$€£+-]*\d[\d.,\s]*\s*[%×x]?\s*$/;
  const isNumberDisplay = (el) => {
    if (!el || el.nodeType !== 1 || el.children.length > 0) return false;
    const t = (el.textContent || '').trim();
    return t.length > 0 && t.length <= 14 && /\d/.test(t) && NUM_RE.test(t);
  };

  const last = new WeakMap();
  // Seed current values so the first *real* change pulses, not initial render.
  root.querySelectorAll('*').forEach((el) => {
    if (isNumberDisplay(el)) last.set(el, el.textContent.trim());
  });

  const pulse = (el) => {
    const t = el.textContent.trim();
    const prev = last.get(el);
    last.set(el, t);
    if (prev === undefined || prev === t) return;
    el.classList.remove('fw-num-pulse');
    void el.offsetWidth;            // restart the animation if retriggered fast
    el.classList.add('fw-num-pulse');
  };

  root.addEventListener('animationend', (e) => {
    if (e.animationName === 'fwNumPulse') e.target.classList.remove('fw-num-pulse');
  });

  const obs = new MutationObserver((muts) => {
    const seen = new Set();
    for (const mu of muts) {
      let el = mu.target;
      if (el && el.nodeType === 3) el = el.parentElement;
      if (el && el.nodeType === 1 && !seen.has(el) && isNumberDisplay(el)) {
        seen.add(el);
        pulse(el);
      }
    }
  });
  obs.observe(root, { childList: true, characterData: true, subtree: true });
}

/**
 * Strip leading emoji characters from the H1 heading.
 * The SPA-rendered identity already shows the emoji, so duplicating it in
 * the title is redundant.
 */
function stripLeadingEmoji(container) {
  const h1 = container.querySelector('.header h1');
  if (!h1) return;

  // Match leading emoji sequences (including compound emoji like 🏴‍☠️)
  // followed by optional whitespace
  h1.textContent = h1.textContent.replace(
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}‍️]+\s*/u,
    ''
  );
}

/* Canonical section titles for comparison guides, mirrored verbatim from the
   two well-formed guides (Prioritization / Design) so the headerless guides
   read as the same product. Used only as a fallback when a headerless guide's
   section carries no heading of its own. Title Case matches both those guides'
   titles and the promoted source headings ("Decision Flowchart", "The
   Strategic Pipeline"), so casing stays consistent within a guide. Keyed by the
   lowercased journey-nav label. */
const COMPARE_STEP_TITLE = {
  overview: 'At a Glance',
  compare: 'Side-by-Side Comparison',
  decide: 'Decision Flowchart',
  scenarios: 'Real Scenarios',
  combine: 'Using Them Together',
  picker: 'Framework Picker',
};

/**
 * Give a section the editorial header every framework section has.
 *
 * The four "canonical-template" comparison guides (Strategy/Growth/Execution/
 * Communication) ship section bodies with no `.sec-title` — just a bare `<h3>`,
 * or nothing — so they render visibly thinner than every framework section
 * (which opens with an accent-barred display title + caption). This synthesises
 * the same `.sec-title` structure (the central CSS then styles it identically):
 * it promotes the section's OWN first heading where it has one (keeping each
 * guide's specific voice, e.g. "The Strategic Pipeline"), otherwise falls back
 * to the canonical step title above. No-ops when a real `.sec-title` already
 * exists, so frameworks and the two complete comparison guides are untouched.
 *
 * @param {HTMLElement} panel — the section's source panel
 * @param {string} label — the journey-nav label for this step (fallback title)
 */
function ensureSectionHeader(panel, label) {
  if (!panel || panel.querySelector('.sec-title')) return;

  // Prefer a heading the section already carries — look only shallowly (the
  // panel itself or its first card) so we promote the section's title, never a
  // sub-head buried deeper in the content.
  const heading = panel.querySelector(
    ':scope > h2, :scope > h3, ' +
    ':scope > .c-card > h2, :scope > .c-card > h3, ' +
    ':scope > .c-card-static > h2, :scope > .c-card-static > h3'
  );
  let titleText = '';
  if (heading) {
    titleText = heading.textContent.trim();
    heading.remove();
  } else {
    titleText = COMPARE_STEP_TITLE[(label || '').trim().toLowerCase()] || (label || '').trim();
  }
  if (!titleText) return;

  const secTitle = document.createElement('div');
  secTitle.className = 'sec-title fw-synth-header';
  const bar = document.createElement('div');
  bar.className = 'sec-icon';            // de-stickered to the 4px accent bar by CSS
  const labelWrap = document.createElement('div');
  labelWrap.className = 'sec-label';
  const h = document.createElement('h2');
  h.textContent = titleText;
  labelWrap.appendChild(h);
  secTitle.appendChild(bar);
  secTitle.appendChild(labelWrap);
  panel.insertBefore(secTitle, panel.firstChild);
}

/**
 * Build a reading document from raw tabbed source content.
 *
 * The source HTML ships as a tabbed micro-site (a `.journey-nav` rail whose
 * buttons toggle one `.panel`/`.section` at a time). That produced an empty
 * identity column, an overflowing tab strip, and acres of dead paper. This
 * rebuilds it into one continuous editorial document:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  HEADER BAND — emoji · badge · title · TL;DR  │
 *   ├───────────────┬──────────────────────────────┤
 *   │  On this page │  ★ At a glance                │
 *   │  ★ At a glance│  01 … section …               │
 *   │  01 Understand│  02 … section …               │
 *   │  02 Score …   │  (all sections, one scroll)   │
 *   └───────────────┴──────────────────────────────┘
 *
 * The left column is now a useful sticky contents rail (scroll-spied), not
 * decoration. Every section is visible, so the page reads top-to-bottom and
 * fills its width. All original interactive widgets keep working — their DOM
 * and scripts are preserved, only re-parented. Shared by framework pages and
 * comparison guides (which set `wide` so their wide tables get full measure).
 *
 * @param {HTMLElement} container
 * @param {object} opts
 * @param {string}  opts.slug         used for section ids + scroll targets
 * @param {string}  [opts.emoji]      identity emoji shown in the header tile
 * @param {string}  [opts.title]      identity title; falls back to source <h1>
 * @param {number}  [opts.initialStep] deep-link section index to scroll to
 * @param {boolean} [opts.wide]       relax the reading measure (comparison tables)
 */
export function buildReadingDocument(container, opts = {}) {
  const { slug, emoji, glyph, title, initialStep, wide = false, forceCover = false } = opts;
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const journeyNav = fwPage.querySelector('.journey-nav');
  const jBtns = journeyNav ? Array.from(journeyNav.querySelectorAll('.j-btn')) : [];

  // No tab rail → leave the content as a plain scroll (defensive; all 24
  // framework files ship a journey nav).
  if (jBtns.length === 0) return;

  // ---- Resolve each tab's target panel (same resolution the tabs used) ----
  const panels = jBtns.map((btn, i) => {
    const onclick = btn.getAttribute('onclick') || '';
    let panel = null;

    const goToMatch = onclick.match(/goTo\(['"]([^'"]+)['"]\)/);
    if (goToMatch) panel = fwPage.querySelector(`#${CSS.escape(goToMatch[1])}`);

    if (!panel) {
      const goMatch = onclick.match(/go\((\d+)\)/);
      if (goMatch) panel = fwPage.querySelectorAll('.section')[parseInt(goMatch[1], 10)] || null;
    }

    if (!panel) {
      const all = fwPage.querySelectorAll('.panel, .section');
      panel = all[i] || null;
    }

    return panel;
  });

  // ---- Section labels (number + short label) from the tab buttons ----
  const steps = jBtns.map((btn, i) => {
    const stepEl = btn.querySelector('.j-step');
    const num = stepEl ? stepEl.textContent.trim() : String(i + 1).padStart(2, '0');
    const clone = btn.cloneNode(true);
    clone.querySelector('.j-step')?.remove();
    return { num, label: clone.textContent.trim() };
  });

  // ---- Header band pieces ----
  const pageHeader = fwPage.querySelector('.fw-page-header');
  const badge = pageHeader?.querySelector('.fw-category-badge');
  const header = fwPage.querySelector('.header');
  const subtitle = header?.querySelector('p, .subtitle, .sub');
  const tldr = fwPage.querySelector('.one-liner, .tldr-section, .tldr');

  // ---- "At a glance" visual(s): the hero diagram from the source ----
  const glanceNodes = [];
  const fwContainer = fwPage.querySelector('.container, .wrapper');
  if (fwContainer) {
    const vizSelectors = [
      '.formula-bar', '.matrix-hero', '.map-hero', '.kano-hero',
      '.curve-box', '.circles-hero', '.phase-hero', '.anatomy-diagram',
    ];
    let found = false;
    for (const sel of vizSelectors) {
      const viz = fwContainer.querySelector(sel);
      if (viz) { glanceNodes.push(viz); found = true; }
    }
    // Fallback: grab anything before the tab rail that isn't chrome
    if (!found) {
      const skip = ['journey-nav', 'accordion-nav', 'footer', 'nav-btns', 'panel-nav',
        'one-liner', 'tldr-section', 'tldr', 'fw-tldr-card', 'progress-bar', 'back-link', 'header'];
      const kids = Array.from(fwContainer.children);
      const navIdx = journeyNav ? kids.indexOf(journeyNav) : kids.length;
      for (let i = 0; i < navIdx; i++) {
        const c = kids[i];
        if (c === header || c.tagName === 'SCRIPT') continue;
        if (skip.some(cl => c.classList.contains(cl))) continue;
        glanceNodes.push(c);
      }
    }
  }

  // ===== ASSEMBLE THE DOCUMENT =====
  const doc = document.createElement('div');
  doc.className = 'fw-doc deck-mode' + (wide ? ' is-wide' : '');
  // --accent-color / --accent-light are inherited from .fw-page's inline style.

  // ---- Header band (slim identity bar) ----
  // The header is pinned above every section in the deck, so it must stay
  // lean: glyph + category badge + title only. The subtitle and TL;DR move
  // into the opening "At a glance" cover (below) so they introduce the guide
  // without stealing vertical room from every single section.
  const head = document.createElement('header');
  head.className = 'fw-doc-header';

  const ident = document.createElement('div');
  ident.className = 'fw-doc-ident';

  if (glyph || emoji) {
    const tile = document.createElement('span');
    tile.className = 'fw-doc-emoji';
    tile.setAttribute('aria-hidden', 'true');
    if (glyph) tile.innerHTML = glyph;
    else tile.textContent = emoji;
    ident.appendChild(tile);
  }

  const identText = document.createElement('div');
  identText.className = 'fw-doc-ident-text';
  if (badge) identText.appendChild(badge);
  const titleEl = document.createElement('h1');
  titleEl.className = 'fw-doc-title';
  titleEl.textContent = title || header?.querySelector('h1')?.textContent?.trim() || slug;
  identText.appendChild(titleEl);

  // A cover panel is only worth its own view when it carries substance — a hero
  // visual or the 15-second summary. Comparison guides have neither, so they
  // used to open straight into section 1 with the subtitle crammed in the slim
  // header; `forceCover` (passed by compare.js) instead composes a deliberate
  // title card from the category mark + subtitle so all 30 guides open the same
  // way (★ At a glance → numbered sections).
  const hasCover = glanceNodes.length > 0 || !!tldr || forceCover;
  if (subtitle && !hasCover) {
    subtitle.classList.add('fw-doc-subtitle');
    identText.appendChild(subtitle);
  }

  ident.appendChild(identText);
  head.appendChild(ident);

  doc.appendChild(head);

  // ---- Body: sticky rail + stacked document ----
  const body = document.createElement('div');
  body.className = 'fw-doc-body';

  const rail = document.createElement('nav');
  rail.className = 'fw-rail';
  rail.setAttribute('aria-label', 'Sections of this guide');
  rail.innerHTML = '<p class="fw-rail-title">On this page</p>';
  const railList = document.createElement('ul');
  railList.className = 'fw-rail-list';
  rail.appendChild(railList);

  // The document column becomes a horizontal "section deck": one section
  // fills the reading panel at a time and moving between them slides sideways
  // like turning a page. Friendlier to digest than an endless scroll — one
  // idea per view, clear progress, and the page only scrolls if a single
  // section genuinely runs tall.
  const main = document.createElement('div');
  main.className = 'fw-doc-main';

  const deck = document.createElement('div');
  deck.className = 'fw-deck';

  // Slim progress bar across the top of the deck
  const bar = document.createElement('div');
  bar.className = 'fw-deck-bar';
  bar.innerHTML = '<span class="fw-deck-bar-fill"></span>';

  // The stage is a flex band that fills the room between the progress bar and
  // the controls; the viewport is vertically centred within it. The viewport
  // clips the sliding track and its height is JS-synced to the active panel
  // (see syncHeight below) — short panels sit as a composed card in the centre
  // of the stage, tall panels fill it and scroll within.
  const stage = document.createElement('div');
  stage.className = 'fw-deck-stage';
  const viewport = document.createElement('div');
  viewport.className = 'fw-deck-viewport';
  const track = document.createElement('div');
  track.className = 'fw-deck-track';
  viewport.appendChild(track);
  stage.appendChild(viewport);

  deck.appendChild(bar);
  deck.appendChild(stage);
  main.appendChild(deck);

  const sections = [];

  const addSection = (id, num, label, nodes, extraClass) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'fw-rail-link';
    a.href = `#${id}`;
    a.dataset.target = id;
    a.innerHTML = '<span class="fw-rail-num" aria-hidden="true"></span><span class="fw-rail-label"></span>';
    a.querySelector('.fw-rail-num').textContent = num;
    a.querySelector('.fw-rail-label').textContent = label;
    li.appendChild(a);
    railList.appendChild(li);

    const sec = document.createElement('section');
    sec.className = 'fw-doc-section' + (extraClass ? ' ' + extraClass : '');
    sec.id = id;
    const marker = document.createElement('div');
    marker.className = 'fw-doc-marker';
    marker.innerHTML = '<span class="fw-doc-marker-num" aria-hidden="true"></span><span class="fw-doc-marker-label"></span>';
    marker.querySelector('.fw-doc-marker-num').textContent = num;
    marker.querySelector('.fw-doc-marker-label').textContent = label;
    sec.appendChild(marker);

    nodes.forEach(n => {
      if (!n) return;
      n.style.display = '';
      n.classList.add('active');
      sec.appendChild(n);
    });

    track.appendChild(sec);
    sections.push({ id, link: a, sec, label });
  };

  // ---- The opening cover: lead-in + 15-second summary + hero visual ----
  // Composing these into the first panel both reclaims the header's height and
  // turns the once-empty "At a glance" stage into a deliberate title card.
  // Order is lead → hero → summary: the one-line essence opens, the signature
  // visual is the centrepiece (so it stays above the fold even for tall
  // diagrams), and the 15-second summary trails as supporting detail.
  const glanceContent = [];
  if (hasCover) {
    // For a forced cover with no hero/TL;DR (comparison guides), lead with a
    // large category mark so the opening reads as a composed title card rather
    // than a stray line of subtitle.
    if (forceCover && glanceNodes.length === 0 && !tldr && glyph) {
      const mark = document.createElement('div');
      mark.className = 'fw-doc-cover-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = glyph;
      glanceContent.push(mark);
    }
    if (subtitle) {
      subtitle.classList.add('fw-doc-subtitle', 'fw-doc-lead');
      glanceContent.push(subtitle);
    }
    glanceContent.push(...glanceNodes);
    if (tldr) {
      const tldrWrap = document.createElement('div');
      tldrWrap.className = 'fw-doc-tldr';
      tldrWrap.appendChild(tldr);
      glanceContent.push(tldrWrap);
    }
  }

  const hasGlance = glanceContent.length > 0;
  if (hasGlance) {
    addSection(`sec-${slug}-glance`, '★', 'At a glance', glanceContent, 'fw-doc-glance');
  }

  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;
    // Headerless comparison-guide sections get the same editorial header every
    // framework section carries (no-op where a real .sec-title already exists).
    ensureSectionHeader(panel, step.label);
    addSection(`sec-${slug}-${i}`, step.num, step.label, [panel]);
  });

  // ---- Deck controls: prev · progress dots · next ----
  const controls = document.createElement('div');
  controls.className = 'fw-deck-controls';
  controls.innerHTML = `
    <button class="fw-deck-btn fw-deck-prev" type="button" aria-label="Previous section">
      <span class="fw-deck-btn-ic" aria-hidden="true">&#8592;</span>
      <span class="fw-deck-btn-tx">Back</span>
    </button>
    <div class="fw-deck-progress">
      <span class="fw-deck-count" aria-live="polite"><span class="fw-deck-cur">1</span> <span class="fw-deck-sep">/</span> <span class="fw-deck-total">${sections.length}</span></span>
    </div>
    <button class="fw-deck-btn fw-deck-next" type="button" aria-label="Next section">
      <span class="fw-deck-btn-tx">Next</span>
      <span class="fw-deck-btn-ic" aria-hidden="true">&#8594;</span>
    </button>
  `;
  deck.appendChild(controls);

  body.appendChild(rail);
  body.appendChild(main);
  doc.appendChild(body);

  // ---- Hide the original chrome; everything meaningful now lives in `doc` ----
  if (journeyNav) journeyNav.style.display = 'none';
  if (header) header.style.display = 'none';
  if (pageHeader) pageHeader.style.display = 'none';
  if (fwContainer) fwContainer.style.display = 'none';

  fwPage.prepend(doc);
  fwPage.classList.add('doc-mode', 'deck-mode');

  const appContent = container.closest('.app-content');
  appContent?.setAttribute('data-mode', 'deck');

  // ===== DECK CONTROLLER =====
  if (!sections.length) return;

  const prevBtn = controls.querySelector('.fw-deck-prev');
  const nextBtn = controls.querySelector('.fw-deck-next');
  const curEl = controls.querySelector('.fw-deck-cur');
  const barFill = bar.querySelector('.fw-deck-bar-fill');

  let index = 0;
  const isLive = () => document.body.contains(doc);

  // ===== STAGE HEIGHT SYNC =====
  // The viewport height tracks the *active* panel's natural content height,
  // clamped to the room the stage offers. This is what dissolves the dead
  // space (short panels hug their content and centre in the stage) and the
  // nested-scroll cramping (only a panel that genuinely overflows the stage
  // scrolls within itself). The CSS transition on the viewport height turns
  // every page-turn into a smooth morph alongside the horizontal slide.
  let syncing = false;
  const measureNatural = (sec) => {
    // Read the content's true height with any cap temporarily lifted.
    const pm = sec.style.maxHeight, po = sec.style.overflowY;
    sec.style.maxHeight = 'none';
    sec.style.overflowY = 'visible';
    const h = sec.scrollHeight;
    sec.style.maxHeight = pm;
    sec.style.overflowY = po;
    return h;
  };
  const syncHeight = () => {
    const active = sections[index]?.sec;
    if (!active || !stage) return;
    const avail = stage.clientHeight;
    if (!avail) return;
    syncing = true;
    const natural = measureNatural(active);
    const capped = natural > avail;
    viewport.style.height = Math.min(natural, avail) + 'px';
    sections.forEach((s, i) => {
      const isActiveCapped = i === index && capped;
      s.sec.style.maxHeight = isActiveCapped ? avail + 'px' : '';
      s.sec.style.overflowY = isActiveCapped ? 'auto' : '';
      s.sec.classList.toggle('is-capped', isActiveCapped);
    });
    requestAnimationFrame(() => { syncing = false; });
  };

  const render = () => {
    track.style.transform = `translateX(${-index * 100}%)`;
    sections.forEach((s, i) => {
      const on = i === index;
      s.link.classList.toggle('active', on);
      if (on) s.link.setAttribute('aria-current', 'true');
      else s.link.removeAttribute('aria-current');
      s.sec.classList.toggle('is-active', on);
      s.sec.setAttribute('aria-hidden', String(!on));
    });
    curEl.textContent = String(index + 1);
    barFill.style.transform = `scaleX(${(index + 1) / sections.length})`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === sections.length - 1;
    syncHeight();
  };

  const goToIndex = (i) => {
    index = Math.max(0, Math.min(sections.length - 1, i));
    render();
    // Each panel scrolls within its own stage — start a freshly-shown one at
    // the top so every section is read from its beginning.
    const active = sections[index]?.sec;
    if (active) active.scrollTo ? active.scrollTo({ top: 0 }) : (active.scrollTop = 0);
    sections[index]?.link.scrollIntoView({ block: 'nearest', inline: 'center' });
  };

  // Rail + dots → jump
  rail.addEventListener('click', (e) => {
    const link = e.target.closest('.fw-rail-link');
    if (!link) return;
    e.preventDefault();
    const i = sections.findIndex(s => s.id === link.dataset.target);
    if (i >= 0) goToIndex(i);
  });
  prevBtn.addEventListener('click', () => goToIndex(index - 1));
  nextBtn.addEventListener('click', () => goToIndex(index + 1));

  // Keyboard ← / → (ignored while typing in a field). Self-detaches once the
  // deck leaves the DOM so it never hijacks a later page.
  const onKey = (e) => {
    if (!document.body.contains(doc)) { document.removeEventListener('keydown', onKey); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')
      || document.activeElement?.isContentEditable;
    if (typing) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goToIndex(index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goToIndex(index - 1); }
  };
  document.addEventListener('keydown', onKey);

  // Touch / pen swipe between sections (horizontal intent only — vertical
  // gestures still scroll a tall panel).
  let sx = 0, sy = 0, swiping = false;
  viewport.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    sx = e.clientX; sy = e.clientY; swiping = true;
  });
  viewport.addEventListener('pointerup', (e) => {
    if (!swiping) return; swiping = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      goToIndex(index + (dx < 0 ? 1 : -1));
    }
  });

  // Keep the stage matched to its panel as the window resizes, fonts settle,
  // or an interactive widget inside a panel changes height. The `syncing` guard
  // prevents our own height writes from re-triggering the observer in a loop;
  // all listeners self-detach once the deck leaves the DOM.
  let ro = null;
  const cleanup = () => {
    window.removeEventListener('resize', onResize);
    ro?.disconnect();
  };
  const onResize = () => {
    if (!isLive()) { cleanup(); return; }
    syncHeight();
  };
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => {
      if (syncing) return;
      if (!isLive()) { cleanup(); return; }
      syncHeight();
    });
    ro.observe(stage);
    sections.forEach((s) => ro.observe(s.sec));
  }
  window.addEventListener('resize', onResize);
  // A couple of late re-syncs catch web-font swaps and script-built widgets
  // that finish laying out after the first paint.
  window.addEventListener('load', () => { if (isLive()) syncHeight(); });
  setTimeout(() => { if (isLive()) syncHeight(); }, 350);

  // ---- Preserve original goTo/go globals (now switch the deck) ----
  const glanceOffset = hasGlance ? 1 : 0;
  window.goTo = (id) => {
    if (!isLive()) return;
    const idx = panels.findIndex(p => p && p.id === id);
    if (idx >= 0) goToIndex(idx + glanceOffset);
  };
  window.go = (idx) => {
    if (!isLive()) return;
    goToIndex(idx + glanceOffset);
  };

  // ---- Initial section (honour deep link) ----
  const start = (initialStep != null && initialStep >= 0 && initialStep < steps.length)
    ? initialStep + glanceOffset : 0;
  index = start;
  requestAnimationFrame(render);
}
