(function(){
 'use strict';
 // 库存数字按2026-11-03收到的舱位表逐项录入；余舱字段以原表“余舱”列为准。
 // Cabin tuple: [name, remaining, cabinId, total, sold, intent, roommate, actualGuests]
 // Business tuple: [name, remaining, total, sold, intent]
 const STOCK = {
  a1122:{
   total:17.5,totalSlots:71,sold:51.5,intent:2.5,actualGuests:103,
   cabins:[
    ['海景房 4层三人间',0.5,'4t',2,1,1,'',3],
    ['海景房 4层',1.5,'4o',25,23,0.5,'1整1单男',46],
    ['海景房 5层',14,'5o',26,11,1,'',22],
    ['阳台房 6层',1.5,'6b',16,14.5,0,'1整1单女',28],
    ['船东套房 7层',0,'7s',2,2,0,'',4]
   ],
   business:[['商务舱差价 · 上海往返',0,12,12,0]],
   extensions:['A：0人','B：2人','C：14人（单男待拼）'],
   notes:['505–508房不售卖','718/612只能大床','4层三人间原表数值：总舱2、已售1、意向1、余舱0.5，分项相加为2.5；请产品部核实该行0.5差异。']
  },
  a1204:{
   total:7.5,totalSlots:74,sold:60.5,intent:6,actualGuests:121,
   cabins:[
    ['舷窗房 3层',1.5,'3p',3,0.5,1,'单女',1],
    ['海景房 4层三人间',0,'4t',2,2,0,'',6],
    ['海景房 4层',1,'4o',25,24,0,'1整',48],
    ['海景房 5层',2,'5o',26,20.5,3.5,'',41],
    ['阳台房 6层',2,'6b',16,12.5,1.5,'2整',23],
    ['船东套房 7层',1,'7s',2,1,0,'仅可大床',2]
   ],
   business:[['商务舱差价 · 北京往返',0,12,12,0],['商务舱差价 · 上海往返',0,10,10,0]],
   extensions:['A：2人','B：18人','C：0人'],
   notes:[]
  },
  b0118:{
   total:42,totalSlots:71,sold:26.5,intent:2.5,actualGuests:54,
   cabins:[
    ['海景房 4层三人间',0,'4t',2,2,0,'',6],
    ['海景房 4层',9.5,'4o',25,15,0.5,'',30],
    ['海景房 5层',19.5,'5o',26,4.5,2,'',9],
    ['阳台房 6层',11,'6b',16,5,0,'',9],
    ['船东套房 7层',2,'7s',2,0,0,'',0]
   ],
   business:[['商务舱差价 · 北京往返',3,5,2,0],['商务舱差价 · 上海往返',3,7,3,1]],
   extensions:['A：4人','B：8人（占位1人）','C：0人'],
   notes:[]
  },
  b0130:{
   total:30,totalSlots:71,sold:28,intent:13,actualGuests:58,
   cabins:[
    ['海景房 4层三人间',0,'4t',2,2,0,'',6],
    ['海景房 4层',5,'4o',25,11.5,8.5,'',23],
    ['海景房 5层',17,'5o',26,5,4,'',10],
    ['阳台房 6层',8,'6b',16,7.5,0.5,'',15],
    ['船东套房 7层',0,'7s',2,2,0,'',4]
   ],
   business:[['商务舱差价 · 上海往返',0,7,7,0]],
   extensions:['A：0人','B：0人（占位1人）','C：4人'],
   notes:[]
  },
  b0202:{
   total:1.5,totalSlots:50,sold:47.5,intent:1,actualGuests:103,
   cabins:[
    ['阳台套房 5层',0,'5v',8,8,0,'',17],
    ['阳台套房 6层',1,'6v',30,28,1,'663',62],
    ['阳台套房 7/8层',0.5,'78v',12,11.5,0,'单船票女',24]
   ],
   business:[['商务舱差价 · 上海往返',0,7,7,0]],
   extensions:['A：0人','B：9人','C：0人'],
   notes:['3人间费用为第1、2人的60%，限10间；剩余1间（SV）','单人入住：单间差为50%，限5间']
  }
 };
 const esc=function(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
 const status=function(n){
  if(!Number.isFinite(Number(n))||Number(n)<=0)return {cls:'red',label:'已售罄'};
  if(Number(n)<=5)return {cls:'yellow',label:'余舱不足'};
  return {cls:'green',label:'余舱充足'};
 };
 const fmt=function(n){return Number(n??0).toLocaleString('zh-CN',{maximumFractionDigits:1});};
 const money=function(n){return '¥'+Number(n).toLocaleString('zh-CN',{maximumFractionDigits:0});};
 function init(){
  const app=window.ChuankeApp;
  const routeSelect=document.getElementById('route');
  const routeOverview=document.getElementById('routeOverview');
  if(!app||!routeSelect||!routeOverview||document.getElementById('ganluInventory'))return;
  const panel=document.createElement('details');
  panel.id='ganluInventory';panel.className='ganluInventory';
  panel.innerHTML=
   '<summary><span class="giTitle">余舱速览</span><span id="giTotal" class="giTotal">读取中</span><span id="giStatus" class="giBadge yellow">查看状态</span><span class="giToggle">查看明细⌄</span></summary>'+
   '<div class="giBody"><div class="giLegend"><span><i class="giDot green"></i>余舱充足：超过5</span><span><i class="giDot yellow"></i>余舱不足：1–5</span><span><i class="giDot red"></i>已售罄：0</span></div>'+
   '<div class="giSectionTitle">航次舱位汇总</div><div id="giSummary" class="giSummary"></div>'+
   '<div class="giSectionTitle">各舱型余量与销售情况</div><div id="giCabins" class="giGrid"></div>'+
   '<div id="giBusinessWrap"><div class="giSectionTitle">商务舱差价余量</div><div id="giBusiness" class="giGrid"></div></div>'+
   '<div class="giSectionTitle">南美延长线人数记录（按原表，不代表余舱）</div><div id="giExtensions" class="giExtensions"></div>'+
   '<div id="giNotes" class="giNotes"></div>'+
   '<div class="giFoot">库存参考：根据2026年11月3日收到的舱位表录入；舱位变化以产品部最新确认为准。本模块仅供查看，不参与报价计算。意向舱单独展示，不计入已售；余舱数字按原表录入。若明细与合计有差异，以产品部核实为准。</div></div>';
  const style=document.createElement('style');
  style.textContent=
   '.ganluInventory{margin:0 0 12px;border:1px solid #d9e5d9;border-radius:12px;background:#fbfdf9;color:#33483d;font-size:12px;overflow:hidden}'+
   '.ganluInventory summary{display:flex;align-items:center;gap:8px;list-style:none;cursor:pointer;padding:10px 12px;min-height:38px;flex-wrap:wrap}'+
   '.ganluInventory summary::-webkit-details-marker{display:none}.giTitle{font-weight:700;color:#244d3c;font-size:13px}.giTotal{font-weight:700;color:#405b4c}.giBadge{border-radius:999px;padding:3px 8px;font-size:11px;font-weight:700}.giToggle{margin-left:auto;color:#7a8b80;font-size:11px}'+
   '.giBody{padding:0 12px 11px;border-top:1px solid #e4ece4}.giLegend{display:flex;gap:10px;flex-wrap:wrap;padding:9px 0 7px;color:#718076;font-size:10px}.giLegend span{display:inline-flex;align-items:center;gap:4px}.giDot{width:7px;height:7px;border-radius:50%;display:inline-block}'+
   '.giSectionTitle{font-size:11px;font-weight:700;color:#637468;margin:8px 0 6px}.giSummary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.giMetric{padding:7px 8px;border:1px solid #e4eae4;border-radius:8px;background:#fff;min-width:0}.giMetricLabel{display:block;color:#829087;font-size:10px}.giMetricValue{display:block;color:#344d3d;font-weight:700;font-size:14px;margin-top:2px;font-variant-numeric:tabular-nums}'+
   '.giGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.giItem{display:flex;align-items:flex-start;justify-content:space-between;gap:6px;padding:8px;border:1px solid #e4eae4;border-radius:8px;background:#fff;min-width:0}.giCabinInfo{display:flex;flex-direction:column;gap:4px;min-width:0}.giName{overflow-wrap:anywhere;color:#4f6255;font-weight:600}.giPrice{font-size:10px;color:#8a7a67;white-space:nowrap}.giMeta{font-size:10px;line-height:1.5;color:#879187}.giRoommate{font-size:10px;color:#a16d30}.giCount{font-weight:700;white-space:nowrap;border-radius:6px;padding:3px 6px;font-variant-numeric:tabular-nums}.giBusinessMeta{display:block;color:#879187;font-size:10px;margin-top:3px}'+
   '.giExtensions{display:flex;gap:6px;flex-wrap:wrap}.giExt{border:1px solid #e3e8e3;border-radius:7px;background:#fff;padding:5px 8px;color:#5d6d62}.giNotes{display:grid;gap:5px;margin-top:7px}.giNote{border-radius:7px;background:#fff5df;border:1px solid #f0dfb7;color:#8a6525;padding:7px 8px;line-height:1.45}.giFoot{margin-top:9px;padding-top:7px;border-top:1px dashed #dce6dc;color:#89968b;font-size:10px;line-height:1.5}'+
   '.giBadge.green,.giCount.green{background:#dff3e5;color:#187447}.giBadge.yellow,.giCount.yellow{background:#fff0c7;color:#966400}.giBadge.red,.giCount.red{background:#ffe0df;color:#b42318}.giDot.green{background:#2b9b61}.giDot.yellow{background:#e5ad28}.giDot.red{background:#d94a43}'+
   '@media(max-width:520px){.giGrid{grid-template-columns:1fr}.giSummary{grid-template-columns:repeat(2,minmax(0,1fr))}.ganluInventory summary{gap:6px}.giToggle{width:100%;margin-left:0}.giLegend{gap:7px}}';
  document.head.appendChild(style);
  routeOverview.insertAdjacentElement('afterend',panel);
  function render(){
   const id=routeSelect.value,data=STOCK[id];
   const total=document.getElementById('giTotal'),badge=document.getElementById('giStatus');
   const summary=document.getElementById('giSummary'),cabins=document.getElementById('giCabins');
   const business=document.getElementById('giBusiness'),businessWrap=document.getElementById('giBusinessWrap');
   const extensions=document.getElementById('giExtensions'),notes=document.getElementById('giNotes');
   if(!data){
    total.textContent='暂无库存记录';badge.className='giBadge yellow';badge.textContent='待补充';
    summary.innerHTML='';cabins.innerHTML='<div class="giItem"><span class="giName">当前航次暂未录入余舱表</span></div>';
    businessWrap.style.display='none';extensions.innerHTML='';notes.innerHTML='';return;
   }
   const st=status(data.total);
   total.textContent='总余舱 '+fmt(data.total);badge.className='giBadge '+st.cls;badge.textContent=st.label;
   summary.innerHTML=[
    ['总舱位',fmt(data.totalSlots)],['已售舱数',fmt(data.sold)],['意向舱数',fmt(data.intent)],['实际收客人数',fmt(data.actualGuests)]
   ].map(function(m){return '<div class="giMetric"><span class="giMetricLabel">'+m[0]+'</span><span class="giMetricValue">'+m[1]+'</span></div>';}).join('');
   const pricingRoutes=typeof app.getData==='function'?app.getData():[];
   const pricingRoute=Array.isArray(pricingRoutes)?pricingRoutes.find(function(route){return route.id===id;}):null;
   cabins.innerHTML=data.cabins.map(function(item){
    const cs=status(item[1]),cabin=pricingRoute&&Array.isArray(pricingRoute.cabins)?pricingRoute.cabins.find(function(c){return c.id===item[2];}):null;
    const price=cabin&&Number.isFinite(Number(cabin.price))?money(cabin.price):null;
    const meta='总舱 '+fmt(item[3])+' · 已售 '+fmt(item[4])+' · 意向 '+fmt(item[5])+' · 实收 '+fmt(item[7]);
    return '<div class="giItem"><span class="giCabinInfo"><span class="giName">'+esc(item[0])+'</span><span class="giPrice">'+(price!==null?price+'/人':'价格待确认')+'</span><span class="giMeta">'+meta+'</span>'+(item[6]?'<span class="giRoommate">拼住：'+esc(item[6])+'</span>':'')+'</span><span class="giCount '+cs.cls+'">余 '+fmt(item[1])+'</span></div>';
   }).join('');
   businessWrap.style.display=data.business.length?'':'none';
   business.innerHTML=data.business.map(function(item){
    const bs=status(item[1]);
    return '<div class="giItem"><span class="giCabinInfo"><span class="giName">'+esc(item[0])+'</span><span class="giBusinessMeta">总舱 '+fmt(item[2])+' · 已售 '+fmt(item[3])+' · 意向 '+fmt(item[4])+'</span></span><span class="giCount '+bs.cls+'">余 '+fmt(item[1])+'</span></div>';
   }).join('');
   extensions.innerHTML=data.extensions.map(function(label){return '<span class="giExt">'+esc(label)+'</span>';}).join('');
   notes.innerHTML=data.notes.map(function(label){return '<div class="giNote">'+esc(label)+'</div>';}).join('');
  }
  routeSelect.addEventListener('change',render);render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();