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

/* aula experimental form: opens WhatsApp with the details filled in */
const af=document.getElementById('aula-form');
if(af) af.addEventListener('submit',e=>{
  e.preventDefault();
  const v=n=>af.querySelector(n).value.trim();
  const texto=`Olá! Quero marcar uma aula experimental na Best Fit Umarizal.\nNome: ${v('input[type=text]')}\nWhatsApp: ${v('input[type=tel]')}\nObjetivo: ${v('select')}`;
  window.open('https://api.whatsapp.com/send?phone=5591980484544&text='+encodeURIComponent(texto),'_blank');
  af.classList.add('sent');
});

/* ===== dinâmico ===== */
/* rotating outline word in hero */
const ro=[...document.querySelectorAll('.rot-out b')]; let roi=0;
if(!reduce && ro.length) setInterval(()=>{
  const cur=ro[roi]; cur.classList.remove('on'); cur.classList.add('out');
  setTimeout(()=>cur.classList.remove('out'),400);
  roi=(roi+1)%ro.length; ro[roi].classList.add('on');
},2600);

/* hero photo parallax */
const hp=document.querySelector('.hero-photo');
if(hp && !reduce) addEventListener('scroll',()=>{ hp.style.transform=`translateY(${scrollY*.25}px) scale(1.08)`; },{passive:true});

/* scroll-speed marquee */
const mqT=document.querySelector('.track');
if(mqT && !reduce){
  let x=0,v=0,last=scrollY;
  addEventListener('scroll',()=>{ v+=(scrollY-last)*.4; last=scrollY; },{passive:true});
  (function loop(){ v*=.92; x-=1.2+Math.min(Math.abs(v),40); if(-x>mqT.scrollWidth/2) x+=mqT.scrollWidth/2; mqT.style.transform=`translateX(${x}px)`; requestAnimationFrame(loop); })();
}

/* section titles shine in when visible */
const hio=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); hio.unobserve(e.target); } }),{threshold:.5});
document.querySelectorAll('h2').forEach(el=>hio.observe(el));

/* stagger reveal in grids */
document.querySelectorAll('.cards, .plans, .gal-grid').forEach(g=>[...g.children].forEach((el,i)=>el.style.transitionDelay=(i*90)+'ms'));

/* aula experimental: plan buttons pre-fill the form; form opens WhatsApp with the details */
document.querySelectorAll('[data-plano]').forEach(a=>a.addEventListener('click',()=>{ const f=document.getElementById('form'); if(f) f.plano.value=a.dataset.plano; }));
const estForm=document.getElementById('form');
if(estForm) estForm.addEventListener('submit',e=>{
  e.preventDefault();
  const num=estForm.dataset.waNumber.replace(/\D/g,'');
  const v=n=>(estForm.querySelector(n)?.value||'').trim();
  const plano=estForm.plano.value;
  const texto=`Olá! Quero marcar uma aula experimental na Academia Estação Maringá.\nNome: ${v('input[type=text]')}\nWhatsApp: ${v('input[type=tel]')}\nObjetivo: ${v('select')}`+(plano?`\nPlano de interesse: ${plano}`:'');
  if(num.length>=12) window.open('https://api.whatsapp.com/send?phone='+num+'&text='+encodeURIComponent(texto),'_blank');
  estForm.classList.add('sent');
});
