/**
 * Scroll-reveal — staggered fade-up as elements enter the viewport.
 *
 * Uses IntersectionObserver (never scroll listeners) and animates only
 * transform/opacity/filter. Honours prefers-reduced-motion by revealing
 * everything immediately.
 *
 * Usage: add class "reveal" to elements (optionally data-reveal-group for
 * per-group stagger), then call observeReveals(rootEl) after rendering.
 */

const REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let observer = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    { rootMargin: '0px 0px -4% 0px', threshold: 0.01 }
  );
  return observer;
}

/**
 * Observe all .reveal descendants of `root`. Elements sharing a
 * data-reveal-group get an incremental transition-delay for a staggered cascade.
 */
export function observeReveals(root = document) {
  const els = root.querySelectorAll('.reveal:not(.is-visible)');
  if (!els.length) return;

  // Arm the hidden state only now that JS is running — if this module ever
  // fails to load, content stays fully visible (never hidden behind opacity:0).
  document.documentElement.classList.add('reveals-armed');

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const groupCounters = new Map();
  const obs = getObserver();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  els.forEach((el) => {
    const group = el.dataset.revealGroup || 'default';
    const i = groupCounters.get(group) || 0;
    groupCounters.set(group, i + 1);
    // Cap the stagger so long lists don't wait forever
    el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 45}ms`);

    // Reveal anything already on-screen right away (don't wait for the observer
    // to tick — guarantees above-the-fold content animates in on load).
    // Next-frame so the hidden state paints first and the entrance transition plays.
    const rect = el.getBoundingClientRect();
    const onScreen = rect.top < vh * 0.95 && rect.bottom > 0;
    if (onScreen) {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    } else {
      obs.observe(el);
    }
  });
}
