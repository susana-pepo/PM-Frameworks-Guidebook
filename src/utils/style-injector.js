/**
 * Style Injector Utility
 *
 * Extracts CSS from original framework HTML files, cleans out
 * global selectors (already handled by our design system), replaces
 * neo-brutalist font references, and injects/removes the styles
 * dynamically as frameworks are loaded and unloaded.
 */

const INJECTED_STYLE_ID = 'fw-injected-styles';

/* ============================================================
   CONTENT ELEVATION
   The 30 source files were authored as a neo-brutalist sticker
   sheet: ~1,650 inline declarations set body copy at 10–13px and
   18 files paint decorative `border-left` accent stripes. Tokens
   (tokens.css) already remap the legacy palette to the editorial
   system, but they cannot reach literal `font-size:12px` or a
   hard-coded stripe baked into a `style=""` attribute. These
   helpers lift readability to e-learning standards (legible body
   type, no side-stripes) centrally — every framework benefits at
   once, no per-file rewrite.
   ============================================================ */

/**
 * Lift a single px value toward a readable floor.
 * Body copy (10–14px) climbs to 14.5–15px; micro labels (≤9px)
 * climb to a still-small-but-legible 11.5–12px; anything already
 * 15px+ (headings, display numbers) is left untouched so hierarchy
 * and tuned diagram type are preserved.
 *
 * @param {number} n — original size in px
 * @returns {number} lifted size in px
 */
function liftPx(n) {
  if (n >= 15) return n;
  if (n <= 8) return 11.5;
  const map = { 9: 12, 10: 12.5, 11: 13.5, 12: 14.5, 13: 15, 14: 15 };
  return map[n] != null ? map[n] : n;
}

/**
 * Lift every `font-size:Npx` occurrence in a CSS / inline-style /
 * JS string using liftPx. Leaves rem/em/% and var() sizes alone.
 *
 * @param {string} text
 * @returns {string}
 */
export function liftFontSizesInText(text) {
  if (!text) return text;
  return text.replace(
    /font-size\s*:\s*(\d+(?:\.\d+)?)px/gi,
    (m, px) => `font-size:${liftPx(parseFloat(px))}px`
  );
}

/**
 * Remove a `font-size` declaration from an inline style string.
 *
 * Headings (h1–h6) in the source files carry hard-coded inline sizes
 * (e.g. `font-size:17px`) that win over the design system's type scale
 * on specificity — leaving a "sub-head" rendering *smaller* than the
 * 18px reading prose it introduces, and every file picking its own
 * heading sizes. Dropping the inline size hands heading sizing back to
 * the central scale so hierarchy is consistent across all 30 documents.
 * Other inline props (font-family, margin, colour) are preserved.
 *
 * @param {string} text — an inline style attribute value
 * @returns {string}
 */
export function stripInlineFontSize(text) {
  if (!text) return text;
  return text
    .replace(/font-size\s*:\s*[^;]+;?/gi, '')
    .replace(/;\s*;/g, ';')
    .replace(/^\s*;\s*/, '')
    .trim();
}

/* The legacy source files paint figure cards with hard-coded pastel fills
   (background:var(--sky) / #DBEAFE …) chosen per-card, with no class for any
   stylesheet rule to reach — so a flat sky-blue card lands on a terracotta
   Strategy page, off the category palette and louder than the calm vellum the
   newer files use. Map each legacy pastel to a quiet tint of the *page's*
   --accent-color so every figure reads as inset paper of the same hue family.
   Distinct mix strengths per pastel keep a grid of differently-tinted cards
   visually varied (tonal steps in one hue, not one flat wash). Neutral paper
   (--cream/--cream-dark), semantic --color-* fills, gradients and plain
   white/black are deliberately absent from the map, so they pass through
   untouched — and because we only rewrite `background`, any `color:`/`border:`
   use of the same token is never affected. */
const PASTEL_BG_MIX = {
  '--sky': 9,  '--p1': 9,  '#dbeafe': 9,
  '--mint': 13, '--green': 13, '--p2': 13, '#d1fae5': 13,
  '--yellow': 7, '--p3': 7,  '#fef3c7': 7,
  '--orange': 11, '--p4': 11, '#ffedd5': 11,
  '--rose': 15, '#ffe4e6': 15,
  '--pink': 6,  '--p5': 6,  '#fce7f3': 6,
  '--purple': 17, '#ede8ff': 17,
};

/**
 * Rewrite a flat pastel `background` in an inline style to a calm tint of the
 * page category accent. Only a single token/hex fill is matched (gradients and
 * compound backgrounds are left alone); the rest of the style string — padding,
 * radius, border, colour — is preserved.
 *
 * @param {string} text — an inline style attribute value
 * @returns {string}
 */
