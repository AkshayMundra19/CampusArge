import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const FULL_DATA_PATH = path.join(rootDir, 'src', 'lib', 'universitiesFull.json');
const OUTPUT_DIR = path.join(rootDir, 'public', 'logos');
const MANIFEST_PATH = path.join(rootDir, 'src', 'lib', 'logoManifest.json');
const REPORT_PATH = path.join(rootDir, 'scripts', 'reports', 'logo-report.md');

// Concurrency limit
const CONCURRENCY = 20;
const FETCH_TIMEOUT_MS = 6000;

async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    clearTimeout(id);
    return null;
  }
}

function extractDomain(urlStr) {
  if (!urlStr) return null;
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function analyzeBrightnessAndOptimize(buffer, outPath) {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return null;
    }

    // Convert to webp with high quality, max 256x256 fitting inside
    const resized = image
      .resize(256, 256, {
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
      .webp({ quality: 90 });

    await resized.toFile(outPath);

    // Compute luminance from raw pixels to detect white/light logos
    const rawData = await sharp(buffer)
      .resize(64, 64, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = rawData;
    let totalLuminance = 0;
    let nonAlphaPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a > 30) { // non-transparent
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Relative luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;
        nonAlphaPixels++;
      }
    }

    const avgLuminance = nonAlphaPixels > 0 ? totalLuminance / nonAlphaPixels : 128;
    // If average brightness of logo marks is > 225, it needs a dark badge backdrop on light surfaces
    const bg = avgLuminance > 225 ? 'dark' : 'light';

    return {
      width: metadata.width,
      height: metadata.height,
      bg,
      avgLuminance: Math.round(avgLuminance)
    };
  } catch (err) {
    return null;
  }
}

async function processUniversity(u) {
  const domain = extractDomain(u.website) || extractDomain(u.logo_url);
  const outFileName = `${u.id}.webp`;
  const outFilePath = path.join(OUTPUT_DIR, outFileName);

  const candidateUrls = [];
  if (domain) {
    candidateUrls.push(`https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(domain)}`);
  }
  if (u.logo_url) {
    const higherRes = u.logo_url.replace(/sz=\d+/, 'sz=256');
    if (!candidateUrls.includes(higherRes)) candidateUrls.push(higherRes);
    if (!candidateUrls.includes(u.logo_url)) candidateUrls.push(u.logo_url);
  }

  let buffer = null;
  for (const url of candidateUrls) {
    buffer = await fetchWithTimeout(url);
    if (buffer && buffer.length > 200) break;
  }

  if (!buffer || buffer.length < 200) {
    return {
      id: u.id,
      name: u.name,
      path: null,
      tier: 'D',
      width: 0,
      height: 0,
      bg: 'light'
    };
  }

  const analysis = await analyzeBrightnessAndOptimize(buffer, outFilePath);
  if (!analysis) {
    return {
      id: u.id,
      name: u.name,
      path: null,
      tier: 'D',
      width: 0,
      height: 0,
      bg: 'light'
    };
  }

  const maxDim = Math.max(analysis.width, analysis.height);
  let tier = 'C';
  if (maxDim >= 128) {
    tier = 'A';
  } else if (maxDim >= 64) {
    tier = 'B';
  }

  return {
    id: u.id,
    name: u.name,
    path: `/logos/${outFileName}`,
    tier,
    width: analysis.width,
    height: analysis.height,
    bg: analysis.bg
  };
}

async function run() {
  const startTime = Date.now();
  console.log('Starting logo build pipeline...');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });

  const rawData = await fs.readFile(FULL_DATA_PATH, 'utf-8');
  const universities = JSON.parse(rawData);
  console.log(`Loaded ${universities.length} universities.`);

  const results = [];
  let index = 0;

  async function worker() {
    while (index < universities.length) {
      const currentIndex = index++;
      const u = universities[currentIndex];
      try {
        const res = await processUniversity(u);
        results.push(res);
        if (results.length % 50 === 0 || results.length === universities.length) {
          console.log(`Processed ${results.length}/${universities.length} (${Math.round((results.length / universities.length) * 100)}%)`);
        }
      } catch (err) {
        results.push({
          id: u.id,
          name: u.name,
          path: null,
          tier: 'D',
          width: 0,
          height: 0,
          bg: 'light'
        });
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Build manifest dictionary indexed by id
  const manifest = {};
  for (const r of results) {
    manifest[r.id] = r;
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Wrote manifest with ${Object.keys(manifest).length} items to ${MANIFEST_PATH}`);

  // Tally counts
  const tierCounts = { A: 0, B: 0, C: 0, D: 0 };
  let darkBgCount = 0;
  for (const r of results) {
    tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;
    if (r.bg === 'dark') darkBgCount++;
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  // Generate Report
  const report = `# CampusArge: Logo Optimization Audit Report

Generated: ${new Date().toISOString()}  
Execution Time: ${durationSec}s  
Total Institutions: ${results.length}

## Quality Tier Breakdown

| Tier | Description | Dimension | Count | Percentage |
|:-----|:------------|:----------|:------|:-----------|
| **Tier A** | High Resolution (Crisp) | ≥ 128 px | ${tierCounts.A} | ${((tierCounts.A / results.length) * 100).toFixed(1)}% |
| **Tier B** | Medium Resolution | 64 – 127 px | ${tierCounts.B} | ${((tierCounts.B / results.length) * 100).toFixed(1)}% |
| **Tier C** | Low Resolution | < 64 px | ${tierCounts.C} | ${((tierCounts.C / results.length) * 100).toFixed(1)}% |
| **Tier D** | Fallback / Monogram | Missing | ${tierCounts.D} | ${((tierCounts.D / results.length) * 100).toFixed(1)}% |

- **Dark Backdrop Required (\`bg: "dark"\`):** ${darkBgCount} institutions (white/light logos given contrast framing).
- **Optimization Format:** WebP (lossless/90 quality, Lanczos3 downscaling, max 256×256 bounding box).

## Sample Audit Entries

| ID | Institution Name | Tier | Resolution | Backdrop | File Path |
|:---|:-----------------|:----:|:----------:|:--------:|:----------|
${results.slice(0, 15).map(r => `| \`${r.id}\` | ${r.name} | ${r.tier} | ${r.width ? `${r.width}×${r.height}` : '—'} | ${r.bg} | \`${r.path || 'fallback'}\` |`).join('\n')}

## Reversion & Integration
- Local WebP icons are served from \`/logos/{id}.webp\`.
- Manifest is loaded statically from \`src/lib/logoManifest.json\`.
- If an image fails in browser, \`InstitutionLogo\` automatically falls back to the brand monogram.
`;

  await fs.writeFile(REPORT_PATH, report, 'utf-8');
  console.log(`Wrote logo report to ${REPORT_PATH}`);
}

run().catch((err) => {
  console.error('Fatal error in build-logos:', err);
  process.exit(1);
});

