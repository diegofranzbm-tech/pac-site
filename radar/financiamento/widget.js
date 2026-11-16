(()=>{
const panel=document.querySelector('#mortgagePanel');
if(!panel)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct=n=>Number(n).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
const stamp=s=>s?new Date(s).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}):'Ainda não realizada';
function render(data){
 const rows=[...(data.rows||[])].sort((a,b)=>(a.annual===null)-(b.annual===null)||(a.annual??Infinity)-(b.annual??Infinity)||a.name.localeCompare(b.name));
 const month=data.reference_month?new Date(data.reference_month+'-01T12:00:00').toLocaleDateString('pt-BR',{month:'long',year:'numeric'}):'Sem dados';
 const stale=data.last_success&&Date.now()-new Date(data.last_success).getTime()>36*3600000;
 panel.querySelector('#mortgageReference').textContent='Médias de '+month;
 panel.querySelector('#mortgageList').innerHTML=rows.map((row,i)=>`<li class="mortgage-bank ${i===0&&row.annual!==null?'mortgage-best':''}"><span class="mortgage-rank">${row.annual!==null?i+1:'—'}</span><span class="mortgage-name">${esc(row.name)}<small>${row.annual!==null?pct(row.monthly)+' a.m. + TR':'Sem dado neste período'}</small></span><strong>${row.annual!==null?pct(row.annual)+'<small>a.a. + TR</small>':'—'}</strong></li>`).join('')||'<li class="mortgage-empty">As taxas ainda não estão disponíveis.</li>';
 panel.querySelector('#mortgageChecked').textContent='Consulta: '+stamp(data.checked_at);
 const alert=panel.querySelector('#mortgageAlert');alert.hidden=!(data.status==='error'||stale);
 alert.textContent=data.status==='error'?'Falha na consulta. Últimos dados preservados; leitura válida em '+stamp(data.last_success)+'.':stale?'Consulta atrasada. Última leitura válida: '+stamp(data.last_success)+'.':'';
}
async function load(){try{const response=await fetch('./financiamento/data.json?v='+Date.now(),{cache:'no-store'});if(!response.ok)throw Error();render(await response.json())}catch{const alert=panel.querySelector('#mortgageAlert');alert.hidden=false;alert.textContent='Não foi possível carregar as taxas. Tente recarregar a página.'}}
load();setInterval(load,300000);
})();
