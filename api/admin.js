// Access is rechecked against the repository for every editor operation.
const repository = 'https://api.github.com/repos/Brandsurface/Bliv-ppwr-klar';
const contentUrl = repository + '/contents/content.json';
const editorMarkup = `<h1>Tekstredaktør</h1><p>Redigér dansk og engelsk side om side. Kladder gemmes i denne browser.</p><div class="filters"><label>Søg i tekster<input type="search" id="search"></label><label>Område<select id="group"><option value="">Alle områder</option></select></label></div><button id="save" disabled>Udgiv på websitet</button> <button id="logout">Log ud</button><p id="count"></p><section id="rows"></section>`;

module.exports = async function admin(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const fail = (status, message) => res.status(status).json({message});
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(405, 'Brug loginformularen.');
  }
  const auth = req.headers.authorization || '';
  if (!/^Bearer github_pat_[A-Za-z0-9_]{20,240}$/.test(auth)) return fail(401, 'Brug et gyldigt, fint afgrænset GitHub-token.');
  const body = req.body;
  if (!['login','publish'].includes(body?.action)) return fail(400, 'Ukendt handling.');
  const headers = {Authorization:auth, Accept:'application/vnd.github+json', 'User-Agent':'PPWR-Kompas-Admin'};
  const github = (url, options = {}) => fetch(url, {headers, redirect:'error', signal:AbortSignal.timeout(10000), ...options});
  try {
    const access = await github(repository);
    if (access.status === 401) return fail(401, 'Tokenet er ugyldigt eller udløbet.');
    if (!access.ok) return fail(access.status >= 500 ? 503 : 403, 'GitHub kunne ikke bekræfte din adgang.');
    if ((await access.json()).permissions?.admin !== true) return fail(403, 'Kun repositoryets administratorer har adgang.');
    const fileResponse = await github(contentUrl + '?ref=main');
    if (!fileResponse.ok) return fail(503, 'Teksterne kunne ikke hentes.');
    const file = await fileResponse.json();
    const content = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
    if (body.action === 'login') return res.status(200).json({content, editorMarkup});
    const changes = body.changes;
    if (!changes || typeof changes !== 'object' || Array.isArray(changes) || !Object.keys(changes).length) return fail(400,'Der er ingen ændringer.');
    for (const [key, edits] of Object.entries(changes)) {
      if (!Object.hasOwn(content,key) || !edits || typeof edits !== 'object') return fail(400,'Ukendt tekstfelt.');
      for (const [lang, edit] of Object.entries(edits)) {
        if (!['da','en'].includes(lang) || typeof edit?.to !== 'string' || !edit.to.trim() || edit.to.length > 20000) return fail(400,'Kontrollér tekst og sprog.');
        if (content[key][lang] !== edit.from && content[key][lang] !== edit.to) return fail(409,'Teksten er ændret af en anden. Log ind igen og gennemgå feltet: ' + key);
        content[key][lang] = edit.to;
      }
    }
    const updated = await github(contentUrl, {method:'PUT',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({
      sha:file.sha, branch:'main', message:'Update PPWR editorial content',
      content:Buffer.from(JSON.stringify(content,null,2) + '\n').toString('base64')
    })});
    if (!updated.ok) return fail(updated.status === 409 ? 409 : 403, 'GitHub afviste ændringen. Kontrollér skriveadgang, eller log ind igen.');
    return res.status(200).json({content});
  } catch {
    return fail(503,'Forbindelsen til GitHub blev afbrudt. Prøv igen.');
  }
};
