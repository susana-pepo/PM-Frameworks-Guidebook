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
            <span class="hub-pill-dot" style="background:${cat.color};" aria-hidden="true"></span>
            ${cat.name}
            <span class="hub-pill-count">${getFrameworksByCategory(cat.id).length}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="hub-categories" id="hub-categories">
      ${categories.map(cat => renderCategorySection(cat)).join('')}
    </div>

    <!-- Empty state for search -->
    <div class="hub-empty-state" id="hub-empty-state" style="display:none;">
      <div class="hub-empty-icon">🔎</div>
      <p class="hub-empty-text">No frameworks match your search.</p>
      <button class="hub-empty-clear btn btn-sm">Clear search</button>
    </div>
  `;

  // Install search & filter interactivity
  installHubInteractions();
}

function renderCategorySection(cat) {
  const fws = getFrameworksByCategory(cat.id);
  const comparison = comparisonGuides.find(cg => cg.category === cat.id);

  return `
    <section class="hub-section" data-category="${cat.id}" id="hub-cat-${cat.id}">
      <div class="hub-section-head" style="--section-color:${cat.color}; --section-bg:${cat.colorLight};">
        <span class="hub-section-emoji" aria-hidden="true">${cat.emoji}</span>
        <div class="hub-section-text">
          <h2 class="hub-section-title">
            <a href="#/category/${cat.id}">${cat.name}</a>
          </h2>
          <p class="hub-section-desc">${cat.description}</p>
        </div>
        <span class="hub-section-count">${fws.length} frameworks</span>
      </div>

      <div class="hub-card-grid">
        ${fws.map(fw => renderFrameworkCard(fw, cat)).join('')}
      </div>

      ${comparison ? `
        <div class="hub-compare-link">
          <a href="#/compare/${comparison.slug}" class="hub-compare-btn" style="--accent-color:${cat.color};">
            <span class="hub-compare-icon">⚖️</span>
            <span>Compare &amp; Choose</span>
            <span class="hub-compare-arrow">→</span>
          </a>
        </div>
      ` : ''}
    </section>
  `;
}

function renderFrameworkCard(fw, cat) {
  return `
    <a href="#/framework/${fw.slug}" class="hub-fw-card card-clickable"
       data-fw-name="${fw.name.toLowerCase()}"
       data-fw-desc="${fw.description.toLowerCase()}"
       data-fw-category="${cat.id}"
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
}

function installHubInteractions() {
  const searchInput = document.getElementById('hub-search');
  const pills = document.querySelectorAll('.hub-pill');
  const sections = document.querySelectorAll('.hub-section');
  const cards = document.querySelectorAll('.hub-fw-card');
  const emptyState = document.getElementById('hub-empty-state');
  const clearBtn = emptyState?.querySelector('.hub-empty-clear');

  let activeFilter = 'all';

  // --- Search ---
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    filterCards(query, activeFilter);
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

      const query = searchInput?.value.toLowerCase().trim() || '';
      filterCards(query, activeFilter);

      // Scroll to section if filtering to a specific category
      if (activeFilter !== 'all') {
        const target = document.getElementById(`hub-cat-${activeFilter}`);
        if (target && target.style.display !== 'none') {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
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
    filterCards('', 'all');
  });

  function filterCards(query, categoryFilter) {
    let visibleCount = 0;

    sections.forEach(section => {
      const catId = section.dataset.category;
      const catMatch = categoryFilter === 'all' || catId === categoryFilter;

      if (!catMatch) {
        section.style.display = 'none';
        return;
      }

      let sectionVisible = 0;
      const sectionCards = section.querySelectorAll('.hub-fw-card');
      sectionCards.forEach(card => {
        const name = card.dataset.fwName || '';
        const desc = card.dataset.fwDesc || '';
        const match = !query || name.includes(query) || desc.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) sectionVisible++;
      });

      section.style.display = sectionVisible > 0 ? '' : 'none';
      visibleCount += sectionVisible;
    });

    // Show/hide empty state
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? '' : 'none';
    }
  }
}
