(function(){
'use strict';
const root=document.getElementById('polarSpotter');
if(!root)return;
const $=id=>document.getElementById(id),KEY='ganlu-polar-spotter-v3';
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
 {src:'https://images.unsplash.com/photo-1675130938824-b6a07de7e015?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'Unsplash · South Georgia'},
 {src:'https://images.unsplash.com/photo-1745282398449-cc6ce4f2afda?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'NOAA · Public Domain'},
 {src:'https://images.unsplash.com/photo-1661511762608-fda6b7b45f18?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'Annie Spratt · Unsplash'},
 {src:'https://images.unsplash.com/photo-1662142442563-c0f5045e862e?w=1440&h=930&fit=crop&crop=entropy&q=82',credit:'66°North · Unsplash'}
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
// Image-only challenges: six visual anomalies per scene, no text rendered on the picture.
const sceneObjects=[
 [['🐻‍❄️',16,62,96],['🌴',82,55,91],['✈️',24,23,87],['balloon',76,22,92],['🐪',45,80,82],['🦩',78,83,78]],
 [['🐻‍❄️',17,59,88],['🌵',77,47,86],['🦒',35,77,77],['🦩',78,83,77],['🏖️',48,43,81],['🐪',59,81,82]],
 [['🌴',16,61,85],['🐪',75,65,82],['balloon',25,22,89],['🐻‍❄️',83,38,90],['🦩',42,82,77],['🦒',77,82,77]],
 [['🐧',17,67,81],['🦩',75,64,78],['🌴',44,72,90],['🐪',81,82,81],['🦒',73,30,83],['🪸',26,39,80]],
 [['🐻‍❄️',17,61,86],['🌴',76,51,90],['🏖️',38,81,79],['🦩',78,81,78],['🐪',55,67,80],['balloon',28,23,82]]
];
const visualExplanations=[
 ['南极半岛没有野生北极熊，北极熊生活在北极。','热带椰树不会生长在南极半岛的冰川海岸。','一般客运航班不能当成飞越德雷克的常规接驳方式；要看船司的特定极地航班安排。','乘坐热气球并不是南极探险航次的常规保证项目。','骆驼并不生活在南极。','火烈鸟不是南极半岛的野生鸟类。'],
 ['南乔治亚岛没有野生北极熊，当地闻名的是王企鹅群落。','这里不是热带干旱区，不会出现这种沙漠仙人掌。','长颈鹿不是南乔治亚的野生动物。','火烈鸟并非南乔治亚的典型鸟类。','企鹅栖息地不是可随意布置休闲设施的海滨浴场。','骆驼并非南乔治亚岛的野生动物。'],
 ['南极极地机场周边没有热带椰树。','骆驼并不生活在南极。','常见飞船旅行从智利蓬塔阿雷纳斯乘飞机飞越德雷克，不是坐热气球。','乔治王岛及周边南极地区没有野生北极熊。','火烈鸟不属于南极半岛野生鸟类。','长颈鹿不生活在南极。'],
 ['北极没有自然分布的野生企鹅群落。','火烈鸟不是斯瓦尔巴高北极地区的常见野生鸟类。','斯瓦尔巴不会生长热带海滩的椰子树。','骆驼不栖息在北极海冰上。','长颈鹿不分布于北极。','热带珊瑚礁不会出现在斯瓦尔巴海岸的冰雪环境中。'],
 ['南极半岛和南乔治亚都没有野生北极熊。','双岛与南极航线不是热带椰林度假区。','南极登陆须遵守野生动物及环境保护规则，不能把企鹅栖息地当沙滩浴场。','火烈鸟不是南极代表性野生鸟类。','骆驼并非双岛极地探险的当地动物。','双航次连走是邮轮探险路线，不含日常热气球观光项目。']
];
posters.forEach((p,i)=>{p.errors=visualExplanations[i].map((why,k)=>['画面中的异常物体'+(k+1),why]);});
function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function recover(){
 let s;try{s=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!s||!Number.isInteger(s.stage)||s.stage<0||s.stage>5||!Array.isArray(s.found))return {stage:0,found:[[],[],[],[],[]],complete:false};
 const found=posters.map((p,i)=>[...new Set((Array.isArray(s.found[i])?s.found[i]:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<p.errors.length))]);
 return {stage:s.stage,found,complete:s.stage===5||!!s.complete};
}
let state=recover(),active=false,wonTimer=0,lastBadTimer=0;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
// Only one photographic picture is displayed; the wrong objects are part of its composition.
function posterMarkup(p,i){
 const image=posterPhotography[i];
 const art=sceneObjects[i].map(item=>{
  const [glyph,xx,yy,size]=item,x=xx*10,y=yy*6.67;
  if(glyph==='balloon')return '<g class="spotterVisualObject" transform="translate('+x+' '+y+')"><ellipse cy="-21" rx="'+size*.27+'" ry="'+size*.41+'" fill="#db7750" stroke="#fee4ba" stroke-width="2"/><path d="M0 -'+size*.6+'v'+size*.6+'" stroke="#f5ca80" stroke-width="12" opacity=".65"/><path d="M-'+size*.21+' 10L-'+size*.12+' 29M'+size*.21+' 10L'+size*.12+' 29" stroke="#ffe4b7" stroke-width="2"/><rect x="-'+size*.18+'" y="29" width="'+size*.36+'" height="'+size*.2+'" fill="#866140" rx="2"/></g>';
  return '<text class="spotterVisualObject" x="'+x+'" y="'+y+'" text-anchor="middle" dominant-baseline="central" font-size="'+size+'" font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">'+glyph+'</text>';
 }).join('');
 const saved=state.found[i].map(k=>{
  const pt=sceneObjects[i][k];
  return '<span class="spotterFoundPin" style="left:'+pt[1]+'%;top:'+pt[2]+'%">✓</span>';
 }).join('');
 return '<div class="spotterPicture" id="spotterPosterCanvas" role="img" aria-label="极地图片找茬画面，点击你认为有错误的物体">'
  +'<img class="spotterPicturePhoto" src="'+image.src+'" alt="" decoding="async" loading="eager" draggable="false">'
  +'<svg class="spotterPictureObjects" viewBox="0 0 1000 667" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+art+'</svg>'
  +'<div class="spotterPicturePins" aria-hidden="true">'+saved+'</div></div>';
}
function targetFromClick(event){
 const image=$('spotterPosterCanvas');
 if(!image||!Number.isFinite(event.clientX)||!Number.isFinite(event.clientY))return null;
 const rect=image.getBoundingClientRect();
 if(!rect||!rect.width||!rect.height)return null;
 const x=(event.clientX-rect.left)*100/rect.width,y=(event.clientY-rect.top)*100/rect.height;
 return x>=0&&x<=100&&y>=0&&y<=100?{x,y}:null;
}
function matchPoint(scene,point,mobile){
 let best=-1,score=Infinity;
 scene.forEach((obj,i)=>{
  const dx=(point.x-obj[1])/(mobile?10.7:8.6),dy=(point.y-obj[2])/(mobile?13.5:11.8);
  const d=dx*dx+dy*dy;
  if(d<=1&&d<score){best=i;score=d;}
 });
 return best;
}
function addFeedbackPin(point,good){
 const image=$('spotterPosterCanvas');if(!image)return;
 const pin=document.createElement('span');
 pin.className=good?'spotterFoundPin':'spotterMissPin';
 pin.textContent=good?'✓':'×';
 pin.style.left=point.x+'%';pin.style.top=point.y+'%';
 (good?image.querySelector('.spotterPicturePins'):image).appendChild(pin);
 if(!good)setTimeout(()=>pin.remove(),700);
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
 $('spotterPlay').hidden=false;
 if(state.complete){renderComplete();return;}
 const p=posters[state.stage];
 $('spotterCase').textContent=p.name;
 $('spotterPosterMount').innerHTML=posterMarkup(p,state.stage);
 const background=$('spotterPosterMount').querySelector('.spotterPicturePhoto');
 if(background)background.addEventListener('error',function(){
   if(this.dataset.fallback!=='tried'){this.dataset.fallback='tried';this.src='https://images.unsplash.com/photo-1549320905-b26658a67e83?w=1440&h=960&fit=crop&q=80';}
   else{this.hidden=true;}
 });
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
 if(state.complete||state.stage>=5)return;
 const click=targetFromClick(event);if(!click)return;
 const index=matchPoint(sceneObjects[state.stage],click,window.innerWidth<650);
 if(index===-1){
  showFeedback('这处没有发现异常，再找找。','neutral');
  addFeedbackPin(click,false);
  return;
 }
 if(state.found[state.stage].includes(index)){
  showFeedback('这一处已经找过了。','neutral');return;
 }
 state.found[state.stage].push(index);
 persist();
 const obj=sceneObjects[state.stage][index];
 addFeedbackPin({x:obj[1],y:obj[2]},true);
 updateProgress();
 showFeedback('找到了！'+posters[state.stage].errors[index][1],'good');
 $('spotterRetry').disabled=false;
 if(state.found[state.stage].length===6){
  $('spotterNext').hidden=false;
  showFeedback('本张6处错误全部找到！','good');
  if(state.stage===4){clearTimeout(wonTimer);wonTimer=setTimeout(next,1300);}
 }
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
document.querySelectorAll('[data-spotter-open]').forEach(btn=>btn.addEventListener('click',open));
$('spotterPosterMount').addEventListener('click',e=>{
 if(e.target.closest('#spotterShowMedal')){award();return;}
 if(e.target.closest('#spotterPosterCanvas'))spot(e);
});
$('spotterNext').addEventListener('click',next);
$('spotterRetry').addEventListener('click',restartPoster);
$('spotterAllReset').addEventListener('click',resetAll);
$('spotterAwardClose').addEventListener('click',closeAward);
$('spotterAwardAgain').addEventListener('click',()=>{
 closeAward();
 clearTimeout(wonTimer);
 state={stage:0,found:[[],[],[],[],[]],complete:false};
 persist();display();
});
$('spotterAwardDownload').addEventListener('click',downloadCard);
$('spotterAwardOverlay').addEventListener('click',e=>{if(e.target===$('spotterAwardOverlay'))closeAward()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('spotterAwardOverlay').hidden)closeAward()});
window.GanluSpotter={open,getProgress:()=>JSON.parse(JSON.stringify(state)),posters,spot,next,restartPoster,resetAll};
})();