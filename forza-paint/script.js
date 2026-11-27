const nav = document.getElementById('nav'), bar = document.querySelector('.progress');
addEventListener('scroll', () => { nav.classList.toggle('solid', scrollY > 40); bar.style.setProperty('--sp', scrollY / (document.documentElement.scrollHeight - innerHeight)); }, { passive: true });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });

/* rastros de luz (exposição longa): curvas sinuosas que se arrastam pela tela */
(function () {
  const cv = document.getElementById('trails'); if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d'); let W, H, t = 0;
  const resize = () => { W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio; };
  resize(); addEventListener('resize', resize);
  const lines = Array.from({ length: 5 }, (_, i) => ({ off: i * 0.9, amp: 60 + i * 22, sp: 0.6 + i * 0.12, y: 0.25 + i * 0.12 }));
  function frame() {
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(0, 0, W, H); /* apaga devagar, mantendo o fundo transparente */
    ctx.globalCompositeOperation = 'source-over';
    lines.forEach(l => {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const k = x / W;
        const y = H * l.y + Math.sin(k * 6.28 * 1.2 + t * l.sp + l.off) * l.amp * devicePixelRatio + Math.sin(k * 12 + t * 0.7) * 14 * devicePixelRatio;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = 'rgba(198,255,0,0.45)'; ctx.lineWidth = 1.6 * devicePixelRatio; ctx.shadowColor = '#C6FF00'; ctx.shadowBlur = 10; ctx.stroke();
    });
    t += 0.012; requestAnimationFrame(frame);
  }
  frame();
})();
