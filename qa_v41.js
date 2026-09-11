const fs=require('fs');
const crypto=require('crypto');

const html=fs.readFileSync('index.html','utf8');
const failures=[];
const checks=[];
function check(name,condition){checks.push({name,ok:Boolean(condition)});if(!condition)failures.push(name)}
function between(start,end){const i=html.indexOf(start),j=html.indexOf(end,i);return i>=0&&j>=0?html.slice(i,j):''}
function sha(text){return crypto.createHash('sha256').update(text).digest('hex')}

check('Título del navegador v41',html.includes('<title>Hoshin Workshop v41 · Ejemplos integrados y Score al Directorio</title>'));
check('Meta de versión v41',html.includes('<meta name="application-version" content="v41">'));
check('Sello visible v41',html.includes('Versión v41 · Ejemplos integrados y Score al Directorio'));
check('Índice lateral v41',html.includes('Hoshin Workshop · v41'));
check('Clave histórica de persistencia',html.includes("const KEY='hoshin_v31_internal'"));

const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
check('Sin identificadores HTML duplicados',duplicates.length===0);
check('Etiquetas details equilibradas',(html.match(/<details\b/g)||[]).length===(html.match(/<\/details>/g)||[]).length);
check('Etiquetas section equilibradas',(html.match(/<section\b/g)||[]).length===(html.match(/<\/section>/g)||[]).length);

const script=html.match(/<script>([\s\S]*)<\/script>/)?.[1]||'';
try{new Function(script);check('Sintaxis JavaScript válida',true)}catch(error){check('Sintaxis JavaScript válida',false);console.error(error)}

const ericSource=between('const ERIC_ZONES=','const DIRECTOR_PROMPTS=');
const stateSource=between('function blankEric()','function blankManager()');
let ericApi;
try{ericApi=new Function(`${ericSource}\n${stateSource}\nreturn {ERIC_ZONES,CASE_CLUES,blankEric,normalizeEric}`)();check('Funciones ERIC evaluables',true)}catch(error){check('Funciones ERIC evaluables',false);console.error(error)}
if(ericApi){
 const blank=ericApi.blankEric();
 check('15 indicios del caso',ericApi.CASE_CLUES.length===15);
 check('Inicio: 15 indicios sin clasificar',blank.zones.unclassified.length===15);
 check('Inicio: cuatro cuadrantes vacíos',['eliminate','reduce','increase','create'].every(z=>blank.zones[z].length===0));
 const first=ericApi.CASE_CLUES[0].id,second=ericApi.CASE_CLUES[1].id;
 const migrated=ericApi.normalizeEric({zones:{unclassified:[first,second],reduce:[first],create:[second]},problem:'P',movement:'M'});
 const all=Object.values(migrated.zones).flat();
 check('Migración elimina ubicaciones duplicadas',new Set(all).size===ericApi.CASE_CLUES.length&&all.length===ericApi.CASE_CLUES.length);
 check('Migración conserva textos de lectura',migrated.problem==='P'&&migrated.movement==='M');
 const movementSource=between('function moveEricClue(','let draggedEricId=');
 try{
  const current={eric:ericApi.blankEric()};
  const move=new Function('CASE_CLUES','ERIC_ZONES','current',`${movementSource}\nfunction clueById(id){return CASE_CLUES.find(x=>x.id===id)}\nfunction team(){return current}\nfunction save(){}\nfunction renderEric(){}\nreturn moveEricClue`)(ericApi.CASE_CLUES,ericApi.ERIC_ZONES,current);
  move(first,'reduce');move(second,'reduce',first);
  check('Movimiento entre banco y cuadrante',current.eric.zones.reduce.join(',')===`${second},${first}`&&!current.eric.zones.unclassified.includes(first));
  move(first,'create');
  check('Movimiento entre cuadrantes',current.eric.zones.create[0]===first&&!current.eric.zones.reduce.includes(first));
  move(first,'unclassified');
  check('Retorno al banco sin duplicados',current.eric.zones.unclassified.includes(first)&&Object.values(current.eric.zones).flat().filter(x=>x===first).length===1);
 }catch(error){check('Movimiento y reordenamiento ERIC ejecutables',false);console.error(error)}
}

check('Drag and drop disponible',html.includes('handleEricDragStart')&&html.includes('handleEricDrop'));
check('Selector ERIC eliminado',!html.includes('eric-clue-control')&&!html.includes('Ubicar en')&&!html.includes('aria-label="Ubicación para:'));
check('Tarjeta completa arrastrable',html.includes('class="eric-clue" draggable="true"')&&html.includes('Arrastrar para ubicar'));
check('Arrastre táctil disponible',['handleEricTouchStart','handleEricTouchMove','handleEricTouchEnd','handleEricTouchCancel'].every(name=>html.includes(name)));
check('Instrucciones limitadas al arrastre',html.includes('arrastren cada tarjeta hacia el cuadrante que elijan')&&!html.includes('selector de cada una'));
check('Retorno a sin clasificar',ericSource.includes("id:'unclassified',label:'Sin clasificar'"));
check('Persistencia ERIC por equipo',html.includes('eric:blankEric()')&&html.includes('t.eric=normalizeEric(t.eric)'));
check('ERIC incluido en snapshots',html.includes('eric:JSON.parse(JSON.stringify(team().eric))'));
check('ERIC sin efecto en cálculo',!between('function calc(','function balanceLabel(').includes('eric'));

