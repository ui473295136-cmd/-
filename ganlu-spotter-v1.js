(function(){
'use strict';
const root=document.getElementById('polarSpotter');
if(!root)return;
const $=id=>document.getElementById(id),KEY='ganlu-polar-proofread-v4';
const posters=[{"name":"南极半岛 · 行程审核","group":["登船与航路","户外探险","安全与生物保护"],"lines":[["许多南极半岛船游从阿根廷乌斯怀亚登船。",-1,""],["乌斯怀亚是智利的一座主要南极登船港。",0,"乌斯怀亚位于阿根廷，不是智利。"],["从乌斯怀亚南下通常需要经过德雷克海峡。",-1,""],["乌斯怀亚出发的南极船游无需穿越德雷克海峡。",1,"这一航路通常需要穿过德雷克海峡。"],["载客800人的邮轮可以安排所有游客南极登陆。",2,"IAATO规则：载客超过500人的邮轮不能组织游客登陆。"],["登陆与冲锋舟巡游是不同的户外活动。",-1,""],["天气再差，交了船票就能要求探险队强行登陆。",3,"南极登陆取决于天气、海况和安全条件。"],["登陆靴与装备清洁有助于减少外来生物传播。",-1,""],["企鹅走近时，可以抱起来合影留念。",4,"不能触摸、投喂、追逐或干扰企鹅。"],["探险团队会根据实际条件调整活动安排。",-1,""],["比较南极行程，应看有效探险时间而不仅是总天数。",-1,""],["高价船票可以保证每天两次登陆，无论天气。",5,"探险活动受天气、冰况和现场安全条件制约。"]]},{"name":"南乔治亚 · 企鹅档案","group":["岛屿位置","野生动物","行程与规则"],"lines":[["南乔治亚岛位于南大西洋的亚南极地区。",-1,""],["南乔治亚岛属于北极圈内的斯瓦尔巴群岛。",0,"南乔治亚在南大西洋，斯瓦尔巴位于北极。"],["南乔治亚以大型王企鹅繁殖群落闻名。",-1,""],["南乔治亚最著名的是帝企鹅大型繁殖群落。",1,"南乔治亚闻名的是王企鹅，不是帝企鹅。"],["南乔治亚岛就是乔治王岛的另一种译名。",2,"乔治王岛位于南设得兰群岛，两者并非同一座岛。"],["王企鹅是野生动物，出现位置与数量可能变化。",-1,""],["所有南乔治亚航次都保证上岸与王企鹅合影。",3,"天气和动物自然活动不可保证，登陆也可能取消。"],["登陆需要听从探险队指挥与现场安排。",-1,""],["企鹅不怕人，游客可以摸幼企鹅的绒毛。",4,"不可以触摸或干扰野生企鹅。"],["包含南乔治亚的深度航线通常需要较长海上航行。",-1,""],["所有经典南极半岛短线都会顺便停靠南乔治亚。",5,"许多经典南极半岛航线并不包括南乔治亚。"],["探险航次可因天气调整停靠点与登陆安排。",-1,""]]},{"name":"飞越德雷克 · 航空核验","group":["出发与接驳","航行模式","天气与保障"],"lines":[["典型的南极飞船航线从智利蓬塔阿雷纳斯起飞。",-1,""],["常见的飞船旅行从布宜诺斯艾利斯直飞南极点。",0,"通常从蓬塔阿雷纳斯飞往乔治王岛附近，不是南极点。"],["常见飞船航线抵达南设得兰群岛的乔治王岛附近。",-1,""],["飞越德雷克的游客通常在南极点旁换乘邮轮。",1,"常见飞船接驳区域为乔治王岛附近，并非南极点。"],["船去飞回一般是去程乘船、返程乘飞机。",-1,""],["飞去船回表示去程回程全部乘飞机。",2,"飞去船回通常是去程飞行、返程坐船。"],["飞越德雷克意味着全程完全不坐船、不可能晕船。",3,"飞船产品仍有海上航行，不能保证完全不晕船。"],["飞越德雷克有助于缩短某个方向的海上航行。",-1,""],["极地天气稳定，飞船航班可以承诺百分百准时。",4,"极地航班易受天气和机场条件影响。"],["为极地飞行预留衔接余量是合理的。",-1,""],["只要多花钱，天气不佳也能保证当天起飞。",5,"没有费用可以改变极地天气和飞行安全限制。"],["订飞船产品时需要明确飞行和乘船分别是哪一段。",-1,""]]},{"name":"北极三岛 · 极地核查","group":["地理与环境","野生动物","负责任探险"],"lines":[["斯瓦尔巴群岛位于北极地区，属于挪威。",-1,""],["斯瓦尔巴是南极半岛附近的岛群。",0,"斯瓦尔巴位于北极，并不靠近南极半岛。"],["北极熊是斯瓦尔巴的重要野生动物之一。",-1,""],["参加北极航次就保证百分之百能看到北极熊。",1,"野生北极熊的出现无法保证。"],["北极熊和南极企鹅通常在同一野外海滩生活。",2,"北极熊生活在北极，企鹅主要分布于南半球。"],["高北极登陆安排需要参考安全与动物活动。",-1,""],["高北极夏天是全天24小时黑夜。",3,"高北极夏季出现极昼，冬季才可能有极夜。"],["在北极应与野生动物保持安全距离。",-1,""],["北极熊靠近时，游客可以下船摸熊并合影。",4,"北极熊具有危险性，不能靠近或接触。"],["冰岛与格陵兰是不同的旅行目的地。",-1,""],["冰岛和格陵兰只是同一座岛的两个名字。",5,"冰岛和格陵兰并不是同一座岛。"],["高纬度海冰与天气变化会影响探险计划。",-1,""]]},{"name":"1122 × 1204 · 连走审核","group":["1122加价规则","1204与签证","连走注意事项"],"lines":[["1122已报名客户连走，按每人追加5万元计算。",-1,""],["1122两位客人连走，在整份订单上只需加5万元。",0,"5万元是每人追加费用，两人应共追加10万元。"],["1122和1204连走名额按项目组通知上限10人。",-1,""],["1204客户连走的追加8万元是按整单计算。",1,"1204追加8万元也是按每人计算。"],["1204已报名客人连走，按每人追加8万元。",-1,""],["双航次连走时，客人的舱房号保证完全不变。",2,"两期衔接可能需要调换客房。"],["两期衔接时需要提前说明可能发生换房。",-1,""],["两期所有登陆点都百分百不重复，包括长城站。",3,"当前计划长城站拜访重复，其它地点还受天气影响。"],["按当前计划，两段长城站的拜访可能重复。",-1,""],["南乔治亚岛就是南极圈，两个名称可以互换。",4,"南乔治亚岛与南极圈是不同的地理概念。"],["连走计划按阿根廷往返、船去船回设计。",-1,""],["连走客人无需核实证件，任何护照都可以直接出发。",5,"项目组明确提及阿根廷签证，仍要核实旅客签证与证件。"]]}];
const COUNT=6;
const blank=()=>({stage:0,found:[[],[],[],[],[]],reviewed:[[],[],[],[],[]],complete:false});
function read(){
 let o;try{o=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
 if(!o||!Number.isInteger(o.stage)||o.stage<0||o.stage>5)return blank();
 const found=posters.map((d,i)=>[...new Set((Array.isArray(o.found?.[i])?o.found[i]:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<COUNT))]);
 const reviewed=posters.map((d,i)=>[...new Set((Array.isArray(o.reviewed?.[i])?o.reviewed[i]:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<12&&d.lines[n][1]<0))]);
 return {stage:o.stage,found,reviewed,complete:o.stage===5||!!o.complete};
}
let state=read(),active=false,winTimer=null;
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function escapeHTML(v){return String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function posterMarkup(d,stage){
 const pieces=d.group.map((heading,j)=>{
  const lines=d.lines.slice(j*4,j*4+4).map(([value,wrong,explain],k)=>{
   const index=j*4+k;
   const corrected=wrong>=0&&state.found[stage].includes(wrong);
   const verified=wrong<0&&state.reviewed[stage].includes(index);
   return '<button class="spotterProofLine'+(corrected?' spotterProofMarked':'')+(verified?' spotterProofVerified':'')+'" data-proof-index="'+index+'" type="button" aria-pressed="'+(corrected||verified)+'">'
    +'<span class="spotterProofIndex">'+String(index+1).padStart(2,'0')+'</span>'
    +'<span class="spotterProofClaim">'+escapeHTML(value)
    +(corrected?'<span class="spotterProofCorrection">勘误：'+escapeHTML(explain)+'</span>':'')+'</span>'
    +(corrected?'<span class="spotterProofStamp">已纠错 ✓</span>':verified?'<span class="spotterProofStamp verified">已核实</span>':'<span class="spotterProofDot" aria-hidden="true">○</span>')
    +'</button>';
  }).join('');
  return '<section class="spotterProofSection"><header><span>0'+(j+1)+'</span><strong>'+escapeHTML(heading)+'</strong></header><div class="spotterProofLines">'+lines+'</div></section>';
 }).join('');
 return '<article id="spotterPosterCanvas" class="spotterProofSheet" aria-label="待审核极地宣传资料">'
  +'<div class="spotterProofTop"><span>CHUANKE · EXPEDITION REVIEW</span><span>FILE '+String(stage+1).padStart(2,'0')+' / 05</span></div>'
  +'<div class="spotterProofTitleRow"><div><span>POLAR EDITORIAL DESK</span><h3>'+escapeHTML(d.name)+'</h3></div><span class="spotterProofSeal" aria-hidden="true">待<br>审</span></div>'
  +'<div class="spotterProofRule"><span>旅行宣传资料 · 待审核</span><span>12条陈述 / 找出其中6处问题</span></div>'
  +'<div class="spotterProofGroups">'+pieces+'</div>'
  +'<footer class="spotterProofFooter"><span>点击可疑陈述进行批改</span><span>✦ CHUANKE ✦</span></footer></article>';
}
function showFeedback(message,variant){
 const n=$('spotterFeedback');n.textContent=message;n.className='spotterFeedback '+(variant||'');n.hidden=false;
}
function progress(){
 $('spotterStage').textContent='档案 '+Math.min(5,state.stage+1)+' / 5';
 $('spotterFoundCount').textContent=(state.found[state.stage]||[]).length+' / 6';
 $('spotterProgressFill').style.width=(state.stage/5*100)+'%';
 $('spotterPosterTabs').innerHTML=posters.map((p,i)=>'<span class="spotterTab '+(i<state.stage?'done':i===state.stage?'active':'upcoming')+'">'+(i<state.stage?'✓':i+1)+'</span>').join('');
}
function display(){
 if(!active)return;
 $('spotterPlay').hidden=false;
 if(state.complete){complete();return;}
 $('spotterCase').textContent=posters[state.stage].name;
 $('spotterPosterMount').innerHTML=posterMarkup(posters[state.stage],state.stage);
 $('spotterNext').hidden=state.found[state.stage].length!==COUNT;
 $('spotterRetry').disabled=state.found[state.stage].length===0&&state.reviewed[state.stage].length===0;
 progress();$('spotterFeedback').hidden=true;
 if(state.found[state.stage].length===COUNT)showFeedback('6处错误已全部找出，可以审核下一份。','good');
}
function complete(){
 $('spotterCase').textContent='五份资料全部审核';
 $('spotterStage').textContent='5 / 5 完成';
 $('spotterFoundCount').textContent='30 / 30';
 $('spotterProgressFill').style.width='100%';
 $('spotterPosterTabs').innerHTML=posters.map(()=>'<span class="spotterTab done">✓</span>').join('');
 $('spotterPosterMount').innerHTML='<div class="spotterCompletePanel"><div>🏆</div><strong>极地打假 · 全部通关</strong><span>五份资料 · 30处错误已纠正</span><button type="button" id="spotterShowMedal" class="spotterBtn spotterBtnGold">查看金色认证卡</button></div>';
 $('spotterNext').hidden=true;$('spotterRetry').disabled=false;
 showFeedback('获得「船客 · 极地打假总督」认证。','good');
}
function open(){active=true;root.hidden=false;display();root.scrollIntoView({behavior:'smooth',block:'start'});if(state.complete)award();}
function next(){
 if(state.complete||state.found[state.stage].length!==COUNT)return;
 if(winTimer){clearTimeout(winTimer);winTimer=null;}
 if(state.stage<4){state.stage++;persist();display();}
 else{state.stage=5;state.complete=true;persist();display();award();}
}
function spot(e){
 if(state.complete||state.stage>=5)return;
 const item=e.target.closest('[data-proof-index]');if(!item)return;
 const pos=Number(item.getAttribute('data-proof-index'));
 const row=posters[state.stage].lines[pos];
 if(!row||!Number.isInteger(pos))return;
 const wrong=row[1];
 if(wrong<0){
  if(!state.reviewed[state.stage].includes(pos)){state.reviewed[state.stage].push(pos);persist();}
  item.classList.add('spotterProofVerified');item.setAttribute('aria-pressed','true');
  const dot=item.querySelector('.spotterProofDot');
  if(dot){dot.className='spotterProofStamp verified';dot.textContent='已核实';}
  showFeedback('这条准确，继续找有问题的内容。','neutral');
 }else if(state.found[state.stage].includes(wrong)){
  showFeedback('这一条已经纠正过。','neutral');
 }else{
  state.found[state.stage].push(wrong);persist();
  $('spotterPosterMount').innerHTML=posterMarkup(posters[state.stage],state.stage);
  progress();showFeedback('找到了！'+row[2],'good');
  if(state.found[state.stage].length===COUNT){
   $('spotterNext').hidden=false;showFeedback('6处错误全部找到！','good');
   if(state.stage===4){if(winTimer)clearTimeout(winTimer);winTimer=setTimeout(next,1600);}
  }
 }
 $('spotterRetry').disabled=false;
}
function restartPoster(){
 if(state.complete){if(!window.confirm('从第一份资料重新挑战？'))return;state=blank();}
 else{state.found[state.stage]=[];state.reviewed[state.stage]=[];}
 if(winTimer)clearTimeout(winTimer);winTimer=null;
 persist();display();
}
function resetAll(){
 if(!window.confirm('重新审核全部五份资料？'))return;
 if(winTimer)clearTimeout(winTimer);winTimer=null;
 state=blank();persist();display();
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
 ctx.font='500 34px "Songti SC","STSong",serif';ctx.fillText('5 份档案 · 30 处错误全部识破',600,1045);
 ctx.font='500 27px sans-serif';ctx.fillText('CHUANKE  ·  POLAR EXPEDITION',600,1320);
 const link=document.createElement('a');link.download='船客-极地打假总督认证卡.png';link.href=canvas.toDataURL('image/png');document.body.appendChild(link);link.click();link.remove();
}

document.querySelectorAll('[data-spotter-open]').forEach(b=>b.addEventListener('click',open));
$('spotterPosterMount').addEventListener('click',e=>{if(e.target.closest('#spotterShowMedal')){award();return;}spot(e);});
$('spotterNext').addEventListener('click',next);
$('spotterRetry').addEventListener('click',restartPoster);
$('spotterAllReset').addEventListener('click',resetAll);
$('spotterAwardClose').addEventListener('click',closeAward);
$('spotterAwardAgain').addEventListener('click',()=>{
 closeAward();if(winTimer)clearTimeout(winTimer);winTimer=null;
 state=blank();persist();display();
});
$('spotterAwardDownload').addEventListener('click',downloadCard);
$('spotterAwardOverlay').addEventListener('click',e=>{if(e.target===$('spotterAwardOverlay'))closeAward();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('spotterAwardOverlay').hidden)closeAward();});
window.GanluSpotter={open,getProgress:()=>JSON.parse(JSON.stringify(state)),posters,spot,next,restartPoster,resetAll};
})();