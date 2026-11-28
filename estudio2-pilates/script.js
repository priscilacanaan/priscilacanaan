const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 40); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

/* faixa roxa: repete as palavras até cobrir a tela inteira */
const BAND_WORDS = ['Pilates','Cadillac','Reformer','Barrel','Aula experimental','Belém','Novo espaço'];
function buildBand() {
  const track = document.querySelector('.band .track'); if (!track) return;
  const makeGroup = () => { const g = document.createElement('div'); g.className = 'grp'; BAND_WORDS.forEach(w => { const s = document.createElement('span'); s.textContent = w; g.append(s, Object.assign(document.createElement('i'), { textContent: '●' })); }); return g; };
  track.innerHTML = '';
  const g = makeGroup(); track.append(g);
  while (g.offsetWidth < innerWidth) { const c = makeGroup(); g.append(...c.childNodes); }
  track.append(g.cloneNode(true));
}
buildBand();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildBand, 200); });

/* banner de cookies */
(function(){
  const box = document.getElementById('cookies'); if (!box) return;
  let v = null; try { v = localStorage.getItem('e2-cookies'); } catch (e) {}
  if (!v) box.hidden = false;
  const save = val => { try { localStorage.setItem('e2-cookies', val); } catch (e) {} box.hidden = true; };
  box.querySelector('.ck-yes').addEventListener('click', () => save('todos'));
  box.querySelector('.ck-no').addEventListener('click', () => save('essenciais'));
})();
