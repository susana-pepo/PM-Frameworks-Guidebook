/**
 * Content glyph system — turns the emoji still living *inside* the framework
 * content into the same bespoke monoline family used in the chrome (icons.js).
 *
 * The chrome was de-stickered in an earlier pass, but the source HTML still
 * carried ~690 emoji: decorative section/illustration glyphs (🎯 🧠 🔍 🧩 …),
 * semantic signals (✅ ❌ ⚠️ 🚫 ❓) and status dots (🔴 🔵 🟠). Those clash with
 * the refined editorial voice. This module replaces them centrally, at load
 * time, on the live DOM — so all 24 frameworks + 6 comparison guides inherit
 * the change through the shared renderer, with no per-file edits.
 *
 * Three families:
 *   • decorative concepts → a 24×24 currentColor monoline icon. A standalone
 *     illustration emoji (an element's sole child) is drawn in the category
 *     accent; an inline prefix emoji inherits the surrounding ink. Sizing is
 *     `em`-based, so an emoji that sat in a large icon tile stays large.
 *   • semantic signals → a status glyph tinted with the muted semantic colour
 *     (use/skip, do/don't, warnings, prohibitions, questions).
 *   • coloured dots → a small CSS disc in the matching status colour.
 *
 * Anything not mapped is left as-is (the map is generous but not exhaustive);
 * pixel-placed diagram labels and SVG subtrees are skipped so figures keep
 * their authored layout.
 */

/* 24×24 monoline body → full <svg>. 1.6px stroke reads cleanly at ~1em. */
const I = (body) =>
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';

