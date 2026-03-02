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
 * Two-column layout:
 *
 * LEFT (narrow, centered): Badge + emoji + title + subtitle — identity card
 * RIGHT (wide):            Window frame with "At a Glance" as first section
 *                          containing hero visualizer + TLDR, then regular sections
 *
 * The window opens to "At a Glance" by default. Bookmarks bar inside the
 * window lets users navigate between sections.
 */
function installFullBleedHero(container) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const catId = fwPage.dataset.category;
  if (!catId) return;

  const pageHeader = fwPage.querySelector('.fw-page-header');
  const header = fwPage.querySelector('.header');
  if (!pageHeader && !header) return;

  const slug = fwPage.closest('[data-fw-slug]')?.dataset.fwSlug
    || window.location.hash.match(/framework\/([^/]+)/)?.[1];
  const fw = slug ? getFramework(slug) : null;

  // Create full-bleed wrapper
  const heroBleed = document.createElement('div');
  heroBleed.className = 'fw-hero-bleed';
  heroBleed.setAttribute('data-category', catId);

  // ---- SPLIT LAYOUT (two-column grid) ----
  const splitLayout = document.createElement('div');
  splitLayout.className = 'fw-split-layout';

  // ---- LEFT COLUMN: identity card (narrow, centered) ----
  const leftCol = document.createElement('div');
  leftCol.className = 'fw-split-left';

  if (pageHeader) leftCol.appendChild(pageHeader);

  if (fw?.emoji) {
    const emojiEl = document.createElement('div');
    emojiEl.className = 'fw-hero-emoji';
    emojiEl.setAttribute('aria-hidden', 'true');
    emojiEl.textContent = fw.emoji;
    leftCol.appendChild(emojiEl);
  }

  // Move h1 + subtitle from .header into left column
  if (header) {
    const h1 = header.querySelector('h1');
    const subtitle = header.querySelector('p, .subtitle, .sub');
    if (h1) leftCol.appendChild(h1);
    if (subtitle) leftCol.appendChild(subtitle);
  }

  // ---- RIGHT COLUMN: window frame ----
  const rightCol = document.createElement('div');
  rightCol.className = 'fw-split-right';

  // Move the accordion nav (window frame) into right column
  const accordionNav = fwPage.querySelector('.accordion-nav');
  if (accordionNav) {
    // ---- BUILD "AT A GLANCE" PANE (hero visualizer + TLDR) ----
    const glancePane = document.createElement('div');
    glancePane.className = 'window-pane at-a-glance-pane';
    glancePane.id = `accordion-panel-${slug}-glance`;
    glancePane.setAttribute('role', 'tabpanel');
    glancePane.setAttribute('data-step', 'glance');

    // Move hero visualizer into the glance pane
    const fwContainer = fwPage.querySelector('.container, .wrapper');
    if (fwContainer) {
      const vizSelectors = [
        '.formula-bar', '.matrix-hero', '.map-hero', '.kano-hero',
        '.curve-box', '.circles-hero', '.phase-hero', '.anatomy-diagram',
      ];

      let foundViz = false;
      for (const sel of vizSelectors) {
        const viz = fwContainer.querySelector(sel);
        if (viz) {
          glancePane.appendChild(viz);
          foundViz = true;
        }
      }

      // Fallback: grab remaining children before .journey-nav
      if (!foundViz) {
        const journeyNav = fwContainer.querySelector('.journey-nav');
        const skipClasses = ['journey-nav', 'accordion-nav', 'footer', 'nav-btns',
                             'one-liner', 'tldr-section', 'tldr', 'fw-tldr-card',
                             'progress-bar', 'back-link'];
        const children = Array.from(fwContainer.children);
        const journeyIdx = journeyNav ? children.indexOf(journeyNav) : children.length;

        for (let i = 0; i < journeyIdx; i++) {
          const child = children[i];
          if (skipClasses.some(cls => child.classList.contains(cls))) continue;
          if (child === header || child.classList.contains('header')) continue;
          if (child.tagName === 'SCRIPT') continue;
          glancePane.appendChild(child);
          foundViz = true;
        }
      }
    }

    // Move TLDR card into glance pane
    const tldrCard = fwPage.querySelector('.fw-tldr-card');
    if (tldrCard) glancePane.appendChild(tldrCard);

    // Insert glance pane as FIRST section in the window content area
    const windowContentArea = accordionNav.querySelector('.window-content-area');
    if (windowContentArea) {
      windowContentArea.prepend(glancePane);
    }

    // If "At a Glance" bookmark is already active (set by installAccordionSystem),
    // activate the pane too (it didn't exist when expandStep('glance') first ran)
    const glanceBookmark = accordionNav.querySelector('.glance-bookmark.active');
    if (glanceBookmark) {
      glancePane.classList.add('open');
    }

    rightCol.appendChild(accordionNav);
  }

  splitLayout.appendChild(leftCol);
  splitLayout.appendChild(rightCol);
  heroBleed.appendChild(splitLayout);

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
 * Window Frame System — persistent window with bookmarks bar.
 *
 * The window has "At a Glance" (⭐) as the FIRST bookmark, containing the
 * hero visualizer + TLDR. Remaining bookmarks are the regular content sections.
 * Opens to "At a Glance" by default.
 */
