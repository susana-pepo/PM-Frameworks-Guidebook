/**
 * Route-level housekeeping: document title, and moving focus to the page's
 * main heading so screen readers announce the new page.
 */
const BASE = 'PM Frameworks';

export function setPageMeta({ title, focus = true } = {}) {
  document.title = title ? `${title} · ${BASE}` : `${BASE}: a field guide`;
  if (!focus) return;
  requestAnimationFrame(() => {
    const h1 = document.querySelector('#page-content h1');
    if (!h1) return;
    h1.setAttribute('tabindex', '-1');
    h1.focus({ preventScroll: true });
  });
}
