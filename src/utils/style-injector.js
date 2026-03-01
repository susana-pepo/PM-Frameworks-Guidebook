/**
 * Style Injector Utility
 *
 * Extracts CSS from original framework HTML files, cleans out
 * global selectors (already handled by our design system), replaces
 * neo-brutalist font references, and injects/removes the styles
 * dynamically as frameworks are loaded and unloaded.
 */

const INJECTED_STYLE_ID = 'fw-injected-styles';

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

  // Replace Lilita One font references with design system font
  // Covers all quote/spacing variants found across the 30 HTML files
  css = css.replaceAll("'Lilita One',sans-serif", 'var(--font-sans)');
  css = css.replaceAll("'Lilita One', sans-serif", 'var(--font-sans)');
  css = css.replaceAll('"Lilita One",sans-serif', 'var(--font-sans)');
  css = css.replaceAll('"Lilita One", sans-serif', 'var(--font-sans)');
  css = css.replaceAll("'Lilita One'", 'var(--font-sans)');
  css = css.replaceAll('"Lilita One"', 'var(--font-sans)');

  // Also replace Outfit (body font from originals) with our sans font
  css = css.replaceAll("'Outfit',sans-serif", 'var(--font-sans)');
  css = css.replaceAll("'Outfit', sans-serif", 'var(--font-sans)');
  css = css.replaceAll("'Outfit'", 'var(--font-sans)');

  // Fix dark mode: .header h1 uses color:var(--white) which inverts to
  // near-black in dark mode. Replace with --text-primary which is always
  // the correct readable text color for the current theme.
  css = css.replace(
    /\.header\s+h1\s*\{([^}]*?)color:\s*var\(--white\)/g,
    '.header h1{$1color:var(--text-primary)'
  );

  // Fix .header p.sub using rgba(255,255,255,.85) — replace with --text-secondary
  css = css.replace(
    /color:\s*rgba\(255\s*,\s*255\s*,\s*255\s*,\s*\.?85\)/g,
    'color:var(--text-secondary)'
  );

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
