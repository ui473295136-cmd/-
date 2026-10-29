(function(){
 'use strict';
 const STOCK = {
  a1122:{
   total:16,
   cabins:[
    ['海景房 4层三人间',1],['海景房 4层',1],['海景房 5层',13],['阳台房 6层',1],['船东套房 7层',0]
   ],
   business:[['商务舱差价 · 上海往返',0]],
   extensions:['A：0人','B：2人','C：14人（单男待拼）'],
   notes:[]
  },
  a1204:{
   total:7,
   cabins:[
    ['海景房 4层三人间',0],['海景房 4层',1],['海景房 5层',3],['阳台房 6层',2],['船东套房 7层',1]
   ],
   business:[['商务舱差价 · 北京往返',0],['商务舱差价 · 上海往返',0]],
   extensions:['A：2人','B：18人','C：0人'],
   notes:[]
  },
  b0118:{
   total:41.5,
   cabins:[
    ['海景房 4层三人间',0],['海景房 4层',9.5],['海景房 5层',19],['阳台房 6层',11],['船东套房 7层',2]
   ],
   business:[['商务舱差价 · 记录1',3],['商务舱差价 · 记录2',4]],
   extensions:['A：4人','B：6人（占位2人）','C：0人'],
   notes:[]
  },
  b0130:{
   total:33.5,
   cabins:[
    ['海景房 4层三人间',0],['海景房 4层',8],['海景房 5层',17.5],['阳台房 6层',8],['船东套房 7层',0]
   ],
   business:[['商务舱差价 · 上海往返',0]],
   extensions:['A：0人','B：0人（占位1人）','C：4人'],
   notes:[]
  },
  b0202:{
   total:2.5,
   cabins:[
    ['阳台套房 5层',0],['阳台套房 6层',2],['阳台套房 7/8层',0.5]
   ],
   business:[['商务舱差价 · 上海往返',0]],
   extensions:['A：0人','B：9人','C：0人'],
   notes:['第三人入住：限10间，剩余2间（第3人费用为第1、2人的60%）','单人入住：单间差为50%，限5间']
  }
 };
 const esc = function(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
 const status = function(n){
  if(!Number.isFinite(Number(n)) || Number(n)<=0) return {cls:'red',label:'已售罄'};
  if(Number(n)<=5) return {cls:'yellow',label:'余舱不足'};
  return {cls:'green',label:'余舱充足'};
 };
 const fmt = function(n){return Number(n).toLocaleString('zh-CN',{maximumFractionDigits:1});};
 function init(){
  const app=window.ChuankeApp;
  const routeSelect=document.getElementById('route');
  const routeOverview=document.getElementById('routeOverview');
  if(!app || !routeSelect || !routeOverview || document.getElementById('ganluInventory')) return;
  const panel=document.createElement('details');
  panel.id='ganluInventory';
  panel.className='ganluInventory';
  panel.innerHTML =
   '<summary><span class="giTitle">余舱速览</span><span id="giTotal" class="giTotal">读取中</span><span id="giStatus" class="giBadge yellow">查看状态</span><span class="giToggle">查看明细⌄</span></summary>'+
   '<div class="giBody"><div class="giLegend"><span><i class="giDot green"></i>余舱充足：超过5</span><span><i class="giDot yellow"></i>余舱不足：1–5</span><span><i class="giDot red"></i>已售罄：0</span></div>'+
   '<div class="giSectionTitle">各舱型余量</div><div id="giCabins" class="giGrid"></div>'+
   '<div id="giBusinessWrap"><div class="giSectionTitle">商务舱差价余量</div><div id="giBusiness" class="giGrid"></div></div>'+
   '<div class="giSectionTitle">南美延长线人数记录（按原表，不代表余舱）</div><div id="giExtensions" class="giExtensions"></div>'+
   '<div id="giNotes" class="giNotes"></div>'+
   '<div class="giFoot">库存参考：根据你提供的舱位表录入；舱位变化以产品部最新确认为准。本模块仅供查看，不参与报价计算。</div></div>';
  const style=document.createElement('style');
  style.textContent =
   '.ganluInventory{margin:0 0 12px;border:1px solid #d9e5d9;border-radius:12px;background:#fbfdf9;color:#33483d;font-size:12px;overflow:hidden}'+
   '.ganluInventory summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer;padding:10px 12px;min-height:38px;flex-wrap:wrap}'+
   '.ganluInventory summary::-webkit-details-marker{display:none}.giTitle{font-weight:700;color:#244d3c;font-size:13px}.giTotal{font-weight:700;color:#405b4c}.giBadge{border-radius:999px;padding:3px 8px;font-size:11px;font-weight:700}.giToggle{margin-left:auto;color:#7a8b80;font-size:11px}.ganluInventory[open] .giToggle{content:"";}'+
   '.giBody{padding:0 12px 11px;border-top:1px solid #e4ece4}.giLegend{display:flex;gap:10px;flex-wrap:wrap;padding:9px 0 7px;color:#718076;font-size:10px}.giLegend span{display:inline-flex;align-items:center;gap:4px}.giDot{width:7px;height:7px;border-radius:50%;display:inline-block}.giSectionTitle{font-size:11px;font-weight:700;color:#637468;margin:8px 0 6px}.giGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.giItem{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:7px 8px;border:1px solid #e4eae4;border-radius:8px;background:#fff;min-width:0}.giName{overflow-wrap:anywhere;color:#5b6b60}.giCount{font-weight:700;white-space:nowrap;border-radius:6px;padding:2px 6px}.giExtensions{display:flex;gap:6px;flex-wrap:wrap}.giExt{border:1px solid #e3e8e3;border-radius:7px;background:#fff;padding:5px 8px;color:#5d6d62}.giNotes{display:grid;gap:5px;margin-top:7px}.giNote{border-radius:7px;background:#fff5df;border:1px solid #f0dfb7;color:#8a6525;padding:7px 8px}.giFoot{margin-top:9px;padding-top:7px;border-top:1px dashed #dce6dc;color:#89968b;font-size:10px;line-height:1.5}.giBadge.green,.giCount.green,.giDot.green{background:#dff3e5;color:#187447}.giBadge.yellow,.giCount.yellow{background:#fff0c7;color:#966400}.giBadge.red,.giCount.red{background:#ffe0df;color:#b42318}.giDot.yellow{background:#e5ad28}.giDot.red{background:#d94a43}'+
   '@media(max-width:520px){.giGrid{grid-template-columns:1fr}.ganluInventory summary{gap:6px}.giToggle{width:100%;margin-left:0}.giLegend{gap:7px}}';
  document.head.appendChild(style);
  routeOverview.insertAdjacentElement('afterend',panel);
  function render(){
   const id=routeSelect.value, data=STOCK[id];
   const total=document.getElementById('giTotal'),badge=document.getElementById('giStatus');
   const cabins=document.getElementById('giCabins'),business=document.getElementById('giBusiness'),businessWrap=document.getElementById('giBusinessWrap');
   const extensions=document.getElementById('giExtensions'),notes=document.getElementById('giNotes');
   if(!data){
    total.textContent='暂无库存记录';badge.className='giBadge yellow';badge.textContent='待补充';
    cabins.innerHTML='<div class="giItem"><span class="giName">当前航次暂未录入余舱表</span></div>';
    businessWrap.style.display='none';extensions.innerHTML='';notes.innerHTML='';return;
   }
   const s=status(data.total);
   total.textContent='总余舱 '+fmt(data.total);
   badge.className='giBadge '+s.cls;badge.textContent=s.label;
   cabins.innerHTML=data.cabins.map(function(item){
    const st=status(item[1]);
    return '<div class="giItem"><span class="giName">'+esc(item[0])+'</span><span class="giCount '+st.cls+'">余 '+fmt(item[1])+'</span></div>';
   }).join('');
   businessWrap.style.display=data.business.length?'':'none';
   business.innerHTML=data.business.map(function(item){
    const st=status(item[1]);
    return '<div class="giItem"><span class="giName">'+esc(item[0])+'</span><span class="giCount '+st.cls+'">余 '+fmt(item[1])+'</span></div>';
   }).join('');
   extensions.innerHTML=data.extensions.map(function(label){return '<span class="giExt">'+esc(label)+'</span>';}).join('');
   notes.innerHTML=data.notes.map(function(label){return '<div class="giNote">'+esc(label)+'</div>';}).join('');
  }
  routeSelect.addEventListener('change',render);
  render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();