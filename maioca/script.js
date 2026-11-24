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

/* Monte o seu: steps driven by scroll */
const mSec=document.getElementById('monte');
if(mSec){
  const ms=[...mSec.querySelectorAll('.ms')], bars=[...mSec.querySelectorAll('.steps-bar li')];
  const balls=[...mSec.querySelectorAll('.m-ball')], drips=[...mSec.querySelectorAll('.m-drip')], confs=[...mSec.querySelectorAll('.m-conf')];
  const stepOf=p=>p<.2?0:p<.45?1:p<.7?2:3;
  function paintMonte(){
    const r=mSec.getBoundingClientRect(), total=mSec.offsetHeight-innerHeight;
    const p=Math.min(Math.max(-r.top/total,0),1), s=stepOf(p);
    ms.forEach(el=>el.classList.toggle('on',+el.dataset.step===s));
    bars.forEach(el=>el.classList.toggle('on',+el.dataset.step<=s));
    balls.forEach((b,i)=>b.classList.toggle('on',s>=0 && p>i*.06));
    drips.forEach((d,i)=>d.classList.toggle('on',s>=1));
    confs.forEach((c,i)=>c.classList.toggle('on',s>=2));
  }
  addEventListener('scroll',()=>requestAnimationFrame(paintMonte),{passive:true});
  paintMonte();
}
