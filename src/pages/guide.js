/**
 * Guide renderer: framework guides and comparison guides.
 *
 * Content is a canonical fragment in public/guides/<file> (docs/content-spec.md).
 * This module supplies every piece of chrome around it: breadcrumb, header,
 * contents rail, section numbers, previous/next links, the footer with
 * neighbouring guides, and the shared behaviours (quiz, copy, links, live
 * results).
 *
 * A guide is read one section at a time. The introduction and each chapter
 * are panels; only the current one is shown, and the contents rail (a
 * "Contents" bar on narrow screens) moves between them. Each panel has its
 * own address, #/<kind>/<slug>/<section>, so back and forward step through
 * the sections a reader visited. A guide's own <script data-guide-script> runs scoped to the
 * guide with `root` and `api`, and is torn down when the guide unmounts.
 */
import {
  getFramework, getCategory, getComparisonBySlug, getComparisonGuide,
  getSiblings, getFrameworksByCategory,
} from '../data/frameworks.js';
import { frameworkGlyph, categoryGlyph } from '../data/icons.js';
import { setPageMeta } from '../utils/page-meta.js';
import { renderNotFound } from './not-found.js';

const cache = new Map();
let current = null;     // { key, kind, slug, root, page, cleanup[], panels[], show() }
const INTRO_ID = 'intro';
let renderToken = 0;

const ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
const CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>';
const ARROW_ROW = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/></svg>';

/* ---- Resolve route → guide ------------------------------------------- */
function resolve(route) {
  const { slug } = route.params;
  if (route.page === 'framework') {
    const fw = getFramework(slug);
    if (!fw) return null;
    return { kind: 'framework', slug, file: fw.file, title: fw.name, meta: fw, cat: getCategory(fw.category) };
  }
  const cg = getComparisonBySlug(slug);
  if (!cg) return null;
  return { kind: 'compare', slug, file: cg.file, title: cg.name, meta: cg, cat: getCategory(cg.category) };
}

function hrefFor(kind, slug, section) {
  return `#/${kind}/${slug}${section ? '/' + section : ''}`;
}

function linkForGuideSlug(slug, section) {
  if (getFramework(slug)) return hrefFor('framework', slug, section);
  if (getComparisonBySlug(slug)) return hrefFor('compare', slug, section);
  return null;
}

/* ---- Public: in-place section navigation ----------------------------- */
export function updateGuideInPlace(route) {
  if (!current) return false;
  const info = resolve(route);
  if (!info || `${info.kind}:${info.slug}` !== current.key) return false;
  goToRoute(route);
  return true;
}

export function unmountGuide() {
  if (!current) return;
  current.cleanup.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
  document.getElementById('guide-style')?.remove();
  current = null;
}

/* ---- Public: render -------------------------------------------------- */
export async function renderGuide(container, route) {
  unmountGuide();
  const info = resolve(route);
  if (!info) return renderNotFound(container, 'There is no guide at this address.');

  const token = ++renderToken;
  container.innerHTML = `
    <div class="page guide-page" data-cat="${info.cat.id}">
      <div class="loading" role="status" aria-label="Loading ${info.title}">
        <div class="loading-line"></div><div class="loading-line"></div><div class="loading-line"></div><div class="loading-line"></div>
      </div>
    </div>`;
  setPageMeta({ title: info.title, focus: false });

  let parsed;
  try {
    parsed = await load(info.file);
  } catch (err) {
    if (token !== renderToken) return;
    container.innerHTML = `
      <div class="page state-page">
        <h1>This guide did not load</h1>
        <p class="state-text">Check your connection and try again.</p>
        <button class="btn btn--primary" type="button" id="retry">Try again</button>
      </div>`;
    container.querySelector('#retry').addEventListener('click', () => renderGuide(container, route));
    return;
  }
  if (token !== renderToken) return;   // a newer route won

  mount(container, info, parsed, route);
}

