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

/* faixa azul: repete as palavras até cobrir a tela inteira, sem espaço vazio */
const WORDS = ['Ingredientes Saneantes','Essências Hidrossolúveis e Desinfetantes','Óleo Vegetal e Óleo Essencial','Produtos Químicos','Ingredientes Cosméticos'];
function buildBand() {
  const track = document.querySelector('.band .track');
  if (!track) return;
  const makeGroup = () => {
    const g = document.createElement('div'); g.className = 'grp';
    WORDS.forEach(w => { const s = document.createElement('span'); s.textContent = w; g.append(s, Object.assign(document.createElement('i'), { textContent: '●' })); });
    return g;
  };
  track.innerHTML = '';
  let g = makeGroup(); track.append(g);
  while (g.offsetWidth < innerWidth) { const c = makeGroup(); g.append(...c.childNodes); }
  const copy = g.cloneNode(true); track.append(copy);
}
buildBand();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildBand, 200); });

/* banner de cookies (escolha salva em localStorage) */
(function(){
  const box = document.getElementById('cookies'); if (!box) return;
  let v = null; try { v = localStorage.getItem('se-cookies'); } catch (e) {}
  if (!v) box.hidden = false;
  const save = val => { try { localStorage.setItem('se-cookies', val); } catch (e) {} box.hidden = true; };
  box.querySelector('.ck-yes').addEventListener('click', () => save('todos'));
  box.querySelector('.ck-no').addEventListener('click', () => save('essenciais'));
})();
