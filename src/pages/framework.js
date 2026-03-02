import { getFramework, getCategory } from '../data/frameworks.js';
import { extractAndCleanCSS, injectStyles, cleanInlineFonts, cleanScriptFonts } from '../utils/style-injector.js';

/**
 * Framework page renderer.
 * Loads the original HTML source file, extracts the body content,
 * reinjects cleaned CSS (with neo-brutalist overrides stripped),
 * and injects it into the content area with the original JS preserved.
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
    <div style="text-align:center;padding:var(--space-16) 0;color:var(--text-tertiary);">
      <div style="font-size:36px;margin-bottom:var(--space-3);">${fw.emoji}</div>
      <p>Loading ${fw.name}...</p>
    </div>
  `;

  try {
    const { html, css } = await loadFrameworkContent(fw.sourceFile);

    // Inject framework-specific styles (cleaned of globals + font overrides)
    injectStyles(css);

    container.innerHTML = `<div class="fw-page" data-category="${cat.id}" style="--accent-color:${cat.color};">
      <div class="fw-page-header">
        <div class="fw-category-badge" style="background:${cat.colorLight};color:${cat.color};">${cat.emoji} ${cat.name}</div>
      </div>
      ${html}
    </div>`;

    // Set category on .app-content so page background matches category fill
    const appContent = container.closest('.app-content') || container;
    appContent.setAttribute('data-category', cat.id);

    // Strip leading emojis from H1 — the SPA badge already shows the emoji
    stripLeadingEmoji(container);

    // Clean inline font-family references (480 elements across HTML files)
    cleanInlineFonts(container);

    // Execute any inline scripts from the loaded content
    executeScripts(container);

    // Install accordion system — transforms tabs into collapsed step navigation
    installAccordionSystem(container, slug, initialStep);

    // Install full-bleed hero — wraps header in edge-to-edge category-colored banner
    installFullBleedHero(container);
  } catch (err) {
    container.innerHTML = `
      <div style="text-align:center;padding:var(--space-16) 0;">
        <p style="color:var(--color-error);margin-bottom:var(--space-2);">Failed to load framework content.</p>
        <p style="font-size:var(--text-sm);color:var(--text-tertiary);">${err.message}</p>
      </div>
    `;
  }
}

async function loadFrameworkContent(sourceFile) {
  if (contentCache.has(sourceFile)) {
    return contentCache.get(sourceFile);
  }

  // Fetch the original HTML file
  const response = await fetch(`/${sourceFile}`);
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
 * The SPA-rendered category badge already shows the emoji,
 * so duplicating it in the title is redundant.
 */
function stripLeadingEmoji(container) {
  const h1 = container.querySelector('.header h1');
  if (!h1) return;

  // Match leading emoji sequences (including compound emoji like 🏴‍☠️)
  // followed by optional whitespace
  h1.textContent = h1.textContent.replace(
    /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200D\uFE0F]+\s*/u,
    ''
  );
}

/**
 * Split-screen layout — TWO-COLUMN design:
 *
 * LEFT column (sticky):  Badge + emoji + title + hero visualizer + TLDR
 * RIGHT column:          Persistent window frame containing:
 *                        - Window title bar (macOS dots)
 *                        - Section nav pills inside window
 *                        - Content area (blank until section clicked, then scrollable)
 *
 * The right-side window has a fixed height aligned with the left column
 * and internal scrolling — page does NOT extend. On mobile (<900px)
 * falls back to single-column stacked layout.
 */
