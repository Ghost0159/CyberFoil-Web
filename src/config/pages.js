import { resolve } from 'node:path';

/**
 * Single source of truth for Vite multi-page input, sitemap, and noindex rules.
 * @typedef {{ id: string, file: string, path: string | null, priority?: string, changefreq?: string, noindex?: boolean }} PageEntry
 */

/** @type {PageEntry[]} */
export const PAGE_ENTRIES = [
  { id: 'main', file: 'index.html', path: '/', priority: '1.0', changefreq: 'weekly' },
  { id: 'features', file: 'features.html', path: '/features.html', priority: '0.9', changefreq: 'monthly' },
  { id: 'guide', file: 'guide.html', path: '/guide.html', priority: '0.9', changefreq: 'monthly' },
  { id: 'changelog', file: 'changelog.html', path: '/changelog.html', priority: '0.8', changefreq: 'monthly' },
  { id: 'shop', file: 'shop.html', path: '/shop.html', priority: '0.8', changefreq: 'monthly' },
  { id: 'network', file: 'network.html', path: '/network.html', priority: '0.8', changefreq: 'monthly' },
  { id: 'install', file: 'install.html', path: '/install.html', priority: '0.8', changefreq: 'monthly' },
  { id: 'docs', file: 'docs.html', path: '/docs.html', priority: '0.8', changefreq: 'monthly' },
  { id: 'credits', file: 'credits.html', path: '/credits.html', priority: '0.5', changefreq: 'yearly' },
  { id: 'notFound', file: '404.html', path: null, noindex: true },
];

export const SITEMAP_PAGES = PAGE_ENTRIES.filter((page) => page.path != null);

export const NOINDEX_FILES = new Set(
  PAGE_ENTRIES.filter((page) => page.noindex).map((page) => page.file),
);

/**
 * @param {string} pagesDir Absolute path to src/pages
 * @returns {Record<string, string>}
 */
export function viteInput(pagesDir) {
  return Object.fromEntries(
    PAGE_ENTRIES.map((page) => [page.id, resolve(pagesDir, page.file)]),
  );
}

/**
 * @param {string} filename Absolute or relative HTML path
 * @returns {string}
 */
export function pathFromPageFile(filename) {
  const base = filename.split(/[/\\]/).pop();
  if (base === 'index.html') return '/';
  return `/${base}`;
}

/**
 * @param {string} filename Absolute or relative HTML path
 * @returns {boolean}
 */
export function isNoindexFile(filename) {
  return NOINDEX_FILES.has(filename.split(/[/\\]/).pop());
}
