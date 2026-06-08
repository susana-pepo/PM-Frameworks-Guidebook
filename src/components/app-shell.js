import { categories, frameworks, comparisonGuides, getFrameworksByCategory } from '../data/frameworks.js';
import { onNavigate, navigate, getRoute } from '../router.js';
import { renderHub } from '../pages/hub.js';
import { renderFrameworkPage } from '../pages/framework.js';
import { renderCategoryPage } from '../pages/category.js';
import { renderComparePage } from '../pages/compare.js';
import { removeInjectedStyles } from '../utils/style-injector.js';

export function renderApp() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Top navigation bar -->
    <header class="top-bar" id="top-bar">
      <a href="#/" class="top-bar-brand">PM Frameworks</a>
      <nav class="top-nav" id="top-nav" aria-label="Framework navigation">
        ${renderTopNav()}
      </nav>
      <div class="top-bar-right">
        <div class="top-nav-search" id="top-nav-search">
          <span class="top-nav-search-icon" aria-hidden="true">&#x1F50D;</span>
          <input type="text" class="top-nav-search-input" id="top-nav-search-input"
                 placeholder="Search…" autocomplete="off" aria-label="Search frameworks" />
          <kbd class="search-kbd-hint search-kbd-hint--topbar" aria-hidden="true"><span class="kbd-cmd">⌘</span>K</kbd>
          <div class="top-nav-search-results" id="top-nav-search-results"></div>
        </div>
        <button class="theme-toggle" id="theme-toggle" aria-label="Switch to dark theme" title="Toggle theme">
          <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
          </svg>
          <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
          </svg>
        </button>
        <button class="hamburger" id="hamburger" aria-label="Open navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- Mobile dropdown menu -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>
    <div class="mobile-menu" id="mobile-menu">
      ${renderMobileMenu()}
    </div>

    <!-- Main content area -->
    <main class="app-main" id="app-main">
      <div class="app-content" id="main-content">
        <div class="content-wrapper" id="page-content">
          <!-- Page content rendered here -->
        </div>
        <footer class="site-footer">
          <a href="https://susana-pepo.github.io/susana-pepo-pm-portfolio/" target="_blank" rel="noopener">Susana</a>
          <span class="site-footer-sep">&times;</span>
          Claude
        </footer>
      </div>
    </main>
  `;

  // Bind events
  bindTopNav();
  bindTopNavSearch();
  bindMobileMenu();
  bindGlobalShortcuts();
  bindThemeToggle();

  // Listen for route changes
  onNavigate(handleRoute);
}

/**
 * Cmd/Ctrl-K focuses search — the hub's prominent hero search when on the hub,
 * otherwise the persistent top-bar search. "/" works too (when not typing).
 */
function bindGlobalShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    const isSlash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')
      || document.activeElement?.isContentEditable;

    if (isCmdK || (isSlash && !typing)) {
      const hubSearch = document.getElementById('hub-search');
      const topSearch = document.getElementById('top-nav-search-input');
      const target = (hubSearch && hubSearch.offsetParent !== null) ? hubSearch : topSearch;
      if (target) {
        e.preventDefault();
        target.focus();
        target.select?.();
      }
    }
  });
}

/**
 * Light/dark theme toggle. The boot-time theme is set inline in index.html
 * (before paint, no flash); this wires the button, persists the choice, and
 * keeps the address-bar theme-color in sync.
 */
function bindThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#2b2620' : '#fcfaf4');
  };

  apply(document.documentElement.getAttribute('data-theme') || 'light');

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('pmf-theme', next); } catch (e) { /* private mode */ }
    apply(next);
  });
}

function renderTopNav() {
  const columns = categories.map(cat => {
    const catFrameworks = getFrameworksByCategory(cat.id);
    const comparison = comparisonGuides.find(cg => cg.category === cat.id);

    return `
      <div class="mega-col" style="--c:${cat.color};">
        <a class="mega-col-head" href="#/category/${cat.id}" role="menuitem">
          <span class="mega-col-emoji" aria-hidden="true">${cat.emoji}</span>
          <span class="mega-col-title">${cat.name}</span>
        </a>
        ${catFrameworks.map(fw => `
          <a class="mega-fw top-nav-fw" href="#/framework/${fw.slug}" data-fw-slug="${fw.slug}" role="menuitem">
            <span class="mega-fw-emoji" aria-hidden="true">${fw.emoji}</span>
            <span>${fw.name}</span>
          </a>
        `).join('')}
        ${comparison ? `
          <a class="mega-compare" href="#/compare/${comparison.slug}" role="menuitem">
            Compare all ${cat.name}
            <span aria-hidden="true">&#x2192;</span>
          </a>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="top-nav-browse" id="top-nav-browse">
      <button class="top-nav-browse-trigger" aria-haspopup="true" aria-expanded="false">
        <span class="top-nav-browse-icon" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </span>
        <span class="top-nav-browse-label">Browse</span>
        <span class="top-nav-browse-chev" aria-hidden="true">&#x25BE;</span>
      </button>
      <div class="top-nav-mega" role="menu" aria-label="All frameworks">
        ${columns}
      </div>
    </div>
  `;
}

