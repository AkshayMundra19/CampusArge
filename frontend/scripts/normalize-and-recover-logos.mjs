import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_PATH = path.join(rootDir, 'src', 'lib', 'universitiesFull.json');
const LOGOS_DIR = path.join(rootDir, 'public', 'logos');
const MANIFEST_PATH = path.join(rootDir, 'src', 'lib', 'logoManifest.json');
const RECOVERY_REPORT_PATH = path.join(rootDir, 'scripts', 'reports', 'logo-recovery-report.md');

const FETCH_TIMEOUT_MS = 6000;

function extractDomain(urlStr) {
  if (!urlStr) return null;
  try {
    const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function fetchBufferWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
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

async function scrapeOfficialSite(siteUrl) {
  if (!siteUrl) return null;
  const domain = extractDomain(siteUrl);
  if (!domain) return null;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const html = await res.text();

    // 1. Check apple-touch-icon
    const appleMatch = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed)["'][^>]+href=["']([^"']+)["']/i);
    if (appleMatch && appleMatch[1]) {
      const fullUrl = new URL(appleMatch[1], siteUrl).href;
      const buf = await fetchBufferWithTimeout(fullUrl);
      if (buf && buf.length > 500) return { buffer: buf, source: 'official_site_apple_touch_icon' };
    }

    // 2. Check og:image
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1] && (ogMatch[1].includes('logo') || ogMatch[1].includes('seal') || ogMatch[1].includes('crest'))) {
      const fullUrl = new URL(ogMatch[1], siteUrl).href;
      const buf = await fetchBufferWithTimeout(fullUrl);
      if (buf && buf.length > 500) return { buffer: buf, source: 'official_site_og_image' };
    }

    // 3. Check icon with sizes >= 96
    const iconMatch = html.match(/<link[^>]+rel=["']icon["'][^>]+sizes=["'](?:192x192|256x256|512x512|180x180|144x144|128x128|96x96)["'][^>]+href=["']([^"']+)["']/i);
    if (iconMatch && iconMatch[1]) {
      const fullUrl = new URL(iconMatch[1], siteUrl).href;
      const buf = await fetchBufferWithTimeout(fullUrl);
      if (buf && buf.length > 500) return { buffer: buf, source: 'official_site_large_icon' };
    }
  } catch {
    // Ignore scrape errors
  }
  return null;
}

async function fetchFromWikipedia(name) {
  try {
    const cleanName = name.replace(/\(.*?\)/g, '').trim();
    // Search Wikipedia for logo
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName + ' logo')}&gsrlimit=2&prop=pageimages&piprop=original|thumbnail&pithumbsize=600&format=json`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'CampusArgeBot/1.0 (contact@campusarge.com)' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const k in pages) {
        const imgUrl = pages[k].thumbnail?.source || pages[k].original?.source;
        if (imgUrl) {
          const buf = await fetchBufferWithTimeout(imgUrl);
          if (buf && buf.length > 1000) {
            return { buffer: buf, source: 'wikipedia_logo' };
          }
        }
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

async function fetchFromCommons(name) {
  try {
    const cleanName = name.replace(/\(.*?\)/g, '').trim();
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName + ' seal logo')}&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CampusArgeBot/1.0 (contact@campusarge.com)' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      for (const k in pages) {
        const imgUrl = pages[k].imageinfo?.[0]?.thumburl || pages[k].imageinfo?.[0]?.url;
        if (imgUrl && !imgUrl.endsWith('.pdf')) {
          const buf = await fetchBufferWithTimeout(imgUrl);
          if (buf && buf.length > 1000) {
            return { buffer: buf, source: 'wikimedia_commons' };
          }
        }
      }
    }
  } catch {
    // Ignore
  }
  return null;
}

function generateBrandedFallbackSvg(name) {
  const cleanName = name.replace(/\(.*?\)/g, '').trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'CA';

  const displayName = cleanName.length > 32 ? `${cleanName.substring(0, 30)}…` : cleanName;

  return `<svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="360" fill="#FFFFFF"/>
  <rect x="24" y="20" width="592" height="320" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <circle cx="320" cy="150" r="62" fill="#102A43"/>
  <circle cx="320" cy="150" r="56" fill="none" stroke="#B08D57" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="320" y="164" font-family="Georgia, 'Playfair Display', serif" font-size="38" font-weight="bold" fill="#F6EFE3" text-anchor="middle">${initials}</text>
  <text x="320" y="255" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#102A43" text-anchor="middle">${displayName}</text>
  <text x="320" y="280" font-family="'Inter', -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#B08D57" text-anchor="middle" letter-spacing="2">VERIFIED INSTITUTION</text>