function installFullBleedHero(container) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const catId = fwPage.dataset.category;
  if (!catId) return;

  const pageHeader = fwPage.querySelector('.fw-page-header');
  const header = fwPage.querySelector('.header');
  if (!pageHeader && !header) return;

  // Look up the framework emoji from data
  const slug = fwPage.closest('[data-fw-slug]')?.dataset.fwSlug
    || window.location.hash.match(/framework\/([^/]+)/)?.[1];
  const fw = slug ? getFramework(slug) : null;

  // Create full-bleed wrapper
  const heroBleed = document.createElement('div');
  heroBleed.className = 'fw-hero-bleed';
  heroBleed.setAttribute('data-category', catId);

  // ---- SPLIT LAYOUT CONTAINER (two-column grid) ----
  const splitLayout = document.createElement('div');
  splitLayout.className = 'fw-split-layout';

  // ---- LEFT COLUMN: Hero content (sticky) ----
  const leftCol = document.createElement('div');
  leftCol.className = 'fw-split-left';

  // Badge
  if (pageHeader) leftCol.appendChild(pageHeader);

  // Hero content area — emoji + title + visualizer + TLDR
  const heroContent = document.createElement('div');
  heroContent.className = 'fw-hero-content';

  if (fw?.emoji) {
    const emojiEl = document.createElement('div');
    emojiEl.className = 'fw-hero-emoji';
    emojiEl.setAttribute('aria-hidden', 'true');
    emojiEl.textContent = fw.emoji;
    heroContent.appendChild(emojiEl);
  }

  if (header) heroContent.appendChild(header);

  // ---- HERO VISUALIZER ----
  // Find visualizer elements in .container that sit between .header and .journey-nav.
  // These are the framework diagrams, formulas, matrices, etc.
  // Known class names + fallback to any remaining styled divs.
  const fwContainer = fwPage.querySelector('.container, .wrapper');
  if (fwContainer) {
    const vizSelectors = [
      '.formula-bar',      // RICE, ICE
      '.matrix-hero',      // Value-vs-Effort
      '.map-hero',         // User-Story-Mapping
      '.kano-hero',        // Kano Model
      '.curve-box',        // Kano Model
      '.circles-hero',     // CIRCLES
      '.phase-hero',       // Design Thinking
      '.anatomy-diagram',  // User-Story-Mapping
    ];

    // Try known selectors first
    let foundViz = false;
    for (const sel of vizSelectors) {
      const viz = fwContainer.querySelector(sel);
      if (viz) {
        heroContent.appendChild(viz);
        foundViz = true;
      }
    }

    // Fallback: grab any remaining direct children of .container that
    // come BEFORE .journey-nav and are NOT: journey-nav, accordion-nav,
    // footer, progress-bar, one-liner/tldr (already handled), or panels/sections.
    if (!foundViz) {
      const journeyNav = fwContainer.querySelector('.journey-nav');
      const skipClasses = ['journey-nav', 'accordion-nav', 'footer', 'nav-btns',
                           'one-liner', 'tldr-section', 'tldr', 'fw-tldr-card',
                           'progress-bar', 'back-link'];

      const children = Array.from(fwContainer.children);
      const journeyIdx = journeyNav ? children.indexOf(journeyNav) : children.length;

      for (let i = 0; i < journeyIdx; i++) {
        const child = children[i];
        // Skip known non-visualizer elements
        if (skipClasses.some(cls => child.classList.contains(cls))) continue;
        // Skip if it's the header (already moved)
        if (child === header || child.classList.contains('header')) continue;
        // Skip script tags
        if (child.tagName === 'SCRIPT') continue;
        // This is likely a visualizer element — move it
        heroContent.appendChild(child);
        foundViz = true;
      }
    }
  }

  const tldrCard = fwPage.querySelector('.fw-tldr-card');
  if (tldrCard) heroContent.appendChild(tldrCard);

  leftCol.appendChild(heroContent);

  // ---- RIGHT COLUMN: persistent window frame ----
  const rightCol = document.createElement('div');
  rightCol.className = 'fw-split-right';

  // Move the accordion nav (which is now the whole window) into right column
  const accordionNav = fwPage.querySelector('.accordion-nav');
  if (accordionNav) {
    rightCol.appendChild(accordionNav);
  }

  splitLayout.appendChild(leftCol);
  splitLayout.appendChild(rightCol);
  heroBleed.appendChild(splitLayout);

  // Insert at the start of fw-page
  fwPage.prepend(heroBleed);
}

