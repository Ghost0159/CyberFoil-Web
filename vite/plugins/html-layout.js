import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LINKS, REDIRECT_DELAY_SEC, SITE, THEME_STORAGE_KEY } from '../../src/config/site.js';
import { pathFromPageFile, isNoindexFile } from '../../src/config/pages.js';
import { renderNav } from '../render/nav.js';
import { renderJsonLd, renderSeoHead } from '../render/seo.js';
import { renderHomeCarousel } from '../render/carousel.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const layoutPath = resolve(root, 'src/components/layout.html');
const themeInitPath = resolve(root, 'src/components/theme-init.html');

const PAGE_META_RE = /<!--\s*@page\s+([\s\S]*?)\s*-->/;
const SITE_FALLBACK_DESC = 'CyberFoil - Nintendo Switch homebrew installer.';

function readLayout() {
  return readFileSync(layoutPath, 'utf8');
}

function readThemeInit() {
  return readFileSync(themeInitPath, 'utf8');
}

function headExtraForPage(filename) {
  if (!filename.includes('404.html')) return '';
  return `<meta http-equiv="refresh" content="${REDIRECT_DELAY_SEC};url=/index.html" />`;
}

function parsePageMeta(html) {
  const match = html.match(PAGE_META_RE);
  if (!match) return { meta: {}, body: html.trim() };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) meta[key] = value;
  }

  const body = html.replace(PAGE_META_RE, '').trim();
  return { meta, body };
}

function applyLayout(html, filename) {
  if (!filename.includes('/pages/')) return html;

  const { meta, body } = parsePageMeta(html);
  const activeNav = meta.nav || '';
  const title = meta.title || 'CyberFoil';
  const description = meta.description || SITE_FALLBACK_DESC;
  const path = pathFromPageFile(filename);
  const noindex = isNoindexFile(filename);

  const seoHead = `${renderSeoHead({ title, description, path, noindex })}\n    ${renderJsonLd({ title, description, path })}`;
  const carousel = filename.includes('index.html') ? renderHomeCarousel() : '';
  const content = body.replaceAll('{{carousel}}', carousel);

  return readLayout()
    .replaceAll('{{title}}', title)
    .replaceAll('{{description}}', description)
    .replaceAll('{{seoHead}}', seoHead)
    .replaceAll('{{headExtra}}', headExtraForPage(filename))
    .replaceAll('{{nav}}', renderNav(activeNav))
    .replaceAll('{{content}}', content)
    .replaceAll('{{version}}', SITE.version)
    .replaceAll('{{downloadUrl}}', LINKS.download)
    .replaceAll('{{repoUrl}}', LINKS.repo)
    .replaceAll('{{releasesUrl}}', LINKS.releases)
    .replaceAll('{{discordUrl}}', LINKS.discord)
    .replaceAll('{{licenseUrl}}', LINKS.license)
    .replaceAll('{{offlineDbUrl}}', LINKS.offlineDb)
    .replaceAll('{{plutoniumUrl}}', LINKS.plutonium)
    .replaceAll('{{authorUrl}}', LINKS.author)
    .replaceAll('{{themeInit}}', readThemeInit().replaceAll('{{storageKey}}', THEME_STORAGE_KEY));
}

export function htmlLayout() {
  return {
    name: 'cyberfoil-html-layout',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        return applyLayout(html, ctx.filename);
      },
    },
  };
}
