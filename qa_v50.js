const fs=require('fs');
const crypto=require('crypto');

const html=fs.readFileSync('index.html','utf8');
const failures=[];
const checks=[];
function check(name,condition){checks.push({name,ok:Boolean(condition)});if(!condition)failures.push(name)}
function between(start,end){const i=html.indexOf(start),j=html.indexOf(end,i);return i>=0&&j>=0?html.slice(i,j):''}
function sha(text){return crypto.createHash('sha256').update(text).digest('hex')}

check('Título del navegador v50',html.includes('<title>Hoshin Workshop v50 · Contador de consultas centrado</title>'));
check('Meta de versión v50',html.includes('<meta name="application-version" content="v50">'));
check('Sello visible v50',html.includes('Versión v50 · Contador de consultas centrado'));
check('Índice lateral v50',html.includes('Hoshin Workshop · v50'));
check('Clave histórica de persistencia',html.includes("const KEY='hoshin_v31_internal'"));

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
check('Sin identificadores HTML duplicados',duplicates.length===0);
check('Etiquetas details equilibradas',(html.match(/<details\b/g)||[]).length===(html.match(/<\/details>/g)||[]).length);
check('Etiquetas section equilibradas',(html.match(/<section\b/g)||[]).length===(html.match(/<\/section>/g)||[]).length);

const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1]||'';
try{new Function(script);check('Sintaxis JavaScript válida',true)}catch(error){check('Sintaxis JavaScript válida',false);console.error(error)}

const constantsSource=between('const BASE_VARS=','const TARGETS=');
try{
 const {BASE_VARS,VARIABLE_CONTEXT,VARIABLE_FAMILY_ORDER}=new Function(`${constantsSource}\nreturn {BASE_VARS,VARIABLE_CONTEXT,VARIABLE_FAMILY_ORDER}`)();
 check('Banco conserva 24 variables',BASE_VARS.length===24);
 check('Las 24 variables tienen contexto cualitativo',BASE_VARS.every(v=>VARIABLE_CONTEXT[v.id]));
 check('Cada contexto tiene evidencia, riesgo y condición',BASE_VARS.every(v=>{const c=VARIABLE_CONTEXT[v.id];return c.evidence&&c.risk&&c.condition&&c.family}));
 check('Seis temas ordenan las variables',VARIABLE_FAMILY_ORDER.slice(0,6).join('|')==='Crecimiento y clientes|Inventario y supply|Operación y productividad|Personas y liderazgo|Tecnología y coordinación|Compras y costos');
 check('Las 24 variables pertenecen a los seis temas',BASE_VARS.every(v=>VARIABLE_FAMILY_ORDER.slice(0,6).includes(VARIABLE_CONTEXT[v.id].family)));
}catch(error){check('Datos cualitativos evaluables',false);console.error(error)}

const sheet3=between('<section id="despliegue">','<section id="reporte">');
const sheet2=between('<section id="preguntas">','<section id="despliegue">');
check('Contador de consultas presente',sheet2.includes('id="qCounter"')&&sheet2.includes('Consultas realizadas: 0/3'));
check('Texto del contador centrado horizontal y verticalmente',html.includes('.counter{display:inline-flex;align-items:center;justify-content:center;text-align:center;'));
check('Hoja 3 comienza por variables',sheet3.includes('1. Explorar y seleccionar variables'));
check('ERIC fuera de la interfaz de Hoja 3',!sheet3.includes('ERIC')&&!sheet3.includes('ericZone'));
check('Sin bloque diagnóstico adicional',!sheet3.includes('Lectura compartida del sistema')&&!sheet3.includes('escala de valoración'));
check('Banco completo plegable',sheet3.includes('<details class="fold-block" open><summary><div class="fold-summary-copy"><h3>1. Explorar y seleccionar variables'));
check('Sin botón Ver detalle',!html.includes('Ver detalle')&&!html.includes('toggleVariableDetails'));
check('Información decisiva en la misma fila',script.includes('<article class="variable-row')&&script.includes('variable-info-label">Conexión con evidencia')&&script.includes('variable-info-label">Riesgo principal')&&script.includes('variable-info-label">Necesita para tener éxito'));
check('Procedencia siempre debajo de la evidencia',script.includes('class="variable-evidence-text"')&&script.includes('class="variable-source"')&&html.includes('.variable-evidence-text{display:block}')&&html.includes('.variable-source{display:flex'));
check('Agrupación visible por tema',script.includes('class="variable-theme"')&&script.includes('class="variable-theme-head"'));
check('Orden por tema y luego alfabético',script.includes('VARIABLE_FAMILY_ORDER.indexOf(ca.family)-VARIABLE_FAMILY_ORDER.indexOf(cb.family)')&&script.includes("localeCompare(b.name,'es')"));
check('Banco sin impactos ni SP visibles',!between('<div class="variable-bank-panel">','</div></div></details>').includes('Contribución a'));
check('Revelado progresivo explicado',sheet3.includes('al presionar “Llevar a la Matriz”'));
check('Selección limitada a siete',html.includes('team().selected.length>=7'));

