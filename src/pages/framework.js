import { getFramework, getCategory } from '../data/frameworks.js';
import { extractAndCleanCSS, injectStyles, cleanInlineFonts, cleanScriptFonts } from '../utils/style-injector.js';

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
        <div class="fw-category-badge">${cat.emoji} ${cat.name}</div>
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

    // Execute any inline scripts from the loaded content
    executeScripts(container);

    // Rebuild the raw content into the editorial reading document
    buildReadingDocument(container, { slug, emoji: fw.emoji, title: fw.name, initialStep });
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
  const { slug, emoji, title, initialStep, wide = false } = opts;
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
  doc.className = 'fw-doc' + (wide ? ' is-wide' : '');
  // --accent-color / --accent-light are inherited from .fw-page's inline style.

  // ---- Header band ----
  const head = document.createElement('header');
  head.className = 'fw-doc-header';

  const ident = document.createElement('div');
  ident.className = 'fw-doc-ident';

  if (emoji) {
    const tile = document.createElement('span');
    tile.className = 'fw-doc-emoji';
    tile.setAttribute('aria-hidden', 'true');
    tile.textContent = emoji;
    ident.appendChild(tile);
  }

  const identText = document.createElement('div');
  identText.className = 'fw-doc-ident-text';
  if (badge) identText.appendChild(badge);
  const titleEl = document.createElement('h1');
  titleEl.className = 'fw-doc-title';
  titleEl.textContent = title || header?.querySelector('h1')?.textContent?.trim() || slug;
  identText.appendChild(titleEl);
  if (subtitle) {
    subtitle.classList.add('fw-doc-subtitle');
    identText.appendChild(subtitle);
  }
  ident.appendChild(identText);
  head.appendChild(ident);

  if (tldr) {
    const tldrWrap = document.createElement('div');
    tldrWrap.className = 'fw-doc-tldr';
    tldrWrap.appendChild(tldr);
    head.appendChild(tldrWrap);
  }

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

  const main = document.createElement('div');
  main.className = 'fw-doc-main';

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

    main.appendChild(sec);
    sections.push({ id, link: a, sec });
  };

  if (glanceNodes.length) {
    addSection(`sec-${slug}-glance`, '★', 'At a glance', glanceNodes, 'fw-doc-glance');
  }

  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;
    addSection(`sec-${slug}-${i}`, step.num, step.label, [panel]);
  });

  body.appendChild(rail);
  body.appendChild(main);
  doc.appendChild(body);

  // ---- Hide the original chrome; everything meaningful now lives in `doc` ----
  if (journeyNav) journeyNav.style.display = 'none';
  if (header) header.style.display = 'none';
  if (pageHeader) pageHeader.style.display = 'none';
  if (fwContainer) fwContainer.style.display = 'none';

  fwPage.prepend(doc);
  fwPage.classList.add('doc-mode');

  // ---- Scroll-spy: highlight the section currently under the header ----
  const scroller = container.closest('.app-content') || document.scrollingElement;
  const setActive = (id) => {
    sections.forEach(s => {
      const on = s.id === id;
      s.link.classList.toggle('active', on);
      if (on) s.link.setAttribute('aria-current', 'true');
      else s.link.removeAttribute('aria-current');
    });
  };

  if (sections.length) {
    setActive(sections[0].id);
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { root: scroller, rootMargin: '-76px 0px -62% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s.sec));
  }

  // ---- Rail click → smooth scroll to section ----
  rail.addEventListener('click', (e) => {
    const link = e.target.closest('.fw-rail-link');
    if (!link) return;
    e.preventDefault();
    const target = document.getElementById(link.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(target.id);
    }
  });

  // ---- Preserve original goTo/go globals (now scroll instead of toggle) ----
  const isLive = () => document.body.contains(doc);
  window.goTo = (id) => {
    if (!isLive()) return;
    const idx = panels.findIndex(p => p && p.id === id);
    const target = idx >= 0 ? document.getElementById(`sec-${slug}-${idx}`) : null;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.go = (idx) => {
    if (!isLive()) return;
    document.getElementById(`sec-${slug}-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ---- Deep link: jump to a requested section on load ----
  if (initialStep != null && initialStep >= 0 && initialStep < steps.length) {
    requestAnimationFrame(() => {
      document.getElementById(`sec-${slug}-${initialStep}`)?.scrollIntoView({ block: 'start' });
    });
  }
}