/* ---- Concept bodies ---- */
const B = {
  target:
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>' +
    '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>',
  brain:
    '<path d="M11.5 5.2A2.6 2.6 0 0 0 7 6.6 2.7 2.7 0 0 0 5.2 11 2.7 2.7 0 0 0 6 16a2.6 2.6 0 0 0 4.4 1.7 2 2 0 0 0 1.1 .3V5.6a2 2 0 0 0-0-.4z"/>' +
    '<path d="M11.5 5.6A2 2 0 0 1 12.5 5.2 2.6 2.6 0 0 1 17 6.6 2.7 2.7 0 0 1 18.8 11 2.7 2.7 0 0 1 18 16a2.6 2.6 0 0 1-4.4 1.7 2 2 0 0 1-1.1 .3"/>' +
    '<path d="M11.5 5.2v13.1"/>',
  bulb:
    '<path d="M8.6 14.5a4.8 4.8 0 1 1 6.8 0c-.7.7-1.1 1.3-1.2 2.2H9.8c-.1-.9-.5-1.5-1.2-2.2z"/>' +
    '<path d="M9.8 18.2h4.4"/><path d="M10.6 20.6h2.8"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M15.4 15.4 20 20"/>',
  bars:
    '<path d="M4 20h16"/><path d="M7 20v-7"/><path d="M12 20v-11"/><path d="M17 20v-5"/>',
  trendUp:
    '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M6.5 15l3.3-3.3 2.7 1.8L19 7.5"/>' +
    '<path d="M15.5 7.5H19V11"/>',
  trendDown:
    '<path d="M4 5v14h16"/><path d="M6.5 9l3.3 3.3 2.7-1.8L19 16.5"/>' +
    '<path d="M15.5 16.5H19V13"/>',
  puzzle:
    '<path d="M8.6 5.5h2.3a1.6 1.6 0 0 1 3.1 0h2.4v2.3a1.6 1.6 0 0 1 0 3.1v3.1h-3.1a1.6 1.6 0 0 0-3.1 0H6.9v-3.1a1.6 1.6 0 0 1 0-3.1z"/>',
  wrench:
    '<path d="M15.4 4.6a4.2 4.2 0 0 0-5.1 5.3l-5.6 5.6 3.7 3.7 5.6-5.6a4.2 4.2 0 0 0 5.3-5.1l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  hammer:
    '<path d="M12.5 7.5 16 4l4 4-3.5 3.5z"/><path d="M14.2 9.2 6 17.4a1.8 1.8 0 0 0 2.6 2.6l8.2-8.2"/>',
  flask:
    '<path d="M9.5 3.8v5.4L5.3 17.5a1.8 1.8 0 0 0 1.6 2.7h10.2a1.8 1.8 0 0 0 1.6-2.7L14.5 9.2V3.8"/>' +
    '<path d="M8.5 3.8h7"/><path d="M7.6 14h8.8"/>',
  pencil:
    '<path d="M14.5 5.5l4 4"/><path d="M5 19l1.2-4.2L16 5l3 3-9.8 9.8z"/>',
  clipboard:
    '<rect x="5.5" y="5" width="13" height="16" rx="2"/>' +
    '<rect x="9" y="3" width="6" height="3.6" rx="1.2"/>' +
    '<path d="M9 11h6"/><path d="M9 14.5h6"/><path d="M9 18h4"/>',
  compass:
    '<circle cx="12" cy="12" r="8.2"/><path d="M14.7 9.3 10.8 11 9.3 14.7 13.2 13z"/>',
  trophy:
    '<path d="M7.5 4.5h9v3a4.5 4.5 0 0 1-9 0z"/>' +
    '<path d="M7.5 5.5H5.2A2.1 2.1 0 0 0 7.6 8.9"/>' +
    '<path d="M16.5 5.5h2.3A2.1 2.1 0 0 1 16.4 8.9"/>' +
    '<path d="M12 12v3"/><path d="M9.2 19.5h5.6l-.8-4.5H10z"/>',
  map:
    '<path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2z"/>' +
    '<path d="M9 4.5v13"/><path d="M15 6.5v13"/>',
  gem:
    '<path d="M6 4.5h12l3 4.5-9 10.6L3 9z"/><path d="M3 9h18"/>' +
    '<path d="M9 4.7 7.6 9l4.4 10.6L16.4 9 15 4.7"/>',
  ruler:
    '<path d="M4 16 16 4l4 4L8 20z"/><path d="M9.5 8.5l1.4 1.4"/>' +
    '<path d="M12.5 5.5l1.4 1.4"/><path d="M6.5 11.5l1.4 1.4"/>',
  rocket:
    '<path d="M14 4.2c2.9 1 4.8 4.8 3.9 8.6l-3.3 3.3-4.7-4.7L13.2 8c.2-1.4.5-2.7.8-3.8z"/>' +
    '<path d="M9.9 15.4c-2.8.2-4.2 4.1-4.2 4.1s3.9-1.4 4.1-4.2"/>' +
    '<circle cx="14" cy="9.6" r="1.3"/>',
  bolt: '<path d="M13 3 5.5 13H10l-1 8 8.5-11.5H13z"/>',
  scales:
    '<path d="M12 4.5v15"/><path d="M7 19.5h10"/><path d="M4.6 8h14.8"/>' +
    '<path d="M5 8 2.9 12.6a2.1 2.1 0 0 0 4.2 0z"/>' +
    '<path d="M19 8 16.9 12.6a2.1 2.1 0 0 0 4.2 0z"/>' +
    '<circle cx="12" cy="5.2" r="1.2"/>',
  link:
    '<path d="M10.2 13.8a3.4 3.4 0 0 0 4.8 0l2.4-2.4a3.4 3.4 0 0 0-4.8-4.8L11.4 7.8"/>' +
    '<path d="M13.8 10.2a3.4 3.4 0 0 0-4.8 0l-2.4 2.4a3.4 3.4 0 0 0 4.8 4.8L12.6 16.2"/>',
  coin:
    '<circle cx="12" cy="12" r="8"/><path d="M12 7.3v9.4"/>' +
    '<path d="M14.3 9.2a2.5 2.5 0 0 0-2.4-1.3c-1.4 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 3.9 0 1.1-1 1.9-2.6 1.9a2.7 2.7 0 0 1-2.5-1.4"/>',
  card: '<rect x="3.5" y="6" width="17" height="12" rx="2.2"/><path d="M3.5 10h17"/>',
  phone: '<rect x="7" y="3.5" width="10" height="17" rx="2.4"/><path d="M11 17.5h2"/>',
  briefcase:
    '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/>' +
    '<path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5"/>' +
    '<path d="M3.5 12.5h17"/><path d="M12 11.5v2"/>',
  trash:
    '<path d="M5.5 7h13"/>' +
    '<path d="M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7"/>' +
    '<path d="M6.8 7l.9 11.4a2 2 0 0 0 2 1.6h4.6a2 2 0 0 0 2-1.6L17.2 7"/>' +
    '<path d="M10 11v5.5"/><path d="M14 11v5.5"/>',
  film:
    '<rect x="3.5" y="8.8" width="17" height="11" rx="1.8"/>' +
    '<path d="M3.9 8.8 6 4.6l3 1.1-2 4.1z"/><path d="M9 5.7 11.2 9.8"/>' +
    '<path d="M13.6 5 15.7 9.2"/>',
  note: '<path d="M9 18V6.2l9-2v9.8"/><circle cx="6.4" cy="18" r="2.6"/><circle cx="15.4" cy="15.8" r="2.6"/>',
  headphones:
    '<path d="M5 13v-1a7 7 0 0 1 14 0v1"/>' +
    '<rect x="3.4" y="13" width="3.6" height="6.2" rx="1.6"/>' +
    '<rect x="17" y="13" width="3.6" height="6.2" rx="1.6"/>',
  mic:
    '<rect x="9" y="3.5" width="6" height="10" rx="3"/>' +
    '<path d="M6 11a6 6 0 0 0 12 0"/><path d="M12 17v3"/><path d="M9 20h6"/>',
  user: '<circle cx="12" cy="8.4" r="3.6"/><path d="M5.5 19.6a6.6 6.6 0 0 1 13 0"/>',
  eye: '<path d="M2.6 12S6 6 12 6s9.4 6 9.4 6-3.4 6-9.4 6-9.4-6-9.4-6z"/><circle cx="12" cy="12" r="2.6"/>',
  key:
    '<circle cx="8" cy="8" r="3.6"/><path d="M10.6 10.6 19 19"/>' +
    '<path d="M16.2 16.2 18 14.4"/><path d="M18 18l1.8-1.8"/>',
  calc:
    '<rect x="4.5" y="3.5" width="15" height="17" rx="2"/><path d="M4.5 9h15"/>' +
    '<path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 16.5h2"/><path d="M14 16.5h2"/>',
  cart:
    '<path d="M3 4.5h2l2.2 10.5h9.3l1.8-7H6.3"/>' +
    '<circle cx="9" cy="19" r="1.4"/><circle cx="16.2" cy="19" r="1.4"/>',
  building:
    '<path d="M5 20V5a1.5 1.5 0 0 1 1.5-1.5h6A1.5 1.5 0 0 1 14 5v15"/>' +
    '<path d="M14 20V9.5h3.5A1.5 1.5 0 0 1 19 11v9"/>' +
    '<path d="M8 7h3"/><path d="M8 10.5h3"/><path d="M8 14h3"/><path d="M3.5 20h17"/>',
  globe:
    '<circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4"/>' +
    '<path d="M12 3.8c2.6 2.3 2.6 14.1 0 16.4-2.6-2.3-2.6-14.1 0-16.4z"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4.2 7.2 12 13l7.8-5.8"/>',
  calendar:
    '<rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M4 10h16"/>' +
    '<path d="M8 3.5v4"/><path d="M16 3.5v4"/>',
  folder:
    '<path d="M3.5 6.5A1.5 1.5 0 0 1 5 5h3.8l2 2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 18H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  doc:
    '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>' +
    '<path d="M9 12h6"/><path d="M9 15h6"/><path d="M9 18h3.5"/>',
  book:
    '<path d="M12 6.5C10 5 7 4.7 4 5.2v13c3-.5 6-.2 8 1.3 2-1.5 5-1.8 8-1.3v-13c-3-.5-6-.2-8 1.3z"/>' +
    '<path d="M12 6.5v13.3"/>',
  flag: '<path d="M6 21V3.8"/><path d="M6 5h11l-2.2 3 2.2 3H6"/>',
  pin: '<path d="M12 21s6-5.4 6-10A6 6 0 0 0 6 11c0 4.6 6 10 6 10z"/><circle cx="12" cy="11" r="2.3"/>',
  lock:
    '<rect x="5.5" y="10.5" width="13" height="9.2" rx="2"/>' +
    '<path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  shield: '<path d="M12 3.5 19 6v5c0 4.6-3 7.6-7 9.6-4-2-7-5-7-9.6V6z"/>',
  star:
    '<path d="M12 3.6 14 9.3 20.1 9.4 15.2 13.1 17 18.9 12 15.4 7 18.9 8.8 13.1 3.9 9.4 10 9.3Z"/>',
  sparkle:
    '<path d="M11 4.5l1.5 4.3 4.3 1.5-4.3 1.5L11 16.1l-1.5-4.3L5.2 10.3l4.3-1.5z"/>' +
    '<path d="M17.5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  cycle:
    '<path d="M19.5 11.2A7.5 7.5 0 1 0 17.7 16"/>' +
    '<path d="M19.8 5.8v5.4h-5.4"/>',
  timer:
    '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V9.3"/>' +
    '<path d="M9.5 3.5h5"/><path d="M12 6.5V3.5"/><path d="M18.4 7.6 19.8 6.2"/>',
  smile:
    '<circle cx="12" cy="12" r="8"/><path d="M8.4 14.4a4.6 4.6 0 0 0 7.2 0"/>' +
    '<circle cx="9.2" cy="10" r="0.6" fill="currentColor" stroke="none"/>' +
    '<circle cx="14.8" cy="10" r="0.6" fill="currentColor" stroke="none"/>',
  neutral:
    '<circle cx="12" cy="12" r="8"/><path d="M8.6 14.6h6.8"/>' +
    '<circle cx="9.2" cy="10" r="0.6" fill="currentColor" stroke="none"/>' +
    '<circle cx="14.8" cy="10" r="0.6" fill="currentColor" stroke="none"/>',
  frown:
    '<circle cx="12" cy="12" r="8"/><path d="M8.4 15.4a4.6 4.6 0 0 1 7.2 0"/>' +
    '<circle cx="9.2" cy="10" r="0.6" fill="currentColor" stroke="none"/>' +
    '<circle cx="14.8" cy="10" r="0.6" fill="currentColor" stroke="none"/>',
  tag:
    '<path d="M4 4.5h7.2L20 13.3l-6.7 6.7L4.5 11.2V4.5z"/>' +
    '<circle cx="8" cy="8" r="1.3"/>',
  heart:
    '<path d="M12 19.8S4.6 14.5 4.6 9.3A3.8 3.8 0 0 1 12 7.3 3.8 3.8 0 0 1 19.4 9.3C19.4 14.5 12 19.8 12 19.8z"/>',
  cursor: '<path d="M6 4l12.5 6.2-5.2 1.4-1.4 5.2z"/>',
  gauge:
    '<path d="M4.5 16.5a7.5 7.5 0 0 1 15 0"/><path d="M12 16.5l4.2-4.6"/>' +
    '<circle cx="12" cy="16.5" r="1.1" fill="currentColor" stroke="none"/>',
  dice:
    '<rect x="4.5" y="4.5" width="15" height="15" rx="3"/>' +
    '<circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/>' +
    '<circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none"/>' +
    '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>' +
    '<circle cx="9" cy="15" r="1.1" fill="currentColor" stroke="none"/>' +
    '<circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none"/>',
  swords:
    '<path d="M4 4l8.5 8.5"/><path d="M3.6 6.4 4 4l2.4.4"/>' +
    '<path d="M14.5 14.5 18.5 18.5"/><path d="M13.2 16.8 11.5 18.5"/>' +
    '<path d="M20 4l-8.5 8.5"/><path d="M20.4 6.4 20 4l-2.4.4"/>' +
    '<path d="M9.5 14.5 5.5 18.5"/><path d="M10.8 16.8 12.5 18.5"/>',
  spine:
    '<path d="M12 3.5v17"/><path d="M8.5 6.5h7"/><path d="M8.5 10h7"/>' +
    '<path d="M8.5 13.5h7"/><path d="M8.5 17h7"/>',
  announce:
    '<path d="M4 10 14.5 6v12L4 14z"/>' +
    '<path d="M4 10H3a1.3 1.3 0 0 0-1.3 1.3v1.4A1.3 1.3 0 0 0 3 14h1"/>' +
    '<path d="M17.5 9a4 4 0 0 1 0 6"/>' +
    '<path d="M7 14.3V17a1.4 1.4 0 0 0 2.8 0v-1.7"/>',
  arrowR: '<path d="M4 12h15"/><path d="M13 6 19 12 13 18"/>',
  arrowL: '<path d="M20 12H5"/><path d="M11 6 5 12 11 18"/>',
  arrowU: '<path d="M12 20V5"/><path d="M6 11 12 5 18 11"/>',
  arrowD: '<path d="M12 4v15"/><path d="M6 13 12 19 18 13"/>',
  scissors:
    '<circle cx="6.5" cy="6.8" r="2.3"/><circle cx="6.5" cy="17.2" r="2.3"/>' +
    '<path d="M8.6 8 19.5 17"/><path d="M8.6 16 19.5 7"/><path d="M12 12 8.6 9.5"/>',
  thumbsup:
    '<path d="M7 10.5v8.5H4.6a1 1 0 0 1-1-1v-6.5a1 1 0 0 1 1-1z"/>' +
    '<path d="M7 10.5 10.6 3.4a1.8 1.8 0 0 1 3 1.7L12.7 9h5a1.8 1.8 0 0 1 1.8 2.2l-1.3 6A1.8 1.8 0 0 1 16.4 19H7"/>',
  rails:
    '<path d="M6.5 3 4.5 21"/><path d="M17.5 3 19.5 21"/>' +
    '<path d="M5.2 8.5h13.6"/><path d="M4.8 13h14.4"/><path d="M4.4 17.5h15.2"/>',
};