check('Banco de variables intacto',sha(between('const BASE_VARS=','const KEY='))==='b37e5b44d0f397335154bc53e1bf2300f013d3c7987d0ab20c7446916ea43e38');
check('Metas y escalas intactas',sha(between('const TARGETS=','const OBJECTIVE_OPTIONS='))==='329ba5d86ed05325edc7dc64d1bb59da93932e0eb285fe3ed12c36a11e4963fc');
check('Fórmula del dashboard intacta',sha(between('function calc(','function balanceLabel('))==='791c799a93a0d31cb89dd0a75c284740953f5792b3a3d92bdaff293be5ecb590');
check('Máximo de siete variables',html.includes('team().selected.length>=7'));
check('Capacidad total de 18 Story Points',html.includes('c.sp>18')&&html.includes('${c.sp}/18'));
check('Modo facilitador preservado',html.includes("if(key==='SET')"));

const questionSource=between('const QUESTION_BANK=','let pendingQuestionId=');
check('Banco de 20 consultas',(questionSource.match(/\{id:/g)||[]).length===20);
check('Máximo de tres consultas',html.includes('team().questions.length>=3'));
check('Cuatro campos de síntesis nuevos',['mgr_problem','mgr_hypothesis','mgr_portfolio','mgr_conditions'].every(id=>html.includes(`id="${id}"`)));
check('Nueve campos anteriores fuera de la interfaz',!['mgr_logic','mgr_critical','mgr_tension','mgr_exposed','mgr_tradeoff','mgr_discarded','mgr_interdep','mgr_agreement','mgr_request'].some(id=>html.includes(`id="${id}"`)));
check('Campos históricos preservados en estado',['logic','critical','tension','exposed','tradeoff','discarded','interdep','agreement','request'].every(k=>between('function blankManager()','function blankTeam(').includes(`${k}:''`)));
check('Mensaje al Directorio limitado a 500',html.includes('id="mgr_speech" maxlength="500"'));
check('Botón de presentación preservado',html.includes('onclick="prepareDirector()"'));
check('Guía de matriz cerrada por defecto',html.includes('<details class="matrix-guide">')&&!html.includes('<details class="matrix-guide" open'));
check('Leyenda visible duplicada eliminada',!html.includes('<div class="objective-sign-legend">'));
check('Principio pedagógico eliminado de Hoja 3',!between('<section id="despliegue">','<section id="reporte">').includes('Principio pedagógico'));
check('Preguntas generales redundantes eliminadas',!html.includes('id="conversationPrompts"'));

const sheet3=between('<section id="despliegue">','<section id="reporte">');
const reportSource=between('function reportManagerSummary(','function addFeedback(');
const demoSource=between('function demoEric(','function demoMeta(');
check('Score ausente en Hoja 3',!sheet3.includes('Score automático')&&!sheet3.includes('id="autoScore"'));
check('Score revelado en encabezado de Hoja 4',reportSource.includes('class="report-score"')&&reportSource.includes('Score automático ${snap.auto}/100'));
check('Equilibrio trasladado al detalle de Hoja 4',reportSource.includes('<b>Índice de equilibrio</b>')&&reportSource.includes('${snap.balance}/100'));
check('Reporte utiliza los cuatro campos actuales',['Lectura del problema','Hipótesis de resolución','Lógica del portafolio','Acuerdos y condiciones críticas'].every(text=>reportSource.includes(text)));
check('Tres ejemplos v41 identificados',['demo_funcional_v41','demo_tension_v41','demo_alineada_v41'].every(id=>demoSource.includes(id)));
check('Tres consultas en cada ejemplo',(demoSource.match(/\.map\(questionRecord\)\.filter\(Boolean\)/g)||[]).length===3);
check('ERIC incorporada en los tres ejemplos',(demoSource.match(/t\.eric=demoEric\(/g)||[]).length===3);
check('Ronda 1 y propuesta final en los tres ejemplos',(demoSource.match(/t\.round1=demoSnapshot\(t\)/g)||[]).length===3&&(demoSource.match(/t\.final=demoSnapshot\(t\)/g)||[]).length===3);
check('Feedback, replanteo y A3 presentes en los ejemplos',(demoSource.match(/t\.feedback=/g)||[]).length===3&&(demoSource.match(/t\.rethink=/g)||[]).length===3&&(demoSource.match(/t\.a3=/g)||[]).length===3);
check('Evaluación diferenciada en los tres ejemplos',(demoSource.match(/t\.eval=/g)||[]).length===3&&demoSource.includes('means:1')&&demoSource.includes('means:3')&&demoSource.includes('means:5'));
check('Selector de ejemplos sin Score automático',!between('function openDemoSelector()','function removeExistingDemos()').includes('Score auto'));
check('Fórmula del Score preservada',html.includes("Math.round(avg*.45+balance*.35+efficiency*.20)"));

checks.forEach(x=>console.log(`${x.ok?'OK':'ERROR'} · ${x.name}`));
if(failures.length){console.error(`\n${failures.length} validaciones fallaron.`);process.exit(1)}
console.log(`\n${checks.length} validaciones superadas.`);
