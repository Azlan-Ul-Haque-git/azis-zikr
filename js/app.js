/* =====================================================
   AZIS ZIKR — app.js  (shared across all pages)
===================================================== */
'use strict';

/* ── STORAGE ─────────────────────────── */
const DB = {
    get(k, d = null) { try { const v = localStorage.getItem('az_' + k); return v !== null ? JSON.parse(v) : d } catch { return d } },
    set(k, v) { try { localStorage.setItem('az_' + k, JSON.stringify(v)) } catch { } },
    all() { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('az_')) o[k.slice(3)] = JSON.parse(localStorage.getItem(k)) } return o }
};

/* ── GLOBAL STATE ────────────────────── */
window.AZ = {
    totalAll: DB.get('totalAll', 0),
    todayCount: DB.get('todayCount', 0),
    streak: DB.get('streak', 0),
    lastDate: DB.get('lastDate', ''),
    weekData: DB.get('weekData', {}),
    zikrCounts: DB.get('zikrCounts', {}),
    tasbihCount: DB.get('tasbihCount', 0),
    tasbihTarget: DB.get('tasbihTarget', 33),
    tasbihZikr: DB.get('tasbihZikr', 'Subhanallah'),
    milestones: DB.get('milestones', []),
    theme: DB.get('theme', 'dark'),
    sound: DB.get('sound', false),
    history: DB.get('history', {}),   // { 'YYYY-MM-DD': totalCount }
};

/* ── DAILY RESET ─────────────────────── */
(function checkDay() {
    const today = todayStr(), yest = dateShift(-1);
    if (AZ.lastDate !== today) {
        if (AZ.todayCount > 0) {
            AZ.history[AZ.lastDate || today] = (AZ.history[AZ.lastDate || today] || 0) + AZ.todayCount;
            DB.set('history', AZ.history);
        }
        if (AZ.lastDate === yest && AZ.todayCount > 0) AZ.streak++;
        else if (AZ.lastDate !== today && AZ.lastDate !== '') AZ.streak = 0;
        AZ.todayCount = 0; AZ.lastDate = today;
        DB.set('todayCount', 0); DB.set('lastDate', today); DB.set('streak', AZ.streak);
    }
})();

/* ── DATE HELPERS ────────────────────── */
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}` }
function dateShift(n) { const d = new Date(); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}` }
function p2(n) { return String(n).padStart(2, '0') }
function fmtNum(n) { return Number(n).toLocaleString() }

/* ── SAVE HELPERS ────────────────────── */
function saveAll() {
    ['totalAll', 'todayCount', 'streak', 'lastDate', 'weekData', 'zikrCounts',
        'tasbihCount', 'tasbihTarget', 'tasbihZikr', 'milestones', 'theme', 'sound', 'history']
        .forEach(k => DB.set(k, AZ[k]));
}
function addCount(n = 1) {
    AZ.totalAll += n; AZ.todayCount += n;
    AZ.weekData[todayStr()] = (AZ.weekData[todayStr()] || 0) + n;
    AZ.history[todayStr()] = (AZ.history[todayStr()] || 0) + n;
    DB.set('totalAll', AZ.totalAll); DB.set('todayCount', AZ.todayCount);
    DB.set('weekData', AZ.weekData); DB.set('history', AZ.history);
    updateStatEls();
}
function updateStatEls() {
    q('#totalCount') && (q('#totalCount').textContent = fmtNum(AZ.totalAll));
    q('#todayCount') && (q('#todayCount').textContent = fmtNum(AZ.todayCount));
    q('#streakCount') && (q('#streakCount').textContent = AZ.streak);
}
function q(s, p = document) { return p.querySelector(s) }
function qa(s, p = document) { return [...p.querySelectorAll(s)] }

/* ── TOAST ───────────────────────────── */
function toast(msg, dur = 2800) {
    const wrap = q('#toastWrap') || createToastWrap();
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 350) }, dur);
}
function createToastWrap() {
    const w = document.createElement('div');
    w.id = 'toastWrap'; w.className = 'toast-wrap';
    document.body.appendChild(w); return w;
}

