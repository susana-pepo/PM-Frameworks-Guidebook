import { comparisonGuides, getCategory } from '../data/frameworks.js';
import { extractAndCleanCSS, injectStyles } from '../utils/style-injector.js';

// Cache loaded comparison content — stores { html, css }
const contentCache = new Map();

export async function renderComparePage(container, breadcrumb, slug) {
  const guide = comparisonGuides.find(cg => cg.slug === slug);
  if (!guide) {
    container.innerHTML = '<p>Comparison guide not found.</p>';
    return;
  }

  const cat = getCategory(guide.category);

  breadcrumb.innerHTML = `
    <a href="#/">Dashboard</a>
    <span class="sep">›</span>
    <a href="#/category/${cat.id}">${cat.name}</a>
    <span class="sep">›</span>
    <span class="current">Compare</span>
  `;

  container.innerHTML = `
    <div style="text-align:center;padding:var(--space-16) 0;color:var(--text-tertiary);">
      <div style="font-size:36px;margin-bottom:var(--space-3);">⚖️</div>
      <p>Loading comparison guide...</p>
    </div>
  `;

  try {
    const { html, css } = await loadCompareContent(guide.sourceFile);

    // Inject comparison-specific styles (cleaned of globals + font overrides)
    injectStyles(css);

    container.innerHTML = `<div class="fw-page compare-page" data-category="${cat.id}" style="--accent-color:${cat.color};">
      <div class="fw-page-header">
        <div class="fw-category-badge" style="background:${cat.colorLight};color:${cat.color};">${cat.emoji} ${cat.name}</div>
      </div>
      ${html}
    </div>`;
    // Strip leading emojis from H1 — the SPA badge already shows the emoji
    stripLeadingEmoji(container);

    executeScripts(container);
  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center;padding:var(--space-16) 0;">
        <p style="color:var(--color-error);">Failed to load comparison guide.</p>
        <p style="font-size:var(--text-sm);color:var(--text-tertiary);">${err.message}</p>
      </div>
    `;
  }
}

async function loadCompareContent(sourceFile) {
  if (contentCache.has(sourceFile)) {
    return contentCache.get(sourceFile);
  }

  const response = await fetch(`/${sourceFile}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const fullHtml = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(fullHtml, 'text/html');

  // Extract and clean CSS BEFORE removing style elements
  const css = extractAndCleanCSS(doc);

  // Remove the <style> tags from the DOM (CSS text already extracted)
  doc.querySelectorAll('style').forEach(el => el.remove());

  const bodyContent = doc.body.innerHTML;
  const scripts = [];
  doc.querySelectorAll('script').forEach(script => {
    scripts.push(script.textContent);
  });

  const cleanBody = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');
  const html = cleanBody + scripts.map(s =>
    `<script type="text/framework-script">${s}</script>`
  ).join('');

  const result = { html, css };
  contentCache.set(sourceFile, result);
  return result;
}

function executeScripts(container) {
  const globalEval = (0, eval);
  const scripts = container.querySelectorAll('script[type="text/framework-script"]');
  scripts.forEach(oldScript => {
    const code = oldScript.textContent;
    oldScript.remove();
    if (code.trim()) {
      try {
        globalEval(code);
      } catch (err) {
        console.warn('Comparison guide script error:', err.message);
      }
    }
  });
}

/**
 * Strip leading emoji characters from the H1 heading.
 * The SPA-rendered category badge already shows the emoji,
 * so duplicating it in the title is redundant.
 */
function stripLeadingEmoji(container) {
  const h1 = container.querySelector('.header h1');
  if (!h1) return;

  h1.textContent = h1.textContent.replace(
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D\uFE0F]+\s*/u,
    ''
  );
}
