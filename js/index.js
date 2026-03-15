'use strict';
const ZIKRS=[
{name:'Alhamdulillah',target:33,ar:'اَلْحَمْدُ لِلّٰہِ',ur:'اللہ کی تعریف ہے',hinglish:'Allah ki tamam taarif hai — shukr ada karo'},
{name:'Astagfirullah',target:100,ar:'اَسْتَغْفِرُ اللّٰہَ',ur:'میں اللہ سے معافی مانگتا ہوں',hinglish:'Main Allah se maafi mangta hoon — gunah maaf ho'},
{name:'Allahu Akbar',target:33,ar:'اَللّٰہُ اَکْبَرُ',ur:'اللہ سب سے بڑا ہے',hinglish:'Allah sab se bada hai — koi iska mukabla nahi'},
{name:'Subhanallah',target:33,ar:'سُبْحَانَ اللّٰہِ',ur:'اللہ پاک ہے',hinglish:'Allah bilkul pak aur beaib hai — har nuqs se azad'},
{name:'Darood Shareef',target:100,ar:'اَللّٰہُمَّ صَلِّ عَلٰی مُحَمَّدٍ',ur:'اے اللہ محمدؐ پر رحمت نازل فرما',hinglish:'Aye Allah!Nabi ﷺ par rehmat bhej — darood padhne se 10 neki milti hai'},
{name:'Kalma Shareef',target:100,ar:'لَآ اِلٰهَ اِلَّا اللّٰہُ مُحَمَّدٌ رَّسُوْلُ اللّٰہِ',ur:'اللہ کے سوا کوئی معبود نہیں، محمدؐ اس کے رسول ہیں',hinglish:'Allah ke siwa koi khuda nahi,Muhammad ﷺ uske Rasool hain'},
{name:'Ayatal Kursi',target:3,ar:'اَللّٰہُ لَآ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُ',ur:'اللہ وہ ہے جس کے سوا کوئی عبادت کے لائق نہیں، ہمیشہ زندہ، سب کا نگہبان',hinglish:'Ayatul Kursi padhne se raat bhar shaitan se hifazat hoti hai — Quran ki azeem ayat'},
{name:'Surah Al-Asr',target:3,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ وَالْعَصْرِۙ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',ur:'زمانے کی قسم، انسان گھاٹے میں ہے، سوائے ان لوگوں کے جو ایمان لائے',hinglish:'Zamane ki kasam — insaan ghate mein hai,siway unke jo imaan laaye aur nek kaam kiye'},
{name:'Surah Ad-Duha',target:3,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ',ur:'چاشت کے وقت کی قسم، اور رات کی جب وہ چھا جائے',hinglish:'Chasht ke waqt ki kasam — Allah ne Nabi ﷺ ko kabhi nahi chhoda,teri qadr zyada hogi'},
{name:'Surah Al-Kafiroon',target:3,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ قُلْ يَا أَيُّهَا الْكَافِرُونَ',ur:'کہو اے کافرو!میں اس کی عبادت نہیں کرتا جس کی تم عبادت کرتے ہو',hinglish:'Kaho aye kaafiro — main tumhare maabood ki ibadat nahi karta,tumhara deen tumhara'},
{name:'Surah Al-Falaq',target:7,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',ur:'کہو میں صبح کے رب کی پناہ مانگتا ہوں، شر سے جو اس نے پیدا کیا',hinglish:'Subah ke Rabb ki panaah mangta hoon — jadu,hasad aur sab burai se hifazat ke liye'},
{name:'Surah An-Naas',target:7,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ',ur:'کہو میں لوگوں کے رب کی پناہ مانگتا ہوں، لوگوں کے بادشاہ کی',hinglish:'Logo ke Rabb ki panaah — shaitaan ke waswase aur buri soch se bachne ke liye'},
{name:'Surah Al-Ikhlaas',target:3,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ قُلْ هُوَ اللّٰہُ أَحَدٌ',ur:'کہو وہ اللہ ایک ہے، اللہ بے نیاز ہے، نہ اس کی اولاد نہ وہ کسی کی اولاد',hinglish:'Ek baar padhna tihaye Quran ke barabar — Allah ek hai,koi sharik nahi'},
{name:'Surah Al-Kawthar',target:3,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',ur:'ہم نے آپ کو کوثر عطا کی، پس اپنے رب کے لیے نماز پڑھیں اور قربانی کریں',hinglish:'Hum ne tujhe Kausar di — Nabi ﷺ ko jannat mein kausar ka hauz ata hua'},
{name:'Surah Ar-Rahman',target:1,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ',ur:'رحمٰن نے قرآن سکھایا، انسان کو پیدا کیا، اسے بیان کرنا سکھایا',hinglish:'Rehman ne Quran sikhaya — فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ — Rab ki kaunsi naimat jhutlaoge?'},
{name:'Surah Muzammil',target:1,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ يَا أَيُّهَا الْمُزَّمِّلُ',ur:'اے کپڑا اوڑھنے والے، رات کو قیام کرو مگر تھوڑا',hinglish:'Aye kapda odhne wale — raat ko ibadat karo,Quran thehir thehir ke padho'},
{name:'Surah Yaaseen',target:1,ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ يسٓ وَالْقُرْءَانِ الْحَكِيمِ',ur:'یسٓ، قسم ہے حکمت بھرے قرآن کی، بیشک آپ رسولوں میں سے ہیں',hinglish:'Yaaseen Quran ka dil hai — ek baar padhna 10 baar Quran padhne ke barabar'},
{name:'Astagfar',target:100,ar:'اَسْتَغْفِرُ اللّٰہَ رَبِّيْ وَاَتُوْبُ اِلَيْہِ',ur:'میں اللہ سے مغفرت طلب کرتا ہوں اور اس کی طرف توبہ کرتا ہوں',hinglish:'Main Allah se maafi mangta hoon aur uski taraf lautta hoon — 100 baar padhne se rozi mein barkat'},
];
function initTasbih(){
const btn=q('#tasbihBtn'),numEl=q('#tasbihNum'),progEl=q('#tasbihProg');
const nameEl=q('#tasbihName'),ring=q('#ringFill'),sel=q('#tasbihSel');
const resetBtn=q('#tasbihReset');
const customWrap=q('#customZikrWrap'),customInput=q('#customZikrInput');
const CIRC=2*Math.PI*80;
function renderTasbih(){
const c=AZ.tasbihCount,t=AZ.tasbihTarget;
numEl.textContent=c;
progEl.textContent=`${c}/${t}— ${Math.round((c/t)*100)}%complete`;
nameEl.textContent=AZ.tasbihZikr;
const offset=CIRC-(CIRC*(Math.min(c,t)/t));
ring.style.strokeDashoffset=offset;
if(c>=t){
btn.style.borderColor='var(--teal)';
btn.style.boxShadow='0 0 40px var(--teal-glow)';
}else{
btn.style.borderColor='var(--gold)';
btn.style.boxShadow='0 0 30px var(--gold-glow)';
}
}
btn.addEventListener('click',e=>{
AZ.tasbihCount++;
DB.set('tasbihCount',AZ.tasbihCount);
addCount(1);
renderTasbih();
ripple(btn,e);
btn.classList.remove('pop');void btn.offsetWidth;btn.classList.add('pop');
if(navigator.vibrate)navigator.vibrate(30);
const ca=q('#clickAudio');if(ca){ca.currentTime=0;ca.play().catch(()=>{});}
checkMilestone(AZ.totalAll);
if(AZ.tasbihCount===AZ.tasbihTarget)
setTimeout(()=>toast(`✅ ${AZ.tasbihTarget}× ${AZ.tasbihZikr}— Alhamdulillah!`),80);
});
resetBtn.addEventListener('click',()=>{
AZ.tasbihCount=0;DB.set('tasbihCount',0);renderTasbih();toast('↺ Tasbih reset');
});
sel.value=AZ.tasbihZikr;
sel.addEventListener('change',()=>{
if(sel.value==='+Custom Zikr'){
customWrap.style.display='block';
customInput.focus();
}else{
customWrap.style.display='none';
AZ.tasbihZikr=sel.value;
AZ.tasbihCount=0;
const found=ZIKRS.find(z=>z.name===sel.value);
if(found)AZ.tasbihTarget=found.target;
DB.set('tasbihZikr',AZ.tasbihZikr);DB.set('tasbihCount',0);
DB.set('tasbihTarget',AZ.tasbihTarget);
renderTasbih();
}
});
if(customInput){
customInput.addEventListener('input',()=>{
if(customInput.value.trim()){
AZ.tasbihZikr=customInput.value.trim();
DB.set('tasbihZikr',AZ.tasbihZikr);
renderTasbih();
}
});
}
const chips=qa('.t-chip');
chips.forEach(ch=>{
if(parseInt(ch.dataset.t)===AZ.tasbihTarget)ch.classList.add('on');
ch.addEventListener('click',()=>{
qa('.t-chip').forEach(x=>x.classList.remove('on'));ch.classList.add('on');
AZ.tasbihTarget=parseInt(ch.dataset.t);AZ.tasbihCount=0;
DB.set('tasbihTarget',AZ.tasbihTarget);DB.set('tasbihCount',0);
renderTasbih();toast(`🎯 Target: ${AZ.tasbihTarget}×`);
});
});
renderTasbih();
}
function initZikrGrid(){
const list=q('#zikrList');if(!list)return;
list.innerHTML='';
ZIKRS.forEach((z,i)=>{
const cnt=AZ.zikrCounts[z.name]||0;
const pct=Math.min(100,Math.round((cnt/z.target)*100));
const card=document.createElement('div');
card.className='zikr-card';card.dataset.z=z.name;
card.innerHTML=`
<div class="zikr-prog-bar"><div class="zikr-prog-fill" style="width:${pct}%"></div></div>
<div class="zikr-top">
<div class="zikr-idx">${i+1}</div>
<div class="zikr-title">${z.name}</div>
<span class="zikr-badge" id="badge_${i}">${cnt}</span>
<span class="zikr-chevron">＋</span>
</div>
<div class="zikr-body">
<div class="zikr-inner">
<div class="zikr-arabic">${z.ar}</div>
<div class="zikr-lang-label ur-label">اردو ترجمہ</div>
<div class="zikr-urdu">${z.ur}</div>
<div class="zikr-lang-label hl-label">💬 Hinglish Matlab</div>
<div class="zikr-hinglish">${z.hinglish}</div>
<div class="zikr-num-row">
<div class="zikr-num-big" id="big_${i}">${cnt}</div>
<div class="zikr-btns">
<button class="btn btn-teal btn-sm zp">＋ Count</button>
<button class="btn btn-ghost btn-sm zm">－</button>
<button class="btn btn-ghost btn-sm zr">↺ Reset</button>
</div>
</div>
</div>
<div style="padding:0 0 4px 8px;font-size:11px;color:var(--text-muted)">Target: ${z.target}×&nbsp;•&nbsp;<span id="pct_${i}">${pct}%</span>done</div>
</div>`;
card.querySelector('.zikr-top').addEventListener('click',()=>{
card.classList.toggle('open');
card.querySelector('.zikr-chevron').textContent=card.classList.contains('open')?'✕':'＋';
});
card.querySelector('.zp').addEventListener('click',e=>{
e.stopPropagation();
AZ.zikrCounts[z.name]=(AZ.zikrCounts[z.name]||0)+1;
DB.set('zikrCounts',AZ.zikrCounts);addCount(1);
if(navigator.vibrate)navigator.vibrate(25);
updateZCard(card,z,i);checkMilestone(AZ.totalAll);
if(AZ.zikrCounts[z.name]===z.target)toast(`✅ ${z.name}— ${z.target}× Complete!`);
});
card.querySelector('.zm').addEventListener('click',e=>{
e.stopPropagation();
if((AZ.zikrCounts[z.name]||0)>0){
AZ.zikrCounts[z.name]--;
AZ.totalAll=Math.max(0,AZ.totalAll-1);
AZ.todayCount=Math.max(0,AZ.todayCount-1);
DB.set('zikrCounts',AZ.zikrCounts);DB.set('totalAll',AZ.totalAll);DB.set('todayCount',AZ.todayCount);
updateStatEls();updateZCard(card,z,i);
}
});
card.querySelector('.zr').addEventListener('click',e=>{
e.stopPropagation();AZ.zikrCounts[z.name]=0;
DB.set('zikrCounts',AZ.zikrCounts);updateZCard(card,z,i);toast(`↺ ${z.name}reset`);
});
list.appendChild(card);
});
}
function updateZCard(card,z,i){
const cnt=AZ.zikrCounts[z.name]||0;
const pct=Math.min(100,Math.round((cnt/z.target)*100));
const b=q('#badge_'+i),big=q('#big_'+i),pctEl=q('#pct_'+i);
if(b)b.textContent=cnt;if(big)big.textContent=cnt;if(pctEl)pctEl.textContent=pct+'%';
const fill=card.querySelector('.zikr-prog-fill');
if(fill)fill.style.width=pct+'%';
}
function initAyah(){
let idx=new Date().getDate()%AYAHS.length;
function render(){
const a=AYAHS[idx];
const ar=q('#ayahAr'),en=q('#ayahEn'),ref=q('#ayahRef');
if(ar)ar.textContent=a.a;
if(en)en.textContent=a.e;
if(ref)ref.textContent=a.r;
}
render();
const next=q('#nextAyah'),prev=q('#prevAyah');
if(next)next.addEventListener('click',()=>{idx=(idx+1)%AYAHS.length;render();});
if(prev)prev.addEventListener('click',()=>{idx=(idx-1+AYAHS.length)%AYAHS.length;render();});
}
function initWeek(){
const g=q('#weekGrid');if(!g)return;
const days=['S','M','T','W','T','F','S'];
g.innerHTML='';
for(let i=6;i>=0;i--){
const d=dateShift(-i),done=(AZ.weekData[d]||0)>0,isToday=d===todayStr();
const dow=new Date(d).getDay();
const cell=document.createElement('div');
cell.className=`wday ${done?'done':''}${isToday?'today':''}`;
cell.innerHTML=`<span>${days[dow]}</span>${done?'<div class="dot"></div>':''}`;
cell.title=`${d}: ${AZ.weekData[d]||0}zikr`;
g.appendChild(cell);
}
const s=q('#streakNum');if(s)s.textContent=AZ.streak;
}
function initNotify(){
const b=q('#notifyBtn');if(!b)return;
b.addEventListener('click',()=>requestNotify(b));
}
document.addEventListener('DOMContentLoaded',()=>{
initTasbih();
initZikrGrid();
initAyah();
initWeek();
initNotify();
loadPrayers(q('#prayerList'),q('#prayerLoc'),q('#prayerCD'));
});