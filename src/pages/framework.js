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

  // Look up the framework emoji from data
  const slug = fwPage.closest('[data-fw-slug]')?.dataset.fwSlug
    || window.location.hash.match(/framework\/([^/]+)/)?.[1];
  const fw = slug ? getFramework(slug) : null;

  // Create full-bleed wrapper
  const heroBleed = document.createElement('div');
  heroBleed.className = 'fw-hero-bleed';
  heroBleed.setAttribute('data-category', catId);

  // Inner container constrains content width
  const heroInner = document.createElement('div');
  heroInner.className = 'fw-hero-inner';

  // Move badge into hero (category chip goes first)
  if (pageHeader) heroInner.appendChild(pageHeader);

  // Add large framework emoji between badge and title
  if (fw?.emoji) {
    const emojiEl = document.createElement('div');
    emojiEl.className = 'fw-hero-emoji';
    emojiEl.setAttribute('aria-hidden', 'true');
    emojiEl.textContent = fw.emoji;
    heroInner.appendChild(emojiEl);
  }

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

  // Build accordion structure — tab bar + panel area (separated)
  const accordionNav = document.createElement('div');
  accordionNav.className = 'accordion-nav';
  accordionNav.setAttribute('role', 'region');
  accordionNav.setAttribute('aria-label', 'Framework steps');

  // Tab bar: horizontal row of step buttons (like comparison guides)
  const tabBar = document.createElement('div');
  tabBar.className = 'accordion-tab-bar';
  tabBar.setAttribute('role', 'tablist');

  // Panel area: content panels stacked below the tab bar
  const panelArea = document.createElement('div');
  panelArea.className = 'accordion-panel-area';

  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    const panelId = `accordion-panel-${slug}-${i}`;
    const headerId = `accordion-header-${slug}-${i}`;

    // Get content-type metadata for this step
    const meta = getStepMeta(step.label);

    // Create tab button
    const stepHeader = document.createElement('button');
    stepHeader.className = 'accordion-step';
    stepHeader.id = headerId;
    stepHeader.setAttribute('role', 'tab');
    stepHeader.setAttribute('aria-expanded', 'false');
    stepHeader.setAttribute('aria-controls', panelId);
    stepHeader.innerHTML = `
      <span class="accordion-step-icon" aria-hidden="true">${step.num}</span>
      <span class="accordion-step-label">${step.label}</span>
    `;

    // Create wrapper for the panel content
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion-panel-wrapper';
    wrapper.id = panelId;
    wrapper.setAttribute('role', 'tabpanel');
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

    // Click handler
    stepHeader.addEventListener('click', () => {
      if (stepHeader.classList.contains('expanded')) {
        collapseAll();
      } else {
        expandStep(i);
      }
    });

    // Keyboard navigation
    stepHeader.addEventListener('keydown', (e) => {
      const allHeaders = Array.from(tabBar.querySelectorAll('.accordion-step'));
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

    tabBar.appendChild(stepHeader);
    panelArea.appendChild(wrapper);
  });

  accordionNav.appendChild(tabBar);
  accordionNav.appendChild(panelArea);

  // Insert accordion after the journey-nav (which is now hidden via CSS)
  journeyNav.after(accordionNav);

  // Place TLDR card above accordion
  installTldrCard(fwPage, accordionNav);

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

    // Collapse all first
    stepHeaders.forEach(h => {
      h.classList.remove('expanded');
      h.setAttribute('aria-expanded', 'false');
    });
    wrappers.forEach(w => w.classList.remove('open'));

    // Expand the target
    if (stepHeaders[index]) {
      stepHeaders[index].classList.add('expanded');
      stepHeaders[index].setAttribute('aria-expanded', 'true');
    }
    if (wrappers[index]) wrappers[index].classList.add('open');

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

    stepHeaders.forEach(h => {
      h.classList.remove('expanded');
      h.setAttribute('aria-expanded', 'false');
    });
    wrappers.forEach(w => w.classList.remove('open'));

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
