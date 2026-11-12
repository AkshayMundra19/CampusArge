import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\aksha\\.gemini\\antigravity\\brain\\84a3ce0e-c2c2-48d7-8bc2-b3e2127004d1';
const compareUrl = 'http://127.0.0.1:5173/compare?ids=u_54%2Cu_234%2Cu_209%2Cu_218';

async function main() {
  await fs.mkdir(artifactDir, { recursive: true });

  // 1. Capture before screenshots at 1920 and 1280
  console.log('Capturing before screenshot at 1920x1080...');
  const out1920 = path.join(artifactDir, 'compare-r2-before-1920.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1920,1080 --screenshot="${out1920}" "${compareUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${out1920}`);

  console.log('Capturing before screenshot at 1280x900...');
  const out1280 = path.join(artifactDir, 'compare-r2-before-1280.png');
  execSync(`"${edgePath}" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,900 --screenshot="${out1280}" "${compareUrl}"`, { stdio: 'ignore' });
  console.log(`Saved: ${out1280}`);

  // 2. Launch browser with CDP to inspect computed styles at scrollY = 0
  const port = 9240;
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1080',
    '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-r2-inspect',
    compareUrl
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const pages = await res.json();
    const page = pages.find(p => p.type === 'page');

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (m, p = {}) => new Promise((resolve, reject) => {
      const cur = id++;
      const h = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === cur) {
          ws.removeEventListener('message', h);
          if (d.error) reject(d.error);
          else resolve(d.result);
        }
      };
      ws.addEventListener('message', h);
      ws.send(JSON.stringify({ id: cur, method: m, params: p }));
    });

    await send('Runtime.enable');

    // Poll for table
    for (let i = 0; i < 20; i++) {
      const chk = await send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('table'))`,
        returnByValue: true
      });
      if (chk.result?.value) break;
      await new Promise(r => setTimeout(r, 500));
    }

    const inspection = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.bg-white.rounded-\\\\[20px\\\\]') || document.querySelector('.rounded-\\\\[20px\\\\]');
          const table = document.querySelector('table');
          const headerThs = Array.from(document.querySelectorAll('thead th'));
          const firstHeader = headerThs[0];
          const secondHeader = headerThs[1];
          const firstBand = document.querySelector('.compare-section-band');
          const firstDataRow = Array.from(document.querySelectorAll('tbody tr')).find(tr => tr.querySelectorAll('td').length > 0);
          const firstDataCell = firstDataRow ? firstDataRow.querySelector('td') : null;
          const firstRowHeader = firstDataRow ? firstDataRow.querySelector('th') : null;

          function getStyles(el, name) {
            if (!el) return { name, exists: false };
            const cs = window.getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
              name,
              exists: true,
              tagName: el.tagName,
              className: el.className,
              rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), height: Math.round(r.height), width: Math.round(r.width) },
              position: cs.position,
              top: cs.top,
              marginTop: cs.marginTop,
              paddingTop: cs.paddingTop,
              transform: cs.transform,
              zIndex: cs.zIndex,
              display: cs.display
            };
          }

          return {
            scrollY: window.scrollY,
            card: getStyles(card, 'Card Container'),
            table: getStyles(table, 'Table'),
            firstHeaderTh: getStyles(firstHeader, 'Top-Left Header Th (Criteria)'),
            secondHeaderTh: getStyles(secondHeader, 'First Inst Header Th (Pomona)'),
            firstBand: getStyles(firstBand, 'First Section Band (Cost & Affordability)'),
            firstRowHeader: getStyles(firstRowHeader, 'First Data Row Th (Cost of Attendance)'),
            firstDataCell: getStyles(firstDataCell, 'First Data Cell ($13,000/yr)'),
            offsetAnalysis: {
              cardTop: card?.getBoundingClientRect().top,
              firstHeaderTop: firstHeader?.getBoundingClientRect().top,
              firstHeaderBottom: firstHeader?.getBoundingClientRect().bottom,
              firstBandTop: firstBand?.getBoundingClientRect().top,
              firstBandBottom: firstBand?.getBoundingClientRect().bottom,
              gapAboveHeader: (firstHeader?.getBoundingClientRect().top || 0) - (card?.getBoundingClientRect().top || 0),
              overlapWithBand: (firstHeader?.getBoundingClientRect().bottom || 0) - (firstBand?.getBoundingClientRect().top || 0),
              overlapWithFirstDataRow: (firstHeader?.getBoundingClientRect().bottom || 0) - (firstRowHeader?.getBoundingClientRect().top || 0)
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log('COMPUTED STYLES & OFFSET INSPECTION:\n', JSON.stringify(inspection.result.value, null, 2));
    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);

