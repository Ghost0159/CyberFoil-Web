import { getScreenshots } from '../../src/config/screenshots.js';
import { escapeHtml } from '../lib/escape-html.js';

export function renderHomeCarousel() {
  const shots = getScreenshots();
  if (!shots.length) {
    return '<div class="home-carousel home-carousel--empty" aria-hidden="true"></div>';
  }

  const slides = shots.map(
    (shot, index) => `<figure class="carousel-slide${index === 0 ? ' is-active' : ''}" data-slide="${index}">
            <button type="button" class="carousel-open" data-index="${index}" aria-label="View screenshot ${index + 1} larger">
              <img src="${shot.src}" alt="${escapeHtml(shot.alt)}" width="1280" height="720" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" />
            </button>
          </figure>`,
  ).join('\n          ');

  const dots = shots.map(
    (_, index) => `<button type="button" class="carousel-dot${index === 0 ? ' is-active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" aria-label="Screenshot ${index + 1}" data-index="${index}"></button>`,
  ).join('\n          ');

  return `<div class="home-carousel" data-carousel>
        <div class="carousel-viewport">
          ${slides}
        </div>
        <div class="carousel-dots" role="tablist" aria-label="Screenshots">
          ${dots}
        </div>
      </div>`;
}
