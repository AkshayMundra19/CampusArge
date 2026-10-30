import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Load CSV
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell);
      if (currentRow.some(c => c.trim().length > 0)) rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(c => c.trim().length > 0)) rows.push(currentRow);
  }
  return rows;
}

const rawCSV = fs.readFileSync(path.join(projectRoot, 'data', 'institutions.csv'), 'utf8');
const allRows = parseCSV(rawCSV);
const headers = allRows[0];
const dataRows = allRows.slice(1);

// 2. Load universitiesFull.json
const fullData = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src', 'lib', 'universitiesFull.json'), 'utf8')
);

// Map of uni.id -> uni
const uniMap = new Map();
for (const u of fullData) {
  uniMap.set(u.id, u);
}

// Name and website index for matching CSV row to university
function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return (u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '')).toLowerCase();
  } catch {
    return url.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  }
}

function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

function findUniForCsvRow(row) {
  const name = row[0].trim();
  const web = normalizeUrl(row[1]);

  // Exact name or aquinas website
  if (name.toLowerCase().includes('aquinas')) {
    return fullData.find(u => normalizeUrl(u.website) === web);
  }

  let m = fullData.find(u => u.name.toLowerCase() === name.toLowerCase());
  if (!m) m = fullData.find(u => normalizeName(u.name) === normalizeName(name));
  if (!m && web) m = fullData.find(u => normalizeUrl(u.website) === web);
  return m;
}

// 3. Check coverage for each column
const columnStats = headers.map(header => ({
  header,
  nonEmpty: 0,
  empty: 0,
  passed: 0,
  failed: 0,
  failures: []
}));

const distDir = path.join(projectRoot, 'dist', 'institutions');
let htmlCheckedCount = 0;
let htmlPassedCount = 0;

for (let r = 0; r < dataRows.length; r++) {
  const row = dataRows[r];
  const uni = findUniForCsvRow(row);
  const rowNum = r + 2;

  if (!uni) {
    console.error(`Row ${rowNum} (${row[0]}) could not be matched to an institution!`);
    continue;
  }

  // Check each column
  for (let c = 0; c < headers.length; c++) {
    const rawVal = row[c]?.trim();
    const stat = columnStats[c];

    if (!rawVal) {
      stat.empty++;
      continue;
    }

    stat.nonEmpty++;
    let ok = false;
    const facts = uni.facts || {};

    switch (c) {
      case 0: // University
        ok = !!uni.name;
        break;
      case 1: // Website
        ok = !!uni.website;
        break;
      case 2: // Description
        ok = !!uni.description;
        break;
      case 3: // About
        ok = !!facts.about;
        break;
      case 4: // Research
        ok = !!facts.research_summary;
        break;
      case 5: // Programs
        ok = Array.isArray(uni.programs) && uni.programs.length > 0;
        break;
      case 6: // Cost of Living
        ok = !!facts.cost_of_living?.display || facts.cost_of_living_index != null;
        break;
      case 7: // Average Home Price
        ok = !!facts.avg_home_price?.display;
        break;
      case 8: // Local Crime Rate
        ok = !!facts.crime_rate?.display;
        break;
      case 9: // Average Apartment Rent
        ok = !!facts.avg_apartment_rent?.display;
        break;
      case 10: // School Classification
        ok = !!facts.school_classification;
        break;
      case 11: // Accreditation Status
        ok = !!facts.accreditation_status;
        break;
      case 12: // Campus Acreage
        ok = !!facts.campus_acreage?.display;
        break;
      case 13: // Undergrad Pop
        ok = !!facts.undergrad_population?.display;
        break;
      case 14: // Graduation Pop
        ok = !!facts.graduate_population?.display;
        break;
      case 15: // Campus Housing Capacity
        ok = !!facts.housing_capacity_beds?.display;
        break;
      case 16: // Athletic Conference
        ok = !!facts.athletic_conference;
        break;
      case 17: // Athletic Options
        ok = !!facts.varsity_sports?.display;
        break;
      case 18: // Student/Faculty Ratio
        ok = !!facts.student_faculty_ratio?.display;
        break;
      case 19: // Cost of Attendance
        ok = uni.cost_of_attendance != null;
        break;
      case 20: // Anchor Programs
        ok = Array.isArray(facts.anchor_programs) && facts.anchor_programs.length > 0;
        break;
      case 21: // Image (empty in CSV)
        ok = true;
        break;
      case 22: // Logo Links
        ok = !!uni.logo_url;
        break;
      default:
        ok = true;
    }

    if (ok) {
      stat.passed++;
    } else {
      stat.failed++;
      stat.failures.push({ row: rowNum, uniId: uni.id, uniName: uni.name, value: rawVal });
    }
  }
}

