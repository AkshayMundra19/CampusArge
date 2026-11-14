import { spawn } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const chrome = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9224',
  '--window-size=393,852',
  '--no-sandbox',
  '--disable-gpu',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 2000));

const jsonRes = await fetch('http://127.0.0.1:9224/json');
const tabs = await jsonRes.json();
const wsUrl = tabs[0].webSocketDebuggerUrl;
console.log('WS URL:', wsUrl);

const ws = new WebSocket(wsUrl);

let id = 1;
const callbacks = new Map();

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (callbacks.has(msg.id)) {
    callbacks.get(msg.id)(msg.result);
    callbacks.delete(msg.id);
  }
});

ws.addEventListener('error', (e) => console.error('WS Error:', e));

const send = (method, params = {}) => new Promise((resolve) => {
  const msgId = id++;
  callbacks.set(msgId, resolve);
  ws.send(JSON.stringify({ id: msgId, method, params }));
});

await new Promise(r => ws.addEventListener('open', r, { once: true }));
console.log('WS connected!');

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 393,
  height: 852,
  deviceScaleFactor: 2,
  mobile: true
});

console.log('Navigating to http://127.0.0.1:5173/about ...');
await send('Page.navigate', { url: 'http://127.0.0.1:5173/about' });
await new Promise(r => setTimeout(r, 3000));

const evalRes = await send('Runtime.evaluate', {
  expression: `
    (() => {
      const docW = document.documentElement.scrollWidth;
      const docH = document.documentElement.scrollHeight;
      const bodyW = document.body.scrollWidth;
      const winW = window.innerWidth;
      const btn = document.querySelector('button[aria-label*="menu"]');
      const btnRect = btn ? btn.getBoundingClientRect() : null;
      const header = document.querySelector('header');
      const headerRect = header ? header.getBoundingClientRect() : null;
      
      const all = document.querySelectorAll('*');
      const overflowing = [];
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.right > 393 + 5) {
          overflowing.push({
            tag: el.tagName,
            cls: el.className ? el.className.toString().substring(0, 50) : '',
            right: Math.round(r.right),
            width: Math.round(r.width)
          });
        }
      }

      return {
        docW, bodyW, winW,
        btnRect: btnRect ? { left: Math.round(btnRect.left), right: Math.round(btnRect.right), top: Math.round(btnRect.top), width: Math.round(btnRect.width) } : null,
        headerRect: headerRect ? { left: Math.round(headerRect.left), right: Math.round(headerRect.right), width: Math.round(headerRect.width) } : null,
        overflowCount: overflowing.length,
        sampleOverflow: overflowing.slice(0, 8)
      };
    })()
  `,
  returnByValue: true
});

console.log('RESULT:', JSON.stringify(evalRes.result?.value, null, 2));

const shot = await send('Page.captureScreenshot', { format: 'png' });
if (shot?.data) {
  fs.writeFileSync('C:\\Users\\aksha\\.gemini\\antigravity\\brain\\84a3ce0e-c2c2-48d7-8bc2-b3e2127004d1\\about-mobile-current.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot to about-mobile-current.png');
}

ws.close();
chrome.kill();
process.exit(0);