export function harmonizeBackground(text) {
  if (!text || !/background/i.test(text)) return text;
  return text.replace(
    /background(?:-color)?\s*:\s*(var\(\s*--[a-z0-9]+\s*\)|#[0-9a-fA-F]{3,8})(\s*!important)?/gi,
    (m, value, bang) => {
      const key = value.startsWith('#')
        ? value.toLowerCase()
        : (value.match(/--[a-z0-9]+/i) || [''])[0].toLowerCase();
      const pct = PASTEL_BG_MIX[key];
      if (pct == null) return m;
      return `background:color-mix(in oklab, var(--accent-color) ${pct}%, var(--bg-card))${bang || ''}`;
    }
  );
}

/* Reading-prose selectors — the exact elements framework-page.css sets to the
   18px Literata reading scale. Legacy files pin these to per-file inline sizes
   (font-size:13px …) that win on specificity, so the same paragraph reads 15px
   on one page and 18px on another. Stripping the inline size on just these
   flow-text carriers hands them back to the shared scale; small captions inside
   figure cards (not matched here) keep their tuned size via the floor lift. */
const PROSE_SELECTOR =
  ':is(.c-card, .c-card-static, .section, .panel) > p,' +
  ':is(.c-card, .c-card-static) li,' +
  ':is(.insight, .tip) p, :is(.insight, .tip) li';

/**
 * Remove decorative left/right accent stripes (the most overused
 * "design touch" — a thick coloured side border). We target only
 * stripes whose colour is one of the legacy pastel fills or a hex
 * literal, so structural dividers (`var(--border)`) and CSS
 * triangles (`...solid transparent`, used for arrows) are left
 * intact.
 *
 * @param {string} text — CSS text or an inline style attribute value
 * @returns {string}
 */
export function stripDecorativeStripes(text) {
  if (!text) return text;
  return text.replace(
    /border-(?:left|right)\s*:\s*\d+px\s+solid\s+(?:var\(--(?:sky|mint|mint-deep|yellow|purple|orange|rose|pink|green|s[1-7]|l[1-5]|p[1-5])\)|#[0-9a-fA-F]{3,8})\s*;?/gi,
    ''
  );
}

/**
 * Extract CSS text from a parsed HTML document, filter out
 * dangerous global selectors, and replace Lilita One font
 * references with the design system font stack.
 *
 * @param {Document} doc — A DOMParser-parsed document
 * @returns {string} Cleaned CSS text (empty string if no styles)
 */
export function extractAndCleanCSS(doc) {
  const styleEls = doc.querySelectorAll('style');
  if (styleEls.length === 0) return '';

  let css = '';
  styleEls.forEach(el => {
    css += el.textContent + '\n';
  });

  // Remove :root { ... } blocks — tokens.css handles all custom properties
  css = css.replace(/:root\s*\{[^}]*\}/g, '');

  // Remove * { ... } universal reset — reset.css handles this
  css = css.replace(/\*\s*\{[^}]*\}/g, '');

  // Remove body { ... } rules — base.css / app shell handles this
  css = css.replace(/body\s*\{[^}]*\}/g, '');

  // Remove html { ... } rules
  css = css.replace(/html\s*\{[^}]*\}/g, '');

  // Replace Lilita One font references with display font (headings/titles)
  // Covers all quote/spacing variants found across the 30 HTML files
  css = css.replaceAll("'Lilita One',sans-serif", 'var(--font-display)');
  css = css.replaceAll("'Lilita One', sans-serif", 'var(--font-display)');
  css = css.replaceAll('"Lilita One",sans-serif', 'var(--font-display)');
  css = css.replaceAll('"Lilita One", sans-serif', 'var(--font-display)');
  css = css.replaceAll("'Lilita One'", 'var(--font-display)');
  css = css.replaceAll('"Lilita One"', 'var(--font-display)');

  // Also replace Outfit (body font from originals) with our sans font
  css = css.replaceAll("'Outfit',sans-serif", 'var(--font-sans)');
  css = css.replaceAll("'Outfit', sans-serif", 'var(--font-sans)');
  css = css.replaceAll("'Outfit'", 'var(--font-sans)');

  // Fix contrast: .header h1 uses color:var(--white) which is white text.
  // On category-colored backgrounds this is unreadable. Replace with
  // --text-primary which is always the correct readable text color.
  css = css.replace(
    /\.header\s+h1\s*\{([^}]*?)color:\s*var\(--white\)/g,
    '.header h1{$1color:var(--text-primary)'
  );

  // Fix .header p.sub using rgba(255,255,255,.85) — replace with --text-secondary
  css = css.replace(
    /color:\s*rgba\(255\s*,\s*255\s*,\s*255\s*,\s*\.?85\)/g,
    'color:var(--text-secondary)'
  );

  // Remove decorative side-stripes declared inside the file's own CSS rules
  // (most live in inline styles, handled by normalizeContent, but a few files
  // declare them at the class level).
  css = stripDecorativeStripes(css);

  return css.trim();
}

