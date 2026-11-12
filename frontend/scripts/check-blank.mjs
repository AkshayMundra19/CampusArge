import { spawn } from 'node:child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9271;
const url = 'http://127.0.0.1:5173/';

const edge = spawn(edgePath, [
  `--remote-debugging-port=${port}`,
  '--headless=new',
  '--disable-gpu',
  '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-debug-blank3',
  url
]);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

await sleep(3000);

const res = await fetch(`http://127.0.0.1:${port}/json`);
const pages = await res.json();
const page = pages.find(p => p.type === 'page');

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let msgId = 1;
const send = (m, p = {}) => new Promise((resolve) => {
  const cur = msgId++;
  const h = (e) => {
    const d = JSON.parse(e.data);
    if (d.id === cur) { ws.removeEventListener('message', h); resolve(d.result); }
  };
  ws.addEventListener('message', h);
  ws.send(JSON.stringify({ id: cur, method: m, params: p }));
});

const errors = [];
const logs = [];
ws.addEventListener('message', (e) => {
  const d = JSON.parse(e.data);
  if (d.method === 'Runtime.exceptionThrown') {
    const ex = d.params?.exceptionDetails;
    errors.push(ex?.exception?.description || ex?.text || JSON.stringify(d.params));
  }
  if (d.method === 'Log.entryAdded') {
    const entry = d.params.entry;
    logs.push(`${entry.level}: ${entry.text}`);
  }
});

await send('Runtime.enable');
await send('Log.enable');

// Wait for modules to load
await sleep(10000);

const rootHTML = await send('Runtime.evaluate', {
  expression: 'document.getElementById("root").innerHTML.substring(0, 500)',
  returnByValue: true
});

console.log('ROOT HTML:', rootHTML.result?.value);
console.log('\nERRORS (' + errors.length + '):');
errors.forEach(e => console.log('  -', e?.substring(0, 500)));
console.log('\nLOGS:');
logs.forEach(l => console.log('  -', l));

ws.close();
edge.kill();

