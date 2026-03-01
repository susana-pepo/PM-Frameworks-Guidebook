import { categories, frameworks, comparisonGuides, getFrameworksByCategory } from '../data/frameworks.js';
import { onNavigate, navigate, getRoute } from '../router.js';
import { renderHub } from '../pages/hub.js';
import { renderFrameworkPage } from '../pages/framework.js';
import { renderCategoryPage } from '../pages/category.js';
import { renderComparePage } from '../pages/compare.js';
import { removeInjectedStyles } from '../utils/style-injector.js';

let sidebarOpen = false;

export function renderApp() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Mobile header -->
    <div class="mobile-header">
      <button class="hamburger" id="sidebar-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="sidebar">
        <span></span><span></span><span></span>
      </button>
      <span style="font-weight:700;font-size:var(--text-sm);">PM Frameworks</span>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <!-- Floating sidebar peek button (visible when sidebar is hidden) -->
    <button class="sidebar-peek-btn" id="sidebar-peek" aria-label="Show navigation">
      <span aria-hidden="true">☰</span>
    </button>

    <!-- Sidebar -->
    <aside class="app-sidebar" id="sidebar" role="navigation" aria-label="Framework navigation">
      <div class="sidebar-brand">
        <div class="sidebar-brand-title" role="banner"><a href="#/" style="color:inherit;text-decoration:none;">PM Frameworks</a></div>
        <div class="brand-badge">📘 24 frameworks</div>
      </div>

      <div class="sidebar-search">
        <div class="sidebar-search-wrap">
          <span class="search-icon">🔍</span>
          <input type="search" id="sidebar-search" placeholder="Search frameworks..." aria-label="Search frameworks">
        </div>
      </div>

      <nav class="sidebar-nav" id="sidebar-nav">
        ${renderSidebarNav()}
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="app-main" id="app-main">
      <header class="app-header" id="app-header">
        <nav class="breadcrumb" id="breadcrumb" aria-label="Breadcrumb"></nav>
      </header>
      <div class="app-content" id="main-content">
        <div class="content-wrapper" id="page-content">
          <!-- Page content rendered here -->
        </div>
      </div>
    </main>
  `;

  // Bind events
  bindSidebar();
  bindSearch();

  // Listen for route changes
  onNavigate(handleRoute);
}

function renderSidebarNav() {
  return categories.map(cat => {
    const catFrameworks = getFrameworksByCategory(cat.id);
    const comparison = comparisonGuides.find(cg => cg.category === cat.id);

    return `
      <div class="sidebar-category" data-category="${cat.id}">
        <div class="sidebar-cat-header" data-cat-toggle="${cat.id}" role="button" tabindex="0" aria-expanded="true" aria-controls="cat-items-${cat.id}">
          <span class="cat-dot" style="background:${cat.color};"></span>
          <span>${cat.name}</span>
          <span class="cat-chevron" aria-hidden="true">▾</span>
        </div>
        <div class="sidebar-cat-items" id="cat-items-${cat.id}" data-cat-items="${cat.id}">
          ${catFrameworks.map(fw => `
            <a class="sidebar-fw-link" data-fw-slug="${fw.slug}" href="#/framework/${fw.slug}">
              <span class="fw-emoji">${fw.emoji}</span>
              <span>${fw.name}</span>
            </a>
          `).join('')}
          ${comparison ? `
            <a class="sidebar-compare-link" href="#/compare/${comparison.slug}">
              ⚖️ Compare all
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function bindSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');

  const toggleSidebar = (open) => {
    sidebarOpen = open ?? !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
    overlay.classList.toggle('open', sidebarOpen);
    toggle.setAttribute('aria-expanded', String(sidebarOpen));
    toggle.setAttribute('aria-label', sidebarOpen ? 'Close navigation' : 'Open navigation');
  };

  toggle?.addEventListener('click', () => toggleSidebar());

  overlay?.addEventListener('click', () => toggleSidebar(false));

  // Category collapse/expand — with keyboard support
  document.querySelectorAll('[data-cat-toggle]').forEach(header => {
    const toggleCategory = () => {
      const catId = header.dataset.catToggle;
      const items = document.querySelector(`[data-cat-items="${catId}"]`);
      const isCollapsed = header.classList.toggle('collapsed');
      items.classList.toggle('collapsed', isCollapsed);
      header.setAttribute('aria-expanded', String(!isCollapsed));
    };

    header.addEventListener('click', toggleCategory);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategory();
      }
    });
  });

  // Close sidebar on link click (mobile + peek overlay)
  document.querySelectorAll('.sidebar-fw-link, .sidebar-compare-link').forEach(link => {
    link.addEventListener('click', () => {
      const appEl = document.getElementById('app');
      // Close peek overlay on desktop
      if (appEl.classList.contains('sidebar-peeking')) {
        appEl.classList.remove('sidebar-peeking');
      }
      // Close mobile sidebar
      if (window.innerWidth <= 768) {
        sidebarOpen = false;
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }
    });
  });

  // Sidebar peek button — opens sidebar as overlay on framework pages
  const peekBtn = document.getElementById('sidebar-peek');
  peekBtn?.addEventListener('click', () => {
    const appEl = document.getElementById('app');
    appEl.classList.toggle('sidebar-peeking');
  });

  // Close peek overlay when clicking the overlay background
  overlay?.addEventListener('click', () => {
    const appEl = document.getElementById('app');
    if (appEl.classList.contains('sidebar-peeking')) {
      appEl.classList.remove('sidebar-peeking');
    }
  });
}

function bindSearch() {
  const input = document.getElementById('sidebar-search');
  input?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.sidebar-fw-link').forEach(link => {
      const name = link.textContent.toLowerCase();
      link.style.display = (!query || name.includes(query)) ? '' : 'none';
    });
    // Show all categories when searching
    if (query) {
      document.querySelectorAll('.sidebar-cat-items').forEach(items => {
        items.classList.remove('collapsed');
      });
      document.querySelectorAll('.sidebar-cat-header').forEach(header => {
        header.classList.remove('collapsed');
      });
    }
  });
}

function handleRoute(route) {
  const content = document.getElementById('page-content');
  const breadcrumb = document.getElementById('breadcrumb');
  const appEl = document.getElementById('app');

  // Toggle sidebar visibility: hide on framework pages, show elsewhere
  const isFrameworkPage = route.page === 'framework';
  appEl.classList.toggle('sidebar-hidden', isFrameworkPage);
  // Remove peeking state on navigation
  appEl.classList.remove('sidebar-peeking');

  // Update active state in sidebar with category-specific colors
  document.querySelectorAll('.sidebar-fw-link').forEach(link => {
    const isActive = link.dataset.fwSlug === route.params.slug;
    link.classList.toggle('active', isActive);
    if (isActive) {
      // Find the parent category and set its color on the active link
      const catEl = link.closest('.sidebar-category');
      const catId = catEl?.dataset.category;
      if (catId) {
        link.style.setProperty('--cat-active-color', `var(--cat-${catId})`);
        link.style.setProperty('--cat-active-soft', `var(--cat-${catId}-soft)`);
      }
      // Auto-expand parent category if collapsed
      const catItems = link.closest('.sidebar-cat-items');
      const catHeader = catItems?.previousElementSibling;
      if (catItems?.classList.contains('collapsed')) {
        catItems.classList.remove('collapsed');
        catHeader?.classList.remove('collapsed');
        catHeader?.setAttribute('aria-expanded', 'true');
      }
      // Auto-scroll sidebar to show active link
      requestAnimationFrame(() => {
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    } else {
      link.style.removeProperty('--cat-active-color');
      link.style.removeProperty('--cat-active-soft');
    }
  });

  // Scroll content to top
  document.getElementById('main-content')?.scrollTo(0, 0);

  switch (route.page) {
    case 'hub':
      removeInjectedStyles();
      breadcrumb.innerHTML = '<span class="current">Dashboard</span>';
      renderHub(content);
      break;

    case 'category':
      removeInjectedStyles();
      renderCategoryPage(content, breadcrumb, route.params.id);
      break;

    case 'framework':
      // injectStyles() is called inside renderFrameworkPage
      renderFrameworkPage(content, breadcrumb, route.params.slug, route.params.step);
      break;

    case 'compare':
      // injectStyles() is called inside renderComparePage
      renderComparePage(content, breadcrumb, route.params.slug);
      break;

    default:
      removeInjectedStyles();
      breadcrumb.innerHTML = '<span class="current">Dashboard</span>';
      renderHub(content);
  }
}
