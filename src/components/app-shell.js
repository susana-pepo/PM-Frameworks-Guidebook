import { categories, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { onNavigate } from '../router.js';
import { renderHub } from '../pages/hub.js';
import { renderCategoryPage } from '../pages/category.js';
import { renderGuide, updateGuideInPlace, unmountGuide } from '../pages/guide.js';
import { openSearch, initSearch } from './search.js';

const ICON = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  index: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>',
};

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export function renderApp() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <a class="skip-link" href="#main-content" id="skip-link">Skip to content</a>
    <header class="bar" id="bar">
      <div class="bar-inner">
        <a href="#/" class="brand" aria-label="PM Frameworks, home">
          <span class="brand-name">PM Frameworks</span>
        </a>

        <nav class="bar-nav" aria-label="Primary">
          <button class="bar-link" id="index-trigger" type="button" aria-expanded="false" aria-controls="index-panel">
            <span>Index</span>${ICON.chevron}
          </button>
        </nav>

        <div class="bar-tools">
          <button class="search-trigger" id="search-trigger" type="button" aria-label="Search frameworks">
            ${ICON.search}
            <span class="search-trigger-label">Search</span>
            <span class="search-trigger-keys" aria-hidden="true"><kbd>${isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
          </button>
          <button class="btn btn--quiet btn--icon" id="theme-toggle" type="button" aria-label="Switch to dark theme">
            <span class="theme-sun">${ICON.sun}</span><span class="theme-moon">${ICON.moon}</span>
          </button>
        </div>
      </div>

      <div class="index-panel" id="index-panel" hidden>
        <div class="index-panel-inner">
          <div class="index-panel-head">
            <p class="index-panel-title">Index</p>
            <button class="btn btn--quiet btn--icon" type="button" data-close-index aria-label="Close index">${ICON.close}</button>
          </div>
          <div class="index-grid">
            ${categories.map(renderIndexColumn).join('')}
          </div>
        </div>
      </div>
    </header>
    <div class="index-scrim" id="index-scrim" hidden></div>

    <main class="main" id="main-content" tabindex="-1">
      <div id="page-content"></div>
    </main>

    <footer class="foot">
      <div class="foot-inner">
        <p class="foot-line">Made by <a class="link" href="https://susana-pepo.github.io/susana-pepo-pm-portfolio/" target="_blank" rel="noopener">Susana</a> with Claude</p>
      </div>
    </footer>
  `;

  // The skip link must not change the hash (the router owns it).
  document.getElementById('skip-link').addEventListener('click', (e) => {
    e.preventDefault();
    // On a guide section the header is hidden, so land on the section heading.
    const target = document.querySelector('.guide-page[data-panel="chapter"] .panel.is-current h2')
      || document.querySelector('#page-content h1') || document.getElementById('main-content');
    target.setAttribute('tabindex', '-1');
    target.focus();
  });

  bindIndexPanel();
  bindTheme();
  initSearch();
  document.getElementById('search-trigger').addEventListener('click', () => openSearch());

  onNavigate(handleRoute);
}

function renderIndexColumn(cat) {
  const list = getFrameworksByCategory(cat.id);
  const guide = getComparisonGuide(cat.id);
  return `
    <section class="index-col" data-cat="${cat.id}">
      <a class="index-col-head" href="#/category/${cat.id}">
        <span class="thumb thumb--sm" aria-hidden="true"></span>
        <span>${cat.name}</span>
      </a>
      <ul class="index-col-list">
        ${list.map(fw => `
          <li><a class="index-link" href="#/framework/${fw.slug}" data-slug="${fw.slug}">${fw.name}</a></li>
        `).join('')}
        ${guide ? `<li><a class="index-link index-link--compare" href="#/compare/${guide.slug}" data-slug="${guide.slug}">How to choose<span class="visually-hidden"> a ${cat.name.toLowerCase()} framework</span></a></li>` : ''}
      </ul>
    </section>
  `;
}

/* ---- Index panel (desktop dropdown, mobile sheet) --------------------- */
function bindIndexPanel() {
  const panel = document.getElementById('index-panel');
  const scrim = document.getElementById('index-scrim');
  const triggers = [document.getElementById('index-trigger')];
  let lastTrigger = null;

  const setOpen = (open, trigger) => {
    panel.hidden = !open;
    scrim.hidden = !open;
    document.body.classList.toggle('index-open', open);
    triggers.forEach(t => t.setAttribute('aria-expanded', String(open)));
    if (open) {
      lastTrigger = trigger || triggers[0];
      panel.querySelector('.index-link')?.focus({ preventScroll: true });
    } else if (lastTrigger && panel.contains(document.activeElement)) {
      lastTrigger.focus();
    }
  };

  triggers.forEach(t => t.addEventListener('click', () => setOpen(panel.hidden, t)));
  scrim.addEventListener('click', () => setOpen(false));
  panel.querySelector('[data-close-index]').addEventListener('click', () => setOpen(false));
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  window.addEventListener('hashchange', () => { if (!panel.hidden) setOpen(false); });
}

/* ---- Theme ------------------------------------------------------------ */
function bindTheme() {
  const btn = document.getElementById('theme-toggle');
  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1c1a17' : '#fbf9f4');
  };
  apply(document.documentElement.getAttribute('data-theme') || 'light');
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('pmf-theme', next); } catch (e) { /* storage unavailable */ }
    apply(next);
  });
}

/* ---- Routing ---------------------------------------------------------- */
function handleRoute(route) {
  const content = document.getElementById('page-content');
  const slug = route.params?.slug || null;

  document.querySelectorAll('.index-link').forEach(a => {
    if (a.dataset.slug === slug) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  // Moving between sections of the guide already on screen: no reload.
  if ((route.page === 'framework' || route.page === 'compare') && updateGuideInPlace(route)) return;

  unmountGuide();
  window.scrollTo({ top: 0, behavior: 'auto' });

  switch (route.page) {
    case 'category':
      renderCategoryPage(content, route.params.id);
      break;
    case 'framework':
    case 'compare':
      renderGuide(content, route);
      break;
    default:
      renderHub(content);
  }
}
