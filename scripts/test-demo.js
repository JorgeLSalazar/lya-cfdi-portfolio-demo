const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const ExcelJS = require('exceljs');
const JSZip = require('jszip');
const { CLIENTES } = require('../src/clientProfiles');

async function run() {
  const port = 3187;
  const server = spawn(process.execPath, ['server.js'], {
    cwd: path.join(__dirname, '..'), env: { ...process.env, PORT: String(port) }, stdio: 'pipe'
  });
  let logs = '';
  server.stderr.on('data', data => { logs += data; });
  try {
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let i = 0; i < 50; i++) {
      if (server.exitCode !== null) throw new Error(logs || 'El servidor no arrancó.');
      try { ready = (await fetch(base)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'El servidor debe responder.');
    async function processDemo(cliente = 'perfil_demo_08', modo = 'mensual', zipMode = false, duplicate = false, custom = false) {
      const form = new FormData();
      for (const type of ['emitidas', 'recibidas']) {
        const dir = path.join(__dirname, '..', 'examples', type);
        const zip = new JSZip();
        for (const name of fs.readdirSync(dir)) {
          const data = fs.readFileSync(path.join(dir, name));
          if (zipMode) zip.file(name, data);
          else form.append(type, new Blob([data]), name);
          if (duplicate && type === 'emitidas') form.append(type, new Blob([data]), 'duplicado.xml');
        }
        if (zipMode) form.append(type, new Blob([await zip.generateAsync({ type: 'nodebuffer' })]), `${type}.zip`);
      }
      for (const [key, value] of Object.entries({ cliente, modo, anio: '2026', mes: '1', trimestre: '1', modoCedula: custom ? 'personalizada' : 'clientes', columnasEmitidas: '["ingresos","iva16","total"]', columnasRecibidas: '["egresos","iva","total"]' })) form.append(key, value);
      const res = await fetch(`${base}/api/procesar`, { method: 'POST', body: form });
      const report = await res.json();
      assert.equal(res.status, 200, JSON.stringify(report));
      assert.equal(report.emitidas.filas.length, 1);
      assert.equal(report.recibidas.filas.length, 2);
      return report;
    }
    const report = await processDemo();
    assert.equal(report.cliente.nombre, 'Empresa Demostración');
    assert.equal(report.emitidas.totales[3], 1000);
    assert.equal(report.emitidas.totales[5], 160);
    assert.equal(report.emitidas.totales[6], 1160);
    assert.equal(report.recibidas.totales[7], 16);
    assert.equal(report.recibidas.totales[8], 80);
    assert.equal(report.recibidas.totales[10], 796);
    async function exportReport(value) {
      const res = await fetch(`${base}/api/exportar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
      assert.equal(res.status, 200);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(Buffer.from(await res.arrayBuffer()));
      assert.ok(workbook.worksheets.length > 0);
      const cells = [];
      workbook.eachSheet(sheet => sheet.eachRow(row => row.eachCell(cell => cells.push(String(cell.value)))));
      assert.ok(cells.includes('Empresa Demostración'), 'El Excel debe contener el cliente ficticio.');
      return workbook;
    }
    await exportReport(report);
    await processDemo('perfil_demo_08', 'mensual', true);
    await processDemo('perfil_demo_08', 'mensual', false, true);
    for (const mode of ['auto', 'trimestral', 'anual']) await exportReport(await processDemo('perfil_demo_08', mode));
    for (const client of Object.keys(CLIENTES)) await exportReport(await processDemo(client));
    await exportReport(await processDemo('perfil_demo_08', 'mensual', false, false, true));
    console.log('OK: servidor, XML, ZIP, duplicados, importes esperados, 4 periodos, 18 perfiles, cédula personalizada y lectura de Excel.');
  } finally { server.kill(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
