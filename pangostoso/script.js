const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav gets solid on scroll */
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const sib = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
  e.target.style.transitionDelay = (sib.indexOf(e.target) % 6) * 80 + 'ms';
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* counters */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* oven temperature flicker */
const temp = document.querySelector('[data-temp]');
if (temp && !reduce) setInterval(() => { temp.textContent = 178 + Math.round(Math.random() * 6); }, 900);

/* product filters */
const fs = [...document.querySelectorAll('.f')], ps = [...document.querySelectorAll('.p')];
fs.forEach(b => b.addEventListener('click', () => {
  fs.forEach(x => x.classList.toggle('is-on', x === b));
  const f = b.dataset.f;
  ps.forEach(p => {
    const ok = f === 'todos' || p.dataset.cat.split(' ').includes(f);
    p.classList.toggle('hide', !ok);
    p.classList.remove('show'); if (ok) { void p.offsetWidth; p.classList.add('show', 'in'); }
  });
}));

/* process line fills on scroll */
const tl = document.querySelector('.timeline');
function fillLine() {
  const r = tl.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * .9 - r.top) / (r.height + innerHeight * .3), 0), 1);
  tl.style.setProperty('--p', reduce ? 1 : p);
}
addEventListener('scroll', () => requestAnimationFrame(fillLine), { passive: true }); fillLine();
