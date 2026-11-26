const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });

/* counter */
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, end = +el.dataset.count, t0 = performance.now(); const step = t => { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); cio.unobserve(el); }), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* custom cursor + magnetic buttons */
if (!reduce && matchMedia('(hover:hover)').matches) {
  const cur = document.querySelector('.cursor'); let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function loop() { cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a, button').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')); });
  document.querySelectorAll('.mag').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px,${(e.clientY - r.top - r.height / 2) * .4}px)`; });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

/* form: opens WhatsApp-free message (phone number only; WhatsApp to be set) */
document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
