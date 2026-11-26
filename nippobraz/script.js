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
