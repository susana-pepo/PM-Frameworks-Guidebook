import { setPageMeta } from '../utils/page-meta.js';

export function renderNotFound(container, message = 'There is no page at this address.') {
  container.innerHTML = `
    <div class="page state-page">
      <h1>Page not found</h1>
      <p class="state-text">${message}</p>
      <a class="btn" href="#/">Back to the index</a>
    </div>`;
  setPageMeta({ title: 'Page not found' });
}
