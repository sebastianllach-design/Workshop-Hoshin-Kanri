(function(){
'use strict';

const ACCESS_KEY='hoshin_v59_live_access';
const DEVICE_KEY='hoshin_v59_device_id';
const SAVE_DELAY=900;
const SECTION_ORDER=['caso','preguntas','despliegue','reporte','evaluacion'];
const TIMED_SECTIONS=new Set(['preguntas','despliegue']);
const LEGACY_STAGE_SECTIONS={'Lectura del caso':'caso','Consultas a Dirección':'preguntas','Selección de variables':'despliegue','Preparación de la defensa':'despliegue','Presentaciones al Directorio':'reporte','Plenario y cierre':'evaluacion'};
let app=null,auth=null,db=null,api=null;
let live=false,applyingRemote=false,locked=false,teamLocked=false,sessionStatus='closed',dirty=false,saveTimer=null;
let sessionId='',teamId='',teamName='',sessionName='',currentSection='caso',teamStageOverrides={};
let queued=null,unsubscribeTeam=null,unsubscribeWorkshop=null,unsubscribeRanking=null,rankingData=null,initialApplied=false,timerState=null,timerTick=null,lastActivationToken='',lastExpirationToken='',lastSyncedState=null,lastStateRevision=0;
const handledReopenClosures=new Set();
const deviceId=deviceIdentity();

const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const panelScore=row=>{const value=Number(row?.panelScore??0),rounded=Math.round(value*10)/10;return Number.isInteger(rounded)?String(rounded):rounded.toFixed(1).replace('.',',')};
const slug=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,64);
const copy=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
function deviceIdentity(){try{let id=sessionStorage.getItem(DEVICE_KEY);if(!id){const bytes=new Uint32Array(2);crypto.getRandomValues(bytes);id=`d${bytes[0].toString(36)}${bytes[1].toString(36)}`;sessionStorage.setItem(DEVICE_KEY,id)}return id}catch(_){return `d${Date.now().toString(36)}`}}
function configured(){const c=window.HOSHIN_FIREBASE_CONFIG||{};return !!(c.apiKey&&c.projectId&&!String(c.apiKey).startsWith('REEMPLAZAR')&&!String(c.projectId).startsWith('REEMPLAZAR'))}
async function sha256(value){const data=new TextEncoder().encode(value),digest=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('')}
function timestampMillis(value){if(!value)return 0;if(typeof value.toMillis==='function')return value.toMillis();if(value.seconds)return value.seconds*1000;return Number(value)||0}
function deepEqual(a,b){if(a===b)return true;try{return JSON.stringify(a)===JSON.stringify(b)}catch(_){return false}}
function isPlainObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value)}
function mergeLocalChanges(remote,base,local){
 if(deepEqual(local,base))return copy(remote);
 if(!isPlainObject(local)||!isPlainObject(base)||!isPlainObject(remote))return copy(local);
 const result=copy(remote)||{},keys=new Set([...Object.keys(base),...Object.keys(local)]);
 keys.forEach(key=>{if(!(key in local)){if(key in base)delete result[key];return}result[key]=mergeLocalChanges(remote?.[key],base?.[key],local[key])});
 return result;
}
function setMessage(text,type='error'){const box=$('accessMessage');if(!box)return;box.textContent=text||'';box.classList.toggle('show',!!text);box.style.borderColor=type==='ok'?'#bbf7d0':'#fecaca';box.style.background=type==='ok'?'#f0fdf4':'#fff5f5';box.style.color=type==='ok'?'#166534':'#991b1b'}
function setAccessBusy(busy,text){const btn=$('accessSubmit');if(btn){btn.disabled=busy;btn.textContent=busy?'Ingresando…':'Ingresar como equipo'}if($('accessStatus'))$('accessStatus').textContent=text||(busy?'Validando acceso…':'Conexión segura por equipo')}
function setSync(status,text){const el=$('syncState');if(!el)return;el.className='sync-state '+(status||'');el.textContent=text}
function initFirebase(){if(app)return true;if(!configured()||!window.firebase)return false;app=firebase.apps.length?firebase.app():firebase.initializeApp(window.HOSHIN_FIREBASE_CONFIG);auth=firebase.auth();db=firebase.firestore();db.enablePersistence({synchronizeTabs:true}).catch(()=>{});return true}
function accessRecord(){try{return JSON.parse(localStorage.getItem(ACCESS_KEY)||'null')}catch(_){return null}}
function saveAccess(){localStorage.setItem(ACCESS_KEY,JSON.stringify({sessionId,teamId,teamName,sessionName}))}
function storageKey(){return live&&sessionId&&teamId?`hoshin_v59_live_${sessionId}_${teamId}`:'hoshin_v31_internal'}
function showDemo(destination='evaluacion',preview=false){live=false;locked=false;document.body.classList.remove('mode-team');document.body.classList.add('mode-demo');$('accessGate')?.setAttribute('hidden','hidden');try{localStorage.removeItem(ACCESS_KEY)}catch(_){}setTimeout(()=>{if(typeof window.loadAllDemoExamples==='function')window.loadAllDemoExamples(destination);if(preview){window.HoshinIntro?.close();window.closeModal?.()}else window.HoshinIntro?.open(true)},0)}
function showGate(){$('accessGate')?.removeAttribute('hidden');document.body.classList.remove('mode-team')}

