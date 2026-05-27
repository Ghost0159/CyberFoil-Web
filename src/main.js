import './styles/main.css';
import { initTheme } from './utils/theme.js';
import { initMobileNav, initDesktopNav } from './utils/nav.js';
import { initHeaderScroll } from './utils/header.js';
import { initCarousel } from './utils/carousel.js';

initTheme();
initMobileNav();
initDesktopNav();
initHeaderScroll();
initCarousel();

if (document.querySelector('[data-page="not-found"]')) {
  import('./utils/not-found.js').then(({ initNotFoundRedirect }) => initNotFoundRedirect());
}
