'use strict';
const el = id => document.getElementById(id);
const endpoint = 'https://api.github.com/repos/Brandsurface/Bliv-ppwr-klar/contents/content.json';
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
async function publish() {
  const token = el('token').value.trim();
  if (!token) { status('Indtast et GitHub-token for at udgive.'); return; }
  busy = true; el('save').disabled = true; el('rows').inert = true;
  const headers = {Authorization:'Bearer ' + token, Accept:'application/vnd.github+json'};
  try {
    const response = await fetch(endpoint + '?ref=main',{headers,cache:'no-store'});
    if (!response.ok) throw Error('GitHub kunne ikke læse filen. Kontrollér token og adgang.');
    const file = await response.json();
    const next = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content), c => c.charCodeAt(0))));
    for (const [key, changes] of Object.entries(draft)) {
      for (const [lang, change] of Object.entries(changes)) {
        if (!next[key] || ![change.from,change.to].includes(next[key][lang])) throw Error('Teksten er ændret i GitHub. Genindlæs og gennemgå feltet: ' + key);
        if (!change.to.trim()) throw Error('Udfyld det tomme felt: ' + key);
        next[key][lang] = change.to;
      }
    }
    const bytes = new TextEncoder().encode(JSON.stringify(next,null,2) + '\n');
    const encoded = btoa(Array.from(bytes, b => String.fromCharCode(b)).join(''));
    const saved = await fetch(endpoint,{method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({message:'Update PPWR editorial content',branch:'main',sha:file.sha,content:encoded})});
    if (!saved.ok) throw Error('GitHub afviste udgivelsen (' + saved.status + '). Kontrollér skriveadgang og eventuelle samtidige ændringer.');
    content = next; draft = {}; draw(); status('Gemt i GitHub. Vercel udgiver ændringerne.');
  } catch (error) { status(error.message); }
  finally { el('token').value = ''; busy = false; el('rows').inert = false; persist(); }
}
async function start() {
  const response = await fetch('/content.json',{cache:'no-store'});
  if (!response.ok) throw Error('Teksterne kunne ikke hentes.');
  content = await response.json();
  try { draft = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { draft = {}; }
  for (const group of new Set(Object.values(content).map(row => row.group))) el('group').add(new Option(group,group));
  el('search').oninput = draw; el('group').onchange = draw; el('save').onclick = publish;
  if (Object.keys(draft).length) status('Din tidligere kladde er hentet.');
  draw(); persist();
}
start().catch(error => status(error.message));
