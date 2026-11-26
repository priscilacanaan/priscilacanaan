const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 40); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 3) * 100 + 'ms'; io.observe(el); });
