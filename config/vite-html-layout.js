import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEME_STORAGE_KEY } from '../src/config/site.js';
import { renderDesktopNav, renderMobileNav } from './nav-render.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const layout = readFileSync(resolve(root, 'src/components/layout.html'), 'utf8');
const themeInit = readFileSync(resolve(root, 'src/components/theme-init.html'), 'utf8');

const PAGE_META_RE = /<!--\s*@page\s+([\s\S]*?)\s*-->/;
const SITE_FALLBACK_DESC = 'CyberFoil - Nintendo Switch homebrew installer.';
const REDIRECT_DELAY_SEC = 10;

function homeHref() {
  return '/index.html';
}

function headExtraForPage(filename) {
  if (!filename.includes('404.html')) return '';
  return `<meta http-equiv="refresh" content="${REDIRECT_DELAY_SEC};url=${homeHref()}" />`;
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

  return layout
    .replaceAll('{{title}}', meta.title || 'CyberFoil')
    .replaceAll('{{description}}', meta.description || SITE_FALLBACK_DESC)
    .replaceAll('{{headExtra}}', headExtraForPage(filename))
    .replaceAll('{{navDesktop}}', renderDesktopNav(activeNav))
    .replaceAll('{{navMobile}}', renderMobileNav(activeNav))
    .replaceAll('{{content}}', body)
    .replaceAll('{{themeInit}}', themeInit.replaceAll('{{storageKey}}', THEME_STORAGE_KEY));
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
