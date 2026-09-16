const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { chromium } = require('playwright');

const root = __dirname;
const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function evaluateDemoResults() {
  let source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  source = source.replace(/syncTeams\(\);loadInputs\(\);updateAll\(\);initFoldMasterButtons\(\);\s*$/, '');
  const dummy = new Proxy({
    dataset: {}, style: {}, value: '', textContent: '',
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, addEventListener() {}, querySelector() { return dummy; }, querySelectorAll() { return []; }
  }, { get(target, key) { return key in target ? target[key] : ''; }, set(target, key, value) { target[key] = value; return true; } });
  const memory = new Map();
  const localStorage = { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value), clear: () => memory.clear() };
  const document = { documentElement: { dataset: {} }, body: dummy, querySelector: () => dummy, querySelectorAll: () => [], getElementById: () => dummy, addEventListener() {}, createElement: () => dummy };
  const context = { console, document, window: { addEventListener() {} }, localStorage, setTimeout, clearTimeout, Date, Math, JSON, Intl, teamSelect: dummy, teamName: dummy, mgr_speech: dummy, speechCounter: dummy, prompt: () => null };
  vm.createContext(context);
  vm.runInContext(source, context, { timeout: 5000 });
  return vm.runInContext("['funcional','tension','alineada'].map(kind=>{const meta=demoMeta(kind);return {name:meta.team.name,total:meta.total}}).sort((a,b)=>b.total-a.total)", context);
}

async function main() {
  assert(html.includes('<meta name="application-version" content="v52">'), 'Falta el metadato v52.');
  assert(html.includes("const APP_VERSION='v52'"), 'Falta APP_VERSION v52.');
  assert(html.includes('Evaluación final y podio'), 'Falta el título final de podio.');
  assert(html.includes("loadAllDemoExamples('evaluacion')"), 'Falta el acceso directo a los tres ejemplos.');
  assert(html.includes('c.auto*.6+human'), 'La fórmula vigente del total no está presente.');
  assert(!html.includes('id="ranking"'), 'La vista duplicada del ranking sigue presente.');
  assert(html.includes('podium-1') && html.includes('podium-2') && html.includes('podium-3'), 'Faltan estilos o asignaciones del podio.');
  assert(html.includes(".sort((a,b)=>b.total-a.total"), 'Falta el orden descendente por resultado total.');

  const demoResults = evaluateDemoResults();
  assert(demoResults[0].name === 'Demo 3 · Sistema alineado', `Ganador de ejemplos inesperado: ${demoResults[0].name}.`);
  assert(demoResults[0].total === 93 && demoResults[1].total === 67 && demoResults[2].total === 29, 'Los resultados esperados de los ejemplos cambiaron.');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (error) {
    if (/Executable doesn't exist/.test(String(error))) {
      console.log(JSON.stringify({
        status: 'OK con validación lógica y estática',
        browser: 'Omitido: el ejecutable Chromium no está instalado en este entorno.',
        demoResults,
        checks: [
          'Versión v52 consistente',
          'Título y acceso directo al podio presentes',
          'Fórmula 60/40 preservada',
          'Ranking duplicado eliminado',
          'Clases visuales de los tres puestos presentes'
        ]
      }, null, 2));
      return;
    }
    throw error;
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(`file://${htmlPath}`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('button[data-target="evaluacion"]').click();
  await page.getByRole('button', { name: 'Cargar los 3 ejemplos' }).click();
  await page.getByRole('button', { name: 'Entendido' }).click();

  const rows = await page.locator('#evalRows tr').evaluateAll(elements => elements.map(row => ({
    className: row.className,
    position: row.children[0]?.textContent.trim(),
    team: row.children[1]?.querySelector('b')?.textContent.trim(),
    total: Number(row.children[11]?.textContent.trim())
  })));
  const winner = await page.locator('#winnerSpotlight .winner-name').textContent();

  assert(rows.length === 3, `Se esperaban exactamente los tres ejemplos; se obtuvieron ${rows.length}.`);
  assert(rows[0].team === 'Sistema alineado', `Ganador inesperado: ${rows[0].team}.`);
  assert(winner.trim() === rows[0].team, 'La cabecera de ganador no coincide con la primera fila.');
  assert(rows[0].className.includes('podium-1'), 'El primer puesto no tiene estilo de podio.');
  assert(rows[1].className.includes('podium-2'), 'El segundo puesto no tiene estilo de podio.');
  assert(rows[2].className.includes('podium-3'), 'El tercer puesto no tiene estilo de podio.');
  assert(rows.slice(1).every((row, index) => rows[index].total >= row.total), 'La tabla no está ordenada de mayor a menor.');

  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.locator('#winnerSpotlight').isVisible(), 'La cabecera del ganador no es visible en móvil.');
  assert(await page.locator('.eval-table').isVisible(), 'La tabla final no es visible en móvil.');

  await browser.close();
  console.log(JSON.stringify({ status: 'OK', winner: winner.trim(), demoResults, rows }, null, 2));
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
