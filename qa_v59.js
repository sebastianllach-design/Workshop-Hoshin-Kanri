const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { webcrypto } = require('crypto');

const root = __dirname;
const previousRoot = path.join(root, '..', 'Workshop-Hoshin-Kanri-v58-Deportes-Andina');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const facilitatorHtml = read('facilitator.html');
const cloudSync = read('cloud-sync.js');
const facilitatorJs = read('facilitator.js');
const rules = read('firestore.rules');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function duplicateIds(source, label) {
  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert(!duplicates.length, `${label}: IDs duplicados: ${duplicates.join(', ')}`);
}

function checkSyntax(source, filename) {
  new vm.Script(source, { filename });
}

function inlineScript(source) {
  const matches = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert(matches.length, 'No se encontró el script principal de index.html.');
  return matches[matches.length - 1][1];
}

function makeDummy() {
  const base = {
    dataset: {}, style: {}, value: '', textContent: '', innerHTML: '', id: '', hidden: false,
    disabled: false, open: true, options: [], tagName: 'DIV', previousElementSibling: null,
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    setAttribute() {}, removeAttribute() {}, addEventListener() {}, prepend() {}, append() {},
    querySelector() { return null; }, querySelectorAll() { return []; }, closest() { return null; },
    focus() {}
  };
  return new Proxy(base, {
    get(target, key) { return key in target ? target[key] : undefined; },
    set(target, key, value) { target[key] = value; return true; }
  });
}

function indexContext() {
  const dummy = makeDummy();
  const memory = new Map();
  const localStorage = {
    getItem: key => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value),
    removeItem: key => memory.delete(key),
    clear: () => memory.clear()
  };
  const document = {
    documentElement: { dataset: {} }, body: dummy, activeElement: null,
    querySelector: () => dummy, querySelectorAll: () => [], getElementById: () => dummy,
    addEventListener() {}, createElement: () => makeDummy()
  };
  const window = { addEventListener() {}, HoshinCloud: { isLiveTeam: () => true, isApplyingRemote: () => false, queueSave() {}, flush: async () => true, localStorageKey: () => 'qa_v59_state', renderParticipantRanking() {}, noteSection() {} } };
  const context = {
    console, document, window, localStorage, sessionStorage: localStorage,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    Date, Math, JSON, Intl, URL, crypto: webcrypto, TextEncoder,
    teamSelect: dummy, teamName: dummy, mgr_speech: dummy, speechCounter: dummy,
    mgr_problem: dummy, mgr_hypothesis: dummy, mgr_portfolio: dummy, mgr_conditions: dummy,
    preliminaryCounter: dummy, modalTitle: dummy, modalText: dummy, modalBg: dummy,
    customModalBg: dummy, customModalContent: dummy, assignedRoleGrid: dummy,
    qCounter: dummy, qBank: dummy, qPending: dummy, qConsultBtn: dummy, qLog: dummy,
    varRows: dummy, alerts: dummy, matrixPrompts: dummy, unlockedHints: dummy,
    report: dummy, r1Text: dummy, winnerSpotlight: dummy, evalRows: dummy,
    ventasValue: dummy, ventasPct: dummy, ventasBar: dummy, costosValue: dummy,
    costosPct: dummy, costosBar: dummy, personasValue: dummy, personasPct: dummy,
    personasBar: dummy, spValue: dummy, interValue: dummy, balanceValue: dummy,
    homeVentas: dummy, homeCostos: dummy, homePersonas: dummy, homeBalance: dummy,
    homeSP: dummy, roleAssignmentStatus: dummy, prompt: () => null,
    confirm: () => true, alert() {}
  };
  vm.createContext(context);
  let source = inlineScript(html);
  source = source.replace(/syncTeams\(\);loadInputs\(\);updateAll\(\);initFoldMasterButtons\(\);[\s\S]*$/, '');
  vm.runInContext(source, context, { timeout: 8000, filename: 'index-inline.js' });
  vm.runInContext('updateAll()', context, { timeout: 8000, filename: 'index-runtime-smoke.js' });
  return context;
}