async function load(file) {
  if (cache.has(file)) return cache.get(file);
  const res = await fetch(`${import.meta.env.BASE_URL}guides/${file}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(`<body>${text}</body>`, 'text/html');
  const article = doc.querySelector('article.guide');
  if (!article) throw new Error('No guide article');
  // Colour mixes run in OKLab: an OKLCH mix of a series with the warm
  // neutrals (ink, paper, rule) rotates its hue the short way round the wheel,
  // turning blue violet in light and teal in dark. OKLab has no hue channel.
  // Guides should author `in oklab`; this keeps older guide CSS correct.
  const style = [...doc.querySelectorAll('style[data-guide-style]')]
    .map(s => s.textContent).join('\n')
    .replace(/color-mix\(\s*in\s+oklch\s*,/g, 'color-mix(in oklab,');
  const script = [...doc.querySelectorAll('script[data-guide-script]')].map(s => s.textContent).join('\n;\n');
  const parsed = { html: article.outerHTML, style, script };
  cache.set(file, parsed);
  return parsed;
}

/* ---- Mount ------------------------------------------------------------ */
function mount(container, info, parsed, route) {
  const { cat, kind, slug } = info;
  const isFw = kind === 'framework';

  container.innerHTML = `
    <div class="page guide-page" data-cat="${cat.id}" data-kind="${kind}">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="#/">Index</a></li>
          <li><a href="#/category/${cat.id}">${cat.name}</a></li>
          <li><a href="${hrefFor(kind, slug)}" aria-current="page">${isFw ? info.title : 'How to choose'}</a></li>
        </ol>
      </nav>
      <div class="guide-layout">
        <aside class="guide-rail" aria-label="Contents">
          <nav class="toc">
            <button class="toc-toggle" type="button" aria-expanded="false" aria-controls="toc-list">
              <span class="toc-toggle-label">Contents</span>
              <span class="toc-toggle-current"></span>
              ${CHEVRON}
            </button>
            <p class="toc-title" id="toc-title">Contents</p>
            <ol class="toc-list" id="toc-list" aria-labelledby="toc-title"></ol>
          </nav>
        </aside>
        <div class="guide-main">
          <header class="guide-head">
            <p class="guide-kicker">
              <span class="guide-glyph" aria-hidden="true">${isFw ? frameworkGlyph(slug, cat.id) : categoryGlyph(cat.id)}</span>
              <a href="#/category/${cat.id}">${cat.name}</a>
              <span aria-hidden="true">·</span>
              <span>${isFw ? 'Framework' : 'Comparison guide'}</span>
            </p>
            <h1 class="guide-title">${info.title}</h1>
            ${isFw ? `<p class="guide-question">${info.meta.question}</p>` : `<p class="guide-question">${info.meta.description}</p>`}
            <dl class="guide-meta"></dl>
          </header>
          <div class="guide-body"></div>
          <footer class="guide-foot"></footer>
        </div>
      </div>
    </div>`;

  const page = container.querySelector('.guide-page');
  const body = page.querySelector('.guide-body');
  body.innerHTML = parsed.html;
  const root = body.querySelector('article.guide');
  root.dataset.cat = cat.id;

  const cleanup = [];
  current = { key: `${kind}:${slug}`, kind, slug, root, page, cleanup, chapters: [] };

  if (parsed.style) {
    const el = document.createElement('style');
    el.id = 'guide-style';
    el.textContent = parsed.style;
    document.head.appendChild(el);
  }

  const chapters = [...root.querySelectorAll(':scope > section.chapter')];
  current.chapters = chapters;
  const panels = buildPanels(root, chapters);
  current.panels = panels;

  decorateChapters(chapters);
  buildMeta(page, info, root);
  buildToc(page, panels, kind, slug);
  buildPagers(panels, kind, slug);
  buildFooter(page, info);
  page.dataset.paged = '';

  wireLinks(root, kind, slug);
  wireQuizzes(root);
  wireTemplates(root);
  wireResults(root, cleanup);
  wireTables(root, cleanup);
  wireFigures(root, cleanup);
  wireCardKeys(root);

  runScript(parsed.script, root, cleanup);

  setPageMeta({ title: info.title, focus: false });
  goToRoute(route);
}

/* ---- Panels: the introduction and each chapter ----------------------- */
function buildPanels(root, chapters) {
  let intro = root.querySelector(':scope > .guide-intro');
  if (!intro) {
    // A guide with no intro block still gets an Introduction panel: the header.
    intro = document.createElement('div');
    intro.className = 'guide-intro';
    root.prepend(intro);
  }
  intro.id = intro.id || INTRO_ID;
  const panels = [{ id: intro.id, el: intro, label: 'Introduction', num: '' }];
  chapters.forEach((ch, i) => panels.push({
    id: ch.id, el: ch, num: String(i + 1),
    label: ch.dataset.nav || ch.querySelector('h2')?.textContent || '',
  }));
  panels.forEach(p => p.el.classList.add('panel'));
  return panels;
}

function decorateChapters(chapters) {
  chapters.forEach((ch, i) => {
    const head = ch.querySelector(':scope > .chapter-head');
    if (head && !head.querySelector('.chapter-num')) {
      const n = document.createElement('p');
      n.className = 'chapter-num';
      n.innerHTML = `<span class="visually-hidden">Section </span>${i + 1}<span aria-hidden="true"> · </span><span class="chapter-label"></span>`;
      n.querySelector('.chapter-label').textContent = ch.dataset.nav || '';
      head.prepend(n);
    }
  });
}

// Previous / next at the foot of every panel, so a reader who has finished a
// section can carry on without going back to the contents.
function buildPagers(panels, kind, slug) {
  panels.forEach((p, i) => {
    const prev = panels[i - 1];
    const next = panels[i + 1];
    if (!prev && !next) return;
    const nav = document.createElement('nav');
    nav.className = 'panel-pager';
    nav.setAttribute('aria-label', 'Sections');
    const link = (target, dir) => {
      const a = document.createElement('a');
      a.className = `panel-pager-link panel-pager-link--${dir}`;
      a.href = hrefFor(kind, slug, target.id === INTRO_ID ? null : target.id);
      a.innerHTML = dir === 'prev'
        ? `${ARROW_L}<span class="panel-pager-text"><span class="panel-pager-dir">Previous</span><span class="panel-pager-title"></span></span>`
        : `<span class="panel-pager-text"><span class="panel-pager-dir">${prev ? 'Next' : 'Start reading'}</span><span class="panel-pager-title"></span></span>${ARROW_R}`;
      a.querySelector('.panel-pager-title').textContent = target.num ? `${target.num}. ${target.label}` : target.label;
      return a;
    };
    if (prev) nav.appendChild(link(prev, 'prev'));
    if (next) nav.appendChild(link(next, 'next'));
    p.el.appendChild(nav);
  });
}

function buildMeta(page, info, root) {
  const dl = page.querySelector('.guide-meta');
  const words = (root.textContent || '').trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.round(words / 230));
  const rows = [];
  if (info.kind === 'framework') rows.push(['Origin', info.meta.origin, 'guide-meta-origin']);
  rows.push(['Reading time', `${minutes} min`]);
  const hasTool = !!root.querySelector('.tool');
  const hasQuiz = !!root.querySelector('.quiz');
  const extras = [hasTool && (info.kind === 'framework' ? 'Interactive tool' : 'Picker'), hasQuiz && 'Quiz'].filter(Boolean);
  if (extras.length) rows.push(['Includes', extras.join(', ')]);
  dl.innerHTML = rows.map(([k, , cls]) => `<div${cls ? ` class="${cls}"` : ''}><dt>${k}</dt><dd></dd></div>`).join('');
  [...dl.querySelectorAll('dd')].forEach((dd, i) => { dd.textContent = rows[i][1]; });
}

/* ---- Contents rail: the way between sections -------------------------- */
function buildToc(page, panels, kind, slug) {
  const list = page.querySelector('.toc-list');
  const toggle = page.querySelector('.toc-toggle');
  const currentLabel = page.querySelector('.toc-toggle-current');
  const toc = page.querySelector('.toc');
  const chapterCount = panels.length - 1;

  list.innerHTML = panels.map(p => `
    <li><a class="toc-link${p.num ? '' : ' toc-link--intro'}" href="${hrefFor(kind, slug, p.id === INTRO_ID ? null : p.id)}" data-target="${p.id}">
      <span class="toc-num" aria-hidden="true">${p.num}</span><span class="toc-label"></span>
    </a></li>`).join('');
  [...list.querySelectorAll('.toc-label')].forEach((el, i) => { el.textContent = panels[i].label; });

  const setOpen = (open) => {
    toc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!toc.classList.contains('is-open')));
  list.addEventListener('click', () => setOpen(false));

  const links = [...list.querySelectorAll('.toc-link')];
  current.setActive = (id) => {
    links.forEach(a => {
      const on = a.dataset.target === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    const p = panels.find(x => x.id === id);
    currentLabel.textContent = !p ? '' : p.num ? `${p.num} of ${chapterCount} · ${p.label}` : p.label;
    setOpen(false);
  };
}

/* Show one panel. `anchor` is an element inside it to bring into view (a
   link to part of a section); otherwise the panel opens at its top. */
function showPanel(id, { anchor = null, focus = true } = {}) {
  if (!current) return;
  const { panels, page } = current;
  const index = Math.max(0, panels.findIndex(p => p.id === id));
  const panel = panels[index];
  panels.forEach(p => p.el.classList.toggle('is-current', p === panel));
  page.dataset.panel = panel.id === INTRO_ID ? 'intro' : 'chapter';
  if (index === panels.length - 1) page.dataset.last = ''; else delete page.dataset.last;
  current.panelId = panel.id;
  current.setActive?.(panel.id);
  // Widgets that size themselves to their container re-measure now that
  // their panel has a width.
  window.dispatchEvent(new Event('resize'));

  requestAnimationFrame(() => {
    if (anchor) {
      anchor.scrollIntoView({ block: 'start' });
    } else {
      // Open the panel at its top: the page top on the introduction, the top
      // of the guide column for a section if the reader is below it.
      const layout = page.querySelector('.guide-layout');
      const barH = document.querySelector('.bar')?.offsetHeight || 0;
      const top = panel.id === INTRO_ID ? 0 : Math.max(0, layout.getBoundingClientRect().top + window.scrollY - barH - 16);
      if (panel.id === INTRO_ID || window.scrollY > top) window.scrollTo({ top, behavior: 'auto' });
    }
    if (!focus) return;
    const h = panel.id === INTRO_ID ? page.querySelector('.guide-title') : panel.el.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });
}

function goToRoute(route) {
  if (!current) return;
  const { section, step } = route.params;
  let id = INTRO_ID;
  let anchor = null;
  if (section) {
    const el = current.root.querySelector(`#${CSS.escape(section)}`);
    const panelEl = el?.closest('.panel');
    if (panelEl) {
      id = panelEl.id;
      if (el !== panelEl) anchor = el;
    }
  } else if (step != null && current.chapters[step]) {
    id = current.chapters[step].id;
  }
  // Focus the guide title on the introduction and the section heading
  // otherwise, so screen readers announce where the reader landed.
  showPanel(id, { anchor });
}

