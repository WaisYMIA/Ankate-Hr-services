(function(){
var d=document,btn=d.querySelector('.srch'),root=btn.getAttribute('data-root')||'',idx=null,box,inp,list,sel=-1,res=[],prev=null;
function build(){box=d.createElement('div');box.className='so';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Search the site');
box.innerHTML='<div class="so-box"><label class="sr" for="so-q">Search the site</label><input id="so-q" type="search" placeholder="Search services, articles and vacancies" autocomplete="off"><ul class="so-res" id="so-list" role="listbox"></ul><div class="so-foot"><span>Use the arrow keys and Enter</span><span>Esc to close</span></div></div>';
d.body.appendChild(box);inp=box.querySelector('input');list=box.querySelector('ul');
box.addEventListener('mousedown',function(e){if(e.target===box)close()});
inp.addEventListener('input',run);
box.addEventListener('keydown',function(e){if(e.key==='Escape'){close()}else if(e.key==='ArrowDown'){e.preventDefault();move(1)}else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}else if(e.key==='Enter'&&sel>=0&&res[sel]){e.preventDefault();location.href=root+res[sel].u}else if(e.key==='Tab'){e.preventDefault();inp.focus()}})}
function load(cb){if(idx)return cb();fetch(btn.getAttribute('data-index')).then(function(r){return r.json()}).then(function(j){idx=j.map(function(x){x.s=(x.t+' '+x.c+' '+x.d).toLowerCase();x.tl=x.t.toLowerCase();return x});cb()}).catch(function(){idx=[];cb()})}
function run(){var q=inp.value.trim().toLowerCase();list.textContent='';sel=-1;res=[];if(!q){return}
var tk=q.split(/\s+/).filter(Boolean);
idx.forEach(function(x){var sc=0,ok=true;tk.forEach(function(t){if(x.s.indexOf(t)<0){ok=false;return}sc+=1;if(x.tl.indexOf(t)>-1)sc+=5;if(x.tl.indexOf(t)===0||x.tl.indexOf(' '+t)>-1)sc+=2});if(ok)res.push({x:x,sc:sc,u:x.u})});
res.sort(function(a,b){return b.sc-a.sc});res=res.slice(0,8);
if(!res.length){var li=d.createElement('li');li.className='none';li.textContent='No results for "'+inp.value.trim()+'". Try "payroll", "recruitment" or "contact".';list.appendChild(li);return}
res.forEach(function(r,i){var li=d.createElement('li'),a=d.createElement('a'),b=d.createElement('b'),sm=d.createElement('small'),k=d.createElement('i');a.href=root+r.u;a.setAttribute('role','option');k.textContent=r.x.c;b.appendChild(k);b.appendChild(d.createTextNode(r.x.t));sm.textContent=r.x.d.length>118?r.x.d.slice(0,115)+'...':r.x.d;a.appendChild(b);a.appendChild(sm);a.addEventListener('mousemove',function(){mark(i)});li.appendChild(a);list.appendChild(li)});mark(0)}
function mark(i){sel=i;[].forEach.call(list.querySelectorAll('a'),function(a,k){a.setAttribute('aria-selected',k===i?'true':'false')});var a=list.querySelectorAll('a')[i];if(a&&a.scrollIntoView)a.scrollIntoView({block:'nearest'})}
function move(n){if(!res.length)return;mark((sel+n+res.length)%res.length)}
function open(){if(!box)build();prev=d.activeElement;box.classList.add('open');d.documentElement.style.overflow='hidden';load(function(){inp.focus();inp.select();run()})}
function close(){if(!box)return;box.classList.remove('open');d.documentElement.style.overflow='';if(prev&&prev.focus)prev.focus()}
window.ankSearch={open:open,close:close};
})();
