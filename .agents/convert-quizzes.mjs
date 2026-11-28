/**
 * One-off: convert the 12 "standard" Group-A quizzes from one-question-at-a-time
 * to all-questions-at-once. Preserves each file's `const qs=[...]` data and its
 * result-tier (`if(sc>=N){msg/col}`) logic verbatim; only the render/answer flow
 * changes. The 3 outliers (Blue-Ocean, Playing-to-Win, Wardley) are done by hand.
 */
import { readFileSync, writeFileSync } from 'node:fs';

// Outliers (multi-line renderQ, vestigial `btn` param on checkA) — same boundaries,
// so the same whitespace-agnostic extraction + wholesale replacement applies.
const FILES = [
  'Blue-Ocean-Strategy', 'Playing-to-Win', 'Wardley-Mapping',
];

const dir = new URL('../public/', import.meta.url);

function canonical(tiers) {
  return `let qi=0,sc=0,answered={};
function renderQ(){const area=document.getElementById('quiz_area');let h='';qs.forEach((q,idx)=>{h+='<div class="qq" data-qi="'+idx+'"><div style="font-size:11px;font-weight:700;color:var(--ink-muted);margin-bottom:8px;">QUESTION '+(idx+1)+'/'+qs.length+'</div><div style="font-family:\\'Lilita One\\',sans-serif;font-size:17px;margin-bottom:16px;">'+q.q+'</div>';q.o.forEach((o,i)=>{h+='<button class="quiz-opt" onclick="checkA('+idx+','+i+')">'+o+'</button>';});h+='<div id="qfb'+idx+'" style="margin-top:10px;"></div></div>';});h+='<div id="quiz_final" style="margin-top:4px;"></div>';area.innerHTML=h;}
function checkA(qIdx,pick){if(answered[qIdx])return;answered[qIdx]=true;const q=qs[qIdx];const correct=pick===q.a;if(correct)sc++;const card=document.querySelector('.qq[data-qi="'+qIdx+'"]');card.querySelectorAll('.quiz-opt').forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add('correct');else if(i===pick)b.classList.add('wrong');});document.getElementById('qfb'+qIdx).innerHTML='<div style="padding:12px;background:'+(correct?'var(--mint)':'var(--rose)')+';border:2px solid var(--border);border-radius:var(--radius-xs);font-size:13px;line-height:1.5;margin-top:8px;">'+(correct?'&#x2705; ':'&#x274C; ')+q.e+'</div>';if(Object.keys(answered).length>=qs.length)finishQuiz();}
function finishQuiz(){${tiers}document.getElementById('quiz_final').innerHTML='<div class="qq" style="text-align:center;margin-top:8px;"><div style="font-size:40px;margin-bottom:10px;">&#x1F3AF;</div><div style="font-family:\\'Lilita One\\',sans-serif;font-size:24px;margin-bottom:8px;">'+sc+'/'+qs.length+'</div><div style="padding:12px;background:'+col+';border:var(--bw) solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-weight:600;margin-bottom:14px;">'+msg+'</div><button onclick="resetQuiz()" class="pn-btn primary">Retry</button></div>';document.getElementById('quiz_final').scrollIntoView({behavior:'smooth',block:'nearest'});}
function resetQuiz(){sc=0;answered={};renderQ();}
renderQ();`;
}

for (const name of FILES) {
  const path = new URL(name + '.html', dir);
  let html = readFileSync(path, 'utf8');

  const start = html.indexOf('let qi=0,sc=0;');
  if (start === -1) { console.log(`SKIP ${name}: no 'let qi=0,sc=0;'`); continue; }
  const callIdx = html.lastIndexOf('renderQ();');
  if (callIdx === -1 || callIdx < start) { console.log(`SKIP ${name}: no trailing renderQ()`); continue; }
  const end = callIdx + 'renderQ();'.length;

  const block = html.slice(start, end);

  // Extract the result-tier logic: between `if(qi>=qs.length){` and `area.innerHTML=`.
  const guard = 'if(qi>=qs.length){';
  const gi = block.indexOf(guard);
  const ai = block.indexOf('area.innerHTML=', gi);
  if (gi === -1 || ai === -1) { console.log(`SKIP ${name}: cannot locate tier logic`); continue; }
  const tiers = block.slice(gi + guard.length, ai).trim();

  const replacement = canonical(tiers);
  html = html.slice(0, start) + replacement + html.slice(end);
  writeFileSync(path, html, 'utf8');
  console.log(`OK   ${name}: tiers(${tiers.length} chars) -> ${replacement.length} char block`);
}
