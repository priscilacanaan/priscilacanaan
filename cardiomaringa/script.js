const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });
if (!reduce) document.querySelectorAll('.mag').forEach(b => {
  b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
  b.addEventListener('mouseleave', () => b.style.transform = '');
});
document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
