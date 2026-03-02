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
      <div class="top-nav-search" id="top-nav-search">
        <span class="top-nav-search-icon" aria-hidden="true">&#x1F50D;</span>
        <input type="text" class="top-nav-search-input" id="top-nav-search-input"
               placeholder="Search…" autocomplete="off" aria-label="Search frameworks" />
        <div class="top-nav-search-results" id="top-nav-search-results"></div>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Open navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
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
      </div>
    </main>
  `;

  // Bind events
  bindTopNav();
  bindTopNavSearch();
  bindMobileMenu();

  // Listen for route changes
  onNavigate(handleRoute);
}

function renderTopNav() {
  return categories.map(cat => {
    const catFrameworks = getFrameworksByCategory(cat.id);
    const comparison = comparisonGuides.find(cg => cg.category === cat.id);

    return `
      <div class="top-nav-category" data-category="${cat.id}">
        <button class="top-nav-trigger" aria-haspopup="true" aria-expanded="false">
          <span class="top-nav-emoji">${cat.emoji}</span>
          <span class="top-nav-label">${cat.name}</span>
        </button>
        <div class="top-nav-dropdown" role="menu">
          ${catFrameworks.map(fw => `
            <a class="top-nav-fw" href="#/framework/${fw.slug}" data-fw-slug="${fw.slug}" role="menuitem">
              <span class="top-nav-fw-emoji">${fw.emoji}</span>
              <span>${fw.name}</span>
            </a>
          `).join('')}
          ${comparison ? `
            <div class="top-nav-divider"></div>
            <a class="top-nav-fw top-nav-compare" href="#/compare/${comparison.slug}" role="menuitem">
              <span class="top-nav-fw-emoji">⚖️</span>
              <span>Compare All</span>
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
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
  // Dropdown on hover/focus for desktop
  document.querySelectorAll('.top-nav-category').forEach(cat => {
    const trigger = cat.querySelector('.top-nav-trigger');
    const dropdown = cat.querySelector('.top-nav-dropdown');
    let hoverTimeout;

    const showDropdown = () => {
      clearTimeout(hoverTimeout);
      // Close all other dropdowns first
      document.querySelectorAll('.top-nav-category.open').forEach(other => {
        if (other !== cat) other.classList.remove('open');
      });
      cat.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const hideDropdown = () => {
      hoverTimeout = setTimeout(() => {
        cat.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 150);
    };

    cat.addEventListener('mouseenter', showDropdown);
    cat.addEventListener('mouseleave', hideDropdown);

    // Keyboard support
    trigger.addEventListener('focus', showDropdown);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        showDropdown();
        const firstLink = dropdown.querySelector('.top-nav-fw');
        firstLink?.focus();
      }
      if (e.key === 'Escape') {
        hideDropdown();
        trigger.focus();
      }
    });

    // Keep dropdown open when focused inside it
    dropdown.addEventListener('focusin', () => clearTimeout(hoverTimeout));
    dropdown.addEventListener('focusout', hideDropdown);

    // Close dropdown when a link is clicked
    dropdown.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        cat.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-nav-category')) {
      document.querySelectorAll('.top-nav-category.open').forEach(cat => {
        cat.classList.remove('open');
        cat.querySelector('.top-nav-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
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
      appContent?.removeAttribute('data-category');
      renderCategoryPage(content, route.params.id);
      break;

    case 'framework':
      renderFrameworkPage(content, route.params.slug, route.params.step);
      break;

    case 'compare':
      appContent?.removeAttribute('data-category');
      renderComparePage(content, route.params.slug);
      break;

    default:
      removeInjectedStyles();
      appContent?.removeAttribute('data-category');
      renderHub(content);
  }
}
