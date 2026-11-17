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
let language = new URLSearchParams(location.search).get('lang') === 'da' ? 'da' : 'en';
let step = 0;
let answers = Array(questions.length).fill(null);
let completed = false;
const words = (en, da) => language === 'da' ? da : en;
const localized = pair => pair[language === 'da' ? 1 : 0];
const copyNodes = [...document.querySelectorAll('[data-da]')].map(node => ({node, en: node.textContent}));

function renderQuiz(focus = false) {
  const question = questions[step];
  const showStep = completed ? 5 : step + 1;
  el('step').textContent = completed ? words('YOUR CHECKLIST','DIN TJEKLISTE') : (step === 0 ? 'START' : words('STEP','TRIN')) + ' · ' + showStep + words(' OF 5',' AF 5');
  document.querySelector('.quiz').style.setProperty('--progress', completed ? '100%' : (10 + step * 20) + '%');
  const dots = document.querySelector('.dots');
  dots.replaceChildren(...questions.map((_, n) => {
    const dot = document.createElement('i');
    dot.classList.toggle('active', n === step || completed);
    return dot;
  }));
  el('quiz-form').hidden = completed;
  el('result').hidden = !completed;
  el('feedback').replaceChildren();
  el('copied').textContent = '';
  if (completed) {
    el('checklist').replaceChildren(...tasks().map(task => {
      const item = document.createElement('li');
      item.textContent = task;
      return item;
    }));
    if (focus) el('result-title').focus();
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
function tasks() {
  const priority = answers[4];
  const order = [priority, ...[0,1,2,3].filter(i => i !== priority)];
  return order.map(i => localized(questions[i].tasks[answers[i]]));
}
function advance() {
  if (step === questions.length - 1) completed = true;
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
  renderQuiz(true);
};
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText('PPWR Kompas\n' + tasks().map((task, i) => (i + 1) + '. ' + task).join('\n'));
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
function applyLanguage() {
  document.documentElement.lang = language;
  el('language').value = language;
  for (const {node, en} of copyNodes) node.textContent = words(en, node.dataset.da);
  const photo = document.querySelector('.hero-photo');
  photo.dataset.altEn ??= photo.alt;
  photo.alt = words(photo.dataset.altEn, photo.dataset.altDa);
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
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = [...document.querySelectorAll('.chapter')];
let scheduled = false;
function updateScroll() {
  scheduled = false;
  const hero = document.querySelector('.hero');
  const bounds = hero.getBoundingClientRect();
  hero.style.setProperty('--drift', reduced.matches ? '0px' : Math.min(26,Math.max(0,-bounds.top * .055)) + 'px');
  for (const section of chapters) {
    const box = section.getBoundingClientRect();
    const offset = Math.min(1, Math.max(-1, (box.top + box.height / 2 - innerHeight / 2) / innerHeight));
    section.style.setProperty('--drift', (reduced.matches ? 0 : -offset * box.height * .011) + 'px');
    section.style.setProperty('--lift', (reduced.matches ? 0 : offset * 5) + 'px');
  }
}
function scheduleScroll() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateScroll);
}
addEventListener('scroll', scheduleScroll, {passive:true});
addEventListener('resize',scheduleScroll);
reduced.addEventListener('change',scheduleScroll);

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