function installAccordionSystem(container, slug, initialStep) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const journeyNav = fwPage.querySelector('.journey-nav');
  if (!journeyNav) return;

  const jBtns = Array.from(journeyNav.querySelectorAll('.j-btn'));
  if (jBtns.length === 0) return;

  const fw = getFramework(slug);
  const fwName = fw ? fw.name : 'Framework';

  // Collect all panels/sections that the tabs control
  const panels = jBtns.map((btn, i) => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    let panel = null;

    const goToMatch = onclickAttr.match(/goTo\(['"]([^'"]+)['"]\)/);
    if (goToMatch) {
      panel = fwPage.querySelector(`#${goToMatch[1]}`);
    }

    if (!panel) {
      const goMatch = onclickAttr.match(/go\((\d+)\)/);
      if (goMatch) {
        const idx = parseInt(goMatch[1]);
        const sections = fwPage.querySelectorAll('.section');
        panel = sections[idx] || null;
      }
    }

    if (!panel) {
      const allPanels = fwPage.querySelectorAll('.panel, .section');
      panel = allPanels[i] || null;
    }

    return panel;
  });

  // Extract step labels
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

  fwPage.classList.add('accordion-mode');

  // ====== BUILD THE WINDOW FRAME ======
  const accordionNav = document.createElement('div');
  accordionNav.className = 'accordion-nav';
  accordionNav.setAttribute('role', 'region');
  accordionNav.setAttribute('aria-label', 'Framework sections');

  // ---- TITLE BAR ----
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

  // ---- BOOKMARKS BAR ----
  const bookmarksBar = document.createElement('div');
  bookmarksBar.className = 'window-bookmarks-bar';
  bookmarksBar.setAttribute('role', 'tablist');

  // "At a Glance" bookmark (index -1 internally, displayed first)
  const glanceBookmark = document.createElement('button');
  glanceBookmark.className = 'window-bookmark glance-bookmark';
  glanceBookmark.setAttribute('role', 'tab');
  glanceBookmark.setAttribute('aria-selected', 'false');
  glanceBookmark.setAttribute('data-step-index', 'glance');
  glanceBookmark.innerHTML = `
    <span class="bookmark-icon" aria-hidden="true">&#9733;</span>
    <span class="bookmark-label">At a Glance</span>
  `;
  glanceBookmark.addEventListener('click', () => expandStep('glance'));
  bookmarksBar.appendChild(glanceBookmark);

  // Section bookmarks
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
        (allBookmarks[currentIdx + 1] || allBookmarks[0]).focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        (allBookmarks[currentIdx - 1] || allBookmarks[allBookmarks.length - 1]).focus();
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

  // Section panes (At a Glance pane will be prepended by installFullBleedHero)
  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    const paneWrapper = document.createElement('div');
    paneWrapper.className = 'window-pane';
    paneWrapper.id = `accordion-panel-${slug}-${i}`;
    paneWrapper.setAttribute('role', 'tabpanel');
    paneWrapper.setAttribute('data-step', String(i));

    panel.style.display = '';
    panel.classList.add('active');
    paneWrapper.appendChild(panel);

    windowContent.appendChild(paneWrapper);
  });

  accordionNav.appendChild(windowContent);

  // Insert after journey-nav
  journeyNav.after(accordionNav);

  // Place TLDR card (will be moved into At a Glance pane by installFullBleedHero)
  installTldrCard(fwPage, accordionNav);

  // Override global goTo/go
  window.goTo = (id) => {
    const idx = panels.findIndex(p => p && p.id === id);
    if (idx >= 0) expandStep(idx);
  };
  window.go = (idx) => {
    if (idx >= 0 && idx < steps.length) expandStep(idx);
  };

  // --- Interaction functions ---

  function expandStep(index) {
    const bookmarks = accordionNav.querySelectorAll('.window-bookmark');
    const panes = accordionNav.querySelectorAll('.window-pane');

    // Deactivate all
    bookmarks.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    panes.forEach(p => p.classList.remove('open'));

    if (index === 'glance') {
      // Activate the glance bookmark + glance pane
      glanceBookmark.classList.add('active');
      glanceBookmark.setAttribute('aria-selected', 'true');
      const glancePane = accordionNav.querySelector('.at-a-glance-pane');
      if (glancePane) glancePane.classList.add('open');

      history.replaceState(null, '', `#/framework/${slug}`);
    } else {
      // Activate a regular section bookmark + pane
      // +1 offset because glance bookmark is index 0 in the NodeList
      const bookmarkIdx = index + 1;
      if (bookmarks[bookmarkIdx]) {
        bookmarks[bookmarkIdx].classList.add('active');
        bookmarks[bookmarkIdx].setAttribute('aria-selected', 'true');
      }
      // Dynamic pane offset: +1 only if the glance pane has been prepended
      // (installFullBleedHero runs AFTER this function, so glance pane may not exist yet)
      const hasGlancePane = accordionNav.querySelector('.at-a-glance-pane') != null;
      const paneIdx = index + (hasGlancePane ? 1 : 0);
      if (panes[paneIdx]) panes[paneIdx].classList.add('open');

      const newHash = `#/framework/${slug}/step/${index}`;
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', newHash);
      }
    }

    fwPage.classList.add('reading-mode');

    // Scroll the opened pane to top
    const openPane = accordionNav.querySelector('.window-pane.open');
    if (openPane) openPane.scrollTop = 0;
  }

  // Auto-expand: deep-link target or "At a Glance" by default
  if (initialStep != null && initialStep >= 0 && initialStep < steps.length) {
    expandStep(initialStep);
  } else {
    expandStep('glance');
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
