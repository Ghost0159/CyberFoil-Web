import './styles/main.css';
import { initTheme } from './modules/theme.js';
import { initMobileNav, initDesktopNav } from './modules/nav.js';
import { initHeaderScroll } from './modules/header.js';
import { initCarousel } from './modules/carousel.js';
import { initDocToc } from './modules/doc-toc.js';
import { initPageTransition } from './modules/page-transition.js';

initTheme();
initMobileNav();
initDesktopNav();
initHeaderScroll();
initCarousel();
initDocToc();
initPageTransition();

if (document.querySelector('[data-page="not-found"]')) {
  import('./modules/not-found.js').then(({ initNotFoundRedirect }) => initNotFoundRedirect());
}
