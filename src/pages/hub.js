import { categories, frameworks, situations, getFramework, getFrameworksByCategory, getComparisonGuide } from '../data/frameworks.js';
import { frameworkGlyph } from '../data/icons.js';
import { openSearch } from '../components/search.js';
import { setPageMeta } from '../utils/page-meta.js';

const ARROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export function renderHub(container) {
  setPageMeta({ title: null, focus: false });

  container.innerHTML = `
    <div class="page home">
      <section class="home-intro">
        <div class="home-intro-text">
          <h1 class="home-title">A field guide to product frameworks</h1>
          <p class="home-lede">${frameworks.length} frameworks in ${categories.length} families. Each guide explains the method, works through an example and lets you try it on your own problem.</p>
          <button class="home-search" type="button" id="home-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>
            <span>Search by name or problem</span>
            <span class="home-search-keys" aria-hidden="true"><kbd>${isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
          </button>
        </div>

        <aside class="home-start" aria-labelledby="start-title">
          <h2 class="home-start-title" id="start-title">Start from your situation</h2>
          <dl class="start-list">
            ${situations.map(s => `
              <div class="start-row">
                <dt>${s.label}</dt>
                <dd>${s.slugs.map(slug => {
                  const fw = getFramework(slug);
                  return `<a class="start-link" href="#/framework/${slug}" data-cat="${fw.category}"><span class="thumb thumb--sm" aria-hidden="true"></span>${fw.name}</a>`;
                }).join('')}</dd>
              </div>`).join('')}
          </dl>
        </aside>
      </section>

      <section class="home-index" aria-labelledby="index-title">
        <h2 class="visually-hidden" id="index-title">All frameworks</h2>
        ${categories.map((cat, i) => renderFamily(cat, i)).join('')}
      </section>
    </div>
  `;

  container.querySelector('#home-search').addEventListener('click', () => openSearch());
}

function renderFamily(cat, i) {
  const list = getFrameworksByCategory(cat.id);
  const guide = getComparisonGuide(cat.id);
  return `
    <article class="family" data-cat="${cat.id}" aria-labelledby="fam-${cat.id}">
      <header class="family-head">
        <span class="family-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="family-name" id="fam-${cat.id}">
          <a href="#/category/${cat.id}"><span class="thumb" aria-hidden="true"></span>${cat.name}</a>
        </h3>
        <p class="family-when">${cat.when}</p>
        ${guide ? `<a class="family-compare link" href="#/compare/${guide.slug}">How to choose between them</a>` : ''}
      </header>
      <ol class="family-list">
        ${list.map(fw => `
          <li>
            <a class="entry" href="#/framework/${fw.slug}">
              <span class="entry-glyph" aria-hidden="true">${frameworkGlyph(fw.slug, cat.id)}</span>
              <span class="entry-text">
                <span class="entry-name">${fw.name}</span>
                <span class="entry-question">${fw.question}</span>
              </span>
              ${ARROW}
            </a>
          </li>`).join('')}
      </ol>
    </article>
  `;
}
