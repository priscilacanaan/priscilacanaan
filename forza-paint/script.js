const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 40); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

/* pinstripe de carro: faixas finas, paralelas e com curvas tensas que se arrastam pela tela */
(function () {
  const cv = document.getElementById('trails'); if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d'); let W, H, t = 0;
  const resize = () => { W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio; };
  resize(); addEventListener('resize', resize);
  /* cada faixa é um grupo de 3 linhas paralelas, como uma pita de carro */
  const bands = [
    { y: .22, amp: 70, f: 1.6, sp: .9, ph: 0.0, gap: 7 },
    { y: .36, amp: 52, f: 2.1, sp: 1.2, ph: 1.4, gap: 6 },
    { y: .50, amp: 88, f: 1.3, sp: .7, ph: 2.6, gap: 8 },
    { y: .66, amp: 44, f: 2.6, sp: 1.4, ph: 4.1, gap: 5 },
    { y: .80, amp: 62, f: 1.9, sp: 1.0, ph: 5.3, gap: 6 }
  ];
  const yAt = (b, k, off) => {
    /* curva com "cotovelo": seno + harmônico, bem tenso, como um risco de pintura */
    const base = Math.sin(k * Math.PI * 2 * b.f + t * b.sp + b.ph) + 0.35 * Math.sin(k * Math.PI * 4.6 - t * b.sp * 0.6 + b.ph);
    return H * b.y + base * b.amp * devicePixelRatio + off;
  };
  function frame() {
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    bands.forEach(b => {
      [-1, 0, 1].forEach(s => {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6) {
          const k = x / W, y = yAt(b, k, s * b.gap * devicePixelRatio);
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = s === 0 ? 'rgba(198,255,0,0.75)' : 'rgba(198,255,0,0.35)';
        ctx.lineWidth = (s === 0 ? 1.4 : 0.9) * devicePixelRatio;
        ctx.shadowColor = '#C6FF00'; ctx.shadowBlur = 6;
        ctx.stroke();
      });
    });
    t += 0.014; requestAnimationFrame(frame);
  }
  frame();
})();
