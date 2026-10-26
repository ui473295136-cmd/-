(function(){
'use strict';
const $=id=>document.getElementById(id);
const API='https://wpfqcztbxxarsrruuuce.supabase.co/functions/v1/ganlu-site-visitors';
const count=$('ganluVisitCount'),latest=$('ganluVisitLatest');
if(count&&latest){
  // “政策更新时间”以线上网页的最后修改时间为准，不以访问记录或访客本地时间为准。
  function beijingLabel(value){
    const date=new Date(value);
    if(!value||Number.isNaN(date.getTime()))return '';
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{
      timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',
      hour:'2-digit',minute:'2-digit',hourCycle:'h23'
    }).formatToParts(date).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
    return parts.month+'/'+parts.day+' '+parts.hour+':'+parts.minute;
  }
  async function refreshPolicyUpdatedAt(){
    // Same-origin HTTP Last-Modified reflects the deployed ganlu-finance.html file.
    // If unavailable, fall back to its latest GitHub commit's timestamp.
    let updated='';
    try{
      const r=await fetch(window.location.pathname||'./ganlu-finance.html',{
        method:'HEAD',cache:'no-store',credentials:'omit'
      });
      if(r.ok)updated=beijingLabel(r.headers.get('Last-Modified'));
    }catch(_){}
    if(!updated){
      try{
        const r=await fetch('https://api.github.com/repos/ui473295136-cmd/-/commits?path=ganlu-finance.html&per_page=1',{
          method:'GET',cache:'no-store',credentials:'omit'
        });
        if(r.ok){
          const commits=await r.json();
          updated=beijingLabel(commits?.[0]?.commit?.committer?.date);
        }
      }catch(_){}
    }
    latest.textContent=updated?'政策更新时间：'+updated:'政策更新时间：暂不可用';
  }
  function update(stats){
    if(!stats||!Number.isInteger(stats.uniqueVisitors)||stats.uniqueVisitors<0)throw Error('no verified count');
    count.textContent=stats.uniqueVisitors.toLocaleString('zh-CN');
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
  refreshPolicyUpdatedAt();
  // 访客统计与政策更新时间相互独立：访客刷新不会改动政策更新时间。
  window.setInterval(()=>{if(!document.hidden)refresh(false)},120000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){refresh(false);refreshPolicyUpdatedAt();}});
}
const ad=$('ganluAdCarousel');
if(!ad)return;

// Keep a single carousel instance; change only its DOM location on wide desktops.
// Returning it to the original marker preserves the unchanged phone/tablet layout.
const desktopSlot=$('ganluAdDesktopSlot');
if(desktopSlot&&window.matchMedia){
  const origin=document.createComment('ganlu ad carousel original position');
  ad.parentNode.insertBefore(origin,ad);
  const desktopMedia=window.matchMedia('(min-width:1100px)');
  const syncLocation=()=>{
    if(desktopMedia.matches){
      if(ad.parentNode!==desktopSlot)desktopSlot.appendChild(ad);
    }else if(origin.parentNode&&ad.parentNode!==origin.parentNode){
      origin.parentNode.insertBefore(ad,origin.nextSibling);
    }
  };
  syncLocation();
  if(desktopMedia.addEventListener)desktopMedia.addEventListener('change',syncLocation);
  else if(desktopMedia.addListener)desktopMedia.addListener(syncLocation);
}
const slides=Array.from(ad.querySelectorAll('[data-ad-slide]'));
const dots=Array.from(ad.querySelectorAll('[data-ad-dot]'));
if(slides.length<2||dots.length!==slides.length)return;
let active=0,paused=false,touching=false,swipeStart=null,lastManual=0,adVisible=true;
const viewport=ad.querySelector('.ganluAdViewport');
function markManual(){lastManual=Date.now();}
if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{adVisible=entries[0].isIntersecting},{threshold:.35}).observe(ad);
}
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
function manualDisplay(index){markManual();display(index);}
$('ganluAdPrev').addEventListener('click',()=>manualDisplay(active-1));
$('ganluAdNext').addEventListener('click',()=>manualDisplay(active+1));
dots.forEach((btn,i)=>btn.addEventListener('click',()=>manualDisplay(i)));

// Passive touch listeners preserve normal up/down page scrolling while
// allowing deliberate horizontal swipes to change the advertisement.
if(viewport){
  viewport.addEventListener('touchstart',event=>{
    if(event.touches.length!==1){swipeStart=null;return;}
    const p=event.touches[0];
    swipeStart={x:p.clientX,y:p.clientY};
    touching=true;
  },{passive:true});
  viewport.addEventListener('touchend',event=>{
    const start=swipeStart;
    swipeStart=null;
    touching=false;
    if(!start||!event.changedTouches.length||event.touches.length)return;
    const p=event.changedTouches[0];
    const dx=p.clientX-start.x,dy=p.clientY-start.y;
    if(Math.abs(dx)>=42&&Math.abs(dx)>Math.abs(dy)*1.25){
      manualDisplay(active+(dx<0?1:-1));
    }
  },{passive:true});
  viewport.addEventListener('touchcancel',()=>{
    swipeStart=null;
    touching=false;
  },{passive:true});
}
ad.addEventListener('mouseenter',()=>{paused=true});
ad.addEventListener('mouseleave',()=>{paused=false});
ad.addEventListener('focusin',()=>{paused=true});
ad.addEventListener('focusout',event=>{if(!ad.contains(event.relatedTarget))paused=false});
display(0);
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.setInterval(()=>{
    if(!paused&&!touching&&adVisible&&!document.hidden&&Date.now()-lastManual>=9000)display(active+1);
  },9000);
}
})();