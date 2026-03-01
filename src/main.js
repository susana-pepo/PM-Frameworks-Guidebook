import './styles/tokens.css';
import './styles/reset.css';
import './styles/base.css';
import './styles/components.css';
import './styles/framework-page.css';
import { initRouter } from './router.js';
import { renderApp } from './components/app-shell.js';

// Bootstrap the app
renderApp();
initRouter();
