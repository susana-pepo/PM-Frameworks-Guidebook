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
      <div class="cat-page-head reveal">
        <span class="cat-page-emoji" aria-hidden="true">${cat.emoji}</span>
        <div class="cat-page-text">
          <h1 class="cat-page-title">${cat.name}</h1>
          <p class="cat-page-desc">${cat.description}</p>
        </div>
      </div>

      <div class="hub-card-grid cat-page-grid reveal" data-reveal-group="cat-cards">
        ${fws.map((fw, i) => `
          <a href="#/framework/${fw.slug}" class="hub-fw-card card-clickable"
             style="--accent-color:${cat.color}; --accent-light:${cat.colorLight}; --card-index:${i};">
            <div class="hub-fw-card-top">
              <span class="hub-fw-card-emoji" aria-hidden="true">${fw.emoji}</span>
              <span class="hub-fw-card-cat-dot" style="background:${cat.color};" title="${cat.name}"></span>
            </div>
            <h3 class="hub-fw-card-name">${fw.name}</h3>
            <p class="hub-fw-card-desc">${fw.description}</p>
            <span class="hub-fw-card-arrow" aria-hidden="true">&#x2192;</span>
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