// 4. Check HTML prerender files if dist exists
if (fs.existsSync(distDir)) {
  for (const uni of fullData) {
    htmlCheckedCount++;
    const htmlFile = path.join(distDir, uni.id, 'index.html');
    if (fs.existsSync(htmlFile)) {
      const content = fs.readFileSync(htmlFile, 'utf8');
      const hasTitle = content.includes(uni.name);
      const hasCanonical = content.includes(`https://campusarge.com/institutions/${uni.id}`);
      if (hasTitle && hasCanonical) {
        htmlPassedCount++;
      }
    }
  }
}

// 5. Generate coverage report
let totalNonEmpty = 0;
let totalPassed = 0;
let totalFailed = 0;

for (const stat of columnStats) {
  totalNonEmpty += stat.nonEmpty;
  totalPassed += stat.passed;
  totalFailed += stat.failed;
}

const reportLines = [
  '# Institutions Data Coverage & QA Report',
  '',
  `- **Date:** ${new Date().toISOString()}`,
  `- **Total CSV Rows Evaluated:** ${dataRows.length}`,
  `- **Total Distinct Institutions:** ${fullData.length}`,
  `- **Total Non-Empty Data Points Across All 23 Columns:** ${totalNonEmpty}`,
  `- **Total Data Points Passed:** ${totalPassed}`,
  `- **Total Failures:** ${totalFailed} (Target: 0)`,
  `- **Prerendered HTML Files Checked:** ${htmlCheckedCount} (${htmlPassedCount} passed)`,
  '',
  '## Column-by-Column Coverage Table',
  '',
  '| # | Column Name | Filled in CSV | Empty ("Not Provided") | Verified in Dataset | Pass / Fail |',
  '|---|-------------|---------------|------------------------|---------------------|-------------|'
];

columnStats.forEach((stat, idx) => {
  const status = stat.failed === 0 ? '✅ 100% PASS' : `❌ ${stat.failed} FAIL`;
  reportLines.push(
    `| ${idx + 1} | ${stat.header} | ${stat.nonEmpty} | ${stat.empty} | ${stat.passed} | ${status} |`
  );
});

reportLines.push('');
if (totalFailed === 0) {
  reportLines.push('## ✅ Result: ZERO FAILURES. 100% of available CSV data points are fully present in CampusArge.');
} else {
  reportLines.push('## ❌ Failures Detected:');
  for (const stat of columnStats) {
    if (stat.failures.length > 0) {
      reportLines.push(`### ${stat.header} (${stat.failures.length} failures):`);
      for (const f of stat.failures) {
        reportLines.push(`- Row ${f.row} (\`${f.uniId}\` ${f.uniName}): "${f.value}"`);
      }
    }
  }
}

const outPath = path.join(projectRoot, 'scripts', 'reports', 'coverage-report.md');
fs.writeFileSync(outPath, reportLines.join('\n'), 'utf8');

console.log(`\nCoverage check complete!`);
console.log(`Total non-empty data points: ${totalNonEmpty} | Passed: ${totalPassed} | Failed: ${totalFailed}`);
if (htmlCheckedCount > 0) {
  console.log(`Prerendered HTML check: ${htmlPassedCount}/${htmlCheckedCount} passed`);
}
console.log(`Report written to ${outPath}`);