/* ---- Decorative emoji → concept body. Inherits ink inline; accent when an
   element's sole content (illustration). ---- */
const DECOR = {
  '🎯': B.target, '🧠': B.brain, '💡': B.bulb, '🔍': B.search, '🔎': B.search,
  '📊': B.bars, '📈': B.trendUp, '📉': B.trendDown, '🧩': B.puzzle,
  '🔨': B.hammer, '🛠': B.wrench, '🔧': B.wrench, '⚙': B.cycle,
  '🧪': B.flask, '⚗': B.flask, '📝': B.pencil, '✍': B.pencil, '✏': B.pencil,
  '📋': B.clipboard, '🧭': B.compass, '🏆': B.trophy, '🏅': B.trophy, '🥇': B.trophy,
  '🗺': B.map, '💎': B.gem, '📐': B.ruler, '🚀': B.rocket, '⚡': B.bolt,
  '⚖': B.scales, '🔗': B.link, '💰': B.coin, '🪙': B.coin, '💵': B.coin,
  '💳': B.card, '📱': B.phone, '💼': B.briefcase, '🗑': B.trash,
  '🎬': B.film, '🎥': B.film, '🎞': B.film,
  '🎵': B.note, '🎶': B.note, '🎼': B.note, '🎹': B.note,
  '🎧': B.headphones, '🎤': B.mic, '🎙': B.mic,
  '👤': B.user, '👥': B.user, '🧑': B.user, '👨': B.user, '👩': B.user, '👧': B.user, '🙋': B.user,
  '👁': B.eye, '👀': B.eye, '🔑': B.key, '🧮': B.calc, '🛒': B.cart,
  '🏢': B.building, '🏫': B.building, '🏨': B.building, '🏛': B.building, '🏦': B.building,
  '🌐': B.globe, '🌍': B.globe, '🌎': B.globe, '🌏': B.globe,
  '📧': B.mail, '✉': B.mail, '📨': B.mail, '📩': B.mail,
  '📅': B.calendar, '📆': B.calendar, '🗓': B.calendar,
  '🗂': B.folder, '🗃': B.folder, '📁': B.folder, '📂': B.folder,
  '📄': B.doc, '📃': B.doc, '📑': B.doc, '🧾': B.doc,
  '📖': B.book, '📚': B.book, '📕': B.book, '📗': B.book, '📘': B.book, '📙': B.book,
  '🚩': B.flag, '🏁': B.flag, '📍': B.pin, '🔒': B.lock, '🔓': B.lock, '🛡': B.shield,
  '⭐': B.star, '🌟': B.star, '✨': B.sparkle, '💫': B.sparkle,
  '🔄': B.cycle, '🔁': B.cycle, '↺': B.cycle, '↻': B.cycle, '♻': B.cycle, '🔃': B.cycle,
  '🏃': B.timer, '⏱': B.timer, '⏲': B.timer, '⏰': B.timer, '⌛': B.timer, '⏳': B.timer,
  '😍': B.smile, '🤩': B.smile, '😀': B.smile, '😃': B.smile, '😄': B.smile, '🙂': B.smile, '😊': B.smile,
  '😐': B.neutral, '😑': B.neutral, '😶': B.neutral,
  '🙁': B.frown, '☹': B.frown, '😞': B.frown, '😟': B.frown, '😢': B.frown, '😕': B.frown,
  '🏷': B.tag, '🆓': B.tag, '🎟': B.tag, '🎫': B.tag,
  '💜': B.heart, '❤': B.heart, '🧡': B.heart, '💛': B.heart, '💚': B.heart,
  '💙': B.heart, '🤍': B.heart, '🖤': B.heart, '💗': B.heart, '💖': B.heart, '💕': B.heart,
  '🖱': B.cursor, '👆': B.cursor, '👉': B.cursor,
  '🎛': B.gauge, '🎚': B.gauge, '📡': B.gauge,
  '🎰': B.dice, '🎲': B.dice, '⚔': B.swords, '🛡️': B.shield, '🦴': B.spine,
  '📢': B.announce, '📣': B.announce, '🔊': B.announce, '🔉': B.announce,
  '🔈': B.announce, '🗣': B.announce,
  // Emoji-PRESENTATION block arrows (render as colour emoji) → monoline arrows.
  // The plain TEXT arrows (→ ← ↑ ↓, U+2190–2193) are deliberately left as text.
  '➡': B.arrowR, '⮕': B.arrowR, '▶': B.arrowR, '⏩': B.arrowR,
  '⬅': B.arrowL, '◀': B.arrowL, '⏪': B.arrowL,
  '⬆': B.arrowU, '🔼': B.arrowU, '⏫': B.arrowU,
  '⬇': B.arrowD, '🔽': B.arrowD, '⏬': B.arrowD,
  // Widget-generated + framework-identity emoji (quiz feedback, builders, the
  // 🍚 RICE / 🧊 ICE labels in comparison tables → echo their hub glyphs).
  '✂': B.scissors, '👍': B.thumbsup, '👎': B.thumbsup, '🛤': B.rails,
  '🎉': B.sparkle, '🎊': B.sparkle, '🥳': B.smile,
  '😤': B.frown, '😠': B.frown, '😡': B.frown, '😬': B.neutral,
  '🍚': B.bars, '🧊': B.gauge, '⭕': B.target, '🔺': B.arrowU, '🔻': B.arrowD,
};

