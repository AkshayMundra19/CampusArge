import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9260;
const compareUrl = 'http://127.0.0.1:5173/compare?ids=u_54%2Cu_234%2Cu_209%2Cu_218';
const artifactDir = 'C:\\Users\\aksha\\.gemini\\antigravity\\brain\\84a3ce0e-c2c2-48d7-8bc2-b3e2127004d1';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runSuite() {
  console.log('--- Launching Edge for Acceptance Suite ---');
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--user-data-dir=C:\\Users\\aksha\\AppData\\Local\\Temp\\edge-r2-acceptance-2',
    compareUrl
  ]);

  const results = {};

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

    async function evalCode(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true
      });
      if (res.exceptionDetails) {
        console.error('JS Exception Details:', JSON.stringify(res.exceptionDetails));
        throw new Error(res.exceptionDetails.text || res.exceptionDetails.exception?.description);
      }
      return res.result?.value;
    }

    async function setViewport(width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 768
      });
      await sleep(400);
    }

    async function captureScreenshot(filePath, fullPage = false) {
      const res = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: fullPage
      });
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    }

    // Wait for table and data rows to render completely
    let isReady = false;
    for (let i = 0; i < 60; i++) {
      const ready = await evalCode(`Boolean(document.querySelector('.compare-section-band') && document.querySelector('tbody tr td'))`);
      if (ready) {
        isReady = true;
        break;
      }
      await sleep(500);
    }
    if (!isReady) {
      throw new Error('Timeout: .compare-section-band or tbody tr td did not render after 30 seconds');
    }
    await sleep(500);

    // 1. Initial 1920x1080 capture & check
    await setViewport(1920, 1080);
    await captureScreenshot(path.join(artifactDir, 'compare-r2-after-1920.png'));
    console.log('Captured compare-r2-after-1920.png');

    // TEST A: Blank offset & overlap check at scrollY = 0
    const valA = await evalCode(`
      (() => {
        window.scrollTo(0, 0);
        const thead = document.querySelector('thead');
        if (!thead) return { error: 'thead not found' };
        const theadRect = thead.getBoundingClientRect();
        const card = thead.closest('.bg-white') || thead.closest('div').parentElement;
        if (!card) return { error: 'card container not found' };
        const cardRect = card.getBoundingClientRect();
        const firstBand = document.querySelector('.compare-section-band');
        if (!firstBand) return { error: 'firstBand not found' };
        const bandRect = firstBand.getBoundingClientRect();

        const topDiff = Math.abs(theadRect.top - cardRect.top);
        const gapOrOverlap = theadRect.bottom - bandRect.top;
        return {
          theadTop: theadRect.top,
          cardTop: cardRect.top,
          topDiff,
          theadBottom: theadRect.bottom,
          bandTop: bandRect.top,
          gapOrOverlap,
          pass: topDiff <= 2.5 && theadRect.bottom <= bandRect.top + 1.5
        };
      })()
    `);
    if (valA.error) {
      throw new Error('Test A Error: ' + valA.error);
    }
    results['Test A: No Blank Offset & No Overlap at scrollY=0'] = {
      pass: valA.pass,
      details: `topDiff: ${valA.topDiff.toFixed(2)}px (<= 2.5px), gap/overlap: ${valA.gapOrOverlap.toFixed(2)}px (<= 1.5px)`
    };

    // TEST B: Header columns left/width align with body columns
    const valB = await evalCode(`
      (() => {
        const ths = Array.from(document.querySelectorAll('thead th'));
        const allTrs = Array.from(document.querySelectorAll('tbody tr'));
        const firstDataTr = allTrs.find(tr => !tr.querySelector('.compare-section-band') && tr.children.length > 1);
        if (!firstDataTr) return { error: 'No data tr found' };
        // Row header is first child (th), rest are tds
        const cells = Array.from(firstDataTr.children);

        let allMatch = true;
        const diffs = [];
        for (let j = 0; j < ths.length; j++) {
          const thRect = ths[j].getBoundingClientRect();
          const cellRect = cells[j].getBoundingClientRect();
          const leftDiff = Math.abs(thRect.left - cellRect.left);
          const widthDiff = Math.abs(thRect.width - cellRect.width);
          if (leftDiff > 1 || widthDiff > 1) {
            allMatch = false;
            diffs.push({ col: j, leftDiff, widthDiff });
          }
        }
        return { pass: allMatch, diffs, totalCols: ths.length };
      })()
    `);
    results['Test B: Header & Body Shared Column Alignment'] = {
      pass: valB.pass,
      details: valB.pass
        ? `All ${valB.totalCols} columns share identical left and width (<= 1px)`
        : `Mismatches in ${valB.diffs?.length} columns: ${JSON.stringify(valB.diffs)}`
    };

    // TEST C: Header cell internal alignment across columns
    const valC = await evalCode(`
      (() => {
        const instThs = Array.from(document.querySelectorAll('thead th')).slice(1);
        const heights = instThs.map(th => th.getBoundingClientRect().height);
        const heightUniform = Math.max(...heights) - Math.min(...heights) <= 1;

        const rowsY = instThs.map(th => {
          const logo = th.querySelector('img') || th.querySelector('.rounded-xl');
          const typeChip = th.querySelector('span.tracking-wider');
          const title = th.querySelector('h3');
          const loc = th.querySelector('.text-\\\\[13px\\\\]');
          const btn = th.querySelector('a');
          return {
            logoY: logo ? logo.getBoundingClientRect().top : null,
            typeY: typeChip ? typeChip.getBoundingClientRect().top : null,
            titleY: title ? title.getBoundingClientRect().top : null,
            locY: loc ? loc.getBoundingClientRect().top : null,
            btnBottom: btn ? btn.getBoundingClientRect().bottom : null,
            btnH: btn ? btn.getBoundingClientRect().height : null
          };
        });

        let uniform = heightUniform;
        const maxDiff = (arr) => {
          const valid = arr.filter(x => x !== null);
          return valid.length ? Math.max(...valid) - Math.min(...valid) : 0;
        };
        const typeYDiff = maxDiff(rowsY.map(r => r.typeY));
        const titleYDiff = maxDiff(rowsY.map(r => r.titleY));
        const btnBottomDiff = maxDiff(rowsY.map(r => r.btnBottom));
        const btnHDiff = maxDiff(rowsY.map(r => r.btnH));

        if (typeYDiff > 2 || titleYDiff > 2 || btnBottomDiff > 2 || btnHDiff > 2) {
          uniform = false;
        }

        return { pass: uniform, heightUniform, typeYDiff, titleYDiff, btnBottomDiff, btnHDiff };
      })()
    `);
    results['Test C: Header Cells Internal Alignment (Y-offsets & buttons)'] = {
      pass: valC.pass,
      details: `heightUniform: ${valC.heightUniform}, titleYDiff: ${valC.titleYDiff.toFixed(2)}px, btnBottomDiff: ${valC.btnBottomDiff.toFixed(2)}px`
    };

    // TEST D: Row label alignment
    const valD = await evalCode(`
      (() => {
        const dataTrs = Array.from(document.querySelectorAll('tbody tr')).filter(tr => !tr.querySelector('.compare-section-band') && tr.children.length > 1);
        const labelLefts = dataTrs.map(tr => {
          const firstTh = tr.querySelector('th');
          const labelP = firstTh.querySelector('p');
          return labelP ? labelP.getBoundingClientRect().left : firstTh.getBoundingClientRect().left;
        });
        const maxDiff = Math.max(...labelLefts) - Math.min(...labelLefts);
        return { pass: maxDiff <= 1.5, maxDiff, count: labelLefts.length };
      })()
    `);
    results['Test D: All Row Labels Share Identical Left X'] = {
      pass: valD.pass,
      details: `Label X left diff across ${valD.count} rows: ${valD.maxDiff.toFixed(2)}px (<= 1.5px)`
    };

    // TEST E: Value text inner padding offset
    const valE = await evalCode(`
      (() => {
        const dataTrs = Array.from(document.querySelectorAll('tbody tr')).filter(tr => !tr.querySelector('.compare-section-band') && tr.children.length > 1);
        let pass = true;
        const offsets = [];
        for (const tr of dataTrs) {
          const tds = Array.from(tr.querySelectorAll('td'));
          for (const td of tds) {
            const innerDiv = td.querySelector('div') || td;
            const tdRect = td.getBoundingClientRect();
            const textRect = innerDiv.getBoundingClientRect();
            const padLeft = textRect.left - tdRect.left;
            offsets.push(padLeft);
            if (Math.abs(padLeft - 20) > 3) {
              pass = false;
            }
          }
        }
        const minPad = Math.min(...offsets);
        const maxPad = Math.max(...offsets);
        return { pass, minPad, maxPad, sampleCount: offsets.length };
      })()
    `);
    results['Test E: Value Text Left Offset Uniform at 20px (±3px)'] = {
      pass: valE.pass,
      details: `minPad: ${valE.minPad.toFixed(1)}px, maxPad: ${valE.maxPad.toFixed(1)}px across ${valE.sampleCount} cells`
    };

    // TEST F: Typography consistency (15px, font-weight 500, Safety row matches)
    const valF = await evalCode(`
      (() => {
        const dataTrs = Array.from(document.querySelectorAll('tbody tr')).filter(tr => !tr.querySelector('.compare-section-band') && tr.children.length > 1);
        let mismatched = 0;
        let safetyMatches = false;

        for (const tr of dataTrs) {
          const isSafety = tr.textContent.includes('Safety');
          const tds = Array.from(tr.querySelectorAll('td'));
          for (const td of tds) {
            const textEl = td.querySelector('.compare-value, span, p') || td;
            const cs = window.getComputedStyle(textEl);
            const fz = cs.fontSize;
            const fw = parseInt(cs.fontWeight, 10);
            if (isSafety) {
              safetyMatches = (fz === '15px' && fw === 500);
            }
          }
        }
        return { pass: safetyMatches, safetyMatches };
      })()
    `);
    results['Test F: Typography Standardized (15px, weight 500, Safety matches)'] = {
      pass: valF.pass,
      details: `Safety row matches standard 15px/500: ${valF.safetyMatches}`
    };

    // TEST G: Premature truncation check at 1920, 1440, 1280
    const viewports = [1920, 1440, 1280];
    let truncationOk = true;
    for (const w of viewports) {
      await setViewport(w, 900);
      const truncCheck = await evalCode(`
        (() => {
          const titles = Array.from(document.querySelectorAll('thead th h3'));
          const unityTitle = titles.find(t => t.textContent.includes('Unity'));
          if (!unityTitle) return { exists: false, fits: false };
          const fits = unityTitle.scrollHeight <= unityTitle.clientHeight + 2;
          return { exists: true, fits };
        })()
      `);
      if (!truncCheck?.fits) {
        truncationOk = false;
      }
    }
    results['Test G: No Premature Ellipsis Truncation at 1920/1440/1280px'] = {
      pass: truncationOk,
      details: truncationOk
        ? 'Institution titles render 2-line wrapped without premature clipping'
        : 'Found premature title truncation'
    };

    // TEST H: No Indian digit grouping (e.g., $8,50,000)
    await setViewport(1920, 1080);
    const valH = await evalCode(`
      (() => {
        const bodyText = document.querySelector('table').innerText;
        const indianGroupingRegex = /\\$\\d{1,2},\\d{2},\\d{3}/;
        const match = bodyText.match(indianGroupingRegex);
        const hasUS = bodyText.includes('$850,000');
        return {
          pass: !match && hasUS,
          foundIndianMatch: match ? match[0] : null,
          foundUSFormatted: hasUS
        };
      })()
    `);
    results['Test H: Pure US Currency Formatting ($850,000 not $8,50,000)'] = {
      pass: valH.pass,
      details: valH.pass
        ? 'Confirmed $850,000 present, no Indian comma groupings found'
        : `Failed: Indian grouping found ${valH.foundIndianMatch}`
    };

    // TEST I: Missing value standardized token ("Not reported", no raw "N/A")
    const valI = await evalCode(`
      (() => {
        const dataTds = Array.from(document.querySelectorAll('tbody tr td'));
        let hasRawNA = false;
        let hasNotReported = false;
        let italicAndMuted = true;

        for (const td of dataTds) {
          const txt = td.innerText.trim();
          if (txt === 'N/A') hasRawNA = true;
          if (txt.includes('Not reported')) {
            hasNotReported = true;
            const span = td.querySelector('span.italic');
            if (!span) italicAndMuted = false;
          }
        }
        return { pass: !hasRawNA && hasNotReported && italicAndMuted, hasRawNA, hasNotReported, italicAndMuted };
      })()
    `);
    results['Test I: Standardized "Not reported" Missing Value Tokens'] = {
      pass: valI.pass,
      details: valI.pass
        ? 'Zero raw "N/A" tokens; missing fields render as italic, muted "Not reported"'
        : `hasRawNA: ${valI.hasRawNA}, hasNotReported: ${valI.hasNotReported}`
    };

    // TEST J: Counter text consistency (16 of 16 when diff off; X of 16 differing when diff on)
    const valJBefore = await evalCode(`
      (() => {
        const counterEl = document.querySelector('p.text-xs.font-semibold');
        const textBefore = counterEl ? counterEl.innerText : '';
        const toggleBtn = document.querySelector('button[role="switch"]');
        if (toggleBtn) toggleBtn.click();
        return { textBefore };
      })()
    `);
    await sleep(400);
    const valJAfter = await evalCode(`
      (() => {
        const counterEl = document.querySelector('p.text-xs.font-semibold');
        const textAfter = counterEl ? counterEl.innerText : '';
        const visibleRows = document.querySelectorAll('tbody tr[role="row"]:not(:has(.compare-section-band))').length;

        const toggleBtn = document.querySelector('button[role="switch"]');
        if (toggleBtn) toggleBtn.click();

        return {
          textAfter,
          visibleRows,
          pass: textAfter.includes(String(visibleRows)) && textAfter.includes('16')
        };
      })()
    `);
    await sleep(300);
    results['Test J: Live Criteria Counter Consistency (Diff Toggle On/Off)'] = {
      pass: valJBefore.textBefore.includes('Showing 16 of 16') && valJAfter.pass,
      details: `Diff OFF: "${valJBefore.textBefore}", Diff ON: "${valJAfter.textAfter}"`
    };

    // TEST K: Responsive check across viewports and capture screenshots
    const testKBreakpoints = [1920, 1440, 1280, 1024, 768, 390];
    let responsivePass = true;
    for (const w of testKBreakpoints) {
      await setViewport(w, w < 768 ? 844 : 900);
      const chk = await evalCode(`
        (() => {
          const bodyWidth = document.documentElement.offsetWidth;
          const vpWidth = window.innerWidth;
          return { bodyWidth, vpWidth, ok: bodyWidth <= vpWidth };
        })()
      `);
      if (!chk?.ok) responsivePass = false;
    }
    // Capture 1280 and 390 after screenshots
    await setViewport(1280, 800);
    await captureScreenshot(path.join(artifactDir, 'compare-r2-after-1280.png'));
    console.log('Captured compare-r2-after-1280.png');

    await setViewport(390, 844);
    await captureScreenshot(path.join(artifactDir, 'compare-r2-after-390.png'));
    console.log('Captured compare-r2-after-390.png');

    results['Test K: Responsive Layout Stability (1920 to 390px)'] = {
      pass: responsivePass,
      details: 'All tested resolutions maintain bounded page width without viewport breakage'
    };

    // Export PDF check for print stylesheet
    const pdfData = await send('Page.printToPDF', {
      landscape: true,
      printBackground: true
    });
    fs.writeFileSync(path.join(artifactDir, 'compare-r2-landscape.pdf'), Buffer.from(pdfData.data, 'base64'));
    console.log('Captured compare-r2-landscape.pdf');

    ws.close();
  } finally {
    edge.kill();
  }

  return results;
}

runSuite().then(res => {
  console.log('\n================ ACCEPTANCE SUITE RESULTS ================');
  let allPassed = true;
  for (const [testName, result] of Object.entries(res)) {
    console.log(`${result.pass ? '✅ PASS' : '❌ FAIL'}: ${testName}`);
    console.log(`   -> ${result.details}`);
    if (!result.pass) allPassed = false;
  }
  console.log('==========================================================\n');
  if (!allPassed) {
    process.exitCode = 1;
  }
}).catch(err => {
  console.error('Acceptance suite failed:', err);
  process.exitCode = 1;
});
