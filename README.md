# CyberFoil Web

[![Version](https://img.shields.io/badge/site-1.1.0-d63850)](https://cyberfoil.foo)
[![CyberFoil](https://img.shields.io/badge/CyberFoil-1.5.0-d63850)](https://github.com/luketanti/CyberFoil/releases)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white)](https://discord.gg/gGy7hWxJeP)

Static site for **CyberFoil**, a Nintendo Switch homebrew installer that pulls NSP, NSZ, XCI, and XCZ from SD, LAN, Remote, USB, or MTP.

Live: [cyberfoil.foo](https://cyberfoil.foo) · App repo: [luketanti/CyberFoil](https://github.com/luketanti/CyberFoil)

## Features

- Multi-source install: SD, LAN (`:2000`), Remote catalog, USB, MTP
- Save backup and cheat sync with AeroFoil-compatible remotes
- Offline title DB / custom packs, themes, install queue
- Docs for config paths, Remote API, network, and install pipeline
- Light / dark theme, responsive layout, SEO (sitemap + JSON-LD)

## Quick start

### Use CyberFoil on Switch

1. Download the latest release from [GitHub Releases](https://github.com/luketanti/CyberFoil/releases/latest).
2. Extract to the SD card (`switch/CyberFoil/`).
3. Launch `cyberfoil.nro` from the homebrew menu.

### Develop this website

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output -> dist/
npm run preview  # serve dist locally
```

Requires Node.js 22+ (matches CI). Deploy publishes `dist/` to the `build` branch via GitHub Actions.

## Project structure

```
vite/                 Build plugins, HTML renderers, shared escape helper
src/
  assets/             Public static files (logo, screenshots, CNAME)
  components/         Shell layout + early theme init
  config/             Site metadata, page registry, screenshots
  modules/            Client JS (nav, theme, carousel, TOC, transitions)
  pages/              HTML pages (content only; layout injected at build)
  styles/             Tokens + layout + components + page CSS
```

**Stack:** Vite 6, vanilla ES modules, plain CSS (design tokens). No framework.

Page list, Vite inputs, sitemap, and noindex rules live in one place: `src/config/pages.js`.

## Credits & disclaimer

CyberFoil builds on work from the homebrew community, including Huntereb (Awoo Installer), XorTroll (Plutonium), Atmosphere Team (libhaze), DarkMatterCore (libusbhsfs), and Adubbz (Tinfoil MIT portions).

**Not affiliated with Nintendo.** Nintendo Switch is a trademark of Nintendo.

License: [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) · Author: [luketanti](https://github.com/luketanti)
