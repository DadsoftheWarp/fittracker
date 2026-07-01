// ── Navigation ────────────────────────────────────────────────────────────
const SCREENS = ['today','week','progress','plan','log'];

function showScreen(id) {
  SCREENS.forEach(s => {
    document.getElementById('screen-' + s).classList.toggle('active', s === id);
    document.getElementById('nav-' + s).classList.toggle('active', s === id);
  });
  if (id === 'today')    renderToday();
  if (id === 'week')     renderWeek();
  if (id === 'progress') renderProgress();
  if (id === 'plan')     renderPlan();
  if (id === 'log')      renderLog();
}

// ── Log tab switcher ──────────────────────────────────────────────────────
function showLogTab(id) {
  ['measurements','weight','food'].forEach(t => {
    document.getElementById('ltab-' + t).classList.toggle('on', t === id);
    document.getElementById('lpane-' + t).classList.toggle('on', t === id);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateHeader();

  document.getElementById('m-date').valueAsDate = new Date();
  document.getElementById('w-date').valueAsDate = new Date();
  document.getElementById('f-date').valueAsDate = new Date();
  document.getElementById('f-time').value = new Date().toTimeString().slice(0,5);

  const hash = location.hash.replace('#','');
  showScreen(SCREENS.includes(hash) ? hash : 'today');

  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#','');
    if (SCREENS.includes(h)) showScreen(h);
  });

  if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