/* ---- Footer: where next ----------------------------------------------
   One ruled list: previous and next in the family, the family's comparison
   guide, then related frameworks. A related framework that is already the
   previous or next guide is not listed twice; its "why" moves to that row. */
function buildFooter(page, info) {
  const foot = page.querySelector('.guide-foot');
  const cat = info.cat;
  const rows = [];
  const row = ({ href, kind, title, desc, cat: rowCat }) => `
    <li><a class="where-row" href="${href}"${rowCat ? ` data-cat="${rowCat}"` : ''}>
      <span class="where-text">
        ${kind ? `<span class="where-kind">${kind}</span>` : ''}
        <span class="where-title">${title}</span>
        ${desc ? `<span class="where-desc">${desc}</span>` : ''}
      </span>${ARROW_ROW}
    </a></li>`;

  if (info.kind === 'framework') {
    const { prev, next } = getSiblings(info.slug);
    // related entries are slugs or { slug, why }; "why" says how the two connect
    const related = (info.meta.related || [])
      .map(r => (typeof r === 'string' ? { slug: r } : r))
      .map(r => ({ fw: getFramework(r.slug), why: r.why }))
      .filter(r => r.fw);
    const whyFor = (fw) => related.find(r => r.fw.slug === fw.slug)?.why;
    const pager = new Set([prev?.slug, next?.slug].filter(Boolean));

    if (prev) rows.push(row({ href: hrefFor('framework', prev.slug), kind: `Previous in ${cat.name}`, title: prev.name, desc: whyFor(prev) || prev.question }));
    if (next) rows.push(row({ href: hrefFor('framework', next.slug), kind: `Next in ${cat.name}`, title: next.name, desc: whyFor(next) || next.question }));
    const guide = getComparisonGuide(cat.id);
    if (guide) rows.push(row({ href: hrefFor('compare', guide.slug), kind: '<span class="thumb thumb--sm" aria-hidden="true"></span>Comparison guide', title: guide.name, desc: guide.description }));
    related.filter(r => !pager.has(r.fw.slug)).forEach(({ fw, why }) => {
      rows.push(row({
        href: hrefFor('framework', fw.slug),
        kind: `<span class="thumb thumb--sm" aria-hidden="true"></span>${getCategory(fw.category).name}`,
        title: fw.name, desc: why || fw.question, cat: fw.category,
      }));
    });
  } else {
    // All four share this family, so the rows need no kicker.
    getFrameworksByCategory(cat.id).forEach(r => {
      rows.push(row({ href: hrefFor('framework', r.slug), title: r.name, desc: r.question }));
    });
  }
  foot.innerHTML = `<h2 class="guide-foot-title" id="where-next-title">Where next</h2>
    <nav aria-labelledby="where-next-title"><ul class="where-list">${rows.join('')}</ul></nav>`;
}

