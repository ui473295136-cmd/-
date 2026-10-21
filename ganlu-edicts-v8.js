(function(){
'use strict';
const $=id=>document.getElementById(id);
const money=n=>'¥'+Number(n||0).toLocaleString('zh-CN',{maximumFractionDigits:0});
const fmtCN=ymd=>String(ymd||'').replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$1年$2月$3日');
const messages=[
 '早安，各宫小主。今日愿订单顺利、报价准确、沟通从容。',
 '宫中小主辛苦了！今天先完成最重要的一件事，再慢慢喝口茶。',
 '奉天承运：今日多说一句“辛苦了”，好运便多一分。',
 '天凉记得添衣，忙碌也要按时吃饭。今日宜互相搭把手。',
 '今日不求事事尽善，愿所有认真做事的小主都能顺顺利利。',
 '有难题先商量，有好消息记得分享。今日宜结伴前行。',
 '今日圣旨：工作有轻重缓急，健康和好心情一样重要。',
 '愿今日阳光进窗，消息传来皆是好消息。',
 '今日宜送福、宜点赞、宜夸夸认真努力的同事。',
 '今日福气：客户的问题都能得到清楚的回答，同事的问题都有人相帮。',
 '一切从容，自有章法。愿今日每一份努力都有回响。',
 '愿大家工作顺手，生活有趣，午饭有肉，奶茶少冰。',
 '昨日的事已经翻篇，今天从一杯热茶和一个好心情开始。',
 '许愿池里接福气，销售报价看政策；工作归工作，快乐也要有。',
 '宫门虽远，日子很甜。愿今日的小确幸准时抵达。',
 '又是崭新的一天，愿每位小主都被温柔以待。'
];
function bjToday(){
 const data=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const parts={};data.forEach(v=>parts[v.type]=v.value);
 return parts.year+'-'+parts.month+'-'+parts.day;
}
let renderedDay='';
function drawDaily(){
 const day=bjToday();
 if(renderedDay===day)return;
 renderedDay=day;
 const seed=day.split('-').join('').split('').reduce((a,c)=>a*13+Number(c),7);
 const message=messages[seed%messages.length];
 $('edictDailyDate').textContent=fmtCN(day)+' · 北京时间';
 $('edictDailyContent').textContent='奉天承运，皇帝诏曰：'+message+'钦此。';
}
function fillTextWrap(ctx,content,x,y,maxWidth,lineHeight,maxLines=99){
 let line='',count=0;
 for(const char of Array.from(String(content||''))){
   if(ctx.measureText(line+char).width>maxWidth&&line){
     ctx.fillText(line,x,y);y+=lineHeight;count++;line=char;
     if(count>=maxLines-1)break;
   }else line+=char;
 }
 if(line){ctx.fillText(line,x,y);y+=lineHeight;}
 return y;
}
function getQuote(){
 const app=window.ChuankeApp;
 if(!app||typeof app.getResult!=='function')return null;
 const quote=app.getResult();
 return quote?.status==='ready'&&Number.isFinite(quote.offer)?quote:null;
}
function drawSeal(ctx,x,y){
 ctx.save();ctx.translate(x,y);ctx.rotate(-.13);
 ctx.lineWidth=5;ctx.strokeStyle='#a65443';ctx.globalAlpha=.75;
 ctx.strokeRect(-60,-59,120,118);ctx.strokeRect(-52,-51,104,102);
 ctx.textAlign='center';ctx.fillStyle='#a65443';
 ctx.font='bold 28px "Songti SC","STSong",serif';
 ctx.fillText('船客',0,-9);ctx.fillText('甄选',0,29);
 ctx.restore();
}
let canvas,quoted;
function generateQuoteCanvas(q){
 canvas=$('quoteEdictCanvas');if(!canvas)return;
 canvas.width=1080;canvas.height=1480;
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const grad=ctx.createLinearGradient(0,0,1080,1480);
 grad.addColorStop(0,'#fff8e9');grad.addColorStop(.55,'#f7e9d1');grad.addColorStop(1,'#fff7e9');
 ctx.fillStyle=grad;ctx.fillRect(0,0,1080,1480);
 ctx.strokeStyle='#a58a64';ctx.lineWidth=5;ctx.strokeRect(41,40,998,1399);
 ctx.strokeStyle='#dcc6a3';ctx.lineWidth=2;ctx.strokeRect(56,56,968,1369);
 ctx.textAlign='center';ctx.fillStyle='#94744d';ctx.font='32px "Songti SC","STSong",serif';
 ctx.fillText('船 客 旅 行 · 航 次 报 价',540,149);
 ctx.font='bold 76px "Songti SC","STSong",serif';ctx.fillStyle='#66462e';
 ctx.fillText('御 前 报 价 圣 旨',540,260);
 ctx.font='26px sans-serif';ctx.fillStyle='#937c61';ctx.fillText('CHUANKE  •  CRUISE QUOTATION',540,316);
 ctx.strokeStyle='#c9a979';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(124,350);ctx.lineTo(956,350);ctx.stroke();

 let y=430;
 ctx.textAlign='left';ctx.fillStyle='#66503d';ctx.font='30px "PingFang SC","Microsoft YaHei",sans-serif';
 y=fillTextWrap(ctx,'出发日期：'+fmtCN(q.route.date),127,y,830,52,2)+21;
 ctx.font='bold 37px "Songti SC","STSong",serif';
 y=fillTextWrap(ctx,'航次：'+q.route.name,127,y,830,56,3)+23;
 ctx.font='30px "PingFang SC","Microsoft YaHei",sans-serif';
 y=fillTextWrap(ctx,'舱型：'+window.ChuankePricing.nameCabin(q.cabin),127,y,830,51,3);
 y=fillTextWrap(ctx,'人数：'+q.people+'人  ·  '+window.ChuankePricing.stayName(q.stay),127,y,830,51,2)+10;
 y=fillTextWrap(ctx,'报价政策：'+q.policyName,127,y,830,51,3)+12;
 ctx.fillStyle='#f1e0c5';ctx.fillRect(120,y,840,210);
 ctx.fillStyle='#97734e';ctx.font='29px "Songti SC","STSong",serif';ctx.fillText('按优惠条款试算合计',151,y+50);
 ctx.fillStyle='#864e2c';ctx.font='bold 68px "PingFang SC",sans-serif';ctx.fillText(money(q.offer),148,y+133);
 ctx.textAlign='right';ctx.fillStyle='#766149';ctx.font='25px sans-serif';ctx.fillText('约 '+money(q.offer/q.people)+' / 人',922,y+134);
 y+=264;ctx.textAlign='left';ctx.fillStyle='#715842';ctx.font='30px "PingFang SC",sans-serif';
 y=fillTextWrap(ctx,'未打折舱位原价合计：'+money(q.standard),127,y,840,51,2)+10;
 ctx.font='26px "PingFang SC",sans-serif';y=fillTextWrap(ctx,'政策文件截止：'+fmtCN(q.route.deadline),127,y,840,43,2)+18;
 const isExpired=q.policy.code==='expired';
 const warn=isExpired?'【重要提醒】优惠文件已过期，本报价仍按原优惠条款试算；能否按此价报名须由旅行顾问或产品部核实，不代表优惠自动延期。'
 :q.policy.code==='upcoming'?'【提醒】优惠政策尚未开始，本报价为政策试算价，实际报名价格须确认。'
 :q.policy.code==='unknown'?'【提醒】文件有效期不完整，报名价格须另行核实。'
 :'【提示】请以实际政策、舱位和最终合同确认为准；具体资格须由旅行顾问核实。';
 const warnY=Math.max(y,1140);
 ctx.fillStyle='#fff7ee';ctx.fillRect(120,warnY-31,840,157);
 ctx.fillStyle=isExpired?'#a04438':'#745b42';ctx.font='25px "PingFang SC",sans-serif';
 fillTextWrap(ctx,warn,145,warnY+11,790,38,3);
 drawSeal(ctx,866,1321);
 ctx.fillStyle='#8f7d67';ctx.font='23px "PingFang SC",sans-serif';
 ctx.fillText('本单为计算工具生成的试算凭证，不构成船司保留舱位或锁价承诺。',122,1343);
 ctx.fillText('生成日期：'+fmtCN(bjToday())+'  ·  船客旅行',122,1386);
}
function quoteDialogOpen(){
 const q=getQuote();
 if(!q){
   alert('请先确认人数、航次和舱型，确保左侧可计算报价后再生成圣旨。');
   return;
 }
 quoted=q;
 try{generateQuoteCanvas(q);}
 catch(e){$('quoteEdictStatus').textContent='生成图片失败，请先检查报价条件或更换浏览器。';return;}
 const dialog=$('quoteEdictDialog');
 try{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
 catch(e){dialog.setAttribute('open','');}
 $('quoteEdictStatus').textContent=q.policy.code==='expired'?'已标注原优惠政策过期，发给客户前请先核价。':'已根据当前报价条件生成图片，建议发给客户前确认舱位。';
}
function closeQuote(){
 const dialog=$('quoteEdictDialog');
 if(dialog.open&&typeof dialog.close==='function')dialog.close();
 else dialog.removeAttribute('open');
}
async function blobOfCanvas(){
 return new Promise((resolve,reject)=>{
   canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('生成图片失败')),'image/png');
 });
}
function imageName(){return '船客报价圣旨_'+bjToday()+'.png'}
async function downloadImage(){
 if(!quoted)return;
 const blob=await blobOfCanvas();
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=imageName();
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(a.href),30000);
 $('quoteEdictStatus').textContent='报价圣旨图片已生成。如果在微信内打开，请长按图片或使用浏览器保存。';
}
async function copyImage(){
 const blob=await blobOfCanvas();
 if(navigator.clipboard&&window.ClipboardItem&&window.isSecureContext){
   await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
   $('quoteEdictStatus').textContent='图片已复制，可以尝试粘贴到支持图片粘贴的聊天窗口。';
 }else{
   $('quoteEdictStatus').textContent='当前浏览器不支持直接复制图片，请点击「保存图片」后发送。';
 }
}
async function shareImage(){
 const blob=await blobOfCanvas(),file=new File([blob],imageName(),{type:'image/png'});
 if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
   await navigator.share({files:[file],title:'船客旅行 · 报价圣旨'});
   $('quoteEdictStatus').textContent='已调起系统分享菜单。';
 }else await downloadImage();
}
async function copyText(){
 const t=window.ChuankeApp?.copyText?.()||'';
 if(!t){$('quoteEdictStatus').textContent='报价尚不可复制，请检查计算条件。';return;}
 if(navigator.clipboard&&window.isSecureContext){
   await navigator.clipboard.writeText(t);
   $('quoteEdictStatus').textContent='客户版报价文字已复制。';
 }else{
   const temp=document.createElement('textarea');temp.value=t;temp.readOnly=true;temp.style.cssText='position:fixed;left:-9999px;top:0;';document.body.appendChild(temp);
   temp.select();let ok=false;
   try{ok=document.execCommand('copy')}catch(e){}temp.remove();
   $('quoteEdictStatus').textContent=ok?'报价文字已复制。':'请点击原网页的「复制客户版报价」按钮。';
 }
}
function run(task){return async ()=>{
 try{await task()}catch(e){$('quoteEdictStatus').textContent=e?.name==='AbortError'?'已取消分享。':('操作失败：'+String(e?.message||e));}
}}
$('openQuoteEdict')?.addEventListener('click',quoteDialogOpen);
$('closeQuoteEdict')?.addEventListener('click',closeQuote);
$('downloadQuoteEdict')?.addEventListener('click',run(downloadImage));
$('copyImageQuoteEdict')?.addEventListener('click',run(copyImage));
$('shareQuoteEdict')?.addEventListener('click',run(shareImage));
$('copyTextQuoteEdict')?.addEventListener('click',run(copyText));
$('quoteEdictDialog')?.addEventListener('click',e=>{if(e.target===$('quoteEdictDialog'))closeQuote();});
drawDaily();
setInterval(drawDaily,35000);
window.GanluEdicts={bjToday,drawDaily,generateQuoteCanvas,quoteDialogOpen};
})();