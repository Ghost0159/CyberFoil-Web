import { writeRobotsTxt, writeSitemap } from './seo.js';

export function viteSeo() {
  return {
    name: 'vite-seo',
    closeBundle() {
      writeRobotsTxt();
      writeSitemap();
    },
  };
}