/* ---- Shared behaviours ----------------------------------------------- */
function wireLinks(root, kind, slug) {
  root.querySelectorAll('a[data-guide-link]').forEach(a => {
    const href = linkForGuideSlug(a.dataset.guideLink, a.dataset.guideSection);
    if (href) a.setAttribute('href', href);
  });
  root.querySelectorAll('a[data-section-link]').forEach(a => {
    const id = (a.getAttribute('href') || '').replace(/^#/, '');
    a.setAttribute('href', hrefFor(kind, slug, id));
  });
  root.querySelectorAll('a[href^="http"]').forEach(a => {
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

function wireQuizzes(root) {
  root.querySelectorAll('.quiz').forEach(quiz => {
    const items = [...quiz.querySelectorAll('.quiz-item')];
    let right = 0, answered = 0;
    const score = document.createElement('div');
    score.className = 'quiz-score';
    score.setAttribute('aria-live', 'polite');
    score.hidden = true;
    quiz.after(score);

    // Authors tend to put the right answer in the same slot. Spread the
    // correct answers evenly across positions (in a seeded order, so it is
    // stable between visits) and shuffle the distractors around them.
    const seed = items.map(it => it.querySelector('.quiz-q')?.textContent || '').join('|');
    const targets = seededShuffle(items.map((_, i) => i), seed);
    items.forEach((item, qi) => {
      const optionsList = item.querySelector('.quiz-options');
      const lis = [...optionsList.children];
      const correctLi = lis[Number(item.dataset.answer)];
      if (correctLi) {
        const others = seededShuffle(lis.filter(li => li !== correctLi), item.querySelector('.quiz-q')?.textContent || String(qi));
        const pos = targets[qi] % lis.length;
        others.splice(pos, 0, correctLi);
        others.forEach(li => optionsList.appendChild(li));
      }
      const answer = [...optionsList.children].indexOf(correctLi);
      const buttons = [...item.querySelectorAll('.quiz-options button')];
      const why = item.querySelector('.quiz-why');
      if (why) why.hidden = true;
      const verdict = document.createElement('p');
      verdict.className = 'quiz-verdict';
      verdict.hidden = true;
      if (why) why.prepend(verdict); else item.appendChild(verdict);

      const label = document.createElement('span');
      label.className = 'quiz-n';
      label.textContent = `Question ${qi + 1} of ${items.length}`;
      item.querySelector('.quiz-q')?.prepend(label);

      buttons.forEach((btn, bi) => {
        btn.addEventListener('click', () => {
          if (item.classList.contains('is-answered')) return;
          item.classList.add('is-answered');
          const ok = bi === answer;
          answered++; if (ok) right++;
          buttons.forEach((b, i) => {
            b.disabled = true;
            if (i === answer) b.dataset.state = 'correct';
            else if (i === bi) b.dataset.state = 'wrong';
          });
          verdict.hidden = false;
          verdict.dataset.state = ok ? 'correct' : 'wrong';
          verdict.textContent = ok ? 'Right.' : `Not quite. The answer is “${buttons[answer]?.textContent.trim()}”.`;
          if (why) why.hidden = false;
          if (answered === items.length) {
            score.hidden = false;
            score.innerHTML = `<p class="quiz-score-text"></p><button type="button" class="btn">Try again</button>`;
            score.querySelector('.quiz-score-text').textContent =
              `You got ${right} of ${items.length}. ` +
              (right === items.length ? 'You know this one.' : right >= items.length / 2 ? 'Review the questions you missed above.' : 'Worth rereading the earlier sections, then trying again.');
            score.querySelector('button').addEventListener('click', () => {
              right = 0; answered = 0; score.hidden = true;
              items.forEach(it => {
                it.classList.remove('is-answered');
                it.querySelectorAll('.quiz-options button').forEach(b => { b.disabled = false; delete b.dataset.state; });
                const w = it.querySelector('.quiz-why'); if (w) w.hidden = true;
                const v = it.querySelector('.quiz-verdict'); if (v) v.hidden = true;
              });
              items[0]?.querySelector('.quiz-options button')?.focus();
            });
          }
        });
      });
    });
  });
}

function seededShuffle(arr, seedText) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) { h ^= seedText.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rand = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function wireTemplates(root) {
  root.querySelectorAll('.template').forEach(t => {
    const pre = t.querySelector('pre');
    if (!pre || t.querySelector('.template-copy')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn template-copy';
    btn.innerHTML = `${COPY}<span>Copy</span>`;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText.trim());
        btn.querySelector('span').textContent = 'Copied';
      } catch (e) {
        btn.querySelector('span').textContent = 'Select and copy';
      }
      setTimeout(() => { btn.querySelector('span').textContent = 'Copy'; }, 1800);
    });
    t.prepend(btn);
  });
}

function wireResults(root, cleanup) {
  const outs = root.querySelectorAll('.tool-result');
  if (!outs.length) return;
  const last = new WeakMap();
  outs.forEach(o => last.set(o, o.textContent));
  const obs = new MutationObserver(muts => {
    const seen = new Set();
    muts.forEach(m => {
      const el = (m.target.nodeType === 3 ? m.target.parentElement : m.target)?.closest?.('.tool-result');
      if (!el || seen.has(el)) return;
      seen.add(el);
      if (last.get(el) === el.textContent) return;
      last.set(el, el.textContent);
      el.classList.remove('is-updated');
      void el.offsetWidth;
      el.classList.add('is-updated');
    });
  });
  outs.forEach(o => obs.observe(o, { childList: true, characterData: true, subtree: true }));
  cleanup.push(() => obs.disconnect());
}

/* Watch a scroller and report whether its content is wider than it:
   'more' (content beyond the right edge), 'end' (scrolled to the end) or
   null (fits). Re-checks on resize of the scroller or its content. */
function watchOverflow(scroller, content, onChange, cleanup) {
  let last;
  const check = () => {
    const extra = scroller.scrollWidth - scroller.clientWidth;
    const state = extra > 2 ? (scroller.scrollLeft >= extra - 2 ? 'end' : 'more') : null;
    if (state !== last) { last = state; onChange(state); }
  };
  scroller.addEventListener('scroll', check, { passive: true });
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(check);
    ro.observe(scroller);
    if (content) ro.observe(content);
    cleanup.push(() => ro.disconnect());
  } else {
    window.addEventListener('resize', check);
    cleanup.push(() => window.removeEventListener('resize', check));
  }
  check();
}

