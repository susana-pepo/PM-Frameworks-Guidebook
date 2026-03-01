import { getFramework, getCategory } from '../data/frameworks.js';
import { extractAndCleanCSS, injectStyles } from '../utils/style-injector.js';

/**
 * Framework page renderer.
 * Loads the original HTML source file, extracts the body content,
 * reinjects cleaned CSS (with neo-brutalist overrides stripped),
 * and injects it into the content area with the original JS preserved.
 */

// Cache loaded framework content — stores { html, css }
const contentCache = new Map();

export async function renderFrameworkPage(container, breadcrumb, slug, initialStep) {
  const fw = getFramework(slug);
  if (!fw) {
    container.innerHTML = '<p>Framework not found.</p>';
    return;
  }

  const cat = getCategory(fw.category);

  breadcrumb.innerHTML = `
    <a href="#/">Dashboard</a>
    <span class="sep">›</span>
    <a href="#/category/${cat.id}">${cat.name}</a>
    <span class="sep">›</span>
    <span class="current">${fw.name}</span>
  `;

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

    // Strip leading emojis from H1 — the SPA badge already shows the emoji
    stripLeadingEmoji(container);

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
    const code = oldScript.textContent;
    oldScript.remove();
    if (code.trim()) {
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
 * Full-bleed hero — wraps the page header (badge) and original
 * .header (H1 + hero visualizer) in a full-viewport-width banner
 * with a category-colored gradient background.
 * Called AFTER installAccordionSystem so mini-nav stays outside the hero.
 */
function installFullBleedHero(container) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const catId = fwPage.dataset.category;
  if (!catId) return;

  const pageHeader = fwPage.querySelector('.fw-page-header');
  const header = fwPage.querySelector('.header');
  if (!pageHeader && !header) return;

  // Create full-bleed wrapper
  const heroBleed = document.createElement('div');
  heroBleed.className = 'fw-hero-bleed';
  heroBleed.setAttribute('data-category', catId);

  // Inner container constrains content width
  const heroInner = document.createElement('div');
  heroInner.className = 'fw-hero-inner';

  // Move badge into hero
  if (pageHeader) heroInner.appendChild(pageHeader);

  // Move the original .header (title + visualizer) into hero
  if (header) heroInner.appendChild(header);

  heroBleed.appendChild(heroInner);

  // Insert at the start of fw-page — mini-nav and accordion stay below
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
 * reference-tool layout where the hero visualizer is the landing view
 * and content sections are collapsed by default with type indicators.
 */
function installAccordionSystem(container, slug, initialStep) {
  const fwPage = container.querySelector('.fw-page');
  if (!fwPage) return;

  const journeyNav = fwPage.querySelector('.journey-nav');
  if (!journeyNav) return;

  const jBtns = Array.from(journeyNav.querySelectorAll('.j-btn'));
  if (jBtns.length === 0) return;

  // Collect all panels/sections that the tabs control
  const panels = jBtns.map((btn, i) => {
    // goTo() system uses onclick="goTo('id')" — extract the panel ID
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
    // Get label text (excluding the step number span)
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

  // Build the mini-nav (sticky bar for reading mode)
  const miniNav = document.createElement('div');
  miniNav.className = 'accordion-mini-nav';
  miniNav.setAttribute('role', 'navigation');
  miniNav.setAttribute('aria-label', 'Step navigation');

  const homeBtn = document.createElement('button');
  homeBtn.className = 'accordion-home-btn';
  homeBtn.innerHTML = '<span aria-hidden="true">&#8962;</span> Cover';
  homeBtn.setAttribute('aria-label', 'Return to cover view');
  homeBtn.addEventListener('click', () => collapseAll());
  miniNav.appendChild(homeBtn);

  steps.forEach((step, i) => {
    const meta = getStepMeta(step.label);
    const pill = document.createElement('button');
    pill.className = 'accordion-pill';
    pill.innerHTML = `<span class="pill-icon" aria-hidden="true">${meta.icon}</span><span class="pill-label">${step.label}</span>`;
    pill.setAttribute('aria-label', `Step ${step.num}: ${step.label}`);
    pill.addEventListener('click', () => expandStep(i));
    miniNav.appendChild(pill);
  });

  // Insert mini-nav before the content area (after fw-page-header)
  const headerEl = fwPage.querySelector('.fw-page-header');
  if (headerEl) {
    headerEl.after(miniNav);
  } else {
    fwPage.prepend(miniNav);
  }

  // Build accordion structure
  const accordionNav = document.createElement('div');
  accordionNav.className = 'accordion-nav';
  accordionNav.setAttribute('role', 'region');
  accordionNav.setAttribute('aria-label', 'Framework steps');

  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    const panelId = `accordion-panel-${slug}-${i}`;
    const headerId = `accordion-header-${slug}-${i}`;

    // Get content-type metadata for this step
    const meta = getStepMeta(step.label);
    const pillClass = getTypePillClass(meta.type);

    // Create accordion step header
    const stepHeader = document.createElement('button');
    stepHeader.className = 'accordion-step';
    stepHeader.id = headerId;
    stepHeader.setAttribute('aria-expanded', 'false');
    stepHeader.setAttribute('aria-controls', panelId);
    stepHeader.innerHTML = `
      <span class="accordion-step-icon" aria-hidden="true">${meta.icon}</span>
      <span class="accordion-step-content">
        <span class="accordion-step-top">
          <span class="accordion-step-label">${step.label}</span>
          <span class="accordion-type-pill ${pillClass}">${meta.type}</span>
        </span>
        ${meta.desc ? `<span class="accordion-step-desc">${meta.desc}</span>` : ''}
      </span>
      <span class="accordion-chevron" aria-hidden="true">&#9656;</span>
    `;

    // Create wrapper for the panel content
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion-panel-wrapper';
    wrapper.id = panelId;
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-labelledby', headerId);
    wrapper.setAttribute('data-step', String(i));

    // Move the panel into the wrapper
    panel.style.display = '';
    panel.classList.add('active');
    wrapper.appendChild(panel);

    // Add "Continue to next" button inside the wrapper
    const continueBtn = document.createElement('button');
    continueBtn.className = 'accordion-continue';
    if (i < steps.length - 1) {
      const nextMeta = getStepMeta(steps[i + 1].label);
      continueBtn.innerHTML = `
        <span class="continue-label">Continue to</span>
        <span class="continue-next">
          <span class="continue-icon" aria-hidden="true">${nextMeta.icon}</span>
          <span>${steps[i + 1].label}</span>
        </span>
        <span class="arrow" aria-hidden="true">→</span>
      `;
      continueBtn.addEventListener('click', () => expandStep(i + 1));
    } else {
      continueBtn.innerHTML = `
        <span class="continue-label">You've explored everything!</span>
        <span class="continue-next">
          <span class="continue-icon" aria-hidden="true">⌂</span>
          <span>Back to Cover</span>
        </span>
      `;
      continueBtn.addEventListener('click', () => collapseAll());
    }
    wrapper.appendChild(continueBtn);

    // Click handler for step header
    stepHeader.addEventListener('click', () => {
      if (stepHeader.classList.contains('expanded')) {
        collapseAll();
      } else {
        expandStep(i);
      }
    });

    // Keyboard navigation: arrow keys move between step headers
    stepHeader.addEventListener('keydown', (e) => {
      const allHeaders = Array.from(accordionNav.querySelectorAll('.accordion-step'));
      const currentIdx = allHeaders.indexOf(stepHeader);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = allHeaders[currentIdx + 1] || allHeaders[0];
        next.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = allHeaders[currentIdx - 1] || allHeaders[allHeaders.length - 1];
        prev.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        allHeaders[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        allHeaders[allHeaders.length - 1].focus();
      }
    });

    accordionNav.appendChild(stepHeader);
    accordionNav.appendChild(wrapper);
  });

  // Insert accordion after the journey-nav (which is now hidden via CSS)
  journeyNav.after(accordionNav);

  // Build "What's Inside" summary chips — interactive: click to jump by type
  buildWhatsInsideChips(steps, accordionNav, expandStep);

  // Build bento grid — 2-column layout with TLDR, Inside chips, and Sections TOC
  installBentoGrid(fwPage, steps, accordionNav, expandStep);

  // Override global goTo/go so any remaining onclick handlers use accordion
  window.goTo = (id) => {
    const idx = panels.findIndex(p => p && p.id === id);
    if (idx >= 0) expandStep(idx);
  };
  window.go = (idx) => {
    if (idx >= 0 && idx < steps.length) expandStep(idx);
  };

  // --- Accordion interaction functions ---

  function expandStep(index, skipScroll) {
    const stepHeaders = accordionNav.querySelectorAll('.accordion-step');
    const wrappers = accordionNav.querySelectorAll('.accordion-panel-wrapper');
    const pills = miniNav.querySelectorAll('.accordion-pill');

    // Collapse all first
    stepHeaders.forEach(h => {
      h.classList.remove('expanded');
      h.setAttribute('aria-expanded', 'false');
    });
    wrappers.forEach(w => w.classList.remove('open'));
    pills.forEach(p => p.classList.remove('active'));

    // Expand the target
    if (stepHeaders[index]) {
      stepHeaders[index].classList.add('expanded');
      stepHeaders[index].setAttribute('aria-expanded', 'true');
    }
    if (wrappers[index]) wrappers[index].classList.add('open');
    if (pills[index]) pills[index].classList.add('active');

    // Enter reading mode
    fwPage.classList.add('reading-mode');

    // Update URL hash for deep linking (use replaceState to avoid polluting history)
    const newHash = `#/framework/${slug}/step/${index}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }

    // Scroll the expanded step into view
    if (!skipScroll) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (stepHeaders[index]) {
        stepHeaders[index].scrollIntoView({
          behavior: prefersReducedMotion ? 'instant' : 'smooth',
          block: 'start'
        });
      }
    }
  }

  function collapseAll() {
    const stepHeaders = accordionNav.querySelectorAll('.accordion-step');
    const wrappers = accordionNav.querySelectorAll('.accordion-panel-wrapper');
    const pills = miniNav.querySelectorAll('.accordion-pill');

    stepHeaders.forEach(h => {
      h.classList.remove('expanded');
      h.setAttribute('aria-expanded', 'false');
    });
    wrappers.forEach(w => w.classList.remove('open'));
    pills.forEach(p => p.classList.remove('active'));

    // Exit reading mode
    fwPage.classList.remove('reading-mode');

    // Update URL hash — remove step
    const baseHash = `#/framework/${slug}`;
    if (window.location.hash !== baseHash) {
      history.replaceState(null, '', baseHash);
    }

    // Scroll to top of framework page
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fwPage.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start'
    });
  }

  // Auto-expand if deep-linked to a specific step
  if (initialStep != null && initialStep >= 0 && initialStep < steps.length) {
    expandStep(initialStep, true);
  }
}

