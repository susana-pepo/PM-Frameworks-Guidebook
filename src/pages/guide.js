/**
 * Guide renderer: framework guides and comparison guides.
 *
 * Content is a canonical fragment in public/guides/<file> (docs/content-spec.md).
 * This module supplies every piece of chrome around it: breadcrumb, header,
 * contents rail, section numbers, the footer with neighbouring guides, and
 * the shared behaviours (quiz, copy, links, live
 * results).
 *
 * A guide is read one section at a time. The introduction and each chapter
 * are panels; only the current one is shown, and the contents rail (a
 * "Contents" bar on narrow screens) is the only way between them. On wide
 * screens the rail runs the full height of the window and stays put while
 * the reading column scrolls. Each panel has its
 * own address, #/<kind>/<slug>/<section>, so back and forward step through
 * the sections a reader visited. A guide's own <script data-guide-script> runs scoped to the
 * guide with `root` and `api`, and is torn down when the guide unmounts.
 */
import {
  getFramework, getCategory, getComparisonBySlug, getComparisonGuide,
  getFrameworksByCategory,
} from '../data/frameworks.js';
import { setPageMeta } from '../utils/page-meta.js';
import { CREDIT } from '../components/credit.js';
import { renderNotFound } from './not-found.js';

const cache = new Map();
let current = null;     // { key, kind, slug, title, root, page, cleanup[], panels[], panelId, transition }
let navSeq = 0;         // increments on every section change; stale callbacks compare against it
const INTRO_ID = 'intro';
let renderToken = 0;

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

  const guide = isFw ? getComparisonGuide(cat.id) : null;
  container.innerHTML = `
    <div class="page guide-page" data-cat="${cat.id}" data-kind="${kind}">
      <div class="guide-layout">
        <aside class="guide-rail" aria-label="Contents">
          <nav class="toc" aria-labelledby="toc-title">
            <button class="toc-toggle" type="button" aria-expanded="false" aria-controls="toc-sheet">
              <span class="toc-toggle-label"></span>
              <span class="toc-toggle-current"></span>
              ${CHEVRON}
            </button>
            <div class="toc-sheet" id="toc-sheet">
              <p class="toc-title" id="toc-title"></p>
              <ol class="toc-list" id="toc-list"></ol>
              <ul class="toc-foot">
                <li><a class="toc-foot-link" href="#/category/${cat.id}"><span class="thumb thumb--sm" aria-hidden="true"></span>${cat.name}<span class="visually-hidden"> frameworks</span></a></li>
                ${guide ? `<li><a class="toc-foot-link" href="${hrefFor('compare', guide.slug)}">How to choose<span class="visually-hidden"> a ${cat.name.toLowerCase()} framework</span></a></li>` : ''}
              </ul>
            </div>
          </nav>
        </aside>
        <div class="guide-main">
          <header class="guide-head">
            <h1 class="guide-title"></h1>
            <p class="guide-question"></p>
            ${isFw ? `<p class="guide-origin"><span class="guide-origin-k">Origin</span> <span class="guide-origin-v"></span></p>` : ''}
          </header>
          <div class="guide-body"></div>
          <footer class="guide-foot"></footer>
          <p class="guide-credit">${CREDIT}</p>
        </div>
      </div>
    </div>`;
  container.querySelector('.guide-title').textContent = info.title;
  container.querySelector('.guide-question').textContent = isFw ? info.meta.question : cat.when;
  container.querySelector('.toc-title').textContent = info.title;
  container.querySelector('.toc-toggle-label').textContent = isFw ? info.title : 'How to choose';
  if (isFw) container.querySelector('.guide-origin-v').textContent = info.meta.origin;

  const page = container.querySelector('.guide-page');
  const body = page.querySelector('.guide-body');
  body.innerHTML = parsed.html;
  const root = body.querySelector('article.guide');
  root.dataset.cat = cat.id;

  const cleanup = [];
  current = { key: `${kind}:${slug}`, kind, slug, title: info.title, root, page, cleanup, chapters: [] };

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
  buildToc(page, panels, kind, slug, cleanup);
  buildIntroContents(panels, kind, slug);
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
  // A section that reads the hero figure gets its own copy of it
  // (<div data-hero-ref></div>), since the introduction is not on screen.
  const hero = root.querySelector('figure[data-hero]');
  root.querySelectorAll('[data-hero-ref]').forEach(slot => {
    if (!hero) { slot.remove(); return; }
    const copy = hero.cloneNode(true);
    copy.removeAttribute('id');
    copy.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    copy.querySelectorAll('[aria-labelledby], [aria-describedby]').forEach(el => { el.removeAttribute('aria-labelledby'); el.removeAttribute('aria-describedby'); });
    slot.replaceWith(copy);
  });
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

/* On narrow screens the contents live in a collapsed bar, so the
   introduction lists the sections itself (hidden where the rail shows). */
