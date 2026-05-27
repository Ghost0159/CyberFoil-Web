import { THEME_STORAGE_KEY } from '../config/site.js';

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  const theme = stored === 'light' || stored === 'dark' ? stored : systemTheme();
  applyTheme(theme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  });
}
