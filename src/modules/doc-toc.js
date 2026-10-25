const DESKTOP_QUERY = '(min-width: 1024px)';
const MAX_TOC_ITEMS = 24;

/**
 * Build a unique URL slug from heading text.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

/**
 * Resolve the element that owns the heading's hash (heading, ancestor, or generated id).
 * @param {HTMLElement} heading
 * @param {Set<string>} used
 * @returns {HTMLElement}
 */
function resolveTarget(heading, used) {
  if (heading.id) {
    used.add(heading.id);
    return heading;
  }

  const ancestor = heading.closest('[id]');
  if (heading.tagName === 'H2' && ancestor?.id && !used.has(ancestor.id)) {
    used.add(ancestor.id);
    return ancestor;
  }

  const base = slugify(heading.textContent || '');
  let candidate = base;
  let n = 2;
  while (used.has(candidate) || document.getElementById(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  heading.id = candidate;
  used.add(candidate);
  return heading;
}

/**
 * @param {HTMLElement} body
 * @param {string} mode `h2` or `h2-h3`
 * @returns {HTMLElement[]}
 */
function collectHeadings(body, mode) {
  const wantH3 = mode !== 'h2';
  const headings = [...body.querySelectorAll(wantH3 ? 'h2, h3' : 'h2')];
  if (wantH3 && headings.length > MAX_TOC_ITEMS) {
    return headings.filter((heading) => heading.tagName === 'H2');
  }
  return headings;
}

/**
 * @param {HTMLElement[]} headings
 * @returns {{ list: HTMLOListElement, items: { id: string, el: HTMLElement, heading: HTMLElement, level: number }[] }}
 */
function buildList(headings) {
  const used = new Set();
  const items = headings.map((heading) => {
    const target = resolveTarget(heading, used);
    return {
      id: target.id,
      el: target,
      heading,
      level: heading.tagName === 'H3' ? 3 : 2,
      text: (heading.textContent || '').replace(/\s+/g, ' ').trim(),
    };
  });

  const list = document.createElement('ol');
  list.className = 'doc-toc-list';

  let nested = null;
  for (const item of items) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'doc-toc-link';
    link.href = `#${item.id}`;
    link.textContent = item.text;
    li.append(link);

    if (item.level === 3 && nested) {
      nested.append(li);
      continue;
    }

    list.append(li);
    nested = document.createElement('ol');
    nested.className = 'doc-toc-list';
    li.append(nested);
  }

  list.querySelectorAll(':scope > li > ol.doc-toc-list').forEach((sub) => {
    if (!sub.children.length) sub.remove();
  });

  return { list, items };
}

/**
 * Keep the TOC highlight in sync with the heading in the reading window.
 * IntersectionObserver drives updates; the last heading above the header line wins.
 * @param {{ id: string, heading: HTMLElement }[]} items
 * @param {HTMLElement} nav
 * @param {string} [initialId]
 */
function observeActive(items, nav, initialId) {
  const links = new Map();
  nav.querySelectorAll('.doc-toc-link').forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    if (id) links.set(id, link);
  });

  let current = '';
  const setActive = (id) => {
    if (!id || current === id) return;
    current = id;
    links.forEach((link, key) => {
      const on = key === id;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const headerOffset = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
  ) || 52;
  const marker = headerOffset + 72;

  const pickNearest = () => {
    let nearest = items[0];
    for (const item of items) {
      if (item.heading.getBoundingClientRect().top <= marker) nearest = item;
    }
    if (nearest) setActive(nearest.id);
  };

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('.doc-toc-link');
    const id = link?.getAttribute('href')?.slice(1);
    if (id) setActive(id);
  });

  window.addEventListener('scroll', pickNearest, { passive: true });
  document.addEventListener('scroll', pickNearest, { passive: true, capture: true });
  window.addEventListener('hashchange', pickNearest);

  const observer = new IntersectionObserver(pickNearest, {
    rootMargin: `-${headerOffset + 8}px 0px -45% 0px`,
    threshold: [0, 0.25, 0.5, 1],
  });

  items.forEach((item) => observer.observe(item.heading));

  if (initialId) setActive(initialId);
  else pickNearest();
}

/**
 * Generate a sticky / collapsible table of contents for `.doc-shell` pages.
 */
export function initDocToc() {
  const shell = document.querySelector('.doc-shell');
  const body = shell?.querySelector('.doc-body');
  const nav = shell?.querySelector('.doc-toc');
  const drawer = shell?.querySelector('.doc-toc-drawer');
  if (!shell || !body || !nav || !drawer) return;

  const headings = collectHeadings(body, shell.getAttribute('data-toc') || 'h2-h3');
  if (!headings.length) return;

  const { list, items } = buildList(headings);
  nav.append(list);

  const desktop = window.matchMedia(DESKTOP_QUERY);
  const syncOpen = () => {
    drawer.open = desktop.matches;
  };
  syncOpen();
  desktop.addEventListener('change', syncOpen);

  nav.addEventListener('click', (event) => {
    if (!desktop.matches && event.target.closest('.doc-toc-link')) {
      drawer.open = false;
    }
  });

  const hashId = location.hash.slice(1);
  const knownHash = hashId && items.some((item) => item.id === hashId) ? hashId : '';
  if (knownHash) {
    document.getElementById(knownHash)?.scrollIntoView();
  }

  observeActive(items, nav, knownHash);
}
