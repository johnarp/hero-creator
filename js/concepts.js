// concepts.js — concepts grid, detail view, delete

function renderGrid() {
  const grid = document.getElementById('concepts-grid');
  grid.innerHTML = '';

  concepts.forEach(c => {
    const card = document.createElement('div');
    card.className = 'concept-card';
    card.style.backgroundColor = c.color || '#1a1a2e';
    card.style.color = '#fff';
    card.innerHTML = `
      <div class="card-name">${esc(c.name) || '<em>Unnamed</em>'}</div>
      <div class="card-role">${esc(c.role) || ''}</div>
      <div class="card-stars">${starsStr(c.difficulty)}</div>
    `;
    card.onclick = () => openDetail(c.id);
    grid.appendChild(card);
  });

  // "New" card — always last
  const newCard = document.createElement('div');
  newCard.className = 'concept-card new-card';
  newCard.textContent = '+';
  newCard.title = 'Create new concept';
  newCard.onclick = () => openEdit(null);
  grid.appendChild(newCard);
}

async function openDetail(id) {
  const c = concepts.find(x => x.id === id);
  if (!c) return;

  // Load the detail view fresh (bypass cache so DOM is clean)
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
    tbody.innerHTML = '<tr><td colspan="3" class="empty">—</td></tr>';
    return;
  }
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${esc(r.button)}</td>
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