/* ---- Semantic signals → [statusClass, body]. ---- */
const CHECK = '<path d="M5 12.6l4.4 4.4L19 7.4"/>';
const CROSS = '<path d="M7 7l10 10"/><path d="M17 7 7 17"/>';
const WARN =
  '<path d="M12 4.4 21 19.6H3z"/><path d="M12 10v4.2"/>' +
  '<circle cx="12" cy="17" r="0.95" fill="currentColor" stroke="none"/>';
const BAN = '<circle cx="12" cy="12" r="8"/><path d="M6.4 6.4 17.6 17.6"/>';
const QUESTION =
  '<path d="M9.2 9.3a2.9 2.9 0 1 1 4.2 2.6c-1 .5-1.4 1.1-1.4 2.1"/>' +
  '<circle cx="12" cy="17.2" r="0.95" fill="currentColor" stroke="none"/>';

const STATUS = {
  '✅': ['ok', CHECK], '✔': ['ok', CHECK], '✓': ['ok', CHECK], '☑': ['ok', CHECK],
  '❌': ['no', CROSS], '✖': ['no', CROSS], '✗': ['no', CROSS], '✕': ['no', CROSS],
  '⚠': ['warn', WARN],
  '🚫': ['no', BAN], '⛔': ['no', BAN],
  '❓': ['q', QUESTION], '❔': ['q', QUESTION], '🤷': ['q', QUESTION],
};

