import { prefersReducedMotion } from './media.js';

const LEAVE_MS = 180;
const ENTER_MS = 220;

/**
 * @returns {HTMLElement}
 */
function ensureProgress() {
  let bar = document.getElementById('page-progress');
  if (bar) return bar;

  bar = document.createElement('div');
  bar.id = 'page-progress';
  bar.className = 'page-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  return bar;
}

/**
 * @param {HTMLElement} bar
 * @param {'start' | 'done' | 'reset'} mode
 */
function setProgress(bar, mode) {
  bar.classList.remove('is-active', 'is-done');
  if (mode === 'reset') {
    bar.style.transform = 'scaleX(0)';
    return;
  }
  if (mode === 'start') {
    bar.style.transform = 'scaleX(0.18)';
    bar.classList.add('is-active');
    requestAnimationFrame(() => {
      bar.style.transform = 'scaleX(0.72)';
    });
    return;
  }
  bar.classList.add('is-active', 'is-done');
  bar.style.transform = 'scaleX(1)';
}

/**
 * @param {HTMLAnchorElement} anchor
 * @returns {boolean}
 */
function isInternalNav(anchor) {
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.getAttribute('rel')?.includes('external')) return false;

  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }

  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.search === window.location.search) {
    return false;
  }

  return true;
}

/** Soft fade + top progress bar for same-site page changes. */
export function initPageTransition() {
  const reduce = prefersReducedMotion();
  const bar = ensureProgress();
  const root = document.documentElement;

  const reveal = () => {
    root.classList.add('is-page-ready');
    root.classList.remove('is-page-leaving', 'is-page-pending');
    setProgress(bar, 'reset');
  };

  if (reduce) {
    reveal();
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(reveal);
    });
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) reveal();
  });

  if (reduce) return;

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = event.target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement) || !isInternalNav(anchor)) return;

    event.preventDefault();
    const href = anchor.href;
    if (root.classList.contains('is-page-leaving')) return;

    root.classList.add('is-page-leaving');
    root.classList.remove('is-page-ready');
    setProgress(bar, 'start');

    window.setTimeout(() => {
      setProgress(bar, 'done');
      window.location.assign(href);
    }, LEAVE_MS);
  });

  window.setTimeout(() => {
    if (!root.classList.contains('is-page-ready')) reveal();
  }, ENTER_MS + 80);
}
