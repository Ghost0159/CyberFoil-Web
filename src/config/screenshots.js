import { readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/screenshots');

/**
 * @returns {{ src: string, alt: string }[]}
 */
export function getScreenshots() {
  return readdirSync(dir)
    .filter((name) => /\.(jpe?g|png|webp|gif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name, index) => ({
      src: `/screenshots/${name}`,
      alt: `CyberFoil on Nintendo Switch, screenshot ${index + 1}`,
    }));
}
