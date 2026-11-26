/* Provador: silhuetas de roupa como exemplo. Troque por PNGs sem fundo dos seus produtos. */
const PRODUCTS = [
  { id: 'camiseta-preta', name: 'Camiseta Essencial', kind: 'camiseta', color: '#1B1915', price: 'R$ 89,90' },
  { id: 'camiseta-off', name: 'Camiseta Off White', kind: 'camiseta', color: '#EFE8DC', price: 'R$ 89,90' },
  { id: 'polo-verde', name: 'Polo Oliva', kind: 'polo', color: '#5D6B4A', price: 'R$ 139,90' },
  { id: 'polo-preto', name: 'Polo Noite', kind: 'polo', color: '#2A2724', price: 'R$ 139,90' },
  { id: 'camisa-azul', name: 'Camisa Linho Azul', kind: 'camisa', color: '#A9BCD0', price: 'R$ 259,90' },
  { id: 'camisa-branca', name: 'Camisa Linho Branca', kind: 'camisa', color: '#F4F1EA', price: 'R$ 259,90' },
  { id: 'moletom-cinza', name: 'Moletom Cinza', kind: 'moletom', color: '#8D8A84', price: 'R$ 219,90' },
  { id: 'moletom-terra', name: 'Moletom Terra', kind: 'moletom', color: '#8A5A3B', price: 'R$ 219,90' },
];

/* silhueta SVG (300x340) por tipo de peça */
function garmentSVG(kind, color) {
  const shapes = {
    camiseta: `<path d="M95 38 L38 66 L10 138 L56 158 L66 128 L66 322 L234 322 L234 128 L244 158 L290 138 L262 66 L205 38 Q150 78 95 38 Z" fill="${color}"/>`,
    polo: `<path d="M95 38 L38 66 L10 138 L56 158 L66 128 L66 322 L234 322 L234 128 L244 158 L290 138 L262 66 L205 38 Q150 78 95 38 Z" fill="${color}"/>
      <path d="M95 38 Q150 92 205 38 L196 30 L150 60 L104 30 Z" fill="${shade(color, -18)}"/>
      <line x1="150" y1="70" x2="150" y2="112" stroke="${shade(color, -30)}" stroke-width="3"/>
      <circle cx="150" cy="84" r="2.5" fill="${shade(color, -40)}"/><circle cx="150" cy="100" r="2.5" fill="${shade(color, -40)}"/>`,
    camisa: `<path d="M100 36 L40 58 L8 250 L54 258 L64 150 L64 322 L236 322 L236 150 L246 258 L292 250 L260 58 L200 36 Q150 70 100 36 Z" fill="${color}"/>
      <path d="M100 36 Q150 92 200 36 L184 30 L150 72 L116 30 Z" fill="${shade(color, -14)}"/>
      <line x1="150" y1="92" x2="150" y2="322" stroke="${shade(color, -22)}" stroke-width="2"/>
      ${[120,150,180,210,240,270].map(y => `<circle cx="150" cy="${y}" r="2.2" fill="${shade(color, -35)}"/>`).join('')}`,
    moletom: `<path d="M110 30 Q150 6 190 30 L238 60 L292 146 L250 166 L236 130 L236 322 L64 322 L64 130 L50 166 L8 146 L62 60 Z" fill="${color}"/>
      <path d="M110 30 Q150 6 190 30 Q176 74 150 74 Q124 74 110 30 Z" fill="${shade(color, -16)}"/>
      <path d="M118 96 L182 96 L186 150 L114 150 Z" fill="${shade(color, -10)}"/>
      <line x1="140" y1="104" x2="138" y2="140" stroke="${shade(color, -35)}" stroke-width="2"/><line x1="160" y1="104" x2="162" y2="140" stroke="${shade(color, -35)}" stroke-width="2"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 340">${shapes[kind]}</svg>`;
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => Math.max(0, Math.min(255, c + amt));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join('');
}
const svgURL = (kind, color) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(garmentSVG(kind, color));

/* renderiza o grid de produtos e o seletor do provador */
const grid = document.getElementById('grid'), items = document.getElementById('items');
PRODUCTS.forEach((p, i) => {
  const url = svgURL(p.kind, p.color);
  grid.insertAdjacentHTML('beforeend', `<article class="p reveal" data-id="${p.id}"><div class="p-img"><img src="${url}" alt="${p.name}" loading="lazy"/></div><div class="p-info"><h3>${p.name}</h3><p class="price">${p.price}</p><p class="try">Experimentar no provador →</p></div></article>`);
  items.insertAdjacentHTML('beforeend', `<button class="item${i === 0 ? ' on' : ''}" data-id="${p.id}" type="button"><img src="${url}" alt="${p.name}"/><span>${p.name}</span><small>${p.price}</small></button>`);
});
document.querySelectorAll('.cat-img').forEach(el => {
  const kind = { camiseta: 'camiseta', polo: 'polo', camisa: 'camisa', moletom: 'moletom' }[el.dataset.cat];
  const p = PRODUCTS.find(x => x.kind === kind);
  el.style.backgroundImage = `url("${svgURL(kind, p.color)}")`;
});

/* provador */
const stage = document.getElementById('stage'), empty = document.getElementById('empty');
const person = document.getElementById('person'), garment = document.getElementById('garment');
const tools = document.getElementById('tools'), fileIn = document.getElementById('file');
const sizeIn = document.getElementById('size'), opIn = document.getElementById('op');
let current = PRODUCTS[0];

function setGarment(id) {
  current = PRODUCTS.find(p => p.id === id);
  garment.src = svgURL(current.kind, current.color);
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  if (!person.hidden) garment.hidden = false;
}
items.addEventListener('click', e => { const b = e.target.closest('.item'); if (b) setGarment(b.dataset.id); });
grid.addEventListener('click', e => {
  const c = e.target.closest('.p'); if (!c) return;
  setGarment(c.dataset.id);
  document.getElementById('provador').scrollIntoView({ behavior: 'smooth' });
});

fileIn.addEventListener('change', () => {
  const f = fileIn.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    person.src = r.result; person.hidden = false; empty.hidden = true;
    garment.hidden = false; tools.hidden = false;
    garment.style.left = '50%'; garment.style.top = '30%';
    sizeIn.value = 45; garment.style.width = '45%'; opIn.value = 92; garment.style.opacity = .92;
    setGarment(current.id);
  };
  r.readAsDataURL(f);
});
document.getElementById('reset').addEventListener('click', () => {
  fileIn.value = ''; person.hidden = true; garment.hidden = true; empty.hidden = false; tools.hidden = true;
});
sizeIn.addEventListener('input', () => { garment.style.width = sizeIn.value + '%'; });
opIn.addEventListener('input', () => { garment.style.opacity = opIn.value / 100; });

