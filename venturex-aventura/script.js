const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* custom cursor */
const cursor = document.querySelector('.cursor');
let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
(function loop() {
  cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
  cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, summary, .card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

/* nav hide on scroll down */
const nav = document.querySelector('.nav');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('hide', y > lastY && y > 300);
  lastY = y;
}, { passive: true });

/* rotating word */
const words = [...document.querySelectorAll('.rotator b')];
let wi = 0;
if (!reduce) setInterval(() => {
  const cur = words[wi];
  cur.classList.remove('is-on'); cur.classList.add('is-out');
  setTimeout(() => cur.classList.remove('is-out'), 600);
  wi = (wi + 1) % words.length;
  words[wi].classList.add('is-on');
}, 2200);

/* reveal on scroll */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = (siblings.indexOf(el) % 6) * 80 + 'ms';
    el.classList.add('in');
    io.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* counters */
const countIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

/* manifesto word-by-word highlight */
const big = document.querySelector('[data-words]');
big.innerHTML = big.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span> `).join('');
const ws = [...big.querySelectorAll('.w')];
function paintWords() {
  const r = big.getBoundingClientRect();
  const p = Math.min(Math.max((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.4), 0), 1);
  const n = Math.floor(p * ws.length);
  ws.forEach((w, i) => w.classList.toggle('on', i < n || reduce));
}

/* horizontal "day" scroll */
const day = document.querySelector('.day');
const track = document.querySelector('.day-track');
function paintDay() {
  if (reduce) return;
  const r = day.getBoundingClientRect();
  const total = day.offsetHeight - innerHeight;
  const p = Math.min(Math.max(-r.top / total, 0), 1);
  const max = track.scrollWidth - track.parentElement.clientWidth + innerWidth * 0.12;
  track.style.transform = `translateX(${-p * max}px)`;
}

/* hero parallax */
const sun = document.querySelector('.sun');
function paintHero() {
  if (reduce) return;
  sun.style.translate = `0 ${scrollY * 0.25}px`;
}

addEventListener('scroll', () => requestAnimationFrame(() => { paintWords(); paintDay(); paintHero(); }), { passive: true });
addEventListener('resize', paintDay);
paintWords(); paintDay();

/* 3D tilt cards */
if (!reduce) document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* magnetic buttons */
if (!reduce) document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

/* pricing toggle */
const toggle = document.querySelector('.toggle');
const pill = toggle.querySelector('.pill');
const tBtns = [...toggle.querySelectorAll('button')];
function movePill(b) { pill.style.left = b.offsetLeft + 'px'; pill.style.width = b.offsetWidth + 'px'; }
movePill(tBtns[0]);
tBtns.forEach(b => b.addEventListener('click', () => {
  tBtns.forEach(x => x.classList.toggle('is-on', x === b));
  movePill(b);
  const key = b.dataset.period === 'year' ? 'y' : 'm';
  document.querySelectorAll('.price b').forEach(el => {
    const from = +el.textContent, to = +el.dataset[key], t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 500, 1);
      el.textContent = Math.round(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}));
addEventListener('resize', () => movePill(toggle.querySelector('.is-on')));
