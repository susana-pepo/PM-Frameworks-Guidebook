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

export async function renderFrameworkPage(container, breadcrumb, slug) {
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
    installAccordionSystem(container);
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
 * Accordion System — transforms the tab-based navigation into a
 * "book cover" layout where the hero visualizer is the landing view
 * and step content is collapsed by default in an accordion.
 */
function installAccordionSystem(container) {
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

  const homeBtn = document.createElement('button');
  homeBtn.className = 'accordion-home-btn';
  homeBtn.innerHTML = '<span>&#8962;</span> Cover';
  homeBtn.addEventListener('click', () => collapseAll());
  miniNav.appendChild(homeBtn);

  steps.forEach((step, i) => {
    const pill = document.createElement('button');
    pill.className = 'accordion-pill';
    pill.textContent = step.num;
    pill.title = step.label;
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

  steps.forEach((step, i) => {
    const panel = panels[i];
    if (!panel) return;

    // Create accordion step header
    const stepHeader = document.createElement('button');
    stepHeader.className = 'accordion-step';
    stepHeader.innerHTML = `
      <span class="accordion-step-num">${step.num}</span>
      <span class="accordion-step-label">${step.label}</span>
      <span class="accordion-chevron">&#9656;</span>
    `;

    // Create wrapper for the panel content
    const wrapper = document.createElement('div');
    wrapper.className = 'accordion-panel-wrapper';
    wrapper.setAttribute('data-step', String(i));

    // Move the panel into the wrapper
    panel.style.display = '';
    panel.classList.add('active');
    wrapper.appendChild(panel);

    // Add "Continue to next" button inside the wrapper
    const continueBtn = document.createElement('button');
    continueBtn.className = 'accordion-continue';
    if (i < steps.length - 1) {
      continueBtn.innerHTML = `Continue to ${steps[i + 1].label} <span class="arrow">&#8594;</span>`;
      continueBtn.addEventListener('click', () => expandStep(i + 1));
    } else {
      continueBtn.innerHTML = `<span class="arrow">&#8962;</span> Back to Cover`;
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

    accordionNav.appendChild(stepHeader);
    accordionNav.appendChild(wrapper);
  });

  // Insert accordion after the journey-nav (which is now hidden via CSS)
  journeyNav.after(accordionNav);

  // Override global goTo/go so any remaining onclick handlers use accordion
  window.goTo = (id) => {
    const idx = panels.findIndex(p => p && p.id === id);
    if (idx >= 0) expandStep(idx);
  };
  window.go = (idx) => {
    if (idx >= 0 && idx < steps.length) expandStep(idx);
  };

  // --- Accordion interaction functions ---

  function expandStep(index) {
    const stepHeaders = accordionNav.querySelectorAll('.accordion-step');
    const wrappers = accordionNav.querySelectorAll('.accordion-panel-wrapper');
    const pills = miniNav.querySelectorAll('.accordion-pill');

    // Collapse all first
    stepHeaders.forEach(h => h.classList.remove('expanded'));
    wrappers.forEach(w => w.classList.remove('open'));
    pills.forEach(p => p.classList.remove('active'));

    // Expand the target
    if (stepHeaders[index]) stepHeaders[index].classList.add('expanded');
    if (wrappers[index]) wrappers[index].classList.add('open');
    if (pills[index]) pills[index].classList.add('active');

    // Enter reading mode
    fwPage.classList.add('reading-mode');

    // Scroll the expanded step into view
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (stepHeaders[index]) {
      stepHeaders[index].scrollIntoView({
        behavior: prefersReducedMotion ? 'instant' : 'smooth',
        block: 'start'
      });
    }
  }

  function collapseAll() {
    const stepHeaders = accordionNav.querySelectorAll('.accordion-step');
    const wrappers = accordionNav.querySelectorAll('.accordion-panel-wrapper');
    const pills = miniNav.querySelectorAll('.accordion-pill');

    stepHeaders.forEach(h => h.classList.remove('expanded'));
    wrappers.forEach(w => w.classList.remove('open'));
    pills.forEach(p => p.classList.remove('active'));

    // Exit reading mode
    fwPage.classList.remove('reading-mode');

    // Scroll to top of framework page
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    fwPage.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start'
    });
  }
}
