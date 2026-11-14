import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

function getSlug(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const template = fs.readFileSync(templatePath, 'utf8');
const fullData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'lib', 'universitiesFull.json'), 'utf8')
);

console.log(`Starting prerendering for ${fullData.length} institutions...`);

let prerenderedCount = 0;

for (const uni of fullData) {
  const facts = uni.facts || {};
  const slug = uni.slug || getSlug(uni.name);
  const canonicalUrl = `https://campusarge.com/${slug}`;
  const websiteUrl = uni.website || canonicalUrl;

  const pageTitle = `${uni.name} – Tuition Fees, Programs & Ranking | CampusArge`;
  const metaDescParts = [
    `${uni.name}${uni.city ? ` in ${uni.city}` : ''}`,
    facts.school_classification ? facts.school_classification : null,
    uni.cost_of_attendance ? `Tuition & cost $${uni.cost_of_attendance.toLocaleString('en-US')}/year` : null,
    facts.student_faculty_ratio ? `${facts.student_faculty_ratio.display} ratio` : null,
    'Explore programs, fees, and ranking on CampusArge.'
  ].filter(Boolean);
  const metaDescription = metaDescParts.join('. ').slice(0, 158);

  const pageKeywords = [
    uni.name,
    `${uni.name} programs`,
    `${uni.name} tuition fees`,
    `${uni.name} cost of attendance`,
    `${uni.name} acceptance rate`,
    `${uni.name} ranking`,
    uni.city ? `colleges in ${uni.city}` : null,
    uni.state ? `universities in ${uni.state}` : null,
    'higher education',
    'compare universities',
    'CampusArge'
  ].filter(Boolean).join(', ');

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "name": uni.name,
    "url": websiteUrl,
    "sameAs": uni.website ? [uni.website] : undefined,
    "logo": uni.logo_url || undefined,
    "description": uni.description || facts.about || undefined,
    "identifier": uni.id,
    "address": {
      "@type": "PostalAddress",
      ...(uni.city ? { "addressLocality": uni.city } : {}),
      ...(uni.state ? { "addressRegion": uni.state } : {}),
      "addressCountry": uni.country || "United States"
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://campusarge.com" },
      { "@type": "ListItem", "position": 2, "name": "Institutions", "item": "https://campusarge.com/institutions" },
      { "@type": "ListItem", "position": 3, "name": uni.name, "item": canonicalUrl }
    ]
  };

  // Replace <title>
  let html = template.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);

  // Replace meta description
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(metaDescription)}" />`);

  // Strip default home canonical, og and twitter tags
  html = html.replace(/<link rel="canonical"[^>]*>/i, '');
  html = html.replace(/<meta property="og:[^>]*>/gi, '');
  html = html.replace(/<meta name="twitter:[^>]*>/gi, '');

  // Inject canonical, keywords, and Open Graph / Twitter tags into <head>
  const headInject = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="keywords" content="${escapeHtml(pageKeywords)}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    ${uni.logo_url ? `<meta property="og:image" content="https://campusarge.com${uni.logo_url}" />` : ''}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  `;
  html = html.replace('</head>', `${headInject}\n  </head>`);

  // Fallback body content for search engine indexers before JS hydration
  const keyFactsList = [
    facts.school_classification ? `<li>Classification: ${escapeHtml(facts.school_classification)}</li>` : '',
    facts.accreditation_status ? `<li>Accreditation: ${escapeHtml(facts.accreditation_status)}</li>` : '',
    uni.cost_of_attendance ? `<li>Cost of Attendance: $${uni.cost_of_attendance.toLocaleString('en-US')}/year</li>` : '',
    facts.student_faculty_ratio ? `<li>Student-Faculty Ratio: ${escapeHtml(facts.student_faculty_ratio.display)}</li>` : '',
    facts.undergrad_population ? `<li>Undergraduate Population: ${facts.undergrad_population.display}</li>` : '',
    facts.graduate_population ? `<li>Graduate Population: ${facts.graduate_population.display}</li>` : '',
    facts.campus_acreage ? `<li>Campus Acreage: ${escapeHtml(facts.campus_acreage.display)}</li>` : ''
  ].filter(Boolean).join('\n        ');

  const rootFallback = `<div id="root"><main style="max-width:900px;margin:2rem auto;padding:1.5rem;font-family:system-ui,-apple-system,sans-serif;">
      <h1>${escapeHtml(uni.name)}</h1>
      <p><strong>Location:</strong> ${escapeHtml(uni.city || '')}${uni.state ? `, ${escapeHtml(uni.state)}` : ''}, ${escapeHtml(uni.country || 'United States')}</p>
      ${facts.about ? `<p>${escapeHtml(facts.about)}</p>` : (uni.description ? `<p>${escapeHtml(uni.description)}</p>` : '')}
      ${keyFactsList ? `<section><h2>Key Institutional Facts</h2><ul>${keyFactsList}</ul></section>` : ''}
      ${facts.research_summary ? `<section><h2>Research Focus</h2><p>${escapeHtml(facts.research_summary)}</p></section>` : ''}
      ${uni.programs && uni.programs.length > 0 ? `<section><h2>Academic Programs</h2><p>${escapeHtml(uni.programs.join(', '))}</p></section>` : ''}
      ${uni.website ? `<p><a href="${uni.website}">Visit Official Website</a></p>` : ''}
    </main></div>`;

  html = html.replace('<div id="root"></div>', rootFallback);

  // 1. Primary Clean Permalink: dist/{slug}/index.html
  const outDirSlug = path.join(distDir, slug);
  fs.mkdirSync(outDirSlug, { recursive: true });
  fs.writeFileSync(path.join(outDirSlug, 'index.html'), html, 'utf8');

  // 2. Secondary Alias: dist/institutions/{slug}/index.html
  const outDirInstSlug = path.join(distDir, 'institutions', slug);
  fs.mkdirSync(outDirInstSlug, { recursive: true });
  fs.writeFileSync(path.join(outDirInstSlug, 'index.html'), html, 'utf8');

  // 3. Backward Compatibility Alias: dist/institutions/{id}/index.html
  const outDirId = path.join(distDir, 'institutions', uni.id);
  fs.mkdirSync(outDirId, { recursive: true });
  fs.writeFileSync(path.join(outDirId, 'index.html'), html, 'utf8');

  prerenderedCount++;
}

// Prerender Directory page dist/institutions/index.html and dist/universities/index.html
const directoryCanonical = 'https://campusarge.com/institutions';
const directoryTitle = 'University Directory | Explore 426+ Accredited Colleges | CampusArge';
const directoryDesc = 'Explore 426 accredited universities and institutions worldwide. Compare tuition fees, cost of attendance, faculty ratios, and academic programs on CampusArge.';
const directoryKeywords = 'university directory, college directory, list of universities, compare universities, accredited colleges, university programs, tuition fees, CampusArge';

let dirHtml = template
  .replace(/<title>.*?<\/title>/i, `<title>${directoryTitle}</title>`)
  .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${directoryDesc}" />`)
  .replace(/<link rel="canonical"[^>]*>/i, '')
  .replace(/<meta property="og:[^>]*>/gi, '')
  .replace(/<meta name="twitter:[^>]*>/gi, '');

const dirHeadInject = `
    <link rel="canonical" href="${directoryCanonical}" />
    <meta name="keywords" content="${directoryKeywords}" />
    <meta property="og:title" content="${directoryTitle}" />
    <meta property="og:description" content="${directoryDesc}" />
    <meta property="og:url" content="${directoryCanonical}" />
    <meta name="twitter:title" content="${directoryTitle}" />
    <meta name="twitter:description" content="${directoryDesc}" />
`;
dirHtml = dirHtml.replace('</head>', `${dirHeadInject}\n  </head>`);

const dirFallback = `<div id="root"><main style="max-width:1100px;margin:2rem auto;padding:1.5rem;font-family:system-ui,-apple-system,sans-serif;">
  <h1>University Directory</h1>
  <p>${directoryDesc}</p>
  <ul>
    ${fullData.slice(0, 100).map(u => {
      const slug = u.slug || getSlug(u.name);
      return `<li><a href="/${slug}">${escapeHtml(u.name)}</a> - ${escapeHtml(u.city || '')}, ${escapeHtml(u.country || '')}</li>`;
    }).join('\n    ')}
  </ul>
</main></div>`;
dirHtml = dirHtml.replace('<div id="root"></div>', dirFallback);

const dirOutDir = path.join(distDir, 'institutions');
fs.mkdirSync(dirOutDir, { recursive: true });
fs.writeFileSync(path.join(dirOutDir, 'index.html'), dirHtml, 'utf8');

const univOutDir = path.join(distDir, 'universities');
fs.mkdirSync(univOutDir, { recursive: true });
fs.writeFileSync(path.join(univOutDir, 'index.html'), dirHtml, 'utf8');

console.log(`Prerender complete! Generated ${prerenderedCount} institution pages and 1 directory page in dist/`);

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
