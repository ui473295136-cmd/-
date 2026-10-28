/* 南美延长线报价：五航次15个方案；统一95折，可与南极主行程优惠价同享。政策更新：2026-10-28。 */
(function(){
'use strict';
const OPTIONS={
 a1122:[
  {id:'A',price:28800,countries:'智利（含复活节岛）、乌拉圭'},
  {id:'B',price:128800,countries:'智利、阿根廷、乌拉圭、巴西、秘鲁、玻利维亚、哥伦比亚'},
  {id:'C',price:108800,countries:'智利（无复活节岛）、阿根廷、乌拉圭、巴西、秘鲁、玻利维亚、哥伦比亚'}
 ],
 a1204:[
  {id:'A',price:28800,countries:'智利（含复活节岛）、乌拉圭'},
  {id:'B',price:128800,countries:'智利、阿根廷、乌拉圭、巴西、秘鲁、玻利维亚、哥伦比亚'},
  {id:'C',price:108800,countries:'智利（无复活节岛）、阿根廷、乌拉圭、巴西、秘鲁、玻利维亚、哥伦比亚'}
 ],
 b0118:[
  {id:'A',price:107800,countries:'哥伦比亚、秘鲁、玻利维亚、智利'},
  {id:'B',price:136900,countries:'哥伦比亚、秘鲁、玻利维亚、智利、阿根廷、乌拉圭、巴西'},
  {id:'C',price:34800,countries:'阿根廷、乌拉圭、巴西'}
 ],
 b0130:[
  {id:'A',price:34800,countries:'巴西、阿根廷、乌拉圭'},
  {id:'B',price:122900,countries:'巴西、阿根廷、乌拉圭、智利、秘鲁、玻利维亚、哥伦比亚'},
  {id:'C',price:93800,countries:'智利、秘鲁、玻利维亚、哥伦比亚'}
 ],
 b0202:[
  {id:'A',price:38800,countries:'阿根廷、乌拉圭、巴西、智利'},
  {id:'B',price:129900,countries:'巴西、阿根廷、乌拉圭、智利、秘鲁、玻利维亚、哥伦比亚'},
  {id:'C',price:96800,countries:'智利、秘鲁、玻利维亚、哥伦比亚'}
 ]
};
const money=n=>Number.isFinite(n)?'¥'+n.toLocaleString('zh-CN',{maximumFractionDigits:2}):'—';
const exact=n=>Number(n).toLocaleString('zh-CN',{useGrouping:false,maximumFractionDigits:2});
function calculate(q,ext){
 if(!q||!ext)return {extensionUnitPrice:null,extensionOriginalTotal:null,extensionDiscount:null,extensionTotal:null,total:null,reason:'请选择有效的报价方案。'};
 if(!Number.isInteger(q.people)||q.people<1||q.people>100)return {extensionUnitPrice:null,extensionOriginalTotal:null,extensionDiscount:null,extensionTotal:null,total:null,reason:'人数无效。'};
 const extensionUnitPrice=Math.round(ext.price*0.95);
 const extensionOriginalTotal=ext.price*q.people;
 const extensionTotal=extensionUnitPrice*q.people;
 const extensionDiscount=extensionOriginalTotal-extensionTotal;
 const amounts={extensionUnitPrice,extensionOriginalTotal,extensionDiscount,extensionTotal};
 if(q.anniversaryUpgradeOnly)return Object.assign(amounts,{total:null,reason:'已报名升舱仅计算补差价，原合同总价未知，不能合并报价。'});
 if(q.status!=='ready'||!Number.isFinite(q.offer))return Object.assign(amounts,{total:null,reason:'南极主行程金额待确认，暂不能计算组合总价。'});
 return Object.assign(amounts,{total:q.offer+extensionTotal,reason:''});
}
window.ChuankeSouthAmerica={options:OPTIONS,calculate};
function init(){
 const app=window.ChuankeApp,P=window.ChuankePricing;
 const form=document.querySelector('.form'),grid=document.querySelector('.quoteGrid');
 if(!app||!P||!form||!grid||!document.getElementById('route'))return;
 const style=document.createElement('style');
 style.textContent=[
 '.saHide{display:none!important}',
 '.saExtensionField small{display:block;margin-top:7px;color:#826c59;line-height:1.7}',
 '.saExtensionResult{margin:14px 0;padding:17px;background:#fff9ed;border:1px solid #dbc8aa;border-radius:12px}',
 '.saExtensionResult h3{margin:0 0 9px;font-size:16px;color:#654b38}',
 '.saExtensionResult .saCountries{line-height:1.7;font-size:13px;color:#685a4b}',
 '.saExtensionResult .saLine{margin-top:9px;color:#715d49;font-size:13px}',
 '.saExtensionResult .saTotal{border-top:1px solid #e8dac2;margin-top:12px;padding-top:12px;display:flex;gap:10px;justify-content:space-between;align-items:baseline;flex-wrap:wrap;font-weight:700}',
 '.saExtensionResult .saTotal strong{font-size:23px;color:#744b31}',
 '.saExtensionResult .saNote{font-size:12px;line-height:1.7;color:#826d58;margin-top:9px}'
 ].join('\n');
 document.head.appendChild(style);
 const field=document.createElement('div');
 field.className='field saExtensionField saHide';
 field.innerHTML='<label for="southAmericaPlan">⑥ 南美延长线（选配）</label><select id="southAmericaPlan"><option value="">不选择延长线</option></select><small id="southAmericaHint">所有南美延长线统一95折，可与南极主行程优惠价共同享受。</small>';
 form.appendChild(field);
 const panel=document.createElement('section');
 panel.className='saExtensionResult saHide';panel.setAttribute('aria-live','polite');
 panel.innerHTML='<h3 id="saTitle">南极＋南美优惠明细</h3><div class="saCountries" id="saCountries"></div><div class="saLine" id="saAntarcticPolicy"></div><div class="saLine" id="saAntarcticPolicyDetail"></div><div class="saLine" id="saAntarcticOriginal"></div><div class="saLine" id="saAntarcticDiscount"></div><div class="saLine" id="saAntarcticOffer"></div><div class="saLine" id="saUnit"></div><div class="saLine" id="saDiscount"></div><div class="saLine" id="saSouthOffer"></div><div class="saLine" id="saEquation"></div><div class="saTotal"><span>组合最终总价</span><strong id="saTotal"></strong></div><div class="saNote">先按南极航次政策计算主行程优惠，再将南美延长线统一95折后的金额相加。两部分优惠分别列示。</div>';
 grid.insertAdjacentElement('afterend',panel);
 const $=id=>document.getElementById(id),sel=$('southAmericaPlan');
 const rawGet=app.getResult.bind(app),rawText=P.customerText.bind(P);
 let currentRoute='';
 function selected(){
  return (OPTIONS[$('route').value]||[]).find(x=>x.id===sel.value)||null;
 }
 function sync(){
  const id=$('route').value,list=OPTIONS[id]||[];
  if(id!==currentRoute){
   currentRoute=id;sel.innerHTML='<option value="">不选择延长线</option>';
   list.forEach(ext=>{const o=document.createElement('option');o.value=ext.id;o.textContent='方案'+ext.id+' · 原价 '+money(ext.price)+'/人';sel.appendChild(o);});
   sel.value='';
  }
  field.classList.toggle('saHide',!list.length);
  const ext=selected(),q=rawGet();
  $('southAmericaHint').textContent=ext?'方案'+ext.id+'：'+ext.countries+'。统一95折，可与南极主行程优惠价共同享受。':'所有方案统一95折；选择A/B/C后显示折后延长线费用及组合总价。';
  panel.classList.toggle('saHide',!ext);
  if(ext){
   const calc=calculate(q,ext);
   $('saTitle').textContent='南极＋南美优惠明细 · 方案'+ext.id;
   $('saCountries').textContent=ext.countries;
   const antarcticPolicyName=q&&q.policyName?q.policyName:'待确认';
   const antarcticPolicyDetails=q&&Array.isArray(q.steps)?q.steps.filter(line=>!line.startsWith('基础原价：')&&!line.startsWith('本次报价合计：')):[];
   $('saAntarcticPolicy').textContent='南极适用政策：'+antarcticPolicyName;
   $('saAntarcticPolicyDetail').textContent='南极优惠明细：'+(antarcticPolicyDetails.length?antarcticPolicyDetails.join('；'):'暂无可核实的优惠计算明细');
   const antarcticOriginal=q&&Number.isFinite(q.standard)?q.standard:null;
   const antarcticOffer=q&&q.status==='ready'&&!q.anniversaryUpgradeOnly&&Number.isFinite(q.offer)?q.offer:null;
   const antarcticSaving=antarcticOriginal!==null&&antarcticOffer!==null?antarcticOriginal-antarcticOffer:null;
   $('saAntarcticOriginal').textContent='南极原价：'+(antarcticOriginal!==null?money(antarcticOriginal):'待确认');
   $('saAntarcticDiscount').textContent=antarcticSaving===null?'南极优惠：待确认':antarcticSaving>0?'南极优惠：减免'+money(antarcticSaving):antarcticSaving===0?'南极优惠：无额外减免':'南极额外费用/调整：增加'+money(-antarcticSaving);
   $('saAntarcticOffer').textContent='南极优惠价：'+(antarcticOffer!==null?money(antarcticOffer):'待确认');
   $('saUnit').textContent='南美延长线原价：'+money(ext.price)+'/人 × '+(q&&Number.isInteger(q.people)?q.people:'—')+'人 = '+money(calc.extensionOriginalTotal);
   $('saDiscount').textContent='南美优惠（统一95折）：减免'+money(calc.extensionDiscount);
   $('saSouthOffer').textContent='南美延长线折后价：'+money(calc.extensionUnitPrice)+'/人 × '+(q&&Number.isInteger(q.people)?q.people:'—')+'人 = '+money(calc.extensionTotal);
   $('saEquation').textContent='组合计算：南极优惠价 '+(antarcticOffer!==null?money(antarcticOffer):'待确认')+' + 南美延长线折后价 '+money(calc.extensionTotal)+' = '+(Number.isFinite(calc.total)?money(calc.total):'待确认');
   $('saTotal').textContent=Number.isFinite(calc.total)?money(calc.total):'待确认：'+calc.reason;
  }
  const block=Boolean(ext&&calculate(q,ext).total===null);
  $('copyCustomer').disabled=block||!q||q.status!=='ready';
  const edict=$('openQuoteEdict');if(edict)edict.disabled=block||!q||q.status!=='ready';
 }
 P.customerText=function(q){
  const basic=rawText(q),ext=selected();
  if(!ext)return basic;
  const calc=calculate(q,ext);
  if(!basic||!Number.isFinite(calc.total))return '';
  const lines=basic.split('\n'),at=lines.findIndex(s=>s.startsWith('最终价格：'));
  if(at<0)return '';
  return lines.slice(0,at).concat([
   '南极适用政策：'+(q.policyName||'待确认'),
   ...(Array.isArray(q.steps)?q.steps.filter(line=>!line.startsWith('基础原价：')&&!line.startsWith('本次报价合计：')).map(line=>'南极优惠明细：'+line):[]),
   '南极原价：'+exact(q.standard)+'元',
   ...(q.standard>q.offer?['南极优惠：减免'+exact(q.standard-q.offer)+'元']:q.standard===q.offer?['南极优惠：无额外减免']:['南极额外费用/调整：增加'+exact(q.offer-q.standard)+'元']),
   '南极优惠价：'+exact(q.offer)+'元',
   '南美延长线：方案'+ext.id+'（'+ext.countries+'）',
   '南美延长线原价：'+exact(ext.price)+'元/人 × '+q.people+'人 = '+exact(calc.extensionOriginalTotal)+'元',
   '南美优惠（统一95折）：减免'+exact(calc.extensionDiscount)+'元',
   '南美延长线折后价：'+exact(calc.extensionUnitPrice)+'元/人 × '+q.people+'人 = '+exact(calc.extensionTotal)+'元',
   '组合计算：南极优惠价 '+exact(q.offer)+'元 + 南美延长线折后价 '+exact(calc.extensionTotal)+'元 = '+exact(calc.total)+'元',
   '最终价格：'+exact(calc.total)+'元'
  ]).join('\n');
 };
 // 报价圣旨使用组合总价，保留主行程单独报价及不叠加折扣的说明。
 app.getResult=function(){
  const q=rawGet(),ext=selected();
  if(!q||!ext)return q;
  const calc=calculate(q,ext);
  if(!Number.isFinite(calc.total))return Object.assign({},q,{status:'manual',statusReason:calc.reason});
  return Object.assign({},q,{
   offer:calc.total,
   standard:Number.isFinite(q.standard)?q.standard+calc.extensionOriginalTotal:q.standard,
   southAmericaBreakdown:{
    plan:ext.id,countries:ext.countries,people:q.people,
    antarcticOriginalTotal:Number.isFinite(q.standard)?q.standard:null,
    antarcticDiscount:Number.isFinite(q.standard)?q.standard-q.offer:null,
    antarcticOffer:q.offer,
    extensionOriginalTotal:calc.extensionOriginalTotal,
    extensionDiscount:calc.extensionDiscount,
    extensionOffer:calc.extensionTotal,
    combinedOffer:calc.total,
    antarcticPolicyName:q.policyName||'待确认',
    antarcticPolicySteps:Array.isArray(q.steps)?q.steps.filter(line=>!line.startsWith('基础原价：')&&!line.startsWith('本次报价合计：')):[]
   },
   policyName:(q.policyName||'常规报价')+'；南美延长线方案'+ext.id+'统一95折（与南极优惠同享）',
   route:Object.assign({},q.route,{name:q.route.name+'＋南美延长线'+ext.id+'（'+ext.countries+'）'})
  });
 };
 document.addEventListener('change',sync);
 document.addEventListener('input',event=>{if(event.target&&event.target.id==='people')sync();});
 document.addEventListener('click',event=>{
  if(event.target&&event.target.closest&&event.target.closest('button[data-people],#minus,#plus,#customerType,#stayType'))sync();
 });
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
 window.addEventListener('focus',sync);
 sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();