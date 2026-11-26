const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });

/* cookie banner: remembers the choice */
(function(){
  const el=document.getElementById('cookies'); if(!el) return;
  let saved=null; try{ saved=localStorage.getItem('nb-cookies'); }catch(e){}
  if(saved){ el.remove(); return; }
  const close=v=>{ try{ localStorage.setItem('nb-cookies',v); }catch(e){} el.classList.remove('show'); setTimeout(()=>el.remove(),800); };
  el.querySelector('.ck-yes').addEventListener('click',()=>close('todos'));
  el.querySelector('.ck-no').addEventListener('click',()=>close('essenciais'));
  setTimeout(()=>el.classList.add('show'),1200);
})();
