export const THEME_STORAGE_KEY = 'cyberfoil-theme';

export const DOMAIN = 'cyberfoil.foo';

export const SITE = {
  name: 'CyberFoil',
  author: 'luketanti',
  version: '1.4.4',
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
  plutonium: 'https://github.com/XorTroll/Plutonium',
};

export const NAV_LEADING = [
  { id: 'home', href: 'index.html', label: 'Home' },
];

export const NAV_GROUPS = [
  {
    id: 'start',
    label: 'Start',
    items: [
      { id: 'features', href: 'features.html', label: 'Features' },
      { id: 'guide', href: 'guide.html', label: 'Guide' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    items: [
      { id: 'docs', href: 'docs.html', label: 'Docs' },
      { id: 'shop', href: 'shop.html', label: 'Shop API' },
      { id: 'network', href: 'network.html', label: 'Network' },
      { id: 'install', href: 'install.html', label: 'Install' },
    ],
  },
];

export const NAV_TRAILING = [
  { id: 'credits', href: 'credits.html', label: 'Credits' },
];

/** @deprecated Use NAV_GROUPS; kept for any external import */
export const NAV = [
  ...NAV_LEADING,
  ...NAV_GROUPS.flatMap((g) => g.items),
  ...NAV_TRAILING,
];
