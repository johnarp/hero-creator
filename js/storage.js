// storage.js — localStorage load/save, import/export JSON

const STORAGE_KEY = 'marvel-rivals-concepts';
let concepts = [];

function loadConcepts() {
  try { concepts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { concepts = []; }
}

function saveConcepts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(concepts));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(concepts, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'marvel-rivals-concepts.json';
  a.click();
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const msg = document.getElementById('settings-msg');
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) throw new Error();
      let added = 0;
      data.forEach(c => {
        if (c.id && !concepts.find(x => x.id === c.id)) {
          concepts.push(c);
          added++;
        }
      });
      saveConcepts();
      msg.style.color = 'green';
      msg.textContent = `Imported ${added} new concept(s). ${data.length - added} duplicate(s) skipped.`;
    } catch {
      msg.style.color = 'red';
      msg.textContent = 'Error: could not parse file. Make sure it is a valid concepts JSON.';
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}