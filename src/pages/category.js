import { getCategory, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { frameworkGlyph, UI_ICONS } from '../data/icons.js';
import { setPageMeta } from '../utils/page-meta.js';
import { renderNotFound } from './not-found.js';

export function renderCategoryPage(container, categoryId) {
  const cat = getCategory(categoryId);
  if (!cat) return renderNotFound(container);

  const list = getFrameworksByCategory(cat.id);
  const guide = getComparisonGuide(cat.id);

  container.innerHTML = `
    <div class="page" data-cat="${cat.id}">
      <header class="family-page-head">
        <h1><span class="thumb thumb--lg" aria-hidden="true"></span>${cat.name}</h1>
        <p class="family-page-lede">${cat.description} Reach for them when ${lowerFirst(cat.when)}</p>
        ${guide ? `<p class="family-page-choose">Not sure which one? <a class="link" href="#/compare/${guide.slug}">How to choose</a></p>` : ''}
      </header>

      <ol class="family-page-list">
        ${list.map(fw => `
          <li>
            <a class="feature" href="#/framework/${fw.slug}">
              <span class="feature-glyph" aria-hidden="true">${frameworkGlyph(fw.slug)}</span>
              <span class="feature-body">
                <span class="feature-name">${fw.name}</span>
                <span class="feature-question">${fw.question}</span>
              </span>
              ${UI_ICONS.arrow}
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
