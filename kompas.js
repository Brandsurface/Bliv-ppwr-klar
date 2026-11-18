const el = id => document.getElementById(id);
const questions = [
  {
    title: ['Where do you sit in the packaging chain?', 'Hvilken rolle har I i emballagekæden?'],
    hint: ['Choose the role that best describes your business.', 'Vælg den rolle, der passer bedst på jeres virksomhed.'],
    options: [
      ['We sell products under our own brand', 'Vi sælger under eget brand'],
      ['We import products or packaging', 'Vi importerer varer eller emballage'],
      ['We sell or distribute others’ products', 'Vi sælger andres produkter'],
      ['We fill, pack or ship products', 'Vi fylder, pakker eller sender varer']
    ],
    tasks: [
      ['List the packs sold under your brand and identify who holds their technical files.', 'Registrér emballagerne under eget brand, og find ud af, hvem der har den tekniske dokumentation.'],
      ['Pick one imported SKU and ask the manufacturer for its packaging documentation and a named contact.', 'Vælg én importeret vare, og bed fabrikanten om emballagedokumentation og en kontaktperson.'],
      ['Record the supplier and market for each pack you distribute so questions can be traced to the right business.', 'Registrér leverandør og marked for hver emballage, så spørgsmål kan følges tilbage til rette virksomhed.'],
      ['List the packaging you add when filling or shipping, including liners, tape and void fill.', 'Registrér den emballage, I tilføjer ved pakning og forsendelse, herunder tape, indlæg og fyld.'],
      ['Map who manufactures, imports, fills and sells one SKU before assigning responsibilities.', 'Kortlæg, hvem der fremstiller, importerer, fylder og sælger én vare, før I fordeler ansvaret.']
    ]
  },
  {
    title: ['Where do your packs go?', 'Hvor sælger I varerne?'],
    hint: ['Think about where the packaged product is first sold.', 'Tænk på, hvor den emballerede vare først sælges.'],
    options: [['One EU country','Ét EU-land'],['Several EU countries','Flere EU-lande'],['EU and non-EU markets','Både i og uden for EU'],['We need to map this','Vi mangler overblikket']],
    tasks: [
      ['Name your sales country and check its producer register for the packaging you place there.', 'Navngiv salgslandet, og tjek producentregistret for den emballage, I bringer på markedet dér.'],
      ['Create one row per EU market, with the local register, reporting contact and responsible company.', 'Opret en række pr. EU-marked med register, kontakt og ansvarlig virksomhed.'],
      ['Separate EU destinations from other markets and record the rules and contacts for each.', 'Opdel destinationer i EU og uden for EU, og registrér regler og kontaktpersoner for hvert marked.'],
      ['Use orders and shipping records to list the destination countries for one product line.', 'Brug ordrer og fragtdata til at kortlægge landene for én produktserie.']
    ]
  },
  {
    title: ['Which pack will you start with?', 'Hvilken emballage starter I med?'],
    hint: ['Choose one format for your first review.', 'Vælg ét format til jeres første gennemgang.'],
    options: [['Plastic or food-contact pack','Plast eller fødevarekontakt'],['Paper, board or fibre','Papir, karton eller fiber'],['Mixed-material pack','Flere materialer i én emballage'],['Transport or shipping pack','Transport- eller forsendelsesemballage']],
    tasks: [
      ['Ask for polymer types, recycled-content evidence and any food-contact documentation relevant to the intended use.', 'Bed om polymertyper, dokumentation for genanvendt indhold og eventuelle relevante fødevarekontaktdata.'],
      ['List the fibre base, coatings, inks and adhesives. Ask the converter how these affect the intended recycling stream.', 'Registrér fibre, belægning, trykfarve og lim. Spørg leverandøren, hvordan de påvirker genanvendelsen.'],
      ['Separate each layer and closure on paper. Ask suppliers which components users can separate in practice.', 'Opdel emballagen i lag og lukninger på papir. Spørg, hvilke dele brugerne faktisk kan skille ad.'],
      ['Measure the packed product, outer dimensions and void fill. Document the protection the shipping pack provides.', 'Mål varen, ydermål og fyld. Dokumentér den beskyttelse, transportemballagen skal levere.']
    ]
  },
  {
    title: ['How complete is your data?', 'Hvor gode er jeres data?'],
    hint: ['Think about weights, material specifications and supplier files.', 'Tænk på vægt, materialespecifikationer og leverandørdokumenter.'],
    options: [['We have current specifications','Vi har aktuelle specifikationer'],['We have some information','Vi har nogle oplysninger'],['We need to ask suppliers','Vi skal spørge leverandørerne'],['We need an internal review','Vi skal gennemgå det internt']],
    tasks: [
      ['Date and version the specifications you have, then check they describe the pack currently in production.', 'Datér og versionsmærk jeres specifikationer. Tjek, at de beskriver emballagen i produktion.'],
      ['Create a gap list. For each missing specification, give one supplier or colleague a due date.', 'Opret en mangelliste. Giv én person og én frist til hver manglende specifikation.'],
      ['Send the supplier a component list and request material, weight, construction and dated evidence for each part.', 'Send leverandøren en komponentliste, og bed om materiale, vægt, konstruktion og dateret dokumentation for hver del.'],
      ['Bring purchasing, design and quality together to locate specifications and agree who maintains them.', 'Saml indkøb, design og kvalitet for at finde specifikationer og aftale, hvem der vedligeholder dem.']
    ]
  },
  {
    title: ['What comes first for your team?', 'Hvad vil I afklare først?'],
    hint: ['We’ll put that task at the top of your checklist.', 'Vi placerer den opgave øverst på jeres tjekliste.'],
    options: [['Roles and responsibilities','Roller og ansvar'],['Markets and reporting','Markeder og indberetning'],['Materials and pack design','Materialer og design'],['Supplier data and evidence','Leverandørdata og dokumentation']]
  }
];
// Each task pairs an action with something the team can keep and an official reference.
const guides = [
  {
    title: ['Map your role', 'Afklar jeres rolle'],
    record: ['A sketch of the supply chain with the company and contact at each step.', 'En skitse af varekæden med virksomhed og kontaktperson ved hvert led.'],
    source: ['PPWR · Chapter IV, roles and obligations', 'PPWR · kapitel IV, roller og pligter'], anchor: 'chp_IV'
  },
  {
    title: ['Check your sales markets', 'Tjek jeres salgslande'],
    record: ['A list of countries, the register or authority to consult and who will check local deadlines.', 'En landeliste med register eller myndighed og navnet på den, der undersøger de lokale frister.'],
    source: ['PPWR · Article 44, producer registers', 'PPWR · artikel 44, producentregistre'], anchor: 'art_44'
  },
  {
    title: ['Review the parts of your pack', 'Gennemgå emballagens dele'],
    record: ['A photo or drawing with the parts labelled. Note any open material questions next to the relevant part.', 'Et foto eller en tegning med navn på hver del. Skriv åbne spørgsmål om materialet ud for den del, de vedrører.'],
    source: ['PPWR · Article 6, recyclability and dates', 'PPWR · artikel 6, genanvendelighed og frister'], anchor: 'art_6'
  },
  {
    title: ['Gather the evidence', 'Saml dokumentationen'],
    record: ['An index of file names, dates and owners. Give each missing document a follow-up date.', 'En oversigt med filnavn, dato og ansvarlig. Sæt en opfølgningsdato ved de dokumenter, der mangler.'],
    source: ['PPWR · Annex VII, technical documentation', 'PPWR · bilag VII, teknisk dokumentation'], anchor: 'anx_VII'
  }
];
const savedPlanKey = 'ppwr-kompas.checklist.v1';
let language = new URLSearchParams(location.search).get('lang') === 'da' ? 'da' : 'en';
let step = 0;
let answers = Array(questions.length).fill(null);
let completed = false;
let checkedTasks = new Set();
try {
  const saved = JSON.parse(localStorage.getItem(savedPlanKey));
  if (Array.isArray(saved?.answers) && saved.answers.length === questions.length &&
      saved.answers.every((a, i) => Number.isInteger(a) && a >= 0 && a < (i === 0 ? questions[i].tasks.length : questions[i].options.length)) &&
      Array.isArray(saved.checked)) {
    answers = saved.answers;
    checkedTasks = new Set(saved.checked.filter(i => Number.isInteger(i) && i >= 0 && i < guides.length));
    completed = true;
    step = questions.length - 1;
  }
} catch { /* The checklist also works without browser storage. */ }
function savePlan() {
  try {
    if (completed) localStorage.setItem(savedPlanKey, JSON.stringify({answers, checked: [...checkedTasks]}));
    else localStorage.removeItem(savedPlanKey);
  } catch { /* Keep progress in memory when storage is unavailable. */ }
}
let editorial = {};
const words = (en, da) => editorial[en]?.[language] ?? (language === 'da' ? da : en);
const plainText = [];
const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (node.data.trim() && !node.parentElement.closest('[data-da], script, style')) {
    plainText.push({node, original: node.data});
  }
}
const attributes = [...document.querySelectorAll('[aria-label], meta[name="description"]')].map(node => {
  const attr = node.hasAttribute('aria-label') ? 'aria-label' : 'content';
  return {node, attr, original: node.getAttribute(attr)};
});
const localized = pair => words(...pair);
const copyNodes = [...document.querySelectorAll('[data-da]')].map(node => ({node, en: node.textContent}));