function facilitatorContext() {
  const dummy = makeDummy();
  const document = { getElementById: () => dummy, querySelectorAll: () => [] };
  const window = { HOSHIN_FIREBASE_CONFIG: null };
  const context = {
    console, document, window, crypto: webcrypto, TextEncoder, URL, Blob,
    Date, Math, JSON, Intl, setInterval: () => 0, clearInterval() {},
    setTimeout: () => 0, alert() {}, confirm: () => true, prompt: () => null,
    navigator: { clipboard: { writeText: async () => {} } }, location: { href: 'http://localhost/facilitator.html' }
  };
  vm.createContext(context);
  const replacement = "window.__QA__={evaluation,result,rank,stageStateLabel,currentTimer,startStage,endStage,enableNextStage,setReopen,setContext:(session,nextTeams=[])=>{activeSession=session;teams=nextTeams},setDb:value=>{db=value}};";
  const source = facilitatorJs.replace(/window\.Facilitator=\{[\s\S]*?\};\s*init\(\);renderExposure\(\);/, replacement);
  assert(source.includes('window.__QA__'), 'No se pudo preparar el arnés del facilitador.');
  vm.runInContext(source, context, { timeout: 5000, filename: 'facilitator.js' });
  return context;
}

function extractBaseVariables(source) {
  const match = source.match(/const BASE_VARS=(\[[\s\S]*?\]);\nconst KEY=/);
  assert(match, 'No se pudo extraer BASE_VARS.');
  return JSON.parse(match[1]);
}

function extractBlock(source, start, end) {
  const from = source.indexOf(start), to = source.indexOf(end, from);
  assert(from >= 0 && to > from, `No se pudo comparar el bloque ${start}.`);
  return source.slice(from, to).replace(/\s+/g, ' ').trim();
}

function preservedModelChecks() {
  assert(fs.existsSync(previousRoot), 'No se encontró la carpeta v58 para la comparación de preservación.');
  const oldHtml = fs.readFileSync(path.join(previousRoot, 'index.html'), 'utf8');
  const oldVariables = extractBaseVariables(oldHtml);
  const newVariables = extractBaseVariables(html);
  const invariant = variable => ({id:variable.id,name:variable.name,owner:variable.owner,difficulty:variable.difficulty,interdep:variable.interdep,sp:variable.sp,profile:variable.profile,topics:variable.topics,impact:variable.impact});
  assert(JSON.stringify(newVariables.map(invariant)) === JSON.stringify(oldVariables.map(invariant)), 'Cambió el banco, los impactos o los Story Points de variables existentes.');
  assert(extractBlock(html, 'const TARGETS=', 'const ROLES=') === extractBlock(oldHtml, 'const TARGETS=', 'const ROLES='), 'Cambiaron objetivos, escalas o parámetros cuantitativos.');
  assert(extractBlock(html, 'const QUESTION_BANK=', 'let pendingQuestionId=') === extractBlock(oldHtml, 'const QUESTION_BANK=', 'let pendingQuestionId='), 'Cambió el banco de consultas o sus respuestas.');
  assert(extractBlock(html, 'function calc(', 'function interdepLabel(') === extractBlock(oldHtml, 'function calc(', 'function interdepLabel('), 'Cambió la fórmula del Score automático.');
}

