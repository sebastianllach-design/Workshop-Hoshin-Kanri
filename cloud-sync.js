(function(){
  'use strict';

  const ACCESS_KEY='hoshin_v53_live_access';
  const SAVE_DELAY=1600;
  let app=null,auth=null,db=null,api=null;
  let live=false,applyingRemote=false,locked=false,teamLocked=false,sessionStatus='draft',dirty=false,saveTimer=null;
  let sessionId='',teamId='',teamName='',sessionName='',currentSection='caso';
  let queued=null,unsubscribeTeam=null,unsubscribeWorkshop=null,unsubscribeRanking=null,rankingData=null,initialApplied=false,timerState=null,timerTick=null,lastActivationToken='',lastExpirationToken='';
  const SECTION_ORDER=['caso','preguntas','despliegue','reporte','evaluacion'];
  const LEGACY_STAGE_SECTIONS={'Lectura del caso':'caso','Consultas a Dirección':'preguntas','Selección de variables':'despliegue','Preparación de la defensa':'despliegue','Presentaciones al Directorio':'reporte','Plenario y cierre':'evaluacion'};

  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const panelScore=row=>{const value=Number(row?.panelScore??row?.evaluation?.score??Number(row?.defenseScore||0)/10),rounded=Math.round(value*10)/10;return Number.isInteger(rounded)?String(rounded):rounded.toFixed(1).replace('.',',')};
  const slug=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,64);
  const configured=()=>{
    const c=window.HOSHIN_FIREBASE_CONFIG||{};
    return !!(c.apiKey&&c.projectId&&!String(c.apiKey).startsWith('REEMPLAZAR')&&!String(c.projectId).startsWith('REEMPLAZAR'));
  };
  async function sha256(value){
    const data=new TextEncoder().encode(value);
    const digest=await crypto.subtle.digest('SHA-256',data);
    return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function setMessage(text,type='error'){
    const box=$('accessMessage');if(!box)return;
    box.textContent=text||'';box.classList.toggle('show',!!text);
    box.style.borderColor=type==='ok'?'#bbf7d0':'#fecaca';
    box.style.background=type==='ok'?'#f0fdf4':'#fff5f5';
    box.style.color=type==='ok'?'#166534':'#991b1b';
  }
  function setAccessBusy(busy,text){
    const btn=$('accessSubmit');if(btn){btn.disabled=busy;btn.textContent=busy?'Ingresando…':'Ingresar como equipo'}
    if($('accessStatus'))$('accessStatus').textContent=text||(busy?'Validando acceso…':'Conexión segura por equipo');
  }
  function setSync(status,text){
    const el=$('syncState');if(!el)return;
    el.className='sync-state '+(status||'');el.textContent=text;
  }
  function initFirebase(){
    if(app)return true;
    if(!configured()||!window.firebase)return false;
    app=firebase.apps.length?firebase.app():firebase.initializeApp(window.HOSHIN_FIREBASE_CONFIG);
    auth=firebase.auth();db=firebase.firestore();
    db.enablePersistence({synchronizeTabs:true}).catch(()=>{});
    return true;
  }
  function showDemo(){
    live=false;locked=false;document.body.classList.remove('mode-team');document.body.classList.add('mode-demo');
    $('accessGate')?.setAttribute('hidden','hidden');
    try{localStorage.removeItem(ACCESS_KEY)}catch(_e){}
    setTimeout(()=>{if(typeof window.loadAllDemoExamples==='function')window.loadAllDemoExamples('evaluacion');window.HoshinIntro?.open(true)},0);
  }
  function showGate(){
    $('accessGate')?.removeAttribute('hidden');document.body.classList.remove('mode-team');
  }
  function accessRecord(){try{return JSON.parse(localStorage.getItem(ACCESS_KEY)||'null')}catch(_e){return null}}
  function saveAccess(){localStorage.setItem(ACCESS_KEY,JSON.stringify({sessionId,teamId,teamName,sessionName}))}
  function storageKey(){return live&&sessionId&&teamId?`hoshin_v53_live_${sessionId}_${teamId}`:'hoshin_v31_internal'}

  async function claimTeam(sessionInput,teamInput,pin){
    if(!initFirebase())throw new Error('Firebase todavía no está configurado. El facilitador debe completar firebase-config.js antes de realizar la prueba.');
    const nextSession=slug(sessionInput),nextTeam=slug(teamInput);
    if(!nextSession||!nextTeam||String(pin||'').length<4)throw new Error('Revisen el código de experiencia, el código del equipo y el PIN.');
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    let user=auth.currentUser;
    if(!user||!user.isAnonymous){await auth.signOut().catch(()=>{});user=(await auth.signInAnonymously()).user}
    const workshopSnap=await db.doc(`workshops/${nextSession}`).get();
    if(!workshopSnap.exists)throw new Error('La experiencia indicada no existe.');
    const workshop=workshopSnap.data();
    if(workshop.status!=='open')throw new Error(workshop.status==='closed'?'La experiencia ya fue cerrada por el facilitador.':'La experiencia todavía no está abierta. Esperen la indicación del facilitador.');
    const memberRef=db.doc(`workshops/${nextSession}/members/${user.uid}`);
    const member=await memberRef.get();
    if(member.exists&&member.data().teamId!==nextTeam){
      await auth.signOut();user=(await auth.signInAnonymously()).user;
    }
    const proof=await sha256(`${nextSession}|${nextTeam}|${String(pin).trim()}`);
    const claimRef=db.doc(`workshops/${nextSession}/members/${user.uid}`);
    const existing=await claimRef.get();
    if(!existing.exists){
      await claimRef.set({teamId:nextTeam,role:'team',proof,claimedAt:firebase.firestore.FieldValue.serverTimestamp()});
    }
    const teamSnap=await db.doc(`workshops/${nextSession}/teams/${nextTeam}`).get();
    if(!teamSnap.exists)throw new Error('No se encontró el equipo. Revisen el código entregado.');
    sessionId=nextSession;teamId=nextTeam;teamName=teamSnap.data().name||teamInput;sessionName=workshop.name||sessionInput;sessionStatus=workshop.status||'draft';
    saveAccess();activateLive();
  }
  async function restoreLive(){
    if(!initFirebase())return false;
    const saved=accessRecord();if(!saved)return false;
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const user=await new Promise(resolve=>{const off=auth.onAuthStateChanged(u=>{off();resolve(u)})});
    if(!user?.isAnonymous)return false;
    const member=await db.doc(`workshops/${saved.sessionId}/members/${user.uid}`).get();
    if(!member.exists||member.data().teamId!==saved.teamId)return false;
    sessionId=saved.sessionId;teamId=saved.teamId;teamName=saved.teamName;sessionName=saved.sessionName;
    activateLive();return true;
  }
  function activateLive(){
    live=true;initialApplied=false;document.body.classList.remove('mode-demo');document.body.classList.add('mode-team');
    $('accessGate')?.setAttribute('hidden','hidden');
    if($('liveTeamName'))$('liveTeamName').textContent=teamName;
    if($('liveSessionName'))$('liveSessionName').textContent=sessionName?`${sessionName} · ${sessionId.toUpperCase()}`:sessionId.toUpperCase();
    setSync('','Sincronizando…');subscribeWorkshop();subscribeTeam();subscribeRanking();
    window.HoshinIntro?.open(true);
    setInterval(()=>heartbeat(),90000);
  }
  function timerMillis(value){if(!value)return 0;if(typeof value.toMillis==='function')return value.toMillis();if(value.seconds)return value.seconds*1000;return Number(value)||0}
  function timerSection(timer={}){const id=timer.sheetId||LEGACY_STAGE_SECTIONS[timer.stageLabel]||'caso';return SECTION_ORDER.includes(id)?id:'caso'}
  function timerToken(timer={}){return String(timer.cycleId||`${timerSection(timer)}-${timerMillis(timer.startedAt)||0}`)}
  function timerControl(seconds){
    const timer=timerState||{},status=timer.status||'idle',sectionId=timerSection(timer),activeIndex=Math.max(0,SECTION_ORDER.indexOf(sectionId)),expired=status==='ended'||status==='running'&&seconds===0,maxVisibleIndex=sectionId==='despliegue'&&expired?Math.max(activeIndex,SECTION_ORDER.indexOf('reporte')):activeIndex,token=timerToken(timer);
    const control={sectionId,activeIndex,maxVisibleIndex,expired,status,token,globalLocked:locked,globalLockReason:sessionStatus==='paused'?'La experiencia fue pausada por el facilitador.':sessionStatus==='closed'?'La experiencia fue cerrada por el facilitador.':teamLocked?'La edición de este equipo fue pausada por el facilitador.':''};
    api?.applyStageControl?.(control);
    if(!initialApplied||status==='idle')return;
    if(token&&token!==lastActivationToken&&status!=='ended'){
      lastActivationToken=token;
      api?.onStageActivated?.(control);
    }
    if(expired&&!locked&&token&&token!==lastExpirationToken){
      lastExpirationToken=token;
      api?.onStageExpired?.(control);
    }
  }
  function renderTimer(){
    const box=$('liveTimer'),stage=$('liveTimerStage'),clock=$('liveTimerClock');if(!box||!stage||!clock)return;
    const timer=timerState||{},status=timer.status||'idle';let seconds=Number(timer.remainingSec||timer.durationSec||0);
    if(status==='running'&&timer.endAt)seconds=Math.max(0,Math.ceil((timerMillis(timer.endAt)-Date.now())/1000));
    const mm=String(Math.floor(seconds/60)).padStart(2,'0'),ss=String(seconds%60).padStart(2,'0');
    stage.textContent=timer.stageLabel||'Esperando indicación del facilitador';clock.textContent=status==='idle'?'--:--':`${mm}:${ss}`;
    box.classList.toggle('warning',status==='running'&&seconds>0&&seconds<=120);box.classList.toggle('ended',status==='ended'||status==='running'&&seconds===0);
    if(status==='paused')stage.textContent=`${timer.stageLabel||'Etapa'} · Pausado`;
    if(status==='ended'||status==='running'&&seconds===0)stage.textContent=`${timer.stageLabel||'Etapa'} · Tiempo cumplido`;
    timerControl(seconds);
  }
  function refreshLockState(){
    locked=teamLocked||sessionStatus!=='open';
    $('liveSyncBar')?.classList.toggle('live-lock',locked);
    if(sessionStatus==='paused')setSync('error','Experiencia pausada por el facilitador');
    else if(sessionStatus==='closed')setSync('error','Experiencia cerrada por el facilitador');
    else if(teamLocked)setSync('error','Edición pausada por el facilitador');
    else if(!dirty)setSync('saved','Todo guardado');
    if(!locked&&queued){clearTimeout(saveTimer);saveTimer=setTimeout(flush,350)}
    if(timerState)renderTimer();
  }
  function subscribeWorkshop(){
    unsubscribeWorkshop?.();
    unsubscribeWorkshop=db.doc(`workshops/${sessionId}`).onSnapshot(snap=>{if(!snap.exists)return;const data=snap.data();sessionStatus=data.status||'draft';sessionName=data.name||sessionName;timerState=data.timer||null;if($('liveSessionName'))$('liveSessionName').textContent=`${sessionName} · ${sessionId.toUpperCase()}`;refreshLockState();renderTimer();clearInterval(timerTick);timerTick=setInterval(renderTimer,1000)});
  }
  function subscribeTeam(){
    unsubscribeTeam?.();
    unsubscribeTeam=db.doc(`workshops/${sessionId}/teams/${teamId}`).onSnapshot(snap=>{
      if(!snap.exists){setSync('error','Equipo eliminado');return}
      const data=snap.data();teamLocked=!!data.locked;refreshLockState();
      teamName=data.name||teamName;if($('liveTeamName'))$('liveTeamName').textContent=teamName;
      if(!initialApplied){
        applyingRemote=true;
        try{
          const backup=localStorage.getItem(storageKey());
          let fallback=null;try{fallback=backup?JSON.parse(backup)?.teams?.[0]:null}catch(_e){}
          api.applyTeam(data.state||fallback||null,{teamId,teamName});initialApplied=true;
        }finally{applyingRemote=false}
      }
    },()=>setSync('error','Sin conexión · cambios en respaldo local'));
  }
  function subscribeRanking(){
    unsubscribeRanking?.();
    unsubscribeRanking=db.doc(`workshops/${sessionId}/public/ranking`).onSnapshot(snap=>{rankingData=snap.exists?snap.data():null;if(document.getElementById('evaluacion')?.classList.contains('active'))api.refresh()});
  }
  function queueSave(team,progress,metrics){
    if(!live||applyingRemote||locked)return;
    queued={team:JSON.parse(JSON.stringify(team)),progress:JSON.parse(JSON.stringify(progress)),metrics:JSON.parse(JSON.stringify(metrics))};
    dirty=true;setSync('','Guardando…');clearTimeout(saveTimer);saveTimer=setTimeout(flush,SAVE_DELAY);
  }
  async function flush(){
    clearTimeout(saveTimer);if(!live||locked||!queued)return;
    const payload=queued;queued=null;
    try{
      await db.doc(`workshops/${sessionId}/teams/${teamId}`).update({
        name:payload.team.name||teamName,state:payload.team,progress:payload.progress,metrics:payload.metrics,currentSection:currentSection||payload.progress.currentSection||'caso',updatedAt:firebase.firestore.FieldValue.serverTimestamp(),lastSeen:firebase.firestore.FieldValue.serverTimestamp()
      });
      dirty=!!queued;setSync(dirty?'':'saved',dirty?'Guardando…':'Todo guardado');if(queued)saveTimer=setTimeout(flush,350);
    }catch(err){queued=payload;dirty=true;setSync('error',navigator.onLine?'No se pudo guardar · reintentando':'Sin conexión · copia local activa');saveTimer=setTimeout(flush,5000)}
  }
  function heartbeat(){
    if(!live||locked||!db)return;
    db.doc(`workshops/${sessionId}/teams/${teamId}`).update({lastSeen:firebase.firestore.FieldValue.serverTimestamp(),currentSection}).catch(()=>{});
  }
  function noteSection(id){currentSection=id||'caso';if(live)heartbeat()}
  function renderParticipantRanking({winnerSpotlight,evalRows}){
    const rows=Array.isArray(rankingData?.rows)?rankingData.rows:[];
    if(!rankingData?.published||!rows.length){
      winnerSpotlight.className='winner-spotlight empty';winnerSpotlight.innerHTML='<div class="winner-crown">—</div><div><span class="winner-kicker">Resultado pendiente</span><span class="winner-name">El Directorio está evaluando las propuestas</span><span class="winner-meta">El podio se mostrará simultáneamente a todos los equipos cuando el facilitador lo publique.</span></div>';
      evalRows.innerHTML='<tr><td colspan="9">La evaluación y el ranking todavía no fueron publicados.</td></tr>';return;
    }
    const winner=rows[0];winnerSpotlight.className='winner-spotlight';winnerSpotlight.innerHTML=`<div class="winner-crown">1.º</div><div><span class="winner-kicker">Equipo ganador</span><span class="winner-name">${esc(winner.name)}</span><span class="winner-meta">Avance conjunto ${Number(winner.avg||0)}% · Equilibrio ${Number(winner.balance||0)} · ${Number(winner.sp||0)}/18 Story Points</span></div><div class="winner-score"><b>${Number(winner.total||0)}</b><small>Resultado total</small></div>`;
    evalRows.innerHTML=rows.map(r=>{const p=Number(r.position||0),cls=p<=3?`podium-${p}`:'ranking-row';return `<tr class="${cls}"><td><span class="rank-badge ${p<=3?'':'standard'}">${p}.º</span></td><td><b>${esc(r.name)}</b><small>${p===1?'Equipo ganador':p<=3?'En el podio':'Clasificación general'}</small></td><td>Equipo real</td><td>${Number(r.auto||0)}</td><td>${panelScore(r)}/10</td><td><b class="ranking-total">${Number(r.total||0)}</b></td><td>${Number(r.balance||0)}/100</td><td>Evaluado</td><td>${esc(r.evaluation?.comment||'')}</td></tr>`}).join('');
  }
  async function signOutTeam(){
    if(!confirm('¿Salir de este equipo en esta computadora? Los cambios ya sincronizados no se perderán.'))return;
    await flush().catch(()=>{});unsubscribeTeam?.();unsubscribeWorkshop?.();unsubscribeRanking?.();localStorage.removeItem(ACCESS_KEY);await auth?.signOut().catch(()=>{});location.href=location.pathname;
  }
  function initParticipant(callbacks){
    api=callbacks;
    const params=new URLSearchParams(location.search);
    if(params.get('session'))$('accessSession').value=params.get('session');
    if(params.get('team'))$('accessTeam').value=params.get('team');
    $('openDemoMode')?.addEventListener('click',showDemo);
    $('teamAccessForm')?.addEventListener('submit',async e=>{
      e.preventDefault();setMessage('');setAccessBusy(true);
      try{await claimTeam($('accessSession').value,$('accessTeam').value,$('accessPin').value)}
      catch(err){setMessage(err?.message||'No fue posible ingresar.');setAccessBusy(false,'Revisá los datos o consultá al facilitador.');}
    });
    if(params.get('demo')==='1'){showDemo();return}
    if(!configured()){
      showGate();setMessage('La conexión central todavía no fue configurada. Los ejemplos pueden explorarse, pero para una prueba real hay que completar firebase-config.js.');return;
    }
    restoreLive().then(ok=>{if(!ok)showGate()}).catch(()=>showGate());
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
    window.addEventListener('online',()=>{if(live){setSync('','Reconectando…');flush()}});
  }

  window.HoshinCloud={initParticipant,isLiveTeam:()=>live,isApplyingRemote:()=>applyingRemote,queueSave,flush,noteSection,renderParticipantRanking,signOutTeam,localStorageKey:storageKey};
})();
