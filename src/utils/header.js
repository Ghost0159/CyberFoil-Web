export function initHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