/**
 * Inject cleaned CSS into a <style> element in <head>.
 * Inserts at the beginning of <head> so that Vite-bundled CSS
 * (framework-page.css) loads after and wins for shared selectors.
 * Removes any previously injected styles first.
 *
 * @param {string} css — Cleaned CSS text to inject
 */
export function injectStyles(css) {
  removeInjectedStyles();

  if (!css) return;

  const styleEl = document.createElement('style');
  styleEl.id = INJECTED_STYLE_ID;
  styleEl.textContent = css;

  // Insert at the beginning of <head> so design system CSS
  // (loaded later by Vite) takes precedence for shared selectors
  const head = document.head;
  head.insertBefore(styleEl, head.firstChild);
}

/**
 * Remove any previously injected framework styles.
 * Called when navigating away from framework/compare pages,
 * or automatically before injecting new styles.
 */
export function removeInjectedStyles() {
  const existing = document.getElementById(INJECTED_STYLE_ID);
  if (existing) {
    existing.remove();
  }
}

/**
 * Font replacement map for inline styles and script strings.
 * Covers all quote/spacing variants found across 31 HTML source files.
 */
const FONT_REPLACEMENTS = [
  // Lilita One → display font
  ["'Lilita One',sans-serif", 'var(--font-display)'],
  ["'Lilita One', sans-serif", 'var(--font-display)'],
  ['"Lilita One",sans-serif', 'var(--font-display)'],
  ['"Lilita One", sans-serif', 'var(--font-display)'],
  ["'Lilita One'", 'var(--font-display)'],
  ['"Lilita One"', 'var(--font-display)'],
  // Outfit → sans font
  ["'Outfit',sans-serif", 'var(--font-sans)'],
  ["'Outfit', sans-serif", 'var(--font-sans)'],
  ["'Outfit'", 'var(--font-sans)'],
  ['"Outfit",sans-serif', 'var(--font-sans)'],
  ['"Outfit", sans-serif', 'var(--font-sans)'],
  ['"Outfit"', 'var(--font-sans)'],
];

/**
 * Clean inline font-family references in all DOM elements under root.
 * The original HTML files use inline style="font-family:'Lilita One'..."
 * on ~480 elements. extractAndCleanCSS() only handles <style> blocks,
 * so this function walks the live DOM and fixes inline styles.
 *
 * Also cleans SVG font-family presentation attributes (e.g. Kano Model's
 * <text font-family="Lilita One"> elements).
 *
 * @param {HTMLElement} root — Container to walk (e.g. .fw-page)
 */
export function cleanInlineFonts(root) {
  if (!root) return;

  // 1. Clean inline style="" attributes
  const els = root.querySelectorAll('[style]');
  els.forEach(el => {
    const style = el.getAttribute('style');
    if (!style || !style.includes('font-family')) return;

    let cleaned = style;
    for (const [from, to] of FONT_REPLACEMENTS) {
      cleaned = cleaned.replaceAll(from, to);
    }

    if (cleaned !== style) {
      el.setAttribute('style', cleaned);
    }
  });

  // 2. Clean SVG font-family presentation attributes
  //    SVG <text> elements use font-family="Lilita One" (not inside style="")
  const svgEls = root.querySelectorAll('[font-family]');
  svgEls.forEach(el => {
    const ff = el.getAttribute('font-family');
    if (!ff) return;

    let replacement = null;
    if (ff.includes('Lilita')) {
      replacement = 'Clash Display, Inter, sans-serif';
    } else if (ff.includes('Outfit')) {
      replacement = 'Inter, system-ui, sans-serif';
    }

    if (replacement) {
      el.setAttribute('font-family', replacement);
    }
  });
}

/* Diagram canvases whose type is hand-placed to fit a fixed-size figure
   (maps, matrices, curves, scatter plots). Text inside them is laid out by
   pixel, so bumping it up overflows nodes and collides labels — we leave it
   exactly as authored. The absolute-position check below catches the rest. */
const DIAGRAM_SELECTOR =
  '.map-hero,.map-canvas,.map-body,.map-backbone,.matrix-hero,.matrix-mini,' +
  '.curve-box,.curve-canvas,.kano-hero,.circles-hero,.phase-hero,' +
  '.anatomy-diagram,.plot,.plot-bg,.plot-grid,.scatter,.diagram';

/**
 * Is this element part of a fixed-layout diagram (so its font size must be
 * left alone)? True when the element — or any ancestor up to root — is
 * absolutely positioned or matches a known diagram canvas.
 */
