import { spawn } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9295;
const edge = spawn(edgePath, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=393,852',
  '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-test-about',
  'http://127.0.0.1:5173/about'
]);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

await sleep(3000);

try {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const pages = await res.json();
  const page = pages.find(p => p.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise((resolve) => {
    const cur = id++;
    const h = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) { ws.removeEventListener('message', h); resolve(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 393,
    height: 852,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Page.navigate', { url: 'http://127.0.0.1:5173/about' });
  await sleep(3000);

  const chk = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('header button'));
        const header = document.querySelector('header');
        const nav = document.querySelector('header nav');
        const docW = document.documentElement.scrollWidth;
        const bodyW = document.body.scrollWidth;
        const winW = window.innerWidth;

        // Check if any element is overflowing
        const allElements = Array.from(document.querySelectorAll('*'));
        const overflowing = allElements
          .filter(el => el.getBoundingClientRect().right > winW + 1)
          .map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right }))
          .slice(0, 5);

        return {
          btns: btns.map(b => ({
            aria: b.getAttribute('aria-label'),
            className: b.className,
            rect: b.getBoundingClientRect(),
            color: window.getComputedStyle(b).color,
            display: window.getComputedStyle(b).display
          })),
          headerRect: header ? header.getBoundingClientRect() : null,
          docW,
          bodyW,
          winW,
          overflowing
        };
      })()
    `,
    returnByValue: true
  });

  console.log('RESULT:', JSON.stringify(chk.result.value, null, 2));

  ws.close();
} finally {
  edge.kill();
}
