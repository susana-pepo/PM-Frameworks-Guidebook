import { categories, getCategory, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { frameworkGlyph } from '../data/icons.js';
import { setPageMeta } from '../utils/page-meta.js';
import { renderNotFound } from './not-found.js';

const ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function renderCategoryPage(container, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) return renderNotFound(container);

  const list = getFrameworksByCategory(cat.id);
  const guide = getComparisonGuide(cat.id);
  const others = categories.filter(c => c.id !== cat.id);

  container.innerHTML = `
    <div class="page family-page" data-cat="${cat.id}">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol><li><a href="#/">Index</a></li><li aria-current="page">${cat.name}</li></ol>
      </nav>

      <header class="family-page-head">
        <span class="thumb thumb--lg" aria-hidden="true"></span>
        <h1>${cat.name}</h1>
        <p class="family-page-lede">${cat.description} Reach for them when ${lowerFirst(cat.when)}</p>
      </header>

      <ol class="family-page-list">
        ${list.map((fw, i) => `
          <li>
            <a class="feature" href="#/framework/${fw.slug}">
              <span class="feature-glyph" aria-hidden="true">${frameworkGlyph(fw.slug, cat.id)}</span>
              <span class="feature-body">
                <span class="feature-name">${fw.name}</span>
                <span class="feature-question">${fw.question}</span>
                <span class="feature-desc">${fw.description}</span>
                <span class="feature-origin">${fw.origin}</span>
              </span>
              ${ARROW}
            </a>
          </li>`).join('')}
      </ol>

      ${guide ? `
        <a class="choose" href="#/compare/${guide.slug}">
          <span class="choose-text">
            <span class="choose-title">${guide.name}</span>
            <span class="choose-desc">${guide.description} Includes a decision guide and a picker.</span>
          </span>
          ${ARROW}
        </a>` : ''}

      <nav class="other-families" aria-label="Other families">
        <h2 class="other-families-title">Other families</h2>
        <ul>
          ${others.map(o => `<li data-cat="${o.id}"><a href="#/category/${o.id}"><span class="thumb thumb--sm" aria-hidden="true"></span>${o.name}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  `;

  setPageMeta({ title: cat.name });
}

function lowerFirst(s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
