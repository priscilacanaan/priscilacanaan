const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let LANG = 'en';
const T = (en) => (LANG !== 'en' && window.I18N && I18N[LANG] && I18N[LANG][en]) || en;

/* reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const sib = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
  e.target.style.transitionDelay = (sib.indexOf(e.target) % 5) * 90 + 'ms';
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* who-we-help tabs */
const tabs = [...document.querySelectorAll('.tab')], panels = [...document.querySelectorAll('.panel')];
tabs.forEach((t, i) => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.toggle('is-on', x === t));
  panels.forEach((p, j) => p.classList.toggle('is-on', j === i));
}));

/* steps line draws on scroll */
const path = document.querySelector('.steps-line path');
if (path) {
  const len = path.getTotalLength(); path.style.strokeDasharray = `${len}`;
  const steps = document.querySelector('.steps');
  const draw = () => {
    const r = steps.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight - r.top) / (innerHeight * .8), 0), 1);
    path.style.strokeDashoffset = reduce ? 0 : len * (1 - p);
  };
  addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true }); draw();
}

/* hero paper parallax with mouse */
const stack = document.querySelector('.hero-stack');
if (stack && !reduce) addEventListener('mousemove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  stack.style.transform = `translate(${x * -18}px, ${y * -14}px)`;
});

/* tax & filing deadlines (federal + Florida). Dates can shift when they fall on a weekend or holiday. */
const DEADLINES = [
  [0, 15, 'Q4 estimated tax payment'],
  [0, 31, 'W-2 and 1099-NEC forms due'],
  [2, 15, 'Partnership & S-corp tax returns'],
  [3, 15, 'Personal tax returns + Q1 estimated tax'],
  [4, 1, 'Florida annual report (Sunbiz)'],
  [5, 15, 'Q2 estimated tax payment'],
  [8, 15, 'Q3 estimated tax payment'],
  [9, 15, 'Extended personal tax returns'],
];
function nextDeadline() {
  const now = new Date();
  for (const yAdd of [0, 1]) for (const [m, d, name] of DEADLINES) {
    const dt = new Date(now.getFullYear() + yAdd, m, d, 23, 59);
    if (dt > now) return { dt, name };
  }
}
function tickDeadline() {
  const n = nextDeadline(); if (!n) return;
  const ms = n.dt - new Date();
  document.getElementById('dl-name').textContent = T(n.name);
  document.getElementById('dl-d').textContent = Math.floor(ms / 864e5);
  document.getElementById('dl-h').textContent = Math.floor(ms / 36e5) % 24;
  document.getElementById('dl-m').textContent = Math.floor(ms / 6e4) % 60;
  const loc = { en: 'en-US', es: 'es-US', pt: 'pt-BR' }[LANG];
  document.getElementById('dl-date').textContent = n.dt.toLocaleDateString(loc, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
tickDeadline(); setInterval(tickDeadline, 30000);

/* open now? (office time = Miami) */
function openNow() {
  const el = document.getElementById('open-now'); if (!el) return;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  const day = get('weekday'), h = +get('hour') % 24 + (+get('minute')) / 60;
  const open = (['Mon','Tue','Wed','Thu','Fri'].includes(day) && h >= 9 && h < 18) || (day === 'Sat' && h >= 10 && h < 14);
  el.textContent = T(open ? 'Open now — walk in' : 'Closed now — message us on WhatsApp');
  el.style.setProperty('--c', open ? '#4ade80' : '#E8B44A');
}
openNow(); setInterval(openNow, 60000);

/* ---------- languages: EN / ES / PT ---------- */
const original = new Map();
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
  acceptNode: n => n.parentElement.closest('script,style,#dl-name,#dl-date,#open-now') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
});
while (walker.nextNode()) { const n = walker.currentNode; if (n.nodeValue.trim()) original.set(n, n.nodeValue); }
const attrEls = [...document.querySelectorAll('[placeholder],[aria-label],[title]')].map(el => ({
  el, attrs: ['placeholder', 'aria-label', 'title'].filter(a => el.hasAttribute(a)).map(a => [a, el.getAttribute(a)])
}));
const TITLE_EN = document.title;

function applyLang(lang) {
  LANG = lang;
  original.forEach((en, n) => { const k = en.trim(); n.nodeValue = lang === 'en' ? en : en.replace(k, T(k)); });
  attrEls.forEach(({ el, attrs }) => attrs.forEach(([a, en]) => el.setAttribute(a, T(en))));
  document.title = T(TITLE_EN);
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === lang));
  tickDeadline(); openNow();
  try { localStorage.setItem('bb-lang', lang); } catch (e) {}
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
  if (reduce) return applyLang(b.dataset.lang);
  document.body.classList.remove('switching'); void document.body.offsetWidth;
  document.body.classList.add('switching'); setTimeout(() => applyLang(b.dataset.lang), 180);
}));
let saved = null; try { saved = localStorage.getItem('bb-lang'); } catch (e) {}
const nav = (navigator.language || '').slice(0, 2);
const start = new URLSearchParams(location.search).get('lang') || saved || (['es', 'pt'].includes(nav) ? nav : 'en');
if (start !== 'en') applyLang(start);
