const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 30);
  bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight));
}, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => {
  const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms';
  io.observe(el);
});

const rw = [...document.querySelectorAll('.rot b')]; let ri = 0;
if (!reduce) setInterval(() => { const c = rw[ri]; c.classList.remove('on'); c.classList.add('out'); setTimeout(() => c.classList.remove('out'), 400); ri = (ri + 1) % rw.length; rw[ri].classList.add('on'); }, 2600);

const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

const fs = [...document.querySelectorAll('.f')], cards = [...document.querySelectorAll('.card')];
fs.forEach(b => b.addEventListener('click', () => {
  fs.forEach(x => x.classList.toggle('is-on', x === b));
  const f = b.dataset.f;
  cards.forEach(c => { const ok = f === 'todos' || c.dataset.cat === f; c.classList.toggle('hide', !ok); c.classList.remove('show'); if (ok) { void c.offsetWidth; c.classList.add('show'); } });
}));

const secIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) document.querySelectorAll('.links a').forEach(a => a.classList.toggle('active', a.dataset.s === e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
['servicos', 'portfolio', 'sobre', 'contato'].forEach(id => { const el = document.getElementById(id); if (el) secIO.observe(el); });

const glow = document.querySelector('.glow');
if (!reduce) addEventListener('mousemove', e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
document.querySelectorAll('.svc').forEach(s => s.addEventListener('mousemove', e => { const r = s.getBoundingClientRect(); s.style.setProperty('--mx', (e.clientX - r.left) + 'px'); s.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, v = s => (f.querySelector(s).value || '').trim();
  const sel = f.querySelector('select'), servico = sel.value ? sel.options[sel.selectedIndex].text : '';
  const msg = ['Olá, Priscila! Vim pelo seu portfólio.', '', `*Nome:* ${v('input[type=text]')}`, `*E-mail:* ${v('input[type=email]')}`,
    servico && `*Preciso de:* ${servico}`, v('textarea') && `*Projeto:* ${v('textarea')}`].filter(Boolean).join('\n');
  window.open('https://wa.me/5591981440648?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  f.classList.add('sent');
});

/* ---------- idioma: PT (fonte), EN, ES ---------- */
const srcTxt = new Map();
document.querySelectorAll('[data-i]').forEach(el => srcTxt.set(el, el.innerHTML));
document.querySelectorAll('[data-ph]').forEach(el => srcTxt.set(el, el.placeholder));
function setLang(l) {
  const d = (window.I18N && I18N[l]) || {};
  document.querySelectorAll('[data-i]').forEach(el => { const k = el.dataset.i; el.innerHTML = (l === 'pt' || !d[k]) ? srcTxt.get(el) : d[k]; });
  document.querySelectorAll('[data-ph]').forEach(el => { const k = el.dataset.ph; el.placeholder = (l === 'pt' || !d[k]) ? srcTxt.get(el) : d[k]; });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === l));
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;
  document.title = l === 'pt' ? 'Priscila Canaan — Automações com IA, websites e mídia' : l === 'en' ? 'Priscila Canaan — AI automation, websites and media' : 'Priscila Canaan — Automatización con IA, sitios web y medios';
  try { localStorage.setItem('pc-lang', l); } catch (e) {}
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
let savedL = null; try { savedL = localStorage.getItem('pc-lang'); } catch (e) {}
const navL = (navigator.language || 'pt').slice(0, 2);
setLang(new URLSearchParams(location.search).get('lang') || savedL || (['en', 'es'].includes(navL) ? navL : 'pt'));
