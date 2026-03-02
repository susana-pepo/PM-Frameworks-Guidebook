import { categories, frameworks, getFrameworksByCategory } from '../data/frameworks.js';

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
        <span class="hub-search-icon" aria-hidden="true">&#x1F50D;</span>
        <input type="text" id="hub-search" class="hub-search-input"
               placeholder="Search frameworks…" autocomplete="off" />
      </div>

      <!-- Category nav pills -->
      <div class="hub-filter-pills" role="navigation" aria-label="Browse by category">
        <button class="hub-pill active" data-filter="all" aria-current="true">
          All <span class="hub-pill-count">${frameworks.length}</span>
        </button>
        ${categories.map(cat => `
          <a class="hub-pill" href="#/category/${cat.id}"
             style="--pill-color:${cat.color}; --pill-bg:${cat.colorLight};">
            <span class="hub-pill-emoji" aria-hidden="true">${cat.emoji}</span>
            ${cat.name}
            <span class="hub-pill-count">${getFrameworksByCategory(cat.id).length}</span>
          </a>
        `).join('')}
      </div>
    </div>

    <!-- Search results — shows matching frameworks when typing -->
    <div class="hub-search-results" id="hub-search-results" style="display:none;">
    </div>

    <!-- Empty state for search -->
    <div class="hub-empty-state" id="hub-empty-state" style="display:none;">
      <div class="hub-empty-icon">&#x1F50E;</div>
      <p class="hub-empty-text">No frameworks match your search.</p>
      <button class="hub-empty-clear btn btn-sm">Clear search</button>
    </div>
  `;

  installHubInteractions();
}

function installHubInteractions() {
  const searchInput = document.getElementById('hub-search');
  const searchResults = document.getElementById('hub-search-results');
  const emptyState = document.getElementById('hub-empty-state');
  const clearBtn = emptyState?.querySelector('.hub-empty-clear');

  // --- Search ---
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      searchResults.style.display = 'none';
      emptyState.style.display = 'none';
      return;
    }

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
              <span class="hub-fw-card-arrow" aria-hidden="true">&#x2192;</span>
            </a>
          `;
        }).join('')}
      </div>
    `;
  });

  // --- Clear button ---
  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchResults.style.display = 'none';
    emptyState.style.display = 'none';
  });
}
