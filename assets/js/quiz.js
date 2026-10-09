(function(){
var root=document.getElementById('quiz');if(!root)return;
var Q=[['Every employee has a signed, written contract.','compliance'],
['We have a written staff handbook and core HR policies that employees have received.','policies'],
['Every employee gets a payslip, and statutory deductions (PAYE, NSSF, SHIF, Housing Levy) are declared and paid on time.','payroll'],
['Each employee has a complete, organised personnel file.','payroll'],
['Managers follow a clear, fair process for discipline and exits, and document it.','compliance'],
['Every role has a written job description and a structured hiring process.','recruitment'],
['New staff go through a planned onboarding.','recruitment'],
['Every employee has clear goals and a regular performance review.','performance'],
['Managers have been trained to manage people.','performance'],
['Someone with HR expertise owns HR, rather than the owner or finance team doing it alongside other work.','outsourced-hr']];
var A={compliance:{n:'HR compliance',u:'services/compliance.html',s:'HR Compliance & Workplace Advisory',t:'Check contracts, disciplinary process and records against current Kenyan requirements.'},
policies:{n:'HR policies',u:'services/policies.html',s:'HR Policies & Business Support',t:'Put a clear handbook and core policies in place.'},
payroll:{n:'Payroll and records',u:'services/payroll.html',s:'Payroll & HR Administration',t:'Get payroll, statutory deductions and employee files organised.'},
recruitment:{n:'Hiring and onboarding',u:'services/recruitment.html',s:'Recruitment & Talent Acquisition',t:'Structure how you define roles, hire and onboard.'},
performance:{n:'Performance and management',u:'services/performance.html',s:'Training & Performance Management',t:'Set clear goals and reviews, and train your managers.'},
'outsourced-hr':{n:'HR ownership',u:'services/outsourced-hr.html',s:'Outsourced HR',t:'Get dependable HR capacity without building a department.'}};
var O=[['Yes, fully',2],['Partly',1],['Not yet',0]],ans=[],i=0,started=false;
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function track(n,p){if(window.ankTrack)window.ankTrack(n,p)}
function render(){root.textContent='';
var meta=el('div','qmeta');meta.appendChild(el('span','','Question '+(i+1)+' of '+Q.length));meta.appendChild(el('span','','About 3 minutes'));root.appendChild(meta);
var bar=el('div','qbar'),fill=el('i');bar.appendChild(fill);root.appendChild(bar);
var fs=el('fieldset'),lg=el('legend','',Q[i][0]);lg.tabIndex=-1;fs.appendChild(lg);var opts=el('div','opts');
O.forEach(function(o,k){var lab=el('label','opt'),inp=el('input');inp.type='radio';inp.name='q'+i;inp.value=o[1];if(ans[i]===o[1])inp.checked=true;
inp.addEventListener('change',function(){ans[i]=o[1];next.disabled=false;if(!started){started=true;track('health_check_start')}});lab.appendChild(inp);lab.appendChild(el('span','',o[0]));opts.appendChild(lab)});
fs.appendChild(opts);root.appendChild(fs);
var nav=el('div','qnav'),back=el('button','btn line','Back');back.type='button';back.disabled=i===0;back.addEventListener('click',function(){i--;render()});
var next=el('button','btn',i===Q.length-1?'See my result':'Next');next.type='button';next.disabled=ans[i]===undefined;next.addEventListener('click',function(){if(i<Q.length-1){i++;render()}else{result()}});
nav.appendChild(back);nav.appendChild(next);root.appendChild(nav);
requestAnimationFrame(function(){fill.style.width=((i+(ans[i]!==undefined?1:0))/Q.length*100)+'%'});lg.focus({preventScroll:true})}
function result(){var tot=0,ar={};Q.forEach(function(q,k){tot+=ans[k];var a=ar[q[1]]||(ar[q[1]]={s:0,m:0});a.s+=ans[k];a.m+=2});
var pct=tot/(Q.length*2),band=pct<.45?'Needs attention':pct<.75?'Partly in place':'Strong foundations';
var msg=pct<.45?'Several basics are not yet in place. These gaps are common in growing organisations and they are fixable. Start with the areas below.':pct<.75?'You have solid foundations in some areas and gaps in others. Closing them now is easier than after the business grows.':'Most basics are in place. A periodic review keeps it that way as you grow.';
var gaps=Object.keys(ar).map(function(k){return{k:k,r:ar[k].s/ar[k].m}}).filter(function(g){return g.r<1}).sort(function(a,b){return a.r-b.r}).slice(0,3);
root.textContent='';var r=el('div','result');var h=el('h2','',band);h.tabIndex=-1;r.appendChild(h);
var sc=el('p','score',String(tot));sc.appendChild(el('small','',' out of '+Q.length*2));r.appendChild(sc);
var mt=el('div','meter'),mf=el('i');mt.appendChild(mf);r.appendChild(mt);r.appendChild(el('p','lede',msg));
if(gaps.length){r.appendChild(el('h3','','Where to focus first'));var ul=el('ul','gaps');gaps.forEach(function(g){var a=A[g.k],li=el('li'),lk=el('a');lk.href=a.u;lk.appendChild(el('strong','',a.n));lk.appendChild(el('span','',a.t));li.appendChild(lk);ul.appendChild(li)});r.appendChild(ul)}
r.appendChild(el('p','note','This is an indicative self-check, not an audit or legal advice. An adviser can review your actual documents and practices.'));
var names=gaps.map(function(g){return A[g.k].n}).join(', ');
var m='I completed the Ankate HR health check and scored '+tot+' out of '+Q.length*2+' ('+band+').'+(names?' Areas to improve: '+names+'.':'');
var acts=el('div','acts mt'),c=el('a','btn','Talk to an advisor about my result');c.href='contact.html?service='+encodeURIComponent(gaps.length?A[gaps[0].k].s:'Not sure, I need advice')+'&msg='+encodeURIComponent(m);c.setAttribute('data-track','health_check_contact');
var rs=el('button','btn line','Retake the check');rs.type='button';rs.addEventListener('click',function(){ans=[];i=0;render()});acts.appendChild(c);acts.appendChild(rs);r.appendChild(acts);root.appendChild(r);
requestAnimationFrame(function(){requestAnimationFrame(function(){mf.style.width=Math.round(pct*100)+'%'})});h.focus({preventScroll:false});track('health_check_complete',{score:String(tot),band:band})}
render()})();
