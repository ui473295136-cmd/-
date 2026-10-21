(function(){
'use strict';
const root=document.getElementById('polarQuest');
if(!root)return;
const el=id=>document.getElementById(id);
const STORE='ganlu-polar-quest-v1';
const chapters=[
  {title:'南美出发不迷路',tag:'航线识图',icon:'🧭',reward:'航线罗盘',desc:'记住出发城市和时差，给客户讲路线不打结。',rank:'极地路线学徒',
   questions:[
    {q:'北京的客户下午3点发消息，阿根廷布宜诺斯艾利斯通常是几点？',options:['当天凌晨4点','当天上午11点','当天晚上8点','第二天凌晨2点'],answer:0,why:'中国北京比阿根廷快11个小时（北京时间UTC+8，阿根廷UTC−3）。北京15:00减11小时，就是布宜诺斯艾利斯04:00。别因为客户半夜没回消息，就以为人家失踪了。',wrong:'皇上急召也得看时区！'},
    {q:'从布宜诺斯艾利斯转国内航班，准备乘船驶往南极半岛，经典登船港口在哪里？',options:['智利圣地亚哥','阿根廷乌斯怀亚','秘鲁利马','冰岛雷克雅未克'],answer:1,why:'传统船游南极半岛通常从阿根廷乌斯怀亚登船，随后穿越德雷克海峡。别把乌斯怀亚和智利的飞南极出发机场混为一谈。',wrong:'别一激动把邮轮送到冰岛！'},
    {q:'典型“飞越德雷克海峡、到南极再登船”的航班，从南美哪座城市起飞？',options:['阿根廷乌斯怀亚','巴西里约热内卢','智利蓬塔阿雷纳斯','阿根廷布宜诺斯艾利斯'],answer:2,why:'典型飞船航线从智利蓬塔阿雷纳斯（Punta Arenas）飞越德雷克海峡，再于南极附近换乘探险船；具体要看对应船司产品。',wrong:'机票可不能按心情挑机场呀。'},
    {q:'典型南极飞船航线的飞机降落在哪里，再换乘冲锋舟登船？',options:['南极点','南乔治亚岛','斯瓦尔巴群岛','南设得兰群岛的乔治王岛'],answer:3,why:'常见飞船模式飞抵乔治王岛（King George Island），位于南设得兰群岛；之后按现场安排接驳登船。不是直接降落在南极点。',wrong:'南极点可不是普通探险邮轮的登机口。'}
   ]},
  {title:'飞船组合不说反',tag:'飞去船回 / 船去飞回',icon:'🚢',reward:'探险邮轮',desc:'把飞机和船的先后顺序讲明白，客户少纠结。',rank:'极地航线助手',
   questions:[
    {q:'客户选“船去飞回”南极半岛，通常哪一段需要乘船穿越德雷克海峡？',options:['去程，从乌斯怀亚向南驶往南极','回程，从南极驶回南美','两段都只坐飞机','去程从冰岛驶往南极'],answer:0,why:'“船去飞回”通常是南美港口登船南下，回程从乔治王岛附近飞回智利。关键词是“去时坐船，回时乘机”；以航次实际安排为准。',wrong:'“去”和“回”这俩字，本宫要给你圈起来。'},
    {q:'客人选“飞去船回”，下列哪项说法最准确？',options:['完全不需要乘船','去程飞越德雷克，回程仍可能乘船过海峡','一定不会晕船','所有天气下都保证飞行'],answer:1,why:'“飞去船回”通常节省的是一个方向的德雷克海上航行；返程如果坐船，仍有海况影响，不能向客人承诺“完全不晕船”。',wrong:'晕船可不是靠营销文案就能消失的。'},
    {q:'传统南极半岛船游最关注的那片海峡，位于哪里？',options:['阿根廷和巴西之间','冰岛和格陵兰之间','南美洲南端与南极半岛之间','澳大利亚和新西兰之间'],answer:2,why:'德雷克海峡连接南美南端与南极洲周边海域，受风浪影响较大。讨论是否飞越德雷克时，一定说清楚是单程还是双程。',wrong:'别把客人带去南半球绕地球一圈。'},
    {q:'客人订了飞越德雷克的航次，销售应提前解释什么？',options:['每架航班都绝对准点','可以不准备备选时间','遇到天气不能飞一定免费改成直升机','极地飞行受天气影响，可能调整或延迟，需关注应急安排'],answer:3,why:'南极航空受天气与机场条件限制，航班延迟、取消或衔接调整均可能发生。销售应讲清楚船司的应急预案和往返行程缓冲时间。',wrong:'天气不接圣旨，谁都无法保证准点。'}
   ]},
  {title:'选线路也选风景',tag:'南乔治亚 / 南极圈',icon:'🐧',reward:'王企鹅',desc:'客人想看什么，决定推荐哪一种探险体验。',rank:'极地探险向导',
   questions:[
    {q:'客户特别想看成群的王企鹅，应该优先关注什么目的地？',options:['南乔治亚岛','法罗群岛','北极斯瓦尔巴','加拉帕戈斯'],answer:0,why:'南乔治亚岛以大型王企鹅繁殖群落闻名。只做南极半岛经典线，不应承诺一定能看到南乔治亚那样规模的王企鹅群。',wrong:'企鹅有自己的老家，不是想在哪儿就在哪儿。'},
    {q:'客户说“我就想完成穿越南极圈这件事”，应该重点查看什么？',options:['船上是否提供泳池','航线是否计划南下越过南纬约66°33′','行程名字里有没有“深度”','船票是否包含机场接送'],answer:1,why:'南极圈位于南纬约66°33′。需要查看实际航线是否计划跨过这条纬线；冰况天气仍可能让原计划发生变化。',wrong:'仪式感靠地理位置，不靠产品标题凑字数。'},
    {q:'比较两条“南极深度游”，比总行程天数更值得优先关注什么？',options:['宣传海报颜色','船上餐厅总数','有效探险时间，以及登陆和冲锋舟安排','客房电视机尺寸'],answer:2,why:'海外城市停留、长途飞行和海上交通都占天数。真正的探险体验要看南极区域内可开展户外活动的时间和船上登陆组织能力。',wrong:'多住两晚酒店，可不会让企鹅多来看你两次。'},
    {q:'客户考虑把1122和1204两期南极航次连走，销售应特别提示哪项？',options:['每个登陆点保证都不同','连走必定不用带防水衣','两期衔接时保证原舱房号不变','两期中间可能换房，登陆计划也受天气影响'],answer:3,why:'这套连走计划中，两段登陆点目前设计尽量不同，但最终受天气、冰况、船方安排制约；两期衔接还可能需要调换客房。',wrong:'两期连走是深度体验，不是“原房间终身产权”。'}
   ]},
  {title:'登陆规则要讲清',tag:'IAATO / 安全环保',icon:'🧊',reward:'南极冰山',desc:'越专业的销售，越知道什么事情不能保证。',rank:'极地资深顾问',
   questions:[
    {q:'根据IAATO南极登陆要求，下面哪艘船不能组织游客登陆？',options:['载客600人的大型邮轮','载客100人的探险船','载客180人的探险船','载客400人的探险船'],answer:0,why:'IAATO要求：载客超过500人的船不得组织南极游客登陆；201—500人的登陆船还有更严格的限制。选船先问能不能登陆。',wrong:'大船看着气派，但不是载多少人都能上岸。'},
    {q:'同一南极登陆点，同一时间一艘船上岸的访客人数通常最多多少人？',options:['500人','100人（具体登陆点可能更少）','全船一起都行','只要导游同意就无限制'],answer:1,why:'IAATO通行原则是一处登陆点同一时间最多100名访客上岸，地点专项指南可能要求更少。所以要比较客船载客量、分批效率和活动安排。',wrong:'企鹅海滩不是大型演唱会入场口。'},
    {q:'在南极看见企鹅主动走过来，正确做法是什么？',options:['抱起来拍合影','给它喂点零食','保持距离、不主动靠近触碰，听探险队指挥','带回船上给客人看'],answer:2,why:'遵守野生动物保护要求，不触摸、不投喂、不主动追逐或阻挡动物路线；具体安全距离按船方及登陆点指导执行。',wrong:'企鹅是原住民，咱们才是上门做客的。'},
    {q:'登陆前探险队要求清洁靴子、检查衣物和装备，主要是为了什么？',options:['让大家更上镜','方便发小红书','因为洁癖','防止把外来生物、种子和污染物带入极地环境'],answer:3,why:'极地生态非常脆弱，装备和靴子清洁是生物安全措施，减少外来生物及病原体传播风险。不要为了图省事跳过检查。',wrong:'这不是宫规形式主义，是给极地生态保平安。'}
   ]},
  {title:'把客户的问题讲明白',tag:'北极 / 出行决策',icon:'🐻‍❄️',reward:'北极熊',desc:'把知识变成靠谱建议，比背几句台词更有用。',rank:'极地百科全书',
   questions:[
    {q:'客人说“此生想看野外北极熊”，在公司极地目的地里应重点考虑哪里？',options:['挪威斯瓦尔巴群岛一带','南极半岛','南乔治亚岛','南极长城站'],answer:0,why:'斯瓦尔巴群岛是北极熊的重要栖息地区域之一，但野生动物不保证出现。南极和南乔治亚并没有自然分布的北极熊。',wrong:'北极熊迷路也不会自己游到南极半岛。'},
    {q:'有人问“南极能同时看到北极熊和企鹅吗？”最准确的回复是？',options:['两个都在南极，当然可以','自然野外通常不能：北极熊生活在北极，南极有企鹅','每天固定安排同场合影','只要选破冰船就能看到'],answer:1,why:'北极熊自然分布于北极地区；企鹅主要分布于南半球，包括南极及其他地区。两者在自然野外不是同一片极地。',wrong:'这对CP只在表情包里有机会同框。'},
    {q:'客人在南极登陆当天遇到大风，探险队临时取消登陆，销售应如何解释？',options:['要求船长冒险靠岸','赔钱就能换好天气','安全第一，可能改成冲锋舟巡游、调整地点或取消','说明这条航次一定质量差'],answer:2,why:'天气、海冰和野生动物活动会影响登陆安全。船长与探险团队有权调整活动方式，不能把合同价格理解成保证每个点都能上岸。',wrong:'安全这件事，没有VIP加急通道。'},
    {q:'客户第一次去南极，可能一生就去这一次。销售最该先问哪组问题？',options:['先问喜不喜欢豪华餐厅','先推最贵最全的产品','先比谁宣传天数最长','晕不晕船、体力怎么样、最想看到什么'],answer:3,why:'明确晕船耐受、身体活动能力和最想看的动物或目的地，才能选择南极半岛、南乔治亚、南极圈或飞船组合。适合比昂贵更重要。',wrong:'旅行顾问不是按佣金大小排列航线的。'}
   ]}
];
const total=chapters.reduce((sum,ch)=>sum+ch.questions.length,0);
const chapterSize=4;
const qs=chapters.flatMap((ch,i)=>ch.questions.map((question,j)=>({...question,chapter:i,position:j})));
function safeText(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}
function stored(){
 let value;
 try{value=JSON.parse(localStorage.getItem(STORE)||'null');}catch(e){}
 if(!value||!Number.isInteger(value.index)||value.index<0||value.index>total||typeof value.wrong!=='number')return {index:0,wrong:0,pending:false};
 return {index:value.index,wrong:Math.max(0,Math.floor(value.wrong)),pending:!!value.pending};
}
let state=stored();
let questionCorrect=false,chosenWrong=new Set();
function save(){
 try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}
}
function rank(){return state.index>=total?'极地百科全书':state.index>=16?'极地资深顾问':state.index>=12?'极地探险向导':state.index>=8?'极地航线助手':state.index>=4?'极地路线学徒':'极地实习生';}
function unlockedCount(){return Math.floor(state.index/chapterSize);}
function bookHTML(){
 return chapters.map((ch,i)=>{
  const unlocked=i<unlockedCount();
  return '<div class="polarBookCard '+(unlocked?'unlocked':'locked')+'" title="'+safeText(ch.reward)+'">'
     +'<div class="polarBookIcon" aria-hidden="true">'+(unlocked?ch.icon:'❔')+'</div>'
     +'<div class="polarBookName">'+(unlocked?safeText(ch.reward):'尚未解锁')+'</div>'
     +'<div class="polarBookHint">'+(unlocked?'已收入极地图鉴':'通关第'+(i+1)+'关解锁')+'</div></div>';
 }).join('');
}
function updateSummary(){
 el('polarQuestCount').textContent=state.index+' / '+total;
 el('polarQuestBar').style.width=(state.index/total*100)+'%';
 el('polarQuestBar').setAttribute('aria-valuenow',String(state.index));
 el('polarQuestRank').textContent=rank();
 el('polarQuestBook').innerHTML=bookHTML();
 el('polarQuestChapterNav').innerHTML=chapters.map((ch,i)=>{
  const complete=i<unlockedCount(),active=state.index<total&&Math.floor(state.index/chapterSize)===i&&!state.pending;
  return '<span class="polarChapterTick '+(complete?'done':active?'active':'waiting')+'" title="'+safeText(ch.title)+'">'+(complete?'✓':i+1)+'</span>';
 }).join('');
}
function feedback(kind,heading,details){
 const item=el('polarQuestFeedback');
 item.hidden=false;
 item.className='polarAnswerFeedback '+kind;
 el('polarFeedbackHeading').textContent=heading;
 el('polarFeedbackDetail').textContent=details;
}
function renderQuestion(){
 const ix=state.index,ch=chapters[Math.floor(ix/chapterSize)],q=qs[ix];
 el('polarQuestStage').textContent='第'+(q.chapter+1)+'关 / 共'+chapters.length+'关 · '+ch.tag;
 el('polarQuestStep').textContent='第 '+(q.position+1)+' / '+chapterSize+' 题';
 el('polarQuestTitle').textContent=ch.title;
 el('polarQuestPrompt').textContent=q.q;
 el('polarQuestIntro').textContent=ch.desc;
 el('polarQuestChoices').innerHTML=q.options.map((answer,i)=>
    '<button type="button" class="polarChoice" data-polar-answer="'+i+'"><span class="polarChoiceKey">'+String.fromCharCode(65+i)+'</span><span>'+safeText(answer)+'</span></button>'
 ).join('');
 el('polarQuestFeedback').hidden=true;
 el('polarQuestContinue').hidden=true;
 el('polarQuestAction').hidden=true;
 el('polarQuestQuestion').hidden=false;
 el('polarQuestReward').hidden=true;
 el('polarQuestFinish').hidden=true;
 questionCorrect=false;chosenWrong.clear();
}
function renderReward(){
 const chapterIndex=Math.max(0,Math.floor((state.index-1)/chapterSize));
 const ch=chapters[chapterIndex];
 el('polarQuestQuestion').hidden=true;
 el('polarQuestFinish').hidden=true;
 el('polarQuestReward').hidden=false;
 el('polarRewardIcon').textContent=ch.icon;
 el('polarRewardName').textContent=ch.reward+' · 图鉴解锁';
 el('polarRewardDescription').textContent=ch.desc;
 el('polarRewardRank').textContent=rank();
 el('polarRewardNext').textContent=state.index>=total?'领取通关证书 →':'进入下一关 →';
}
function renderFinish(){
 el('polarQuestQuestion').hidden=true;
 el('polarQuestReward').hidden=true;
 el('polarQuestFinish').hidden=false;
 el('polarFinishRank').textContent=rank();
 el('polarFinishSummary').textContent='已掌握20个常见销售场景中的极地知识，累计修正 '+state.wrong+' 次答案。能准确解释航线，比背下价格和天数更重要。';
 el('polarFinishIcons').textContent=chapters.map(x=>x.icon).join(' ');
}
function render(){
 updateSummary();
 if(state.pending){renderReward();return;}
 if(state.index===total){renderFinish();return;}
 renderQuestion();
}
function answer(ix){
 if(questionCorrect||state.pending||state.index>=total||!Number.isInteger(ix)||ix<0||ix>3)return;
 const q=qs[state.index];
 const choices=[...el('polarQuestChoices').querySelectorAll('[data-polar-answer]')];
 const button=choices[ix];
 if(!button||chosenWrong.has(ix))return;
 if(ix===q.answer){
  questionCorrect=true;
  button.classList.add('correct');
  choices.forEach(b=>b.disabled=true);
  feedback('correct','答对啦！这位小主有点极地知识。','✅ '+q.why);
  const finalInChapter=q.position===chapterSize-1;
  el('polarQuestContinue').textContent=finalInChapter?'领取本关图鉴 →':'下一题 →';
  el('polarQuestContinue').hidden=false;
 }else{
  state.wrong++;save();chosenWrong.add(ix);
  button.classList.add('wrong');button.disabled=true;
  feedback('wrong',q.wrong,'正确答案：'+q.options[q.answer]+'。'+q.why+' 换个选项继续，答对才能通关。');
 }
}
function next(){
 if(!questionCorrect)return;
 state.index=Math.min(total,state.index+1);
 state.pending=state.index%chapterSize===0;
 questionCorrect=false;save();render();
 root.scrollIntoView({behavior:'smooth',block:'start'});
}
function nextChapter(){
 if(!state.pending)return;
 state.pending=false;save();render();
 root.scrollIntoView({behavior:'smooth',block:'start'});
}
function restart(){
 if(!window.confirm('确定从第一关重新挑战吗？本浏览器保存的图鉴与闯关进度会清零。'))return;
 state={index:0,wrong:0,pending:false};save();render();
 root.scrollIntoView({behavior:'smooth',block:'start'});
}
el('polarQuestChoices').addEventListener('click',e=>{
 const node=e.target.closest('[data-polar-answer]');
 if(node)answer(Number(node.getAttribute('data-polar-answer')));
});
el('polarQuestContinue').addEventListener('click',next);
el('polarRewardNext').addEventListener('click',nextChapter);
el('polarQuestRestart').addEventListener('click',restart);
el('polarFinishRestart').addEventListener('click',restart);
render();
// All answers and content are local; no scores, nicknames or public rankings are transmitted.
window.GanluPolarQuest={chapters,total,rank,unlockedCount,getProgress:()=>({...state})};
})();