function buildIntroContents(panels, kind, slug) {
  const intro = panels[0].el;
  const nav = document.createElement('nav');
  nav.className = 'intro-contents';
  nav.setAttribute('aria-label', 'Sections');
  nav.innerHTML = `<p class="intro-contents-title">In this guide</p><ol class="intro-contents-list">${panels.slice(1).map(p => `
    <li><a class="intro-contents-link" href="${hrefFor(kind, slug, p.id)}"><span class="toc-num" aria-hidden="true">${p.num}</span><span class="intro-contents-label"></span></a></li>`).join('')}</ol>`;
  [...nav.querySelectorAll('.intro-contents-label')].forEach((el, i) => { el.textContent = panels[i + 1].label; });
  intro.appendChild(nav);
}

/* ---- Contents rail: the way between sections -------------------------- */
function buildToc(page, panels, kind, slug, cleanup) {
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
  toc.querySelector('.toc-sheet').addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  // The phone sheet floats over the page: Escape or a tap outside closes it.
  const onKey = (e) => {
    if (e.key === 'Escape' && toc.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  };
  const onDown = (e) => {
    if (toc.classList.contains('is-open') && !toc.contains(e.target)) setOpen(false);
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onDown);
  cleanup.push(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); });

  const links = [...list.querySelectorAll('.toc-link')];
  // One highlight that slides to the current section, so a change of
  // section reads as movement along the contents, not a jump.
  const marker = document.createElement('span');
  marker.className = 'toc-marker';
  marker.setAttribute('aria-hidden', 'true');
  list.prepend(marker);
  const rail = page.querySelector('.guide-rail');
  const place = (a) => {
    if (!a) return;
    const top = a.getBoundingClientRect().top - list.getBoundingClientRect().top;
    marker.style.transform = `translateY(${Math.round(top)}px)`;
    marker.style.height = `${a.offsetHeight}px`;
  };
  // Fonts and the sheet can change row heights; keep the marker on its row.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => place(links.find(a => a.classList.contains('is-active'))));
    ro.observe(list);
    cleanup.push(() => ro.disconnect());
  }
  current.setActive = (id) => {
    let activeLink = null;
    links.forEach(a => {
      const on = a.dataset.target === id;
      a.classList.toggle('is-active', on);
      if (on) { a.setAttribute('aria-current', 'step'); activeLink = a; } else a.removeAttribute('aria-current');
    });
    place(activeLink);
    if (!marker.classList.contains('is-ready')) requestAnimationFrame(() => marker.classList.add('is-ready'));
    // Keep the current row in view inside the rail on short windows.
    if (activeLink && rail && rail.scrollHeight > rail.clientHeight) {
      const top = activeLink.getBoundingClientRect().top - rail.getBoundingClientRect().top;
      if (top < 0 || top > rail.clientHeight - activeLink.offsetHeight) rail.scrollTo({ top: rail.scrollTop + top - rail.clientHeight / 3 });
    }
    const p = panels.find(x => x.id === id);
    currentLabel.textContent = !p ? '' : p.num ? `${p.num} of ${chapterCount} · ${p.label}` : p.label;
    toggle.setAttribute('aria-label', `Contents. ${p && p.num ? `Section ${p.num} of ${chapterCount}, ${p.label}` : 'Introduction'}`);
    setOpen(false);
  };
}

/* Show one panel. `anchor` is an element inside it to bring into view (a
   link to part of a section); otherwise the panel opens at its top.
   A change of section crossfades the reading column (old content fades out
   in 120ms while the new rises 4px and fades in over 200ms) with the View
   Transitions API; the rail stays live, so its highlight slides at the same
   time. Without that API, or with reduced motion, the new section fades in. */