/* arrastar a peça (mouse e toque) */
let drag = null;
garment.addEventListener('pointerdown', e => {
  e.preventDefault();
  const r = stage.getBoundingClientRect();
  drag = { dx: e.clientX - garment.getBoundingClientRect().left - garment.offsetWidth / 2 - 0, dy: e.clientY - garment.getBoundingClientRect().top - garment.offsetHeight / 2, r };
  garment.setPointerCapture(e.pointerId); garment.classList.add('dragging');
});
garment.addEventListener('pointermove', e => {
  if (!drag) return;
  const r = stage.getBoundingClientRect();
  const x = ((e.clientX - drag.dx - r.left) / r.width) * 100;
  const y = ((e.clientY - drag.dy - r.top) / r.height) * 100;
  garment.style.left = Math.max(0, Math.min(100, x)) + '%';
  garment.style.top = Math.max(0, Math.min(100, y)) + '%';
});
const endDrag = () => { drag = null; garment.classList.remove('dragging'); };
garment.addEventListener('pointerup', endDrag);
garment.addEventListener('pointercancel', endDrag);

/* baixar a imagem com a peça aplicada */
document.getElementById('save').addEventListener('click', () => {
  if (person.hidden) return;
  const nw = person.naturalWidth, nh = person.naturalHeight;
  const cv = document.createElement('canvas'); cv.width = nw; cv.height = nh;
  const ctx = cv.getContext('2d');
  ctx.drawImage(person, 0, 0, nw, nh);
  /* posição e tamanho da peça no stage (object-fit: contain) */
  const sr = stage.getBoundingClientRect();
  const scale = Math.min(sr.width / nw, sr.height / nh);
  const dw = nw * scale, dh = nh * scale;
  const ox = (sr.width - dw) / 2, oy = (sr.height - dh) / 2;
  const gw = garment.offsetWidth / scale, gh = (garment.offsetWidth * 340 / 300) / scale;
  const cx = (parseFloat(garment.style.left) / 100) * sr.width;
  const cy = (parseFloat(garment.style.top) / 100) * sr.height;
  const gx = (cx - ox) / scale, gy = (cy - oy) / scale;
  const img = new Image();
  img.onload = () => {
    ctx.globalAlpha = parseFloat(garment.style.opacity || 1);
    ctx.drawImage(img, gx - gw / 2, gy - gh / 2, gw, gh);
    const a = document.createElement('a');
    a.download = 'provador-fit.png'; a.href = cv.toDataURL('image/png'); a.click();
  };
  img.src = garment.src;
});

/* reveal */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 30), { passive: true });
