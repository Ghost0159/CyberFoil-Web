/** Sitemap entries (404 excluded). */
export const SITEMAP_PAGES = [
  { file: 'index.html', path: '/', priority: '1.0', changefreq: 'weekly' },
  { file: 'features.html', path: '/features.html', priority: '0.9', changefreq: 'monthly' },
  { file: 'guide.html', path: '/guide.html', priority: '0.9', changefreq: 'monthly' },
  { file: 'docs.html', path: '/docs.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'shop.html', path: '/shop.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'network.html', path: '/network.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'install.html', path: '/install.html', priority: '0.8', changefreq: 'monthly' },
  { file: 'credits.html', path: '/credits.html', priority: '0.5', changefreq: 'yearly' },
];

export const NOINDEX_FILES = new Set(['404.html']);

export function pathFromPageFile(filename) {
  const base = filename.split(/[/\\]/).pop();
  if (base === 'index.html') return '/';
  return `/${base}`;
}

export function isNoindexFile(filename) {
  return NOINDEX_FILES.has(filename.split(/[/\\]/).pop());
}
