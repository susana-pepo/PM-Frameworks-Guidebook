#!/usr/bin/env node
/**
 * Guide checker. Validates public/guides/<File>.html against
 * docs/content-spec.md and smoke-tests its script in jsdom.
 *
 *   node scripts/check-guide.mjs RICE-Framework-Guide.html [more files…]
 *   node scripts/check-guide.mjs --all
 *
 * Exit code 1 if any file has errors. Warnings do not fail the run.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import { frameworks, comparisonGuides } from '../src/data/frameworks.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GUIDES = join(ROOT, 'public', 'guides');

const SLUG_FILES = new Map([...frameworks, ...comparisonGuides].map(g => [g.slug, g.file]));
const FILE_TO_SLUG = Object.fromEntries([...SLUG_FILES].map(([slug, file]) => [file, slug]));

const COMPONENT_CLASSES = new Set(`guide guide-intro lede summary summary-title more tool-links chapter chapter-head chapter-dek
callout callout--tip callout--caution callout-title cards card card-key card-title card-q card-meta
steps step-title step-note scale scale-value scale-label scale-note formula op formula-result
table-wrap table table--compare is-top num fit fit-col contrast contrast-col contrast-label
pitfalls pitfall-title pitfall-fix example example-label example-reading figure facts agenda agenda-time
template template-title chain chain-name chain-note decision decision-q decision-if scenarios scenario-q scenario-a
tool tool-head tool-title tool-hint fields field field-help field-label tool-actions tool-output tool-output-label
tool-result tool-output-note choices choice btn btn--primary btn--quiet quiz quiz-item quiz-q quiz-options quiz-why
is-error visually-hidden agenda-title formula-term table--stack card-key--tag card-key--sm checks check-state
key-dot figure-scroll`.split(/\s+/));

const BANNED = [
  [/game[- ]changer/i, 'game-changer'], [/move the needle/i, 'move the needle'], [/supercharge/i, 'supercharge'],
  [/\bunlock(s|ed|ing)?\b/i, 'unlock'], [/\bseamless(ly)?\b/i, 'seamless'], [/\bmagic(al)?\b/i, 'magic'],
  [/secret sauce/i, 'secret sauce'], [/brutally honest/i, 'brutally honest'], [/BS detector/i, 'BS detector'],
  [/future[- ]you/i, 'future-you'], [/at the end of the day/i, 'at the end of the day'], [/\bpro (tip|move)\b/i, 'pro tip'],
  [/\bdelve\b/i, 'delve'], [/\bthe gold\b/i, 'the gold'], [/it'?s not just .{1,40}, it'?s/i, "it's not just X, it's Y"],
  [/\bpowerful\b/i, 'powerful'], [/\bgame plan\b/i, 'game plan'], [/\bleverage\b/i, 'leverage (verb)'],
];
// Capitalised words that are names, not shouting. The check only sees words of four or more capitals.
const ACRONYMS = /^(RICE|AARRR|CIRCLES|STAR|JTBD|OKRS?|SCQA|MECE|BLUF|ERRC|HEART|KPIS?|SAAS|ARPU|SWOT|PEST|DACI|RACI|SMART|HIPPO|HIPPOS|SLAS|IDEO|SKUS|ROAS|EBITDA|NASA|LEGO|IKEA|SLACK|NIKE|APPLE|HTML|JSON|HTTP|REST|MAUS|DAUS|ARPPU|GDPR|SCAMPER|MIDI|STARL|CARL|WALS?|KANO)$/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F2FF}\u{FE0F}]/u;

function check(file) {
  const errors = [], warns = [];
  const path = join(GUIDES, file);
  if (!existsSync(path)) return { file, errors: [`missing file ${path}`], warns };
  const src = readFileSync(path, 'utf8');
  const slugExpected = FILE_TO_SLUG[file];

  // ---- Raw-source checks ----
  if (/<(html|head|body|link)\b/i.test(src)) errors.push('contains <html>/<head>/<body>/<link>');
  if (/\son[a-z]+\s*=/i.test(src.replace(/<script[\s\S]*?<\/script>/gi, ''))) errors.push('inline event handler attribute (on…=)');
  const emoji = src.match(EMOJI);
  if (emoji) errors.push(`emoji or symbol-emoji present: "${emoji[0]}" near …${src.slice(Math.max(0, emoji.index - 40), emoji.index + 10).replace(/\s+/g, ' ')}…`);
  if (/\.html['"]/.test(src)) errors.push('links to a .html file (use data-guide-link)');
  if (/document\.getElementById|window\.(goTo|go)\b|location\.href/.test(src)) errors.push('script uses document.getElementById / window.goTo / location.href');

  const dom = new JSDOM(`<!doctype html><body>${src}</body>`);
  const { document } = dom.window;
  const article = document.querySelector('article.guide');
  if (!article) { errors.push('no <article class="guide">'); return { file, errors, warns }; }
  if (slugExpected && article.dataset.guide !== slugExpected) errors.push(`data-guide="${article.dataset.guide}" should be "${slugExpected}"`);
  const slug = article.dataset.guide;

  // Inline styles may only set custom properties (the spec uses them for --x/--y plot coordinates).
  article.querySelectorAll('[style]').forEach(el => {
    const decls = el.getAttribute('style').split(';').map(s => s.trim()).filter(Boolean);
    const bad = decls.filter(d => !d.startsWith('--'));
    if (bad.length) errors.push(`inline style on <${el.tagName.toLowerCase()} class="${el.className}">: ${bad.join('; ')}`);
  });

  // Structure
  const intro = article.querySelector(':scope > header.guide-intro');
  if (!intro) errors.push('missing header.guide-intro');
  else if (!intro.querySelector('.lede')) errors.push('guide-intro has no .lede');
  if (intro && !intro.querySelector('.summary')) warns.push('guide-intro has no .summary');
  const chapters = [...article.querySelectorAll(':scope > section.chapter')];
  if (chapters.length < 3) errors.push(`only ${chapters.length} chapters`);
  const ids = new Set();
  chapters.forEach(ch => {
    if (!ch.id) errors.push('chapter without id');
    if (!ch.dataset.nav) errors.push(`chapter #${ch.id} without data-nav`);
    else if (ch.dataset.nav.length > 22) warns.push(`chapter #${ch.id} data-nav is long: "${ch.dataset.nav}"`);
    const head = ch.querySelector(':scope > header.chapter-head');
    if (!head || !head.querySelector('h2')) errors.push(`chapter #${ch.id} lacks header.chapter-head > h2`);
    if (ch.querySelectorAll('h2').length > 1) errors.push(`chapter #${ch.id} has more than one h2`);
  });
  article.querySelectorAll('[id]').forEach(el => {
    if (ids.has(el.id)) errors.push(`duplicate id "${el.id}"`);
    ids.add(el.id);
  });
  if (article.querySelectorAll('h1').length) errors.push('contains an h1 (the app draws the title)');
  if (article.querySelectorAll('[data-hero]').length > 1) errors.push('more than one data-hero');

  // Classes outside widgets must come from the vocabulary.
  const widgetRoots = [...article.querySelectorAll('.figure, .tool')];
  const unknown = new Set();
  article.querySelectorAll('[class]').forEach(el => {
    if (widgetRoots.some(w => w !== el && w.contains(el))) return;
    el.classList.forEach(c => { if (!COMPONENT_CLASSES.has(c)) unknown.add(c); });
  });
  if (unknown.size) errors.push(`classes outside the vocabulary (only allowed inside .figure/.tool): ${[...unknown].join(', ')}`);

  // Headings: no skipped levels inside chapters.
  chapters.forEach(ch => {
    let prev = 2;
    ch.querySelectorAll('h2, h3, h4, h5, h6').forEach(h => {
      const lvl = Number(h.tagName[1]);
      if (lvl > prev + 1) errors.push(`#${ch.id}: heading jumps from h${prev} to h${lvl} ("${h.textContent.trim().slice(0, 40)}")`);
      prev = lvl;
    });
  });

  // Tables
  article.querySelectorAll('table').forEach((t, i) => {
    if (!t.classList.contains('table')) errors.push(`table #${i + 1} missing class="table"`);
    if (!t.parentElement.classList.contains('table-wrap')) errors.push(`table #${i + 1} not wrapped in .table-wrap`);
    if (!t.querySelector('caption')) errors.push(`table #${i + 1} has no caption`);
    if (t.querySelector('th:not([scope])')) errors.push(`table #${i + 1} has <th> without scope`);
    if (t.querySelectorAll('tr.is-top').length > 1) errors.push(`table #${i + 1} has more than one tr.is-top`);
  });
  article.querySelectorAll('td[data-rating]').forEach(td => {
    if (!['high', 'midhigh', 'mid', 'low'].includes(td.dataset.rating)) errors.push(`data-rating="${td.dataset.rating}" invalid`);
    if (!td.textContent.trim()) errors.push('rating cell with no text');
  });

  // Links
  article.querySelectorAll('a[data-guide-link]').forEach(a => {
    if (!SLUG_FILES.has(a.dataset.guideLink)) errors.push(`data-guide-link="${a.dataset.guideLink}" is not a known slug`);
    const sec = a.dataset.guideSection;
    if (sec) {
      const target = SLUG_FILES.get(a.dataset.guideLink);
      const html = target && existsSync(join(GUIDES, target)) ? readFileSync(join(GUIDES, target), 'utf8') : '';
      if (!html.includes(`id="${sec}"`)) errors.push(`data-guide-section="${sec}" not found in ${a.dataset.guideLink}`);
    }
  });
  article.querySelectorAll('a[data-section-link]').forEach(a => {
    const id = (a.getAttribute('href') || '').replace(/^#/, '');
    if (!ids.has(id)) errors.push(`section link to missing #${id}`);
  });
  article.querySelectorAll('a:not([data-guide-link]):not([data-section-link])').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (!/^https?:\/\//.test(h)) errors.push(`link with href="${h}" (use data-guide-link or data-section-link)`);
  });

  // Forms
  article.querySelectorAll('input, select, textarea').forEach(el => {
    const labelled = (el.id && article.querySelector(`label[for="${el.id}"]`)) || el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (!labelled) errors.push(`form control without a label: <${el.tagName.toLowerCase()} id="${el.id}">`);
  });
  article.querySelectorAll('button').forEach(b => {
    if (b.getAttribute('type') !== 'button') errors.push(`button without type="button": "${b.textContent.trim().slice(0, 30)}"`);
  });

  // Quiz. An explanation that pastes a sentence from the guide teaches
  // nothing new, so collect the 7-word runs of the text outside the quiz.
  const runs = new Set();
  article.querySelectorAll('p, li, dd, td').forEach(el => {
    if (el.closest('.quiz')) return;
    const w = el.textContent.toLowerCase().split(/\s+/).filter(Boolean);
    for (let i = 0; i + 7 <= w.length; i++) runs.add(w.slice(i, i + 7).join(' '));
  });
  article.querySelectorAll('.quiz-item').forEach((q, i) => {
    const n = q.querySelectorAll('.quiz-options button').length;
    const a = Number(q.dataset.answer);
    if (!Number.isInteger(a) || a < 0 || a >= n) errors.push(`quiz item ${i + 1}: data-answer="${q.dataset.answer}" with ${n} options`);
    const why = q.querySelector('.quiz-why')?.textContent.trim() || '';
    if (/^(correct|right|wrong|incorrect|yes|no)\b/i.test(why)) errors.push(`quiz item ${i + 1}: explanation starts with a verdict ("${why.slice(0, 20)}")`);
    if (!why) warns.push(`quiz item ${i + 1}: no explanation`);
    if (q.dataset.section && !chapters.some(c => c.id === q.dataset.section)) errors.push(`quiz item ${i + 1}: data-section="${q.dataset.section}" is not a chapter id`);
    if (why && [...runs].some(run => why.toLowerCase().includes(run))) warns.push(`quiz item ${i + 1}: explanation repeats a 7-word run from the guide`);
  });

  // Each section is shown on its own, so text must not point at another
  // section by position. Link it by name with data-section-link instead.
  const visible = article.textContent;
  const positional = visible.match(/\b(at the top of this (guide|page)|(the )?(previous|next|last) (chapter|section)|the chapter (before|after) (this|it)|earlier in this guide|later in this guide)\b/i);
  if (positional) errors.push(`points at another section by position: "${positional[0]}" (name it and use data-section-link)`);
  const above = [...article.querySelectorAll('p, li, figcaption, dd')].map(el => el.textContent).find(t => /\b(shown above|see above|figure above|map above|chart above|diagram above|curve above|canvas above)\b/i.test(t));
  if (above) warns.push(`"above" may point at a figure in another section: "${above.slice(0, 70)}"`);

  if (article.querySelector('[data-hero-ref]') && !article.querySelector('figure[data-hero]')) errors.push('data-hero-ref without a hero figure');
  // Two callouts in a row read as one box after another; fold one into prose.
  article.querySelectorAll('.callout + .callout').forEach(c => warns.push(`two callouts in a row: "${c.textContent.trim().slice(0, 40)}"`));
  // A dek should add a fact its heading lacks.
  const wordSet = (t) => new Set(t.toLowerCase().match(/[a-z]{4,}/g) || []);
  chapters.forEach(ch => {
    const h = ch.querySelector('h2')?.textContent || '';
    const dek = ch.querySelector('.chapter-dek')?.textContent || '';
    if (!dek) return;
    const hw = wordSet(h); const shared = [...wordSet(dek)].filter(w => hw.has(w));
    if (shared.length >= 3) warns.push(`#${ch.id} dek repeats its heading (${shared.join(', ')})`);
  });

  // Copy rules on visible text (excluding script/style)
  const text = [...article.querySelectorAll('*')].filter(el => !el.closest('script, style'))
    .map(el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ')).join(' ');
  BANNED.forEach(([re, label]) => { const m = text.match(re); if (m) errors.push(`banned phrase "${label}": "${m[0]}"`); });
  if (/!(\s|$|<)/.test(text.replace(/!=/g, ''))) {
    const m = text.match(/[^.!?]{0,40}!(\s|$)/);
    errors.push(`exclamation mark: "${m ? m[0].trim() : '!'}"`);
  }
  const caps = text.match(/\b[A-Z]{4,}\b/g)?.filter(w => !ACRONYMS.test(w)) || [];
  if (caps.length) warns.push(`ALL-CAPS words (emphasis?): ${[...new Set(caps)].slice(0, 8).join(', ')}`);
  const paras = [...article.querySelectorAll('p, li')].filter(el => !el.closest('script, style'));
  const dashy = paras.filter(p => (p.textContent.match(/—/g) || []).length > 1);
  if (dashy.length) errors.push(`${dashy.length} paragraph(s) with more than one em dash, e.g. "${dashy[0].textContent.trim().slice(0, 70)}…"`);
  const emTotal = (text.match(/—/g) || []).length;
  const words = text.split(/\s+/).length;
  if (emTotal / words > 1 / 250) warns.push(`em dash density ${emTotal} in ${words} words`);
  if (article.querySelector('em, i, u, b, font, center')) warns.push('uses <em>/<i>/<u>/<b>/<font>');
  article.querySelectorAll('h2, h3, h4, .step-title, .card-title, .pitfall-title, .callout-title, figcaption, .chapter-dek').forEach(h => {
    const t = h.textContent.trim();
    if (/\.$/.test(t) && !/\.\.\.$|…$/.test(t) && !/[a-z]\.[a-z]\.$/i.test(t) && t.split(/[.!?]\s/).length < 2) warns.push(`heading/label ends with a period: "${t.slice(0, 50)}"`);
    if (/^[A-Z][a-z]+( [A-Z][a-z]+){3,}/.test(t) && h.tagName !== 'FIGCAPTION') warns.push(`possible Title Case heading: "${t.slice(0, 50)}"`);
  });

  // ---- Style block ----
  const styleEls = [...document.querySelectorAll('style')];
  styleEls.forEach(s => { if (!s.hasAttribute('data-guide-style')) errors.push('<style> without data-guide-style'); });
  const css = styleEls.map(s => s.textContent).join('\n');
  if (css.trim()) {
    const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    if (/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(noComments.replace(/url\([^)]*\)/g, ''))) errors.push('widget CSS uses a literal colour (hex/rgb/hsl)');
    if (/\b(white|black|red|green|blue|yellow|orange|purple|pink|gray|grey)\b\s*[;}!]/i.test(noComments)) errors.push('widget CSS uses a named colour');
    // Coloured stripes on one side of a box are banned (use a fill or a .key-dot); legend swatches are fine
    for (const m of noComments.matchAll(/([^{}]+)\{[^}]*border-(?:top|left|right|bottom)\s*:\s*([2-9]|\d{2,})px\s+solid\s+var\(--(?:series|cat)[^)]*\)/g)) {
      if (!/swatch/.test(m[1])) errors.push(`coloured stripe border on "${m[1].trim().slice(0, 80)}" (use a fill or .key-dot)`);
    }
    if (/font-family\s*:(?!\s*var\(--font-(sans|serif)\))/i.test(noComments)) errors.push('widget CSS sets a font-family other than var(--font-sans|serif)');
    if (/!important/.test(noComments)) errors.push('widget CSS uses !important');
    if (/infinite/.test(noComments)) errors.push('widget CSS has an infinite animation');
    if (/linear-gradient|radial-gradient/.test(noComments)) warns.push('widget CSS uses a gradient (allowed only as a hard-stop bar)');
    // An OKLCH mix with a hued neutral rotates the series hue; mix in oklab.
    const hueMix = [...noComments.matchAll(/color-mix\(\s*in\s+oklch\s*,[^;{}]*var\(--(?:ink|paper|rule)[\w-]*\)/g)];
    if (hueMix.length) warns.push(`widget CSS mixes in oklch against ink/paper/rule (${hueMix.length}x); use color-mix(in oklab, …)`);
    const small = [...noComments.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)].filter(m => Number(m[1]) < 12);
    if (small.length) errors.push(`widget CSS font-size below 12px: ${small.map(m => m[0]).join(', ')}`);
    // Selector scoping
    const selectors = [];
    noComments.replace(/@media[^{]*\{/g, '').replace(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '')
      .replace(/([^{}]+)\{[^}]*\}/g, (_, sel) => { selectors.push(...splitTop(sel).map(s => s.trim()).filter(Boolean)); return ''; });
    const scope = `.guide[data-guide="${slug}"]`;
    const unscoped = selectors.filter(s => !s.startsWith(scope));
    if (unscoped.length) errors.push(`widget CSS selectors not scoped to ${scope}: ${unscoped.slice(0, 4).join(' | ')}`);
  }

  // ---- Script smoke test ----
  const scripts = [...document.querySelectorAll('script')];
  scripts.forEach(s => { if (!s.hasAttribute('data-guide-script')) errors.push('<script> without data-guide-script'); });
  const code = scripts.map(s => s.textContent).join('\n;\n');
  const runtimeErrors = [];
  if (code.trim()) {
    const vc = new VirtualConsole();
    vc.on('jsdomError', e => runtimeErrors.push(e.message));
    const live = new JSDOM(`<!doctype html><body><div id="page-content">${src.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')}</div></body>`,
      { runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc, url: 'http://localhost/' });
    const w = live.window;
    w.URL.createObjectURL = () => 'blob:x';
    w.URL.revokeObjectURL = () => {};
    w.HTMLAnchorElement.prototype.click = function () {};
    w.navigator.clipboard = { writeText: async () => {} };
    const root = w.document.querySelector('article.guide');
    const baseline = new Set(Object.keys(w));
    const cleanups = [];
    const api = { onCleanup: f => cleanups.push(f), goTo: () => {} };
    try {
      const fn = new w.Function('root', 'api', `"use strict";\n${code}`);
      fn(root, api);
    } catch (e) {
      runtimeErrors.push(`script threw on load: ${e.message}`);
    }
    // Exercise controls: type into inputs, change selects, click buttons.
    // jsdom reports listener errors through the virtual console, not by throwing.
    const fire = (el, type) => el.dispatchEvent(new w.Event(type, { bubbles: true }));
    root.querySelectorAll('input').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') { el.click(); return; }
      if (el.type === 'range') { el.value = el.max || '5'; fire(el, 'input'); fire(el, 'change'); return; }
      el.value = el.type === 'number' ? '3' : 'Sample item';
      fire(el, 'input'); fire(el, 'change');
      fire(el, 'keydown');
    });
    root.querySelectorAll('textarea').forEach(el => { el.value = 'Sample text'; fire(el, 'input'); fire(el, 'change'); });
    root.querySelectorAll('select').forEach(el => {
      const opts = el.options.length;
      if (opts > 1) { el.selectedIndex = opts - 1; fire(el, 'change'); fire(el, 'input'); }
    });
    // Click every non-quiz button twice (toggle-on, toggle-off) — includes added items.
    for (let pass = 0; pass < 2; pass++) {
      [...root.querySelectorAll('button')].forEach(b => {
        if (b.closest('.quiz')) return;
        b.click();
      });
    }
    // Empty-value pass: clear numeric inputs to check validation does not throw.
    root.querySelectorAll('input[type="number"]').forEach(el => { el.value = ''; fire(el, 'input'); });
    cleanups.forEach(f => { try { f(); } catch (e) { runtimeErrors.push(`cleanup threw: ${e.message}`); } });
    const leaked = Object.keys(w).filter(k => !baseline.has(k));
    if (leaked.length) errors.push(`script leaked globals: ${leaked.slice(0, 6).join(', ')}`);
    if (/innerHTML\s*[+]?=/.test(code)) warns.push('script assigns innerHTML (make sure no user input reaches it)');
  }
  runtimeErrors.forEach(e => errors.push(`runtime: ${e}`));

  return {
    file, errors, warns,
    stats: { chapters: chapters.map(c => `${c.id}:${c.dataset.nav}`), words, tools: article.querySelectorAll('.tool').length, quiz: article.querySelectorAll('.quiz-item').length },
  };
}

const args = process.argv.slice(2);
const files = args.includes('--all') ? readdirSync(GUIDES).filter(f => f.endsWith('.html')).sort() : args;
if (!files.length) { console.error('usage: check-guide.mjs <File.html…> | --all'); process.exit(2); }
let failed = 0;
for (const f of files) {
  const r = check(f);
  const ok = r.errors.length === 0;
  if (!ok) failed++;
  console.log(`\n${ok ? 'PASS' : 'FAIL'}  ${r.file}${r.stats ? `  (${r.stats.chapters.length} sections, ${r.stats.words} words, ${r.stats.tools} tools, ${r.stats.quiz} quiz)` : ''}`);
  r.errors.forEach(e => console.log(`  error  ${e}`));
  r.warns.forEach(w => console.log(`  warn   ${w}`));
}
console.log(`\n${files.length - failed}/${files.length} passed`);
process.exit(failed ? 1 : 0);

function splitTop(sel) {
  const out = []; let depth = 0, cur = '';
  for (const ch of sel) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}
