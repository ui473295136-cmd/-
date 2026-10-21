(function(){
'use strict';
const root=document.getElementById('polarSpotter');
if(!root)return;
const $=id=>document.getElementById(id),KEY='ganlu-polar-spotter-v1';
// Poster composition coordinates. The actual hotspots are positioned over photographic artwork.
const layouts=[
 [{x:18,y:42},{x:73,y:39},{x:17,y:63},{x:76,y:63},{x:42,y:80},{x:75,y:83}],
 [{x:17,y:42},{x:75,y:39},{x:22,y:62},{x:78,y:65},{x:41,y:80},{x:74,y:84}],
 [{x:18,y:41},{x:77,y:42},{x:19,y:64},{x:75,y:65},{x:43,y:80},{x:77,y:84}],
 [{x:17,y:43},{x:74,y:42},{x:20,y:65},{x:76,y:62},{x:42,y:80},{x:77,y:83}],
 [{x:18,y:42},{x:74,y:40},{x:18,y:65},{x:77,y:64},{x:43,y:80},{x:77,y:84}]
];
const posterPhotography=[
 {src:'https://images.unsplash.com/photo-1549320905-b26658a67e83?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'Paul Carroll · Unsplash'},
 {src:'https://images.unsplash.com/photo-1551988098-87513d4cdaa3?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'Unsplash · South Georgia'},
 {src:'https://images.unsplash.com/photo-1561470230-cc0222ef2f5b?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'NOAA · Public Domain'},
 {src:'https://images.unsplash.com/photo-1587125297534-f8fddb8c52d7?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'Annie Spratt · Unsplash'},
 {src:'https://images.unsplash.com/photo-1648821231292-e17eddf2fca8?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'66°North · Unsplash'}
];
const posters=[
 {name:'南极半岛 · 离谱宣传',tag:'01 / 半岛探险',theme:'antarctic',headline:'冰川边上的奇遇',
  deck:'ANTARCTIC PENINSULA',icon:'🐧',highlights:['蓝冰峡湾','冲锋舟探索'],
  errors:[
   ['🐻‍❄️ 南极北极熊观测区','野生北极熊生活在北极，不在南极半岛。'],
   ['📍 乌斯怀亚 · 智利','乌斯怀亚位于阿根廷，不是智利。'],
   ['🚢 600人全员登陆','载客超过500人的船不能组织南极游客登陆。'],
   ['☀️ 保证每天都登陆','天气和冰况会影响活动，不能保证每天登陆。'],
   ['🐧 免费抱企鹅合影','禁止随意触摸、追逐或投喂野生企鹅。'],
   ['✈️ 船去飞回＝飞去船回','船去飞回是去程乘船、返程乘机，不能写反。']
  ],
  correct:[['🏔️ 南极半岛海岸',24,29],['🚤 冲锋舟接驳',76,29],['🧊 海冰与冰川',36,92]]},
 {name:'南乔治亚 · 王企鹅迷局',tag:'02 / 南乔治亚',theme:'georgia',headline:'走进王企鹅的王国',
  deck:'SOUTH GEORGIA',icon:'🐧',highlights:['探访企鹅群落','岛屿探险'],
  errors:[
   ['🧭 南乔治亚位于北极圈','南乔治亚位于南大西洋的亚南极地区，不在北极圈。'],
   ['🐧 成群的帝企鹅','这里著名的是王企鹅大型繁殖群落，不是帝企鹅繁殖群。'],
   ['📸 王企鹅保证出现','野生动物观赏情况受季节、天气和自然活动影响，不能保证。'],
   ['🌊 所有站点都保证登陆','上岸需满足海况与安全要求，登陆点可能调整。'],
   ['🤲 小企鹅可抱走合照','不可以抱、摸或干扰企鹅，游客必须遵守探险队指引。'],
   ['🛬 乔治王岛＝南乔治亚','乔治王岛在南设得兰群岛，和南乔治亚不是同一座岛。']
  ],
  correct:[['🌿 亚南极海岛',24,29],['🐧 王企鹅栖息地',73,29],['🚢 长距离航行',35,92]]},
 {name:'飞越德雷克 · 神奇航班',tag:'03 / 飞船路线',theme:'flight',headline:'飞越海峡 · 抵达冰原',
  deck:'FLY THE DRAKE',icon:'✈️',highlights:['空海联程','登陆探险'],
  errors:[
   ['✈️ 布宜诺斯艾利斯直飞南极','常见飞船航线从智利蓬塔阿雷纳斯起飞，不能直接按此安排。'],
   ['🛬 飞机直降南极点','常见飞船航线抵达乔治王岛附近，并非南极点。'],
   ['🌊 飞越德雷克就不可能晕船','部分飞船产品仍有海上航段，不能保证不会晕船。'],
   ['☀️ 风雨无阻百分百起飞','极地航班受天气制约，可能延误或调整。'],
   ['🚢 飞去船回＝双程飞机','飞去船回通常是去程飞行，回程乘船。'],
   ['🧭 乔治王岛位于北极','乔治王岛位于南设得兰群岛，在南极半岛附近。']
  ],
  correct:[['🇨🇱 蓬塔阿雷纳斯',25,28],['🛬 乔治王岛',75,28],['🧭 海陆空衔接',36,92]]},
 {name:'北极三岛 · 熊出没',tag:'04 / 北极探险',theme:'arctic',headline:'追寻北方冰雪世界',
  deck:'HIGH ARCTIC',icon:'🐻‍❄️',highlights:['斯瓦尔巴群岛','极地动物'],
  errors:[
   ['🐧 斯瓦尔巴野生企鹅群','企鹅并非北极地区的原生野生动物。'],
   ['🐻‍❄️ 北极熊100%必见','北极熊是野生动物，无法保证每个航次都能见到。'],
   ['📍 斯瓦尔巴属于南极','斯瓦尔巴群岛位于北极地区，是挪威领地。'],
   ['🌚 北极夏天全天黑夜','北极高纬地区夏季可出现极昼，并非全天黑夜。'],
   ['🤗 下船拥抱北极熊','北极熊具有危险性，严禁靠近、投喂或接触。'],
   ['🧊 冰岛和格陵兰是同一岛','冰岛与格陵兰是不同地区，路线和航程也不同。']
  ],
  correct:[['🌌 北极高纬航线',25,28],['🐻‍❄️ 北极熊栖息地',72,28],['🔭 安全观兽距离',36,92]]},
 {name:'南极连走 · 大满贯',tag:'05 / 双航次连线',theme:'grand',headline:'一次远行 · 双重探险',
  deck:'DOUBLE EXPEDITION',icon:'🚢',highlights:['双岛＋南极圈','连走深度体验'],
  errors:[
   ['💴 1122客户每单加5万','1122已报名客户连走，追加费用为每人5万元，不是整单5万元。'],
   ['💴 1204客户每单加8万','1204已报名客户连走，追加费用为每人8万元，不是整单8万元。'],
   ['🔁 两期登陆点保证零重复','按现计划长城站拜访可能重复，其它点也受天气安排影响。'],
   ['🛏️ 两期连走保证不换房','两期衔接可能需要换房，不能保证同一舱房。'],
   ['📍 南乔治亚就是南极圈','南乔治亚岛和南极圈是不同的地理概念。'],
   ['☀️ 所有登陆点全部保证','探险活动受安全、天气和冰况制约，不保证全部实现。']
  ],
  correct:[['🇦🇷 阿根廷往返',24,28],['🚢 船去船回',73,28],['🧭 深度探险计划',38,92]]}
];
function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function recover(){
 let s;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!s||!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Array.isArray(s.found))return {stage:0,found:[[],[],[],[],[]],complete:false};
 const found=posters.map((p,i)=>[...new Set((Array.isArray(s.found[i])?s.found[i]:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<p.errors.length))]);
 return {stage:s.stage,found,complete:s.stage===5||!!s.complete};
}
let state=recover(),active=false,wonTimer=0,lastBadTimer=0;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
// Backgrounds are actual expedition photographs. CSS adds a documentary title and advertisement misprints.
function safeCoordinate(n){return Math.min(95,Math.max(0,Number(n)||0));}
function posterMarkup(p,i){
 const found=state.found[i],photo=posterPhotography[i];
 const hotspots=p.errors.map((item,index)=>{
  const pos=layouts[i][index],hit=found.includes(index);
  return '<button type="button" class="spotterClue spotterClue'+index+(hit?' found':'')+'" style="--sx:'+safeCoordinate(pos.x)+'%;--sy:'+safeCoordinate(pos.y)+'%" data-spot-id="'+index+'" aria-label="'+escapeHTML(item[0])+'" aria-pressed="'+hit+'">'
   +'<span class="spotterClueText">'+escapeHTML(item[0])+'</span><span class="spotterFoundMark" aria-hidden="true">'+(hit?'✓':'')+'</span>'
   +'</button>';
 }).join('');
 const honest=p.correct.map(([label,x,y],index)=>
  '<button type="button" class="spotterClue spotterClueTrue spotterDecoy'+index+'" style="--sx:'+safeCoordinate(x)+'%;--sy:'+safeCoordinate(y)+'%" data-spot-true="'+index+'" aria-label="'+escapeHTML(label)+'">'
  +escapeHTML(label)+'</button>').join('');
 return '<div class="spotterPoster spotterPhotoScene spotterTheme-'+p.theme+'" id="spotterPosterCanvas" role="group" aria-label="'+escapeHTML(p.name)+'。在海报上点击找出6处不合理的细节">'
  +'<div class="spotterPosterArt"><img class="spotterPhoto" loading="eager" decoding="async" src="'+photo.src+'" alt=""/><div class="spotterPhotoFallback"></div></div>'
  +'<div class="spotterPhotoGrain" aria-hidden="true"></div>'
  +'<div class="spotterPosterTop"><div class="spotterPosterBrand">CHUANKE <span>EXPEDITION FILES</span></div>'
  +'<div class="spotterPosterSerial">FIELD NOTES / 0'+(i+1)+'</div>'
  +'<div class="spotterPosterDeck">'+escapeHTML(p.deck)+'</div><h3>'+escapeHTML(p.headline)+'</h3>'
  +'<div class="spotterPosterSubtitle">'+p.highlights.map(x=>'<span>'+escapeHTML(x)+'</span>').join('<i>—</i>')+'</div></div>'
  +'<div class="spotterStampLayer">'+hotspots+honest+'</div>'
  +'<div class="spotterPosterBottom"><span>船客 · 极地旅行创意海报</span><span>资料视觉：'+escapeHTML(photo.credit)+'</span></div></div>';
}
function showFeedback(message,kind){
 const el=$('spotterFeedback');el.textContent=message;el.className='spotterFeedback '+(kind||'');el.hidden=false;
}
function updateProgress(){
 $('spotterStage').textContent='海报 '+Math.min(5,state.stage+1)+' / 5';
 $('spotterFoundCount').textContent=(state.found[state.stage]||[]).length+' / 6';
 $('spotterProgressFill').style.width=(Math.min(5,state.stage)/5*100)+'%';
 $('spotterPosterTabs').innerHTML=posters.map((p,i)=>'<span class="spotterTab '+(i<state.stage?'done':i===state.stage?'active':'upcoming')+'">'+(i<state.stage?'✓':i+1)+'</span>').join('');
}
function display(){
 if(!active)return;
 $('spotterTeaser').hidden=true;$('spotterPlay').hidden=false;
 if(state.complete){renderComplete();return;}
 const p=posters[state.stage];
 $('spotterCase').textContent=p.name;
 $('spotterPosterMount').innerHTML=posterMarkup(p,state.stage);
 $('spotterNext').hidden=state.found[state.stage].length<6;
 $('spotterRetry').disabled=state.found[state.stage].length===0;
 updateProgress();
 const remaining=6-state.found[state.stage].length;
 $('spotterFeedback').hidden=remaining===6;
 if(remaining===0)showFeedback('6处全部找到了！'+(state.stage===4?' 正在颁发认证卡。':' 点击进入下一张。'),'good');
}
function renderComplete(){
 $('spotterCase').textContent='五张海报全部识破';
 $('spotterStage').textContent='5 / 5 通关';
 $('spotterFoundCount').textContent='30 / 30';
 $('spotterProgressFill').style.width='100%';
 $('spotterPosterTabs').innerHTML=posters.map(()=>'<span class="spotterTab done">✓</span>').join('');
 $('spotterPosterMount').innerHTML='<div class="spotterCompletePanel"><div>🏆</div><strong>极地找茬 · 全部通关</strong><span>30处错误全部识破</span><button type="button" id="spotterShowMedal" class="spotterBtn spotterBtnGold">查看金色认证卡</button></div>';
 $('spotterNext').hidden=true;
 $('spotterRetry').disabled=false;
 showFeedback('已解锁「船客 · 极地打假总督」。','good');
}
function open(){
 active=true;
 root.hidden=false;
 display();
 root.scrollIntoView({behavior:'smooth',block:'start'});
 if(state.complete)award();
}
function next(){
 if(state.complete||state.found[state.stage].length!==6)return;
 clearTimeout(wonTimer);
 if(state.stage<4){state.stage++;persist();display();}
 else{state.complete=true;state.stage=5;persist();display();award();}
}
function spot(event){
 const error=event.target.closest('[data-spot-id]'),truth=event.target.closest('[data-spot-true]');
 if(!error&&!truth){showFeedback('这处没发现问题，换个地方看看。','neutral');return;}
 if(truth){
  showFeedback('这处没错：'+truth.textContent.trim()+'。再找找。','neutral');
  truth.classList.add('spotterMistake');
  clearTimeout(lastBadTimer);
  lastBadTimer=setTimeout(()=>truth.classList.remove('spotterMistake'),650);
  return;
 }
 const id=Number(error.getAttribute('data-spot-id'));
 if(state.complete||id<0||id>=6||state.found[state.stage].includes(id))return;
 state.found[state.stage].push(id);
 persist();
 const item=posters[state.stage].errors[id];
 error.classList.add('found');error.setAttribute('aria-pressed','true');
 error.querySelector('.spotterFoundMark').textContent='✓';
 updateProgress();
 showFeedback('找到了！'+item[1],'good');
 if(state.found[state.stage].length===6){
  $('spotterNext').hidden=false;
  $('spotterRetry').disabled=false;
  showFeedback(state.stage===4?'30处错误全部找到了，准备领取金色认证。':'本张6处错误全部找到，可以进入下一张。','good');
  if(state.stage===4){clearTimeout(wonTimer);wonTimer=setTimeout(next,1100);}
 }else $('spotterRetry').disabled=false;
}
function restartPoster(){
 if(state.complete){if(!window.confirm('从第一张海报重新挑战？'))return;state={stage:0,found:[[],[],[],[],[]],complete:false};}
 else state.found[state.stage]=[];
 clearTimeout(wonTimer);persist();display();
}
function resetAll(){
 if(!window.confirm('重新挑战全部五张海报？'))return;
 clearTimeout(wonTimer);
 state={stage:0,found:[[],[],[],[],[]],complete:false};
 persist();display();
}
function award(){
 const overlay=$('spotterAwardOverlay');
 overlay.hidden=false;
 document.body.classList.add('spotterNoScroll');
 requestAnimationFrame(()=>overlay.classList.add('spotterAwardVisible'));
 $('spotterAwardClose').focus();
}
function closeAward(){
 const overlay=$('spotterAwardOverlay');
 overlay.classList.remove('spotterAwardVisible');
 overlay.hidden=true;
 document.body.classList.remove('spotterNoScroll');
}
function downloadCard(){
 const canvas=document.createElement('canvas');
 canvas.width=1200;canvas.height=1500;
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const bg=ctx.createLinearGradient(0,0,1200,1500);
 bg.addColorStop(0,'#09283b');bg.addColorStop(.48,'#1f343d');bg.addColorStop(1,'#061824');
 ctx.fillStyle=bg;ctx.fillRect(0,0,1200,1500);
 ctx.strokeStyle='#d9b96d';ctx.lineWidth=5;ctx.strokeRect(72,72,1056,1356);
 ctx.strokeStyle='#866b42';ctx.lineWidth=2;ctx.strokeRect(91,91,1018,1318);
 const halo=ctx.createRadialGradient(600,560,20,600,560,490);
 halo.addColorStop(0,'rgba(246,211,130,.21)');halo.addColorStop(1,'rgba(246,211,130,0)');
 ctx.fillStyle=halo;ctx.fillRect(0,0,1200,1500);
 ctx.textAlign='center';ctx.fillStyle='#c5ab72';
 ctx.font='500 32px "Songti SC","STSong",serif';ctx.fillText('船 客 · 极 地 探 索',600,227);
 ctx.font='180px serif';ctx.fillText('✦',600,508);
 ctx.font='600 30px "Songti SC","STSong",serif';ctx.fillText('HIDDEN CHALLENGE COMPLETED',600,630);
 ctx.font='bold 70px "Songti SC","STSong",serif';ctx.fillStyle='#f5dc9b';ctx.fillText('极地打假总督',600,781);
 ctx.font='600 39px "Songti SC","STSong",serif';ctx.fillStyle='#c9b382';ctx.fillText('船客 · 专属认证',600,858);
 ctx.strokeStyle='#967f50';ctx.beginPath();ctx.moveTo(340,934);ctx.lineTo(860,934);ctx.stroke();
 ctx.font='500 34px "Songti SC","STSong",serif';ctx.fillText('5 张海报 · 30 处错误全部识破',600,1045);
 ctx.font='500 27px sans-serif';ctx.fillText('CHUANKE  ·  POLAR EXPEDITION',600,1320);
 const link=document.createElement('a');link.download='船客-极地打假总督认证卡.png';link.href=canvas.toDataURL('image/png');document.body.appendChild(link);link.click();link.remove();
}
$('spotterTeaserStart').addEventListener('click',open);
document.querySelectorAll('[data-spotter-open]').forEach(btn=>btn.addEventListener('click',open));
$('spotterPosterMount').addEventListener('click',e=>{
 if(e.target.closest('#spotterShowMedal')){award();return;}
 spot(e);
});
$('spotterNext').addEventListener('click',next);
$('spotterRetry').addEventListener('click',restartPoster);
$('spotterAllReset').addEventListener('click',resetAll);
$('spotterAwardClose').addEventListener('click',closeAward);
$('spotterAwardAgain').addEventListener('click',()=>{closeAward();resetAll()});
$('spotterAwardDownload').addEventListener('click',downloadCard);
$('spotterAwardOverlay').addEventListener('click',e=>{if(e.target===$('spotterAwardOverlay'))closeAward()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('spotterAwardOverlay').hidden)closeAward()});
window.GanluSpotter={open,getProgress:()=>JSON.parse(JSON.stringify(state)),posters,spot,next,restartPoster,resetAll};
})();