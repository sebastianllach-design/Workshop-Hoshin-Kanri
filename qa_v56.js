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

async function checkDeletionBatches() {
  const match = facilitatorJs.match(/async function deleteDocumentRefs\(refs\)\{[\s\S]*?(?=\nasync function deleteSession)/);
  assert(match, 'No se encontró la función de borrado por lotes.');
  const commits = [];
  const db = { batch() { const deleted = []; return { delete(ref) { deleted.push(ref.id); }, async commit() { commits.push(deleted); } }; } };
  const refs = Array.from({ length: 805 }, (_, id) => ({ id }));
  const context = { db, refs };
  vm.createContext(context);
  vm.runInContext(match[0], context);
  await vm.runInContext('deleteDocumentRefs(refs)', context);
  assert(commits.length === 3, `Borrado: se esperaban 3 lotes y se obtuvieron ${commits.length}.`);
  assert(commits[0].length === 400 && commits[1].length === 400 && commits[2].length === 5, 'Borrado: tamaño de lotes inesperado.');
  assert(commits.flat().every((id, index) => id === index), 'Borrado: se alteró el orden o se perdió una referencia.');
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
  return vm.runInContext("({demos:['funcional','tension','alineada'].map(kind=>{const meta=demoMeta(kind);return {name:meta.team.name,total:meta.total}}).sort((a,b)=>b.total-a.total),legacy:normalizeEvaluation({means:3,interdep:4,catchball:3,defense:3,comment:'Anterior'})})", context);
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
  const required = ['index.html','facilitator.html','cloud-sync.js','facilitator.js','firebase-config.js','firestore.rules','firestore.indexes.json','firebase.json','SETUP-FIREBASE.md','ARQUITECTURA-MULTIEQUIPO-v56.md','CHANGELOG-v56.md','INSTRUCCIONES-PUBLICACION-v56.md','PRUEBAS-v56.md','README.md','VERSION.txt'];
  required.forEach(file => assert(fs.existsSync(path.join(root, file)), `Falta ${file}.`));

  assert(html.includes('<meta name="application-version" content="v56">'), 'Falta metadato v56.');
  assert(html.includes("const APP_VERSION='v56'"), 'Falta APP_VERSION v56.');
  assert(facilitatorHtml.includes('<meta name="application-version" content="v56">'), 'Falta metadato v56 en el panel.');
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
  assert(facilitatorJs.includes('type="number" min="1" max="10" step="0.1"'), 'Falta el campo único de nota 1 a 10.');
  assert(!facilitatorJs.includes('function evalInput'), 'Continúan los cuatro campos numéricos anteriores.');
  ['Fines–medios','Interdependencias','Catchball','Defensa'].forEach(label=>assert(facilitatorJs.includes(label), `Falta la guía de diálogo: ${label}.`));
  assert(facilitatorJs.includes("e.score<1||e.score>10"), 'Falta validar la nota obligatoria antes de finalizar.');
  assert(facilitatorJs.includes("b.total-a.total||b.panelScore-a.panelScore||b.auto-a.auto"), 'Falta la regla de desempate por nota del Panel.');
  assert(facilitatorHtml.includes('<th>Nota del Panel</th>') && html.includes('<th>Nota del Panel</th>'), 'El ranking no muestra la nota del Panel.');
  assert(facilitatorHtml.includes('id="deleteSessionBtn"') && facilitatorJs.includes("$('deleteSessionBtn').onclick=deleteSession"), 'Falta el control para eliminar experiencias.');
  assert(facilitatorJs.includes('session.facilitatorUid!==user.uid'), 'La eliminación no valida que la experiencia pertenezca al facilitador conectado.');
  assert(facilitatorJs.includes('typed.trim().toUpperCase()!==code'), 'Falta la confirmación mediante el código de la experiencia.');
  assert(facilitatorJs.includes("update({status:'closed'") && facilitatorJs.includes("get({source:'server'})"), 'Faltan el cierre preventivo o la lectura completa desde el servidor.');
  assert(facilitatorJs.includes("collections=['teams','teamSecrets','members','public']"), 'La eliminación no contempla todas las subcolecciones conocidas.');
  assert(facilitatorJs.includes('i+=400') && facilitatorJs.includes('[...childRefs,db.doc(base)]'), 'El borrado por lotes o el orden del documento principal no es seguro.');
  assert(facilitatorJs.includes('deletingSessionId'), 'Falta el bloqueo contra eliminaciones duplicadas.');
  assert(cloudSync.includes('${panelScore(r)}/10'), 'La publicación para participantes no muestra la nota sobre 10.');
  assert(cloudSync.includes('signInAnonymously') && cloudSync.includes('queueSave'), 'Faltan autenticación anónima o guardado remoto.');
  assert(rules.includes("role == 'facilitator'"), 'Las reglas no validan el rol facilitador.');
  assert(rules.includes("memberTeam(workshopId) == teamId"), 'Las reglas no aíslan equipos.');
  assert(rules.includes("resource.data.locked != true"), 'Las reglas no respetan el bloqueo de edición.');

  duplicateIds(html, 'index.html');
  duplicateIds(facilitatorHtml, 'facilitator.html');
  checkSyntax(cloudSync, 'cloud-sync.js');
  checkSyntax(facilitatorJs, 'facilitator.js');

  const evaluation = evaluateDemoResults();
  const demos = evaluation.demos;
  assert(evaluation.legacy.score === 6.5 && evaluation.legacy.completed === true, 'La migración de evaluaciones v54 no conserva su equivalencia.');
  assert(demos[0].name === 'Demo 3 · Sistema alineado', `Ganador demo inesperado: ${demos[0].name}.`);
  assert(demos[0].total === 94 && demos[1].total === 67 && demos[2].total === 28, 'Los ejemplos no reflejan la ponderación 50/50.');

  await checkDeletionBatches();

  const browser = await browserChecks();
  console.log(JSON.stringify({
    status: 'OK',
    version: 'v56',
    demos,
    browser,
    checks: [
      'Acceso de equipos y facilitador',
      'Sintaxis de módulos remotos',
      'Aislamiento y bloqueo en reglas',
      'Fórmula final 50/50',
      'Nota única obligatoria de 1 a 10',
      'Cuatro criterios como diálogo y migración v54',
      'Eliminación segura y completa de experiencias',
      'Ejemplos 94/67/28 recalculados',
      'Identidad Deportes Andina e introducción metodológica',
      'Temporizador compartido y podio con pendientes',
      'IDs HTML únicos',
      'Archivos de configuración y documentación completos'
    ]
  }, null, 2));
}

main().catch(error => { console.error(error.stack || error.message); process.exit(1); });
