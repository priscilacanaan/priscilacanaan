/* progress bar */
const bar = document.querySelector('.progress');
addEventListener('scroll', () => bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)), { passive: true });

/* sections fade in + table of contents highlight */
const links = [...document.querySelectorAll('.toc a')];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }
}), { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }), { threshold: .05 });
document.querySelectorAll('.doc section').forEach(s => { io.observe(s); io2.observe(s); });

/* cookie preference (same key as the home page banner) */
const st = document.getElementById('ck-status'), btn = document.getElementById('ck-reset');
function showCk() {
  if (!st) return;
  let v = null; try { v = localStorage.getItem('pg-cookies'); } catch (e) {}
  st.textContent = v === 'todos' ? 'Sua escolha atual: aceitar todos' : v === 'essenciais' ? 'Sua escolha atual: só os essenciais' : v === 'personalizado' ? 'Sua escolha atual: personalizada' : 'Você ainda não escolheu';
}
showCk();
addEventListener('pg-cookies', showCk);
if (btn) btn.addEventListener('click', () => {
  if (window.pgCookies) window.pgCookies.redefinir(); else { try { localStorage.removeItem('pg-cookies'); localStorage.removeItem('pg-cookies-pref'); } catch (e) {} }
  st.textContent = 'Escolha apagada. O aviso apareceu de novo para você escolher.';
});
