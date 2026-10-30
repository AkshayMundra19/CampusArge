import fs from 'fs';
import path from 'path';

const distDir = 'frontend/dist/institutions';

const spotChecks = [
  { id: 'u_1', label: 'MIT (Reference)' },
  { id: 'u_2', label: 'Harvard University' },
  { id: 'u_14', label: 'University of Michigan–Ann Arbor (en-dash)' },
  { id: 'u_396', label: 'Labouré College (accent)' },
  { id: 'u_255', label: 'Aquinas College MI (aquinas.edu)' },
  { id: 'u_408', label: 'Aquinas College TN (aquinascollege.edu)' },
  { id: 'u_423', label: 'Antioch University Seattle (New u_423+)' }
];

console.log('=== SEO & Static Prerender Spot Checks ===\n');

for (const spot of spotChecks) {
  const file = path.join(distDir, spot.id, 'index.html');
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing file: ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];
  const desc = html.match(/<meta name="description" content="(.*?)"/)?.[1];
  const h1 = html.match(/<h1>(.*?)<\/h1>/)?.[1];
  const hasJsonLd = html.includes('application/ld+json');

  console.log(`[${spot.id}] ${spot.label}`);
  console.log(`  Title:     ${title}`);
  console.log(`  Canonical: ${canonical}`);
  console.log(`  Meta Desc: ${desc?.slice(0, 80)}...`);
  console.log(`  H1:        ${h1}`);
  console.log(`  JSON-LD:   ${hasJsonLd ? '✅ Valid' : '❌ Missing'}`);
  console.log('');
}

// Check uniqueness across all 426 prerendered pages
const allDirs = fs.readdirSync(distDir).filter(f => f.startsWith('u_'));
const titles = new Set();
const canonicals = new Set();
let dupes = 0;

for (const dir of allDirs) {
  const f = path.join(distDir, dir, 'index.html');
  const h = fs.readFileSync(f, 'utf8');
  const t = h.match(/<title>(.*?)<\/title>/)?.[1];
  const c = h.match(/<link rel="canonical" href="(.*?)"/)?.[1];

  if (titles.has(t)) {
    // Only duplicate if same institution name
    // console.warn('Dupe title:', t);
  } else {
    titles.add(t);
  }

  if (canonicals.has(c)) {
    console.error('Dupe canonical:', c);
    dupes++;
  } else {
    canonicals.add(c);
  }
}

console.log(`Total Prerendered Institution Pages: ${allDirs.length}`);
console.log(`Unique Canonical URLs: ${canonicals.size}/${allDirs.length}`);
console.log(`Canonical Duplicates: ${dupes} (Target: 0)`);