async function participantLogicChecks(context) {
  const result = vm.runInContext(`(() => {
    const run = (control, section) => { participantStageControl=control; return isSectionInteractionLocked(section); };
    const running={sectionId:'preguntas',activeIndex:1,maxVisibleIndex:1,status:'running',expired:false,globalLocked:false,reopenedStages:[]};
    const ended={...running,status:'ended',expired:true};
    const later={sectionId:'despliegue',activeIndex:2,maxVisibleIndex:2,status:'running',expired:false,globalLocked:false,reopenedStages:['preguntas']};
    const paused={...later,globalLocked:true};
    const a=classifyCustomVariable('Optimizar horarios según tráfico','Ajustar turnos y cobertura usando tráfico histórico para reducir tiempos improductivos.');
    const b=classifyCustomVariable('Alinear turnos con el tráfico','Modificar horarios y dotación según el tráfico para mejorar cobertura y productividad.');
    const demos=['funcional','tension','alineada'].map(kind=>{const meta=demoMeta(kind);return {name:meta.team.name,total:meta.total,sp:meta.sp};}).sort((x,y)=>y.total-x.total);
    return {
      running:{current:run(running,'preguntas'),previous:run(running,'caso'),future:run(running,'despliegue')},
      ended:run(ended,'preguntas'),reopened:run(later,'preguntas'),pausedReopen:run(paused,'preguntas'),
      customA:{impact:a.impact,sp:a.sp,difficulty:a.difficulty,interdep:a.interdep},
      customB:{impact:b.impact,sp:b.sp,difficulty:b.difficulty,interdep:b.interdep},
      demos,legacy:normalizeEvaluation({means:3,interdep:4,catchball:3,defense:3})
    };
  })()`, context);
  assert(result.running.current === false, 'La Hoja 2 en curso quedó bloqueada.');
  assert(result.running.previous === true, 'La hoja anterior no quedó en solo lectura.');
  assert(result.running.future === true, 'La hoja futura quedó editable.');
  assert(result.ended === true, 'La etapa vencida no quedó bloqueada.');
  assert(result.reopened === false, 'La reapertura excepcional no devolvió la edición.');
  assert(result.pausedReopen === true, 'La reapertura ignoró la pausa global.');
  assert(JSON.stringify(result.customA) === JSON.stringify(result.customB), 'Formulaciones semánticamente equivalentes recibieron parámetros distintos.');
  assert(result.customA.sp >= 1 && result.customA.sp <= 5, 'Variable propia fuera del rango de Story Points.');
  assert(Object.values(result.customA.impact).every(value => value >= -4 && value <= 4), 'Variable propia fuera del rango de impactos.');
  assert(result.legacy.score === 6.5 && result.legacy.completed === true, 'La migración de evaluación histórica falló.');
  assert(result.demos[0].total === 94 && result.demos[1].total === 67 && result.demos[2].total === 28, 'Los ejemplos cambiaron su resultado 94/67/28.');
  const generation = await vm.runInContext(`(async()=>{participantStageControl={sectionId:'despliegue',activeIndex:2,maxVisibleIndex:2,status:'ended',expired:true,globalLocked:false,reopenedStages:[]};const ok=await generateDirectorReport();return {ok,status:team().reportStatus,ready:cloudProgress(team()).presentationReady,hasSnapshot:!!team().round1};})()`, context);
  assert(generation.ok && generation.status === 'prepared' && generation.ready && generation.hasSnapshot, 'El cierre de Hoja 3 no preparó y confirmó el snapshot.');
  result.generation = generation;
  return result;
}