function showPanel(id, { anchor = null, focus = true } = {}) {
  if (!current) return;
  const { panels, page } = current;
  const index = Math.max(0, panels.findIndex(p => p.id === id));
  const panel = panels[index];
  const changed = current.panelId && current.panelId !== panel.id;
  // Only the latest request counts: a quick second click cancels the first
  // transition, and a late callback from it changes nothing.
  const seq = ++navSeq;
  let applied = false;

  const swap = () => {
    if (seq !== navSeq || applied) return;
    applied = true;
    panels.forEach(p => p.el.classList.toggle('is-current', p === panel));
    page.dataset.panel = panel.id === INTRO_ID ? 'intro' : 'chapter';
    if (index === panels.length - 1) page.dataset.last = ''; else delete page.dataset.last;
    current.panelId = panel.id;
    current.setActive?.(panel.id);
    setPageMeta({ title: panel.id === INTRO_ID ? current.title : `${panel.label} · ${current.title}`, focus: false });
    if (anchor) anchor.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const after = () => {
    // Widgets that size themselves to their container re-measure now that
    // their panel has a width.
    window.dispatchEvent(new Event('resize'));
    if (!focus) return;
    const h = panel.id === INTRO_ID ? page.querySelector('.guide-title') : panel.el.querySelector('h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  };

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  current.transition?.skipTransition();
  if (changed && !still && document.startViewTransition && document.visibilityState === 'visible') {
    current.transition = document.startViewTransition(swap);
    current.transition.updateCallbackDone.then(after, after);
    // A skipped transition rejects `ready`; that is expected, not an error.
    current.transition.ready.catch(() => {});
    // If the browser holds the transition back (a throttled frame), the
    // section still changes promptly.
    setTimeout(() => { if (!applied && seq === navSeq) { swap(); after(); } }, 300);
    return;
  }
  swap();
  if (changed) enterPanel(page.querySelector('.guide-main'));
  requestAnimationFrame(after);
}

/* Fallback for browsers without view transitions: the new section fades in
   (and rises 4px unless reduced motion is on). Web Animations, so a quick
   second click cancels the first instead of restarting from zero. */
function enterPanel(el) {
  if (!el?.animate) return;
  el.getAnimations().forEach(a => a.cancel());
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.animate(
    [{ opacity: 0, transform: `translateY(${still ? 0 : 4}px)` }, { opacity: 1, transform: 'none' }],
    { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  );
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
   Closes the last section. On a framework guide: the other frameworks in
   the family, then related frameworks from other families, each with a line
   on how it connects. On a comparison guide: the frameworks it compares.
   The comparison guide itself is in the contents rail, so it is not repeated. */
function buildFooter(page, info) {
  const foot = page.querySelector('.guide-foot');
  const cat = info.cat;
  const rows = [];
  const row = ({ href, title, desc, cat: rowCat }) => `
    <li><a class="where-row" href="${href}"${rowCat ? ` data-cat="${rowCat.id}"` : ''}>
      <span class="where-text">
        ${rowCat ? `<span class="where-kind"><span class="thumb thumb--sm" aria-hidden="true"></span>${rowCat.name}</span>` : ''}
        <span class="where-title">${title}</span>
        ${desc ? `<span class="where-desc">${desc}</span>` : ''}
      </span>${ARROW_ROW}
    </a></li>`;

  if (info.kind === 'framework') {
    const related = (info.meta.related || [])
      .map(r => (typeof r === 'string' ? { slug: r } : r))
      .map(r => ({ fw: getFramework(r.slug), why: r.why }))
      .filter(r => r.fw);
    const whyFor = (fw) => related.find(r => r.fw.slug === fw.slug)?.why;
    // Same family first, in family order; no family label, the reader is in it.
    getFrameworksByCategory(cat.id).filter(fw => fw.slug !== info.slug).forEach(fw => {
      rows.push(row({ href: hrefFor('framework', fw.slug), title: fw.name, desc: whyFor(fw) || fw.question }));
    });
    related.filter(r => r.fw.category !== cat.id).forEach(({ fw, why }) => {
      rows.push(row({ href: hrefFor('framework', fw.slug), title: fw.name, desc: why || fw.question, cat: getCategory(fw.category) }));
    });
  } else {
    getFrameworksByCategory(cat.id).forEach(r => {
      rows.push(row({ href: hrefFor('framework', r.slug), title: r.name, desc: r.question }));
    });
  }
  foot.innerHTML = `<h2 class="guide-foot-title" id="where-next-title">Where next</h2>
    <nav aria-labelledby="where-next-title"><ul class="where-list">${rows.join('')}</ul></nav>`;
}

/* For the search palette: the sections of the guide on screen. */
export function getGuideOutline() {
  if (!current) return null;
  return {
    title: current.title,
    sections: current.panels.map(p => ({ label: p.label, num: p.num, href: hrefFor(current.kind, current.slug, p.id === INTRO_ID ? null : p.id) })),
  };
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
      // data-section names the section that teaches this question.
      const teach = item.dataset.section && root.querySelector(`section.chapter#${CSS.escape(item.dataset.section)}`);
      if (why && teach && !why.querySelector('.quiz-revisit')) {
        const p = document.createElement('p');
        p.className = 'quiz-revisit';
        const link = document.createElement('a');
        link.href = hrefFor(current.kind, current.slug, teach.id);
        link.textContent = teach.dataset.nav || teach.querySelector('h2')?.textContent || '';
        p.append('Revisit: ', link);
        why.appendChild(p);
      }
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
  const lastTick = new WeakMap();
  outs.forEach(o => last.set(o, o.textContent));
  const obs = new MutationObserver(muts => {
    const seen = new Set();
    muts.forEach(m => {
      const el = (m.target.nodeType === 3 ? m.target.parentElement : m.target)?.closest?.('.tool-result');
      if (!el || seen.has(el)) return;
      seen.add(el);
      if (last.get(el) === el.textContent) return;
      last.set(el, el.textContent);
      // A brief settle shows the number changed. While a value is being
      // dragged (changes under 400ms apart) it stays still.
      const now = performance.now();
      const prev = lastTick.get(el) || 0;
      lastTick.set(el, now);
      if (now - prev < 400 || !el.animate) return;
      el.getAnimations().forEach(a => a.cancel());
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.animate(
        [{ opacity: 0.55, transform: `translateY(${still ? 0 : 2}px)` }, { opacity: 1, transform: 'none' }],
        { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
      );
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
    // A caption marked visually-hidden (because the heading above already
    // names the table) stays for screen readers and gets no visible title.
    if (cap && !cap.classList.contains('visually-hidden')) {
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
