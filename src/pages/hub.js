import { categories, getFrameworksByCategory, comparisonGuides } from '../data/frameworks.js';

export function renderHub(container) {
  container.innerHTML = `
    <div class="hub-hero">
      <h1 class="hub-title">PM Frameworks Guidebook</h1>
      <p class="hub-subtitle">
        24 essential Product Management frameworks. Learn them, practice them, apply them.
      </p>
      <div class="hub-badges">
        <span class="badge badge-muted">
          <strong style="font-family:var(--font-mono);">24</strong>&nbsp;frameworks
        </span>
        <span class="badge badge-muted">
          <strong style="font-family:var(--font-mono);">6</strong>&nbsp;categories
        </span>
        <span class="badge badge-muted">
          Interactive quizzes &amp; builders
        </span>
      </div>
    </div>

    <div class="hub-categories">
      ${categories.map(cat => renderCategorySection(cat)).join('')}
    </div>
  `;
}

function renderCategorySection(cat) {
  const fws = getFrameworksByCategory(cat.id);
  const comparison = comparisonGuides.find(cg => cg.category === cat.id);

  return `
    <section class="hub-section">
      <div class="hub-section-head">
        <span class="hub-section-dot" style="background:${cat.color};"></span>
        <h2>
          <a href="#/category/${cat.id}" style="color:inherit;text-decoration:none;">${cat.name}</a>
        </h2>
      </div>
      <p class="hub-section-desc">${cat.description}</p>

      <div class="hub-card-grid">
        ${fws.map(fw => `
          <a href="#/framework/${fw.slug}" class="card card-clickable" style="--accent-color:${cat.color};border-left:3px solid ${cat.color};text-decoration:none;">
            <div style="font-size:24px;margin-bottom:var(--space-2);">${fw.emoji}</div>
            <h3 style="font-size:var(--text-base);margin-bottom:var(--space-1);">${fw.name}</h3>
            <p style="font-size:var(--text-xs);color:var(--text-tertiary);line-height:var(--leading-normal);">${fw.description}</p>
          </a>
        `).join('')}
      </div>

      ${comparison ? `
        <div class="hub-compare-link">
          <a href="#/compare/${comparison.slug}" class="btn btn-sm" style="color:var(--text-tertiary);">
            ⚖️ Compare all ${cat.name.toLowerCase()} frameworks
          </a>
        </div>
      ` : ''}
    </section>
  `;
}
