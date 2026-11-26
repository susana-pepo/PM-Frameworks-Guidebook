import './styles/reset.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/pages.css';
import './styles/guide.css';
import { initRouter } from './router.js';
import { renderApp } from './components/app-shell.js';

renderApp();
initRouter();
