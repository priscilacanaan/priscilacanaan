const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 30); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => { const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal')); el.style.transitionDelay = (sib.indexOf(el) % 4) * 90 + 'ms'; io.observe(el); });

/* menu filter */
const tabs = [...document.querySelectorAll('.tab')], dishes = [...document.querySelectorAll('.dish')];
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.classList.toggle('is-on', x === t));
  dishes.forEach(d => d.classList.toggle('hide', t.dataset.f !== 'all' && d.dataset.cat !== t.dataset.f));
}));

/* order cart: add items, then send by WhatsApp */
const order = [];
const cart = document.getElementById('cart'), cartN = document.getElementById('cart-n');
document.querySelectorAll('.add').forEach(b => b.addEventListener('click', () => {
  order.push(b.dataset.item); cartN.textContent = order.length;
  b.classList.add('done'); b.textContent = '✓ adicionado';
  cart.classList.add('show');
}));

/* form: opens WhatsApp with the order details */
const WA = '5591992544283';
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const itens = order.length ? order.map(i => '- ' + i).join('\n') : '(sem itens selecionados)';
  const texto = `Olá! Quero fazer um pedido na Nippobraz.\nNome: ${f.querySelector('input[type=text]').value}\nWhatsApp: ${f.querySelector('input[type=tel]').value}\nEntrega: ${f.entrega.value}\nItens:\n${itens}\nObs: ${f.obs.value}`;
  window.open('https://api.whatsapp.com/send?phone=' + WA + '&text=' + encodeURIComponent(texto), '_blank');
});
