const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav + progress */
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 30);
  bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight));
}, { passive: true });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => {
  const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.transitionDelay = (sib.indexOf(el) % 4) * 100 + 'ms';
  io.observe(el);
});

/* rotating words in the hero */
const rw = [...document.querySelectorAll('.rot b')]; let ri = 0;
if (!reduce) setInterval(() => {
  const c = rw[ri]; c.classList.remove('on'); c.classList.add('out');
  setTimeout(() => c.classList.remove('out'), 500);
  ri = (ri + 1) % rw.length; rw[ri].classList.add('on');
}, 3000);

/* counters */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* service tabs */
const tabs = [...document.querySelectorAll('.tab')], tps = [...document.querySelectorAll('.tp')], pill = document.querySelector('.tab-pill');
const movePill = b => { pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; };
movePill(tabs[0]);
tabs.forEach((t, i) => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.toggle('is-on', x === t)); movePill(t);
  tps.forEach((p, j) => p.classList.toggle('is-on', j === i));
}));
addEventListener('resize', () => movePill(document.querySelector('.tab.is-on')));

/* neuro track fills while scrolling */
const track = document.querySelector('.track');
function fillTrack() {
  if (!track) return;
  const r = track.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * .8 - r.top) / (r.height + innerHeight * .2), 0), 1);
  track.style.setProperty('--tl', p);
}
addEventListener('scroll', () => requestAnimationFrame(fillTrack), { passive: true }); fillTrack();

/* parallax: hero photo and consultório */
const arch = document.querySelector('.arch'), sobreImg = document.querySelector('.sobre-visual img');
addEventListener('scroll', () => {
  if (reduce) return;
  if (arch) arch.style.setProperty('--py', (scrollY * -.04) + 'px');
  if (sobreImg) { const r = sobreImg.parentElement.getBoundingClientRect(); const p = (innerHeight - r.top) / (innerHeight + r.height); sobreImg.style.transform = `translateY(${-(p - .5) * 30}px)`; }
}, { passive: true });

/* form */
document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
