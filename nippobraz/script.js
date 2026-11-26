const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });

/* form: opens WhatsApp with the order details */
const WA = '5591992544283';
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
    const texto = `Olá! Vim pelo site da Nippobraz e quero mais informações.\nNome: ${f.querySelector('input[type=text]').value}\nWhatsApp: ${f.querySelector('input[type=tel]').value}\nEntrega: ${f.entrega.value}\nMensagem: ${f.obs.value}`;
  window.open('https://api.whatsapp.com/send?phone=' + WA + '&text=' + encodeURIComponent(texto), '_blank');
});

/* product chips open an info window */
const INFO={
 cogumelos:{t:'Cogumelos',img:'fotos/prod-cogumelos.jpg',x:'Nossa variedade de cogumelos é um convite à experiência culinária. De Portobello a Cogumelo Sujo, Eringi, Shiitake, Shimeji, Enoki e Funghi, oferecemos uma seleção que abrange desde sabores terrosos até notas intensas de nozes.'},
 vegetais:{t:'Vegetais e saladas',img:'fotos/prod-vegetais.jpg',x:'De folhas verdes crocantes a cenouras vibrantes, pimentões coloridos e tomates suculentos, nossa seleção de produtos é a base perfeita para suas refeições saudáveis e deliciosas.'},
 tofu:{t:'Tofu defumado',img:'fotos/prod-tofu.jpg',x:'O tofu é a estrela da culinária saudável e versátil. Com destaque para o tofu defumado, nossa seleção oferece uma variedade de opções para todos os gostos. Seja grelhado, cozido ou incorporado em suas receitas favoritas, é a escolha certa para uma alimentação equilibrada e rica em proteínas.'},
 nori:{t:'Nori',img:'fotos/prod-nori.jpg',x:'O nori é uma joia da culinária japonesa, conhecido por seu sabor delicado e versatilidade. A alga marinha é a base perfeita para sushis e temakis, e também pode ser usada em snacks crocantes ou como toque especial em sopas.'},
 bebidas:{t:'Bebidas japonesas',img:'',x:'[Descrição das bebidas japonesas disponíveis na loja.]'},
 asiaticos:{t:'Produtos asiáticos',img:'',x:'[Descrição dos produtos asiáticos disponíveis na loja.]'}
};
const dlg=document.getElementById('prod-dlg');
document.querySelectorAll('.chip-btn').forEach(b=>b.addEventListener('click',()=>{
  const d=INFO[b.dataset.info];
  document.getElementById('dlg-title').textContent=d.t;
  document.getElementById('dlg-text').textContent=d.x;
  const im=document.getElementById('dlg-img');
  if(d.img){im.src=d.img;im.alt=d.t;im.style.display='block';}else{im.removeAttribute('src');im.style.display='none';}
  dlg.showModal();
}));
dlg.querySelector('.dlg-x').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });
