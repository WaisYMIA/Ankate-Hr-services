(function(){
var d=document,w=window,root=d.documentElement;root.classList.add('js');
var reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var idle=w.requestIdleCallback?function(f){w.requestIdleCallback(f,{timeout:400})}:function(f){setTimeout(f,60)};
[].forEach.call(d.querySelectorAll('link[data-async-font]'),function(l){var on=function(){l.media='all'};if(l.sheet)on();else l.addEventListener('load',on)});
function meta(n){var m=d.querySelector('meta[name="'+n+'"]');return m?m.getAttribute('content'):''}
/* ---------- analytics: first-party beacon + optional Plausible ---------- */
var collectUrl=meta('ank-collect'),dnt=(navigator.doNotTrack==='1'||w.doNotTrack==='1');
w.plausible=w.plausible||function(){(w.plausible.q=w.plausible.q||[]).push(arguments)};
function send(ev,props){if(!collectUrl||dnt)return;try{var host='';try{host=d.referrer?new URL(d.referrer).hostname:''}catch(e){}
var body=JSON.stringify({e:ev,p:location.pathname,r:host,w:w.innerWidth,x:props||null});
if(navigator.sendBeacon){navigator.sendBeacon(collectUrl,new Blob([body],{type:'text/plain'}))}else{fetch(collectUrl,{method:'POST',body:body,keepalive:true,headers:{'Content-Type':'text/plain'}})}}catch(e){}}
function track(n,p){try{w.plausible(n,p?{props:p}:undefined)}catch(e){}send(n,p)}w.ankTrack=track;
send('pageview');
d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');if(a)track(a.getAttribute('data-track'))});
/* ---------- site search (loaded on first use) ---------- */
var sbtn=d.querySelector('.srch');
function openSearch(){if(w.ankSearch){w.ankSearch.open();return}var sc=d.createElement('script');sc.src=sbtn.getAttribute('data-src');sc.onload=function(){if(w.ankSearch)w.ankSearch.open()};d.head.appendChild(sc)}
if(sbtn){sbtn.addEventListener('click',function(){track('search_open');openSearch()});d.addEventListener('keydown',function(e){var t=e.target,tag=t&&t.tagName;if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&tag!=='INPUT'&&tag!=='TEXTAREA'&&tag!=='SELECT'&&!(t&&t.isContentEditable)){e.preventDefault();openSearch()}})}
/* ---------- navigation ---------- */
var b=d.querySelector('.menu'),n=d.querySelector('.nav');
function closeNav(f){if(n&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded','false');if(f)b.focus()}}
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav(true)});
n.addEventListener('click',function(e){if(e.target.tagName==='A')closeNav(false)});
d.addEventListener('click',function(e){if(!n.contains(e.target)&&!b.contains(e.target))closeNav(false)})}
/* ---------- scroll effects ---------- */
var hdr=d.querySelector('.hdr'),bar=d.querySelector('.progress'),top=d.querySelector('.top'),hero=d.querySelector('.hero>img'),tick=false,heroH=0;
function measure(){heroH=hero?hero.offsetHeight:0}
function onScroll(){var y=w.pageYOffset||root.scrollTop,h=root.scrollHeight-w.innerHeight;
if(hdr)hdr.classList.toggle('scrolled',y>10);
if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
if(top)top.classList.toggle('show',y>700);
if(hero&&!reduce&&y<w.innerHeight*1.3)hero.style.transform='translate3d(0,'+Math.min(y*.12,heroH*.06)+'px,0)';
tick=false}
w.addEventListener('scroll',function(){if(!tick){tick=true;w.requestAnimationFrame(onScroll)}},{passive:true});w.addEventListener('resize',function(){measure()},{passive:true});w.requestAnimationFrame(function(){measure();onScroll()});
if(top)top.addEventListener('click',function(){w.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
function initReveal(){if(reduce||!('IntersectionObserver' in w))return;
var sel='.cards>*,.quotes>*,.steps>li,.why>div,.logos>*,.tm,.case,.pick li,.photo,.card-form,.cform,.cinfo,.facts,.faq details,.ticks li,.feats>*,.sec h2,.sec .tag,.sec .lede,.quiz';
var els=[].slice.call(d.querySelectorAll(sel)).filter(function(el){return !el.closest('.hero,.phero,.hdr,.ftr')});
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var el=en.target;el.classList.add('in');io.unobserve(el);setTimeout(function(){el.classList.remove('rv','in');el.style.removeProperty('--d')},1100)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
var cnt=new Map();els.forEach(function(el){var k=cnt.get(el.parentNode)||0;cnt.set(el.parentNode,k+1);el.style.setProperty('--d',Math.min(k,5)*70+'ms');el.classList.add('rv');io.observe(el)})}
idle(initReveal);
/* ---------- status banners after PHP redirects ---------- */
var qs=new URLSearchParams(location.search),s=qs.get('status'),t=d.getElementById('status');
var m={sent:['ok','Thank you. We have received your enquiry and will reply within one business day.'],error:['err','Your message could not be sent. Please check your details and try again, or email info@ankateconsulting.co.ke, call +254 705 914 714 or message us on WhatsApp at +254 728 907 973.'],
booked:['ok','Your call is booked. We have emailed you a confirmation with a calendar invite.'],slottaken:['err','That time was just taken by someone else. Please choose another time below.'],bookerror:['err','We could not complete your booking. Please check your details and try again, or call +254 705 914 714.'],applied:['ok','Thank you. Your application has been received. We have emailed you a confirmation.'],applyerror:['err','We could not submit your application. Please check your details and CV (PDF, DOC or DOCX, up to 5 MB) and try again, or email info@ankateconsulting.co.ke.'],closed:['err','This vacancy has closed and is no longer accepting applications.'],subscribed:['ok','You are subscribed. Welcome to Ankate Insights.'],confirm:['ok','Almost done. We have sent a message to your inbox. Please open it and click the confirmation link to complete your subscription.'],
unsubscribed:['ok','You have been unsubscribed and will not receive further newsletters.'],suberror:['err','We could not complete that. Please check your name and email address and try again, or contact us if the problem continues.']};
if(t&&m[s]){t.className='banner '+m[s][0];t.textContent=m[s][1];t.hidden=false;t.setAttribute('tabindex','-1');t.focus()}
var sv=qs.get('service'),mg=qs.get('msg');
if(sv){[].forEach.call(d.querySelectorAll('input[name=service]'),function(r){if(r.value===sv)r.checked=true});var hs=d.getElementById('h-s');if(hs)[].forEach.call(hs.options,function(o){if(o.text===sv)hs.value=o.text})}
if(mg){var cm=d.getElementById('c-m');if(cm&&!cm.value)cm.value=mg}
/* ---------- validation ---------- */
function normPhone(v){var x=v.replace(/[\s().-]/g,''),k;
if((k=x.match(/^(?:\+?254|0)([17]\d{8})$/)))return '+254'+k[1];
if(/^\+(?!254)[1-9]\d{7,14}$/.test(x))return x;
if((k=x.match(/^00((?!254)[1-9]\d{7,14})$/)))return '+'+k[1];return ''}
function fmtPhone(n){return /^\+254\d{9}$/.test(n)?n.replace(/^(\+254)(\d{3})(\d{3})(\d{3})$/,'$1 $2 $3 $4'):n}
var TYPOS={'gmial.com':'gmail.com','gmai.com':'gmail.com','gmal.com':'gmail.com','gnail.com':'gmail.com','gmail.co':'gmail.com','gmail.con':'gmail.com','yaho.com':'yahoo.com','yahooo.com':'yahoo.com','yahoo.con':'yahoo.com','hotmial.com':'hotmail.com','hotmai.com':'hotmail.com','outlok.com':'outlook.com','outlook.con':'outlook.com'};
var V={
cv:function(v,f,el){var file=el.files&&el.files[0];if(!file)return 'Please attach your CV (PDF, DOC or DOCX).';if(!/\.(pdf|docx?)$/i.test(file.name))return 'Please upload a PDF, DOC or DOCX file.';if(file.size>5242880)return 'Your CV is larger than 5 MB. Please upload a smaller file.';if(file.size<1000)return 'This file looks empty. Please choose another.';return ''},
calldate:function(v){if(!v)return '';var d0=new Date(v+'T00:00:00');if(isNaN(d0))return 'Please choose a valid date.';var t0=new Date();t0.setHours(0,0,0,0);if(d0<t0)return 'Please choose today or a later date.';if(d0.getDay()===0)return 'We do not take calls on Sundays. Please choose Monday to Saturday.';return ''},
url:function(v){if(!v)return '';try{var u=new URL(v);return /^https?:$/.test(u.protocol)?'':'Please enter a web address starting with https://'}catch(e){return 'Please enter a full web address, for example https://drive.google.com/...'}},
name:function(v){return /^[\p{L}][\p{L}\p{M}\s.'\u2019-]{1,79}$/u.test(v)&&v.length>=2?'':'Please enter your full name using letters only.'},
email:function(v){return /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(v)&&v.indexOf('..')<0?'':'Please enter a valid email address, for example name@company.co.ke.'},
phone:function(v,f){var pref=f.querySelector('input[name=contact_pref]:checked');if(!v)return pref&&pref.value!=='Email'?'Please add a phone number so we can reach you by '+(pref.value==='Phone call'?'phone':'WhatsApp')+'.':'';return normPhone(v)?'':'Please enter a valid number, for example 0712 345 678 or +254 712 345 678.'},
message:function(v){return v.length>=10?'':'Please tell us a little more, at least 10 characters.'}};
function errHost(el){return el.type==='checkbox'?el.closest('label'):el.type==='radio'?el.closest('.grp'):el}
function errId(el){return (el.type==='radio'?'g-'+el.name:(el.id||el.name))+'-err'}
function setErr(el,txt,sug){var id=errId(el),fe=d.getElementById(id),host=errHost(el);if(sug&&fe&&fe.getAttribute('data-sug')===sug)return;
if(!txt){[].forEach.call(el.type==='radio'?el.form.querySelectorAll('input[name="'+el.name+'"]'):[el],function(x){x.removeAttribute('aria-invalid');x.removeAttribute('aria-describedby')});if(fe)fe.remove();return}
if(!fe){fe=d.createElement('small');fe.id=id;fe.setAttribute('role','alert');host.insertAdjacentElement('afterend',fe)}
fe.className='fe'+(sug?' sug':'');fe.textContent=txt;if(sug)fe.setAttribute('data-sug',sug);else fe.removeAttribute('data-sug');
if(sug){var bt=d.createElement('button');bt.type='button';bt.textContent='Use '+sug;bt.addEventListener('click',function(){el.value=sug;setErr(el,'');check(el);el.focus()});fe.appendChild(d.createTextNode(' '));fe.appendChild(bt)}
if(!sug)(el.type==='radio'?el.form.querySelectorAll('input[name="'+el.name+'"]'):[el]).forEach(function(x){x.setAttribute('aria-invalid','true');x.setAttribute('aria-describedby',id)})}
function check(el){if(el.type==='hidden'||el.closest('.hp')||el.disabled)return true;
var f=el.form,v=(el.type==='checkbox'||el.type==='radio')?'':(el.type==='file'?(el.files&&el.files[0]?el.files[0].name:''):el.value.trim()),k=el.getAttribute('data-v'),msg='',sug='';
if(k&&V[k]){if(v||el.required||k==='phone')msg=V[k](v,f,el)}
else if(!el.validity.valid){msg=el.validity.valueMissing?(el.type==='checkbox'?'Please tick this box to continue.':el.type==='radio'?'Please choose one option.':'This field is required.'):(el.validationMessage||'Please check this value.')}
if(el.required&&!v&&el.type!=='checkbox'&&el.type!=='radio'&&!msg)msg='This field is required.';
if(!msg&&k==='email'){var dom=v.split('@')[1].toLowerCase();if(TYPOS[dom]){var first=!el.dataset.sugAck;el.dataset.sugAck='1';setErr(el,'Did you mean '+v.split('@')[0]+'@'+TYPOS[dom]+'?',v.split('@')[0]+'@'+TYPOS[dom]);return !first}}
if(msg){setErr(el,msg);var w1=el.closest('.fld');if(w1)w1.classList.remove('ok');return false}
setErr(el,'');var w2=el.closest('.fld');if(w2&&v&&el.type!=='select-one')w2.classList.add('ok');
if(k==='phone'&&v){var nn=normPhone(v);if(nn)el.value=fmtPhone(nn)}
return true}
/* ---------- proof-of-work (invisible spam check) ---------- */
var P=[],KK=[],H0=[],shaReady=false;function ensureSha(){if(shaReady)return;shaReady=true;for(var c=2;P.length<64;c++){var ok=true;for(var i=0;i<P.length;i++){if(c%P[i]===0){ok=false;break}}if(ok)P.push(c)}
for(var j=0;j<64;j++)KK.push((Math.cbrt(P[j])%1*4294967296)>>>0);for(var q=0;q<8;q++)H0.push((Math.sqrt(P[q])%1*4294967296)>>>0)}
function sha256(str){ensureSha();var l=str.length,wd=[],i;for(i=0;i<l;i++)wd[i>>2]|=(str.charCodeAt(i)&255)<<(24-(i%4)*8);
wd[l>>2]|=0x80<<(24-(l%4)*8);wd[(((l+8)>>6)<<4)+15]=l*8;var h=H0.slice(),W=new Array(64);
for(var o=0;o<wd.length;o+=16){var a=h[0],b2=h[1],c=h[2],d2=h[3],e=h[4],f=h[5],g=h[6],hh=h[7];
for(i=0;i<64;i++){if(i<16)W[i]=wd[o+i]|0;else{var x=W[i-15],y=W[i-2];W[i]=(((x>>>7|x<<25)^(x>>>18|x<<14)^(x>>>3))+W[i-7]+((y>>>17|y<<15)^(y>>>19|y<<13)^(y>>>10))+W[i-16])|0}
var t1=(hh+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+((e&f)^(~e&g))+KK[i]+W[i])|0,t2=(((a>>>2|a<<30)^(a>>>13|a<<19)^(a>>>22|a<<10))+((a&b2)^(a&c)^(b2&c)))|0;
hh=g;g=f;f=e;e=(d2+t1)|0;d2=c;c=b2;b2=a;a=(t1+t2)|0}
h[0]=(h[0]+a)|0;h[1]=(h[1]+b2)|0;h[2]=(h[2]+c)|0;h[3]=(h[3]+d2)|0;h[4]=(h[4]+e)|0;h[5]=(h[5]+f)|0;h[6]=(h[6]+g)|0;h[7]=(h[7]+hh)|0}return h}
function zeros(h){return h[0]!==0?Math.clz32(h[0]):32+Math.clz32(h[1])}
w.__ank={sha256:sha256,zeros:zeros};
function solve(f){if(f._pow)return f._pow;var url=meta('ank-challenge');if(!url||f.dataset.powReady){return Promise.resolve()}
f._pow=fetch(url,{cache:'no-store'}).then(function(r){return r.json()}).then(function(c){return new Promise(function(res){var nn=0;
(function chunk(){var end=nn+3000;for(;nn<end;nn++){if(zeros(sha256(c.salt+nn))>=c.bits){var set=function(k,v){var i=f.querySelector('[name='+k+']');if(i)i.value=v};
set('pow_salt',c.salt);set('pow_exp',c.exp);set('pow_sig',c.sig);set('pow_n',nn);f.dataset.powReady='1';return res()}}setTimeout(chunk,0)})()})}).catch(function(){});
return f._pow}
/* ---------- forms ---------- */
function say(f,kind,text){var p=f.previousElementSibling;if(!p||!p.classList.contains('banner')||p.id==='status'){p=d.createElement('div');p.setAttribute('role','status');p.setAttribute('tabindex','-1');f.parentNode.insertBefore(p,f)}p.className='banner '+kind;p.hidden=false;p.textContent=text;p.focus()}
function finalize(f,x,label){var ts=f.querySelector('input[name=ts]');
if(f.hasAttribute('data-ajax')){fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('bad');say(f,'ok',f.getAttribute('data-ok'));track('form_sent');f.reset();f.classList.remove('last');if(f._show&&f.querySelector('.wz-step'))f._show(0)}).catch(function(){say(f,'err','Your message could not be sent. Please email info@ankateconsulting.co.ke, call +254 705 914 714 or message us on WhatsApp at +254 728 907 973.')}).then(function(){if(x){x.disabled=false;x.textContent=label}})}
else{track('form_submit');HTMLFormElement.prototype.submit.call(f)}}
var formsReady=false;
function initForms(){if(formsReady)return;formsReady=true;d.querySelectorAll('form[data-wizard],form.sform').forEach(function(f){
f.setAttribute('novalidate','');var ts=f.querySelector('input[name=ts]');if(ts)ts.value=Date.now();
[].forEach.call(f.querySelectorAll('button'),function(bt){bt.addEventListener('mousedown',function(e){e.preventDefault()})});
var fields=[].slice.call(f.querySelectorAll('input,select,textarea'));
f.addEventListener('focusin',function(){solve(f)},{once:true});
fields.forEach(function(el){var ev=(el.type==='checkbox'||el.type==='radio'||el.type==='file'||el.tagName==='SELECT')?'change':'input';if(el.type==='file')el.addEventListener('change',function(){var fn=el.parentNode.querySelector('.fname');if(fn)fn.textContent=el.files&&el.files[0]?el.files[0].name+' ('+Math.round(el.files[0].size/1024)+' KB)':'';check(el)});
el.addEventListener('blur',function(){if(el.value||el.getAttribute('aria-invalid'))check(el)});
el.addEventListener(ev,function(){if(el.getAttribute('data-v')==='email')delete el.dataset.sugAck;if(el.getAttribute('aria-invalid')||el.type==='radio')check(el);if(el.type==='radio'&&el.name==='contact_pref'){var ph=f.querySelector('[name=phone]');if(ph&&ph.getAttribute('aria-invalid'))check(ph)}})});
[].forEach.call(f.querySelectorAll('.count'),function(c){var ta=d.getElementById(c.getAttribute('data-count'));if(ta)ta.addEventListener('input',function(){c.textContent=ta.value.length+' / '+ta.maxLength})});
[].forEach.call(f.querySelectorAll('input[type=date][data-v=calldate]'),function(di){var n0=new Date(),mm=('0'+(n0.getMonth()+1)).slice(-2),dd=('0'+n0.getDate()).slice(-2);di.min=n0.getFullYear()+'-'+mm+'-'+dd});
var steps=[].slice.call(f.querySelectorAll('.wz-step')),idx=0;
function show(i,focus){idx=i;steps.forEach(function(s2,k){s2.classList.toggle('on',k===i)});
[].forEach.call(f.querySelectorAll('.wz-steps li'),function(li,k){li.classList.toggle('on',k===i);li.classList.toggle('done',k<i);if(k===i)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});if(f._live){var lg=steps[i].querySelector('legend');f._live.textContent='Step '+(i+1)+' of '+steps.length+': '+(lg?lg.textContent:'')}
var bi=f.querySelector('.wz-bar i');if(bi)bi.style.width=((i+1)/steps.length*100)+'%';f.classList.toggle('first',i===0);f.classList.toggle('last',i===steps.length-1);
if(focus){var first=steps[i].querySelector('input:not([type=hidden]):not([type=radio]),textarea,select');if(first)first.focus({preventScroll:true});var top2=f.getBoundingClientRect().top+(w.pageYOffset||0)-110;if(top2<(w.pageYOffset||0))w.scrollTo({top:top2,behavior:reduce?'auto':'smooth'})}}
var live=d.createElement('p');live.className='sr';live.setAttribute('role','status');f.appendChild(live);f._live=live;f._show=show;
function stepOk(i){var bad=null;[].forEach.call(steps[i].querySelectorAll('input,select,textarea'),function(el){if(!check(el)&&!bad)bad=el});if(bad){bad.focus();return false}return true}
if(steps.length){show(0);
var nx=f.querySelector('[data-next]'),pv=f.querySelector('[data-prev]');
if(nx)nx.addEventListener('click',function(){if(stepOk(idx)){show(idx+1,true);track('form_step_'+(idx+1))}});
if(pv)pv.addEventListener('click',function(){show(idx-1,true)});
f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.type!=='checkbox'&&e.target.type!=='radio'){e.preventDefault();if(idx<steps.length-1){if(stepOk(idx))show(idx+1,true)}else f.querySelector('[data-submit]').click()}})}
f.addEventListener('submit',function(e){e.preventDefault();var bad=null,badStep=0;
fields.forEach(function(el){if(el.closest('.wz-step')&&steps.length){var si=steps.indexOf(el.closest('.wz-step'));if(!check(el)&&!bad){bad=el;badStep=si}}else if(!check(el)&&!bad)bad=el});
if(bad){if(steps.length)show(badStep);bad.focus();return}
var x=f.querySelector('button[type=submit]:not([hidden])')||f.querySelector('[data-submit]'),label=x?x.textContent:'';if(x){x.disabled=true;x.textContent='Sending...'}
Promise.resolve(solve(f)).then(function(){finalize(f,x,label)})})});var af=d.activeElement;if(af&&af.form&&af.form.hasAttribute('data-pow'))solve(af.form)}
idle(initForms);['focusin','pointerdown','touchstart'].forEach(function(ev){d.addEventListener(ev,initForms,{once:true,capture:true,passive:true})});
/* ---------- real-user page speed (first-party analytics only) ---------- */
if(collectUrl&&!dnt&&'PerformanceObserver' in w){var vt={lcp:0,cls:0,inp:0,fcp:0},obs=function(type,fn,extra){try{var o={type:type,buffered:true};for(var k in extra)o[k]=extra[k];new PerformanceObserver(function(l){l.getEntries().forEach(fn)}).observe(o)}catch(e){}};
obs('largest-contentful-paint',function(e){vt.lcp=e.startTime});obs('layout-shift',function(e){if(!e.hadRecentInput)vt.cls+=e.value});
obs('event',function(e){if(e.interactionId&&e.duration>vt.inp)vt.inp=e.duration},{durationThreshold:40});obs('paint',function(e){if(e.name==='first-contentful-paint')vt.fcp=e.startTime});
var sentV=false;function flushV(){if(sentV||!vt.lcp)return;sentV=true;send('webvitals',{lcp:String(Math.round(vt.lcp)),cls:vt.cls.toFixed(3),inp:String(Math.round(vt.inp)),fcp:String(Math.round(vt.fcp))})}
d.addEventListener('visibilitychange',function(){if(d.visibilityState==='hidden')flushV()});w.addEventListener('pagehide',flushV)}
/* ---------- page feedback ---------- */
var fb=d.querySelector('.fb');
if(fb){var more=fb.querySelector('.fb-more'),thanks=fb.querySelector('.fb-thanks');
[].forEach.call(fb.querySelectorAll('[data-fb]'),function(bt){bt.addEventListener('click',function(){var v=bt.getAttribute('data-fb');track('feedback_'+v);
fb.querySelector('.fb-q').hidden=true;[].forEach.call(fb.querySelectorAll('[data-fb]'),function(x){x.hidden=true});
if(v==='no'){more.hidden=false;fb.querySelector('#fb-c').focus()}else{thanks.hidden=false}})});
more.addEventListener('submit',function(e){e.preventDefault();var c=fb.querySelector('#fb-c').value.trim().slice(0,300);if(c)track('feedback_comment',{c:c});more.hidden=true;thanks.hidden=false})}
})();
