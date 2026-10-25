import { LINKS, NAV_GROUPS, NAV_LEADING, NAV_TRAILING } from '../../src/config/site.js';

function isInGroup(group, activeId) {
  return group.items.some((item) => item.id === activeId);
}

function linkAttrs(id, activeId) {
  return id === activeId ? ' aria-current="page"' : '';
}

/**
 * @param {{ id: string, href: string, label: string }} item
 * @param {string} activeId
 * @param {string} [className]
 */
function navLink(item, activeId, className = 'nav-link') {
  return `<a class="${className}" href="${item.href}"${linkAttrs(item.id, activeId)}>${item.label}</a>`;
}

/**
 * Site nav markup for desktop (inline + dropdowns) and mobile (overlay panel).
 * @param {string} activeId
 * @returns {string}
 */
export function renderNav(activeId) {
  const parts = [];

  for (const item of NAV_LEADING) {
    parts.push(navLink(item, activeId));
  }

  for (const group of NAV_GROUPS) {
    const active = isInGroup(group, activeId);
    const links = group.items
      .map((item) => navLink(item, activeId, 'nav-dropdown-link'))
      .join('\n            ');

    parts.push(`<details class="nav-dropdown${active ? ' is-current' : ''}">
          <summary class="nav-dropdown-trigger${active ? ' is-active' : ''}">${group.label}</summary>
          <div class="nav-dropdown-panel">
            ${links}
          </div>
        </details>`);
  }

  for (const item of NAV_TRAILING) {
    parts.push(navLink(item, activeId));
  }

  parts.push(
    `<a class="nav-download" href="${LINKS.download}" target="_blank" rel="noopener">Download</a>`,
  );

  return parts.join('\n        ');
}