/**
 * Build "What's Inside" summary chips — interactive buttons that
 * jump to the first accordion section matching the clicked content type.
 * Turns dead informational UI into a "jump by type" tool.
 */
function buildWhatsInsideChips(steps, accordionNav, expandStep) {
  // Count content types and track first occurrence index
  const typeCounts = {};
  const typeIcons = {};
  const typeFirstIndex = {};
  steps.forEach((step, i) => {
    const meta = getStepMeta(step.label);
    if (!typeCounts[meta.type]) {
      typeCounts[meta.type] = 0;
      typeIcons[meta.type] = meta.icon;
      typeFirstIndex[meta.type] = i;
    }
    typeCounts[meta.type]++;
  });

  // Sort by count (descending), then alphabetically
  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const whatsInside = document.createElement('div');
  whatsInside.className = 'fw-whats-inside';

  const label = document.createElement('span');
  label.className = 'fw-whats-inside-label';
  label.textContent = 'Inside';
  whatsInside.appendChild(label);

  const chipsContainer = document.createElement('div');
  chipsContainer.className = 'fw-whats-inside-chips';

  sorted.forEach(([type, count]) => {
    const chip = document.createElement('button');
    chip.className = 'fw-chip fw-chip-interactive';
    chip.setAttribute('aria-label', `Jump to first ${type} section`);
    chip.innerHTML = `
      <span class="fw-chip-icon" aria-hidden="true">${typeIcons[type]}</span>
      ${count > 1 ? `<span class="fw-chip-count">${count}</span>` : ''}
      <span>${type}</span>
    `;
    chip.addEventListener('click', () => {
      expandStep(typeFirstIndex[type]);
    });
    chipsContainer.appendChild(chip);
  });

  whatsInside.appendChild(chipsContainer);

  // Insert before the accordion nav
  accordionNav.before(whatsInside);
}

