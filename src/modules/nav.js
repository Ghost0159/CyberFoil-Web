const DESKTOP_NAV = '(min-width: 768px)';

/**
 * Opens the shared site nav as a full-page mobile panel and locks scroll.
 */
export function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const desktop = window.matchMedia(DESKTOP_NAV);

  /**
   * @param {boolean} open
   */
  const setOpen = (open) => {
    const mobile = !desktop.matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open && mobile);

    if (mobile) {
      nav.setAttribute('aria-hidden', String(!open));
      if (typeof nav.inert === 'boolean') nav.inert = !open;
      nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
        dropdown.open = true;
        const summary = dropdown.querySelector('summary');
        if (summary) summary.tabIndex = -1;
      });
    } else {
      nav.removeAttribute('aria-hidden');
      if (typeof nav.inert === 'boolean') nav.inert = false;
      nav.querySelectorAll('.nav-dropdown > summary').forEach((summary) => {
        summary.removeAttribute('tabindex');
      });
    }
  };

  const close = () => setOpen(false);
  setOpen(false);

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktop.matches) close();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      close();
      toggle.focus();
    }
  });

  desktop.addEventListener('change', () => {
    close();
    if (desktop.matches) {
      nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
        dropdown.open = false;
      });
    }
  });
}

/** Closes desktop nav dropdowns on outside click and Escape. */
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
      if (document.body.classList.contains('nav-open')) return;
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.open = false;
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (document.body.classList.contains('nav-open')) return;
    if (event.target.closest('.nav-dropdown')) return;
    dropdowns.forEach((dropdown) => {
      dropdown.open = false;
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || document.body.classList.contains('nav-open')) return;
    dropdowns.forEach((dropdown) => {
      dropdown.open = false;
    });
  });
}