async function facilitatorLogicChecks(context) {
  const result = vm.runInContext(`(() => {
    const qa=window.__QA__;
    const statuses=['ready','running','ended'].map(status=>{qa.setContext({timer:{sheetId:'preguntas',stageIndex:1,stageLabel:'Hoja 2',status,durationSec:1200,remainingSec:1200}},[]);return qa.stageStateLabel(1);});
    const rows=qa.rank([
      {id:'a',name:'A',total:70,panelScore:7,auto:70},
      {id:'b',name:'B',total:70,panelScore:8,auto:60},
      {id:'c',name:'C',total:null,panelScore:0,auto:90}
    ]);
    return {statuses,rows,evaluation:qa.evaluation({score:7.5,completed:true})};
  })()`, context);
  assert(JSON.stringify(result.statuses) === JSON.stringify(['Habilitada, sin iniciar','En curso','Tiempo finalizado']), 'Los estados visibles no siguen la máquina prevista.');
  assert(result.rows[0].name === 'B' && result.rows[0].position === 1, 'El ranking no desempata por nota del Directorio.');
  assert(result.rows[2].total === null, 'Un equipo pendiente recibió posición.');
  assert(result.evaluation.score === 7.5 && result.evaluation.completed, 'La evaluación única válida no se conserva.');
  const writes = [], batches = [];
  const fakeDb = {
    doc(pathname) { return { pathname, async update(changes) { writes.push({ pathname, changes }); } }; },
    batch() { const updates=[]; return { update(ref,changes){updates.push({pathname:ref.pathname,changes});}, async commit(){batches.push(updates);} }; }
  };
  context.fakeDb = fakeDb;
  context.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'SERVER_TIME', delete: () => 'DELETE' }, Timestamp: { fromMillis: value => value } } };
  await vm.runInContext(`window.__QA__.setDb(fakeDb);window.__QA__.setContext({id:'qa',timer:{sheetId:'preguntas',stageIndex:1,stageLabel:'Hoja 2',status:'ready',durationSec:1200,remainingSec:1200}},[]);window.__QA__.startStage({id:'preguntas',label:'Hoja 2',timed:true})`, context);
  assert(writes.at(-1).changes.timer.status === 'running' && writes.at(-1).changes.timer.sheetId === 'preguntas', 'Iniciar etapa no publicó el estado running.');
  await vm.runInContext(`window.__QA__.setContext({id:'qa',timer:{sheetId:'preguntas',stageIndex:1,stageLabel:'Hoja 2',status:'running',durationSec:1200,remainingSec:300}},[]);window.__QA__.endStage()`, context);
  assert(writes.at(-1).changes.timer.status === 'ended' && writes.at(-1).changes.timer.remainingSec === 0, 'Finalizar etapa no publicó el cierre.');
  await vm.runInContext(`window.__QA__.setContext({id:'qa',timer:{sheetId:'preguntas',stageIndex:1,stageLabel:'Hoja 2',status:'ended',durationSec:1200,remainingSec:0}},[]);window.__QA__.enableNextStage()`, context);
  assert(writes.at(-1).changes.timer.sheetId === 'despliegue' && writes.at(-1).changes.timer.status === 'ready', 'Habilitar siguiente no dejó Hoja 3 lista sin iniciarla.');
  await vm.runInContext(`window.__QA__.setContext({id:'qa',timer:{sheetId:'despliegue',stageIndex:2,stageLabel:'Hoja 3',status:'running',durationSec:1200,remainingSec:300}},[{id:'equipo-a',name:'Equipo A',progress:{presentationReady:true},stageOverrides:{}}]);window.__QA__.setReopen(true,'preguntas','all')`, context);
  assert(batches.length && batches.at(-1)[0].changes['stageOverrides.preguntas'].open === true, 'La reapertura no se dirigió al equipo seleccionado.');
  result.transitionWrites = writes.length;
  return result;
}

function mergeChecks() {
  const start = cloudSync.indexOf('const copy=');
  const end = cloudSync.indexOf('function setMessage', start);
  assert(start >= 0 && end > start, 'No se encontró la estrategia de fusión concurrente.');
  const context = { result: null, JSON };
  vm.createContext(context);
  const test = `${cloudSync.slice(start, end)}\nresult=mergeLocalChanges(
    {roles:{gerente:'Ana',finanzas:'Remoto'},manager:{problem:'Hipótesis remota'},selected:['a','b']},
    {roles:{gerente:'Ana',finanzas:'Base'},manager:{problem:'Base'},selected:['a']},
    {roles:{gerente:'Local',finanzas:'Base'},manager:{problem:'Base'},selected:['a']}
  );`;
  vm.runInContext(test, context);
  assert(context.result.roles.gerente === 'Local', 'La fusión perdió el cambio local.');
  assert(context.result.roles.finanzas === 'Remoto', 'La fusión sobrescribió un campo remoto no modificado localmente.');
  assert(context.result.manager.problem === 'Hipótesis remota', 'La fusión perdió un objeto remoto independiente.');
  assert(JSON.stringify(context.result.selected) === JSON.stringify(['a','b']), 'La fusión alteró un array no modificado localmente.');
}

