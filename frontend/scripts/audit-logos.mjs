import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DATA_PATH = path.join(rootDir, 'src', 'lib', 'universitiesFull.json');
const LOGOS_DIR = path.join(rootDir, 'public', 'logos');
const REPORT_PATH = path.join(rootDir, 'scripts', 'logo-audit-report.json');

async function checkLogo(u) {
  const localFile = path.join(LOGOS_DIR, `${u.id}.webp`);
  let exists = false;
  try {
    await fs.access(localFile);
    exists = true;
  } catch {
    exists = false;
  }

  if (!exists) {
    return {
      id: u.id,
      name: u.name,
      website: u.website,
      logoUrl: u.logo_url,
      status: 'MISSING',
      reason: 'Local file does not exist',
      width: 0,
      height: 0,
      transparentPct: 0
    };
  }

  try {
    const buffer = await fs.readFile(localFile);
    if (!buffer || buffer.length === 0) {
      return {
        id: u.id,
        name: u.name,
        website: u.website,
        logoUrl: u.logo_url,
        status: 'BROKEN',
        reason: 'Zero-byte file',
        width: 0,
        height: 0,
        transparentPct: 0
      };
    }

    const image = sharp(buffer);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      return {
        id: u.id,
        name: u.name,
        website: u.website,
        logoUrl: u.logo_url,
        status: 'BROKEN',
        reason: 'Cannot decode image dimensions',
        width: 0,
        height: 0,
        transparentPct: 0
      };
    }

    // Check transparency / blankness
    const { data, info } = await image
      .resize(64, 64, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let blankPixels = 0;
    const totalPixels = info.width * info.height;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // transparent or near white
      if (a < 15 || (r > 250 && g > 250 && b > 250)) {
        blankPixels++;
      }
    }

    const blankPct = Math.round((blankPixels / totalPixels) * 100);

    if (blankPct >= 99) {
      return {
        id: u.id,
        name: u.name,
        website: u.website,
        logoUrl: u.logo_url,
        status: 'BLANK',
        reason: `Image is ${blankPct}% blank/transparent`,
        width: meta.width,
        height: meta.height,
        blankPct
      };
    }

    if (meta.width < 96 || meta.height < 96) {
      return {
        id: u.id,
        name: u.name,
        website: u.website,
        logoUrl: u.logo_url,
        status: 'TOO_SMALL',
        reason: `Intrinsic dimension ${meta.width}x${meta.height} < 96px`,
        width: meta.width,
        height: meta.height,
        blankPct
      };
    }

    return {
      id: u.id,
      name: u.name,
      website: u.website,
      logoUrl: u.logo_url,
      status: 'OK',
      reason: 'Valid dimension and non-blank content',
      width: meta.width,
      height: meta.height,
      blankPct
    };
  } catch (err) {
    return {
      id: u.id,
      name: u.name,
      website: u.website,
      logoUrl: u.logo_url,
      status: 'BROKEN',
      reason: `Decode error: ${err.message}`,
      width: 0,
      height: 0,
      blankPct: 0
    };
  }
}

async function run() {
  console.log('Running logo audit on all institutions...');
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const universities = JSON.parse(raw);

  const results = [];
  for (const u of universities) {
    const res = await checkLogo(u);
    results.push(res);
  }

  const counts = {
    OK: results.filter(r => r.status === 'OK').length,
    TOO_SMALL: results.filter(r => r.status === 'TOO_SMALL').length,
    BLANK: results.filter(r => r.status === 'BLANK').length,
    MISSING: results.filter(r => r.status === 'MISSING').length,
    BROKEN: results.filter(r => r.status === 'BROKEN').length,
    TOTAL: results.length
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify({ summary: counts, results }, null, 2), 'utf-8');

  console.log('\n=== LOGO AUDIT REPORT ===');
  console.log(`Total Institutions: ${counts.TOTAL}`);
  console.log(`OK:         ${counts.OK} (${Math.round((counts.OK / counts.TOTAL) * 100)}%)`);
  console.log(`TOO_SMALL:  ${counts.TOO_SMALL} (${Math.round((counts.TOO_SMALL / counts.TOTAL) * 100)}%)`);
  console.log(`BLANK:      ${counts.BLANK} (${Math.round((counts.BLANK / counts.TOTAL) * 100)}%)`);
  console.log(`MISSING:    ${counts.MISSING} (${Math.round((counts.MISSING / counts.TOTAL) * 100)}%)`);
  console.log(`BROKEN:     ${counts.BROKEN} (${Math.round((counts.BROKEN / counts.TOTAL) * 100)}%)`);
  console.log(`Saved report to ${REPORT_PATH}\n`);

  const problemItems = results.filter(r => r.status !== 'OK').slice(0, 15);
  if (problemItems.length > 0) {
    console.log('Sample Problem Items:');
    console.table(problemItems.map(p => ({
      id: p.id,
      name: p.name.substring(0, 30),
      status: p.status,
      size: `${p.width}x${p.height}`,
      reason: p.reason
    })));
  }

  return counts;
}

run().catch(console.error);
