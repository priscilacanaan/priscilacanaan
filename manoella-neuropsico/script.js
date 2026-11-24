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

/* domain tabs */
const doms = [...document.querySelectorAll('.dom')], pans = [...document.querySelectorAll('.panel')];
doms.forEach((d, i) => d.addEventListener('click', () => {
  doms.forEach(x => x.classList.toggle('is-on', x === d));
  pans.forEach((p, j) => p.classList.toggle('is-on', j === i));
}));

/* hero reveal stagger */
if (!reduce) document.querySelectorAll('.hero h1').forEach(h => h.classList.add('reveal'));

/* form */
const f = document.getElementById('form');
f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('sent'); });
