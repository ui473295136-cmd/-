/* 甘露寺·财务部：语音/文字自然语言报价入口。报价只来自页面现有计价引擎。 */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const host=()=>window.ChuankeApp;
 const cnDigits={'零':0,'〇':0,'一':1,'二':2,'两':2,'俩':2,'三':3,'仨':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
 const cnNum=str=>{
   if(!str)return null;
   if(/^\d+$/.test(str))return Number(str);
   if(str==='十')return 10;
   if(str.includes('十')){
     const [a,b]=str.split('十');
     return (a?cnDigits[a]:1)*10+(b?cnDigits[b]:0);
   }
   return Object.hasOwn(cnDigits,str)?cnDigits[str]:null;
 };
 const numPat='(\\d{1,3}|[零〇一二两俩三仨四五六七八九十]+)';
 const findCount=(t,words)=>{
   const pattern=new RegExp(numPat+'\\s*(?:位|个|名)?\\s*(?:'+words+')');
   const m=t.match(pattern);return m?cnNum(m[1]):null;
 };
 const numberOrNull=n=>Number.isInteger(n)&&n>=0?n:null;
 const routes=()=>host()?.getData?.()||[];
 const caption=c=>window.ChuankePricing?.nameCabin?.(c)||c.name;
 const cash=n=>'¥'+Number(n).toLocaleString('zh-CN',{maximumFractionDigits:2});
 const state={routeId:null,adults:null,children:0,soloAdults:0,cabinId:'',customer:'new'};
 let recognition=null,listening=false,lastReply=null, speak=false;
 const status=s=>{const el=$('voiceStatus');if(el)el.textContent=s;};
 function routeFromText(raw){
   const t=raw.replace(/\s+/g,' ').replace(/０/g,'0');
   let date=null,year=null;
   let m=t.match(/(20\d{2})[年.\-/](\d{1,2})[月.\-/](\d{1,2})/);
   if(m){year=Number(m[1]);date=String(m[2]).padStart(2,'0')+String(m[3]).padStart(2,'0');}
   if(!date){
     m=t.match(/(\d{1,2})月(\d{1,2})[日号]?/);
     if(m)date=String(m[1]).padStart(2,'0')+String(m[2]).padStart(2,'0');
   }
   if(!date){
     m=t.match(/(?:^|[^\d])(0[1-9]|1[0-2])([0-3]\d)(?!\d)/);
     if(m)date=m[1]+m[2];
   }
   if(date){
     const matches=routes().filter(r=>r.date.slice(5).replace('-','')===date&&(!year||Number(r.date.slice(0,4))===year));
     if(matches.length===1)return {route:matches[0],specified:true};
     if(matches.length>1){
       const narrowed=matches.filter(r=>(/南美|七国/.test(t)?/南美|七国/.test(r.name):/加拉帕戈斯|加帕/.test(t)?/加拉帕戈斯|厄瓜多尔/.test(r.name):/南极/.test(t)?/南极/.test(r.name):true));
       if(narrowed.length===1)return {route:narrowed[0],specified:true};
       return {ambiguous:narrowed.length?narrowed:matches,specified:true};
     }
     return {missing:date,specified:true};
   }
   const hit=routes().filter(r=>t.includes(r.name.replace(/\s+/g,''))||(t.includes('南美七国')&&/南美七国/.test(r.name)));
   if(hit.length===1)return {route:hit[0],specified:true};
   return {route:routes().find(r=>r.id===state.routeId)||null,specified:false};
 }
 function partyFromText(text){
   const t=text.replace(/\s+/g,'').replace(/(?:二|两|三|四|2|3|4)人(?:海景|间|舱|房)/g,'房型');
   let adults=null,children=null,total=null,solo=null;
   const pair=t.match(new RegExp(numPat+'\\s*(?:位|个)?\\s*(?:大|成人|大人)\\s*'+numPat+'\\s*(?:位|个)?\\s*(?:小|儿童|小孩|孩子)'));
   if(pair){adults=cnNum(pair[1]);children=cnNum(pair[2]);}
   if(adults===null)adults=findCount(t,'(?:成人|大人|成年人|大客人)');
   if(children===null)children=findCount(t,'(?:儿童|未成年(?:人)?|小孩|孩子|小朋友|宝宝)');
   const shortAdults=t.match(new RegExp(numPat+'\\s*大(?:\\s|$|'+numPat+')'));
   if(adults===null&&shortAdults)adults=cnNum(shortAdults[1]);
   const shortChildren=t.match(new RegExp(numPat+'\\s*小(?:\\s|$|，|。)'));
   if(children===null&&shortChildren)children=cnNum(shortChildren[1]);
   total=findCount(t,'(?:位(?:旅客|客人)?|人(?:同行|出行|报名)?|客人|游客|旅客)');
   if(total===null){
     const m=t.match(new RegExp(numPat+'\\s*(?:位|个|名)?\\s*人(?:去|报名|参加|一起)?'));
     if(m)total=cnNum(m[1]);
   }
   if(adults===null&&/一对夫妻/.test(t))adults=2;
   if(total===null&&adults===null){
     const man=findCount(t,'(?:男(?:性|生|的|人|士)?)');
     const woman=findCount(t,'(?:女(?:性|生|的|人|士)?)');
     if(man!==null||woman!==null)adults=(man||0)+(woman||0);
   }
   if(total!==null){
     if(children!==null&&adults===null)adults=total-children;
     else if(adults===null)adults=total;
     else if(children===null&&total>=adults)children=total-adults;
   }
   if(adults!==null&&children===null)children=0;
   if(/(?:一个|1个|一人|1人)(?:朋友|客人|成人|男生|女生)?(?:要|想)?(?:独住|单住|住单间|一个人一间)/.test(t)||/一位(?:朋友|客人|成人)?(?:单独住|独住)/.test(t))solo=1;
   if(/(?:一对夫妻|两个人一间).*(?:另一|还有|另外).*(?:独住|单住|单间)/.test(t))solo=1;
   const soloMatch=t.match(new RegExp(numPat+'\\s*(?:位|个|名)?\\s*(?:成人|人|客人)?\\s*(?:独住|单住|住单间)'));
   if(soloMatch)solo=cnNum(soloMatch[1]);
   if(/(?:全部|所有|每人)(?:都)?(?:单住|独住|住单间)/.test(t)&&adults!==null)solo=adults;
   return {adults:numberOrNull(adults),children:numberOrNull(children),soloAdults:numberOrNull(solo),specified:adults!==null||children!==null||total!==null};
 }
 function floorFromText(t){
   const m=t.match(/(?:第)?([345678]|[三四五六七八])\s*(?:层|楼)/);
   return m?cnNum(m[1]):null;
 }
 function cabinFromText(r,t){
   const choose=[...r.cabins||[]];
   if(/不选房型|自动推荐|最便宜的|最低价|随便什么房型/.test(t))return {selected:'',specified:true};
   const floor=floorFromText(t),kind=/三人|三床|三人间/.test(t)?'triple':/舷窗/.test(t)?'porthole':/法式阳台/.test(t)?'french':/豪华阳台/.test(t)?'deluxeBalcony':/阳台/.test(t)?'balcony':/海景/.test(t)?'ocean':/套房/.test(t)?'suite':null;
   if(floor===null&&kind===null)return {specified:false};
   let found=choose.filter(c=>{
     if(floor!==null&&!(c.deck===floor||caption(c).includes(floor+'层')||c.name?.includes(floor+'层')))return false;
     if(kind==='triple')return /三人|家庭/.test(c.name)||c.id==='4t';
     if(kind==='porthole')return /舷窗/.test(c.name);
     if(kind==='french')return /法式阳台/.test(c.name);
     if(kind==='deluxeBalcony')return /豪华阳台/.test(c.name);
     if(kind==='balcony')return /阳台/.test(c.name);
     if(kind==='ocean')return /海景/.test(c.name)&&!/三人|家庭/.test(c.name);
     if(kind==='suite')return /套房/.test(c.name);
     return true;
   });
   if(!found.length)return {notFound:true,floor,kind,specified:true};
   const available=found.filter(c=>!c.soldOut&&!c.waitlist&&Number.isFinite(c.price));
   if(available.length===1)return {selected:available[0].id,specified:true};
   if(available.length>1)return {ambiguous:available.slice(0,6),specified:true};
   return {unavailable:found,specified:true};
 }
 function message(type,content,copyValue=null,suggestions=[]){
   const node=document.createElement('div');node.className='voiceBubble '+(type==='user'?'fromUser':'fromBot');
   const textNode=document.createElement('div');textNode.className='voiceBubbleText';textNode.textContent=content;node.appendChild(textNode);
   if(copyValue){
     const actions=document.createElement('div');actions.className='voiceBubbleActions';
     const copy=document.createElement('button');copy.type='button';copy.textContent='复制客户版报价';copy.addEventListener('click',()=>copyText(copyValue));
     actions.appendChild(copy);node.appendChild(actions);
   }
   if(suggestions.length){
     const actions=document.createElement('div');actions.className='voiceBubbleChoices';
     suggestions.forEach(item=>{
       const b=document.createElement('button');b.type='button';b.textContent=item.label;
       b.addEventListener('click',()=>submit(item.query));actions.appendChild(b);
     });
     node.appendChild(actions);
   }
   $('voiceMessages').appendChild(node);$('voiceMessages').scrollTop=$('voiceMessages').scrollHeight;
   return node;
 }
 async function copyText(content){
   try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(content);status('已复制客户报价');return;}}
   catch(e){}
   const field=$('voiceText');field.value=content;field.focus();field.select();
   try{document.execCommand('copy');status('已复制客户报价');}catch(e){status('可在输入框中手动复制报价。');}
 }
 function reply(content,quote=null,choices=[]){
   lastReply=quote;
   message('bot',content,quote?.shortText||null,choices);
   if(speak&&window.speechSynthesis){
     const text=content.slice(0,210).replace(/[【】·¥]/g,' ');
     window.speechSynthesis.cancel();
     const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=1;window.speechSynthesis.speak(u);
   }
 }
 function submit(raw){
   const text=String(raw||'').trim();if(!text)return;
   $('voiceText').value='';
   message('user',text);
   if(/帮助|怎么用|怎么问|示例/.test(text)){reply('你可以说：“三个成人报名1204，四层海景房多少钱？有什么优惠？”\n也可以继续说“换成五层海景房”或“两大一小”。');return;}
   const routeCheck=routeFromText(text);
   if(routeCheck.missing){reply('没有找到 '+routeCheck.missing+' 的航次，请核对出发日期。');return;}
   if(routeCheck.ambiguous){
     reply('这个日期对应多个航次，请说明目的地或航次名称。',null,routeCheck.ambiguous.map(r=>({label:r.date+' · '+r.name,query:r.date+' '+r.name})));
     return;
   }
   const r=routeCheck.route;
   if(!r){reply('请先告诉我航次，例如“1204南极”或“2027年1月18日”。');return;}
   if(state.routeId!==r.id){state.cabinId='';state.soloAdults=0;}
   state.routeId=r.id;
   const customer=/老客|老客户|复购|老会员/.test(text)?'old':/新客|新客户|首次报名/.test(text)?'new':state.customer;
   state.customer=customer;
   const party=partyFromText(text);
   if(party.specified){
     if(party.adults!==null)state.adults=party.adults;
     if(party.children!==null)state.children=party.children;
     if(party.soloAdults!==null)state.soloAdults=party.soloAdults;
     else if(/拼住|双人入住|两人一间/.test(text))state.soloAdults=0;
   }else if(party.soloAdults!==null)state.soloAdults=party.soloAdults;
   if(state.adults===null){reply('收到航次：'+r.date+' '+r.name+'。\n请问几位成人、几位儿童？');return;}
   const cabin=cabinFromText(r,text);
   if(cabin.notFound){reply('这条航次没有找到对应楼层或房型，请重新描述房型，或者说“自动推荐”。');return;}
   if(cabin.unavailable){reply('所说的房型当前是售罄、候补或价格待确认状态。请换一个房型。');return;}
   if(cabin.ambiguous){
     reply('你说的“'+(cabin.floor??'当前')+'层”有多个房型，价格不同，请选择具体房型：',null,cabin.ambiguous.map(c=>({label:caption(c)+' '+cash(c.price)+'/人',query:caption(c)})));
     return;
   }
   if(cabin.specified)state.cabinId=cabin.selected;
   const q=host()?.voiceQuote?.({routeId:r.id,adults:state.adults,children:state.children,soloAdults:state.soloAdults,cabinId:state.cabinId,customer:state.customer});
   if(!q){reply('报价组件尚未加载完成，请刷新网页后再试。');return;}
   if(!q.ok){reply(q.reason+'\n你可以修改人数、改选房型，或说“自动推荐”。');return;}
   reply(q.overview,q);
   status('报价已按现有航次价格及政策核算');
 }
 function setOpen(visible){
   $('voicePanel').hidden=!visible;$('voiceOpen').setAttribute('aria-expanded',String(visible));
   if(visible){$('voiceText').focus();status('输入文字或点击麦克风，说出航次和人数');}
   else if(listening&&recognition){recognition.stop();}
 }
 function startVoice(){
   const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!Engine){status('当前浏览器不支持语音识别，请使用 Chrome / Edge，或直接输入文字。');return;}
   if(listening){recognition?.stop();return;}
   try{
     recognition=new Engine();recognition.lang='zh-CN';recognition.continuous=false;recognition.interimResults=true;recognition.maxAlternatives=1;
     let finalTranscript='',sent=false;
     recognition.onstart=()=>{listening=true;$('voiceMic').classList.add('recording');status('正在倾听，请说出人数、航次和房型…');};
     recognition.onresult=e=>{
       let words='';
       let finalWords='';
       for(let i=0;i<e.results.length;i++){words+=e.results[i][0].transcript;if(e.results[i].isFinal)finalWords+=e.results[i][0].transcript;}
       if(finalWords)finalTranscript=finalWords;
       $('voiceText').value=words;
     };
     recognition.onerror=e=>{status(e.error==='not-allowed'?'麦克风权限被拒绝，可在浏览器地址栏允许后重试。':'识别失败（'+e.error+'），也可以直接打字。');};
     recognition.onend=()=>{
       listening=false;$('voiceMic').classList.remove('recording');
       if(finalTranscript.trim()&&!sent){sent=true;submit(finalTranscript.trim());}
       else if(!$('voiceStatus').textContent.includes('失败')&&!$('voiceStatus').textContent.includes('拒绝'))status('已停止语音识别');
     };
     recognition.start();
   }catch(e){status('无法启动语音识别，请检查麦克风权限或改用文字输入。');}
 }
 function init(){
   const btn=$('voiceOpen'),panel=$('voicePanel');
   if(!btn||!panel)return;
   btn.addEventListener('click',()=>setOpen(panel.hidden));
   $('voiceClose').addEventListener('click',()=>setOpen(false));
   $('voiceMic').addEventListener('click',startVoice);
   $('voiceSend').addEventListener('click',()=>submit($('voiceText').value));
   $('voiceText').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit(e.currentTarget.value);}});
   $('voiceSpeak').addEventListener('change',e=>{speak=Boolean(e.target.checked);if(!speak)window.speechSynthesis?.cancel();});
   $('voiceCopy').addEventListener('click',()=>{if(lastReply?.shortText)copyText(lastReply.shortText);else status('请先查询一次报价');});
 }
 window.GanluVoice={parseRoute:routeFromText,parseParty:partyFromText,parseCabin:cabinFromText,ask:submit};
 init();
})();