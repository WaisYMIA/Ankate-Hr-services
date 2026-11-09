(function(){
var d=document,root=d.getElementById('book');if(!root)return;
var live=root.getAttribute('data-mode')==='live',cfg=JSON.parse(root.getAttribute('data-config')),api=root.getAttribute('data-api');
var cal=d.getElementById('cal'),slotsEl=d.getElementById('slots'),th=d.getElementById('bk-th'),sum=d.getElementById('bk-sum'),form=root.querySelector('form'),fd=d.getElementById('b-date'),ft=d.getElementById('b-time');
var DN=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
function pad(n){return ('0'+n).slice(-2)}
function mk(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
var today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Nairobi',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
var view={y:+today.slice(0,4),m:+today.slice(5,7)-1},cur={y:view.y,m:view.m},cache={},selD='',selT='';
function isoDow(y,m,dd){return new Date(Date.UTC(y,m,dd)).getUTCDay()||7}
function ymd(y,m,dd){return y+'-'+pad(m+1)+'-'+pad(dd)}
function addDays(s,n){var t=new Date(Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10)+n));return ymd(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate())}
function longDate(s){var y=+s.slice(0,4),m=+s.slice(5,7)-1,dd=+s.slice(8,10);return DN[isoDow(y,m,dd)-1]+' '+dd+' '+MN[m]+' '+y}
function reqSlots(ds){var y=+ds.slice(0,4),m=+ds.slice(5,7)-1,dd=+ds.slice(8,10),h=cfg.hours[String(isoDow(y,m,dd))];if(!h||cfg.recurring.indexOf(ds.slice(5))>-1)return [];
var o=h[0].split(':'),c=h[1].split(':'),a=+o[0]*60+ +o[1],z=+c[0]*60+ +c[1],out=[],now=Date.now();
for(var t=a;t+cfg.slot<=z;t+=cfg.slot){var ep=Date.UTC(y,m,dd,Math.floor(t/60),t%60)-10800000;if(ep>=now+cfg.lead*3600000&&ep<=now+cfg.max*86400000)out.push(pad(Math.floor(t/60))+':'+pad(t%60))}return out}
function loadMonth(y,m,cb){var key=y+'-'+pad(m+1);if(cache[key])return cb(cache[key]);
if(live){fetch(api+'?month='+key,{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){cache[key]=j.days||{};cb(cache[key])}).catch(function(){cb({})});return}
var days={},n=new Date(Date.UTC(y,m+1,0)).getUTCDate();for(var i=1;i<=n;i++){var ds=ymd(y,m,i),s=reqSlots(ds);if(s.length)days[ds]=s}cache[key]=days;cb(days)}
function render(){cal.textContent='';cal.appendChild(mk('p','hint','Loading available days...'));
loadMonth(view.y,view.m,function(days){cal.textContent='';
var head=mk('div','cal-h'),prev=mk('button','cal-nav','Previous'),next=mk('button','cal-nav','Next'),title=mk('strong','',MN[view.m]+' '+view.y);prev.type=next.type='button';
prev.setAttribute('aria-label','Previous month');next.setAttribute('aria-label','Next month');prev.disabled=(view.y===cur.y&&view.m===cur.m);
var nf=ymd(view.m===11?view.y+1:view.y,(view.m+1)%12,1);next.disabled=nf>addDays(today,cfg.max);
prev.onclick=function(){view.m--;if(view.m<0){view.m=11;view.y--}render()};next.onclick=function(){view.m++;if(view.m>11){view.m=0;view.y++}render()};
head.appendChild(prev);head.appendChild(title);head.appendChild(next);cal.appendChild(head);
var g=mk('div','cal-g');g.setAttribute('role','group');g.setAttribute('aria-label','Days of '+MN[view.m]+' '+view.y);
['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function(n){g.appendChild(mk('span','dn',n))});
var lead=isoDow(view.y,view.m,1)-1;for(var i=0;i<lead;i++)g.appendChild(mk('span','pad'));
var n=new Date(Date.UTC(view.y,view.m+1,0)).getUTCDate(),any=false;
for(var k=1;k<=n;k++){(function(k){var ds=ymd(view.y,view.m,k),s=days[ds]||[],b=mk('button','day',String(k));b.type='button';any=any||!!s.length;
if(ds===today)b.classList.add('today');if(!s.length)b.disabled=true;else b.setAttribute('aria-label',longDate(ds)+', '+s.length+(s.length===1?' time':' times')+' available');
b.setAttribute('aria-pressed',ds===selD?'true':'false');b.onclick=function(){selD=ds;selT='';fd.value=ds;ft.value='';form.hidden=true;[].forEach.call(g.querySelectorAll('.day'),function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');showSlots(s);summary()};g.appendChild(b)})(k)}
cal.appendChild(g);if(!any)cal.appendChild(mk('p','note','There are no available times this month. Try the next month, or use our contact form and we will arrange a time.'))})}
function showSlots(s){slotsEl.textContent='';th.hidden=false;th.textContent='2. Choose a time on '+longDate(selD);
var groups=[['Morning',s.filter(function(x){return x<'12:00'})],['Afternoon',s.filter(function(x){return x>='12:00'})]];
groups.forEach(function(gr){if(!gr[1].length)return;slotsEl.appendChild(mk('p','slot-h',gr[0]));gr[1].forEach(function(t){var b=mk('button','slot',t);b.type='button';b.setAttribute('aria-pressed',t===selT?'true':'false');
b.onclick=function(){selT=t;ft.value=t;[].forEach.call(slotsEl.querySelectorAll('.slot'),function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');form.hidden=false;summary();var f=form.querySelector('select');if(f)f.focus({preventScroll:true});form.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'})};slotsEl.appendChild(b)})})}
function summary(){sum.textContent=selD?(selT?longDate(selD)+' at '+selT+' (East Africa Time)':longDate(selD)+'. Now choose a time.'):'Select a day and a time to continue.'}
form.addEventListener('reset',function(){selD=selT='';fd.value=ft.value='';form.hidden=true;slotsEl.textContent='';th.hidden=true;summary();cache={};render()});
var q=new URLSearchParams(location.search),st=q.get('status'),bd=q.get('d'),bt=q.get('t'),sb=d.getElementById('status');
if(st==='booked'&&/^\d{4}-\d{2}-\d{2}$/.test(bd||'')&&/^\d{2}:\d{2}$/.test(bt||'')){sb.textContent='Your call is booked for '+longDate(bd)+' at '+bt+' (East Africa Time). We have emailed you a confirmation with a calendar invite.';root.hidden=true;var again=mk('p','mt');var a=mk('a','btn line','Book another time');a.href='book.html';again.appendChild(a);root.parentNode.appendChild(again)}
render();
})();
