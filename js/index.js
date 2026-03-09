/* ── INDEX PAGE JS ── */
'use strict';

const ZIKRS = [
    { name: 'Alhamdulillah', target: 33 },
    { name: 'Astagfirullah', target: 100 },
    { name: 'Allahu Akbar', target: 33 },
    { name: 'Subhanallah', target: 33 },
    { name: 'Darood Shareef', target: 100 },
    { name: 'Kalma Shareef', target: 100 },
    { name: 'Ayatal Kursi', target: 3 },
    { name: 'Surah Al-Asr', target: 3 },
    { name: 'Surah Ad-Duha', target: 3 },
    { name: 'Surah Al-Kafiroon', target: 3 },
    { name: 'Surah Al-Falaq', target: 7 },
    { name: 'Surah An-Naas', target: 7 },
    { name: 'Surah Al-Ikhlaas', target: 3 },
    { name: 'Surah Al-Kawthar', target: 3 },
    { name: 'Surah Ar-Rahman', target: 1 },
    { name: 'Surah Muzammil', target: 1 },
    { name: 'Surah Yaaseen', target: 1 },
    { name: 'Astagfar', target: 100 },
];

/* ── TASBIH ── */
function initTasbih() {
    const btn = q('#tasbihBtn'), num = q('#tasbihNum'), prog = q('#tasbihProg');
    const nameEl = q('#tasbihName'), ring = q('#ringFill'), sel = q('#tasbihSel');
    const resetBtn = q('#tasbihReset');
    const CIRC = 2 * Math.PI * 80; // 502.65

    function renderTasbih() {
        const c = AZ.tasbihCount, t = AZ.tasbihTarget;
        num.textContent = c;
        prog.textContent = `${c} / ${t} — ${Math.round((c / t) * 100)}% complete`;
        nameEl.textContent = AZ.tasbihZikr;
        const offset = CIRC - (CIRC * (Math.min(c, t) / t));
        ring.style.strokeDashoffset = offset;
        // Colour milestone
        if (c >= t) { btn.style.borderColor = 'var(--teal)'; btn.style.boxShadow = '0 0 40px var(--teal-glow)' }
        else { btn.style.borderColor = 'var(--gold)'; btn.style.boxShadow = '0 0 30px var(--gold-glow)' }
    }

    btn.addEventListener('click', e => {
        AZ.tasbihCount++; DB.set('tasbihCount', AZ.tasbihCount);
        addCount(1); renderTasbih();
        ripple(btn, e);
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
        // play click
        const ca = q('#clickAudio'); if (ca) { ca.currentTime = 0; ca.play().catch(() => { }) }
        checkMilestone(AZ.totalAll);
        if (AZ.tasbihCount === AZ.tasbihTarget) setTimeout(() => toast(`✅ ${AZ.tasbihTarget}× ${AZ.tasbihZikr} — Alhamdulillah!`), 80);
    });

    resetBtn.addEventListener('click', () => { AZ.tasbihCount = 0; DB.set('tasbihCount', 0); renderTasbih(); toast('↺ Tasbih reset') });

    sel.value = AZ.tasbihZikr;
    sel.addEventListener('change', () => { AZ.tasbihZikr = sel.value; AZ.tasbihCount = 0; DB.set('tasbihZikr', AZ.tasbihZikr); DB.set('tasbihCount', 0); renderTasbih() });

    qa('.t-chip', q('#targetChips')).forEach(ch => {
        if (parseInt(ch.dataset.t) === AZ.tasbihTarget) ch.classList.add('on');
        ch.addEventListener('click', () => {
            qa('.t-chip').forEach(x => x.classList.remove('on')); ch.classList.add('on');
            AZ.tasbihTarget = parseInt(ch.dataset.t); AZ.tasbihCount = 0;
            DB.set('tasbihTarget', AZ.tasbihTarget); DB.set('tasbihCount', 0);
            renderTasbih(); toast(`🎯 Target set to ${AZ.tasbihTarget}`);
        });
    });

    renderTasbih();
}