/**
 * Bento Grid Layout — organizes the cover page into a 2-column grid:
 *   Left col row 1: TLDR / Quick Summary card
 *   Left col row 2: What's Inside chips card
 *   Right col (spans both rows): Sections TOC with clickable navigation
 *
 * On mobile: single column stack (TLDR → Inside → TOC).
 * Hidden in reading mode (when an accordion section is expanded).
 */
function installBentoGrid(fwPage, steps, accordionNav, expandStep) {
  const tldr = fwPage.querySelector('.one-liner, .tldr-section, .tldr');
  const chips = fwPage.querySelector('.fw-whats-inside');

  // Need at least the TOC to justify a grid
  if (steps.length === 0) return;

  // Create bento grid container
  const grid = document.createElement('div');
  grid.className = 'fw-bento-grid';

  // -- Left column, row 1: TLDR card --
  if (tldr) {
    const tldrCell = document.createElement('div');
    tldrCell.className = 'bento-cell bento-tldr';
    tldrCell.appendChild(tldr); // moves from original position
    grid.appendChild(tldrCell);
  }

  // -- Left column, row 2: Inside chips card --
  if (chips) {
    const chipsCell = document.createElement('div');
    chipsCell.className = 'bento-cell bento-inside';
    chipsCell.appendChild(chips); // moves from original position
    grid.appendChild(chipsCell);
  }

  // -- Right column: Sections TOC (spans both rows) --
  const toc = document.createElement('div');
  toc.className = 'bento-cell bento-toc';

  const tocHeader = document.createElement('div');
  tocHeader.className = 'bento-toc-header';
  tocHeader.innerHTML = '<span class="bento-toc-icon" aria-hidden="true">📖</span> Sections';
  toc.appendChild(tocHeader);

  const tocList = document.createElement('div');
  tocList.className = 'bento-toc-list';

  steps.forEach((step, i) => {
    const meta = getStepMeta(step.label);
    const pillClass = getTypePillClass(meta.type);

    const btn = document.createElement('button');
    btn.className = 'bento-toc-item';
    btn.setAttribute('aria-label', `Go to ${step.label} section`);
    btn.innerHTML = `
      <span class="bento-toc-item-icon" aria-hidden="true">${meta.icon}</span>
      <span class="bento-toc-item-label">${step.label}</span>
      <span class="accordion-type-pill ${pillClass}">${meta.type}</span>
    `;
    btn.addEventListener('click', () => expandStep(i));
    tocList.appendChild(btn);
  });

  toc.appendChild(tocList);
  grid.appendChild(toc);

  // Insert grid before accordion nav
  accordionNav.before(grid);
}
