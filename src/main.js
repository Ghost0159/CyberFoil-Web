import './styles/main.css';
import { initTheme } from './utils/theme.js';
import { initMobileNav, initDesktopNav } from './utils/nav.js';
import { initHeaderScroll } from './utils/header.js';

initTheme();
initMobileNav();
initDesktopNav();
initHeaderScroll();

if (document.querySelector('[data-page="not-found"]')) {
  import('./utils/not-found.js').then(({ initNotFoundRedirect }) => initNotFoundRedirect());
}
