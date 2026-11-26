/**
 * Hash router.
 *
 *   #/                              home (the index)
 *   #/category/:id                  category
 *   #/framework/:slug               framework guide, opening view
 *   #/framework/:slug/:section      framework guide, one section
 *   #/compare/:slug[/:section]      comparison guide
 *
 * Legacy deep links (#/framework/rice/step/3) map to a numeric section.
 */

const listeners = [];

export function onNavigate(fn) {
  listeners.push(fn);
}

export function navigate(path) {
  window.location.hash = path;
}

export function getRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) return { page: 'hub', params: {} };

  if (parts[0] === 'category' && parts[1]) {
    return { page: 'category', params: { id: parts[1] } };
  }

  if ((parts[0] === 'framework' || parts[0] === 'compare') && parts[1]) {
    const params = { slug: parts[1], section: null, step: null };
    if (parts[2] === 'step' && parts[3] != null) {
      params.step = parseInt(parts[3], 10);
    } else if (parts[2]) {
      params.section = parts[2];
    }
    return { page: parts[0], params };
  }

  return { page: 'hub', params: {} };
}

export function initRouter() {
  let last = null;
  const handle = () => {
    const route = getRoute();
    route.prev = last;
    last = route;
    listeners.forEach(fn => fn(route));
  };
  window.addEventListener('hashchange', handle);
  handle();
}