/* ── ZIKR GRID ── */
function initZikrGrid() {
    const list = q('#zikrList'); if (!list) return;
    list.innerHTML = '';
    ZIKRS.forEach((z, i) => {
        const cnt = AZ.zikrCounts[z.name] || 0;
        const pct = Math.min(100, Math.round((cnt / z.target) * 100));
        const card = document.createElement('div');
        card.className = 'zikr-card'; card.dataset.z = z.name;
        card.innerHTML = `
      <div class="zikr-prog-bar"><div class="zikr-prog-fill" style="width:${pct}%"></div></div>
      <div class="zikr-top">
        <div class="zikr-idx">${i + 1}</div>
        <div class="zikr-title">${z.name}</div>
        <span class="zikr-badge" id="badge_${i}">${cnt}</span>
        <span class="zikr-chevron">＋</span>
      </div>
      <div class="zikr-body">
        <div class="zikr-inner">
          <div class="zikr-num-big" id="big_${i}">${cnt}</div>
          <div class="zikr-btns">
            <button class="btn btn-teal btn-sm zp">＋ Count</button>
            <button class="btn btn-ghost btn-sm zm">－</button>
            <button class="btn btn-ghost btn-sm zr">↺ Reset</button>
          </div>
        </div>
        <div style="padding:0 0 4px 52px;font-size:11px;color:var(--text-muted)">Target: ${z.target}×  •  <span id="pct_${i}">${pct}%</span> done</div>
      </div>`;
        card.querySelector('.zikr-top').addEventListener('click', () => card.classList.toggle('open'));
        card.querySelector('.zp').addEventListener('click', e => {
            e.stopPropagation();
            AZ.zikrCounts[z.name] = (AZ.zikrCounts[z.name] || 0) + 1;
            DB.set('zikrCounts', AZ.zikrCounts); addCount(1);
            updateZCard(card, z, i); checkMilestone(AZ.totalAll);
            if (AZ.zikrCounts[z.name] === z.target) toast(`✅ ${z.name} — ${z.target}× Complete!`);
        });
        card.querySelector('.zm').addEventListener('click', e => {
            e.stopPropagation();
            if ((AZ.zikrCounts[z.name] || 0) > 0) {
                AZ.zikrCounts[z.name]--; AZ.totalAll = Math.max(0, AZ.totalAll - 1);
                AZ.todayCount = Math.max(0, AZ.todayCount - 1);
                DB.set('zikrCounts', AZ.zikrCounts); DB.set('totalAll', AZ.totalAll); DB.set('todayCount', AZ.todayCount);
                updateStatEls(); updateZCard(card, z, i);
            }
        });
        card.querySelector('.zr').addEventListener('click', e => {
            e.stopPropagation(); AZ.zikrCounts[z.name] = 0;
            DB.set('zikrCounts', AZ.zikrCounts); updateZCard(card, z, i); toast(`↺ ${z.name} reset`);
        });
        list.appendChild(card);
    });
}

function updateZCard(card, z, i) {
    const cnt = AZ.zikrCounts[z.name] || 0;
    const pct = Math.min(100, Math.round((cnt / z.target) * 100));
    q('#badge_' + i).textContent = cnt; q('#big_' + i).textContent = cnt; q('#pct_' + i).textContent = pct + '%';
    card.querySelector('.zikr-prog-fill').style.width = pct + '%';
}

/* ── AYAH ── */
function initAyah() {
    let idx = new Date().getDate() % AYAHS.length;
    function render() {
        const a = AYAHS[idx];
        q('#ayahAr').textContent = a.a; q('#ayahEn').textContent = a.e; q('#ayahRef').textContent = a.r;
    }
    render();
    q('#nextAyah').addEventListener('click', () => { idx = (idx + 1) % AYAHS.length; render() });
    q('#prevAyah').addEventListener('click', () => { idx = (idx - 1 + AYAHS.length) % AYAHS.length; render() });
}

/* ── STREAK WEEK ── */
function initWeek() {
    const g = q('#weekGrid'); if (!g) return;
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    g.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
        const d = dateShift(-i), done = (AZ.weekData[d] || 0) > 0, today = d === todayStr();
        const dow = new Date(d).getDay();
        const cell = document.createElement('div');
        cell.className = `wday ${done ? 'done' : ''} ${today ? 'today' : ''}`;
        cell.innerHTML = `<span>${days[dow]}</span>${done ? '<div class="dot"></div>' : ''}`;
        cell.title = `${d}: ${AZ.weekData[d] || 0} zikr`;
        g.appendChild(cell);
    }
    const s = q('#streakNum'); if (s) s.textContent = AZ.streak;
}

/* ── NOTIFY ── */
function initNotify() {
    const b = q('#notifyBtn'); if (!b) return;
    b.addEventListener('click', () => requestNotify(b));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
    initTasbih(); initZikrGrid(); initAyah(); initWeek(); initNotify();
    loadPrayers(q('#prayerList'), q('#prayerLoc'), q('#prayerCD'));
});