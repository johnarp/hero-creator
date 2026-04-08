// app.js — view router, nav highlighting, shared helpers

// Cache fetched view HTML so we don't re-fetch on every nav
const viewCache = {};

async function showView(name) {
  if (!viewCache[name]) {
    const res = await fetch(`views/${name}.html`);
    viewCache[name] = await res.text();
  }
  document.getElementById('app').innerHTML = viewCache[name];

  document.querySelectorAll('nav button[data-nav]').forEach(b => {
    b.classList.toggle('active', b.dataset.nav === name);
  });

  // Run any post-load init for this view
  if (name === 'concepts') renderGrid();
}

// Shared helpers used across concepts.js and edit.js
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function starsStr(n) {
  n = parseInt(n);
  if (!n || n < 1) n = 1;
  return '★'.repeat(n);
}

// ── Init ──────────────────────────────────────────────────────
loadConcepts();
showView('concepts');