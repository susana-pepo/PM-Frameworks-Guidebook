import { getCategory, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';

export function renderCategoryPage(container, breadcrumb, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) {
    container.innerHTML = '<p>Category not found.</p>';
    return;
  }

  breadcrumb.innerHTML = `
    <a href="#/">Dashboard</a>
    <span class="sep">›</span>
    <span class="current">${cat.name}</span>
  `;

  const fws = getFrameworksByCategory(categoryId);
  const comparison = getComparisonGuide(categoryId);

  container.innerHTML = `
    <div style="margin-bottom:var(--space-6);">
      <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2);">
        <span style="font-size:28px;">${cat.emoji}</span>
        <h1 style="font-size:var(--text-2xl);">${cat.name} Frameworks</h1>
      </div>
      <p style="color:var(--text-secondary);max-width:540px;">${cat.description}</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4);margin-bottom:var(--space-6);">
      ${fws.map(fw => `
        <a href="#/framework/${fw.slug}" class="card card-clickable" style="border-left:3px solid ${cat.color};text-decoration:none;">
          <div style="font-size:28px;margin-bottom:var(--space-3);">${fw.emoji}</div>
          <h3 style="font-size:var(--text-lg);margin-bottom:var(--space-2);">${fw.name}</h3>
          <p style="font-size:var(--text-sm);color:var(--text-tertiary);line-height:var(--leading-normal);">${fw.description}</p>
        </a>
      `).join('')}
    </div>

    ${comparison ? `
      <a href="#/compare/${comparison.slug}" class="card card-clickable" style="display:flex;align-items:center;gap:var(--space-3);text-decoration:none;border-left:3px solid ${cat.color};">
        <span style="font-size:24px;">⚖️</span>
        <div>
          <h3 style="font-size:var(--text-md);">Compare All ${cat.name} Frameworks</h3>
          <p style="font-size:var(--text-sm);color:var(--text-tertiary);">Side-by-side comparison with interactive picker</p>
        </div>
      </a>
    ` : ''}
  `;
}