function renderQuiz(focus = false) {
  const question = questions[step];
  const showStep = completed ? 5 : step + 1;
  el('step').textContent = completed ? words('TEST COMPLETE','TEST GENNEMFØRT') : (step === 0 ? words('START','START') : words('STEP','TRIN')) + ' · ' + showStep + words(' OF 5',' AF 5');
  document.querySelector('.quiz').style.setProperty('--progress', completed ? '100%' : (10 + step * 20) + '%');
  const dots = document.querySelector('.dots');
  dots.replaceChildren(...questions.map((_, n) => {
    const dot = document.createElement('i');
    dot.classList.toggle('active', n === step || completed);
    return dot;
  }));
  el('quiz-form').hidden = completed;
  el('result').hidden = !completed;
  el('readiness').classList.toggle('is-complete', completed);
  el('feedback').replaceChildren();
  el('copied').textContent = '';
  el('brief-status').textContent = '';
  if (completed) {
    el('project-brief').value = projectBrief();
    el('checklist').replaceChildren(...taskOrder().map(taskRow));
    updateProgress();
    el('result-help-slot').append(el('optional-help'));
    if (focus) {
      el('result-title').focus({preventScroll: true});
      el('readiness').scrollIntoView({block: 'start', behavior: 'instant'});
    }
    return;
  }
  el('question').textContent = localized(question.title);
  el('hint').textContent = localized(question.hint);
  el('next-text').textContent = step === 0 ? words('Map your readiness','Tjek din parathed') : step === 4 ? words('Build my checklist','Vis min tjekliste') : words('Continue','Fortsæt');
  el('back').hidden = step === 0;
  el('answers').replaceChildren(...question.options.map((pair, index) => {
    const label = document.createElement('label');
    label.className = 'choice';
    const choice = document.createElement('input');
    choice.type = 'radio';
    choice.name = 'answer';
    choice.checked = answers[step] === index;
    choice.addEventListener('change', () => {
      answers[step] = index;
      el('feedback').replaceChildren();
    });
    label.append(choice, document.createTextNode(localized(pair)));
    return label;
  }));
  if (focus) el('question').focus();
}
function taskOrder() {
  const priority = answers[4];
  return [priority, ...guides.map((_, i) => i).filter(i => i !== priority)];
}
function taskText(index) {
  return localized(questions[index].tasks[answers[index]]);
}
function sourceUrl(index) {
  return 'https://eur-lex.europa.eu/eli/reg/2025/40/oj/' + (language === 'da' ? 'dan' : 'eng') + '#' + guides[index].anchor;
}
function updateProgress() {
  const count = checkedTasks.size;
  el('task-count').textContent = count + words(' of 4 tasks done', ' af 4 opgaver løst');
  el('task-progress').value = count;
  el('plan-finish').hidden = count !== guides.length;
}
function taskRow(index) {
  const guide = guides[index];
  const row = document.createElement('li');
  const label = document.createElement('label');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = checkedTasks.has(index);
  box.onchange = () => {
    if (box.checked) checkedTasks.add(index);
    else checkedTasks.delete(index);
    updateProgress();
    savePlan();
  };
  label.append(box, localized(guide.title));
  const action = document.createElement('p');
  action.textContent = taskText(index);
  const record = document.createElement('p');
  record.className = 'keep-record';
  const prefix = document.createElement('strong');
  prefix.textContent = words('Keep: ', 'Gem: ');
  record.append(prefix, localized(guide.record));
  const link = document.createElement('a');
  link.href = sourceUrl(index);
  link.textContent = localized(guide.source);
  row.append(label, action, record, link);
  return row;
}
function projectBrief() {
  const labels = [
    ['Role', 'Rolle'], ['Markets', 'Markeder'], ['Pack', 'Emballage'],
    ['Available data', 'Datagrundlag'], ['Priority', 'Prioritet']
  ];
  const summary = questions.map((question, i) => {
    const option = question.options[answers[i]] ?? ['Role to clarify', 'Rolle skal afklares'];
    return localized(labels[i]) + ': ' + localized(option);
  });
  return [
    words('PPWR review — working note', 'PPWR-gennemgang — arbejdsnotat'),
    ...summary,
    '',
    words('First action: ', 'Første opgave: ') + taskText(answers[4]),
    words('Product: ___   Owner: ___   Due date: ___', 'Produkt: ___   Ansvarlig: ___   Frist: ___')
  ].join('\n');
}
function advance() {
  if (step === questions.length - 1) {
    completed = true;
    savePlan();
  }
  else step++;
  renderQuiz(true);
}
el('quiz-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answers[step] !== null) return advance();
  el('feedback').textContent = words('Choose an answer to continue. ', 'Vælg et svar for at gå videre. ');
  if (step === 0) {
    const unsure = document.createElement('button');
    unsure.type = 'button';
    unsure.textContent = words('Unsure of your role?', 'I tvivl om jeres rolle?');
    unsure.onclick = () => { answers[0] = 4; advance(); };
    el('feedback').append(unsure);
  }
  el('answers').querySelector('input').focus();
});
el('back').onclick = () => { step--; renderQuiz(true); };
el('restart').onclick = () => {
  completed = false;
  step = 0;
  answers.fill(null);
  checkedTasks.clear();
  savePlan();
  for (const detail of el('optional-help').querySelectorAll('details')) detail.open = false;
  el('page-help-slot').append(el('optional-help'));
  el('brief-details').open = false;
  renderQuiz(true);
};
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(words('PPWR Kompas','PPWR Kompas') + '\n' + taskOrder().map(i => [
      (checkedTasks.has(i) ? '[x] ' : '[ ] ') + localized(guides[i].title),
      taskText(i), words('Keep: ', 'Gem: ') + localized(guides[i].record), sourceUrl(i)
    ].join('\n')).join('\n\n'));
    el('copied').textContent = words('Checklist copied.', 'Tjeklisten er kopieret.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents(el('checklist'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    el('copied').textContent = words('The checklist is selected. Use your device’s copy command.', 'Tjeklisten er markeret. Brug enhedens kopifunktion.');
  }
};
el('copy-brief').onclick = async () => {
  const brief = el('project-brief');
  try {
    await navigator.clipboard.writeText(brief.value);
    el('brief-status').textContent = words('Project brief copied.', 'Opgavebriefen er kopieret.');
  } catch {
    brief.focus();
    brief.select();
    el('brief-status').textContent = words('Brief selected. Use your device’s copy command.', 'Briefen er markeret. Brug enhedens kopifunktion.');
  }
};
function applyLanguage() {
  document.documentElement.lang = language;
  el('language').value = language;
  for (const {node, en} of copyNodes) node.textContent = words(en, node.dataset.da);
  const photo = document.querySelector('.hero-photo');
  photo.dataset.altEn ??= photo.alt;
  photo.alt = words(photo.dataset.altEn, photo.dataset.altDa);
  for (const {node, original} of plainText) {
    const key = original.trim();
    if (node.isConnected && editorial[key]) node.data = original.replace(key, () => words(key, key));
  }
  for (const {node, attr, original} of attributes) node.setAttribute(attr, words(original, original));
  renderQuiz();
}
el('language').addEventListener('change', event => {
  language = event.target.value;
  const url = new URL(location.href);
  if (language === 'da') url.searchParams.set('lang', language);
  else url.searchParams.delete('lang');
  history.replaceState(null, '', url);
  applyLanguage();
});
applyLanguage();
fetch('content.json').then(response => {
  if (!response.ok) throw new Error('Content unavailable');
  return response.json();
}).then(content => { editorial = content; applyLanguage(); }).catch(() => {
  // Bundled copy keeps the quiz usable if the content file is unavailable.
});