/* ---- Coloured dots → small CSS disc. ---- */
const DOTS = {
  '🔴': 'red', '🟥': 'red', '🔵': 'blue', '🟦': 'blue',
  '🟠': 'amber', '🟧': 'amber', '🟡': 'amber', '🟨': 'amber',
  '🟢': 'green', '🟩': 'green', '🟣': 'violet', '🟪': 'violet',
  '⚫': 'ink', '⬤': 'ink', '⬛': 'ink', '🔶': 'amber', '🔷': 'blue',
};

/* All keys, longest first, so multi-char emoji match before any prefix. */
const ALL_KEYS = [
  ...Object.keys(STATUS), ...Object.keys(DECOR), ...Object.keys(DOTS),
].sort((a, b) => b.length - a.length);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* A trailing variation selector (️ U+FE0F) or zero-width joiner is absorbed so
   `⚠️` matches the `⚠` key cleanly. (No lone-surrogate ranges — invalid under /u.) */
const GLYPH_RE = new RegExp(
  '(' + ALL_KEYS.map(escapeRe).join('|') + ')[\\uFE0F\\u200D]*',
  'gu'
);

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Markup for one emoji → glyph span (or null if unmapped). */
function glyphFor(emoji, sole) {
  if (DOTS[emoji]) return `<span class="glyph-dot glyph-dot--${DOTS[emoji]}"></span>`;
  if (STATUS[emoji]) {
    const [cls, body] = STATUS[emoji];
    return `<span class="glyph-ico glyph-ico--${cls}">${I(body)}</span>`;
  }
  if (DECOR[emoji]) {
    const accent = sole ? ' glyph-ico--accent' : '';
    return `<span class="glyph-ico${accent}">${I(DECOR[emoji])}</span>`;
  }
  return null;
}

