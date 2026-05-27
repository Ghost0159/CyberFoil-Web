export function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.hidden = true;
    document.body.classList.remove('nav-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
    document.body.classList.toggle('nav-open', !open);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
}

export function initDesktopNav() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    dropdown.open = false;

    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        dropdown.open = false;
      });
    });

    dropdown.addEventListener('toggle', () => {
      if (!dropdown.open) return;
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.open = false;
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.nav-dropdown')) return;
    dropdowns.forEach((dropdown) => {
      dropdown.open = false;
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dropdowns.forEach((dropdown) => {
        dropdown.open = false;
      });
    }
  });
}