async function claimTeam(sessionInput,teamInput,pin){
 if(!initFirebase())throw new Error('Firebase todavía no está configurado. El facilitador debe completar firebase-config.js antes de realizar la prueba.');
 const nextSession=slug(sessionInput),nextTeam=slug(teamInput);if(!nextSession||!nextTeam||String(pin||'').length<4)throw new Error('Revisen el código de experiencia, el código del equipo y el PIN.');
 await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);let user=auth.currentUser;if(!user||!user.isAnonymous){await auth.signOut().catch(()=>{});user=(await auth.signInAnonymously()).user}
 const workshopSnap=await db.doc(`workshops/${nextSession}`).get();if(!workshopSnap.exists)throw new Error('La experiencia indicada no existe.');const workshop=workshopSnap.data(),status=workshop.status||'closed';if(status!=='open')throw new Error(status==='paused'?'La experiencia está pausada. Esperen la indicación del facilitador.':status==='finished'?'La experiencia ya finalizó.':'La experiencia todavía no está abierta. Esperen la indicación del facilitador.');
 const memberRef=db.doc(`workshops/${nextSession}/members/${user.uid}`),member=await memberRef.get();if(member.exists&&member.data().teamId!==nextTeam){await auth.signOut();user=(await auth.signInAnonymously()).user}
 const proof=await sha256(`${nextSession}|${nextTeam}|${String(pin).trim()}`),claimRef=db.doc(`workshops/${nextSession}/members/${user.uid}`),existing=await claimRef.get();if(!existing.exists)await claimRef.set({teamId:nextTeam,role:'team',proof,claimedAt:firebase.firestore.FieldValue.serverTimestamp()});
 const teamSnap=await db.doc(`workshops/${nextSession}/teams/${nextTeam}`).get();if(!teamSnap.exists)throw new Error('No se encontró el equipo. Revisen el enlace entregado.');
 sessionId=nextSession;teamId=nextTeam;teamName=teamSnap.data().name||teamInput;sessionName=workshop.name||sessionInput;sessionStatus=status;saveAccess();activateLive();
}
async function restoreLive(){
 if(!initFirebase())return false;const saved=accessRecord();if(!saved)return false;await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);const user=await new Promise(resolve=>{const off=auth.onAuthStateChanged(u=>{off();resolve(u)})});if(!user?.isAnonymous)return false;
 const member=await db.doc(`workshops/${saved.sessionId}/members/${user.uid}`).get();if(!member.exists||member.data().teamId!==saved.teamId)return false;sessionId=saved.sessionId;teamId=saved.teamId;teamName=saved.teamName;sessionName=saved.sessionName;activateLive();return true;
}
function activateLive(){live=true;initialApplied=false;document.body.classList.remove('mode-demo');document.body.classList.add('mode-team');$('accessGate')?.setAttribute('hidden','hidden');if($('liveTeamName'))$('liveTeamName').textContent=teamName;if($('liveSessionName'))$('liveSessionName').textContent=sessionName?`${sessionName} · ${sessionId.toUpperCase()}`:sessionId.toUpperCase();setSync('','Guardando…');subscribeWorkshop();subscribeTeam();subscribeRanking();window.HoshinIntro?.open(true);heartbeat();setInterval(heartbeat,60000)}

