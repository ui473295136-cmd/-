(function(){
'use strict';
const $=id=>document.getElementById(id);
const API='https://wpfqcztbxxarsrruuuce.supabase.co/functions/v1/ganlu-site-visitors';
const count=$('ganluVisitCount'),latest=$('ganluVisitLatest');
if(count&&latest){
  function dateLabel(iso){
    const dt=new Date(iso);
    if(!iso||Number.isNaN(dt.getTime()))return '暂无其他访问记录';
    return new Intl.DateTimeFormat('zh-CN',{
      timeZone:'Asia/Shanghai',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false
    }).format(dt)+'（北京时间）';
  }
  function update(stats){
    if(!stats||!Number.isInteger(stats.uniqueVisitors)||stats.uniqueVisitors<0)throw Error('no verified count');
    count.textContent=stats.uniqueVisitors.toLocaleString('zh-CN');
    latest.textContent=stats.latestVisitAt?'最近访问：'+dateLabel(stats.latestVisitAt):'还没有访问时间记录';
  }
  let hasLoaded=false;
  async function refresh(isVisit){
    try{
      const response=await fetch(API,{method:isVisit?'POST':'GET',mode:'cors',cache:'no-store',credentials:'omit'});
      if(!response.ok)throw Error('stats unavailable');
      update(await response.json());
      hasLoaded=true;
    }catch(error){
      if(!hasLoaded){
        count.textContent='—';
        latest.textContent='访问统计暂不可用';
      }
    }
  }
  refresh(true);
  // A read-only update never creates extra visitor records or changes latest visit.
  window.setInterval(()=>{if(!document.hidden)refresh(false)},120000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(false)});
}
const ad=$('ganluAdCarousel');
if(!ad)return;
const slides=Array.from(ad.querySelectorAll('[data-ad-slide]'));
const dots=Array.from(ad.querySelectorAll('[data-ad-dot]'));
if(slides.length<2||dots.length!==slides.length)return;
let active=0,paused=false;
function display(index){
  active=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{
    const shown=i===active;
    slide.classList.toggle('is-active',shown);
    slide.setAttribute('aria-hidden',String(!shown));
    slide.inert=!shown;
  });
  dots.forEach((dot,i)=>{
    const shown=i===active;
    dot.classList.toggle('is-active',shown);
    dot.setAttribute('aria-pressed',String(shown));
  });
}
$('ganluAdPrev').addEventListener('click',()=>display(active-1));
$('ganluAdNext').addEventListener('click',()=>display(active+1));
dots.forEach((btn,i)=>btn.addEventListener('click',()=>display(i)));
ad.addEventListener('mouseenter',()=>{paused=true});
ad.addEventListener('mouseleave',()=>{paused=false});
ad.addEventListener('focusin',()=>{paused=true});
ad.addEventListener('focusout',event=>{if(!ad.contains(event.relatedTarget))paused=false});
display(0);
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.setInterval(()=>{if(!paused&&!document.hidden)display(active+1)},9000);
}
})();