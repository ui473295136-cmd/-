(function(){
'use strict';
// Sales policy desk: keep existing-ticket calculators separate from new-booking quotes.
const $=id=>document.getElementById(id);
const p=window.ChuankePricing;
const app=window.ChuankeApp;
if(!p||!app||!$('policyDesk'))return;
const ids=['a1122','a1204','b0118','b0130'];
const info={
 a1122:{name:'11/22 南乔治亚＋半岛',type:'大满贯连走',head:'已报名1122的客户：在原合同每人价格基础上，每人加5万元，接走1204后段航次。',items:[
  ['适合谁','摄影深度游、已报名1122且希望继续探索南极的客户'],
  ['玩法','与1204连走，船去船回，阿根廷往返；两期目前仅长城站拜访重复，其他计划登陆点不同'],
  ['签证','群公告称仅需办理阿根廷签证；仍须根据国籍、转机和证件实际核实'],
  ['房型权益','4层海景升5层海景释放少量权益，先到先得；群通知未说明是否免费或具体差价，不自动计入报价']
 ],warn:'连走总人数上限10人，两期中间有换房可能；航线、登陆点取决于最终天气与安全安排。'},
 a1204:{name:'12/04 南极半岛航次',type:'大满贯连走',head:'已报名1204的客户：在原合同每人价格基础上，每人加8万元，向前连走1122双岛航次。',items:[
  ['适合谁','已报名1204、想加上南乔治亚与深度摄影体验的客户'],
  ['玩法','与1122连走，船去船回，阿根廷往返；计划登陆点除长城站外不同'],
  ['签证','群公告称仅需阿根廷签证；个人具体转机/身份条件仍须核实'],
  ['房型权益','4层海景升5层海景释放少量权益，先到先得；升舱是否免费或需补差价尚待项目组确认']
 ],warn:'连走合计上限10人，可能换房。5万／8万元明确为每人加价，按实际连走人数计算；签证、转机及名额仍须核实。'},
 b0118:{name:'01/18 南乔治亚＋半岛',type:'邀约与舱位权益',head:'已报名客户可做邀约现金减免，或用邀约权益申请4层海景免费升5层海景（二选一）。',items:[
  ['已报名邀约','每邀约1位朋友，双方享相应减免；已报名2人仅邀1位时，各减0.5个百分点；最低到9折。差价在尾款退回'],
  ['升级二选一','已报名4层海景客户可与受邀朋友一起免费升5层海景，不能同时领取邀约现金减免'],
  ['新购房型','3层舷窗按原价报名，可免费升级5层船头海景；须在报价区主动勾选该方案'],
  ['5层非船头海景','单独92折，已报名客户可退差价，限额、先到先得；按独立方案试算，不自动与其他优惠叠加']
 ],warn:'邀约权益仅面向已报名0118/0130客户。两航次专项优惠的具体截止日、库存及合同叠加条件未说明，须向项目组确认。'},
 b0130:{name:'01/30 春节南极半岛',type:'邀约与舱位权益',head:'已报名客户邀约享减免，或选择4层海景免费升5层海景的权益；两者只能选其一。',items:[
  ['已报名邀约','每邀约1位朋友可享减免，已报名2人仅邀1位时，每人减0.5个百分点；享受优惠不得低于9折'],
  ['升级二选一','已报名4层海景客户，可与受邀亲友一起申请免费升5层海景；不与邀约现金减免同享'],
  ['新购房型','3层舷窗按原价报名，免费升5层船头海景；报价区勾选后按3层原价计算'],
  ['5层非船头海景','单独9折，已报名客户可退差价，数量有限；已是9折的客户无法再叠加邀约现金减免']
 ],warn:'9折为邀约最终下限。其他老客/多人折扣和专项舱型优惠是否可以叠加，群公告未明确；不能将多种优惠直接相乘。'}
};
function escapeHtml(s){return String(s===undefined||s===null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const money=n=>'¥'+Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
let latestId='',seenRefRoute='',editReferral=false;
function policyBar(){
 return ids.map(id=>'<button type="button" class="policyDeskTab" data-policy-route="'+id+'" aria-pressed="false">'+info[id].name+'</button>').join('');
}
$('policyDeskTabs').innerHTML=policyBar();
function renderInfo(){
 const route=$('route').value,cabin=$('cabin').value;
 if(route===latestId&&route===seenRefRoute)return;
 latestId=route;seenRefRoute=route;
 const d=info[route];
 document.querySelectorAll('[data-policy-route]').forEach(btn=>{
   const isCurrent=btn.getAttribute('data-policy-route')===route;
   btn.classList.toggle('active',isCurrent);btn.setAttribute('aria-pressed',String(isCurrent));
 });
 $('policyDeskEmpty').hidden=Boolean(d);
 $('policyDeskDetail').hidden=!d;
 if(!d)return;
 $('policyDeskName').textContent=d.name;
 $('policyDeskKind').textContent=d.type;
 $('policyDeskHeadline').textContent=d.head;
 $('policyDeskRows').innerHTML=d.items.map(item=>
  '<div class="policyDeskRow"><strong>'+escapeHtml(item[0])+'</strong><span>'+escapeHtml(item[1])+'</span></div>'
 ).join('');
 $('policyDeskCaution').textContent=d.warn;
 $('policyDeskJoin').hidden=!['a1122','a1204'].includes(route);
 $('policyDeskInvite').hidden=!['b0118','b0130'].includes(route);
 if(['a1122','a1204'].includes(route)){
  $('policyJoinExtra').textContent=route==='a1122'?'¥50,000 / 每人加价':'¥80,000 / 每人加价';
  showJoin();
 }
 if(['b0118','b0130'].includes(route)){
  editReferral=false;
  $('policyInviteOriginal').value='1';
  $('policyInviteNew').value='1';
  $('policyInviteMode').value='cash';
  updateReferralPrefill();
  showInvite();
 }
}
function updateReferralPrefill(){
 const r=$('route').value,q=app.getResult();
 const is5=$('cabin').value==='5o';
 $('policyInviteRate').value=is5?(r==='b0130'?'90':'92'):'94';
 $('policyInviteBase').value=q&&Number.isFinite(q.price)?String(q.price):'';
}
function onMainChange(){
 const next=$('route').value;
 if(next!==latestId){renderInfo();return;}
 const fresh=$('cabin').value;
 if(['b0118','b0130'].includes(next)&&fresh!==lastCabin){
  lastCabin=fresh;updateReferralPrefill();showInvite();
 }
}
let lastCabin='';
function showJoin(){
 const area=$('policyJoinResult'),id=$('route').value;
 if(!['a1122','a1204'].includes(id))return;
 const per=id==='a1122'?50000:80000;
 const count=Number($('policyJoinCount').value),base=Number($('policyJoinBase').value);
 const valid=Number.isInteger(count)&&count>=1&&count<=10;
 if(!valid){area.textContent='连走名额合计最多10人，请填写1—10人的人数。';return;}
 const extra=count*per;
 if(!Number.isFinite(base)||base<=0){
   area.innerHTML='<strong>追加费用测算：'+money(extra)+'</strong><small>按'+count+'位连走客户，每位增加'+money(per)+'。填写已报名合同单价后，才会计算连走总价。</small>';
   return;
 }
 area.innerHTML='<strong>预计连走总价：'+money((base+per)*count)+'</strong>'
   +'<span>单人：原合同价 '+money(base)+' ＋ 连走加价 '+money(per)+' = '+money(base+per)+'</span>'
   +'<small>共'+count+'人；按每人原合同价及每人连走加价测算。加价为每人费用，剩余名额须确认。</small>';
}
function copyText(text){
 if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
 const tmp=document.createElement('textarea');tmp.value=text;tmp.style.position='fixed';tmp.style.left='-9999px';
 document.body.appendChild(tmp);tmp.select();const ok=document.execCommand('copy');tmp.remove();
 if(!ok)throw Error('无法复制');
}
async function copyJoin(){
 const route=$('route').value,id=info[route],cnt=Number($('policyJoinCount').value),price=Number($('policyJoinBase').value),add=route==='a1122'?50000:80000;
 if(!id||!Number.isInteger(cnt)||cnt<1||cnt>10||!(price>0)){ $('policyDeskStatus').textContent='请先填写正确的原合同单价及连走人数。';return;}
 const text='【船客旅行 · 双航次连走测算】\n已报名航次：'+id.name+'\n连走人数：'+cnt+'人\n原合同价：'+price+'元/人\n追加费用：'+add+'元/人\n预计连走总价：'+((price+add)*cnt)+'元\n备注：限10人、可能中途换房，签证转机和名额须核实。';
 try{await copyText(text);$('policyDeskStatus').textContent='连走测算已复制。';}catch(e){$('policyDeskStatus').textContent='复制未成功，请手动整理。';}
}
function showInvite(){
 const panel=$('policyInviteResult');
 if(!['b0118','b0130'].includes($('route').value))return;
 const count=Number($('policyInviteOriginal').value),invited=Number($('policyInviteNew').value),rate=Number($('policyInviteRate').value),base=Number($('policyInviteBase').value),mode=$('policyInviteMode').value;
 if(!Number.isInteger(count)||count<1||count>50||!Number.isInteger(invited)||invited<1||invited>50){
  panel.textContent='请输入已报名人数1—50人、实际成功邀约人数1—50人。';return;
 }
 if(mode==='upgrade'){
  if($('cabin').value!=='4o'){
    panel.innerHTML='<strong>此选项仅限已报名的4层海景房客户</strong><small>请先在上方报价区选择4层海景房，再查看免费升级5层海景的资格。升级名额须确认。</small>';
  }else{
    panel.innerHTML='<strong>可申请：4层海景房 → 5层海景房免费升级</strong><small>仅限已报名0118或0130、成功邀约亲友的客户。免费升舱与邀约现金减免二选一；名额、换房和适用人员需向项目组核实。主报价区保持原舱价格，不会自动改价。</small>';
  }
  return;
 }
 if(!Number.isFinite(rate)||rate<90||rate>100||!Number.isFinite(base)||base<=0){
  panel.textContent='请输入原舱位基础价格和客户目前合同折扣（90—100%，例如94表示94折）。';return;
 }
 const ratePoints=Math.min(Math.max(0,rate-90),invited/count),newRate=rate-ratePoints;
 const refundedPer=Math.round(base*ratePoints/100);
 const totalRefund=Math.round(base*ratePoints/100*count);
 panel.innerHTML='<strong>已报名客户：平均再减 '+ratePoints.toLocaleString('zh-CN',{maximumFractionDigits:3})+' 个百分点</strong>'
    +'<span>当前'+rate+'% → 试算'+newRate.toLocaleString('zh-CN',{maximumFractionDigits:3})+'%（最低9折）</span>'
    +'<span>已报名客户约退：'+money(refundedPer)+'/人，合计约 '+money(totalRefund)+'</span>'
    +'<small>举例：2位已报名＋新邀1人 → 已报名2人各减0.5个百分点。被邀客户的额外减免按其实际房型和已享优惠另算，不能直接沿用本组单价；最终以尾款和项目组核定为准。</small>';
}
async function copyInvite(){
 const panel=$('policyInviteResult');
 const text='【已报名客户 · 邀约权益测算】\n航次：'+info[$('route').value].name+'\n已报名人数：'+$('policyInviteOriginal').value+'人\n新增邀约：'+$('policyInviteNew').value+'人\n权益方案：'+($('policyInviteMode').value==='upgrade'?'4层海景免费升5层（与现金减免二选一）':'现金邀约减免')+'\n'+panel.textContent.replace(/\s+/g,' ').trim()+'\n备注：已报名专属，名额及与合同叠加条件须核实。';
 try{await copyText(text);$('policyDeskStatus').textContent='邀约测算已复制。';}catch(e){$('policyDeskStatus').textContent='无法自动复制，请手动整理。';}
}
function init(){
 $('policyDeskTabs').addEventListener('click',e=>{
  const btn=e.target.closest('[data-policy-route]');if(!btn)return;
  const id=btn.getAttribute('data-policy-route');
  const select=$('route');if(select.value!==id){select.value=id;select.dispatchEvent(new Event('change',{bubbles:true}));}
  // Run synchronously for the selected route, not only on the next interval.
  renderInfo();lastCabin=$('cabin').value;
  $('policyDesk').scrollIntoView({behavior:'smooth',block:'start'});
 });
 $('route').addEventListener('change',()=>{renderInfo();lastCabin=$('cabin').value;});
 $('cabin').addEventListener('change',()=>{lastCabin=$('cabin').value;if(['b0118','b0130'].includes($('route').value)){updateReferralPrefill();showInvite();}});
 ['policyJoinBase','policyJoinCount'].forEach(id=>$(id).addEventListener('input',showJoin));
 ['policyInviteOriginal','policyInviteNew','policyInviteRate','policyInviteBase'].forEach(id=>$(id).addEventListener('input',showInvite));
 $('policyInviteMode').addEventListener('change',showInvite);
 $('policyCopyJoin').addEventListener('click',copyJoin);
 $('policyCopyInvite').addEventListener('click',copyInvite);
 $('policyDeskStatus').textContent='';
 renderInfo();lastCabin=$('cabin').value;
}
init();
window.GanluPolicies={renderInfo,showJoin,showInvite};
})();