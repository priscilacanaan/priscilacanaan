const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 100 + 'ms'; io.observe(el); });
const secIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) document.querySelectorAll('.links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
['sobre', 'services', 'research', 'contato'].forEach(id => { const el = document.getElementById(id); if (el) secIO.observe(el); });

/* botões "Request a proposal" etc.: escolhem o assunto no formulário de contato */
document.querySelectorAll('[data-req]').forEach(b => b.addEventListener('click', () => {
  const sel = document.getElementById('subj'); if (sel) sel.value = b.dataset.req;
}));

/* language switch: PT is the source text; EN/FR come from i18n.js */
const src = new Map();
document.querySelectorAll('[data-i]').forEach(el => src.set(el, el.innerHTML));
document.querySelectorAll('[data-ph]').forEach(el => src.set(el, el.placeholder));
function setLang(l) {
  const dict = (window.I18N && I18N[l]) || {};
  document.querySelectorAll('[data-i]').forEach(el => { const k = el.dataset.i; el.innerHTML = l === 'pt' || !dict[k] ? src.get(el) : dict[k]; });
  document.querySelectorAll('[data-ph]').forEach(el => { const k = el.dataset.ph; el.placeholder = l === 'pt' || !dict[k] ? src.get(el) : dict[k]; });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('is-on', b.dataset.lang === l));
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;
  try { localStorage.setItem('ac-lang', l); } catch (e) {}
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
let saved = null; try { saved = localStorage.getItem('ac-lang'); } catch (e) {}
const nav2 = (navigator.language || 'pt').slice(0, 2);
setLang(new URLSearchParams(location.search).get('lang') || saved || (['en', 'fr'].includes(nav2) ? nav2 : 'pt'));

document.getElementById('form').addEventListener('submit', e => { e.preventDefault(); e.target.classList.add('sent'); });
