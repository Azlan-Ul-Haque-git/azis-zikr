'use strict';
const DB = {
  get(k, d = null) { try { const v = localStorage.getItem('az_' + k); return v !== null ? JSON.parse(v) : d } catch { return d } },
  set(k, v) { try { localStorage.setItem('az_' + k, JSON.stringify(v)) } catch { } }
};
window.AZ = {
  totalAll: DB.get('totalAll', 0), todayCount: DB.get('todayCount', 0),
  streak: DB.get('streak', 0), lastDate: DB.get('lastDate', ''),
  weekData: DB.get('weekData', {}), zikrCounts: DB.get('zikrCounts', {}),
  tasbihCount: DB.get('tasbihCount', 0), tasbihTarget: DB.get('tasbihTarget', 33),
  tasbihZikr: DB.get('tasbihZikr', 'Subhanallah'), milestones: DB.get('milestones', []),
  theme: DB.get('theme', 'dark'), sound: DB.get('sound', false), history: DB.get('history', {})
};
(function () {
  const today = todayStr(), yest = dateShift(-1);
  if (AZ.lastDate !== today) {
    if (AZ.todayCount > 0) { AZ.history[AZ.lastDate || today] = (AZ.history[AZ.lastDate || today] || 0) + AZ.todayCount; DB.set('history', AZ.history); }
    if (AZ.lastDate === yest && AZ.todayCount > 0) AZ.streak++;
    else if (AZ.lastDate !== today && AZ.lastDate !== '') AZ.streak = 0;
    AZ.todayCount = 0; AZ.lastDate = today;
    DB.set('todayCount', 0); DB.set('lastDate', today); DB.set('streak', AZ.streak);
  }
})();
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) }
function dateShift(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) }
function p2(n) { return String(n).padStart(2, '0') }
function fmtNum(n) { return Number(n).toLocaleString() }
function q(s, p = document) { return p.querySelector(s) }
function qa(s, p = document) { return [...p.querySelectorAll(s)] }
function saveAll() { ['totalAll', 'todayCount', 'streak', 'lastDate', 'weekData', 'zikrCounts', 'tasbihCount', 'tasbihTarget', 'tasbihZikr', 'milestones', 'theme', 'sound', 'history'].forEach(k => DB.set(k, AZ[k])) }
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
function toast(msg, dur = 2800) {
  let wrap = q('#toastWrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.id = 'toastWrap'; wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; wrap.appendChild(el);
  setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 350) }, dur);
}
const MILESTONES = [
  { n: 33, e: '🌙', t: 'MashaAllah!', m: '33 praises — tasbih after prayer.' },
  { n: 99, e: '⭐', t: 'SubhanAllah!', m: '99 — the beautiful names of Allah!' },
  { n: 100, e: '💎', t: '100 Complete!', m: 'A hundred remembrances. Alhamdulillah!' },
  { n: 500, e: '🏅', t: '500 Zikr!', m: '500 praises rising to the heavens!' },
  { n: 1000, e: '👑', t: '1000 Zikr!', m: 'May every one weigh heavy on your scales.' },
  { n: 5000, e: '🕌', t: '5000 Zikr!', m: 'SubhanAllahi wa bihamdihi!' },
  { n: 10000, e: '🌟', t: '10,000 Zikr!', m: 'May Allah grant you Jannatul Firdaws.' },
];
function checkMilestone(total) {
  for (const m of MILESTONES) {
    if (total >= m.n && !AZ.milestones.includes(m.n)) {
      AZ.milestones.push(m.n); DB.set('milestones', AZ.milestones); showMilestone(m); return;
    }
  }
}
function showMilestone(m) {
  let box = q('#milestoneBox');
  if (!box) {
    box = document.createElement('div'); box.id = 'milestoneBox'; box.className = 'milestone-bg';
    box.innerHTML = '<div class="milestone-box"><div id="mEmoji" class="milestone-emoji"></div><h2 id="mTitle"></h2><p id="mMsg"></p><button class="btn btn-gold" style="margin-top:20px;width:160px" onclick="closeMile()">Continue ➜</button></div>';
    document.body.appendChild(box);
  }
  q('#mEmoji').textContent = m.e; q('#mTitle').textContent = m.t; q('#mMsg').textContent = m.m;
  box.classList.remove('off');
}
window.closeMile = () => { const b = q('#milestoneBox'); if (b) b.classList.add('off') };
function ripple(el, e) {
  const r = document.createElement('span'); r.className = 'ripple';
  const rect = el.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px'; r.style.top = (e.clientY - rect.top) + 'px';
  el.style.overflow = 'hidden'; el.style.position = 'relative';
  el.appendChild(r); setTimeout(() => r.remove(), 700);
}
function initParticles() {
  const c = q('#particles'); if (!c) return;
  const ctx = c.getContext('2d'); let W, H, pts = [];
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight };
  resize(); window.addEventListener('resize', resize, { passive: true });
  const cols = [[201, 168, 76], [0, 232, 162], [240, 210, 130]];
  for (let i = 0; i < 60; i++) {
    const col = cols[i % 3];
    pts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.6 + .3, vx: (Math.random() - .5) * .2, vy: -Math.random() * .35 - .05, a: Math.random(), da: (Math.random() - .5) * .007, col });
  }
  (function frame() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a = Math.max(0, Math.min(1, p.a + p.da));
      if (p.a <= 0 || p.a >= 1) p.da *= -1;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W }
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.col + ',' + p.a * .65 + ')'; ctx.fill();
    });
    requestAnimationFrame(frame);
  })();
}
function applyTheme(t) {
  document.body.classList.toggle('light', t === 'light');
  const b = q('#themeBtn'); if (b) b.textContent = t === 'dark' ? '🌙' : '☀️';
}
function initHeader() {
  const hdr = q('#siteHeader');
  if (hdr) window.addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 30), { passive: true });
  const ham = q('#ham'), nav = q('#navMenu');
  const ov = document.createElement('div');
  ov.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9998';
  document.body.appendChild(ov);
  const open = () => { ham.classList.add('active'); nav.classList.add('active'); ov.style.display = 'block'; document.body.style.overflow = 'hidden' };
  const close = () => { ham.classList.remove('active'); nav.classList.remove('active'); ov.style.display = 'none'; document.body.style.overflow = '' };
  if (ham && nav) {
    ham.addEventListener('click', e => { e.stopPropagation(); nav.classList.contains('active') ? close() : open() });
    ov.addEventListener('click', close);
    qa('a', nav).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close() });
  }
  const path = location.pathname.split('/').pop() || 'index.html';
  qa('.nav a').forEach(a => { if (a.getAttribute('href') === path) a.classList.add('active') });
  const thm = q('#themeBtn');
  if (thm) { applyTheme(AZ.theme); thm.addEventListener('click', () => { AZ.theme = AZ.theme === 'dark' ? 'light' : 'dark'; applyTheme(AZ.theme); DB.set('theme', AZ.theme) }); }
  const snd = q('#soundBtn'), aud = q('#bgAudio');
  if (snd && aud) {
    snd.textContent = AZ.sound ? '🎵' : '🔇';
    snd.addEventListener('click', () => {
      AZ.sound = !AZ.sound; DB.set('sound', AZ.sound);
      if (AZ.sound) { aud.play().catch(() => { }); snd.textContent = '🎵'; toast('🎵 Nasheed playing'); }
      else { aud.pause(); snd.textContent = '🔇'; toast('🔇 Nasheed paused'); }
    });
  }
}
function initSplash() {
  const s = q('#splash'); if (!s) return;
  const kill = () => { s.style.opacity = '0'; s.style.pointerEvents = 'none'; setTimeout(() => s.remove(), 450) };
  setTimeout(kill, 700);
  document.addEventListener('DOMContentLoaded', () => setTimeout(kill, 100));
}
function initNet() {
  const el = q('#netStatus'); if (!el) return;
  const upd = () => el.textContent = navigator.onLine ? '🟢 Online' : '🔴 Offline';
  window.addEventListener('online', upd); window.addEventListener('offline', upd); upd();
}
const JBP = { lat: 23.1815, lng: 79.9864, name: 'Jabalpur, MP' };
async function loadPrayers(listEl, locEl, countdownEl) {
  if (!listEl) return;
  if (locEl) locEl.textContent = '📍 ' + JBP.name;
  try {
    const d = new Date();
    const url = 'https://api.aladhan.com/v1/timings/' + p2(d.getDate()) + '-' + p2(d.getMonth() + 1) + '-' + d.getFullYear() + '?latitude=' + JBP.lat + '&longitude=' + JBP.lng + '&method=1&_=' + Date.now();
    const j = await fetch(url).then(r => r.json());
    const t = j.data.timings;
    const ps = [{ n: 'Fajr', i: '🌅', tm: t.Fajr }, { n: 'Sunrise', i: '☀️', tm: t.Sunrise }, { n: 'Dhuhr', i: '🌞', tm: t.Dhuhr }, { n: 'Asr', i: '🌤', tm: t.Asr }, { n: 'Maghrib', i: '🌆', tm: t.Maghrib }, { n: 'Isha', i: '🌙', tm: t.Isha }];
    const nowM = new Date().getHours() * 60 + new Date().getMinutes();
    let nxt = -1;
    ps.forEach((p, i) => { const [h, m] = p.tm.split(':').map(Number); if (h * 60 + m > nowM && nxt === -1) nxt = i });
    listEl.innerHTML = ps.map((p, i) => '<div class="prayer-row ' + (i === nxt ? 'nxt' : '') + '"><span class="prayer-icon">' + p.i + '</span><span class="prayer-name">' + p.n + '</span>' + (i === nxt ? '<span class="nxt-badge">NEXT</span>' : '') + '<span class="prayer-time">' + p.tm + '</span></div>').join('');
    if (countdownEl && nxt >= 0) { const [h, m] = ps[nxt].tm.split(':').map(Number); const diff = (h * 60 + m) - nowM; countdownEl.textContent = '⏱ Next in ' + Math.floor(diff / 60) + 'h ' + diff % 60 + 'm'; }
  } catch { if (locEl) locEl.textContent = '📍 Jabalpur — offline'; }
}
async function requestNotify(btn) {
  if (!('Notification' in window)) { toast('⚠️ Not supported'); return }
  const p = await Notification.requestPermission();
  if (p === 'granted') {
    new Notification('📿 Azis Zikr', { body: 'Time for your daily Zikr!', icon: 'assets/icons/icon-192.png' });
    toast('✅ Reminder enabled!'); if (btn) { btn.textContent = '✅ Active'; btn.disabled = true; }
  } else toast('❌ Permission denied');
}
let _prompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); _prompt = e; const b = q('#installBtn'); if (b) b.style.display = 'flex' });
function initInstall() {
  const b = q('#installBtn'); if (!b) return;
  b.addEventListener('click', async () => {
    if (!_prompt) { toast('📲 Already installed!'); return }
    _prompt.prompt(); const { outcome } = await _prompt.userChoice;
    if (outcome === 'accepted') { toast('🎉 App installed!'); b.style.display = 'none'; } _prompt = null;
  });
}
const AYAHS = [
  { a: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', e: '"With hardship comes ease."', r: 'Al-Inshirah 94:5' },
  { a: 'فَاذْكُرُونِي أَذْكُرْكُمْ', e: '"Remember Me; I will remember you."', r: 'Al-Baqarah 2:152' },
  { a: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', e: '"Allah is with the patient."', r: 'Al-Baqarah 2:153' },
  { a: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ', e: '"Remembrance of Allah is greatest."', r: 'Al-Ankabut 29:45' },
  { a: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', e: '"Whoever fears Allah, He makes a way out."', r: 'At-Talaq 65:2' },
  { a: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', e: '"Allah is sufficient for us."', r: 'Al-Imran 3:173' },
  { a: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', e: '"He is with you wherever you are."', r: 'Al-Hadid 57:4' },
  { a: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', e: '"Allah is the Light of the heavens."', r: 'An-Nur 24:35' },
];
function initBottomNav() {
  const nav = document.createElement('nav'); nav.className = 'bottom-nav';
  const page = location.pathname.split('/').pop() || 'index.html';
  const items = [
    { href: 'index.html', icon: '📿', lbl: 'Zikr' }, { href: 'prayer.html', icon: '🕌', lbl: 'Prayer' },
    { href: 'duas.html', icon: '🤲', lbl: 'Duas' }, { href: 'asmaul.html', icon: '✨', lbl: 'Names' },
    { href: 'ramadan.html', icon: '🌙', lbl: 'Ramadan' }, { href: 'calendar.html', icon: '📅', lbl: 'Calendar' },
    { href: 'reminders.html', icon: '🔔', lbl: 'Remind' }, { href: 'stats.html', icon: '📊', lbl: 'Stats' },
  ];
  nav.innerHTML = '<div class="bottom-nav-inner">' + items.map(it => '<a href="' + it.href + '" class="bn-item ' + (page === it.href ? 'active' : '') + '"><span class="bn-icon">' + it.icon + '</span><span class="bn-lbl">' + it.lbl + '</span></a>').join('') + '</div>';
  document.body.appendChild(nav);
}
function initOnboarding() {
  if (DB.get('onboarded', false)) return;
  if ((location.pathname.split('/').pop() || 'index.html') !== 'index.html') return;
  const box = document.createElement('div'); box.id = 'onboard';
  box.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(12px);z-index:9998;display:flex;align-items:center;justify-content:center;padding:20px';
  box.innerHTML = '<div class="onboard-box"><div style="font-size:52px;margin-bottom:12px">🕌</div><h2 style="font-family:\'Cinzel\',serif;color:var(--gold);font-size:20px;margin-bottom:6px">Azis Zikr</h2><p style="font-family:\'Amiri\',serif;font-size:18px;color:var(--gold-lt);margin-bottom:4px">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p><p style="color:var(--text-muted);font-size:13px;margin-bottom:20px;line-height:1.7">Your peaceful companion for daily Zikr, Quran, Prayer Times & Duas.</p><input id="obName" type="text" placeholder="Your name (optional)" style="width:100%;padding:11px 16px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:14px;outline:none;text-align:center;margin-bottom:10px;font-family:Poppins,sans-serif"><button class="btn btn-gold" id="obStart" style="width:100%;padding:13px">Bismillah — Let\'s Begin 🤍</button><p style="font-size:10px;color:var(--text-dim);margin-top:12px">No account • No ads • No tracking</p></div>';
  document.body.appendChild(box);
  box.querySelector('#obStart').addEventListener('click', () => {
    const name = box.querySelector('#obName').value.trim();
    toast(name ? '🤍 Welcome, ' + name + '!' : '🤍 Welcome to Azis Zikr!');
    DB.set('onboarded', true); if (name) DB.set('userName', name);
    box.style.opacity = '0'; box.style.transition = 'opacity .4s';
    setTimeout(() => box.remove(), 400);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.paddingBottom = '80px';
  initSplash(); initParticles(); initHeader(); initNet(); initInstall();
  updateStatEls(); initBottomNav(); initOnboarding();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.update();
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) nw.postMessage({ type: 'SKIP_WAITING' }); });
      });
    }).catch(() => { });
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { refreshing = true; location.reload(); } });
  }
});