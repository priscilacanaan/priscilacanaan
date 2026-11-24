const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav gets solid on scroll */
const nav = document.querySelector('.nav');
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const sib = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
  e.target.style.transitionDelay = (sib.indexOf(e.target) % 6) * 80 + 'ms';
  e.target.classList.add('in'); io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* counters */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step); cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* oven temperature flicker */
const temp = document.querySelector('[data-temp]');
if (temp && !reduce) setInterval(() => { temp.textContent = 178 + Math.round(Math.random() * 6); }, 900);

/* product filters */
const fs = [...document.querySelectorAll('.f')], ps = [...document.querySelectorAll('.p')];
fs.forEach(b => b.addEventListener('click', () => {
  fs.forEach(x => x.classList.toggle('is-on', x === b));
  const f = b.dataset.f;
  ps.forEach(p => {
    const ok = f === 'todos' || p.dataset.cat.split(' ').includes(f);
    p.classList.toggle('hide', !ok);
    p.classList.remove('show'); if (ok) { void p.offsetWidth; p.classList.add('show', 'in'); }
  });
}));

/* process line fills on scroll */
const tl = document.querySelector('.timeline');
function fillLine() {
  const r = tl.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * .9 - r.top) / (r.height + innerHeight * .3), 0), 1);
  tl.style.setProperty('--p', reduce ? 1 : p);
}
addEventListener('scroll', () => requestAnimationFrame(fillLine), { passive: true }); fillLine();

/* ===== mais dinâmico ===== */
/* preloader */
(function(){
  const n=document.getElementById('pl-n'); let v=0;
  const done=()=>{ if(!document.body.classList.contains('loading'))return; n.textContent=100; setTimeout(()=>document.body.classList.remove('loading'),250); };
  if(reduce){ document.body.classList.remove('loading'); return; }
  const t=setInterval(()=>{ v=Math.min(v+Math.ceil(Math.random()*12),99); n.textContent=v; },70);
  const finish=()=>{ clearInterval(t); done(); };
  if(document.readyState==='complete') setTimeout(finish,900); else addEventListener('load',()=>setTimeout(finish,600));
  setTimeout(finish,2500);
})();

/* scroll progress */
const bar=document.querySelector('.progress');
addEventListener('scroll',()=>{ bar.style.setProperty('--sp', scrollY/(document.documentElement.scrollHeight-innerHeight)); },{passive:true});

/* rotating hero word */
const rw=[...document.querySelectorAll('.rot b')]; let ri=0;
if(!reduce) setInterval(()=>{ const c=rw[ri]; c.classList.remove('on'); c.classList.add('out'); setTimeout(()=>c.classList.remove('out'),450); ri=(ri+1)%rw.length; rw[ri].classList.add('on'); },2300);

/* oven follows mouse */
const oven=document.querySelector('.oven');
if(oven && !reduce) addEventListener('mousemove',e=>{
  const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5;
  oven.style.transform=`perspective(900px) rotate(-3deg) rotateY(${x*16}deg) rotateX(${-y*12}deg) translate(${x*10}px,${y*10}px)`;
});

/* magnetic buttons */
if(!reduce) document.querySelectorAll('.mag').forEach(b=>{
  b.addEventListener('mousemove',e=>{ const r=b.getBoundingClientRect(); b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`; });
  b.addEventListener('mouseleave',()=>b.style.transform='');
});

/* split headings letter by letter */
document.querySelectorAll('.split').forEach(h=>{
  let i=0;
  const walk=node=>{ [...node.childNodes].forEach(ch=>{
    if(ch.nodeType===3){ const frag=document.createDocumentFragment();
      [...ch.nodeValue].forEach(l=>{ const s=document.createElement('span'); if(l===' '){s.className='sp';s.innerHTML='&nbsp;';} else {s.className='ch';s.textContent=l;s.style.transitionDelay=(i++*28)+'ms';} frag.appendChild(s); });
      ch.replaceWith(frag);
    } else walk(ch); }); };
  walk(h);
  const o=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ h.classList.add('in'); o.disconnect(); } }),{threshold:.4}); o.observe(h);
});

/* big marquee moves with scroll speed */
const r1=document.querySelector('.r1'), r2=document.querySelector('.r2');
if(r1 && !reduce){
  let x1=0, x2=-400, vel=0, lastY=scrollY;
  addEventListener('scroll',()=>{ vel+= (scrollY-lastY)*.15; lastY=scrollY; },{passive:true});
  (function loop(){
    vel*=.92; const base=.6;
    x1-= base+Math.abs(vel); x2+= base+Math.abs(vel);
    const w1=r1.scrollWidth/2, w2=r2.scrollWidth/2;
    if(-x1>w1) x1+=w1; if(x2>0) x2-=w2;
    r1.style.transform=`translateX(${x1}px) skewX(${Math.max(-12,Math.min(12,-vel))}deg)`;
    r2.style.transform=`translateX(${x2}px) skewX(${Math.max(-12,Math.min(12,vel))}deg)`;
    requestAnimationFrame(loop);
  })();
}

/* 3D tilt + shine */
if(!reduce) document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    el.classList.add('tilting');
    el.style.transform=`perspective(800px) rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*12}deg) translateY(-8px)`;
    el.style.setProperty('--mx',x*100+'%'); el.style.setProperty('--my',y*100+'%');
  });
  el.addEventListener('mouseleave',()=>{ el.classList.remove('tilting'); el.style.transform=''; });
});

/* footer letters */
const fb=document.querySelector('.footer-big');
if(fb){ fb.innerHTML=fb.innerHTML.replace(/>([^<]+)</g,(m,t)=>'>'+[...t].map(l=>`<span class="fl">${l}</span>`).join('')+'<').replace(/^([^<]+)/,(m,t)=>[...t].map(l=>`<span class="fl">${l}</span>`).join('')); }

/* cookie banner (LGPD): remembers the choice */
(function(){
  const el=document.getElementById('cookies'); if(!el) return;
  let saved=null; try{ saved=localStorage.getItem('pg-cookies'); }catch(e){}
  if(saved) { el.remove(); return; }
  const open=()=>{ el.classList.add('show'); document.body.classList.add('ck-open'); };
  const close=choice=>{ try{ localStorage.setItem('pg-cookies',choice); }catch(e){}
    el.classList.remove('show'); document.body.classList.remove('ck-open'); setTimeout(()=>el.remove(),800); };
  el.querySelector('.ck-yes').addEventListener('click',()=>close('todos'));
  el.querySelector('.ck-no').addEventListener('click',()=>close('essenciais'));
  // appears right after the opening screen
  const wait=setInterval(()=>{ if(!document.body.classList.contains('loading')){ clearInterval(wait); setTimeout(open,900); } },150);
})();