function wireTables(root, cleanup) {
  // Each .table-wrap becomes a still frame: the caption is shown as a title
  // above an inner scroller, so it never runs off the edge with the columns.
  // The real <caption> stays for assistive tech, visually hidden; the scroller
  // is a labelled, focusable region so keyboard users can scroll it.
  root.querySelectorAll('.table-wrap').forEach(wrap => {
    const table = wrap.querySelector(':scope > table');
    if (!table || wrap.querySelector(':scope > .table-scroll')) return;
    const cap = table.querySelector(':scope > caption');
    const capText = cap ? cap.textContent.trim() : '';

    const scroll = document.createElement('div');
    scroll.className = 'table-scroll';
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('tabindex', '0');
    if (capText) scroll.setAttribute('aria-label', capText);
    table.before(scroll);
    scroll.appendChild(table);

    let more = null;
    if (cap) {
      cap.classList.add('visually-hidden');
      const title = document.createElement('p');
      title.className = 'table-title';
      title.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.textContent = capText;
      more = document.createElement('span');
      more.className = 'table-more';
      more.textContent = 'Scroll for more columns';
      title.append(text, more);
      wrap.prepend(title);
    }
    // A table with prose cells gets a readable minimum width on phones.
    if ([...table.querySelectorAll('td, th:not([scope="rowgroup"])')].some(c => c.textContent.trim().length > 40)) table.dataset.prose = '';
    if (table.classList.contains('table--stack')) labelCells(table);
    watchOverflow(scroll, table, state => {
      if (state) wrap.dataset.overflow = state; else delete wrap.dataset.overflow;
    }, cleanup);
  });
}

