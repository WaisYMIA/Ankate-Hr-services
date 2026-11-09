(function(){
var d=document,$=function(s,c){return (c||d).querySelector(s)},$$=function(s,c){return [].slice.call((c||d).querySelectorAll(s))};
var today=new Date();today.setHours(0,0,0,0);
function parse(s){return s?new Date(s+'T00:00:00'):null}
function diff(a,b){return Math.round((a-b)/864e5)}
function mk(t,c,x){var e=d.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
var saved=[];try{saved=JSON.parse(localStorage.getItem('ank_saved')||'[]')}catch(e){}
function persist(){try{localStorage.setItem('ank_saved',JSON.stringify(saved))}catch(e){}}
function closesText(cl){if(!cl)return '';var n=diff(cl,today);return n<0?'Closed':n===0?'Closes today':n===1?'Closes tomorrow':'Closes in '+n+' days'}
var refilter=null;
$$('.save').forEach(function(b){var s=b.getAttribute('data-slug'),lab=b.classList.contains('btn');
function paint(){var on=saved.indexOf(s)>-1;b.setAttribute('aria-pressed',on?'true':'false');if(lab){var l=b.querySelector('.lbl');if(l)l.textContent=on?'Saved':'Save this job'}}
if(lab&&!b.querySelector('svg')){b.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>')}
paint();
b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var i=saved.indexOf(s);if(i>-1)saved.splice(i,1);else saved.push(s);persist();$$('.save[data-slug="'+s+'"]').forEach(function(x){x.setAttribute('aria-pressed',saved.indexOf(s)>-1?'true':'false')});if(lab)paint();if(refilter)refilter();if(window.ankTrack)window.ankTrack('job_save')})});
$$('.job').forEach(function(c){var p=parse(c.getAttribute('data-posted')),cl=parse(c.getAttribute('data-closing')),bd=$('.badges',c),pd=$('.posted',c),cd=$('.closes',c);
if(c.getAttribute('data-featured')==='1'&&bd)bd.appendChild(mk('span','badge feat','Featured'));
if(p&&pd){var n=diff(today,p);pd.textContent=n<=0?'Posted today':n===1?'Posted yesterday':'Posted '+n+' days ago';if(n<=7&&bd)bd.appendChild(mk('span','badge new','New'))}
if(cl){var left=diff(cl,today);if(left<0){c.classList.add('is-closed');c.hidden=true}else{if(cd)cd.textContent=closesText(cl);if(left<=7&&bd)bd.appendChild(mk('span','badge soon','Closing soon'))}}});
var list=$('#joblist');
if(list){var q=$('#jq'),loc=$('#jloc'),type=$('#jtype'),cat=$('#jcat'),sort=$('#jsort'),sv=$('#jsaved'),clear=$('#jclear'),count=$('#jcount'),empty=$('#jempty'),total=$$('.job',list).length;
var params=new URLSearchParams(location.search);[['q',q],['loc',loc],['type',type],['cat',cat],['sort',sort]].forEach(function(p){var v=params.get(p[0]);if(v&&p[1])p[1].value=v});
refilter=function(){var term=q.value.trim().toLowerCase(),shown=0,cards=$$('.job',list);
cards.forEach(function(c){var ok=!c.classList.contains('is-closed')&&(!term||c.getAttribute('data-text').indexOf(term)>-1)&&(!loc.value||c.getAttribute('data-loc')===loc.value)&&(!type.value||c.getAttribute('data-type')===type.value)&&(!cat.value||c.getAttribute('data-cat')===cat.value)&&(!sv.checked||saved.indexOf(c.getAttribute('data-slug'))>-1);c.hidden=!ok;if(ok)shown++});
var order=cards.slice();if(sort.value==='closing')order.sort(function(a,b){var x=a.getAttribute('data-closing')||'9999',y=b.getAttribute('data-closing')||'9999';return x<y?-1:x>y?1:0});else if(sort.value==='newest')order.sort(function(a,b){var x=a.getAttribute('data-posted'),y=b.getAttribute('data-posted');return x<y?1:x>y?-1:0});
if(sort.value)order.forEach(function(c){list.appendChild(c)});
count.textContent=shown===1?'1 vacancy':shown+' vacancies';empty.hidden=shown>0;if(total&&!shown){$('#jempty-t').textContent='No vacancies match your search';$('#jempty-d').textContent='Try different words or clear the filters, or register your CV below and we will contact you when a suitable role opens.'}
var np=new URLSearchParams();if(q.value.trim())np.set('q',q.value.trim());if(loc.value)np.set('loc',loc.value);if(type.value)np.set('type',type.value);if(cat.value)np.set('cat',cat.value);if(sort.value)np.set('sort',sort.value);
var qs=np.toString();try{history.replaceState(null,'',location.pathname+(qs?'?'+qs:''))}catch(e){}};
var t=null;q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(refilter,120)});[loc,type,cat,sort,sv].forEach(function(x){x.addEventListener('change',refilter)});
clear.addEventListener('click',function(){q.value='';loc.value='';type.value='';cat.value='';sort.value='';sv.checked=false;refilter();q.focus()});refilter()}
var jd=$('.jd');
if(jd){var cl=parse(jd.getAttribute('data-closing')),ce=$('#closes-line');if(cl){if(ce)ce.textContent=closesText(cl);if(diff(cl,today)<0){var n=$('#job-closed');if(n)n.hidden=false;var aw=$('#apply-section');if(aw)aw.hidden=true;$$('.apply-btn').forEach(function(b){b.hidden=true})}}
var cp=$('#copylink');if(cp)cp.addEventListener('click',function(){var url=location.href.split('#')[0],done=function(){cp.textContent='Link copied'},fb=function(){var ta=mk('textarea');ta.value=url;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';d.body.appendChild(ta);ta.select();try{if(d.execCommand('copy'))done();else cp.textContent='Press Ctrl+C to copy: '+url}catch(e){cp.textContent='Copy failed'}ta.remove()};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(url).then(done,fb);else fb()});
var pr=$('#printjob');if(pr)pr.addEventListener('click',function(){window.print()})}
})();