const DIAGRAM_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'KBD', 'TEXTAREA', 'NOSCRIPT']);

/* Skip only what would genuinely break: SVG subtrees (can't host an HTML span)
   and script/style/pre text. Absolutely-positioned diagram nodes are NOT
   skipped — the swap is `em`-sized (same box as the emoji it replaces), so a
   loop/funnel/cycle node icon becomes a monoline glyph in place without
   shifting the figure. (Diagram TEXT labels contain no emoji, so they're never
   matched anyway.) */
function skip(node, root) {
  let el = node.parentNode;
  while (el && el !== root) {
    if (el.nodeType === 1) {
      if (el.namespaceURI === 'http://www.w3.org/2000/svg') return true;
      if (DIAGRAM_TAGS.has(el.tagName)) return true;
      if (el.classList && (el.classList.contains('glyph-ico') || el.classList.contains('glyph-emoji'))) return true;
    }
    el = el.parentNode;
  }
  return false;
}

/* Core pass: replace every mapped emoji in text nodes under `walkRoot` with its
   monoline glyph. `boundary` is the original container, used as the ceiling for
   ancestor skip checks when `walkRoot` is a freshly-added subtree. */
function processGlyphs(walkRoot, boundary) {
  if (!walkRoot || walkRoot.nodeType !== 1) return;
  const walker = document.createTreeWalker(walkRoot, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !GLYPH_RE.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      GLYPH_RE.lastIndex = 0;
      return skip(node, boundary) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });

  const targets = [];
  let n;
  while ((n = walker.nextNode())) targets.push(n);

  for (const node of targets) {
    const text = node.nodeValue;
    // An emoji that is the element's whole content reads as an illustration
    // (icon tile, quadrant glyph, loop node) → draw it in the accent colour.
    const sole =
      node.parentNode &&
      node.parentNode.childNodes.length === 1 &&
      /^[\s]*$/.test(text.replace(GLYPH_RE, ''));
    GLYPH_RE.lastIndex = 0;

    let out = '';
    let last = 0;
    let m;
    let changed = false;
    while ((m = GLYPH_RE.exec(text))) {
      const html = glyphFor(m[1], sole);
      if (html == null) continue;            // leave unmapped emoji untouched
      out += esc(text.slice(last, m.index)) + html;
      last = m.index + m[0].length;
      changed = true;
    }
    if (!changed) continue;
    out += esc(text.slice(last));

    const tmp = document.createElement('span');
    tmp.innerHTML = out;
    const frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    node.parentNode.replaceChild(frag, node);
  }
}

