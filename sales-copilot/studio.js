(function(){
"use strict";
const $=id=>document.getElementById(id);
const state={style:"editorial",format:"xhs",background:null,backgroundUrl:null,sourceText:"",draft:null,copyMode:"social"};
const styles={
editorial:{name:"高级旅行画册",mood:"真实摄影、自然光、克制留白、精品旅行画册、冷静高级的极地色调",visual:"documentary travel photography, natural light, authentic details, elegant editorial art direction, restrained layout"},
luxury:{name:"轻奢杂志风",mood:"深海蓝、冰川灰、低饱和香槟金、精品旅行杂志、精致而克制",visual:"luxury travel editorial, deep navy and muted champagne gold, premium magazine photography, sophisticated tonal contrast"},
documentary:{name:"探险纪实风",mood:"真实探险记录、自然地貌、现场感、地图与科考手记的视觉语言",visual:"authentic expedition documentary photography, field notes aesthetic, topographic lines, natural textures, restrained scientific journal design"},
minimal:{name:"极简高级风",mood:"极简构图、大留白、单一视觉焦点、现代艺术画册",visual:"minimalist premium travel poster, generous negative space, one strong focal point, modern art-book composition"},
cinematic:{name:"电影叙事风",mood:"电影级广角、宏大尺度、真实天气、自然光影、史诗感但不夸张",visual:"cinematic wide-angle travel photography, epic scale, atmospheric natural light, realistic weather, subtle filmic contrast"},
illustration:{name:"艺术插画风",mood:"高级旅行手绘插画、纸张肌理、低饱和冰川蓝与暖沙色",visual:"premium hand-painted travel illustration, fine paper texture, sophisticated limited palette, editorial illustration, no childish cartoon"}
};
const formats={xhs:{w:900,h:1200,label:"3:4 · 小红书内页"},poster:{w:900,h:1200,label:"3:4 · 竖版海报"},story:{w:1600,h:900,label:"16:9 · 视频号封面"},square:{w:1100,h:1100,label:"1:1 · 朋友圈方图"},storyTall:{w:900,h:1600,label:"9:16 · 竖屏封面"},long:{w:800,h:3200,label:"1:4 · 行程长图"}};
const safe=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800);}
function loadScript(src,test){return new Promise((resolve,reject)=>{if(test())return resolve();const old=document.querySelector('script[data-src="'+src+'"]');if(old){old.addEventListener("load",resolve,{once:true});old.addEventListener("error",()=>reject(new Error("识别组件加载失败")), {once:true});return;}const sc=document.createElement("script");sc.src=src;sc.dataset.src=src;sc.onload=()=>test()?resolve():reject(new Error("识别组件不可用"));sc.onerror=()=>reject(new Error("无法连接识别组件，请检查网络"));document.head.appendChild(sc);});}
async function readFile(file){
if(!file)throw new Error("没有选择文件");
if(file.size>20*1024*1024)throw new Error("文件超过20MB，请压缩后重试");
const name=file.name.toLowerCase();
if(name.endsWith(".txt")||name.endsWith(".md")||file.type==="text/plain")return await file.text();
if(name.endsWith(".docx")){await loadScript("https://unpkg.com/mammoth@1.8.0/mammoth.browser.min.js",()=>!!window.mammoth);const out=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return out.value||"";}
if(name.endsWith(".pdf")||file.type==="application/pdf"){await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",()=>!!window.pdfjsLib);window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";const pdf=await window.pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;let out=[];for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);const c=await page.getTextContent();out.push(c.items.map(i=>i.str).join(" "));}return out.join("\n");}
throw new Error("当前支持 DOCX、PDF、TXT、MD 文件；旧版 DOC 请另存为 DOCX 或 PDF。");
}
function cleanLines(text){return String(text||"").replace(/\r/g,"\n").replace(/[ \t]+/g," ").split("\n").map(s=>s.trim()).filter(Boolean);}
function extract(text){
const lines=cleanLines(text),full=lines.join("\n");
const dateMatches=[...new Set((full.match(/(?:20\d{2}[年./-])?\s*\d{1,2}\s*[月./-]\s*\d{1,2}\s*日?/g)||[]).map(x=>x.replace(/\s/g,"")))].slice(0,8);
const duration=[...new Set((full.match(/\b\d{1,2}\s*(?:天|晚)\b/g)||[]))].slice(0,5);
const shipCandidates=lines.filter(l=>/(号|邮轮|邮船|探险船|破冰船|船长|船司)/.test(l)&&l.length<70).slice(0,5);
const dayLines=lines.filter(l=>/(?:Day\s*\d|第\s*\d+\s*天|D\d+\b|登陆|巡游|抵达|乘船|飞往|探索|探访|航行|游览|探险)/i.test(l)).slice(0,12);
const locationMatches=[...new Set((full.match(/南极半岛|南乔治亚岛|南设得兰群岛|德雷克海峡|乌斯怀亚|布宜诺斯艾利斯|乔治王岛|北极|斯瓦尔巴|格陵兰|加拉帕戈斯|福克兰群岛/g)||[]))];
const prices=[...new Set((full.match(/(?:人民币)?[￥¥$]\s?[\d,]+(?:\.\d+)?(?:\s?美元)?|[\d,]+\s?(?:美元|美金|人民币|元\/人|元每人)/g)||[]))].slice(0,5);
return {lines,dates:dateMatches,duration,ships:shipCandidates,days:dayLines,places:locationMatches,prices,full};
}
function summarize(){
const text=$("itineraryText").value.trim();if(!text){toast("请先上传行程文件或粘贴行程原文");return null;}
const data=extract(text);state.sourceText=text;state.draft=data;
const title=$("projectName").value.trim()||data.places.slice(0,2).join(" · ")||"极地探索之旅";
if(!$("projectName").value.trim())$("projectName").value=title;
const items=[
["识别到的日期",data.dates.join("、")||"未识别，请人工填写"],
["行程天数",data.duration.join("、")||"未识别，请人工填写"],
["目的地",data.places.join("、")||"请从原文核对"],
["船舶 / 航线线索",data.ships.join("；")||"未识别，请人工填写"],
["价格线索",data.prices.join("、")||"未识别，不会自动写入海报"],
["日程片段",data.days.slice(0,5).join("；")||"请人工选择核心体验"]
];
$("extractedGrid").innerHTML=items.map(([k,v])=>'<div class="extracted-item"><small>'+safe(k)+'</small><b>'+safe(v)+'</b></div>').join("");
$("extracted").hidden=false;
if(!$("highlights").value.trim()&&data.days.length){$("highlights").value=data.days.slice(0,5).map(x=>x.replace(/^[•·\-–—\s]+/,"")).join("\n");}
if(!$("priceInfo").value.trim()&&data.dates.length)$("priceInfo").value=data.dates.slice(0,3).join(" / ");
$("parseStatus").textContent="已提取文字线索，请检查日期、船名和价格。";
$("charCount").textContent=text.length+" 字";
toast("已整理行程线索；请核对识别结果");
return data;
}
function getTitle(){
const manual=$("mainTitle").value.trim();if(manual)return manual;
const product=$("projectName").value.trim();
const data=state.draft||extract($("itineraryText").value);
const place=data.places[0]||(/北极/.test(product)?"北极":/南极/.test(product)?"南极":"极地");
if(/南极/.test(place)||/南极/.test(product))return "去南极，亲眼看看世界的另一面";
if(/北极|斯瓦尔巴|格陵兰/.test(place)||/北极/.test(product))return "去北极，走进冰雪与荒野";
if(/加拉帕戈斯/.test(product+place))return "去加拉帕戈斯，看见自然的另一面";
return product||"把世界，走成亲历";
}
function getSubtitle(){
if($("subtitle").value.trim())return $("subtitle").value.trim();
const data=state.draft||extract($("itineraryText").value);
const place=data.places.slice(0,2).join(" · ");
if(/南极/.test(place)||/南极/.test($("projectName").value))return "一场关于冰川、海洋与野生生命的极地探险";
if(/北极|斯瓦尔巴|格陵兰/.test(place)||/北极/.test($("projectName").value))return "沿着冰海与荒野，寻找地球的另一种辽阔";
return "把远方，变成一段值得亲历的旅程";
}
function getHighlights(){
let list=$("highlights").value.split(/\n|；|;/).map(s=>s.trim()).filter(Boolean).slice(0,5);
if(!list.length&&state.draft)list=state.draft.days.slice(0,3);
if(!list.length)list=["目的地与行程体验以正式资料为准","小团体验与活动安排请核对原文"];
return list;
}
function makeCopy(mode){
const title=getTitle(),sub=getSubtitle(),product=$("projectName").value.trim()||"这趟旅行",h=getHighlights(),data=state.draft||extract($("itineraryText").value),dateInfo=$("priceInfo").value.trim(),cta=$("callToAction").value;
const validDetails=[...data.places.slice(0,4),...data.duration.slice(0,2)].filter(Boolean);
if(mode==="short")return title+"\n"+sub+"\n\n"+h.slice(0,3).map(x=>"· "+x).join("\n")+(dateInfo?"\n\n"+dateInfo:"")+(cta!=="不加销售引导"?"\n\n"+cta:"");
if(mode==="moments")return "最近在整理一趟"+product+"。\n\n比起把行程写得很满，我更希望先把真正值得期待的体验讲清楚：\n"+h.slice(0,3).map(x=>"· "+x).join("\n")+"\n\n具体航期、船舶与费用，以最终核实的行程资料为准。"+(cta!=="不加销售引导"?"\n如果你也在做旅行功课，可以先收藏。":"");
return title+"\n"+sub+"\n\n有些地方，光看照片很难真正理解。真正出发之前，先把路线、活动和行程节奏看明白，才能判断它是否适合自己。\n\n这份行程值得关注的几个点：\n"+h.map(x=>"· "+x).join("\n")+(validDetails.length?"\n\n行程线索："+validDetails.join(" / "):"")+(dateInfo?"\n已核对的信息："+dateInfo:"")+"\n\n航期、船舶、费用包含与活动安排，请以正式行程和合同为准。"+(cta!=="不加销售引导"?"\n\n"+cta+"，先把适合自己的方案了解清楚。":"");
}
function buildPrompt(){
const f=formats[$("format").value]||formats.xhs,style=styles[state.style],title=getTitle(),sub=getSubtitle(),h=getHighlights(),product=$("projectName").value.trim()||"极地旅行";
const source=$("itineraryText").value.trim().slice(0,10000);
const details=(state.draft?.places||[]).join("、");
return "你是 GPT 生图智能体，请为高品质旅行品牌「船客旅行」创作一张用于商业传播的旅行海报底图。\n\n【任务】\n主题："+product+"\n主标题（后续由网页叠加，请不要把文字画进图里）："+title+"\n副标题参考："+sub+"\n目的地线索："+(details||"以提供的行程资料为准")+"\n核心体验参考：\n"+h.map((x,i)=>(i+1)+". "+x).join("\n")+"\n目标受众："+$("audience").value+"\n视觉方向："+style.name+"；"+style.mood+"\n英文视觉描述："+style.visual+"\n\n【画面要求】\n- 画幅比例："+f.w+":"+f.h+"（"+f.label+"），构图适合后期叠加中文标题与行程卖点。\n- 真实摄影质感优先，细节自然，具有空间层次、真实光线和可信比例；除插画风格外，避免塑料质感、过度锐化、过饱和和明显 AI 痕迹。\n- 主题画面集中在中上部或一侧，保留约 30% 的干净留白供后期排版；主体不要挡住主要文字区域。\n- 不生成任何文字、字母、数字、Logo、水印、二维码或虚构品牌标志；不要画出类似文字的乱码。\n- 不虚构特定船名、航期、价格、服务承诺、动物近景或行程中没有明确提到的体验。船舶、人物、动物、冰山比例符合真实世界。\n- 画面有编辑设计感，不做廉价电商促销模板，不添加大红爆炸贴、假按钮、夸张金属字。\n\n【行程原文供理解，不要直接把文字绘制进图片】\n"+(source||"尚未提供完整行程原文，请只生成不含文字的通用旅行视觉底图。");
}
function fitText(ctx,text,maxWidth){
const chars=Array.from(text),lines=[];let line="";
for(const ch of chars){if(ctx.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;}else line+=ch;}
if(line)lines.push(line);return lines;
}
function drawText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
const lines=fitText(ctx,String(text||""),maxWidth).slice(0,maxLines||99);lines.forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));return y+lines.length*lineHeight;
}
function drawPoster(){
const f=formats[$("format").value]||formats.xhs,canvas=$("posterCanvas"),ctx=canvas.getContext("2d");
const scale=1.25;canvas.width=f.w;canvas.height=f.h;
const w=canvas.width,h=canvas.height,ratio=w/900;
ctx.save();
if(state.background&&state.background.complete){const im=state.background,ir=im.width/im.height,cr=w/h;let sx=0,sy=0,sw=im.width,sh=im.height;if(ir>cr){sw=im.height*cr;sx=(im.width-sw)/2;}else{sh=im.width/cr;sy=(im.height-sh)/2;}ctx.drawImage(im,sx,sy,sw,sh,0,0,w,h);}else{
let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#d8e1dc");g.addColorStop(.4,"#9fb9bc");g.addColorStop(.7,"#4e727d");g.addColorStop(1,"#1d3b49");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
const sunX=w*.74,sunY=h*.24;const rg=ctx.createRadialGradient(sunX,sunY,2,sunX,sunY,w*.2);rg.addColorStop(0,"rgba(247,231,192,.85)");rg.addColorStop(1,"rgba(247,231,192,0)");ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);
ctx.fillStyle="#b9ccc7";ctx.beginPath();ctx.moveTo(0,h*.57);ctx.lineTo(w*.2,h*.33);ctx.lineTo(w*.33,h*.48);ctx.lineTo(w*.53,h*.28);ctx.lineTo(w*.77,h*.53);ctx.lineTo(w,h*.4);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
ctx.fillStyle="#e9ede2";ctx.beginPath();ctx.moveTo(0,h*.62);ctx.lineTo(w*.22,h*.43);ctx.lineTo(w*.32,h*.53);ctx.lineTo(w*.54,h*.37);ctx.lineTo(w*.72,h*.58);ctx.lineTo(w,h*.48);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
const sea=ctx.createLinearGradient(0,h*.62,0,h);sea.addColorStop(0,"#6f9296");sea.addColorStop(1,"#1e3d4a");ctx.fillStyle=sea;ctx.fillRect(0,h*.64,w,h*.36);
for(let i=0;i<32;i++){ctx.strokeStyle="rgba(245,245,224,"+(0.05+(i%4)*.02)+")";ctx.lineWidth=Math.max(1,ratio);ctx.beginPath();let yy=h*.69+i*h*.009;ctx.moveTo(w*(i%7)*.12,yy);ctx.lineTo(w*(.35+(i%5)*.14),yy+(i%3)*ratio);ctx.stroke();}
}
const dark=ctx.createLinearGradient(0,0,0,h);dark.addColorStop(0,"rgba(15,34,43,.56)");dark.addColorStop(.3,"rgba(15,34,43,.04)");dark.addColorStop(.56,"rgba(15,34,43,.02)");dark.addColorStop(1,"rgba(11,27,36,.75)");ctx.fillStyle=dark;ctx.fillRect(0,0,w,h);
const pad=w*.075,serif='"Noto Serif SC","Songti SC",serif',sans='"Noto Sans SC","Microsoft YaHei",sans-serif';
ctx.strokeStyle="rgba(244,233,205,.65)";ctx.lineWidth=Math.max(1,w*.0011);ctx.strokeRect(pad*.62,pad*.62,w-pad*1.24,h-pad*1.24);
ctx.fillStyle="#e8d8b7";ctx.font="500 "+Math.max(12,w*.015)+"px "+sans;ctx.letterSpacing="2px";ctx.fillText("POLAR JOURNEY  /  CHUANKE",pad,pad*1.34);ctx.letterSpacing="0px";
ctx.fillStyle="#fffaf0";let title=getTitle();let titleSize=w*.066;if(title.length>15)titleSize=w*.052;if(w/h<.8&&h>w*1.4)titleSize=w*.072;ctx.font="600 "+titleSize+"px "+serif;let titleY=h*.29;let titleLines=fitText(ctx,title,w*.79).slice(0,3);titleLines.forEach((line,i)=>ctx.fillText(line,pad,titleY+i*titleSize*1.45));
let subY=titleY+titleLines.length*titleSize*1.45+Math.max(12,w*.018);ctx.fillStyle="#f0e9d8";ctx.font="400 "+Math.max(13,w*.021)+"px "+sans;subY=drawText(ctx,getSubtitle(),pad,subY,w*.77,Math.max(20,w*.031),2);
ctx.fillStyle="#e1c99c";ctx.fillRect(pad,subY+Math.max(8,w*.018),w*.08,Math.max(2,w*.003));
let list=getHighlights();let listY=Math.max(subY+Math.max(30,w*.055),h*.59);const itemSize=Math.max(12,w*.019),lineH=itemSize*1.6;
list.slice(0,3).forEach((item,i)=>{const yy=listY+i*lineH*1.35;ctx.fillStyle="#e5cf9f";ctx.beginPath();ctx.arc(pad+3,yy-itemSize*.32,Math.max(2,w*.003),0,Math.PI*2);ctx.fill();ctx.fillStyle="#fffaf0";ctx.font="500 "+itemSize+"px "+sans;drawText(ctx,item,pad+itemSize,yy,w*.78,lineH,2);});
const brand=$("brandName").value.trim()||"船客旅行";const footY=h-pad*1.05;
ctx.strokeStyle="rgba(244,233,205,.42)";ctx.beginPath();ctx.moveTo(pad,footY-w*.045);ctx.lineTo(w-pad,footY-w*.045);ctx.stroke();
ctx.fillStyle="#f7efdc";ctx.font="500 "+Math.max(13,w*.02)+"px "+sans;ctx.fillText(brand,pad,footY);
const info=$("priceInfo").value.trim();if(info){ctx.fillStyle="#e9d6ad";ctx.font="400 "+Math.max(10,w*.013)+"px "+sans;drawText(ctx,info,pad,footY+Math.max(16,w*.027),w*.8,Math.max(15,w*.02),2);}
ctx.restore();
$("previewSize").textContent=f.label;
}
function updateOutputs(){
const txt=$("itineraryText").value.trim();if(!txt){toast("先导入行程资料，才能避免生成空泛文案");return;}
if(!state.draft)state.draft=extract(txt);
const title=getTitle();if(!$("mainTitle").value.trim())$("mainTitle").placeholder=title;
$("copyOutput").textContent=makeCopy(state.copyMode);
$("copyCount").textContent=$("copyOutput").textContent.length+" 字";
$("promptOutput").textContent=buildPrompt();
drawPoster();
state.draftGenerated=true;
toast("海报方案、配套文案和 GPT 指令已生成");
}
$("itineraryFile").addEventListener("change",async e=>{
const file=e.target.files&&e.target.files[0];if(!file)return;
$("fileChip").hidden=false;$("fileChip").textContent="正在读取："+file.name;$("parseStatus").textContent="正在本地提取文字…";
try{const text=await readFile(file);if(!text.trim())throw new Error("未提取到文字，可能是扫描版 PDF。请先 OCR 或直接粘贴行程文字。");$("itineraryText").value=text;state.sourceText=text;state.draft=null;$("charCount").textContent=text.length+" 字";$("fileChip").textContent="✓ "+file.name;$("parseStatus").textContent="文件读取完成；点击“提取行程要点”检查识别内容。";$("extracted").hidden=true;toast("文件读取完成");}
catch(err){$("fileChip").textContent=file.name;$("parseStatus").textContent=err.message;toast(err.message);}
});
$("itineraryText").addEventListener("input",()=>{$("charCount").textContent=$("itineraryText").value.length+" 字";state.draft=null;state.draftGenerated=false;});
$("extractBtn").addEventListener("click",summarize);
$("dropzone").addEventListener("dragover",e=>{e.preventDefault();$("dropzone").classList.add("dragover");});
$("dropzone").addEventListener("dragleave",()=> $("dropzone").classList.remove("dragover"));
$("dropzone").addEventListener("drop",e=>{e.preventDefault();$("dropzone").classList.remove("dragover");const file=e.dataTransfer.files&&e.dataTransfer.files[0];if(file){const dt=new DataTransfer();dt.items.add(file);$("itineraryFile").files=dt.files;$("itineraryFile").dispatchEvent(new Event("change"));}});
$("styleGrid").addEventListener("click",e=>{const b=e.target.closest("[data-style]");if(!b)return;state.style=b.dataset.style;document.querySelectorAll(".style-card").forEach(x=>x.classList.toggle("selected",x===b));if(state.draftGenerated){$("promptOutput").textContent=buildPrompt();drawPoster();}});
$("format").addEventListener("change",()=>{state.format=$("format").value;if(state.draftGenerated)drawPoster();else drawPoster();});
["projectName","brandName","mainTitle","subtitle","highlights","priceInfo"].forEach(id=>$(id).addEventListener("input",()=>{if(state.draftGenerated){$("copyOutput").textContent=makeCopy(state.copyMode);$("copyCount").textContent=$("copyOutput").textContent.length+" 字";$("promptOutput").textContent=buildPrompt();drawPoster();}}));
$("audience").addEventListener("change",()=>{if(state.draftGenerated)$("promptOutput").textContent=buildPrompt();});
$("callToAction").addEventListener("change",()=>{if(state.draftGenerated){$("copyOutput").textContent=makeCopy(state.copyMode);$("copyCount").textContent=$("copyOutput").textContent.length+" 字";}});
$("generateBtn").addEventListener("click",()=>{if(!state.draft)summarize();if(!$("itineraryText").value.trim())return;updateOutputs();});
document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",()=>{state.copyMode=b.dataset.copy;document.querySelectorAll("[data-copy]").forEach(x=>x.classList.toggle("active",x===b));$("copyOutput").textContent=makeCopy(state.copyMode);$("copyCount").textContent=$("copyOutput").textContent.length+" 字";}));
function copyText(text){if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text).then(()=>toast("已复制到剪贴板"),()=>fallbackCopy(text));fallbackCopy(text);}
function fallbackCopy(text){const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast("已复制到剪贴板");}catch(e){toast("复制失败，请手动选取文字");}ta.remove();}
$("copyCopy").addEventListener("click",()=>copyText($("copyOutput").textContent));
$("copyPrompt").addEventListener("click",()=>copyText($("promptOutput").textContent));
$("openChatGPT").addEventListener("click",()=>{const prompt=$("promptOutput").textContent;if(!state.draftGenerated||!prompt||prompt.startsWith("选择视觉")){toast("请先生成海报方案和 GPT 指令");return;}const win=window.open("https://chatgpt.com/","_blank","noopener");copyText(prompt);if(!win)toast("浏览器可能拦截了新窗口；指令已尝试复制，请手动打开 ChatGPT");else toast("已复制完整指令并打开 ChatGPT；粘贴后生成无文字底图");});
$("backgroundFile").addEventListener("change",e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)){toast("请上传 PNG、JPG 或 WEBP 图片");return;}if(file.size>15*1024*1024){toast("底图最大支持15MB");return;}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{if(state.backgroundUrl)URL.revokeObjectURL(state.backgroundUrl);state.background=img;state.backgroundUrl=url;$("removeBackground").hidden=false;drawPoster();toast("底图已载入并排版");};img.onerror=()=>{URL.revokeObjectURL(url);toast("图片读取失败，请换一张图片");};img.src=url;});
$("removeBackground").addEventListener("click",()=>{state.background=null;if(state.backgroundUrl)URL.revokeObjectURL(state.backgroundUrl);state.backgroundUrl=null;$("backgroundFile").value="";$("removeBackground").hidden=true;drawPoster();toast("已恢复模板背景");});
$("refreshPreview").addEventListener("click",()=>{drawPoster();toast("预览已更新");});
$("downloadPoster").addEventListener("click",()=>{drawPoster();$("posterCanvas").toBlob(blob=>{if(!blob){toast("导出失败，请重试");return;}const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="船客生图工坊-"+($("projectName").value.trim()||"旅行海报")+"-"+$("format").value+".png";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast("海报 PNG 已导出");},"image/png");});
document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>{document.getElementById(b.dataset.scroll).scrollIntoView({behavior:"smooth",block:"start"});document.querySelectorAll(".side-link").forEach(x=>x.classList.toggle("active",x===b));}));
function init(){drawPoster();$("charCount").textContent="0 字";}
init();
})();