/**
 * Content-type metadata for accordion sections.
 * Maps common step labels to icons, types, and descriptions.
 */
const STEP_META = {
  'Understand': { icon: '📖', type: 'Reading', desc: 'Core concept explained' },
  'Concept': { icon: '📖', type: 'Reading', desc: 'What it is and why it matters' },
  'Score': { icon: '🔢', type: 'Interactive', desc: 'Rate and calculate scores' },
  'Funnel': { icon: '📊', type: 'Reading', desc: 'Visualize the stages' },
  'Factors': { icon: '📖', type: 'Reading', desc: 'The key components' },
  'Components': { icon: '📖', type: 'Reading', desc: 'Building blocks explained' },
  'Forces': { icon: '📖', type: 'Reading', desc: 'The forces at play' },
  'Steps': { icon: '📖', type: 'Reading', desc: 'Step-by-step process' },
  'Stages': { icon: '📖', type: 'Reading', desc: 'The stages of the process' },
  'Quadrants': { icon: '📊', type: 'Reading', desc: 'Map the four quadrants' },
  'Canvas': { icon: '🧩', type: 'Interactive', desc: 'Fill in the canvas' },
  'Metrics': { icon: '📊', type: 'Reading', desc: 'Key metrics to track' },
  'Loops': { icon: '📖', type: 'Reading', desc: 'How growth loops work' },
  'Example': { icon: '📋', type: 'Case Study', desc: 'Real-world application' },
  'Examples': { icon: '📋', type: 'Case Study', desc: 'Real-world examples' },
  'Try It': { icon: '🔧', type: 'Interactive', desc: 'Hands-on practice tool' },
  'Builder': { icon: '🔧', type: 'Builder', desc: 'Build your own analysis' },
  'Analyzer': { icon: '🔧', type: 'Builder', desc: 'Analyze your situation' },
  'Calculator': { icon: '🔧', type: 'Builder', desc: 'Calculate your scores' },
  'Plotter': { icon: '🔧', type: 'Builder', desc: 'Plot on the matrix' },
  'Plot It': { icon: '🔧', type: 'Interactive', desc: 'Map it visually' },
  'Map It': { icon: '🔧', type: 'Interactive', desc: 'Build your map' },
  'When': { icon: '⏰', type: 'Reference', desc: 'When to use — and when not to' },
  'Template': { icon: '🧩', type: 'Template', desc: 'Ready-to-use template' },
  'Pitfalls': { icon: '⚠️', type: 'Tips', desc: 'Common mistakes to avoid' },
  'After': { icon: '🔗', type: 'Reference', desc: 'Next steps and related frameworks' },
  'Session': { icon: '📋', type: 'Guide', desc: 'Run a team session' },
  'Quiz': { icon: '❓', type: 'Quiz', desc: 'Test your understanding' },
  'Toolkit': { icon: '🧰', type: 'Reference', desc: 'Tools and resources' },
  'Deep Dive': { icon: '🔬', type: 'Reading', desc: 'In-depth exploration' },
  'Strategy': { icon: '♟️', type: 'Reading', desc: 'Strategic considerations' },
  'Explore': { icon: '🔍', type: 'Reading', desc: 'Explore the details' },
  'Decide': { icon: '🎯', type: 'Interactive', desc: 'Make your choice' },
};

/** Get step metadata by matching label to known patterns */
function getStepMeta(label) {
  // Exact match first
  if (STEP_META[label]) return STEP_META[label];

  // Partial match (label contains a known key)
  for (const [key, meta] of Object.entries(STEP_META)) {
    if (label.toLowerCase().includes(key.toLowerCase())) return meta;
  }

  // Default fallback
  return { icon: '📄', type: 'Reading', desc: '' };
}

/** Get CSS class for content-type pill */
function getTypePillClass(type) {
  switch (type) {
    case 'Interactive':
    case 'Builder': return 'pill-interactive';
    case 'Quiz': return 'pill-quiz';
    case 'Template': return 'pill-template';
    case 'Case Study': return 'pill-example';
    case 'Reference':
    case 'Tips':
    case 'Guide': return 'pill-reference';
    default: return 'pill-reading';
  }
}

