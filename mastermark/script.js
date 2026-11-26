const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });
if (!reduce) {
  const rw = [...document.querySelectorAll('.rot b')]; let ri = 0;
  setInterval(() => { const c = rw[ri]; c.classList.remove('on'); c.classList.add('out'); setTimeout(() => c.classList.remove('out'), 400); ri = (ri + 1) % rw.length; rw[ri].classList.add('on'); }, 2400);
}
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, end = +el.dataset.count || 0; const t0 = performance.now(); const step = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); cio.unobserve(el); }), { threshold: .6 });
