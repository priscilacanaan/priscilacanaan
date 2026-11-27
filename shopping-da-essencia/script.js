const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 40); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
/* palavras que trocam no hero: perfume, cosmético, sabonete, aroma */
const words = document.querySelectorAll('.swap .w');
let wi = 0;
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    words[wi].classList.remove('is-on');
    wi = (wi + 1) % words.length;
    words[wi].classList.add('is-on');
  }, 2200);
}