/* ── MILESTONE ───────────────────────── */
const MILESTONES = [
    { n: 33, e: '🌙', t: 'MashaAllah!', m: '33 praises — the count of each tasbih after prayer.' },
    { n: 99, e: '⭐', t: 'SubhanAllah!', m: '99 — the beautiful names of Allah. Keep going!' },
    { n: 100, e: '💎', t: '100 Complete!', m: 'A hundred remembrances. Alhamdulillah!' },
    { n: 500, e: '🏅', t: '500 Zikr!', m: '500 praises rising to the heavens. Remarkable!' },
    { n: 1000, e: '👑', t: 'Thousand Zikr!', m: '1000 — may every one weigh heavy on your scales.' },
    { n: 5000, e: '🕌', t: '5000 Zikr!', m: 'Extraordinary devotion. SubhanAllahi wa bihamdihi!' },
    { n: 10000, e: '🌟', t: '10,000 Zikr!', m: '10,000! May Allah grant you Jannatul Firdaws.' },
];
function checkMilestone(total) {
    for (const m of MILESTONES) {
        if (total >= m.n && !AZ.milestones.includes(m.n)) {
            AZ.milestones.push(m.n); DB.set('milestones', AZ.milestones);
            showMilestone(m); return;
        }
    }
}
function showMilestone(m) {
    let box = q('#milestoneBox');
    if (!box) {
        box = document.createElement('div'); box.id = 'milestoneBox'; box.className = 'milestone-bg';
        box.innerHTML = `<div class="milestone-box"><div id="mEmoji" class="milestone-emoji"></div><h2 id="mTitle"></h2><p id="mMsg"></p><button class="btn btn-gold" style="margin-top:20px;width:160px" onclick="closeMile()">Continue ➜</button></div>`;
        document.body.appendChild(box);
    }
    q('#mEmoji').textContent = m.e; q('#mTitle').textContent = m.t; q('#mMsg').textContent = m.m;
    box.classList.remove('off');
}
window.closeMile = () => { const b = q('#milestoneBox'); if (b) b.classList.add('off'); };

/* ── RIPPLE ──────────────────────────── */
function ripple(el, e) {
    const r = document.createElement('span'); r.className = 'ripple';
    const rect = el.getBoundingClientRect();
    r.style.left = `${e.clientX - rect.left}px`; r.style.top = `${e.clientY - rect.top}px`;
    el.style.overflow = 'hidden'; el.style.position = 'relative';
    el.appendChild(r); setTimeout(() => r.remove(), 700);
}

/* ── PARTICLES ───────────────────────── */
function initParticles() {
    const c = q('#particles'); if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, pts = [];
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight };
    resize(); window.addEventListener('resize', resize, { passive: true });
    const cols = [[201, 168, 76], [0, 232, 162], [240, 210, 130]];
    for (let i = 0; i < 60; i++) {
        const col = cols[Math.floor(Math.random() * cols.length)];
        pts.push({
            x: Math.random() * 1e4 % 999, y: Math.random() * H, r: Math.random() * 1.6 + .3,
            vx: (Math.random() - .5) * .2, vy: -Math.random() * .35 - .05,
            a: Math.random(), da: (Math.random() - .5) * .007, col
        });
    }
    (function frame() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.a = Math.max(0, Math.min(1, p.a + p.da));
            if (p.a <= 0 || p.a >= 1) p.da *= -1;
            if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W }
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.col},${p.a * .65})`; ctx.fill();
        });
        requestAnimationFrame(frame);
    })();
}

/* ── HEADER: scroll + hamburger + theme ── */
function initHeader() {
    const hdr = q('#siteHeader');
    if (hdr) window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive: true });

    const ham = q('#ham'), nav = q('#navMenu');
    if (ham && nav) {
        ham.addEventListener('click', () => { ham.classList.toggle('active'); nav.classList.toggle('active') });
        document.addEventListener('click', e => { if (!ham.contains(e.target) && !nav.contains(e.target)) { ham.classList.remove('active'); nav.classList.remove('active') } });
        qa('a', nav).forEach(a => a.addEventListener('click', () => { ham.classList.remove('active'); nav.classList.remove('active') }));
    }

    // Set active nav link
    const path = location.pathname.split('/').pop() || 'index.html';
    qa('.nav a').forEach(a => { if (a.getAttribute('href') === path) a.classList.add('active') });

    // Theme
    const thm = q('#themeBtn');
    if (thm) {
        applyTheme(AZ.theme);
        thm.addEventListener('click', () => { AZ.theme = AZ.theme === 'dark' ? 'light' : 'dark'; applyTheme(AZ.theme); DB.set('theme', AZ.theme) });
    }

    // Sound toggle
    const snd = q('#soundBtn'), aud = q('#bgAudio');
    if (snd && aud) {
        snd.textContent = AZ.sound ? '🎵' : '🔇';
        snd.addEventListener('click', () => {
            AZ.sound = !AZ.sound; DB.set('sound', AZ.sound);
            if (AZ.sound) { aud.play().catch(() => { }); snd.textContent = '🎵'; toast('🎵 Nasheed playing') }
            else { aud.pause(); snd.textContent = '🔇'; toast('🔇 Nasheed paused') }
        });
    }
}
function applyTheme(t) {
    document.body.classList.toggle('light', t === 'light');
    const b = q('#themeBtn'); if (b) b.textContent = t === 'dark' ? '🌙' : '☀️';
}

/* ── SPLASH ──────────────────────────── */
function initSplash() {
    const s = q('#splash'); if (!s) return;
    // Remove from DOM completely after 600ms — zero dependency on assets
    setTimeout(() => {
        s.style.cssText = 'opacity:0;visibility:hidden;pointer-events:none;transition:none';
        s.remove();
    }, 600);
}

/* ── NET STATUS ──────────────────────── */
function initNet() {
    const el = q('#netStatus'); if (!el) return;
    const upd = () => el.textContent = navigator.onLine ? '🟢 Online' : '🔴 Offline — all data saved locally';
    window.addEventListener('online', upd); window.addEventListener('offline', upd); upd();
}

/* ── PRAYER TIMES ────────────────────── */
/* ── JABALPUR FIXED COORDINATES ── */
const JBP = { lat: 23.1815, lng: 79.9864, name: 'Jabalpur, Madhya Pradesh' };

async function loadPrayers(listEl, locEl, countdownEl) {
    if (!listEl) return;
    if (locEl) locEl.textContent = `📍 ${JBP.name}`;
    try {
        const d = new Date();
        const url = `https://api.aladhan.com/v1/timings/${p2(d.getDate())}-${p2(d.getMonth() + 1)}-${d.getFullYear()}?latitude=${JBP.lat}&longitude=${JBP.lng}&method=1`;
        const r = await fetch(url); const j = await r.json();
        const t = j.data.timings;
        const ps = [
            { n: 'Fajr', i: '🌅', tm: t.Fajr },
            { n: 'Sunrise', i: '☀️', tm: t.Sunrise },
            { n: 'Dhuhr', i: '🌞', tm: t.Dhuhr },
            { n: 'Asr', i: '🌤', tm: t.Asr },
            { n: 'Maghrib', i: '🌆', tm: t.Maghrib },
            { n: 'Isha', i: '🌙', tm: t.Isha },
        ];
        const now = new Date();
        const nowM = now.getHours() * 60 + now.getMinutes();
        let nxt = -1;
        ps.forEach((p, i) => { const [h, m] = p.tm.split(':').map(Number); if (h * 60 + m > nowM && nxt === -1) nxt = i });
        listEl.innerHTML = ps.map((p, i) => `
      <div class="prayer-row ${i === nxt ? 'nxt' : ''}">
        <span class="prayer-icon">${p.i}</span>
        <span class="prayer-name">${p.n}</span>
        ${i === nxt ? '<span class="nxt-badge">NEXT</span>' : ''}
        <span class="prayer-time">${p.tm}</span>
      </div>`).join('');
        if (countdownEl && nxt >= 0) {
            const [h, m] = ps[nxt].tm.split(':').map(Number);
            const diff = (h * 60 + m) - nowM;
            countdownEl.textContent = `⏱ Next prayer in ${Math.floor(diff / 60)}h ${diff % 60}m`;
        }
    } catch { if (locEl) locEl.textContent = '📍 Jabalpur — Could not load times' }
}

