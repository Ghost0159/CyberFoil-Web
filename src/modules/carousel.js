import { prefersReducedMotion } from './media.js';

const INTERVAL_MS = 5000;
const SWIPE_PX = 48;

/**
 * Builds the screenshot viewer once. Markup is static (no user input).
 * @returns {HTMLDialogElement}
 */
function createLightbox() {
  document.querySelector('.lightbox')?.remove();
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Screenshot viewer');
  dialog.innerHTML = `
    <div class="lightbox__shell">
      <img class="lightbox__image" alt="" />
      <p class="lightbox__status" aria-live="polite"></p>
      <button type="button" class="lightbox__close" aria-label="Close screenshot">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous screenshot">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 5l-8 7 8 7" />
        </svg>
      </button>
      <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next screenshot">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 5l8 7-8 7" />
        </svg>
      </button>
    </div>
  `;
  document.body.append(dialog);
  return dialog;
}

/** Starts the home screenshot carousel and a desktop/mobile lightbox. */
export function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const slides = [...root.querySelectorAll('.carousel-slide')];
  const dots = [...root.querySelectorAll('.carousel-dot')];
  const openers = [...root.querySelectorAll('.carousel-open')];
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  let touchX = null;
  const multi = slides.length > 1;
  const dialog = createLightbox();
  const image = dialog.querySelector('.lightbox__image');
  const status = dialog.querySelector('.lightbox__status');
  const prevBtn = dialog.querySelector('.lightbox__nav--prev');
  const nextBtn = dialog.querySelector('.lightbox__nav--next');

  prevBtn.hidden = !multi;
  nextBtn.hidden = !multi;

  /**
   * @param {number} slideIndex
   * @returns {HTMLImageElement | null}
   */
  const slideImage = (slideIndex) => slides[slideIndex]?.querySelector('img') ?? null;

  const syncLightbox = () => {
    const img = slideImage(index);
    if (!img) return;
    image.src = img.currentSrc || img.src;
    image.alt = img.alt;
    status.textContent = `Screenshot ${index + 1} of ${slides.length}`;
  };

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      const opener = openers[i];
      if (opener) opener.tabIndex = active ? 0 : -1;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    if (dialog.open) syncLightbox();
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (!multi || dialog.open || prefersReducedMotion()) return;
    timer = window.setInterval(() => show(index + 1), INTERVAL_MS);
  };

  const openLightbox = (slideIndex) => {
    show(slideIndex);
    stop();
    syncLightbox();
    document.body.classList.add('lightbox-open');
    if (!dialog.open) dialog.showModal();
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.index));
      start();
    });
  });

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      openLightbox(Number(opener.dataset.index));
    });
  });

  prevBtn.addEventListener('click', () => show(index - 1));
  nextBtn.addEventListener('click', () => show(index + 1));
  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.classList.contains('lightbox__shell')) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    image.removeAttribute('src');
    start();
    openers[index]?.focus({ preventScroll: true });
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
      return;
    }
    if (!multi) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(index - 1);
    }
  });

  dialog.addEventListener('touchstart', (event) => {
    if (event.target.closest('button')) {
      touchX = null;
      return;
    }
    touchX = event.changedTouches[0].clientX;
  }, { passive: true });

  dialog.addEventListener('touchend', (event) => {
    if (touchX == null || !multi) return;
    const delta = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(delta) < SWIPE_PX) return;
    show(index + (delta < 0 ? 1 : -1));
  }, { passive: true });

  openers.forEach((opener, i) => {
    opener.tabIndex = i === 0 ? 0 : -1;
  });

  if (multi) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', (event) => {
      if (!root.contains(event.relatedTarget)) start();
    });
    start();
  }
}