function renderMobileMenu() {
  return categories.map(cat => {
    const catFrameworks = getFrameworksByCategory(cat.id);
    const comparison = comparisonGuides.find(cg => cg.category === cat.id);

    return `
      <div class="mobile-menu-category" data-category="${cat.id}">
        <div class="mobile-menu-cat-header" data-mobile-cat="${cat.id}">
          <span class="mobile-menu-emoji">${cat.emoji}</span>
          <span>${cat.name}</span>
          <span class="mobile-menu-chevron">▾</span>
        </div>
        <div class="mobile-menu-items" data-mobile-items="${cat.id}">
          ${catFrameworks.map(fw => `
            <a class="mobile-menu-link" href="#/framework/${fw.slug}" data-fw-slug="${fw.slug}">
              <span>${fw.emoji}</span>
              <span>${fw.name}</span>
            </a>
          `).join('')}
          ${comparison ? `
            <a class="mobile-menu-link mobile-menu-compare" href="#/compare/${comparison.slug}">
              <span>⚖️</span>
              <span>Compare All</span>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function bindTopNav() {
  const browse = document.getElementById('top-nav-browse');
  if (!browse) return;
  const trigger = browse.querySelector('.top-nav-browse-trigger');
  const mega = browse.querySelector('.top-nav-mega');
  let hoverTimeout;

  const open = () => {
    clearTimeout(hoverTimeout);
    browse.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  const close = (immediate = false) => {
    clearTimeout(hoverTimeout);
    const doClose = () => {
      browse.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    if (immediate) doClose();
    else hoverTimeout = setTimeout(doClose, 140);
  };

  browse.addEventListener('mouseenter', open);
  browse.addEventListener('mouseleave', () => close());

  // Click toggles (touch + deliberate click); hover handles the rest
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    browse.classList.contains('open') ? close(true) : open();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      mega.querySelector('a')?.focus();
    }
    if (e.key === 'Escape') { close(true); trigger.focus(); }
  });

  mega.addEventListener('focusin', () => clearTimeout(hoverTimeout));
  mega.addEventListener('focusout', () => close());
  mega.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(true); trigger.focus(); }
  });

  // Close when a link is chosen
  mega.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => close(true));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-nav-browse')) close(true);
  });
}

