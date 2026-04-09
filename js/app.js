// app.js — view router, nav highlighting, shared helpers

const viewCache = {};

async function showView(name) {
  if (!viewCache[name]) {
    const res = await fetch(`views/${name}.html`);
    viewCache[name] = await res.text();
  }
  document.getElementById('app').innerHTML = viewCache[name];

  document.querySelectorAll('nav ul a[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === name);
  });

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