</svg>`;
}

async function normalizeBufferToCanvas(buffer) {
  let img = sharp(buffer);
  
  // 1. Try to auto-trim margins
  try {
    const trimmedBuf = await img.trim({ threshold: 20 }).toBuffer();
    img = sharp(trimmedBuf);
  } catch {
    // If trimming fails (e.g. uniform color), retain img
  }

  // 2. Resize to fit inside 530x290 (~8% padding inside 640x360)
  const resizedBuf = await img
    .resize(530, 290, {
      fit: 'inside',
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3
    })
    .toBuffer();

  // 3. Composite onto clean 640x360 white canvas
  const canvas = await sharp({
    create: {
      width: 640,
      height: 360,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: resizedBuf, gravity: 'center' }])
    .webp({ quality: 85 })
    .toBuffer();

  return canvas;
}

async function run() {
  console.log('Starting full logo recovery and 640x360 normalization pipeline...');
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const universities = JSON.parse(raw);

  await fs.mkdir(LOGOS_DIR, { recursive: true });
  await fs.mkdir(path.dirname(RECOVERY_REPORT_PATH), { recursive: true });

  const manifest = {};
  const recoveryLog = [];
  let processed = 0;

  // Process with concurrency limit
  const CONCURRENCY = 10;
  let index = 0;

  async function worker() {
    while (index < universities.length) {
      const u = universities[index++];
      const localFile = path.join(LOGOS_DIR, `${u.id}.webp`);

      let workingBuffer = null;
      let usedSource = 'existing_local';

      // Check current local file
      try {
        const existing = await fs.readFile(localFile);
        const meta = await sharp(existing).metadata();
        // If intrinsic width or height was too small (<96), consider recovering a better resolution
        if (meta.width >= 96 && meta.height >= 96) {
          workingBuffer = existing;
          usedSource = 'existing_high_res';
        }
      } catch {
        // missing
      }

      // If missing or was too small, attempt recovery
      if (!workingBuffer) {
        // Step 1: Scrape official site
        if (u.website) {
          const scraped = await scrapeOfficialSite(u.website);
          if (scraped) {
            workingBuffer = scraped.buffer;
            usedSource = scraped.source;
          }
        }

        // Step 2: Wikipedia
        if (!workingBuffer) {
          const wiki = await fetchFromWikipedia(u.name);
          if (wiki) {
            workingBuffer = wiki.buffer;
            usedSource = wiki.source;
          }
        }

        // Step 3: Wikimedia Commons
        if (!workingBuffer) {
          const commons = await fetchFromCommons(u.name);
          if (commons) {
            workingBuffer = commons.buffer;
            usedSource = commons.source;
          }
        }

        // Step 4: Google 256px
        if (!workingBuffer) {
          const domain = extractDomain(u.website) || extractDomain(u.logo_url);
          if (domain) {
            const googleUrl = `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(domain)}`;
            const buf = await fetchBufferWithTimeout(googleUrl);
            if (buf && buf.length > 500) {
              workingBuffer = buf;
              usedSource = 'google_256';
            }
          }
        }

        // Step 5: DuckDuckGo icon
        if (!workingBuffer) {
          const domain = extractDomain(u.website) || extractDomain(u.logo_url);
          if (domain) {
            const ddgUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
            const buf = await fetchBufferWithTimeout(ddgUrl);
            if (buf && buf.length > 500) {
              workingBuffer = buf;
              usedSource = 'duckduckgo_ico';
            }
          }
        }

        // Step 6: If still nothing or too small, fall back to existing if available
        if (!workingBuffer) {
          try {
            const existing = await fs.readFile(localFile);
            if (existing && existing.length > 100) {
              workingBuffer = existing;
              usedSource = 'existing_upscaled';
            }
          } catch {
            // Nothing
          }
        }

        // Step 7: Branded Fallback SVG
        if (!workingBuffer) {
          const svg = generateBrandedFallbackSvg(u.name);
          workingBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
          usedSource = 'generated_branded_fallback';
        }
      }

      // Now normalize workingBuffer onto 640x360 canvas
      let finalCanvas = null;
      try {
        finalCanvas = await normalizeBufferToCanvas(workingBuffer);
      } catch (err) {
        // If normalization of image fails, generate branded fallback
        const svg = generateBrandedFallbackSvg(u.name);
        finalCanvas = await sharp(Buffer.from(svg)).webp({ quality: 85 }).toBuffer();
        usedSource = 'generated_branded_fallback';
      }

      await fs.writeFile(localFile, finalCanvas);

      manifest[u.id] = {
        id: u.id,
        name: u.name,
        path: `/logos/${u.id}.webp`,
        tier: 'A',
        width: 640,
        height: 360,
        bg: 'light',
        source: usedSource
      };

      recoveryLog.push({
        id: u.id,
        name: u.name,
        source: usedSource
      });

      processed++;
      if (processed % 50 === 0 || processed === universities.length) {
        console.log(`Processed & normalized ${processed}/${universities.length} (${Math.round((processed / universities.length) * 100)}%)`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Write updated manifest
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Wrote normalized manifest to ${MANIFEST_PATH}`);

  // Group sources for report
  const sourceStats = {};
  for (const item of recoveryLog) {
    sourceStats[item.source] = (sourceStats[item.source] || 0) + 1;
  }

  const report = `# CampusArge: Logo Recovery & 16:9 Normalization Report

Generated: ${new Date().toISOString()}  
Total Institutions: ${universities.length}

## Normalization Specifications
- **Canvas Size:** 640×360 px (Exact 16:9 aspect ratio, zero layout shift)
- **Inner Padding:** ~8% margin, centered Lanczos3 scaling
- **Format:** WebP (quality 85)
- **Margin Trim:** Automatic transparent / near-white margin cropping via \`sharp.trim()\`

## Recovery Source Distribution

| Source | Count | Percentage |
|:-------|:-----:|:----------:|
${Object.entries(sourceStats).map(([src, count]) => `| \`${src}\` | ${count} | ${((count / universities.length) * 100).toFixed(1)}% |`).join('\n')}

## Fallback & Recovered Highlights
${recoveryLog.filter(r => r.source !== 'existing_high_res').slice(0, 30).map(r => `- **${r.name}** (\`${r.id}\`): recovered via \`${r.source}\``).join('\n')}
`;

  await fs.writeFile(RECOVERY_REPORT_PATH, report, 'utf-8');
  console.log(`Wrote recovery report to ${RECOVERY_REPORT_PATH}`);
}

run().catch(console.error);
