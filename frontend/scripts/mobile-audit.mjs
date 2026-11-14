import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9285;
const baseUrl = 'http://127.0.0.1:5173';
const artifactDir = 'C:\\Users\\aksha\\.gemini\\antigravity\\brain\\84a3ce0e-c2c2-48d7-8bc2-b3e2127004d1';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureMobileScreenshots() {
  console.log('Launching headless Edge for Mobile Audit (390x844)...');
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=390,844',
    '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-mobile-audit',
    baseUrl
  ]);

  try {
    await sleep(2500);
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
    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    const routes = [
      { name: 'mobile-home', url: '/' },
      { name: 'mobile-institutions', url: '/institutions' },
      { name: 'mobile-institution-detail', url: '/institutions/u_300' },
      { name: 'mobile-compare', url: '/compare?ids=u_54,u_234' },
      { name: 'mobile-contact', url: '/contact' }
    ];

    for (const r of routes) {
      console.log(`Navigating to ${r.url}...`);
      await send('Page.navigate', { url: `${baseUrl}${r.url}` });
      await sleep(2000);

      // Check overflow
      const overflowCheck = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const bodyW = document.body.scrollWidth;
            const docW = document.documentElement.scrollWidth;
            const innerW = window.innerWidth;
            return {
              bodyW,
              docW,
              innerW,
              hasHorizontalOverflow: docW > innerW + 1
            };
          })()
        `,
        returnByValue: true
      });
      console.log(`[${r.name}] Overflow:`, overflowCheck.result?.value);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(artifactDir, `${r.name}.png`);
      fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${r.name}.png`);
    }

    ws.close();
  } finally {
    edge.kill();
  }
}

captureMobileScreenshots().then(() => {
  console.log('Mobile audit complete.');
}).catch(e => {
  console.error('Audit failed:', e);
});

