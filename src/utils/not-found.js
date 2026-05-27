const DELAY_SEC = 10;

function homeUrl() {
  return new URL('index.html', import.meta.env.BASE_URL).href;
}

export function initNotFoundRedirect() {
  const counter = document.getElementById('countdown');
  let remaining = DELAY_SEC;

  const tick = () => {
    if (counter) counter.textContent = String(remaining);
    if (remaining <= 0) {
      window.location.replace(homeUrl());
      return;
    }
    remaining -= 1;
    window.setTimeout(tick, 1000);
  };

  tick();
}
