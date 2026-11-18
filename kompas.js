const el = id => document.getElementById(id);
const questions = [
  {
    title: ['What do you do with this packaging?', 'Hvad gør I med denne emballage?'],
    hint: ['Choose one activity to investigate first. You may have several roles. Assess manufacturer duties and extended producer responsibility for packaging waste separately.',
      'Vælg én aktivitet at undersøge først. I kan have flere roller. Vurdér fabrikantens pligter og producentansvaret for emballageaffald hver for sig.'],
    options: [
      ['We make packaging', 'Vi fremstiller emballage'],
      ['We have packaging or packed products made under our own brand', 'Vi får emballage eller emballerede varer fremstillet under eget mærke'],
      ['We buy packaging or packed products within the EU', 'Vi køber emballage eller emballerede varer inden for EU'],
      ['We place packaging or packed products from a non-EU country on the EU market', 'Vi bringer emballage eller emballerede varer fra et tredjeland i omsætning i EU'],
      ['We distribute packaging or packed products', 'Vi distribuerer emballage eller emballerede varer'],
      ['We pack or ship goods', 'Vi pakker eller sender varer'],
      ['We are unsure', 'Vi er i tvivl']
    ]
  },
  {
    title: ['Where is this packaging or packed product first made available in the course of business?', 'Hvor gøres denne emballage eller emballerede vare første gang tilgængelig som led i erhverv?'],
    hint: ['Consider each country. Include free samples and cross-border deliveries. If you unpack goods without being the end user, check whether that gives you producer responsibility.',
      'Se på hvert land for sig. Medregn gratis vareprøver og leverancer på tværs af grænser. Hvis I pakker varer ud uden selv at være slutbruger, skal I undersøge, om det giver jer producentansvar.'],
    options: [
      ['Denmark only', 'Kun Danmark'],
      ['Denmark and other EU countries', 'Danmark og andre EU-lande'],
      ['EU countries other than Denmark', 'EU-lande uden Danmark'],
      ['Inside and outside the EU, including Denmark', 'I og uden for EU, herunder Danmark'],
      ['Inside and outside the EU, excluding Denmark', 'I og uden for EU, uden Danmark'],
      ['Outside the EU only', 'Kun uden for EU'],
      ['We need to map this', 'Vi mangler overblikket']
    ]
  },
  {
    title: ['What is the packaging made of?', 'Hvad er emballagen lavet af?'],
    hint: ['Choose the material and indicate whether the packaging is intended to come into contact with food.', 'Vælg materiale, og angiv, om emballagen er beregnet til at komme i kontakt med fødevarer.'],
    options: [
      ['Paper or board', 'Papir eller karton'],
      ['Plastic', 'Plast'],
      ['Glass', 'Glas'],
      ['Metal', 'Metal'],
      ['Several materials', 'Flere materialer'],
      ['Other material', 'Andet materiale']
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
const foodQuestion = ['Is it intended for food contact?', 'Er emballagen beregnet til fødevarekontakt?'];
const foodOptions = [['Yes','Ja'],['No','Nej'],['Unsure','I tvivl']];
const scopeNote = [
  'Working note for one packaging item, based on your own answers. Assessing whether the packaging meets the requirements calls for a separate review of the packaging and its documentation.',
  'Arbejdsnotat for én emballage, baseret på jeres egne svar. En vurdering af, om emballagen opfylder kravene, kræver en særskilt gennemgang af emballagen og dokumentationen.'
];
const guides = [
  {
    title: ['Map your role', 'Afklar jeres rolle'],
    record: ['A sketch of the supply chain with the company and contact at each step.', 'En skitse af varekæden med virksomhed og kontaktperson ved hvert led.']
  },
  {
    title: ['Check the markets', 'Tjek markederne'],
    record: ['A country list with the first supply, the responsible business and any registration deadline.', 'En landeliste med første tilgængeliggørelse, ansvarlig virksomhed og eventuel registreringsfrist.']
  },
  {
    title: ['Review the parts of your pack', 'Gennemgå emballagens dele'],
    record: ['A photo or drawing with the parts labelled. Note any open material questions next to the relevant part.', 'Et foto eller en tegning med navn på hver del. Skriv åbne spørgsmål om materialet ud for den del, de vedrører.']
  },
  {
    title: ['Gather the evidence', 'Saml dokumentationen'],
    record: ['An index of file names, dates and owners. Give each missing document a follow-up date.', 'En oversigt med filnavn, dato og ansvarlig. Sæt en opfølgningsdato ved de dokumenter, der mangler.']
  }
];

const eu = (article, anchor = 'art_' + article) => ({
  label: ['PPWR, Article ' + article, 'PPWR, artikel ' + article], anchor
});
const annex = number => ({ label: ['PPWR, Annex ' + number, 'PPWR, bilag ' + number], anchor: 'anx_' + number });
const guidance = {
  label: ['Commission guidance C/2026/3084', 'Kommissionens vejledning C/2026/3084'],
  url: 'https://eur-lex.europa.eu/eli/C/2026/3084/oj'
};
const dkRegister = {
  label: ['Danish Packaging Order, sections 14–15 (Danish)', 'Emballagebekendtgørelsen, §§ 14–15'],
  url: 'https://www.retsinformation.dk/eli/lta/2026/851'
};
const advice = (text, ...sources) => ({text, sources, requirement:false});
const rule = (text, ...sources) => ({text, sources, requirement:true});

const roleActions = [
  advice(['Identify who makes the packaging or packed product for the EU market. Agree who holds the technical file and signs the EU declaration of conformity.',
    'Afklar, hvem der fremstiller emballagen eller den emballerede vare til EU-markedet. Aftal, hvem der har den tekniske dokumentation og underskriver EU-overensstemmelseserklæringen.'], eu(3), eu(15)),
  advice(['If you commission packaging or a packed product under your own brand, you are normally the manufacturer. For a microenterprise using a packaging supplier in the same Member State, the supplier is the manufacturer under Article 3(1)(13)(b). Check producer responsibility separately.',
    'Får I emballage eller en emballeret vare fremstillet under eget mærke, er I normalt fabrikant. For en mikrovirksomhed med en emballageleverandør i samme medlemsstat er leverandøren fabrikant efter artikel 3, stk. 1, nr. 13, litra b. Undersøg producentansvaret særskilt.'], eu(3), eu(21), guidance),
  advice(['Record the supplier and where the packaging first entered the EU market. Buying from Sweden does not in itself make a Danish buyer a PPWR importer. If you resupply the packaging, assess distributor duties and whether you are the producer in Denmark.',
    'Notér leverandøren, og hvor emballagen først kom på EU-markedet. Indkøb fra Sverige gør ikke i sig selv en dansk køber til importør efter PPWR. Hvis I leverer emballagen videre, skal I undersøge distributørpligterne og jeres eventuelle producentansvar i Danmark.'], eu(3), eu(19), guidance),
  advice(['Identify who is established in the EU and first places the packaging from the non-EU country on the EU market. If you place packaging under your own name or modify it in a way that can affect compliance, check whether manufacturer duties also apply.',
    'Afklar, hvem der er etableret i EU og først bringer emballagen fra tredjelandet i omsætning i EU. Hvis I bringer emballagen i omsætning under eget navn eller ændrer den på en måde, der kan påvirke overensstemmelsen, skal I undersøge, om I også har fabrikantpligter.'], eu(3), eu(18), eu(21)),
  advice(['Record who supplies each packaging item and which business is the registered producer for each market. Check your distributor duties before making the packaging available.',
    'Registrér, hvem der leverer hver emballage, og hvem der er registreret som producent på hvert marked. Tjek distributørpligterne, før I gør emballagen tilgængelig.'], eu(19), eu(44)),
  advice(['List packaging you add, including labels, tape and fill. Clarify whether you are the manufacturer, who has producer responsibility, and which rules on empty space apply to the packaging you fill.',
    'Notér den emballage, I tilføjer, herunder etiketter, tape og fyld. Afklar, om I er fabrikant, hvem der har producentansvaret, og hvilke regler om tomrum der gælder for den emballage, I fylder.'], eu(3), eu(24), guidance),
  advice(['Identify who makes, buys, imports, fills, supplies or unpacks this packaging. Check all relevant roles and the same-Member-State supplier rule for microenterprises using their own brand.',
    'Afklar, hvem der fremstiller, køber, importerer, fylder, leverer eller udpakker emballagen. Undersøg alle relevante roller og særreglen for mikrovirksomheder med eget mærke og emballageleverandør i samme medlemsstat.'], eu(3), guidance)
];
const manufacturer = rule(['If you are the manufacturer, carry out or commission the conformity assessment and compile the technical documentation before placing the packaging on the EU market. Once compliance is demonstrated, draw up the EU declaration of conformity. Keep both documents for five years for single-use packaging and ten years for reusable packaging, from placing on the market.',
  'Er I fabrikant, skal I gennemføre eller få udført overensstemmelsesvurderingen og udarbejde teknisk dokumentation, før emballagen bringes i omsætning i EU. Når overensstemmelse er påvist, skal I udarbejde EU-overensstemmelseserklæringen. Gem begge dokumenter i fem år for engangsemballage og ti år for genbrugsemballage, regnet fra omsætningen.'], eu(15), eu(38), eu(39), annex('VII'), annex('VIII'));
const importer = rule(['Before placing imported packaging on the EU market, verify that the manufacturer has carried out the assessment and compiled the technical file, that required documents and applicable labelling are in place, and that the manufacturer’s identification and contact requirements are met. Add your importer identification and contact details as required. Keep a copy of the EU declaration and ensure the technical file is available to the authorities.',
  'Før I bringer importeret emballage i omsætning i EU, skal I kontrollere fabrikantens vurdering og tekniske dokumentation, de krævede dokumenter og den mærkning, der gælder, samt fabrikantens identifikation og kontaktoplysninger. Tilføj de krævede oplysninger om jer som importør. Gem en kopi af EU-overensstemmelseserklæringen, og sørg for, at myndighederne kan få den tekniske dokumentation.'], eu(18), eu(12));
const distributor = rule(['If you distribute the packaging, check producer registration, any applicable Article 12 labelling, and the manufacturer’s and importer’s required identification and contact details before making it available. Hold back packaging if you have reason to believe it fails the applicable requirements.',
  'Distribuerer I emballagen, skal I før tilgængeliggørelsen kontrollere producentregistrering, eventuel gældende mærkning efter artikel 12 og fabrikantens og importørens krævede identifikation og kontaktoplysninger. Hold emballagen tilbage, hvis I har grund til at tro, at den ikke opfylder de gældende krav.'], eu(19), eu(12), eu(44));
const labelling = rule(['The harmonised material-composition label generally applies from 12 August 2028 or 24 months after the relevant implementing acts enter into force, whichever is later. Check Article 12 for exceptions and other labelling deadlines.',
  'Det harmoniserede mærke om materialesammensætning gælder som hovedregel fra 12. august 2028 eller 24 måneder efter de relevante gennemførelsesretsakters ikrafttræden, alt efter hvad der ligger senest. Tjek artikel 12 for undtagelser og andre mærkningsfrister.'], eu(12));
const documentationRules = [[manufacturer],[manufacturer],[distributor],[importer,manufacturer],[distributor],[manufacturer],[manufacturer,importer,distributor]];

const marketsAdvice = [
  advice(['Record when and how the packaging is first supplied in Denmark, including samples.', 'Notér, hvornår og hvordan emballagen første gang leveres i Danmark, inklusive vareprøver.'], eu(3), guidance),
  advice(['List Denmark and each other EU country separately, with the first supply and the responsible producer.', 'Notér Danmark og hvert andet EU-land for sig med første tilgængeliggørelse og ansvarlig producent.'], eu(3), eu(44), guidance),
  advice(['List each EU country separately and check its producer register. Direct deliveries to end users in another Member State can trigger producer responsibility there.', 'Notér hvert EU-land for sig, og tjek dets producentregister. Direkte leverancer til slutbrugere i en anden medlemsstat kan udløse producentansvar dér.'], eu(3), eu(44), guidance),
  advice(['Separate EU and non-EU destinations. List Denmark and each other EU country separately. Check the rules in each non-EU destination.', 'Adskil markeder i og uden for EU. Notér Danmark og hvert andet EU-land for sig. Tjek reglerne på hvert marked uden for EU.'], eu(3), eu(44), guidance),
  advice(['Separate EU and non-EU destinations. Check the producer register in each relevant EU country and the rules in each non-EU destination.', 'Adskil markeder i og uden for EU. Tjek producentregistret i hvert relevant EU-land og reglerne på hvert marked uden for EU.'], eu(3), eu(44), guidance),
  advice(['Check the destination’s rules. If this packaging is only supplied outside the EU, it is outside the EU market requirements described here. Verify whether the packaging is first supplied or relevant unpacking occurs in the EU before export. If so, reassess your EU and national obligations.',
    'Tjek reglerne på destinationsmarkedet. Hvis emballagen kun tilgængeliggøres uden for EU, falder den uden for de EU-markedskrav, der beskrives her. Undersøg, om emballagen først leveres, eller om relevant udpakning sker i EU før eksport. Hvis ja, skal I vurdere EU-krav og nationale pligter igen.'], eu(2), eu(3), guidance),
  advice(['Map the first commercial supply in each country from orders, dispatches, free samples and direct sales. Check whether unpacking without being the end user affects your producer role.', 'Kortlæg den første erhvervsmæssige tilgængeliggørelse i hvert land ud fra ordrer, forsendelser, gratis vareprøver og direkte salg. Undersøg, om udpakning uden at være slutbruger påvirker jeres producentrolle.'], eu(3), eu(44), guidance)
];
const denmarkRule = rule(['A producer covered by section 15 must register with Dansk Producentansvar at least 14 days before first making the packaging available on the Danish market.',
  'En producent omfattet af emballagebekendtgørelsens § 15 skal registreres hos Dansk Producentansvar senest 14 dage før første tilgængeliggørelse på det danske marked.'], dkRegister);
const materialActions = [
  ['List fibres, coatings, inks and adhesives.', 'Registrér fibre, belægninger, trykfarver og lim.'],
  ['Record the polymers and identify which parts contain plastic.', 'Notér polymertyperne, og registrér, hvilke dele der indeholder plast.'],
  ['Record the glass type and separate closures, labels and coatings in your list.', 'Notér glastypen, og registrér lukninger, etiketter og belægninger særskilt.'],
  ['Record the metal type and separate linings, closures and labels in your list.', 'Notér metaltypen, og registrér indvendige belægninger, lukninger og etiketter særskilt.'],
  ['Record each layer or component, including any plastic, and note what can be separated.', 'Registrér hvert lag eller hver del, herunder eventuel plast, og notér, hvad der kan skilles ad.'],
  ['Identify the material and each component with the supplier.', 'Afklar materialet og de enkelte dele med leverandøren.']
];
const recycling = rule(['For packaging placed on the EU market, the design-for-recycling criteria apply from 1 January 2030 or 24 months after the delegated acts enter into force, whichever is later. The recycled-at-scale requirement applies from 1 January 2035 or five years after the implementing acts enter into force, whichever is later. Check the exemptions in Article 6(11).',
  'For emballage, der bringes i omsætning i EU, gælder kriterierne for design til genanvendelse fra 1. januar 2030 eller 24 måneder efter de delegerede retsakters ikrafttræden, alt efter hvad der ligger senest. Kravet om genanvendelse i stor skala gælder fra 1. januar 2035 eller fem år efter gennemførelsesretsakternes ikrafttræden, alt efter hvad der ligger senest. Tjek undtagelserne i artikel 6, stk. 11.'], eu(6));
const recycledPlastic = rule(['For plastic parts covered by Article 7, check the minimum recycled content for the packaging category. The first targets apply from 1 January 2030 or three years after the implementing act under Article 7(8) enters into force, whichever is later. Check exemptions, including for a plastic part below 5% of the total packaging-unit weight.',
  'For plastdele omfattet af artikel 7 skal I undersøge minimumskravet til genanvendt indhold for emballagetypen. De første krav gælder fra 1. januar 2030 eller tre år efter ikrafttrædelsen af gennemførelsesretsakten efter artikel 7, stk. 8, alt efter hvad der ligger senest. Tjek undtagelserne, blandt andet for plastdele under 5 % af emballageenhedens samlede vægt.'], eu(7));
const pfas = rule(['Since 12 August 2026, food-contact packaging placed on the EU market must meet the PFAS limits in Article 5(5). Ask the supplier for evidence for your packaging. Earlier manufacture gives no stock grace period. Packaging already placed on the EU market before that date may remain available.',
  'Siden 12. august 2026 skal fødevarekontaktemballage, der bringes i omsætning i EU, overholde PFAS-grænserne i artikel 5, stk. 5. Bed leverandøren om dokumentation for jeres emballage. Tidligere fremstilling giver ingen frist til at afvikle lageret. Emballage, der allerede var bragt i omsætning i EU før datoen, må fortsat være tilgængelig.'], eu('5(5)','art_5'), guidance);
const confirmFood = advice(['Confirm the intended use with the supplier. If the packaging is for food contact, check the PFAS limits and get evidence for the specific packaging.',
  'Afklar den tilsigtede brug med leverandøren. Ved fødevarekontakt skal I tjekke PFAS-grænserne og indhente dokumentation for den konkrete emballage.'], eu('5(5)','art_5'));
const emptySpace = rule(['If you fill sales packaging, reduce empty space to what is needed for function and protection by 12 February 2028. If you fill grouped, transport or e-commerce packaging, the maximum is 50% from 1 January 2030 or three years after the relevant implementing acts enter into force, whichever is later. Fill material counts as empty space. Sales packs used as e-commerce packs and reusable packs in a reuse system are exempt from the 50% rule. Check Article 24(4) and (5) for the precise conditions.',
  'Fylder I salgsemballage, skal tomrummet senest 12. februar 2028 begrænses til det nødvendige for funktion og beskyttelse. Fylder I multipak-, transport- eller e-handelsemballage, er grænsen 50 % fra 1. januar 2030 eller tre år efter de relevante gennemførelsesretsakters ikrafttræden, alt efter hvad der ligger senest. Fyldmateriale tæller som tomrum. Salgsemballage brugt som e-handelsemballage og genbrugsemballage i et genbrugssystem er undtaget fra 50 %-reglen. Tjek artikel 24, stk. 4 og 5, for de præcise betingelser.'], eu(24));
const outsideEU = advice(['Confirm that no relevant supply or unpacking takes place in the EU. Ask what packaging and documentation rules apply at the destination.',
  'Afklar, om der er relevant tilgængeliggørelse eller udpakning i EU. Undersøg emballage- og dokumentationskravene på destinationsmarkedet.'], eu(2), eu(3));

const savedPlanKey = 'ppwr-kompas.checklist.v2';
const languageTransfer = 'ppwr-kompas.language.v2';
const storageDuration = 30 * 24 * 60 * 60 * 1000;
const language = document.documentElement.lang;
const editorial = JSON.parse(el('editorial-data')?.textContent || '{}');
const words = (en, da) => editorial[en]?.[language] ?? (language === 'da' ? da : en);
const localized = pair => words(...pair);
let step = 0;
let answers = Array(questions.length).fill(null);
let food = null;
let completed = false;
let checkedTasks = new Set();
let savedUntil = null;

function validAnswers(state, complete) {
  return Array.isArray(state?.answers) && state.answers.length === questions.length &&
    state.answers.every((answer, i) => (!complete && answer === null) ||
      (Number.isInteger(answer) && answer >= 0 && answer < questions[i].options.length)) &&
    ((!complete && state.food === null) || [0,1,2].includes(state.food));
}
function restore(state) {
  answers = state.answers;
  food = state.food;
  completed = state.completed;
  step = completed ? questions.length - 1 : state.step;
  checkedTasks = new Set(state.checked);
}
function currentState() {
  return {answers, food, completed, step, checked:[...checkedTasks]};
}
function validChecks(state) {
  return Array.isArray(state.checked) && state.checked.every(i => Number.isInteger(i) && i >= 0 && i < guides.length);
}
function loadPlan() {
  try {
    const legacy = localStorage.getItem('ppwr-kompas.checklist.v1');
    if (legacy !== null) {
      localStorage.removeItem('ppwr-kompas.checklist.v1');
      el('legacy-notice').hidden = false;
    }
    const saved = JSON.parse(localStorage.getItem(savedPlanKey));
    if (saved?.completed === true && validAnswers(saved, true) && validChecks(saved) &&
        Number.isFinite(saved.expiresAt) && saved.expiresAt > Date.now() &&
        saved.expiresAt <= Date.now() + storageDuration) {
      restore(saved);
      savedUntil = saved.expiresAt;
    } else if (saved !== null) {
      localStorage.removeItem(savedPlanKey);
    }
  } catch { /* The quiz works even when device storage is unavailable. */ }

  try {
    const transfer = JSON.parse(sessionStorage.getItem(languageTransfer));
    sessionStorage.removeItem(languageTransfer);
    if (transfer?.language === language && typeof transfer.completed === 'boolean' &&
        Date.now() - transfer.time < 60_000 && validAnswers(transfer, transfer.completed) &&
        validChecks(transfer) && Number.isInteger(transfer.step) && transfer.step >= 0 &&
        transfer.step < questions.length) {
      restore(transfer);
      if (savedUntil !== transfer.savedUntil) savedUntil = null;
    }
  } catch { /* Language switching works without storage. */ }
}
function storageStatus(text) {
  el('storage-status').textContent = text;
  el('delete-plan').hidden = !savedUntil;
  el('save-plan').hidden = Boolean(savedUntil);
}
function savePlan(explicitly = false) {
  if (!completed || (!explicitly && !savedUntil)) return;
  try {
    const prior = JSON.parse(localStorage.getItem(savedPlanKey));
    if (!explicitly && (prior?.expiresAt !== savedUntil || savedUntil <= Date.now())) {
      savedUntil = null;
      storageStatus(words('This checklist is no longer saved.', 'Tjeklisten er ikke længere gemt.'));
      return;
    }
    const expiresAt = explicitly ? Date.now() + storageDuration : savedUntil;
    localStorage.setItem(savedPlanKey, JSON.stringify({...currentState(), expiresAt}));
    savedUntil = expiresAt;
    storageStatus(words('Checklist saved on this device.', 'Tjeklisten er gemt på denne enhed.'));
  } catch {
    storageStatus(words('The browser could not save the checklist.', 'Browseren kunne ikke gemme tjeklisten.'));
  }
}
function deletePlan() {
  try {
    localStorage.removeItem(savedPlanKey);
    savedUntil = null;
    storageStatus(words('Saved checklist deleted from this device.', 'Den gemte tjekliste er slettet på denne enhed.'));
    return true;
  } catch {
    storageStatus(words('The browser could not delete the saved checklist.', 'Browseren kunne ikke slette den gemte tjekliste.'));
    return false;
  }
}
loadPlan();

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
  el('checklist-copy-field').hidden = true;
  el('brief-status').textContent = '';
  if (completed) {
    el('project-brief').value = projectBrief();
    el('checklist').replaceChildren(...taskOrder().map(taskRow));
    updateProgress();
    storageStatus(savedUntil ? words('Checklist saved on this device.', 'Tjeklisten er gemt på denne enhed.') : '');
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
  renderChoices('answers', 'answer', question.options, answers[step], index => { answers[step] = index; });
  el('food-contact').hidden = step !== 2;
  if (step === 2) {
    el('food-question').textContent = localized(foodQuestion);
    renderChoices('food-answers', 'food', foodOptions, food, index => { food = index; });
  }
  if (focus) el('question').focus();
}
function renderChoices(container, name, options, selected, choose) {
  el(container).replaceChildren(...options.map((pair, index) => {
    const label = document.createElement('label');
    label.className = 'choice';
    const choice = document.createElement('input');
    choice.type = 'radio';
    choice.name = name;
    choice.checked = selected === index;
    choice.addEventListener('change', () => {
      choose(index);
      el('feedback').replaceChildren();
    });
    label.append(choice, document.createTextNode(localized(pair)));
    return label;
  }));
}
function taskOrder() {
  const priority = answers[4];
  return [priority, ...guides.map((_, i) => i).filter(i => i !== priority)];
}
function taskActions(index) {
  const [role, market, material, data] = answers;
  const euMarket = market !== 5;
  const foodAction = [pfas, null, confirmFood][food];
  switch (index) {
    case 0:
      return [euMarket ? roleActions[role] : outsideEU];
    case 1:
      return [marketsAdvice[market], ...([0,1,3].includes(market) ? [denmarkRule] : [])];
    case 2:
      return [
        advice(materialActions[material]),
        ...(euMarket ? [
          recycling,
          recycledPlastic,
          ...(foodAction ? [foodAction] : []),
          emptySpace
        ] : [])
      ];
    default:
      return [advice(questions[3].tasks[data]), ...(euMarket ? [...documentationRules[role], labelling] : [outsideEU])];
  }
}
function sourceUrl(source) {
  return source.url ?? 'https://eur-lex.europa.eu/eli/reg/2025/40/oj/' + (language === 'da' ? 'dan' : 'eng') + '#' + source.anchor;
}
function actionText(action) {
  return (action.requirement ? words('Legal requirement: ', 'Lovkrav: ') : words('Practical advice: ', 'Praktisk råd: ')) +
    localized(action.text);
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
  row.append(label);
  for (const action of taskActions(index)) {
    const paragraph = document.createElement('p');
    paragraph.textContent = actionText(action);
    row.append(paragraph);
    if (!action.sources.length) continue;
    const links = document.createElement('p');
    for (const [i, source] of action.sources.entries()) {
      if (i) links.append(' · ');
      const link = document.createElement('a');
      link.href = sourceUrl(source);
      link.textContent = localized(source.label);
      links.append(link);
    }
    row.append(links);
  }
  const record = document.createElement('p');
  record.className = 'keep-record';
  const prefix = document.createElement('strong');
  prefix.textContent = words('Keep: ', 'Gem: ');
  record.append(prefix, localized(guide.record));
  row.append(record);
  return row;
}
function checklistText() {
  return [
    localized(scopeNote),
    ...taskOrder().map(index => [
      (checkedTasks.has(index) ? '[x] ' : '[ ] ') + localized(guides[index].title),
      ...taskActions(index).flatMap(action => [
        actionText(action),
        ...action.sources.map(source => localized(source.label) + ' ' + sourceUrl(source))
      ]),
      words('Keep: ', 'Gem: ') + localized(guides[index].record)
    ].join('\n'))
  ].join('\n\n');
}
function projectBrief() {
  const labels = [
    ['Activity', 'Aktivitet'], ['Markets', 'Markeder'], ['Material', 'Materiale'],
    ['Available data', 'Datagrundlag'], ['Priority', 'Prioritet']
  ];
  const summary = questions.map((question, i) => localized(labels[i]) + ': ' + localized(question.options[answers[i]]));
  return [
    words('PPWR review — working note', 'PPWR-gennemgang — arbejdsnotat'),
    localized(scopeNote),
    '',
    ...summary,
    words('Food contact: ', 'Fødevarekontakt: ') + localized(foodOptions[food]),
    '',
    words('First action: ', 'Første opgave: ') + actionText(taskActions(answers[4])[0]),
    words('Product: ___   Owner: ___   Due date: ___', 'Produkt: ___   Ansvarlig: ___   Frist: ___')
  ].join('\n');
}
el('quiz-form').addEventListener('submit', event => {
  event.preventDefault();
  if (answers[step] === null || (step === 2 && food === null)) {
    const selectFood = answers[step] !== null;
    el('feedback').textContent = selectFood ? words('Choose whether the packaging is for food contact.', 'Angiv, om emballagen er beregnet til fødevarekontakt.') :
      words('Choose an answer to continue. ', 'Vælg et svar for at gå videre. ');
    el(selectFood ? 'food-answers' : 'answers').querySelector('input').focus();
    return;
  }
  if (step === questions.length - 1) completed = true;
  else step++;
  renderQuiz(true);
});
el('back').onclick = () => { step--; renderQuiz(true); };
el('save-plan').onclick = () => {
  savePlan(true);
  if (savedUntil) el('delete-plan').focus();
};
el('delete-plan').onclick = () => {
  if (deletePlan()) el('save-plan').focus();
};
el('restart').onclick = () => {
  if (savedUntil && !deletePlan()) return;
  completed = false;
  step = 0;
  answers.fill(null);
  food = null;
  checkedTasks.clear();
  for (const detail of el('optional-help').querySelectorAll('details')) detail.open = false;
  el('page-help-slot').append(el('optional-help'));
  el('brief-details').open = false;
  renderQuiz(true);
};
el('copy').onclick = async () => {
  const text = checklistText();
  try {
    await navigator.clipboard.writeText(text);
    el('copied').textContent = words('Checklist copied.', 'Tjeklisten er kopieret.');
  } catch {
    const copyField = el('checklist-copy-field');
    copyField.hidden = false;
    copyField.value = text;
    copyField.focus();
    copyField.select();
    el('copied').textContent = words('The checklist is selected. Use your device’s copy command.', 'Tjeklisten er markeret. Brug enhedens kopifunktion.');
  }
};
el('copy-brief').onclick = async () => {
  const brief = el('project-brief');
  try {
    await navigator.clipboard.writeText(brief.value);
    el('brief-status').textContent = words('Project brief copied.', 'Arbejdsnotatet er kopieret.');
  } catch {
    brief.focus();
    brief.select();
    el('brief-status').textContent = words('Brief selected. Use your device’s copy command.', 'Arbejdsnotatet er markeret. Brug enhedens kopifunktion.');
  }
};
renderQuiz();
for (const link of el('language').querySelectorAll('a')) {
  link.addEventListener('click', event => {
    if (link.lang === language) return;
    link.hash = location.hash;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      sessionStorage.setItem(languageTransfer, JSON.stringify({
        ...currentState(), language: link.lang, savedUntil, time:Date.now()
      }));
    } catch { /* Navigation still works without session storage. */ }
  });
}

for (const button of document.querySelectorAll('[data-share]')) {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]').href;
    const feedback = el('share-feedback');
    feedback.textContent = '';
    if (navigator.share) {
      try {
        await navigator.share({title: document.title, url});
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      feedback.textContent = words('Link copied.', 'Link kopieret.');
    } catch {
      window.prompt(words('Copy this link to share the site.', 'Kopiér linket for at dele siden.'), url);
    }
  });
}

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
    canvas.style.background = 'url(/assets/hero.webp) 95% 40% / 155% auto';
    el('study-title').textContent = words('Packaging material study','Emballagens materialer');
  }
};
el('close-study').onclick = () => dialog.close();
dialog.addEventListener('click', event => {
  const r = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
});
