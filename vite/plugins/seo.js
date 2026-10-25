import { writeRobotsTxt, writeSitemap } from '../render/seo.js';

export function viteSeo() {
  return {
    name: 'vite-seo',
    closeBundle() {
      writeRobotsTxt();
      writeSitemap();
    },
  };
}
