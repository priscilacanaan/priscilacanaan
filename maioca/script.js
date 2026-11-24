const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 30);
  bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight));
}, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });

/* open now? Belém time, Tue–Sun 10h–22h */
const openEl = document.getElementById('open-txt'), dot = document.querySelector('.open .pulse');
function openNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Belem', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
  const day = parts.find(p => p.type === 'weekday').value, h = +parts.find(p => p.type === 'hour').value % 24;
  const open = day !== 'Mon' && h >= 10 && h < 22;
  openEl.textContent = open ? 'Aberto agora · venha se refrescar' : 'Fechado agora · volte amanhã (ter a dom, 10h às 22h)';
  dot.classList.toggle('off', !open);
}
openNow(); setInterval(openNow, 60000);

/* flavor picker */
const chips = [...document.querySelectorAll('.chip')], cards = [...document.querySelectorAll('.flavor')];
const cats = ['Açaí', 'Tapioca', 'Frutas', 'Especiais'];
const descs = ['O clássico paraense, na textura que você já conhece.', 'O sabor da infância, em forma de sorvete.', 'Frutas da nossa terra, refrescantes e cheias de sabor.', 'Os sabores que só aparecem de vez em quando.'];
const names = ['Açaí cremoso', 'Tapioca', 'Frutas', 'Especial da casa'];
const pscoop = document.getElementById('pscoop');
chips.forEach(c => c.addEventListener('click', () => {
  const f = +c.dataset.f;
  chips.forEach(x => x.classList.toggle('is-on', x === c));
  cards.forEach(card => {
    const ok = +card.dataset.cat === f;
    card.classList.toggle('hide', !ok); card.classList.remove('show');
    if (ok) { void card.offsetWidth; card.classList.add('show'); }
  });
  document.getElementById('pk-cat').textContent = cats[f];
  document.getElementById('pk-name').textContent = names[f];
  document.getElementById('pk-desc').textContent = descs[f];
  pscoop.classList.add('swap'); setTimeout(() => pscoop.classList.remove('swap'), 350);
  const cols = ['#7B2D8E', '#C98B4B', '#F06B8C', '#8E5BD6'];
  pscoop.querySelectorAll('i').forEach(i => i.style.background = `radial-gradient(circle at 35% 30%,#fff 0 6%,transparent 7%),linear-gradient(140deg,${cols[f]},${cols[f]}cc)`);
}));
/* start with the first category */
chips[0].click();

/* hero cone: scoop follows cursor a little */
const hs = document.querySelector('.hero-scoop');
if (hs && !reduce && matchMedia('(hover:hover)').matches) addEventListener('mousemove', e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  hs.style.transform = `translate(${x * 20}px, ${y * 14}px)`;
});

/* tilt on flavor cards */
if (!reduce) document.querySelectorAll('.flavor').forEach(el => {
  el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`; });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ticker speeds up with scroll */
const tk = document.querySelector('.ticker-track');
if (tk && !reduce) { let last = scrollY, sp = 0; addEventListener('scroll', () => { sp += Math.abs(scrollY - last) * .02; last = scrollY; }, { passive: true }); (function loop() { sp *= .95; tk.style.animationDuration = Math.max(8, 26 - sp) + 's'; requestAnimationFrame(loop); })(); }
