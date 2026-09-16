const fs=require('fs');
const crypto=require('crypto');

const html=fs.readFileSync('index.html','utf8');
const failures=[];
const checks=[];
function check(name,condition){checks.push({name,ok:Boolean(condition)});if(!condition)failures.push(name)}
function between(start,end){const i=html.indexOf(start),j=html.indexOf(end,i);return i>=0&&j>=0?html.slice(i,j):''}
function sha(text){return crypto.createHash('sha256').update(text).digest('hex')}

check('Título del navegador v51',html.includes('<title>Hoshin Workshop v51 · Cierre oral en plenario</title>'));
check('Meta de versión v51',html.includes('<meta name="application-version" content="v51">'));
check('Sello visible v51',html.includes('Versión v51 · Cierre oral en plenario'));
check('Índice lateral v51',html.includes('Hoshin Workshop · v51'));
check('Constante de aplicación v51',html.includes("const APP_VERSION='v51'"));
check('Clave histórica de persistencia',html.includes("const KEY='hoshin_v31_internal'"));

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
check('Sin identificadores HTML duplicados',duplicates.length===0);
check('Etiquetas details equilibradas',(html.match(/<details\b/g)||[]).length===(html.match(/<\/details>/g)||[]).length);
check('Etiquetas section equilibradas',(html.match(/<section\b/g)||[]).length===(html.match(/<\/section>/g)||[]).length);

const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1]||'';
try{new Function(script);check('Sintaxis JavaScript válida',true)}catch(error){check('Sintaxis JavaScript válida',false);console.error(error)}

const nav=between('<nav>','</nav>');
const visibleSections=[...html.matchAll(/<section id="([^"]+)"/g)].map(m=>m[1]);
check('Navegación reducida a seis hojas',(nav.match(/data-target=/g)||[]).length===6);
check('Navegación numerada de 1 a 6',['<i>1</i>','<i>2</i>','<i>3</i>','<i>4</i>','<i>5</i>','<i>6</i>'].every(x=>nav.includes(x)));
check('Catchball ya no es una hoja',!nav.includes('data-target="feedback"')&&!visibleSections.includes('feedback'));
check('Replanteo ya no es una hoja',!nav.includes('data-target="replanteo"')&&!visibleSections.includes('replanteo'));
check('A3 renumerado como Hoja 5',nav.includes('<button data-target="a3"><i>5</i>Proyectos A3</button>'));
check('Evaluación renumerada como Hoja 6',nav.includes('<button data-target="evaluacion"><i>6</i>Evaluación y ranking</button>'));

const report=between('<section id="reporte">','<section id="a3">');
check('Cierre oral integrado en Hoja 4',report.includes('Devolución del Directorio y Catchball oral'));
check('Cierre oral sin formularios',!report.includes('<textarea')&&!report.includes('<input')&&!report.includes('<select'));
check('Participación de todas las mesas',report.includes('Los demás equipos aportan perspectivas, dudas y alternativas.'));
check('Secuencia oral de cuatro momentos',['1 · Presentación','2 · Preguntas','3 · Plenario','4 · Síntesis'].every(x=>report.includes(x)));
check('Preguntas orales neutrales',script.includes('const ORAL_DIRECTOR_PROMPTS=')&&script.includes('renderOralDirectorPrompts'));
check('Sin segunda carga posterior',report.includes('no requiere completar formularios adicionales')&&report.includes('ni exige una segunda carga'));

check('A3 toma la presentación congelada',script.includes('function syncA3(){const s=team().round1||snapshot()'));
check('Evaluación toma la presentación congelada',script.includes('function evalCalc(t){const c=t.round1||calc(t)'));
check('Catchball oral preservado como criterio humano',html.includes('<th>Catchball oral</th>'));
check('Actualización general no invoca hojas retiradas',!between('function updateAll(','function directFoldBlocks').includes('renderFeedback')&&!between('function updateAll(','function directFoldBlocks').includes('renderCompare'));

const sheet2=between('<section id="preguntas">','<section id="despliegue">');
const sheet3=between('<section id="despliegue">','<section id="reporte">');
check('Contador de consultas centrado preservado',sheet2.includes('id="qCounter"')&&html.includes('.counter{display:inline-flex;align-items:center;justify-content:center;text-align:center;'));
check('Banco de variables por temas preservado',script.includes('VARIABLE_FAMILY_ORDER')&&script.includes('class="variable-theme"'));
check('Sin botón Ver detalle',!html.includes('Ver detalle')&&!html.includes('toggleVariableDetails'));
check('Procedencia debajo de la evidencia',script.includes('class="variable-evidence-text"')&&script.includes('class="variable-source"'));
check('Máximo de siete variables',html.includes('team().selected.length>=7'));
check('Capacidad de 18 Story Points',html.includes('c.sp>18')&&html.includes('${c.sp}/18'));
check('Score ausente en Hoja 3',!sheet3.includes('id="autoScore"'));
check('Score revelado en Hoja 4',html.includes('class="report-score-title">Score Final')&&html.includes('${snap.auto}/100'));

check('Banco de variables preservado',sha(between('const BASE_VARS=','const VARIABLE_CONTEXT='))==='9bf8aa4836575e2954913c13f0d51f932f20db15a9bb6f704b1e0c3be19e87cd');
check('Fórmula del dashboard preservada',sha(between('function calc(','function balanceLabel('))==='791c799a93a0d31cb89dd0a75c284740953f5792b3a3d92bdaff293be5ecb590');
check('Markup de Matriz preservado',sha(between('<div class="table-wrap matrix">','<div class="portfolio-dashboard">'))==='3877dbaa3b8822cd13504a763f24a618a59beaf9a5cac5598ed4e026f4ddd807');
check('Render de Matriz preservado',sha(between('function renderMatrix()','function renderMetrics()'))==='5b5675cf26a25872efba2483b9cf91616e4554d22acb9f6dfa4246accea3af7d');
check('Persistencia y migración conservadas',html.includes('localStorage.setItem(KEY')&&html.includes('function migrateTeam('));
check('Modo facilitador conservado',html.includes('toggleFacilitatorMode'));
check('Ejemplos adaptados al flujo reducido',html.includes('La devolución y el Catchball se realizan oralmente en plenario.')&&!html.includes('Reporte al Directorio, Feedback, Replanteo'));

checks.forEach(x=>console.log(`${x.ok?'OK':'ERROR'} · ${x.name}`));
if(failures.length){console.error(`\n${failures.length} validaciones fallaron.`);process.exit(1)}
console.log(`\n${checks.length} validaciones superadas.`);
