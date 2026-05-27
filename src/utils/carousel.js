const INTERVAL_MS = 5000;

export function initCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  const slides = [...root.querySelectorAll('.carousel-slide')];
  const dots = [...root.querySelectorAll('.carousel-dot')];
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  };

  const start = () => {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(() => show(index + 1), INTERVAL_MS);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.index));
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });

  start();
}
