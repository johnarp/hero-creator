// concepts.js — concepts grid, detail view, delete

function renderGrid() {
  const grid = document.getElementById('concepts-grid');
  grid.innerHTML = '';

  concepts.forEach(c => {
    const outer = document.createElement('div');
    outer.className = 'concept-card-outer';
    outer.innerHTML = `
      <div class="concept-card-wrap">
        <div class="concept-card" style="background-color:${esc(c.color || '#1a1a2e')};">
          <div class="card-name">${esc(c.name) || '<em>Unnamed</em>'}</div>
          <div class="card-role">${esc(c.role) || ''}</div>
          <div class="card-stars">${starsStr(c.difficulty)}</div>
        </div>
      </div>
    `;
    outer.onclick = () => openDetail(c.id);
    grid.appendChild(outer);
  });

  // "New" card — always last
  const newOuter = document.createElement('div');
  newOuter.className = 'concept-card-outer new-card';
  newOuter.title = 'Create new concept';
  newOuter.innerHTML = `
    <div class="concept-card-wrap">
      <div class="concept-card">
        <span class="new-card-icon">+</span>
      </div>
    </div>
  `;
  newOuter.onclick = () => openEdit(null);
  grid.appendChild(newOuter);
}

async function openDetail(id) {
  const c = concepts.find(x => x.id === id);
  if (!c) return;

  const res = await fetch('views/detail.html');
  document.getElementById('app').innerHTML = await res.text();

  document.getElementById('detail-name').textContent  = c.name || 'Unnamed';
  document.getElementById('detail-stars').textContent = starsStr(c.difficulty);
  document.getElementById('detail-role').textContent  = c.role || '';
  document.getElementById('detail-banner').style.backgroundColor = c.color || '#1a1a2e';

  document.getElementById('detail-edit-btn').onclick   = () => openEdit(id);
  document.getElementById('detail-delete-btn').onclick = () => deleteConcept(id);

  populateDetailTable('detail-abilities-table', c.abilities || []);
  populateDetailTable('detail-teamups-table',   c.teamups   || []);
}

function populateDetailTable(tableId, rows) {
  const tbody = document.querySelector('#' + tableId + ' tbody');
  tbody.innerHTML = '';
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="empty">No entries yet.</td></tr>';
    return;
  }
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-button">${esc(r.button)}</td>
      <td>${esc(r.name)}</td>
      <td>${esc(r.description)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteConcept(id) {
  if (!confirm('Delete this concept? This cannot be undone.')) return;
  concepts = concepts.filter(x => x.id !== id);
  saveConcepts();
  showView('concepts');
}