function setMenu(open) {
  el('navigation').classList.toggle('open', open);
  el('menu').setAttribute('aria-expanded', String(open));
}
el('menu').onclick = () => setMenu(el('menu').getAttribute('aria-expanded') === 'false');
el('navigation').onclick = () => setMenu(false);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && el('menu').getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    el('menu').focus();
  }
});
// Replay chapter entrances after they leave the viewport; guides enter once.
if ('IntersectionObserver' in window) {
  const enter = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const section = entry.target;
      if (!entry.isIntersecting) {
        section.classList.remove('in-view');
      } else if (entry.intersectionRatio >= .15) {
        section.classList.add('in-view');
        if (!section.classList.contains('chapter')) enter.unobserve(section);
      }
    }
  }, {threshold: [0, .15]});
  for (const section of document.querySelectorAll('.chapter, .guide, .resources')) {
    enter.observe(section);
  }
  for (const photo of document.querySelectorAll('.chapter img')) {
    const ready = () => photo.classList.add('image-ready');
    if (photo.complete && photo.naturalWidth) ready();
    else photo.addEventListener('load', ready, {once: true});
  }
}

const dialog = el('study');
let studyModule;
el('open-study').onclick = async () => {
  dialog.showModal();
  try {
    studyModule ??= await import('./study.js');
    studyModule.showModel();
  } catch {
    const canvas = el('model');
    canvas.style.background = 'url(assets/hero.webp) 95% 40% / 155% auto';
    el('study-title').textContent = words('Packaging material study','Emballagens materialer');
  }
};
el('close-study').onclick = () => dialog.close();
dialog.addEventListener('click', event => {
  const r = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
});