/* ── NOTIFICATIONS ───────────────────── */
async function requestNotify(btn) {
    if (!('Notification' in window)) { toast('⚠️ Not supported'); return }
    const p = await Notification.requestPermission();
    if (p === 'granted') {
        new Notification('📿 Azis Zikr', { body: 'Time for your daily Zikr! فَاذْكُرُونِي أَذْكُرْكُمْ', icon: 'assets/icons/icon-192.png' });
        toast('✅ Daily reminder enabled!');
        if (btn) { btn.textContent = '✅ Reminder Active'; btn.disabled = true }
    } else toast('❌ Permission denied');
}

/* ── PWA INSTALL ─────────────────────── */
let _prompt = null;
window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); _prompt = e;
    const b = q('#installBtn'); if (b) b.style.display = 'flex';
});
function initInstall() {
    const b = q('#installBtn'); if (!b) return;
    b.addEventListener('click', async () => {
        if (!_prompt) { toast('📲 Already installed!'); return }
        _prompt.prompt();
        const { outcome } = await _prompt.userChoice;
        if (outcome === 'accepted') { toast('🎉 App installed!'); b.style.display = 'none' }
        _prompt = null;
    });
}

/* ── AYAH DATA ───────────────────────── */
const AYAHS = [
    { a: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', e: '"For indeed, with hardship will be ease."', r: 'Al-Inshirah 94:5' },
    { a: 'فَاذْكُرُونِي أَذْكُرْكُمْ', e: '"So remember Me; I will remember you."', r: 'Al-Baqarah 2:152' },
    { a: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', e: '"Indeed, Allah is with the patient."', r: 'Al-Baqarah 2:153' },
    { a: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', e: '"And the remembrance of Allah is greater."', r: 'Al-Ankabut 29:45' },
    { a: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', e: '"Whoever fears Allah — He will make for him a way out."', r: 'At-Talaq 65:2' },
    { a: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', e: '"Indeed, with hardship comes ease."', r: 'Al-Inshirah 94:6' },
    { a: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ', e: '"Perhaps you hate a thing and it is good for you."', r: 'Al-Baqarah 2:216' },
    { a: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', e: '"Allah is sufficient for us, and He is the best Disposer of affairs."', r: 'Al-Imran 3:173' },
    { a: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', e: '"And He is with you wherever you are."', r: 'Al-Hadid 57:4' },
    { a: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', e: '"Allah is the Light of the heavens and the earth."', r: 'An-Nur 24:35' },
];

/* ── INIT ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initSplash(); initParticles(); initHeader(); initNet(); initInstall(); updateStatEls();
});