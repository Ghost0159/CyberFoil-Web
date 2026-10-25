export const THEME_STORAGE_KEY = 'cyberfoil-theme';

/** Seconds before the 404 page redirects home (meta refresh + JS countdown). */
export const REDIRECT_DELAY_SEC = 10;

export const DOMAIN = 'cyberfoil.foo';

/** Public site metadata used by layout, SEO, and JSON-LD. `version` is the documented CyberFoil release. */
export const SITE = {
  name: 'CyberFoil',
  author: 'luketanti',
  version: '1.5.0',
  tagline: 'Nintendo Switch homebrew installer.',
  url: `https://${DOMAIN}`,
  ogImage: '/icon.jpg',
};

export const LINKS = {
  repo: 'https://github.com/luketanti/CyberFoil',
  releases: 'https://github.com/luketanti/CyberFoil/releases',
  download: 'https://github.com/luketanti/CyberFoil/releases/latest',
  discord: 'https://discord.gg/gGy7hWxJeP',
  license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  offlineDb: 'https://github.com/luketanti/CyberFoil-DB',
  aerofoil: 'https://github.com/luketanti/AeroFoil',
  plutonium: 'https://github.com/XorTroll/Plutonium',
  author: 'https://github.com/luketanti',
};

export const NAV_LEADING = [
  { id: 'home', href: 'index.html', label: 'Home' },
  { id: 'features', href: 'features.html', label: 'Features' },
];

export const NAV_GROUPS = [
  {
    id: 'guides',
    label: 'Guide',
    items: [
      { id: 'guide', href: 'guide.html', label: 'Install guide' },
      { id: 'changelog', href: 'changelog.html', label: 'Changelog' },
    ],
  },
  {
    id: 'docs',
    label: 'Docs',
    items: [
      { id: 'docs', href: 'docs.html', label: 'Reference' },
      { id: 'shop', href: 'shop.html', label: 'Remote API' },
      { id: 'network', href: 'network.html', label: 'Network' },
      { id: 'install', href: 'install.html', label: 'Install pipeline' },
    ],
  },
];

export const NAV_TRAILING = [
  { id: 'credits', href: 'credits.html', label: 'Credits' },
];
