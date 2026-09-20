const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const htmlPath = path.join(root, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const facilitatorHtml = fs.readFileSync(path.join(root, 'facilitator.html'), 'utf8');
const cloudSync = fs.readFileSync(path.join(root, 'cloud-sync.js'), 'utf8');
const facilitatorJs = fs.readFileSync(path.join(root, 'facilitator.js'), 'utf8');
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function duplicateIds(source, label) {
  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  assert(!duplicates.length, `${label}: IDs duplicados: ${duplicates.join(', ')}`);
}

function checkSyntax(source, filename) {
  new vm.Script(source, { filename });
}

function evaluateDemoResults() {
  let source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  source = source.replace(/syncTeams\(\);loadInputs\(\);updateAll\(\);initFoldMasterButtons\(\);[\s\S]*$/, '');
  const dummy = new Proxy({
    dataset: {}, style: {}, value: '', textContent: '', id: '',
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, addEventListener() {}, querySelector() { return dummy; }, querySelectorAll() { return []; }
  }, { get(target, key) { return key in target ? target[key] : ''; }, set(target, key, value) { target[key] = value; return true; } });
  const memory = new Map();
  const localStorage = { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key), clear: () => memory.clear() };
  const document = { documentElement: { dataset: {} }, body: dummy, querySelector: () => dummy, querySelectorAll: () => [], getElementById: () => dummy, addEventListener() {}, createElement: () => dummy };
  const context = { console, document, window: { addEventListener() {} }, localStorage, setTimeout, clearTimeout, Date, Math, JSON, Intl, teamSelect: dummy, teamName: dummy, mgr_speech: dummy, speechCounter: dummy, prompt: () => null };
  vm.createContext(context);
  vm.runInContext(source, context, { timeout: 5000 });
  return vm.runInContext("['funcional','tension','alineada'].map(kind=>{const meta=demoMeta(kind);return {name:meta.team.name,total:meta.total}}).sort((a,b)=>b.total-a.total)", context);
}

async function browserChecks() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (_error) { return { status: 'omitido', reason: 'Playwright no instalado' }; }
  let browser;
  try { browser = await chromium.launch({ headless: true }); }
  catch (error) { return { status: 'omitido', reason: String(error.message).split('\n')[0] }; }
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'domcontentloaded' });
    assert(await page.locator('#accessGate').isVisible(), 'La portada de acceso no es visible.');
    await page.locator('#openDemoMode').click();
    await page.waitForTimeout(100);
    if (await page.locator('#onboardingBg').isVisible()) await page.locator('#onboardingBg').getByRole('button', { name: 'Comenzar' }).click();
    if (await page.locator('#modalBg').isVisible()) await page.getByRole('button', { name: 'Entendido' }).click();
    await page.locator('button[data-target="evaluacion"]').click();
    const rows = await page.locator('#evalRows tr').count();
    assert(rows === 3, `Modo demo: se esperaban 3 filas y se obtuvieron ${rows}.`);
    const winner = (await page.locator('#winnerSpotlight .winner-name').textContent()).trim();
    assert(winner === 'Sistema alineado', `Ganador demo inesperado: ${winner}.`);
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.locator('#winnerSpotlight').isVisible(), 'El podio no es visible en móvil.');
    return { status: 'OK', rows, winner };
  } finally { await browser.close(); }
}

async function main() {
  const required = ['index.html','facilitator.html','cloud-sync.js','facilitator.js','firebase-config.js','firestore.rules','firestore.indexes.json','firebase.json','SETUP-FIREBASE.md','ARQUITECTURA-MULTIEQUIPO-v54.md','README.md','VERSION.txt'];
  required.forEach(file => assert(fs.existsSync(path.join(root, file)), `Falta ${file}.`));

  assert(html.includes('<meta name="application-version" content="v54">'), 'Falta metadato v54.');
  assert(html.includes("const APP_VERSION='v54'"), 'Falta APP_VERSION v54.');
  assert(html.includes('id="teamAccessForm"'), 'Falta acceso por equipo.');
  assert(html.includes('facilitator.html'), 'Falta acceso al panel del facilitador.');
  assert(html.includes('c.auto*.5+defenseScore*.5'), 'Falta la fórmula final 50/50.');
  assert(html.includes('18 Story Points'), 'Falta referencia a 18 Story Points.');
  assert(html.includes('DEPORTES ANDINA') && html.includes('Retail deportivo'), 'Falta la identidad Deportes Andina.');
  assert(html.includes('Cómo funciona la dinámica') && html.includes('Catchball'), 'Falta la introducción metodológica.');
  assert(html.includes('id="liveTimer"') && facilitatorHtml.includes('id="timerStart"'), 'Falta el temporizador compartido.');
  assert(!html.includes('section id="a3"') && !html.includes('Proyectos A3'), 'La hoja A3 continúa visible.');
  assert(!html.includes('<div class="system-kpi"><b>Índice de equilibrio</b>'), 'El equilibrio continúa visible durante la selección.');
  assert(facilitatorHtml.includes('Seguimiento multiequipo'), 'Falta el panel multiequipo.');
  assert(facilitatorJs.includes('publishRanking') && facilitatorJs.includes('toggleLock') && facilitatorJs.includes('finalizeEvaluation'), 'Faltan controles del facilitador.');
  assert(facilitatorJs.includes("b.total-a.total||b.defenseScore-a.defenseScore||b.auto-a.auto"), 'Falta la regla de desempate.');
  assert(cloudSync.includes('signInAnonymously') && cloudSync.includes('queueSave'), 'Faltan autenticación anónima o guardado remoto.');
  assert(rules.includes("role == 'facilitator'"), 'Las reglas no validan el rol facilitador.');
  assert(rules.includes("memberTeam(workshopId) == teamId"), 'Las reglas no aíslan equipos.');
  assert(rules.includes("resource.data.locked != true"), 'Las reglas no respetan el bloqueo de edición.');

  duplicateIds(html, 'index.html');
  duplicateIds(facilitatorHtml, 'facilitator.html');
  checkSyntax(cloudSync, 'cloud-sync.js');
  checkSyntax(facilitatorJs, 'facilitator.js');

  const demos = evaluateDemoResults();
  assert(demos[0].name === 'Demo 3 · Sistema alineado', `Ganador demo inesperado: ${demos[0].name}.`);
  assert(demos[0].total === 94 && demos[1].total === 67 && demos[2].total === 28, 'Los ejemplos no reflejan la ponderación 50/50.');

  const browser = await browserChecks();
  console.log(JSON.stringify({
    status: 'OK',
    version: 'v54',
    demos,
    browser,
    checks: [
      'Acceso de equipos y facilitador',
      'Sintaxis de módulos remotos',
      'Aislamiento y bloqueo en reglas',
      'Fórmula final 50/50',
      'Ejemplos 94/67/28 recalculados',
      'Identidad Deportes Andina e introducción metodológica',
      'Temporizador compartido y podio con pendientes',
      'IDs HTML únicos',
      'Archivos de configuración y documentación completos'
    ]
  }, null, 2));
}

main().catch(error => { console.error(error.stack || error.message); process.exit(1); });
