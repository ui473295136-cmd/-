/* 2026-10-26: 0118/0130 5层及以上专项政策：全程单房差原价25%，未成年人80%。 */
(function(){
'use strict';
const ROUTES=new Set(['b0118','b0130']);
const fmt=n=>Number.isFinite(n)?'¥'+n.toLocaleString('zh-CN',{maximumFractionDigits:2}):'—';
const suitable=(r,c)=>ROUTES.has(r?.id)&&Number.isFinite(c?.deck)&&c.deck>=5;
function apply(q,r,c,n,customer,stay,anniversary,shipOnly,minors){
 if(!suitable(r,c)||!(Number.isInteger(minors)&&minors>=0))return q;
 const hasKids=minors>0,solo=stay==='single';
 if(!hasKids&&!solo)return q;
 if(q.status!=='ready')return q;
 const warnings=[...(q.warnings||[])],errors=[...(q.errors||[])];
 const conflicts=[];
 if(anniversary==='new92')conflicts.push('周年庆A（92折）与本次25%全程单房差／未成年人8折的叠加关系未明确');
 if(shipOnly?.enabled===true)conflicts.push('单船票服务减免与本次专项政策的叠加口径未明确');
 if(hasKids&&solo)conflicts.push('未成年人8折与单人入住25%房差能否同时享受尚未明确');
 if(minors>n)conflicts.push('未成年人人数不能超过出行总人数');
 if(conflicts.length){
  const reason=conflicts.join('；')+'，请先取消冲突选择或由产品部核价。';
  return Object.assign({},q,{status:'manual',statusReason:reason,offer:null,rawOffer:null,copyOffer:false,offerValid:false,errors:errors.concat(reason)});
 }
 const price=c.price,adult=n-minors;
 if(!Number.isFinite(price)||price<=0)return q;
 const notes=['5层及以上专项名额有限，具体优惠截止日期尚待群内通知；正式报名及可用名额须核实。'];
 let total,steps,name,extra=0,rate=1;
 if(hasKids){
  total=Math.round(price*(adult*.94+minors*.80));
  rate=.94;
  name='5层及以上未成年人专项：成人94折＋未成年人80折（不叠加多人优惠）';
  steps=[
   '舱位原价：'+fmt(price)+'/人 × '+n+'人 = '+fmt(price*n),
   '成人：'+fmt(price)+' × 94% × '+adult+'人 = '+fmt(price*.94*adult),
   '未成年人：'+fmt(price)+' × 80% × '+minors+'人 = '+fmt(price*.80*minors),
   '本方案不额外叠加多人出行2%或3%优惠。',
   '南极主行程合计：'+fmt(total)
  ];
  if(customer==='old')notes.push('此报价按明确的家庭示例公式计算；老客户另减5000元与未成年人专项能否叠加未明确，未自动扣减。');
  if(n>=4)notes.push('家庭人数已按成人94折、未成年人80折直接计算，不再使用常规多人减免。');
 }else{
  extra=Math.round(price*n*.25);
  total=Math.round(price*n+extra);
  name='5层及以上全程独住：原价＋25%全程单房差';
  steps=[
   '舱位原价：'+fmt(price)+'/人 × '+n+'人 = '+fmt(price*n),
   '全程单房差（邮轮＋陆地）：'+fmt(price)+' × 25% × '+n+'人 = +'+fmt(extra),
   '独住报价合计：'+fmt(total)
  ];
  notes.push('仅确认全程单房差为原价25%；与常规94折、老客、多人成团优惠能否叠加未说明，本次不自动叠加。');
 }
 return Object.assign({},q,{
  offer:total,rawOffer:total,baseRate:rate,groupRate:0,groupSaving:0,loyalDeduction:0,postAdd:extra,bonusDeduction:0,
  singleSupplement:solo?extra:null,singleTotal:solo?total:null,
  policy:{code:'latest_unconfirmed',valid:false,label:'5层及以上新专项 · 截止日期待通知'},
  policyName:name,status:'ready',statusReason:'已按0118／0130五层及以上明确专项条款计价',
  copyOffer:true,offerValid:true,steps,standardSteps:['舱位原价：'+fmt(price)+'/人 × '+n+'人 = '+fmt(price*n)],
  warnings,assumptions:[...q.assumptions||[],...notes],minorCount:minors,adultCount:adult
 });
}
window.ChuankeJanPolicy={suitable,apply};
function init(){
 const app=window.ChuankeApp,P=window.ChuankePricing;
 const form=document.querySelector('.form');
 if(!app||!P||!form)return;
 const field=document.createElement('div');
 field.className='field hide';
 field.id='janMinorWrap';
 field.innerHTML='<label for="janMinorCount">⑥ 未成年人（18岁以下）人数 · 5层及以上</label>'+
  '<select id="janMinorCount"><option value="0">0人 · 不使用未成年人8折专项</option></select>'+
  '<small id="janMinorHint" class="smallinfo">有未成年人时：成人按原价94折，未成年人按原价80折，不再叠加多人优惠。</small>';
 form.appendChild(field);
 const input=document.getElementById('janMinorCount'),hint=document.getElementById('janMinorHint');
 const basePlan=P.plan.bind(P);
 let lastRoute='';
 function showInfo(r,c,n,stay){
  if(r.id!==lastRoute){input.value='0';lastRoute=r.id;}
  const enabled=suitable(r,c);
  field.classList.toggle('hide',!enabled);
  if(!enabled){input.value='0';return 0;}
  const old=Number(input.value||0);
  const cap=Number.isInteger(n)&&n>=1?Math.min(n,100):0;
  input.innerHTML='';
  for(let i=0;i<=cap;i++){
   const opt=document.createElement('option');
   opt.value=String(i);
   opt.textContent=i===0?'0人 · 不使用未成年人专项':i+'人 · 未成年人原价8折';
   input.appendChild(opt);
  }
  const effective=Number.isInteger(old)&&old>=0&&old<=cap?old:0;
  input.value=String(effective);
  hint.textContent=stay==='single'&&effective>0
   ?'未成年人8折与独住25%房差能否叠加未明确，请先选择一种方案。'
   :effective>0?'本方案成人94折、未成年人80折；不叠加多人出行额外优惠。'
   :'如有未成年人请选人数。独住时本航次5层及以上单房差按原价25%计算，包含邮轮和陆地。';
  return effective;
 }
 P.plan=function(...args){
  const [r,c,n,customer='new',stay='double',,,,,,,,,anniversary='none',shipOnly={}]=args;
  const q=basePlan(...args);
  if(!r||!c)return q;
  const minors=showInfo(r,c,n,stay);
  return apply(q,r,c,n,customer,stay,anniversary,shipOnly,minors);
 };
 input.addEventListener('change',()=>app.rerender());
 const data=app.getData();
 const newNotes=[
  '2026年10月26日新增｜仅5层及以上舱位：单人入住全程（邮轮＋陆地）单房差为舱位原价的25%，新专项截止日期待群内通知，名额有限。',
  '2026年10月26日新增｜仅5层及以上舱位：未成年人享原价80折；有未成年人时按成人原价94折＋未成年人原价80折计，不与多人出行额外2%同享；四人家庭三大一小=原价×0.94×3＋原价×0.8，两大两小=原价×0.94×2＋原价×0.8×2。'
 ];
 for(const r of data){
  if(!ROUTES.has(r.id))continue;
  if(!r.notes.some(s=>s.includes('2026年10月26日新增｜仅5层及以上舱位'))){
   r.notes.unshift(...newNotes);
  }
 }
 app.rerender();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();