/**
 * Simple hash-based router.
 * Routes:
 *   #/                    → hub/dashboard
 *   #/category/:id        → category overview
 *   #/framework/:slug     → framework page
 *   #/compare/:slug       → comparison guide
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
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { page: 'hub', params: {} };
  }

  if (parts[0] === 'category' && parts[1]) {
    return { page: 'category', params: { id: parts[1] } };
  }

  if (parts[0] === 'framework' && parts[1]) {
    return { page: 'framework', params: { slug: parts[1] } };
  }

  if (parts[0] === 'compare' && parts[1]) {
    return { page: 'compare', params: { slug: parts[1] } };
  }

  return { page: 'hub', params: {} };
}

export function initRouter() {
  const handleRoute = () => {
    const route = getRoute();
    listeners.forEach(fn => fn(route));
  };

  window.addEventListener('hashchange', handleRoute);
  // Fire on initial load
  handleRoute();
}
