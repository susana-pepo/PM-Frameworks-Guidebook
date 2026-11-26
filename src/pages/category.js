import { getCategory, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { frameworkGlyph } from '../data/icons.js';
import { setPageMeta } from '../utils/page-meta.js';
import { renderNotFound } from './not-found.js';

const ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

export function renderCategoryPage(container, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) return renderNotFound(container);

  const list = getFrameworksByCategory(cat.id);
  const guide = getComparisonGuide(cat.id);

  container.innerHTML = `
    <div class="page family-page" data-cat="${cat.id}">
      <header class="family-page-head">
        <h1><span class="thumb thumb--lg" aria-hidden="true"></span>${cat.name}</h1>
        <p class="family-page-lede">${cat.description} Reach for them when ${lowerFirst(cat.when)}</p>
        ${guide ? `<p class="family-page-choose">Not sure which one? <a class="link" href="#/compare/${guide.slug}">How to choose</a></p>` : ''}
      </header>

      <ol class="family-page-list">
        ${list.map(fw => `
          <li>
            <a class="feature" href="#/framework/${fw.slug}">
              <span class="feature-glyph" aria-hidden="true">${frameworkGlyph(fw.slug, cat.id)}</span>
              <span class="feature-body">
                <span class="feature-name">${fw.name}</span>
                <span class="feature-question">${fw.question}</span>
              </span>
              ${ARROW}
            </a>
          </li>`).join('')}
      </ol>
    </div>
  `;

  setPageMeta({ title: cat.name });
}

function lowerFirst(s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
