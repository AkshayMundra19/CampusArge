import { spawn } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9245;
const compareUrl = 'http://127.0.0.1:5173/compare?ids=u_54%2Cu_234%2Cu_209%2Cu_218';

async function main() {
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1080',
    '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-p1-debug',
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

    for (let i = 0; i < 20; i++) {
      const chk = await send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('table'))`,
        returnByValue: true
      });
      if (chk.result?.value) break;
      await new Promise(r => setTimeout(r, 500));
    }

    const debugResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const table = document.querySelector('table');
          const ths = Array.from(document.querySelectorAll('thead th'));
          const firstTh = ths[0];
          const firstBand = document.querySelector('.compare-section-band');
          const card = table.closest('div').parentElement;
          const scrollContainer = table.parentElement;

          function dump(el, label) {
            if (!el) return { label, exists: false };
            const cs = window.getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
              label,
              tag: el.tagName,
              class: el.className,
              rect: { top: r.top, bottom: r.bottom, left: r.left, width: r.width, height: r.height },
              position: cs.position,
              top: cs.top,
              bottom: cs.bottom,
              margin: cs.margin,
              padding: cs.padding,
              transform: cs.transform,
              zIndex: cs.zIndex,
              overflow: cs.overflow,
              overflowX: cs.overflowX,
              overflowY: cs.overflowY
            };
          }

          return {
            windowScrollY: window.scrollY,
            card: dump(card, 'Card Container (Outer)'),
            scrollContainer: dump(scrollContainer, 'Scroll Container'),
            table: dump(table, 'Table'),
            firstTh: dump(firstTh, 'First Header Th'),
            firstBand: dump(firstBand, 'First Section Band'),
            diffs: {
              firstThTop_minus_cardTop: firstTh ? firstTh.getBoundingClientRect().top - card.getBoundingClientRect().top : 0,
              firstThTop_minus_tableTop: firstTh ? firstTh.getBoundingClientRect().top - table.getBoundingClientRect().top : 0,
              firstBandTop_minus_firstThBottom: (firstBand && firstTh) ? firstBand.getBoundingClientRect().top - firstTh.getBoundingClientRect().bottom : 0,
              firstBandTop: firstBand?.getBoundingClientRect().top,
              firstThBottom: firstTh?.getBoundingClientRect().bottom
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log('P1 DEBUG OUTPUT:\n', JSON.stringify(debugResult.result.value, null, 2));
    ws.close();
  } finally {
    edge.kill();
  }
}

main().catch(console.error);

