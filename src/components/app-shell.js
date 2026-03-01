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
    <!-- Mobile header -->
    <div class="mobile-header">
      <button class="hamburger" id="sidebar-toggle" aria-label="Open navigation">
        <span></span><span></span><span></span>
      </button>
      <span style="font-weight:700;font-size:var(--text-sm);">PM Frameworks</span>
    </div>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <!-- Sidebar -->
    <aside class="app-sidebar" id="sidebar" role="navigation" aria-label="Framework navigation">
      <div class="sidebar-brand">
        <h1><a href="#/" style="color:inherit;text-decoration:none;">PM Frameworks</a></h1>
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
        <div class="sidebar-cat-header" data-cat-toggle="${cat.id}">
          <span class="cat-dot" style="background:${cat.color};"></span>
          <span>${cat.name}</span>
          <span class="cat-chevron">▾</span>
        </div>
        <div class="sidebar-cat-items" data-cat-items="${cat.id}">
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

  toggle?.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('open', sidebarOpen);
    overlay.classList.toggle('open', sidebarOpen);
  });

  overlay?.addEventListener('click', () => {
    sidebarOpen = false;
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  });

  // Category collapse/expand
  document.querySelectorAll('[data-cat-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const catId = header.dataset.catToggle;
      const items = document.querySelector(`[data-cat-items="${catId}"]`);
      header.classList.toggle('collapsed');
      items.classList.toggle('collapsed');
    });
  });

  // Close sidebar on link click (mobile)
  document.querySelectorAll('.sidebar-fw-link, .sidebar-compare-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebarOpen = false;
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      }
    });
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

  // Update active state in sidebar
  document.querySelectorAll('.sidebar-fw-link').forEach(link => {
    link.classList.toggle('active', link.dataset.fwSlug === route.params.slug);
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
      renderFrameworkPage(content, breadcrumb, route.params.slug);
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
