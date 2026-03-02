import { categories, frameworks, getFrameworksByCategory, comparisonGuides } from '../data/frameworks.js';

export function renderHub(container) {
  container.innerHTML = `
    <div class="hub-hero">
      <div class="hub-hero-eyebrow">
        <span class="hub-hero-dot"></span>
        <span>Reference Guide</span>
      </div>
      <h1 class="hub-title">PM Frameworks</h1>
      <p class="hub-subtitle">
        24 frameworks across 6 categories. Look up, practice, compare — pick the right tool for the job.
      </p>

      <!-- Hub search -->
      <div class="hub-search-wrap">
        <span class="hub-search-icon" aria-hidden="true">🔍</span>
        <input type="text" id="hub-search" class="hub-search-input"
               placeholder="Search frameworks…" autocomplete="off" />
      </div>

      <!-- Category filter pills -->
      <div class="hub-filter-pills" role="tablist" aria-label="Filter by category">
        <button class="hub-pill active" data-filter="all" role="tab" aria-selected="true">
          All <span class="hub-pill-count">${frameworks.length}</span>
        </button>
        ${categories.map(cat => `
          <button class="hub-pill" data-filter="${cat.id}" role="tab" aria-selected="false"
                  style="--pill-color:${cat.color}; --pill-bg:${cat.colorLight};">
            <span class="hub-pill-emoji" aria-hidden="true">${cat.emoji}</span>
            ${cat.name}
            <span class="hub-pill-count">${getFrameworksByCategory(cat.id).length}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="hub-categories" id="hub-categories">
      ${categories.map(cat => renderCategoryLink(cat)).join('')}
    </div>

    <!-- Search results — shows matching frameworks when typing -->
    <div class="hub-search-results" id="hub-search-results" style="display:none;">
    </div>

    <!-- Empty state for search -->
    <div class="hub-empty-state" id="hub-empty-state" style="display:none;">
      <div class="hub-empty-icon">🔎</div>
      <p class="hub-empty-text">No frameworks match your search.</p>
      <button class="hub-empty-clear btn btn-sm">Clear search</button>
    </div>
  `;

  installHubInteractions();
}

function renderCategoryLink(cat) {
  const fws = getFrameworksByCategory(cat.id);

  return `
    <a class="hub-section-head" href="#/category/${cat.id}" data-category="${cat.id}"
       style="--section-color:${cat.color}; --section-bg:${cat.colorLight};">
      <span class="hub-section-emoji" aria-hidden="true">${cat.emoji}</span>
      <div class="hub-section-text">
        <h2 class="hub-section-title">${cat.name}</h2>
        <p class="hub-section-desc">${cat.description}</p>
      </div>
      <span class="hub-section-count">${fws.length} frameworks</span>
      <span class="hub-section-arrow" aria-hidden="true">→</span>
    </a>
  `;
}

function installHubInteractions() {
  const searchInput = document.getElementById('hub-search');
  const pills = document.querySelectorAll('.hub-pill');
  const catLinks = document.querySelectorAll('.hub-section-head');
  const categoriesWrap = document.getElementById('hub-categories');
  const searchResults = document.getElementById('hub-search-results');
  const emptyState = document.getElementById('hub-empty-state');
  const clearBtn = emptyState?.querySelector('.hub-empty-clear');

  let activeFilter = 'all';

  // --- Search ---
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      // No search — show category links, hide search results
      categoriesWrap.style.display = '';
      searchResults.style.display = 'none';
      emptyState.style.display = 'none';
      filterCategoryLinks(activeFilter);
      return;
    }

    // Search mode — hide category links, show matching frameworks
    categoriesWrap.style.display = 'none';

    const matches = frameworks.filter(fw =>
      fw.name.toLowerCase().includes(query) ||
      fw.description.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.style.display = 'none';
      emptyState.style.display = '';
      return;
    }

    emptyState.style.display = 'none';
    searchResults.style.display = '';
    searchResults.innerHTML = `
      <div class="hub-card-grid">
        ${matches.map(fw => {
          const cat = categories.find(c => c.id === fw.category);
          return `
            <a href="#/framework/${fw.slug}" class="hub-fw-card card-clickable"
               style="--accent-color:${cat.color}; --accent-light:${cat.colorLight};">
              <div class="hub-fw-card-top">
                <span class="hub-fw-card-emoji" aria-hidden="true">${fw.emoji}</span>
                <span class="hub-fw-card-cat-dot" style="background:${cat.color};" title="${cat.name}"></span>
              </div>
              <h3 class="hub-fw-card-name">${fw.name}</h3>
              <p class="hub-fw-card-desc">${fw.description}</p>
              <span class="hub-fw-card-arrow" aria-hidden="true">→</span>
            </a>
          `;
        }).join('')}
      </div>
    `;
  });

  // --- Filter pills ---
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeFilter = pill.dataset.filter;

      // Clear search when switching pills
      if (searchInput) searchInput.value = '';
      categoriesWrap.style.display = '';
      searchResults.style.display = 'none';
      emptyState.style.display = 'none';

      filterCategoryLinks(activeFilter);
    });
  });

  // --- Clear button ---
  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    activeFilter = 'all';
    pills.forEach(p => {
      p.classList.remove('active');
      p.setAttribute('aria-selected', 'false');
    });
    pills[0]?.classList.add('active');
    pills[0]?.setAttribute('aria-selected', 'true');
    categoriesWrap.style.display = '';
    searchResults.style.display = 'none';
    emptyState.style.display = 'none';
    filterCategoryLinks('all');
  });

  function filterCategoryLinks(filter) {
    catLinks.forEach(link => {
      const catId = link.dataset.category;
      link.style.display = (filter === 'all' || catId === filter) ? '' : 'none';
    });
  }
}
