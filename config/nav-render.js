import { NAV_GROUPS, NAV_LEADING, NAV_TRAILING } from '../src/config/site.js';

function isInGroup(group, activeId) {
  return group.items.some((item) => item.id === activeId);
}

function linkAttrs(id, activeId) {
  return id === activeId ? ' aria-current="page"' : '';
}

function desktopLink(item, activeId, className = 'nav-link') {
  return `<a class="${className}" href="${item.href}"${linkAttrs(item.id, activeId)}>${item.label}</a>`;
}

export function renderDesktopNav(activeId) {
  const parts = NAV_LEADING.map((item) => desktopLink(item, activeId));

  for (const group of NAV_GROUPS) {
    const active = isInGroup(group, activeId);
    const links = group.items.map((item) => desktopLink(item, activeId, 'nav-dropdown-link')).join('\n            ');

    parts.push(`<details class="nav-dropdown">
          <summary class="nav-dropdown-trigger${active ? ' is-active' : ''}">${group.label}</summary>
          <div class="nav-dropdown-panel">
            ${links}
          </div>
        </details>`);
  }

  parts.push(...NAV_TRAILING.map((item) => desktopLink(item, activeId)));
  return parts.join('\n        ');
}

export function renderMobileNav(activeId) {
  const blocks = [];

  blocks.push(
    NAV_LEADING.map((item) => `<a class="mobile-nav-link" href="${item.href}"${linkAttrs(item.id, activeId)}>${item.label}</a>`).join('\n        '),
  );

  for (const group of NAV_GROUPS) {
    const links = group.items
      .map((item) => `<a class="mobile-nav-link" href="${item.href}"${linkAttrs(item.id, activeId)}>${item.label}</a>`)
      .join('\n          ');

    blocks.push(`<div class="mobile-nav-group">
          <p class="mobile-nav-label">${group.label}</p>
          ${links}
        </div>`);
  }

  const trailing = NAV_TRAILING.map(
    (item) => `<a class="mobile-nav-link mobile-nav-link--trailing" href="${item.href}"${linkAttrs(item.id, activeId)}>${item.label}</a>`,
  ).join('\n        ');

  blocks.push(`<div class="mobile-nav-group mobile-nav-group--trailing">\n          ${trailing}\n        </div>`);

  return blocks.join('\n        ');
}