function bindTopNavSearch() {
  const input = document.getElementById('top-nav-search-input');
  const results = document.getElementById('top-nav-search-results');
  const searchWrap = document.getElementById('top-nav-search');
  if (!input || !results) return;

  let selectedIndex = -1;

  const allItems = [
    ...frameworks.map(fw => ({
      type: 'framework',
      name: fw.name,
      emoji: fw.emoji,
      slug: fw.slug,
      href: `#/framework/${fw.slug}`,
    })),
    ...comparisonGuides.map(cg => {
      const cat = categories.find(c => c.id === cg.category);
      return {
        type: 'compare',
        name: cg.name,
        emoji: '⚖️',
        slug: cg.slug,
        href: `#/compare/${cg.slug}`,
      };
    }),
  ];

  const showResults = (matches) => {
    if (matches.length === 0) {
      results.innerHTML = '<div class="top-nav-search-empty">No results</div>';
    } else {
      results.innerHTML = matches.map((m, i) => `
        <a class="top-nav-search-item${i === selectedIndex ? ' selected' : ''}" href="${m.href}" data-index="${i}">
          <span class="top-nav-search-item-emoji">${m.emoji}</span>
          <span>${m.name}</span>
        </a>
      `).join('');
    }
    results.style.display = '';
    searchWrap.classList.add('open');
  };

  const hideResults = () => {
    results.style.display = 'none';
    searchWrap.classList.remove('open');
    selectedIndex = -1;
  };

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) {
      hideResults();
      return;
    }
    selectedIndex = -1;
    const matches = allItems.filter(item =>
      item.name.toLowerCase().includes(q)
    ).slice(0, 8);
    showResults(matches);
  });

  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.top-nav-search-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        window.location.hash = items[selectedIndex].getAttribute('href');
      } else if (items[0]) {
        window.location.hash = items[0].getAttribute('href');
      }
      input.value = '';
      hideResults();
      input.blur();
    } else if (e.key === 'Escape') {
      input.value = '';
      hideResults();
      input.blur();
    }
  });

  // Click on result
  results.addEventListener('click', (e) => {
    const item = e.target.closest('.top-nav-search-item');
    if (item) {
      input.value = '';
      hideResults();
    }
  });

  // Hide on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#top-nav-search')) {
      hideResults();
    }
  });

  // Hide on focus out
  input.addEventListener('blur', () => {
    // Delay to allow click on results
    setTimeout(hideResults, 200);
  });
}

function bindMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobile-menu-overlay');
  const menu = document.getElementById('mobile-menu');
  let menuOpen = false;

  const toggleMenu = (open) => {
    menuOpen = open ?? !menuOpen;
    menu.classList.toggle('open', menuOpen);
    overlay.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    hamburger.classList.toggle('active', menuOpen);
  };

  hamburger?.addEventListener('click', () => toggleMenu());
  overlay?.addEventListener('click', () => toggleMenu(false));

  // Category expand/collapse in mobile menu
  document.querySelectorAll('[data-mobile-cat]').forEach(header => {
    header.addEventListener('click', () => {
      const catId = header.dataset.mobileCat;
      const items = document.querySelector(`[data-mobile-items="${catId}"]`);
      const isCollapsed = header.classList.toggle('collapsed');
      items.classList.toggle('collapsed', isCollapsed);
    });
  });

  // Close menu on link click
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

function handleRoute(route) {
  const content = document.getElementById('page-content');

  // Tear down navigation globals leaked by the previous page's inline scripts.
  // Framework pages assign window.go / window.goTo (closures bound to their own
  // DOM); left in place they fire on the NEXT page and hijack it. The incoming
  // page re-defines whatever it needs.
  delete window.go;
  delete window.goTo;

  // The hub has a prominent hero search, so suppress the redundant
  // top-bar search there; show it everywhere else.
  document.getElementById('top-nav-search')
    ?.classList.toggle('is-hidden-on-hub', route.page === 'hub');

  // Update active state in top nav
  document.querySelectorAll('.top-nav-fw').forEach(link => {
    link.classList.toggle('active', link.dataset.fwSlug === route.params.slug);
  });
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.classList.toggle('active', link.dataset.fwSlug === route.params.slug);
  });

  // Scroll content to top
  document.getElementById('main-content')?.scrollTo(0, 0);

  // Clear category-colored background when leaving framework pages
  const appContent = document.getElementById('main-content');

  switch (route.page) {
    case 'hub':
      removeInjectedStyles();
      appContent?.removeAttribute('data-category');
      renderHub(content);
      break;

    case 'category':
      removeInjectedStyles();
      // renderCategoryPage sets data-category on .app-content for the calm tint
      renderCategoryPage(content, route.params.id);
      break;

    case 'framework':
      renderFrameworkPage(content, route.params.slug, route.params.step);
      break;

    case 'compare':
      // renderComparePage sets data-category on .app-content for the calm tint
      renderComparePage(content, route.params.slug);
      break;

    default:
      removeInjectedStyles();
      appContent?.removeAttribute('data-category');
      renderHub(content);
  }
}
