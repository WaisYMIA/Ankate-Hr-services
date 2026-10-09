(function(){
var d=document,w=window,root=d.documentElement;root.classList.add('js');
var reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
w.plausible=w.plausible||function(){(w.plausible.q=w.plausible.q||[]).push(arguments)};
function track(n,p){try{w.plausible(n,p?{props:p}:undefined)}catch(e){}}w.ankTrack=track;
/* navigation */
var b=d.querySelector('.menu'),n=d.querySelector('.nav');
function closeNav(f){if(n&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded','false');if(f)b.focus()}}
if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')closeNav(true)});
n.addEventListener('click',function(e){if(e.target.tagName==='A')closeNav(false)});
d.addEventListener('click',function(e){if(!n.contains(e.target)&&!b.contains(e.target))closeNav(false)})}
/* scroll effects: header state, progress bar, back to top, hero parallax */
var hdr=d.querySelector('.hdr'),bar=d.querySelector('.progress'),top=d.querySelector('.top'),hero=d.querySelector('.hero>img'),tick=false;
function onScroll(){var y=w.pageYOffset||root.scrollTop,h=root.scrollHeight-w.innerHeight;
if(hdr)hdr.classList.toggle('scrolled',y>10);
if(bar)bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
if(top)top.classList.toggle('show',y>700);
if(hero&&!reduce&&y<w.innerHeight*1.3)hero.style.transform='translate3d(0,'+Math.min(y*.12,hero.offsetHeight*.06)+'px,0)';
tick=false}
w.addEventListener('scroll',function(){if(!tick){tick=true;w.requestAnimationFrame(onScroll)}},{passive:true});onScroll();
if(top)top.addEventListener('click',function(){w.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
/* scroll reveal */
if(!reduce&&'IntersectionObserver' in w){
var sel='.cards>*,.quotes>*,.steps>li,.why>div,.logos>*,.tm,.case,.pick li,.photo,.card-form,.facts,.faq details,.ticks li,.sec h2,.sec .tag,.sec .lede,.quiz';
var els=[].slice.call(d.querySelectorAll(sel)).filter(function(el){return !el.closest('.hero,.phero,.hdr,.ftr')});
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var el=en.target;el.classList.add('in');io.unobserve(el);setTimeout(function(){el.classList.remove('rv','in');el.style.removeProperty('--d')},1100)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(el){var sib=[].filter.call(el.parentNode.children,function(c){return els.indexOf(c)>-1});el.style.setProperty('--d',Math.min(sib.indexOf(el),5)*70+'ms');el.classList.add('rv');io.observe(el)})}
/* click tracking (works when analytics is configured) */
d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-track]');if(a)track(a.getAttribute('data-track'))});
/* status banners after PHP form redirects */
var qs=new URLSearchParams(location.search),s=qs.get('status'),t=d.getElementById('status');
var m={sent:['ok','Thank you. We have received your enquiry and will reply within one business day.','enquiry_sent'],error:['err','Your message could not be sent. Please check the required fields, or email info@ankateconsulting.co.ke, call +254 705 914 714 or message us on WhatsApp at +254 728 907 973.'],subscribed:['ok','You are subscribed. Thank you.','newsletter_confirmed'],confirm:['ok','Almost done. Please check your email and click the link to confirm your subscription.'],unsubscribed:['ok','You have been unsubscribed.'],suberror:['err','We could not complete that. Please enter a valid email and tick the consent box, or try again.']};
if(t&&m[s]){t.className='banner '+m[s][0];t.textContent=m[s][1];t.hidden=false;t.setAttribute('tabindex','-1');t.focus();if(m[s][2])track(m[s][2])}
/* contact form prefill (from health check or links) */
var sv=qs.get('service'),mg=qs.get('msg'),cs=d.getElementById('c-s'),cm=d.getElementById('c-m');
if(cs&&sv){[].forEach.call(cs.options,function(o){if(o.text===sv)cs.value=o.text})}
if(cm&&mg&&!cm.value)cm.value=mg;
/* forms: inline validation + submit handling */
function fieldMsg(el){var v=el.validity;if(v.valueMissing)return el.type==='checkbox'?'Please tick this box to continue.':'This field is required.';if(v.typeMismatch)return el.type==='email'?'Please enter a valid email address.':'Please enter a valid value.';return el.validationMessage||'Please check this value.'}
function setErr(el,txt){var id=(el.id||el.name)+'-err',fe=d.getElementById(id),host=el.type==='checkbox'?el.closest('label'):el;
if(!txt){el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');if(fe)fe.remove();return}
if(!fe){fe=d.createElement('small');fe.id=id;fe.className='fe'+(el.type==='checkbox'?' full':'');fe.setAttribute('role','alert');host.insertAdjacentElement('afterend',fe)}
fe.textContent=txt;el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',id)}
function check(el){if(el.type==='hidden'||el.closest('.hp')||el.disabled)return true;if(el.validity.valid){setErr(el,'');return true}setErr(el,fieldMsg(el));return false}
function say(f,kind,text){var p=f.previousElementSibling;if(!p||!p.classList.contains('banner')||p.id==='status'){p=d.createElement('div');p.setAttribute('role','status');p.setAttribute('tabindex','-1');f.parentNode.insertBefore(p,f)}p.className='banner '+kind;p.hidden=false;p.textContent=text;p.focus()}
d.querySelectorAll('form.form').forEach(function(f){
f.setAttribute('novalidate','');
var ts=f.querySelector('input[name=ts]');if(ts)ts.value=Date.now();
var fields=[].slice.call(f.querySelectorAll('input,select,textarea'));
fields.forEach(function(el){el.addEventListener('blur',function(){if(el.value||el.getAttribute('aria-invalid'))check(el)});el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',function(){if(el.getAttribute('aria-invalid'))check(el)})});
f.addEventListener('submit',function(e){var bad=null;fields.forEach(function(el){if(!check(el)&&!bad)bad=el});
if(bad){e.preventDefault();bad.focus();return}
var x=f.querySelector('button[type=submit]'),label=x?x.textContent:'';
if(f.hasAttribute('data-ajax')){e.preventDefault();if(x){x.disabled=true;x.textContent='Sending...'}
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('bad');say(f,'ok',f.getAttribute('data-ok'));track('form_sent');f.reset();if(ts)ts.value=Date.now()}).catch(function(){say(f,'err','Your message could not be sent. Please email info@ankateconsulting.co.ke, call +254 705 914 714 or message us on WhatsApp at +254 728 907 973.')}).then(function(){if(x){x.disabled=false;x.textContent=label}})}
else if(x){x.disabled=true;x.textContent='Sending...'}})})
})();
