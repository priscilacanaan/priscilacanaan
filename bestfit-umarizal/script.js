const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav + progress */
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 40);
  bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight));
}, { passive: true });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* counters */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step); el.closest('.stat').classList.add('in'); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* gauge fills while visible (first workout progress) */
const gauge = document.querySelector('.gauge'), pct = document.querySelector('.pct');
const gio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  let v = 0; const t = setInterval(() => {
    v = Math.min(v + 2, 100); gauge.style.setProperty('--g', v); pct.textContent = v;
    if (v >= 100) clearInterval(t);
  }, 25);
  gio.unobserve(gauge);
}), { threshold: .4 });
if (gauge) gio.observe(gauge);

/* tilt + spotlight on cards */
if (!reduce) document.querySelectorAll('.card, .plan').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    if (el.classList.contains('card')) el.style.transform = `perspective(800px) rotateY(${(x - .5) * 12}deg) rotateX(${(.5 - y) * 10}deg) translateY(-6px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* magnetic buttons */
if (!reduce) document.querySelectorAll('.mag').forEach(b => {
  b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px,${(e.clientY - r.top - r.height / 2) * .4}px)`; });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});

/* cursor spotlight */
const spot = document.querySelector('.spot');
if (!reduce) addEventListener('mousemove', e => { spot.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
