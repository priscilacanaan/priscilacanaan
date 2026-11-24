const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 30);
  bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight));
}, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => {
  const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms';
  io.observe(el);
});

const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) document.querySelectorAll('.links a').forEach(a => a.classList.toggle('active', a.dataset.s === e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['dbt', 'modulos', 'curso', 'duvidas', 'inscricao'].forEach(id => { const el = document.getElementById(id); if (el) secIO.observe(el); });

/* logo tilt follows mouse */
const lc = document.querySelector('.logo-card');
if (lc && !reduce) document.querySelector('.hero-logo').addEventListener('mousemove', e => {
  const r = lc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  lc.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
});
if (lc) document.querySelector('.hero-logo').addEventListener('mouseleave', () => lc.style.transform = '');

document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
