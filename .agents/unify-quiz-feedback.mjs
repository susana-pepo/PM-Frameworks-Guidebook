/**
 * One-off: make the 15 converted Group-A quizzes use the same neutral `.qexp`
 * feedback panel as the Group-B quizzes (RICE, ICE, …) instead of a bespoke
 * green/red inline panel. Correctness is still signalled by the option buttons
 * turning green/red (central `.quiz-opt.correct/.wrong`), so every quiz's
 * explanation surface now reads identically.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
  'AARRR-Pirate-Metrics', 'Agile-Scrum', 'Blue-Ocean-Strategy', 'Dual-Track-Agile',
  'Executive-Summary', 'Growth-Loops', 'Input-Output-Metrics', 'Narrative-Arc',
  'North-Star-Framework', 'OKRs', 'Playing-to-Win', 'Pyramid-Principle',
  'STAR-Method', 'Shape-Up', 'Wardley-Mapping',
];
const dir = new URL('../public/', import.meta.url);

const OLD = `document.getElementById('qfb'+qIdx).innerHTML='<div style="padding:12px;background:'+(correct?'var(--mint)':'var(--rose)')+';border:2px solid var(--border);border-radius:var(--radius-xs);font-size:13px;line-height:1.5;margin-top:8px;">'+(correct?'&#x2705; ':'&#x274C; ')+q.e+'</div>';`;
const NEW = `document.getElementById('qfb'+qIdx).innerHTML='<div class="qexp show">'+q.e+'</div>';`;

for (const name of FILES) {
  const path = new URL(name + '.html', dir);
  const html = readFileSync(path, 'utf8');
  if (!html.includes(OLD)) { console.log(`SKIP ${name}: feedback line not found`); continue; }
  writeFileSync(path, html.replace(OLD, NEW), 'utf8');
  console.log(`OK   ${name}`);
}