async function deletionBatchCheck() {
  const match = facilitatorJs.match(/async function deleteDocumentRefs\(refs\)\{[\s\S]*?(?=\nasync function deleteSession)/);
  assert(match, 'No se encontró el borrado por lotes.');
  const commits = [];
  const db = { batch() { const deleted = []; return { delete(ref) { deleted.push(ref.id); }, async commit() { commits.push(deleted); } }; } };
  const refs = Array.from({ length: 805 }, (_, id) => ({ id }));
  const context = { db, refs };
  vm.createContext(context);
  vm.runInContext(match[0], context);
  await vm.runInContext('deleteDocumentRefs(refs)', context);
  assert(commits.length === 3 && commits[0].length === 400 && commits[1].length === 400 && commits[2].length === 5, 'El borrado no respeta lotes seguros.');
}

async function browserCheck() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (_error) { return { status: 'diferido', reason: 'Playwright no está instalado.' }; }
  const known = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'
  ].filter(Boolean).find(file => fs.existsSync(file));
  if (!known) return { status: 'diferido', reason: 'El entorno no incluye un motor Chromium; ejecutar la aceptación visual indicada en PRUEBAS-v59.md.' };
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: known });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`file://${path.join(root, 'index.html')}?demo=1`, { waitUntil: 'domcontentloaded' });
    assert(errors.length === 0, `Errores de navegador: ${errors.join(' | ')}`);
    return { status: 'OK', viewport: '390x844', pageErrors: 0 };
  } finally {
    if (browser) await browser.close();
  }
}

