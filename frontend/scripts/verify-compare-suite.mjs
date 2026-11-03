import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\aksha\\.gemini\\antigravity\\brain\\84a3ce0e-c2c2-48d7-8bc2-b3e2127004d1';

const baseUrl = 'http://127.0.0.1:5173/compare';
const fourInstUrl = `${baseUrl}?ids=u_54%2Cu_234%2Cu_209%2Cu_218`;
const threeInstUrl = `${baseUrl}?ids=u_54%2Cu_234%2Cu_209`;
const twoInstUrl = `${baseUrl}?ids=u_54%2Cu_234`;
const oneInstUrl = `${baseUrl}?ids=u_54`;
const emptyInstUrl = `${baseUrl}`;
const invalidIdUrl = `${baseUrl}?ids=u_54%2Cinvalid_999%2Cu_234`;
const diffOnlyUrl = `${baseUrl}?ids=u_54%2Cu_234%2Cu_209%2Cu_218&diff=1`;

const viewports = [
  { width: 1920, height: 1080, name: '1920' },
  { width: 1440, height: 1080, name: '1440' },
  { width: 1280, height: 900,  name: '1280' },
  { width: 1024, height: 800,  name: '1024' },
  { width: 768,  height: 1024, name: '768' },
  { width: 390,  height: 844,  name: '390' }
];

async function run() {
  await fs.mkdir(artifactDir, { recursive: true });

  // 1. Capture 4-institutions across all 6 viewports
  for (const vp of viewports) {
    console.log(`Capturing Compare After (4 inst) at ${vp.width}x${vp.height}...`);
    const outPath = path.join(artifactDir, `compare-after-${vp.name}.png`);
    const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=${vp.width},${vp.height} --screenshot="${outPath}" "${fourInstUrl}"`;
    try {
      execSync(cmd, { stdio: 'ignore' });
      console.log(`Saved: ${outPath}`);
    } catch (e) {
      console.error(`Failed ${outPath}:`, e.message);
    }
  }

  // 2. Capture 3 institutions
  console.log('Capturing 3 institutions...');
  const threeOut = path.join(artifactDir, 'compare-3-institutions.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${threeOut}" "${threeInstUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${threeOut}`);

  // 3. Capture 2 institutions
  console.log('Capturing 2 institutions...');
  const twoOut = path.join(artifactDir, 'compare-2-institutions.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${twoOut}" "${twoInstUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${twoOut}`);

  // 4. Capture 1 institution state
  console.log('Capturing 1 institution state...');
  const oneOut = path.join(artifactDir, 'compare-1-institution.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${oneOut}" "${oneInstUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${oneOut}`);

  // 5. Capture 0 institutions empty state
  console.log('Capturing 0 institutions empty state...');
  const emptyOut = path.join(artifactDir, 'compare-empty.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${emptyOut}" "${emptyInstUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${emptyOut}`);

  // 6. Capture invalid ID state
  console.log('Capturing invalid ID notice...');
  const invalidOut = path.join(artifactDir, 'compare-invalid-id.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${invalidOut}" "${invalidIdUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${invalidOut}`);

  // 7. Capture "Differences only" view
  console.log('Capturing differences only...');
  const diffOut = path.join(artifactDir, 'compare-diff-only.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${diffOut}" "${diffOnlyUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${diffOut}`);

  // 8. Capture print / PDF representation
  console.log('Capturing print layout...');
  const printOut = path.join(artifactDir, 'compare-print-landscape.pdf');
  try {
    execSync(`"${edgePath}" --headless --disable-gpu --print-to-pdf="${printOut}" --print-to-pdf-no-header "${fourInstUrl}"`, { stdio: 'ignore' });
    console.log(`Saved PDF: ${printOut}`);
  } catch (e) {
    console.log('PDF export note:', e.message);
  }

  console.log('All verification captures completed!');
}

run().catch(console.error);
