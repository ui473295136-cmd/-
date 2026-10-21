(function(){
  'use strict';
  // Lightweight near-real-time chat; the page remains usable if messaging temporarily goes offline.
  var API='https://wpfqcztbxxarsrruuuce.supabase.co/functions/v1/ganlu-social';
  var BOARD_KEY='ganlu-board-client-token-v1';
  var NICK_KEY='ganlu-social-nickname-v1';
  var CHAT_SEEN_KEY='ganlu-social-chat-seen-v1';
  var REPLIES_SEEN_KEY='ganlu-social-replies-seen-v1';
  var originalTitle=document.title;
  var $=function(id){return document.getElementById(id)};
  var tokens={
    actor:'',
    chatSeen:'',
    repliesSeen:''
  };
  function getStored(key){try{return localStorage.getItem(key)||''}catch(e){return ''}}
  function setStored(key,value){try{localStorage.setItem(key,value)}catch(e){}}
  function makeToken(){
    var bytes=new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes,function(x){return x.toString(16).padStart(2,'0')}).join('');
  }
  tokens.actor=getStored(BOARD_KEY);
  if(!/^[a-f0-9]{64}$/.test(tokens.actor)){
    tokens.actor=makeToken();
    setStored(BOARD_KEY,tokens.actor);
  }
  tokens.chatSeen=getStored(CHAT_SEEN_KEY)||new Date().toISOString();
  tokens.repliesSeen=getStored(REPLIES_SEEN_KEY)||new Date().toISOString();
  setStored(CHAT_SEEN_KEY,tokens.chatSeen);
  setStored(REPLIES_SEEN_KEY,tokens.repliesSeen);
  var currentTab='posts',openPost='',replyTarget=null;
  var feedBusy=false,threadBusy=false,sendBusy=false,commentBusy=false;
  var chatSignature='',lastThreadSignature='',feedData={chat:[],notifications:[],counts:{}};
  var firstFeed=true,prevCounts={chat:0,replies:0};
  var seenChatIds=new Set(),seenReplyIds=new Set();
  var SOUND_KEY='ganlu-social-sound-v1';
  var soundOn=getStored(SOUND_KEY)==='on';
  var audioCtx=null;
  var toastTimer=0;
  var toastTarget=null;
  var h=function(s){return String(s===undefined||s===null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  function readableTime(value){
    var d=new Date(value);
    if(!Number.isFinite(d.getTime()))return '刚刚';
    return d.toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});
  }
  function msgText(id,s){var el=$(id);if(el)el.textContent=s}
  async function call(action,data){
    var body=Object.assign({},data||{},{action:action,client_token:tokens.actor});
    var response=await fetch(API,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        apikey:window.GANLU_BOARD_ANON,
        Authorization:'Bearer '+window.GANLU_BOARD_ANON
      },
      body:JSON.stringify(body)
    });
    var json=await response.json().catch(function(){return {}});
    if(!response.ok)throw new Error(json.message||'碎嘴阁暂时忙碌，稍后重试。');
    return json;
  }
  function countUnread(){
    var chats=Array.isArray(feedData.chat)?feedData.chat:[];
    var notices=Array.isArray(feedData.notifications)?feedData.notifications:[];
    return {
      chat:chats.filter(function(c){return !c.mine&&c.created_at>tokens.chatSeen}).length,
      replies:notices.filter(function(c){return c.created_at>tokens.repliesSeen}).length
    };
  }
  function setBadge(id,num){
    var el=$(id);if(!el)return;
    el.hidden=num<1;
    el.textContent=num>99?'99+':String(num);
  }
  function updateBadges(){
    var counts=countUnread(),total=counts.chat+counts.replies;
    setBadge('socialBellBadge',total);
    setBadge('socialChatBadge',counts.chat);
    msgText('socialUnreadSummary',counts.chat+' 条未读聊天 · '+counts.replies+' 条未读回复');
    document.title=(total?'('+total+') ':'')+originalTitle;
    return counts;
  }
  function markChatRead(){
    tokens.chatSeen=new Date().toISOString();
    setStored(CHAT_SEEN_KEY,tokens.chatSeen);
    updateBadges();
  }
  function markRepliesRead(){
    tokens.repliesSeen=new Date().toISOString();
    setStored(REPLIES_SEEN_KEY,tokens.repliesSeen);
    updateBadges();
  }
  function syncSoundButton(){
    var btn=$('socialSoundBtn');
    if(!btn)return;
    btn.textContent=soundOn?'🔇 关闭提示音':'🔊 开启提示音';
    btn.setAttribute('aria-pressed',String(soundOn));
    msgText('socialSoundStatus',soundOn?'提示音已开启（网页保持打开时生效）':'提示音已关闭，可随时开启');
  }
  async function unlockAudio(){
    var Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return false;
    try{
      if(!audioCtx)audioCtx=new Context();
      if(audioCtx.state==='suspended')await audioCtx.resume();
      return audioCtx.state==='running';
    }catch(e){return false;}
  }
  function ping(){
    if(!soundOn||!audioCtx||audioCtx.state!=='running')return;
    try{
      var now=audioCtx.currentTime;
      [0,.12].forEach(function(delay,index){
        var oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain(),t=now+delay;
        oscillator.type='sine';
        oscillator.frequency.setValueAtTime(index?1030:740,t);
        gain.gain.setValueAtTime(.0001,t);
        gain.gain.exponentialRampToValueAtTime(.065,t+.015);
        gain.gain.exponentialRampToValueAtTime(.0001,t+.11);
        oscillator.connect(gain);gain.connect(audioCtx.destination);
        oscillator.start(t);oscillator.stop(t+.13);
      });
    }catch(e){}
  }
  function dismissToast(){
    if(toastTimer){clearTimeout(toastTimer);toastTimer=0;}
    var el=$('socialSideToast');
    if(el)el.hidden=true;
  }
  function showSideToast(kind,item,count){
    var box=$('socialSideToast');
    if(!box)return;
    toastTarget={kind:kind,postId:item.post_id||''};
    var title=kind==='reply'?'有人回复了你的吐槽':'茶话会来了新消息';
    var preview=item.nickname?String(item.nickname)+'：'+String(item.body||''):'你收到新的互动消息';
    msgText('socialToastTitle',count>1?title+' · '+count+'条':title);
    msgText('socialToastPreview',preview.length>90?preview.slice(0,90)+'…':preview);
    msgText('socialToastOpen',kind==='reply'?'查看回复 →':'进入聊天 →');
    box.hidden=false;
    if(toastTimer)clearTimeout(toastTimer);
    toastTimer=setTimeout(dismissToast,11000);
    ping();
  }
  function promptDesktop(kind,item,count){
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    if(!document.hidden&&document.hasFocus())return;
    try{
      var title=kind==='reply'?'有人回复了你的吐槽':'碎嘴阁有新聊天消息';
      var body=(count>1?'共'+count+'条 · ':'')+String(item.nickname||'匿名小主')+'：'+String(item.body||'').slice(0,60);
      var n=new Notification('甘露寺·'+title,{body:body,tag:'ganlu-social-'+kind,silent:true});
      n.onclick=function(){
        window.focus();
        navigateFromToast({kind:kind,postId:item.post_id||''});
        try{n.close()}catch(e){}
      };
    }catch(e){}
  }
  function noticeNewItems(){
    var chats=feedData.chat||[],replies=feedData.notifications||[];
    var newChats=[],newReplies=[];
    chats.forEach(function(item){
      if(!item||!item.id)return;
      if(!firstFeed&&!seenChatIds.has(item.id)&&!item.mine)newChats.push(item);
      seenChatIds.add(item.id);
    });
    replies.forEach(function(item){
      if(!item||!item.id)return;
      if(!firstFeed&&!seenReplyIds.has(item.id))newReplies.push(item);
      seenReplyIds.add(item.id);
    });
    // Avoid repeated notifications from the same message on future polling cycles.
    if(newReplies.length){
      var latest=newReplies[newReplies.length-1];
      showSideToast('reply',latest,newReplies.length);
      promptDesktop('reply',latest,newReplies.length);
    }else if(newChats.length){
      var latestChat=newChats[newChats.length-1];
      showSideToast('chat',latestChat,newChats.length);
      promptDesktop('chat',latestChat,newChats.length);
    }
  }
  function navigateFromToast(target){
    if(!target)return;
    dismissToast();
    $('complaintPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
    if(target.kind==='chat'){
      setTab('chat');
      $('socialChatInput')?.focus({preventScroll:true});
      return;
    }
    setTab('posts');
    $('socialNoticePanel').hidden=false;
    markRepliesRead();
    renderNotices(feedData.notifications||[]);
    if(target.postId){
      var post=document.querySelector('#boardPosts [data-post="'+target.postId+'"]');
      if(post){openThread(target.postId);post.scrollIntoView({behavior:'smooth',block:'center'});}
    }
  }
  function renderChat(items){
    if(!Array.isArray(items))items=[];
    var signature=items.map(function(x){return x.id}).join('|');
    if(signature===chatSignature)return;
    var stream=$('socialChatStream');
    if(!stream)return;
    var bottom=stream.scrollHeight-stream.scrollTop-stream.clientHeight<80;
    stream.innerHTML=items.length?items.map(function(c){
      return '<div class="socialChatBubble '+(c.mine?'mine':'')+'">'
        +'<div class="socialChatMeta"><strong>'+h(c.nickname)+'</strong><time>'+h(readableTime(c.created_at))+'</time></div>'
        +'<div class="socialChatMessage">'+h(c.body)+'</div>'
        +(c.mine?'<button type="button" class="socialChatDelete" data-social-delete-chat="'+h(c.id)+'">撤回</button>':'')
        +'</div>';
    }).join(''):'<div class="socialThreadEmpty">茶话会还没人开口，你来聊第一句吧。</div>';
    chatSignature=signature;
    if(bottom||items.length<=1)stream.scrollTop=stream.scrollHeight;
  }
  function renderNotices(items){
    var list=$('socialNoticeList');if(!list)return;
    list.innerHTML=items.length?items.slice(0,15).map(function(c){
      return '<button type="button" class="socialNoticeItem" data-social-notice-post="'+h(c.post_id)+'">'
        +'<span><strong>'+h(c.nickname)+'</strong> 回复了'+(c.kind==='comment_reply'?'你的评论':'你的吐槽')+'：'+h(String(c.body).slice(0,65))+'</span>'
        +'<small>'+h(readableTime(c.created_at))+'</small></button>';
    }).join(''):'<p class="socialNoticeEmpty">暂时没有收到针对你的回复。</p>';
  }
  function applyCounts(){
    document.querySelectorAll('#boardPosts [data-social-count]').forEach(function(el){
      var key=el.getAttribute('data-social-count'),count=Number((feedData.counts||{})[key])||0;
      el.textContent=String(count);
    });
  }
  async function loadFeed(){
    if(feedBusy)return;
    feedBusy=true;
    try{
      var data=await call('feed');
      if(!data||!Array.isArray(data.chat))throw new Error('消息格式暂不可用');
      var oldCount=countUnread();
      feedData={chat:data.chat||[],notifications:data.notifications||[],counts:data.counts||{}};
      if(currentTab==='chat'&&!document.hidden&&document.hasFocus())markChatRead();
      renderChat(feedData.chat);
      if(!$('socialNoticePanel').hidden)renderNotices(feedData.notifications);
      applyCounts();
      noticeNewItems();
      var newCount=updateBadges();
      firstFeed=false;
      prevCounts=newCount;
      msgText('socialLiveStatus','已连接 · 聊天约3秒同步');
      if(openPost&&!threadBusy)loadThread();
    }catch(e){
      msgText('socialLiveStatus',(e&&e.message)||'暂时无法同步，请稍后再试。');
    }finally{feedBusy=false}
  }
  function setTab(which){
    currentTab=which==='chat'?'chat':'posts';
    $('socialPostsArea').hidden=currentTab!=='posts';
    $('socialChatArea').hidden=currentTab!=='chat';
    $('socialPostsTab').classList.toggle('active',currentTab==='posts');
    $('socialChatTab').classList.toggle('active',currentTab==='chat');
    $('socialPostsTab').setAttribute('aria-selected',String(currentTab==='posts'));
    $('socialChatTab').setAttribute('aria-selected',String(currentTab==='chat'));
    if(currentTab==='chat'){markChatRead();loadFeed();}
  }
  function onBoardRender(){
    applyCounts();
    if(!openPost)return;
    var box=document.querySelector('#boardPosts [data-social-thread="'+openPost+'"]');
    if(box){
      box.hidden=false;
      if(!box.querySelector('.socialCommentComposer'))loadThread(true);
    }
  }
  function commentHtml(c){
    return '<div class="socialCommentRow '+(c.mine?'mine':'')+'" data-social-comment="'+h(c.id)+'">'
      +'<div class="socialCommentTop"><strong>'+h(c.nickname)+'</strong><time>'+h(readableTime(c.created_at))+'</time></div>'
      +'<p class="socialCommentBody">'+(c.parent_nickname?'<span class="socialCommentReplyTo">回复 @'+h(c.parent_nickname)+'：</span>':'')+h(c.body)+'</p>'
      +'<div class="socialCommentActions"><button type="button" class="socialReplyBtn" data-social-reply="'+h(c.id)+'" data-social-reply-name="'+h(c.nickname)+'">回复</button>'
      +(c.mine?'<button type="button" class="socialCommentDelete" data-social-delete-comment="'+h(c.id)+'">删除</button>':'')
      +'</div></div>';
  }
  async function loadThread(force){
    if(!openPost||threadBusy)return;
    var mount=document.querySelector('#boardPosts [data-social-thread="'+openPost+'"]');
    if(!mount)return;
    if(!force&&mount.contains(document.activeElement)&&document.activeElement.closest('.socialCommentComposer'))return;
    threadBusy=true;
    try{
      var result=await call('thread',{post_id:openPost});
      var items=Array.isArray(result.comments)?result.comments:[];
      var signature=openPost+':'+items.map(function(x){return x.id}).join('|');
      if(!force&&signature===lastThreadSignature)return;
      mount.innerHTML='<div class="socialThreadTitle">本帖评论 · '+Number(result.total||items.length)+' 条</div>'
        +'<div class="socialThreadList">'+(items.length?items.map(commentHtml).join(''):'<div class="socialThreadEmpty">暂无评论，给这位小主留个言吧。</div>')+'</div>'
        +'<form class="socialCommentComposer" data-social-comment-form="'+h(openPost)+'">'
        +'<div class="socialReplyContext" id="socialReplyContext">'+(replyTarget?'回复 @'+h(replyTarget.nickname)+' <button type="button" class="socialReplyCancel" data-social-cancel-reply>取消</button>':'')+'</div>'
        +'<textarea name="comment" maxlength="240" required placeholder="友善回复这条吐槽，最多240字"></textarea>'
        +'<div class="socialCommentFoot"><small>评论和回复会同步给所有访问者</small><button class="socialCommentSubmit" type="submit">发表评论</button></div>'
        +'<div class="socialStatus" data-social-comment-status role="status" aria-live="polite"></div></form>';
      lastThreadSignature=signature;
      applyCounts();
    }catch(e){
      if(!mount.querySelector('.socialCommentComposer'))mount.innerHTML='<div class="socialStatus">'+h((e&&e.message)||'评论暂不可用')+'</div>';
    }finally{threadBusy=false}
  }
  function openThread(postId){
    if(openPost===postId){
      var box=document.querySelector('#boardPosts [data-social-thread="'+postId+'"]');
      if(box&&!box.hidden){box.hidden=true;openPost='';replyTarget=null;return;}
    }
    if(openPost){
      var old=document.querySelector('#boardPosts [data-social-thread="'+openPost+'"]');
      if(old)old.hidden=true;
    }
    openPost=postId;replyTarget=null;lastThreadSignature='';
    var box=document.querySelector('#boardPosts [data-social-thread="'+postId+'"]');
    if(box){box.hidden=false;box.innerHTML='<div class="socialThreadEmpty">评论加载中……</div>';loadThread(true);}
  }
  function nick(){
    var n=$('socialNick').value.trim();
    if(n&&[...n].length<=16)setStored(NICK_KEY,n);
    return n;
  }
  var savedName=getStored(NICK_KEY);
  if(savedName)$('socialNick').value=savedName;
  else if($('boardNickname')?.value)$('socialNick').value=$('boardNickname').value;
  $('socialNick').addEventListener('change',function(){nick()});

  $('socialPostsTab').addEventListener('click',function(){setTab('posts')});
  $('socialChatTab').addEventListener('click',function(){setTab('chat')});
  $('socialBell').addEventListener('click',function(){
    var panel=$('socialNoticePanel');
    panel.hidden=!panel.hidden;
    if(!panel.hidden){markRepliesRead();renderNotices(feedData.notifications||[])}
  });
  syncSoundButton();
  $('socialSoundBtn').addEventListener('click',async function(){
    if(soundOn){
      soundOn=false;
      setStored(SOUND_KEY,'off');
      syncSoundButton();
      return;
    }
    var available=await unlockAudio();
    if(!available){
      msgText('socialSoundStatus','当前浏览器未允许播放提示音，请先点击网页后重试。');
      return;
    }
    soundOn=true;
    setStored(SOUND_KEY,'on');
    syncSoundButton();
    ping();
  });
  // Browsers can suspend WebAudio until a user gesture. Resume it on later interactions.
  document.addEventListener('pointerdown',function(event){
    if(soundOn&&audioCtx&&audioCtx.state==='suspended')unlockAudio();
  },{capture:true});
  document.addEventListener('keydown',function(event){
    if(soundOn&&audioCtx&&audioCtx.state==='suspended')unlockAudio();
  },{capture:true});
  $('socialToastClose').addEventListener('click',dismissToast);
  $('socialToastOpen').addEventListener('click',function(){
    navigateFromToast(toastTarget);
  });
  $('socialDesktopBtn').addEventListener('click',async function(){
    if(!('Notification' in window)){msgText('socialDesktopStatus','当前浏览器不支持桌面通知，可使用站内红点提醒。');return;}
    if(Notification.permission==='denied'){msgText('socialDesktopStatus','浏览器已阻止通知，请在网站权限设置中允许。');return;}
    try{
      var permission=await Notification.requestPermission();
      msgText('socialDesktopStatus',permission==='granted'?'桌面通知已开启（页面保持打开时生效）':'桌面通知未开启，站内红点仍然可用。');
    }catch(e){msgText('socialDesktopStatus','无法开启桌面通知，站内红点仍可使用。');}
  });
  $('socialNoticeList').addEventListener('click',function(event){
    var item=event.target.closest('[data-social-notice-post]');if(!item)return;
    var postId=item.getAttribute('data-social-notice-post');
    setTab('posts');
    $('socialNoticePanel').hidden=true;
    markRepliesRead();
    var post=document.querySelector('#boardPosts [data-post="'+postId+'"]');
    if(!post){msgText('boardStatus','这条吐槽较早或已撤回，暂无法从当前列表打开。');return;}
    openThread(postId);
    post.scrollIntoView({behavior:'smooth',block:'center'});
  });
  $('socialChatForm').addEventListener('submit',async function(ev){
    ev.preventDefault();
    if(sendBusy)return;
    var n=nick(),body=$('socialChatInput').value.trim();
    if(!n||[...n].length>16){msgText('socialChatStatus','请输入1—16字的宫中称号。');return;}
    if(!body||[...body].length>240){msgText('socialChatStatus','请输入1—240字的聊天内容。');return;}
    sendBusy=true;$('socialSend').disabled=true;
    msgText('socialChatStatus','正在发送……');
    try{
      await call('chat',{nickname:n,body:body});
      $('socialChatInput').value='';
      msgText('socialChatStatus','已发送，其他人约3秒内可看到。');
      await loadFeed();
      markChatRead();
    }catch(e){msgText('socialChatStatus',(e&&e.message)||'发送失败，草稿已保留。')}
    finally{sendBusy=false;$('socialSend').disabled=false;}
  });
  $('socialChatInput').addEventListener('keydown',function(ev){
    if(ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();$('socialChatForm').requestSubmit();}
  });
  $('socialChatStream').addEventListener('click',async function(ev){
    var button=ev.target.closest('[data-social-delete-chat]');
    if(!button)return;
    if(!confirm('确定撤回自己的这条聊天消息吗？'))return;
    button.disabled=true;
    try{await call('delete_chat',{id:button.getAttribute('data-social-delete-chat')});await loadFeed();}
    catch(e){msgText('socialChatStatus',(e&&e.message)||'撤回失败');}
    finally{button.disabled=false;}
  });
  $('boardPosts').addEventListener('click',async function(ev){
    var open=ev.target.closest('[data-social-open]');
    if(open){openThread(open.getAttribute('data-social-open'));return;}
    var cancel=ev.target.closest('[data-social-cancel-reply]');
    if(cancel){replyTarget=null;msgText('socialReplyContext','');return;}
    var reply=ev.target.closest('[data-social-reply]');
    if(reply){
      replyTarget={id:reply.getAttribute('data-social-reply'),nickname:reply.getAttribute('data-social-reply-name')};
      var panel=reply.closest('.socialCommentMount');
      var context=panel&&panel.querySelector('.socialReplyContext');
      if(context)context.innerHTML='回复 @'+h(replyTarget.nickname)+' <button type="button" class="socialReplyCancel" data-social-cancel-reply>取消</button>';
      panel?.querySelector('textarea')?.focus();
      return;
    }
    var del=ev.target.closest('[data-social-delete-comment]');
    if(del){
      if(!confirm('确定删除自己写的评论吗？'))return;
      del.disabled=true;
      try{await call('delete_comment',{id:del.getAttribute('data-social-delete-comment')});lastThreadSignature='';await loadThread(true);await loadFeed();}
      catch(e){msgText('boardStatus',(e&&e.message)||'删除评论失败');}
      finally{del.disabled=false;}
    }
  });
  $('boardPosts').addEventListener('submit',async function(ev){
    var form=ev.target.closest('[data-social-comment-form]');
    if(!form)return;
    ev.preventDefault();
    if(commentBusy)return;
    var n=nick(),body=form.querySelector('textarea').value.trim();
    var status=form.querySelector('[data-social-comment-status]');
    if(!n||[...n].length>16){status.textContent='请先在茶话会填写1—16字昵称。';return;}
    if(!body||[...body].length>240){status.textContent='评论限1—240字。';return;}
    commentBusy=true;var button=form.querySelector('button[type="submit"]');button.disabled=true;
    status.textContent='正在发表……';
    try{
      await call('comment',{post_id:form.getAttribute('data-social-comment-form'),parent_id:replyTarget?.id||null,nickname:n,body:body});
      replyTarget=null;lastThreadSignature='';
      await loadThread(true);
      await loadFeed();
      msgText('boardStatus','评论已发表，其他人约3秒内可以看到。');
    }catch(e){status.textContent=(e&&e.message)||'评论失败，内容仍在输入框内。'}
    finally{commentBusy=false;button.disabled=false;}
  });
  document.addEventListener('visibilitychange',function(){if(!document.hidden)loadFeed()});
  window.addEventListener('storage',function(ev){
    if(ev.key===CHAT_SEEN_KEY){tokens.chatSeen=ev.newValue||tokens.chatSeen;updateBadges();}
    if(ev.key===REPLIES_SEEN_KEY){tokens.repliesSeen=ev.newValue||tokens.repliesSeen;updateBadges();}
  });
  window.GanluSocial={onBoardRender:onBoardRender,refresh:loadFeed};
  loadFeed();
  setInterval(loadFeed,3000);
})();