async function main() {
  const required = [
    'index.html','facilitator.html','cloud-sync.js','facilitator.js','firebase-config.js',
    'firestore.rules','firestore.indexes.json','firebase.json','README.md','VERSION.txt',
    'CHANGELOG-v59.md','GUIA-FACILITADOR-v59.md','ARQUITECTURA-MULTIEQUIPO-v59.md',
    'INSTRUCCIONES-PUBLICACION-v59.md','PRUEBAS-v59.md','ARCHIVOS-MODIFICADOS-v59.md'
  ];
  required.forEach(file => assert(fs.existsSync(path.join(root, file)), `Falta ${file}.`));

  assert(read('VERSION.txt').includes('Version: v59'), 'VERSION.txt no indica v59.');
  assert(html.includes('<meta name="application-version" content="v59">') && html.includes("const APP_VERSION='v59'"), 'index.html no identifica v59.');
  assert(facilitatorHtml.includes('<meta name="application-version" content="v59">') && facilitatorHtml.includes('Versión 59'), 'El panel no identifica v59.');
  assert(html.includes('Comercial Andina · Conversaciones que Transforman · Versión 59'), 'El título del navegador no corresponde a v59.');

  assert(html.includes('Ingresar como equipo') && html.includes('Acceso facilitador'), 'Faltan los dos accesos de portada.');
  assert(!html.includes('Explorar ejemplos') && !html.includes('Imprimir en PDF') && !html.includes('Nuevo corazón del juego'), 'La vista pública conserva contenido auxiliar retirado.');
  assert(!html.includes('Matriz ERIC') && !html.includes('section id="a3"'), 'Reapareció contenido retirado.');
  assert(html.includes('Informe Directivo para la Planificación 2027') && html.includes('Modelo de negocio'), 'Falta el Informe Directivo o el modelo de negocio.');
  assert(html.includes('Lectura compartida del sistema') && html.includes('diagnosisBridge'), 'Falta la Lectura compartida o su puente a variables.');
  assert(html.includes('Próximos problemas a investigar mediante A3') && html.includes('A3 que proponemos abrir primero'), 'Falta el flujo A3 en Hoja 3 o reporte.');
  assert(html.includes('id="balanceValue"') && html.includes('<b>Índice de equilibrio</b><p>${snap.balance}/100'), 'El Índice de equilibrio no es independiente.');

  ['No habilitada','Habilitada, sin iniciar','En curso','Tiempo finalizado','Cerrada','Reabierta excepcionalmente'].forEach(label => assert(facilitatorJs.includes(label), `Falta el estado ${label}.`));
  assert(facilitatorHtml.includes('Etapa activa para los participantes') && facilitatorHtml.includes('Consulta privada del facilitador'), 'Falta separar vista privada y etapa activa.');
  assert(facilitatorJs.includes('stageOverrides') && facilitatorJs.includes('Reabrir esta etapa permitirá modificar información ya cerrada'), 'Falta reapertura controlada.');
  assert(facilitatorJs.includes("if(t.sheetId==='despliegue')") && facilitatorJs.includes('presentationReady'), 'Hoja 4 no está protegida por presentación preparada.');
  assert(facilitatorJs.includes("timed:false") && facilitatorHtml.includes('Cronómetro de exposición'), 'Hoja 4 o cronómetro oral no están desacoplados.');
  assert(html.includes('Tiempo finalizado. Esta etapa se encuentra en modo de consulta.'), 'Falta el mensaje de cierre de Hoja 2.');
  assert(html.includes('generateDirectorReport') && html.includes('Reintentar generación'), 'Falta cierre o reintento de Hoja 3.');

  assert(facilitatorJs.includes('Nota consensuada del Directorio') && facilitatorJs.includes('Finalizar evaluación') && facilitatorJs.includes('Editar evaluación'), 'Falta evaluación única con respuesta visual.');
  assert(facilitatorJs.includes("score<1||score>10") && facilitatorJs.includes("e.score<1||e.score>10"), 'Falta validación 1–10.');
  assert(!facilitatorJs.includes('evalInput') && !facilitatorJs.includes('Conclusión obligatoria'), 'Continúan campos de evaluación eliminados.');
  assert(facilitatorJs.includes('Publicar resultados') || facilitatorHtml.includes('Publicar resultados'), 'Falta publicación explícita.');
  assert(facilitatorJs.includes('No participa del ranking') && facilitatorJs.includes('presentationOrder'), 'Falta exclusión o sorteo de presentaciones.');
  assert(cloudSync.includes('El Directorio todavía no publicó los resultados.') && cloudSync.includes('colspan="5"'), 'El podio público no respeta el contenido mínimo.');

  assert(facilitatorJs.includes('uniqueTeamId') && facilitatorJs.includes('randomPin') && facilitatorJs.includes('copyInvite'), 'Falta creación automática o copia de acceso.');
  assert(facilitatorJs.includes('renameTeam') && facilitatorJs.includes('regeneratePin'), 'Falta renombrado o regeneración de PIN.');
  assert(facilitatorJs.includes('No hace falta escribir el código') && !facilitatorJs.includes('typed.trim().toUpperCase()!==code'), 'La eliminación sigue solicitando el código.');
  assert(cloudSync.includes('mergeLocalChanges') && cloudSync.includes('stateRevision') && cloudSync.includes('activeDevices'), 'Falta protección de concurrencia o presencia.');
  ['Guardando…','Guardado','Sin conexión','Error al guardar'].forEach(label => assert(cloudSync.includes(label), `Falta estado de guardado: ${label}.`));
  assert(html.includes('Ser una variable propia no agrega ningún bono') && html.includes('Reformular'), 'Falta la revisión equitativa de variables propias.');

  assert(rules.includes('ownsWorkshop(workshopId)') && rules.includes('facilitatorUid == request.auth.uid'), 'Las reglas no verifican propiedad.');
  assert(rules.includes('memberTeam(workshopId) == teamId') && rules.includes("'stateRevision', 'activeDevices'"), 'Las reglas no aíslan o sincronizan equipos.');
  assert(!/password\s*[:=]\s*["'][^"']+["']/i.test([html, facilitatorHtml, facilitatorJs, cloudSync].join('\n')), 'Se detectó una contraseña literal en archivos públicos.');

  duplicateIds(html, 'index.html');
  duplicateIds(facilitatorHtml, 'facilitator.html');
  checkSyntax(inlineScript(html), 'index-inline.js');
  checkSyntax(cloudSync, 'cloud-sync.js');
  checkSyntax(facilitatorJs, 'facilitator.js');
  preservedModelChecks();
  const participant = await participantLogicChecks(indexContext());
  const facilitator = await facilitatorLogicChecks(facilitatorContext());
  mergeChecks();
  await deletionBatchCheck();
  const browser = await browserCheck();

  console.log(JSON.stringify({
    status: 'OK', version: 'v59',
    preserved: ['objetivos y escalas','banco e impactos de variables','consultas y respuestas','fórmula de Score automático'],
    participant: { stageLocks: participant.running, expired: participant.ended, reopened: participant.reopened, reportGeneration: participant.generation, demos: participant.demos },
    facilitator: { stageStates: facilitator.statuses, rankingOrder: facilitator.rows.map(row => row.name), transitionWrites: facilitator.transitionWrites },
    browser,
    checks: 58
  }, null, 2));
}

main().catch(error => { console.error(error.stack || error.message); process.exit(1); });
