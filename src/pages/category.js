import { getCategory, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { observeReveals } from '../utils/reveal.js';

export function renderCategoryPage(container, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) {
    container.innerHTML = '<p>Category not found.</p>';
    return;
  }

  // Tint the page background with the category fill (matches framework pages)
  const appContent = container.closest('.app-content') || container;
  appContent.setAttribute('data-category', categoryId);

  const fws = getFrameworksByCategory(categoryId);
  const comparison = getComparisonGuide(categoryId);

  container.innerHTML = `
    <div class="cat-page" style="--accent-color:${cat.color}; --accent-light:${cat.colorLight};">
      <header class="cat-page-head reveal">
        <span class="cat-page-emoji" aria-hidden="true">${cat.emoji}</span>
        <div class="cat-page-text">
          <span class="cat-page-eyebrow">Category · ${fws.length} frameworks</span>
          <h1 class="cat-page-title">${cat.name}</h1>
          <p class="cat-page-desc">${cat.description}</p>
        </div>
      </header>

      <div class="cat-page-when reveal">
        <span class="cat-when-label">Reach for these</span>
        <p class="cat-when-text">${cat.when.replace(/^When /, 'when ')}.</p>
      </div>

      <div class="hub-card-grid cat-page-grid reveal" data-reveal-group="cat-cards">
        ${fws.map((fw, i) => `
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
        `).join('')}
      </div>

      ${comparison ? `
        <a href="#/compare/${comparison.slug}" class="cat-compare-card card-clickable"
           style="--accent-color:${cat.color};">
          <span class="cat-compare-icon" aria-hidden="true">${cat.emoji}</span>
          <span class="cat-compare-text">
            <span class="cat-compare-title">Compare all ${cat.name} frameworks</span>
            <span class="cat-compare-sub">Side-by-side comparison with an interactive picker</span>
          </span>
          <span class="cat-compare-arrow" aria-hidden="true">&#x2192;</span>
        </a>
      ` : ''}
    </div>
  `;

  observeReveals(container);
}
