import { existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export function flattenPagesOut() {
  return {
    name: 'flatten-pages-out',
    closeBundle() {
      const nested = join('dist', 'src', 'pages');
      if (!existsSync(nested)) return;

      for (const file of readdirSync(nested)) {
        if (!file.endsWith('.html')) continue;
        renameSync(join(nested, file), join('dist', file));
      }

      rmSync(join('dist', 'src'), { recursive: true, force: true });
    },
  };
}
