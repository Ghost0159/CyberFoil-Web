const PAGE_RE = /^\/[\w-]+\.html$/;
const ASSET_RE = /\.\w+$/;

export function devPageRoutes() {
  return {
    name: 'dev-page-routes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0] ?? '/';

        if (path === '/') {
          req.url = '/src/pages/index.html';
        } else if (PAGE_RE.test(path)) {
          req.url = `/src/pages${path}`;
        } else if (!ASSET_RE.test(path) && !path.startsWith('/@') && !path.startsWith('/src/')) {
          req.url = '/src/pages/404.html';
        }

        next();
      });
    },
  };
}
