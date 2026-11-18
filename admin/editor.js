'use strict';
const el = id => document.getElementById(id);
let credential = '';
let expiry;
const storageKey = 'ppwr-editor-draft-v1';
let content, draft = {}, busy = false;
const status = message => { el('status').textContent = message; };
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(draft)); }
  catch { status('Browseren kan ikke gemme kladden. Hold fanen åben.'); }
  el('save').disabled = busy || !Object.keys(draft).length;
}
function draw() {
  const query = el('search').value.toLocaleLowerCase();
  const cards = [];
  for (const [key, row] of Object.entries(content)) {
    const values = ['da','en'].map(lang => draft[key]?.[lang]?.to ?? row[lang]);
    if (el('group').value && el('group').value !== row.group) continue;
    if (![key,...values].some(v => v.toLocaleLowerCase().includes(query))) continue;
    const card = document.createElement('article'), heading = document.createElement('h2');
    heading.textContent = row.group;
    const pair = document.createElement('div');
    pair.className = 'pair';
    for (const [i, lang] of ['da','en'].entries()) {
      const label = document.createElement('label'), field = document.createElement('textarea');
      label.append(lang === 'da' ? 'Dansk' : 'English');
      field.lang = lang;
      field.value = values[i];
      field.rows = values[i].length > 80 ? 4 : 2;
      field.oninput = () => {
        if (field.value === row[lang]) {
          if (draft[key]) delete draft[key][lang];
          if (draft[key] && !Object.keys(draft[key]).length) delete draft[key];
        } else {
          draft[key] ??= {};
          draft[key][lang] = {from:row[lang], to:field.value};
        }
        status(Object.keys(draft).length + ' tekstfelter med ændringer.');
        persist();
      };
      label.append(field); pair.append(label);
    }
    card.append(heading,pair); cards.push(card);
  }
  el('rows').replaceChildren(...cards);
  el('count').textContent = cards.length + ' tekster';
}
async function request(token, payload) {
  const response = await fetch('/api/admin', {method:'POST', credentials:'omit', cache:'no-store',
    headers:{Authorization:'Bearer ' + token, 'Content-Type':'application/json'}, body:JSON.stringify(payload)});
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) lock();
    throw Error(result.message || 'Adgang afvist.');
  }
  return result;
}
function lock() {
  clearTimeout(expiry);
  credential = '';
  content = undefined;
  draft = {};
  el('editor').replaceChildren();
  el('login').hidden = false;
  el('token').value = '';
  status('');
}
function openEditor(markup) {
  const editor = el('editor');
  editor.innerHTML = markup;
  el('logout').onclick = () => { lock(); el('token').focus(); };
  for (const group of new Set(Object.values(content).map(row => row.group))) el('group').add(new Option(group,group));
  el('search').oninput = draw; el('group').onchange = draw; el('save').onclick = publish;
  draw(); persist();
}
el('login-form').onsubmit = async event => {
  event.preventDefault();
  const token = el('token').value.trim();
  el('token').value = '';
  el('sign-in').disabled = true;
  status('Kontrollerer adgang …');
  try {
    const result = await request(token, {action:'login'});
    credential = token;
    content = result.content;
    try { draft = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { draft = {}; }
    el('login').hidden = true;
    openEditor(result.editorMarkup);
    status(Object.keys(draft).length ? 'Din tidligere kladde er hentet.' : '');
    expiry = setTimeout(() => { lock(); status('Log ind igen for at fortsætte.'); }, 30 * 60 * 1000);
  } catch (error) { status(error.message); }
  finally { el('sign-in').disabled = false; }
};
async function publish() {
  if (busy || !credential) return;
  busy = true;
  el('save').disabled = true; el('rows').inert = true;
  el('logout').disabled = true;
  try {
    const result = await request(credential, {action:'publish', changes:draft});
    if (!credential) return;
    content = result.content; draft = {}; draw();
    status('Gemt i GitHub. Vercel udgiver ændringerne.');
  } catch (error) { status(error.message); }
  finally {
    busy = false;
    if (credential) { el('rows').inert = false; el('logout').disabled = false; persist(); }
  }
}
window.addEventListener('pagehide', lock);
