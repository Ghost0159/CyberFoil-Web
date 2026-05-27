import { SCREENSHOTS } from '../src/config/screenshots.js';

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function renderHomeCarousel() {
  if (!SCREENSHOTS.length) {
    return '<div class="home-carousel home-carousel--empty" aria-hidden="true"></div>';
  }

  const slides = SCREENSHOTS.map(
    (shot, index) => `<figure class="carousel-slide${index === 0 ? ' is-active' : ''}" data-slide="${index}">
            <img src="${shot.src}" alt="${escapeHtml(shot.alt)}" width="1280" height="720" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" />
          </figure>`,
  ).join('\n          ');

  const dots = SCREENSHOTS.map(
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
