import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';

const origin = 'https://www.blivppwrklar.dk';
const template = await readFile('index.html', 'utf8');
const copy = JSON.parse(await readFile('content.json', 'utf8'));
const paths = { da: '/', en: '/en/' };
const escape = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const scriptJson = data => JSON.stringify(data).replaceAll('<', '\\u003c');
const alternate = [...Object.entries(paths), ['x-default', paths.da]];
const titleKey = 'PPWR Kompas — Packaging, ready for what’s next.';
const descriptionKey = 'Map your packaging, find the gaps in your supplier data and build a practical PPWR readiness checklist.';

await mkdir('dist/en', { recursive: true });
for (const path of ['assets', 'admin', 'content.json', 'kompas.css', 'kompas.js', 'study.js']) {
  await cp(path, 'dist/' + path, { recursive: true });
}

for (const [lang, path] of Object.entries(paths)) {
  const t = (key, fallback = key) => copy[key]?.[lang] ?? fallback;
  const url = origin + path;
  const title = t(titleKey);
  const description = t(descriptionKey);
  const image = origin + '/assets/ppwr-share.jpg';
  const imageAlt = t('PPWR Kompas sharing card');
  const meta = (attribute, key, value) => '<meta ' + attribute + '="' + key + '" content="' + escape(value) + '">';
  const preview = {
    'og:type': 'website', 'og:site_name': 'Bliv PPWR klar', 'og:url': url,
    'og:title': title, 'og:description': description, 'og:image': image,
    'og:image:type': 'image/jpeg', 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': imageAlt,
    'og:locale': lang === 'da' ? 'da_DK' : 'en_GB',
    'og:locale:alternate': lang === 'da' ? 'en_GB' : 'da_DK'
  };
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'Bliv PPWR klar', alternateName: 'PPWR Kompas', inLanguage: ['da', 'en'] },
      { '@type': 'WebPage', '@id': url + '#page', url, name: title, description, inLanguage: lang, isPartOf: { '@id': origin + '/#website' },
        citation: ['https://eur-lex.europa.eu/eli/reg/2025/40/oj', 'https://green-forum.ec.europa.eu/green-business/packaging-and-packaging-waste-regulation-implementation_en'] }
    ]
  };
  const head = [
    '<title>' + escape(title) + '</title>',
    meta('name', 'description', description),
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    '<link rel="canonical" href="' + url + '">',
    ...alternate.map(([language, href]) => '<link rel="alternate" hreflang="' + language + '" href="' + origin + href + '">'),
    ...Object.entries(preview).map(([key, value]) => meta('property', key, value)),
    ...Object.entries({card: 'summary_large_image', title, description, image, 'image:alt': imageAlt})
      .map(([key, value]) => meta('name', 'twitter:' + key, value)),
    '<script type="application/ld+json">' + scriptJson(schema) + '</script>',
    '<script id="editorial-data" type="application/json">' + scriptJson(copy) + '</script>'
  ].join('\n  ');

  // Translate text nodes and the accessibility labels of the controlled HTML template.
  // Work from the original keys so that editorial edits never change lookup keys.
  let pendingTranslation;
  const html = template.replace(/<!-- SEO -->|<[^>]+>|[^<]+/g, token => {
    if (token === '<!-- SEO -->') return head;
    if (token.startsWith('<')) {
      pendingTranslation = token.match(/ data-da="([^"]*)"/)?.[1];
      return token.replace('<html lang="en">', '<html lang="' + lang + '">')
        .replace(/ data-(?:da|alt-da)="[^"]*"/g, '')
        .replace(/ (aria-label|alt)="([^"]+)"/g, (_, name, key) => ' ' + name + '="' + escape(t(key)) + '"');
    }
    const key = token.trim();
    const fallback = lang === 'da' ? pendingTranslation ?? key : key;
    pendingTranslation = undefined;
    return key ? token.replace(key, () => escape(t(key, fallback))) : token;
  }).replace('data-current-language="' + lang + '"', 'aria-current="page"');
  await writeFile('dist' + path + 'index.html', html);
}

await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /admin\nDisallow: /api/\nSitemap: ' + origin + '/sitemap.xml\n');
await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  Object.values(paths).map(path => '<url><loc>' + origin + path + '</loc></url>').join('') + '</urlset>\n');