function inFixedDiagram(el, root) {
  let cur = el;
  while (cur && cur !== root) {
    const st = cur.getAttribute && cur.getAttribute('style');
    if (st && /position\s*:\s*absolute/i.test(st)) return true;
    if (cur.matches && cur.matches(DIAGRAM_SELECTOR)) return true;
    cur = cur.parentElement;
  }
  return false;
}

/**
 * Elevate loaded framework content to e-learning readability.
 *
 * Walks every element carrying an inline `style=""` and:
 *   1. Lifts hard-coded tiny font sizes to a legible floor (the
 *      single biggest "not usable" complaint — body copy authored
 *      at 10–13px). Skipped inside fixed-layout diagrams, whose text
 *      is positioned by pixel and would collide if enlarged.
 *   2. Removes decorative left/right accent stripes (a banned
 *      pattern) while leaving CSS triangles and structural borders.
 *      Applied everywhere — stripes never carry diagram meaning.
 *
 * Runs after cleanInlineFonts(), on the live DOM, before the
 * reading document is assembled — so it covers comparison tables and
 * every per-file widget uniformly.
 *
 * Note: SVG <text> elements use a `font-size` *attribute* (not a
 * style declaration), so they are inherently untouched here.
 *
 * @param {HTMLElement} root — Container to walk (e.g. .fw-page)
 */
export function normalizeContent(root) {
  if (!root) return;

  const els = root.querySelectorAll('[style]');
  els.forEach(el => {
    const style = el.getAttribute('style');
    if (!style) return;

    let cleaned = style;
    if (/font-size\s*:\s*\d/.test(cleaned) && !inFixedDiagram(el, root)) {
      // Headings and flowing prose hand their sizing back to the central type
      // scale (so a sub-head never renders smaller than the prose it
      // introduces, and the same paragraph reads at one size everywhere); all
      // other body copy keeps its tiny-size floor lift. Both skip diagrams.
      cleaned = (/^H[1-6]$/.test(el.tagName) || (el.matches && el.matches(PROSE_SELECTOR)))
        ? stripInlineFontSize(cleaned)
        : liftFontSizesInText(cleaned);
    }
    if (/background/i.test(cleaned) && !inFixedDiagram(el, root)) {
      // Harmonize hard-coded pastel figure fills to the page category accent.
      cleaned = harmonizeBackground(cleaned);
    }
    if (/border-(?:left|right)\s*:/.test(cleaned)) {
      cleaned = stripDecorativeStripes(cleaned);
    }

    if (cleaned !== style) {
      el.setAttribute('style', cleaned);
    }
  });
}

/**
 * Clean font references in a JavaScript source string before eval.
 * Some HTML files generate DOM dynamically via onclick handlers and
 * interactive tools. Their JS strings contain escaped font-family
 * references like font-family:\\'Lilita One\\',sans-serif that need
 * to be replaced so dynamically created elements use design system fonts.
 *
 * @param {string} code — JavaScript source code
 * @returns {string} Cleaned code with font references replaced
 */
export function cleanScriptFonts(code) {
  if (!code) return code;

  let cleaned = code;

  // Replace escaped single-quote variants (inside JS strings):
  //   font-family:\'Lilita One\',sans-serif
  cleaned = cleaned.replaceAll("\\'Lilita One\\',sans-serif", "var(--font-display)");
  cleaned = cleaned.replaceAll("\\'Lilita One\\', sans-serif", "var(--font-display)");
  cleaned = cleaned.replaceAll("\\'Lilita One\\'", "var(--font-display)");

  cleaned = cleaned.replaceAll("\\'Outfit\\',sans-serif", "var(--font-sans)");
  cleaned = cleaned.replaceAll("\\'Outfit\\', sans-serif", "var(--font-sans)");
  cleaned = cleaned.replaceAll("\\'Outfit\\'", "var(--font-sans)");

  // Replace regular quote variants (inside template literals or double-quoted strings):
  for (const [from, to] of FONT_REPLACEMENTS) {
    cleaned = cleaned.replaceAll(from, to);
  }

  // Lift tiny font sizes baked into dynamically-generated markup (quiz cards,
  // OKR/RICE builders, score tables) so JS-rendered content reads as well as
  // the static content normalised by normalizeContent().
  cleaned = liftFontSizesInText(cleaned);

  // Harmonize hard-coded pastel fills baked into the same generated markup
  // (builder result cards, story-map cells) to the page category accent, so a
  // widget that paints itself on interaction matches the static content. Each
  // pastel maps to a distinct tint strength, so multi-cell widgets keep their
  // visual distinction as tonal steps in one hue.
  cleaned = harmonizeBackground(cleaned);

  return cleaned;
}
