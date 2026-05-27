import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { htmlLayout } from './config/vite-html-layout.js';
import { flattenPagesOut } from './config/vite-flatten-pages.js';
import { devPageRoutes } from './config/vite-dev-routes.js';
import { viteSeo } from './config/vite-seo.js';

const pagesDir = resolve(__dirname, 'src/pages');

const pages = {
  main: resolve(pagesDir, 'index.html'),
  features: resolve(pagesDir, 'features.html'),
  guide: resolve(pagesDir, 'guide.html'),
  shop: resolve(pagesDir, 'shop.html'),
  network: resolve(pagesDir, 'network.html'),
  install: resolve(pagesDir, 'install.html'),
  docs: resolve(pagesDir, 'docs.html'),
  credits: resolve(pagesDir, 'credits.html'),
  notFound: resolve(pagesDir, '404.html'),
};

export default defineConfig({
  plugins: [htmlLayout(), devPageRoutes(), flattenPagesOut(), viteSeo()],
  publicDir: resolve(__dirname, 'src/assets'),
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
});
