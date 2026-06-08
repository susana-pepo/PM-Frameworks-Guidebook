import { categories, frameworks, comparisonGuides, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { observeReveals } from '../utils/reveal.js';

export function renderHub(container) {
  container.innerHTML = `
    <div class="hub-hero">
      <div class="hub-hero-eyebrow">
        <span class="hub-hero-dot"></span>
        <span>Reference Guide</span>
      </div>
      <h1 class="hub-title">PM&nbsp;Frameworks</h1>
      <p class="hub-subtitle">
        24 frameworks across 6 categories. Look one up, practice it, or compare your options — the right tool for the job.
      </p>

      <!-- Hub search -->
      <div class="hub-search-wrap">
        <span class="hub-search-icon" aria-hidden="true">&#x1F50D;</span>
        <input type="text" id="hub-search" class="hub-search-input"
               placeholder="Search frameworks…" autocomplete="off" aria-label="Search frameworks" />
        <kbd class="search-kbd-hint" aria-hidden="true"><span class="kbd-cmd">⌘</span>K</kbd>
      </div>

      <!-- Category filter pills -->
      <div class="hub-filter-pills" role="tablist" aria-label="Filter by category">
        <button class="hub-pill active" data-filter="all" role="tab" aria-selected="true">
          All
          <span class="hub-pill-count">${frameworks.length}</span>
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

    <!-- Default gallery: every category with its frameworks -->
    <div class="hub-gallery" id="hub-gallery">
      ${categories.map((cat, ci) => renderCategorySection(cat, ci)).join('')}
    </div>

    <!-- Flat search results (shown only while searching) -->
    <div class="hub-search-results" id="hub-results" style="display:none;"></div>

    <!-- Empty state for search -->
    <div class="hub-empty-state" id="hub-empty-state" style="display:none;">
      <div class="hub-empty-icon" aria-hidden="true">&#x1F50E;</div>
      <p class="hub-empty-text">No frameworks match your search.</p>
      <button class="hub-empty-clear btn btn-sm">Clear search</button>
    </div>
  `;

  installHubInteractions();
}

/** Render one category section: header + framework card grid + compare card. */
function renderCategorySection(cat, ci) {
  const fws = getFrameworksByCategory(cat.id);
  const comparison = getComparisonGuide(cat.id);

  return `
    <section class="hub-section" data-category="${cat.id}" style="--section-color:${cat.color}; --section-bg:${cat.colorLight};">
      <div class="hub-section-head reveal" data-reveal-group="sec-${ci}-head">
        <span class="hub-section-emoji" aria-hidden="true">${cat.emoji}</span>
        <span class="hub-section-text">
          <span class="hub-section-title">${cat.name}</span>
          <span class="hub-section-desc">${cat.description}</span>
        </span>
        ${comparison ? `
          <a class="hub-section-compare" href="#/compare/${comparison.slug}">
            Compare all
            <span class="hub-section-compare-arrow" aria-hidden="true">&#x2192;</span>
          </a>
        ` : ''}
        <span class="hub-section-count">${fws.length} tools</span>
      </div>
      <div class="hub-section-body">
        ${renderFrameworkCards(fws, ci)}
      </div>
    </section>
  `;
}

function renderFrameworkCards(fws, sectionIndex = 0) {
  return `
    <div class="hub-card-grid reveal" data-reveal-group="grid-${sectionIndex}">
      ${fws.map((fw, i) => {
        const cat = categories.find(c => c.id === fw.category);
        return `
          <a href="#/framework/${fw.slug}" class="hub-fw-card card-clickable"
             style="--accent-color:${cat.color}; --accent-light:${cat.colorLight}; --card-index:${i};">
            <span class="hub-fw-card-tile" aria-hidden="true">${fw.emoji}</span>
            <h3 class="hub-fw-card-name">${fw.name}</h3>
            <p class="hub-fw-card-desc">${fw.description}</p>
            <span class="hub-fw-card-foot">
              <span class="hub-fw-card-cat">${cat.name}</span>
              <span class="hub-fw-card-arrow" aria-hidden="true">&#x2192;</span>
            </span>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function installHubInteractions() {
  const searchInput = document.getElementById('hub-search');
  const pills = document.querySelectorAll('.hub-pill');
  const gallery = document.getElementById('hub-gallery');
  const results = document.getElementById('hub-results');
  const emptyState = document.getElementById('hub-empty-state');
  const clearBtn = emptyState?.querySelector('.hub-empty-clear');

  let activeFilter = 'all';

  const showGallery = (filter) => {
    results.style.display = 'none';
    emptyState.style.display = 'none';
    gallery.style.display = '';

    gallery.querySelectorAll('.hub-section').forEach(section => {
      const match = filter === 'all' || section.dataset.category === filter;
      section.classList.toggle('hidden', !match);
    });
  };

  // --- Search across all frameworks ---
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      showGallery(activeFilter);
      return;
    }

    const matches = frameworks.filter(fw =>
      fw.name.toLowerCase().includes(query) ||
      fw.description.toLowerCase().includes(query)
    );

    gallery.style.display = 'none';

    if (matches.length === 0) {
      results.style.display = 'none';
      emptyState.style.display = '';
      return;
    }

    emptyState.style.display = 'none';
    results.style.display = '';
    results.innerHTML = renderFrameworkCards(matches);
    observeReveals(results);
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

      if (searchInput) searchInput.value = '';
      showGallery(activeFilter);
    });
  });

  // --- Clear search button ---
  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    showGallery(activeFilter);
    searchInput?.focus();
  });

  // Kick off staggered scroll-reveal for the gallery
  observeReveals(gallery);
}
