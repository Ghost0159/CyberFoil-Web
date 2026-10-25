import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { viteInput } from './src/config/pages.js';
import { htmlLayout } from './vite/plugins/html-layout.js';
import { flattenPagesOut } from './vite/plugins/flatten-pages.js';
import { devPageRoutes } from './vite/plugins/dev-routes.js';
import { viteSeo } from './vite/plugins/seo.js';

const pagesDir = resolve(__dirname, 'src/pages');

export default defineConfig({
  plugins: [htmlLayout(), devPageRoutes(), flattenPagesOut(), viteSeo()],
  publicDir: resolve(__dirname, 'src/assets'),
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: viteInput(pagesDir),
    },
  },
});