// For .table--stack: give each data cell its column's name, shown above the
// value when the rows stack on phones. Group rows (one cell across the whole
// row) stay as headings.
function labelCells(table) {
  const heads = [];
  table.querySelectorAll(':scope > thead > tr:last-child > *').forEach(th => {
    const span = Number(th.getAttribute('colspan')) || 1;
    for (let i = 0; i < span; i++) heads.push(th.textContent.trim());
  });
  if (!heads.length) return;
  table.querySelectorAll(':scope > tbody > tr, :scope > tfoot > tr').forEach(tr => {
    const cells = [...tr.children];
    if (cells.length === 1 && (Number(cells[0].getAttribute('colspan')) || 1) > 1) { tr.classList.add('is-group'); return; }
    let col = 0;
    cells.forEach(cell => {
      const span = Number(cell.getAttribute('colspan')) || 1;
      if (cell.tagName === 'TD' && col > 0 && heads[col] && !cell.querySelector(':scope > .cell-label')) {
        const label = document.createElement('span');
        label.className = 'cell-label';
        label.textContent = heads[col];
        cell.prepend(label);
      }
      col += span;
    });
  });
}

function wireFigures(root, cleanup) {
  // A figure wider than the screen scrolls inside itself (.figure) or inside
  // a .figure-scroll wrapper. Say so while it does, and let keyboard users
  // focus it to scroll.
  const scrollers = [...root.querySelectorAll('.figure-scroll'),
    ...[...root.querySelectorAll('.figure')].filter(f => !f.querySelector('.figure-scroll'))];
  scrollers.forEach(sc => {
    const hint = document.createElement('p');
    hint.className = 'scroll-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = 'Scroll sideways to see the whole figure';
    hint.hidden = true;
    const cap = sc.querySelector(':scope > figcaption');
    if (sc.classList.contains('figure-scroll')) sc.after(hint);
    else if (cap) cap.before(hint);
    else sc.append(hint);
    const hadTab = sc.hasAttribute('tabindex');
    watchOverflow(sc, sc.firstElementChild, state => {
      hint.hidden = !state;
      if (!hadTab) {
        if (state) sc.setAttribute('tabindex', '0'); else sc.removeAttribute('tabindex');
      }
    }, cleanup);
  });
}

function wireCardKeys(root) {
  // A key longer than a couple of characters is a word label, set in the
  // interface face (.card-key--tag) rather than as a serif mark.
  root.querySelectorAll('.card-key').forEach(k => {
    if (k.textContent.trim().length > 2) k.classList.add('card-key--tag');
  });
}

function runScript(code, root, cleanup) {
  if (!code || !code.trim()) return;
  const api = {
    onCleanup: (fn) => cleanup.push(fn),
    goTo: (id) => {
      if (!current) return;
      window.location.hash = hrefFor(current.kind, current.slug, id);
    },
  };
  try {
    // eslint-disable-next-line no-new-func
    new Function('root', 'api', `"use strict";\n${code}`)(root, api);
  } catch (err) {
    console.error(`[guide] script error in ${current?.key}:`, err);
  }
}