function timerSection(timer={}){const id=timer.sheetId||LEGACY_STAGE_SECTIONS[timer.stageLabel]||'caso';return SECTION_ORDER.includes(id)?id:'caso'}
function timerToken(timer={}){return String(timer.cycleId||`${timerSection(timer)}-${timestampMillis(timer.startedAt)||0}`)}
function reopenIsActive(value){if(!value)return false;if(value===true)return true;if(value.open===false)return false;const until=timestampMillis(value.expiresAt);return !until||until>Date.now()}
async function processReopenClosures(){if(!initialApplied||locked)return;for(const [sectionId,value] of Object.entries(teamStageOverrides||{})){const expiry=timestampMillis(value?.expiresAt),cycle=value&&value.open===false&&value.closeCycle?String(value.closeCycle):value?.open===true&&expiry&&expiry<=Date.now()?`expiry-${expiry}`:'';if(!cycle)continue;const token=`reopen-${sectionId}-${cycle}`;if(handledReopenClosures.has(token))continue;handledReopenClosures.add(token);try{await api?.onStageReclosed?.({sectionId,token,status:'ended',expired:true,exceptionalClosure:true})}catch(_){handledReopenClosures.delete(token)}}}
function timerControl(seconds){
 const timer=timerState||{},status=timer.status==='idle'?'ready':timer.status||'ready',sectionId=timerSection(timer),activeIndex=Math.max(0,SECTION_ORDER.indexOf(sectionId)),timed=TIMED_SECTIONS.has(sectionId),expired=status==='ended'||timed&&status==='running'&&seconds===0,token=timerToken(timer),reopenedStages=Object.entries(teamStageOverrides||{}).filter(([,value])=>reopenIsActive(value)).map(([id])=>id);
 const control={sectionId,activeIndex,maxVisibleIndex:activeIndex,expired,status,token,reopenedStages,globalLocked:locked,globalLockReason:sessionStatus==='paused'?'La experiencia fue pausada por el facilitador.':sessionStatus==='finished'?'La experiencia finalizó y está en modo de consulta.':sessionStatus!=='open'?'La experiencia está cerrada. Esperen la indicación del facilitador.':teamLocked?'La edición de este equipo fue pausada por el facilitador.':''};api?.applyStageControl?.(control);
 if(!initialApplied)return;
 if(token&&token!==lastActivationToken&&status!=='ended'){lastActivationToken=token;api?.onStageActivated?.(control)}
 if(expired&&!locked&&token&&token!==lastExpirationToken){lastExpirationToken=token;api?.onStageExpired?.(control)}
}
function renderTimer(){const box=$('liveTimer'),stageEl=$('liveTimerStage'),clock=$('liveTimerClock');if(!box||!stageEl||!clock)return;const timer=timerState||{},status=timer.status==='idle'?'ready':timer.status||'ready',sectionId=timerSection(timer),timed=TIMED_SECTIONS.has(sectionId);let seconds=Number(timer.remainingSec||timer.durationSec||0);if(timed&&status==='running'&&timer.endAt)seconds=Math.max(0,Math.ceil((timestampMillis(timer.endAt)-Date.now())/1000));const mm=String(Math.floor(seconds/60)).padStart(2,'0'),ss=String(seconds%60).padStart(2,'0');stageEl.textContent=timer.stageLabel||'Esperando indicación del facilitador';clock.textContent=timed&&status!=='ready'?`${mm}:${ss}`:'--:--';box.classList.toggle('warning',timed&&status==='running'&&seconds>0&&seconds<=120);box.classList.toggle('ended',status==='ended'||timed&&status==='running'&&seconds===0);if(status==='ready')stageEl.textContent=`${timer.stageLabel||'Etapa'} · Habilitada, sin iniciar`;if(status==='ended')stageEl.textContent=`${timer.stageLabel||'Etapa'} · ${timed?'Tiempo finalizado':'Cerrada'}`;timerControl(seconds);processReopenClosures()}
function refreshLockState(){locked=teamLocked||sessionStatus!=='open';$('liveSyncBar')?.classList.toggle('live-lock',locked);if(sessionStatus==='paused')setSync('error','Experiencia pausada');else if(sessionStatus==='finished')setSync('error','Experiencia finalizada');else if(sessionStatus!=='open')setSync('error','Experiencia cerrada');else if(teamLocked)setSync('error','Edición pausada para este equipo');else if(!dirty)setSync('saved','Guardado');if(!locked&&queued){clearTimeout(saveTimer);saveTimer=setTimeout(flush,250)}if(timerState)renderTimer();if(!locked)processReopenClosures()}
function subscribeWorkshop(){unsubscribeWorkshop?.();unsubscribeWorkshop=db.doc(`workshops/${sessionId}`).onSnapshot(snap=>{if(!snap.exists)return;const data=snap.data();sessionStatus=data.status||'closed';sessionName=data.name||sessionName;timerState=data.timer||null;if($('liveSessionName'))$('liveSessionName').textContent=`${sessionName} · ${sessionId.toUpperCase()}`;refreshLockState();renderTimer();clearInterval(timerTick);timerTick=setInterval(renderTimer,1000)})}
function otherActiveDevices(data){return Object.entries(data.activeDevices||{}).filter(([id,value])=>id!==deviceId&&Date.now()-timestampMillis(value)<180000).length}
function showDeviceWarning(data){const warning=$('sessionWarning'),count=otherActiveDevices(data);if(!warning)return;warning.hidden=!count;warning.textContent=count?'Este equipo tiene otra sesión activa. Eviten modificar simultáneamente el mismo campo.':''}
function subscribeTeam(){
 unsubscribeTeam?.();unsubscribeTeam=db.doc(`workshops/${sessionId}/teams/${teamId}`).onSnapshot(snap=>{
  if(!snap.exists){setSync('error','Equipo eliminado');return}const data=snap.data(),previousTeamName=teamName;teamLocked=!!data.locked;teamStageOverrides=data.stageOverrides||{};teamName=data.name||teamName;if($('liveTeamName'))$('liveTeamName').textContent=teamName;showDeviceWarning(data);refreshLockState();
  const remoteState=data.state||null,revision=Number(data.stateRevision||0);
  if(!initialApplied){applyingRemote=true;try{const backup=localStorage.getItem(storageKey());let fallback=null;try{fallback=backup?JSON.parse(backup)?.teams?.[0]:null}catch(_){}const initial=remoteState||fallback||null;lastSyncedState=copy(initial);lastStateRevision=revision;api.applyTeam(initial,{teamId,teamName});initialApplied=true}finally{applyingRemote=false}heartbeat();processReopenClosures();return}
  if((revision>lastStateRevision||teamName!==previousTeamName)&&!dirty&&!queued&&remoteState){lastStateRevision=Math.max(lastStateRevision,revision);lastSyncedState=copy(remoteState);applyingRemote=true;try{api.applyTeam(remoteState,{teamId,teamName})}finally{applyingRemote=false}}
  processReopenClosures();
 },()=>setSync('error',navigator.onLine?'Error al guardar':'Sin conexión'));
}
function subscribeRanking(){unsubscribeRanking?.();unsubscribeRanking=db.doc(`workshops/${sessionId}/public/ranking`).onSnapshot(snap=>{rankingData=snap.exists?snap.data():null;api?.refresh?.()})}