check('Banco base idéntico a v46',sha(between('const BASE_VARS=','const KEY='))==='b37e5b44d0f397335154bc53e1bf2300f013d3c7987d0ab20c7446916ea43e38');
check('Fórmula del dashboard idéntica a v46',sha(between('function calc(','function balanceLabel('))==='791c799a93a0d31cb89dd0a75c284740953f5792b3a3d92bdaff293be5ecb590');
check('Markup de Matriz idéntico a v46',sha(between('<div class="table-wrap matrix">','<div class="portfolio-dashboard">'))==='3877dbaa3b8822cd13504a763f24a618a59beaf9a5cac5598ed4e026f4ddd807');
check('Núcleo del dashboard idéntico a v46',sha(between(' <div class="metric-bars">','<div class="portfolio-reflection-shell">'))==='088973c5762b6a21c92f3bc773b4c85e12bab849c9256f859fb5f08cb7ca41ee');
check('Render de Matriz idéntico a v46',sha(between('function renderMatrix()','function renderMetrics()'))==='5b5675cf26a25872efba2483b9cf91616e4554d22acb9f6dfa4246accea3af7d');
check('Lecturas del portafolio visibles y neutrales',sheet3.includes('Lecturas para preparar la síntesis')&&sheet3.includes('Efectos y condiciones para considerar')&&sheet3.includes('Preguntas para preparar la defensa')&&!sheet3.includes('Alertas y efectos cruzados')&&!sheet3.includes('Preguntas que abre el portafolio'));
check('Ayudas no modifican el Score',sheet3.includes('no califican la propuesta ni modifican el Score'));
check('Solo el exceso de capacidad usa énfasis ámbar',script.includes("c.sp>18)arr.push({cls:'critical'")&&!script.includes("arr.push({cls:'bad'")&&html.includes('.portfolio-reflection-shell .alert.critical'));
check('Capacidad total de 18 Story Points',html.includes('c.sp>18')&&html.includes('${c.sp}/18'));
check('Impactos ocultos hasta la Matriz',sheet3.indexOf('Contribución a<br>Ventas +15%')>sheet3.indexOf('2. Asignar capacidad y revisar impactos'));
check('Score ausente en Hoja 3',!sheet3.includes('Score automático')&&!sheet3.includes('id="autoScore"'));
check('Score revelado al preparar Directorio',html.includes('class="report-score-title">Score Final')&&html.includes('${snap.auto}/100'));

const reportFunction=between('function reportHTML(','function renderReport()');
check('Síntesis ejecutiva ampliada',html.includes('class="report-leadership-summary"')&&html.includes('class="report-summary-grid"')&&html.includes('font-size:13px'));
check('Síntesis debajo de roles y antes de resultados',reportFunction.indexOf('report-role-grid')<reportFunction.indexOf('${reportManagerSummary(snap)}')&&reportFunction.indexOf('${reportManagerSummary(snap)}')<reportFunction.indexOf('report-objectives'));
check('Síntesis antes de la Matriz del reporte',reportFunction.indexOf('${reportManagerSummary(snap)}')<reportFunction.indexOf('report-matrix'));
check('Cuatro componentes de la síntesis preservados',['Lectura del problema','Hipótesis de resolución','Lógica del portafolio','Acuerdos y condiciones críticas'].every(x=>html.includes(x)));

check('Persistencia y migración conservadas',html.includes('localStorage.setItem(KEY')&&html.includes('function migrateTeam('));
check('Consultas, snapshots y ejemplos conservados',html.includes('const QUESTION_BANK=')&&html.includes('function snapshot()')&&html.includes("makeDemoTeam('funcional')"));
check('Modo facilitador y variables propias conservados',html.includes('toggleFacilitatorMode')&&html.includes('openCreateVariable'));
check('Responsive del banco',html.includes('@media(max-width:1150px)')&&html.includes('@media(max-width:820px)')&&html.includes('@media(max-width:620px)'));

checks.forEach(x=>console.log(`${x.ok?'OK':'ERROR'} · ${x.name}`));
if(failures.length){console.error(`\n${failures.length} validaciones fallaron.`);process.exit(1)}
console.log(`\n${checks.length} validaciones superadas.`);
