import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, LINKS } from '../src/config/site.js';
import { SITEMAP_PAGES } from '../src/config/pages-seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function absoluteUrl(path) {
  if (path === '/') return `${SITE.url}/`;
  return `${SITE.url}${path}`;
}

export function renderSeoHead({ title, description, path, noindex }) {
  const canonical = absoluteUrl(path);
  const image = `${SITE.url}${SITE.ogImage}`;
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);

  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="author" content="${escapeHtml(SITE.author)}" />`,
    `<meta name="theme-color" content="#d63850" media="(prefers-color-scheme: light)" />`,
    `<meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDesc}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDesc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];

  return tags.join('\n    ');
}

export function renderJsonLd({ title, description, path }) {
  const url = absoluteUrl(path);
  const payload =
    path === '/'
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: SITE.name,
              url: SITE.url,
              description: SITE.tagline,
            },
            {
              '@type': 'SoftwareApplication',
              name: SITE.name,
              applicationCategory: 'GameApplication',
              operatingSystem: 'Nintendo Switch',
              description,
              url,
              downloadUrl: LINKS.download,
              softwareVersion: SITE.version,
              license: 'https://www.gnu.org/licenses/gpl-3.0.html',
              author: { '@type': 'Person', name: SITE.author },
            },
          ],
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url,
          isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
        };

  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

export function writeRobotsTxt(outDir = 'dist') {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`;
  writeFileSync(resolve(root, outDir, 'robots.txt'), body, 'utf8');
}

export function writeSitemap(outDir = 'dist') {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = SITEMAP_PAGES.map(
    ({ path, priority, changefreq }) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  writeFileSync(resolve(root, outDir, 'sitemap.xml'), xml, 'utf8');
}
