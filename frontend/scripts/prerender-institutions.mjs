import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const fullData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'lib', 'universitiesFull.json'), 'utf8')
);

console.log(`Starting prerendering for ${fullData.length} institutions...`);

let prerenderedCount = 0;

for (const uni of fullData) {
  const facts = uni.facts || {};
  const canonicalUrl = `https://campusarge.com/institutions/${uni.id}`;
  const websiteUrl = uni.website || canonicalUrl;

  const pageTitle = `${uni.name} – Programs, Cost & Research | CampusArge`;
  const metaDescParts = [
    `${uni.name}${uni.city ? ` in ${uni.city}` : ''}`,
    facts.school_classification ? facts.school_classification : null,
    uni.cost_of_attendance ? `Cost of attendance $${uni.cost_of_attendance.toLocaleString('en-US')}/year` : null,
    facts.student_faculty_ratio ? `${facts.student_faculty_ratio.display} ratio` : null,
    'Explore programs and research on CampusArge.'
  ].filter(Boolean);
  const metaDescription = metaDescParts.join('. ').slice(0, 158);

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

  // Replace or inject <meta name="description">
  if (/<meta name="description"[^>]*>/i.test(html)) {
    html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(metaDescription)}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${escapeHtml(metaDescription)}" />\n  </head>`);
  }

  // Inject Canonical, OG, Twitter, JSON-LD before </head>
  const headInject = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
  `;

  html = html.replace('</head>', `${headInject}\n  </head>`);

  // Inject semantic fallback inside #root for crawlers/non-JS bots
  const keyFactsList = [
    uni.cost_of_attendance ? `<li><strong>Cost of Attendance:</strong> $${uni.cost_of_attendance.toLocaleString('en-US')} / year</li>` : '',
    facts.student_faculty_ratio ? `<li><strong>Student-to-Faculty Ratio:</strong> ${escapeHtml(facts.student_faculty_ratio.display)}</li>` : '',
    facts.school_classification ? `<li><strong>Classification:</strong> ${escapeHtml(facts.school_classification)}</li>` : '',
    facts.accreditation_status ? `<li><strong>Accreditation:</strong> ${escapeHtml(facts.accreditation_status)}</li>` : '',
    facts.undergrad_population ? `<li><strong>Undergraduate Students:</strong> ${escapeHtml(facts.undergrad_population.display)}</li>` : '',
    facts.campus_acreage ? `<li><strong>Campus Size:</strong> ${escapeHtml(facts.campus_acreage.display)}</li>` : '',
    facts.housing_capacity_beds ? `<li><strong>Housing Capacity:</strong> ${escapeHtml(facts.housing_capacity_beds.display)}</li>` : '',
    facts.avg_apartment_rent ? `<li><strong>Average Rent:</strong> ${escapeHtml(facts.avg_apartment_rent.display)}</li>` : ''
  ].filter(Boolean).join('\n        ');

  const rootFallback = `<div id="root"><main class="sr-fallback" style="max-width:1100px;margin:2rem auto;padding:1.5rem;font-family:system-ui,-apple-system,sans-serif;">
      <h1>${escapeHtml(uni.name)}</h1>
      <p class="lead">${escapeHtml(uni.description || '')}</p>
      ${facts.about && facts.about !== uni.description ? `<p>${escapeHtml(facts.about)}</p>` : ''}
      ${keyFactsList ? `<section><h2>Key Institutional Facts</h2><ul>${keyFactsList}</ul></section>` : ''}
      ${facts.research_summary ? `<section><h2>Research Focus</h2><p>${escapeHtml(facts.research_summary)}</p></section>` : ''}
      ${uni.programs && uni.programs.length > 0 ? `<section><h2>Academic Programs</h2><p>${escapeHtml(uni.programs.join(', '))}</p></section>` : ''}
      ${uni.website ? `<p><a href="${uni.website}">Visit Official Website</a></p>` : ''}
    </main></div>`;

  html = html.replace('<div id="root"></div>', rootFallback);

  // Write file to dist/institutions/{id}/index.html
  const outDir = path.join(distDir, 'institutions', uni.id);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

  prerenderedCount++;
}

// Prerender Directory page dist/institutions/index.html
const directoryCanonical = 'https://campusarge.com/institutions';
const directoryTitle = 'University Directory | CampusArge';
const directoryDesc = 'Explore 426 accredited universities and institutions worldwide. Compare tuition, cost of attendance, faculty ratios, and academic programs.';

let dirHtml = template
  .replace(/<title>.*?<\/title>/i, `<title>${directoryTitle}</title>`)
  .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${directoryDesc}" />`);

const dirHeadInject = `
    <link rel="canonical" href="${directoryCanonical}" />
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
    ${fullData.slice(0, 50).map(u => `<li><a href="/institutions/${u.id}">${escapeHtml(u.name)}</a> - ${escapeHtml(u.city || '')}, ${escapeHtml(u.country || '')}</li>`).join('\n    ')}
  </ul>
</main></div>`;
dirHtml = dirHtml.replace('<div id="root"></div>', dirFallback);

const dirOutDir = path.join(distDir, 'institutions');
fs.mkdirSync(dirOutDir, { recursive: true });
fs.writeFileSync(path.join(dirOutDir, 'index.html'), dirHtml, 'utf8');

console.log(`Prerender complete! Generated ${prerenderedCount} institution pages and 1 directory page in dist/institutions/`);

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

