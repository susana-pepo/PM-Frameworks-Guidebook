// Full-page screenshots of every route, cut into 2400px segments, using
// the locally installed Google Chrome over the DevTools protocol.
// Needs the dev server running (npm run dev).
//
//   node scripts/screenshots.mjs <outDir> <width> <light|dark> [mobile]
//   ONLY=rice,kano node scripts/screenshots.mjs shots 375 dark mobile
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const [outDir, widthArg, scheme, mobileArg] = process.argv.slice(2);
const width = Number(widthArg);
const mobile = mobileArg === 'mobile';
mkdirSync(outDir, { recursive: true });
const BASE = 'http://127.0.0.1:5173/PM-Frameworks-Guidebook/';
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${outDir}/.prof`,
  '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let target;
for (let i = 0; i < 50 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile });
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
await send('Page.navigate', { url: BASE });
await sleep(1500);
await send('Runtime.evaluate', { expression: `localStorage.setItem('pmf-theme','${scheme}'); 1` });

const evalJ = async expr => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const routes = await evalJ(`import('/PM-Frameworks-Guidebook/src/data/frameworks.js').then(m => ['#/', ...m.categories.map(c => '#/category/' + c.id), ...m.frameworks.map(f => '#/framework/' + f.slug), ...m.comparisonGuides.map(c => '#/compare/' + c.slug)])`);
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
// Guides show one section at a time, so each section is its own route.
const expanded = [];
for (const r of routes) {
  if (only && !only.some(o => r.includes(o))) continue;
  if (!/framework|compare/.test(r)) { expanded.push(r); continue; }
  await send('Page.navigate', { url: BASE + r });
  await sleep(1500);
  const ids = await evalJ(`[...document.querySelectorAll('.guide > .panel')].map(p => p.id)`) || [];
  ids.forEach((id, i) => expanded.push(i === 0 ? r : `${r}/${id}`));
}
for (const r of expanded) {
  await send('Page.navigate', { url: BASE + r });
  await sleep(1200);
  const h = await evalJ('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width, height: Math.min(h, 40000), deviceScaleFactor: 1, mobile });
  await sleep(500);
  const base = (r.replace(/[#/]+/g, '-').replace(/^-|-$/g, '') || 'home');
  const SEG = 2400;
  for (let y = 0, n = 1; y < Math.min(h, 40000); y += SEG, n++) {
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip: { x: 0, y, width, height: Math.min(SEG, h - y), scale: 1 } });
    writeFileSync(`${outDir}/${base}--${String(n).padStart(2, '0')}.jpg`, Buffer.from(shot.result.data, 'base64'));
  }
  const name = base;
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile });
  console.log(name, h);
}
ws.close(); chrome.kill();