/**
 * Replace every mapped emoji in `root` with its monoline glyph.
 * Runs on the live DOM after normalizeContent(), before buildReadingDocument()
 * reorganises the nodes (the replaced spans travel with them).
 *
 * @param {HTMLElement} root — container to walk (e.g. .fw-page)
 */
export function decorateGlyphs(root) {
  if (!root || typeof document === 'undefined') return;
  processGlyphs(root, root);
}

let activeObserver = null;

/**
 * Keep de-emojifying content that interactive widgets inject *after* load —
 * quiz feedback (✅/❌), the RICE/OKR builders, the Kano satisfaction picker —
 * which the one-time pass can't reach. A MutationObserver runs processGlyphs on
 * any added subtree; it disconnects while it edits so its own glyph insertions
 * don't re-trigger it. Only one observer is ever live (re-attached per page).
 *
 * @param {HTMLElement} root — container to watch (e.g. .fw-page)
 */
export function observeGlyphs(root) {
  if (!root || typeof MutationObserver === 'undefined') return;
  if (activeObserver) activeObserver.disconnect();
  const opts = { childList: true, subtree: true };
  const obs = new MutationObserver((mutations) => {
    obs.disconnect();
    try {
      for (const mu of mutations) {
        for (const node of mu.addedNodes) {
          const target = node.nodeType === 3 ? node.parentElement : node;
          if (target && target.nodeType === 1) processGlyphs(target, root);
        }
      }
    } finally {
      if (root.isConnected) obs.observe(root, opts);
    }
  });
  obs.observe(root, opts);
  activeObserver = obs;
}

/**
 * Wrap each data table in a horizontal scroll container so a wide comparison
 * matrix can be swiped on a phone instead of being clipped by the deck panel.
 * On desktop the wrapper never scrolls (the table fits), so it's invisible.
 *
 * @param {HTMLElement} root — container to walk (e.g. .fw-page)
 */
export function wrapTables(root) {
  if (!root || typeof document === 'undefined') return;
  const tables = root.querySelectorAll('table, .cmp-table, .ctable');
  tables.forEach((t) => {
    const parent = t.parentElement;
    if (!parent || parent.classList.contains('fw-table-wrap')) return;
    // Skip tables used purely for layout inside a fixed/positioned diagram.
    if (t.closest('[style*="position:absolute"], [style*="position: absolute"]')) return;
    const wrap = document.createElement('div');
    wrap.className = 'fw-table-wrap';
    parent.insertBefore(wrap, t);
    wrap.appendChild(t);
  });
}
