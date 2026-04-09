// edit.js — hero create / edit form

let editingId = null; // null = new concept

async function openEdit(id) {
  editingId = id;
  const c = id ? concepts.find(x => x.id === id) : null;

  // Load edit view fresh each time
  const res = await fetch('views/edit.html');
  document.getElementById('app').innerHTML = await res.text();

  document.getElementById('edit-title').textContent    = c ? 'Edit Hero' : 'New Hero';
  document.getElementById('edit-name').value           = c?.name       || '';
  document.getElementById('edit-role').value           = c?.role       || 'Vanguard';
  document.getElementById('edit-difficulty').value     = c?.difficulty || 3;
  document.getElementById('edit-color').value          = c?.color      || '#1a1a2e';

  (c?.abilities || []).forEach(r => addRow('edit-abilities-body', 'ability', r));
  (c?.teamups   || []).forEach(r => addRow('edit-teamups-body',   'teamup',  r));
}

function cancelEdit() {
  if (editingId) {
    openDetail(editingId);
  } else {
    showView('concepts');
  }
}

function addRow(tbodyId, type, r) {
  r = r || {};
  const placeholder = type === 'ability' ? 'LMB' : 'Team-Up';
  const tbody = document.getElementById(tbodyId);
  const tr = document.createElement('tr');
  tr.className = 'edit-row';
  tr.innerHTML = `
    <td><input type="text" placeholder="${placeholder}" value="${esc(r.button || '')}"></td>
    <td><input type="text" placeholder="Name" value="${esc(r.name || '')}"></td>
    <td><textarea placeholder="Description">${esc(r.description || '')}</textarea></td>
    <td><button class="btn btn-sm danger" onclick="this.closest('tr').remove()">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function collectRows(tbodyId) {
  const rows = [];
  document.getElementById(tbodyId).querySelectorAll('tr.edit-row').forEach(tr => {
    const inputs = tr.querySelectorAll('input[type="text"], textarea');
    rows.push({
      button:      inputs[0].value.trim(),
      name:        inputs[1].value.trim(),
      description: inputs[2].value.trim(),
    });
  });
  return rows;
}

function saveConcept() {
  const name       = document.getElementById('edit-name').value.trim();
  const role       = document.getElementById('edit-role').value;
  const difficulty = parseInt(document.getElementById('edit-difficulty').value) || 1;
  const color      = document.getElementById('edit-color').value;
  const abilities  = collectRows('edit-abilities-body');
  const teamups    = collectRows('edit-teamups-body');

  if (editingId) {
    const c = concepts.find(x => x.id === editingId);
    Object.assign(c, { name, role, difficulty, color, abilities, teamups });
  } else {
    concepts.push({ id: genId(), name, role, difficulty, color, abilities, teamups });
  }

  saveConcepts();

  if (editingId) {
    openDetail(editingId);
  } else {
    showView('concepts');
  }
}