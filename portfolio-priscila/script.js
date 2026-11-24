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

document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
