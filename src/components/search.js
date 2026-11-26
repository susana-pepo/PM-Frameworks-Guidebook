/**
 * Search palette. Opens with ⌘K / Ctrl+K or "/", from the bar button, or
 * from the home page search field. Matches frameworks, comparison guides and
 * categories on name, description, the question each framework answers, and
 * aliases. Arrow keys move, Enter opens, Escape closes.
 */
import { categories, frameworks, comparisonGuides, getCategory } from '../data/frameworks.js';
import { frameworkGlyph, categoryGlyph } from '../data/icons.js';

let root, input, list, items = [], active = 0, lastFocus = null;

const INDEX = [
  ...frameworks.map(fw => ({
    kind: 'Framework',
    title: fw.name,
    detail: fw.question || fw.description,
    cat: fw.category,
    href: `#/framework/${fw.slug}`,
    glyph: frameworkGlyph(fw.slug),
    hay: [fw.name, fw.description, fw.question, ...(fw.aliases || []), getCategory(fw.category)?.name].join(' ').toLowerCase(),
  })),
  ...comparisonGuides.map(cg => ({
    kind: 'Comparison',
    title: cg.name,
    detail: cg.description,
    cat: cg.category,
    href: `#/compare/${cg.slug}`,
    glyph: categoryGlyph(cg.category),
    hay: [cg.name, cg.description, 'compare comparison which versus vs', getCategory(cg.category)?.name].join(' ').toLowerCase(),
  })),
  ...categories.map(c => ({
    kind: 'Category',
    title: c.name,
    detail: c.description,
    cat: c.id,
    href: `#/category/${c.id}`,
    glyph: categoryGlyph(c.id),
    hay: [c.name, c.description, c.when].join(' ').toLowerCase(),
  })),
];

function score(item, q) {
  const t = item.title.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.split(/[\s/()-]+/).some(w => w.startsWith(q))) return 60;
  if (t.includes(q)) return 50;
  const words = q.split(/\s+/).filter(Boolean);
  if (words.every(w => item.hay.includes(w))) return 20 + (item.kind === 'Framework' ? 5 : 0);
  return 0;
}

function results(q) {
  q = q.trim().toLowerCase();
  if (!q) return INDEX.filter(i => i.kind === 'Category');
  return INDEX.map(i => ({ i, s: score(i, q) }))
    .filter(r => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 9)
    .map(r => r.i);
}

function render() {
  const q = input.value;
  items = results(q);
  active = Math.min(active, Math.max(items.length - 1, 0));
  if (!items.length) {
    list.innerHTML = `<li class="palette-empty">No framework matches “${escapeHtml(q.trim())}”. Try a problem, like “prioritize” or “interview”.</li>`;
    input.setAttribute('aria-activedescendant', '');
    return;
  }
  list.innerHTML = (q.trim() ? '' : '<li class="palette-group" role="presentation">Browse by category</li>') +
    items.map((it, n) => `
      <li role="option" id="pal-opt-${n}" class="palette-item${n === active ? ' is-active' : ''}" data-n="${n}" data-cat="${it.cat}" aria-selected="${n === active}">
        <a href="${it.href}" tabindex="-1">
          <span class="palette-glyph" aria-hidden="true">${it.glyph}</span>
          <span class="palette-text">
            <span class="palette-title">${escapeHtml(it.title)}</span>
            <span class="palette-detail">${escapeHtml(it.detail || '')}</span>
          </span>
          <span class="palette-kind">${it.kind}</span>
        </a>
      </li>`).join('');
  input.setAttribute('aria-activedescendant', `pal-opt-${active}`);
}

function move(d) {
  if (!items.length) return;
  active = (active + d + items.length) % items.length;
  list.querySelectorAll('.palette-item').forEach((el, n) => {
    el.classList.toggle('is-active', n === active);
    el.setAttribute('aria-selected', String(n === active));
  });
  input.setAttribute('aria-activedescendant', `pal-opt-${active}`);
  list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
}

function go(n) {
  const it = items[n];
  if (!it) return;
  closeSearch();
  window.location.hash = it.href;
}

export function openSearch(initial = '') {
  if (!root) initSearch();
  lastFocus = document.activeElement;
  root.hidden = false;
  document.body.classList.add('palette-open');
  input.value = initial;
  active = 0;
  render();
  requestAnimationFrame(() => { input.focus(); input.setSelectionRange(input.value.length, input.value.length); });
}

export function closeSearch() {
  if (!root || root.hidden) return;
  root.hidden = true;
  document.body.classList.remove('palette-open');
  lastFocus?.focus?.({ preventScroll: true });
}

export function initSearch() {
  if (root) return;
  root = document.createElement('div');
  root.className = 'palette';
  root.hidden = true;
  root.innerHTML = `
    <div class="palette-scrim" data-close></div>
    <div class="palette-box" role="dialog" aria-modal="true" aria-label="Search frameworks">
      <div class="palette-field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>
        <input type="text" class="palette-input" placeholder="Search by name or describe a problem" autocomplete="off" spellcheck="false"
               role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" />
        <kbd>Esc</kbd>
      </div>
      <ul class="palette-list" id="palette-list" role="listbox" aria-label="Results"></ul>
      <div class="palette-foot" aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
        <span><kbd>↵</kbd> open</span>
      </div>
    </div>`;
  document.body.appendChild(root);
  input = root.querySelector('.palette-input');
  list = root.querySelector('.palette-list');

  input.addEventListener('input', () => { active = 0; render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(active); }
    else if (e.key === 'Escape') { e.preventDefault(); closeSearch(); }
    else if (e.key === 'Tab') { e.preventDefault(); move(e.shiftKey ? -1 : 1); }
  });
  list.addEventListener('mousemove', (e) => {
    const li = e.target.closest('.palette-item');
    if (li && Number(li.dataset.n) !== active) { active = Number(li.dataset.n); move(0); }
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.palette-item');
    if (li) { e.preventDefault(); go(Number(li.dataset.n)); }
  });
  root.addEventListener('click', (e) => { if (e.target.matches('[data-close]')) closeSearch(); });

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      root.hidden ? openSearch() : closeSearch();
    } else if (e.key === '/' && !typing && root.hidden) {
      e.preventDefault();
      openSearch();
    }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