/**
 * Accordion System — transforms the tab-based navigation into a
 * PERSISTENT WINDOW frame layout.
 *
 * The entire right column is ONE window frame:
 *   - macOS-style title bar (dots + framework name)
 *   - "Bookmarks bar" with section pills (like browser bookmarks)
 *   - Content area: auto-opens on section 01, scrolls internally
 *
 * No Home tab — always has a section active.
 */
function installAccordionSystem(container, slug, initialStep) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const journeyNav = fwPage.querySelector('.journey-nav');
  if (!journeyNav) return;

  const jBtns = Array.from(journeyNav.querySelectorAll('.j-btn'));
  if (jBtns.length === 0) return;

  // Look up the framework for window title
  const fw = getFramework(slug);
  const fwName = fw ? fw.name : 'Framework';

  // Collect all panels/sections that the tabs control
  const panels = jBtns.map((btn, i) => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    let panel = null;

    // Try goTo('panelId') pattern
    const goToMatch = onclickAttr.match(/goTo\(['"]([^'"]+)['"]\)/);
    if (goToMatch) {
      panel = fwPage.querySelector(`#${goToMatch[1]}`);
    }

    // Try go(index) pattern
    if (!panel) {
      const goMatch = onclickAttr.match(/go\((\d+)\)/);
      if (goMatch) {
        const idx = parseInt(goMatch[1]);
        const sections = fwPage.querySelectorAll('.section');
        panel = sections[idx] || null;
      }
    }

    // Fallback: match by index with .panel or .section
    if (!panel) {
      const allPanels = fwPage.querySelectorAll('.panel, .section');
      panel = allPanels[i] || null;
    }

    return panel;
  });

  // Extract step labels from the original buttons
  const steps = jBtns.map((btn, i) => {
    const stepEl = btn.querySelector('.j-step');
    const stepNum = stepEl ? stepEl.textContent.trim() : String(i + 1).padStart(2, '0');
    const clone = btn.cloneNode(true);
    const cloneStep = clone.querySelector('.j-step');
    if (cloneStep) cloneStep.remove();
    const label = clone.textContent.trim();
    return { num: stepNum, label };
  });

  // Collapse all panels
  panels.forEach(p => {
    if (!p) return;
    p.classList.remove('active');
    p.style.display = 'none';
  });

  // Mark the fw-page as accordion mode
  fwPage.classList.add('accordion-mode');

  // ====== BUILD THE PERSISTENT WINDOW FRAME ======
  const accordionNav = document.createElement('div');
  accordionNav.className = 'accordion-nav';
  accordionNav.setAttribute('role', 'region');
  accordionNav.setAttribute('aria-label', 'Framework sections');

  // ---- WINDOW TITLE BAR (macOS style) ----
  const windowBar = document.createElement('div');
  windowBar.className = 'window-title-bar';
  windowBar.innerHTML = `
    <span class="window-title-dots">
      <span class="window-title-dot"></span>
      <span class="window-title-dot"></span>
      <span class="window-title-dot"></span>
    </span>
    <span class="window-title-text">${fwName}</span>
    <span class="window-title-actions"></span>
  `;
  accordionNav.appendChild(windowBar);

  // ---- BOOKMARKS BAR (section nav pills styled like browser bookmarks) ----
  const bookmarksBar = document.createElement('div');
  bookmarksBar.className = 'window-bookmarks-bar';
  bookmarksBar.setAttribute('role', 'tablist');

  // Section bookmarks (no Home — auto-opens on 01)
  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    const bookmark = document.createElement('button');
    bookmark.className = 'window-bookmark';
    bookmark.setAttribute('role', 'tab');
    bookmark.setAttribute('aria-selected', 'false');
    bookmark.setAttribute('data-step-index', String(i));
    bookmark.innerHTML = `
      <span class="bookmark-icon" aria-hidden="true">${step.num}</span>
      <span class="bookmark-label">${step.label}</span>
    `;

    bookmark.addEventListener('click', () => {
      if (!bookmark.classList.contains('active')) {
        expandStep(i);
      }
    });

    // Keyboard navigation
    bookmark.addEventListener('keydown', (e) => {
      const allBookmarks = Array.from(bookmarksBar.querySelectorAll('.window-bookmark'));
      const currentIdx = allBookmarks.indexOf(bookmark);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = allBookmarks[currentIdx + 1] || allBookmarks[0];
        next.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = allBookmarks[currentIdx - 1] || allBookmarks[allBookmarks.length - 1];
        prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        allBookmarks[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        allBookmarks[allBookmarks.length - 1].focus();
      }
    });

    bookmarksBar.appendChild(bookmark);
  });

  accordionNav.appendChild(bookmarksBar);

  // ---- WINDOW CONTENT AREA ----
  const windowContent = document.createElement('div');
  windowContent.className = 'window-content-area';

  // Section panels — each is a scrollable content pane inside the window
  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    const panelId = `accordion-panel-${slug}-${i}`;

    const paneWrapper = document.createElement('div');
    paneWrapper.className = 'window-pane';
    paneWrapper.id = panelId;
    paneWrapper.setAttribute('role', 'tabpanel');
    paneWrapper.setAttribute('data-step', String(i));

    // Move the panel into the pane
    panel.style.display = '';
    panel.classList.add('active');
    paneWrapper.appendChild(panel);

    windowContent.appendChild(paneWrapper);
  });

  accordionNav.appendChild(windowContent);

  // Insert accordion after the journey-nav (which is hidden via CSS)
  journeyNav.after(accordionNav);

  // Place TLDR card above accordion (will be moved into hero by installFullBleedHero)
  installTldrCard(fwPage, accordionNav);

  // Override global goTo/go so any remaining onclick handlers use accordion
  window.goTo = (id) => {
    const idx = panels.findIndex(p => p && p.id === id);
    if (idx >= 0) expandStep(idx);
  };
  window.go = (idx) => {
    if (idx >= 0 && idx < steps.length) expandStep(idx);
  };

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fwPage.classList.contains('reading-mode')) {
      collapseAll();
    }
  });

  // --- Accordion interaction functions ---

  function expandStep(index) {
    const bookmarks = accordionNav.querySelectorAll('.window-bookmark');
    const panes = accordionNav.querySelectorAll('.window-pane');

    // Deactivate all bookmarks
    bookmarks.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    panes.forEach(p => p.classList.remove('open'));

    // Activate the target bookmark (direct index — no Home offset)
    if (bookmarks[index]) {
      bookmarks[index].classList.add('active');
      bookmarks[index].setAttribute('aria-selected', 'true');
    }
    if (panes[index]) panes[index].classList.add('open');

    // Enter reading mode
    fwPage.classList.add('reading-mode');

    // Update URL hash for deep linking
    const newHash = `#/framework/${slug}/step/${index}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }

    // Scroll pane to top
    const openPane = panes[index];
    if (openPane) openPane.scrollTop = 0;
  }

  function collapseAll() {
    // With no Home bookmark, "collapse" means return to first section
    expandStep(0);
  }

  // Auto-expand: deep-link target OR first section
  if (initialStep != null && initialStep >= 0 && initialStep < steps.length) {
    expandStep(initialStep);
  } else {
    expandStep(0);
  }
}

/**
 * TLDR Card — standalone quick-read card placed above the accordion.
 * Hidden in reading mode (when an accordion section is expanded).
 */
function installTldrCard(fwPage, accordionNav) {
  const tldr = fwPage.querySelector('.one-liner, .tldr-section, .tldr');
  if (!tldr) return;

  const card = document.createElement('div');
  card.className = 'fw-tldr-card';
  card.appendChild(tldr); // moves from original position

  // Insert before accordion nav
  accordionNav.before(card);
}