function queueSave(team,progress,metrics){if(!live||applyingRemote||locked)return;queued={team:copy(team),progress:copy(progress),metrics:copy(metrics),base:copy(lastSyncedState)};dirty=true;setSync('','Guardando…');clearTimeout(saveTimer);saveTimer=setTimeout(flush,SAVE_DELAY)}
async function flush(){
 clearTimeout(saveTimer);if(!live)return true;if(locked)return false;if(!queued){if(!dirty)setSync('saved','Guardado');return true}
 const payload=queued;queued=null;const ref=db.doc(`workshops/${sessionId}/teams/${teamId}`);
 try{
  const outcome=await db.runTransaction(async transaction=>{const snap=await transaction.get(ref);if(!snap.exists)throw new Error('Equipo eliminado');const remote=snap.data(),merged=mergeLocalChanges(remote.state||{},payload.base||lastSyncedState||{},payload.team),revision=Number(remote.stateRevision||0)+1;transaction.update(ref,{name:merged.name||teamName,state:merged,progress:payload.progress,metrics:payload.metrics,currentSection:currentSection||payload.progress.currentSection||'caso',stateRevision:revision,[`activeDevices.${deviceId}`]:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp(),lastSeen:firebase.firestore.FieldValue.serverTimestamp()});return {merged,revision}});
  lastSyncedState=copy(outcome.merged);lastStateRevision=outcome.revision;dirty=!!queued;
  if(!queued&&!deepEqual(outcome.merged,payload.team)){const mergedName=outcome.merged.name||teamName;teamName=mergedName;if($('liveTeamName'))$('liveTeamName').textContent=mergedName;applyingRemote=true;try{api.applyTeam(outcome.merged,{teamId,teamName:mergedName})}finally{applyingRemote=false}}
  setSync(dirty?'':'saved',dirty?'Guardando…':'Guardado');if(queued)saveTimer=setTimeout(flush,200);return true;
 }catch(error){queued=queued||payload;dirty=true;setSync('error',navigator.onLine?'Error al guardar · reintentando':'Sin conexión');saveTimer=setTimeout(flush,4000);return false}
}
function heartbeat(){if(!live||!db)return;db.doc(`workshops/${sessionId}/teams/${teamId}`).update({lastSeen:firebase.firestore.FieldValue.serverTimestamp(),currentSection,[`activeDevices.${deviceId}`]:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{})}
function noteSection(id){currentSection=id||'caso';if(live)heartbeat()}

function renderParticipantRanking({winnerSpotlight,evalRows}){
 const rows=Array.isArray(rankingData?.rows)?rankingData.rows:[];
 if(!rankingData?.published||!rows.length){winnerSpotlight.className='winner-spotlight empty';winnerSpotlight.innerHTML='<div class="winner-crown">—</div><div><span class="winner-kicker">Resultado pendiente</span><span class="winner-name">El Directorio todavía no publicó los resultados.</span><span class="winner-meta">La publicación aparecerá automáticamente en todas las pantallas.</span></div>';evalRows.innerHTML='<tr><td colspan="5">El Directorio todavía no publicó los resultados.</td></tr>';return}
 const winner=rows[0];winnerSpotlight.className='winner-spotlight';winnerSpotlight.innerHTML=`<div class="winner-crown">1.º</div><div><span class="winner-kicker">Equipo ganador</span><span class="winner-name">${esc(winner.name)}</span><span class="winner-meta">Score automático ${Number(winner.auto||0)} · Nota del Directorio ${panelScore(winner)}/10</span></div><div class="winner-score"><b>${Number(winner.total||0)}</b><small>Resultado final</small></div>`;
 evalRows.innerHTML=rows.map(r=>{const p=Number(r.position||0),cls=p<=3?`podium-${p}`:'ranking-row';return `<tr class="${cls}"><td><span class="rank-badge ${p<=3?'':'standard'}">${p}.º</span></td><td><b>${esc(r.name)}</b></td><td>${Number(r.auto||0)}</td><td>${panelScore(r)}/10</td><td><b class="ranking-total">${Number(r.total||0)}</b></td></tr>`}).join('');
}
async function signOutTeam(){if(!confirm('¿Salir de este equipo en esta computadora? Los cambios sincronizados no se perderán.'))return;await flush().catch(()=>{});await db?.doc(`workshops/${sessionId}/teams/${teamId}`).update({[`activeDevices.${deviceId}`]:firebase.firestore.FieldValue.delete()}).catch(()=>{});unsubscribeTeam?.();unsubscribeWorkshop?.();unsubscribeRanking?.();localStorage.removeItem(ACCESS_KEY);await auth?.signOut().catch(()=>{});location.href=location.pathname}

function initParticipant(callbacks){
 api=callbacks;const params=new URLSearchParams(location.search),sessionParam=params.get('session'),teamParam=params.get('team');
 if(sessionParam)$('accessSession').value=sessionParam;if(teamParam)$('accessTeam').value=teamParam;
 if(sessionParam&&teamParam){$('accessSession').closest('.field').style.display='none';$('accessTeam').closest('.field').style.display='none';const grid=$('accessTeam').closest('.access-grid');if(grid)grid.style.gridTemplateColumns='1fr';$('accessTitle').textContent='Ingresá el PIN del equipo';$('accessStatus').textContent='El enlace ya identifica la experiencia y el equipo'}
 $('teamAccessForm')?.addEventListener('submit',async e=>{e.preventDefault();setMessage('');setAccessBusy(true);try{await claimTeam($('accessSession').value,$('accessTeam').value,$('accessPin').value)}catch(error){setMessage(error?.message||'No fue posible ingresar.');setAccessBusy(false,'Revisá el PIN o consultá al facilitador.')}});
 if(params.get('demo')==='1'){showDemo(params.get('sheet')||'evaluacion',params.get('facilitatorPreview')==='1');return}
 if(!configured()){showGate();setMessage('La conexión central todavía no fue configurada. Completá firebase-config.js antes de ingresar.');return}
 restoreLive().then(ok=>{if(!ok)showGate()}).catch(()=>showGate());
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush();else heartbeat()});window.addEventListener('online',()=>{if(live){setSync('','Guardando…');flush()}});window.addEventListener('offline',()=>{if(live)setSync('error','Sin conexión')});
}

window.HoshinCloud={initParticipant,isLiveTeam:()=>live,isApplyingRemote:()=>applyingRemote,queueSave,flush,noteSection,renderParticipantRanking,signOutTeam,localStorageKey:storageKey};
})();
