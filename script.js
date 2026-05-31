(() => {
  const root  = document.getElementById('root');
  const url   = root.dataset.redirectUrl || '';
  const delay = Math.max(0, Number(root.dataset.delayMs || 5000));

  const arcEl  = document.getElementById('arc');
  const secsEl = document.getElementById('secs');
  const pctEl  = document.getElementById('pct');
  const wrap   = document.getElementById('ringWrap');
  const btn    = document.getElementById('dlBtn');

  const C = 2 * Math.PI * 70; // ≈ 439.8
  arcEl.style.strokeDasharray  = C;
  arcEl.style.strokeDashoffset = C;

  let t0 = performance.now(), raf = null, done = false;

  function tick(now) {
    if (done) return;
    const elapsed = now - t0;
    const ratio   = delay === 0 ? 1 : Math.min(elapsed / delay, 1);
    const secs    = Math.ceil(Math.max(0, delay - elapsed) / 1000);
    const pct     = Math.round(ratio * 100);

    arcEl.style.strokeDashoffset = C * (1 - ratio);
    secsEl.textContent = secs + 's';
    pctEl.textContent  = pct + '%';
    wrap.setAttribute('aria-valuenow', pct);

    if (elapsed >= delay) { go(); return; }
    raf = requestAnimationFrame(tick);
  }

  function go() {
    if (done) return;
    done = true;
    if (raf) cancelAnimationFrame(raf);
    if (url) window.location.assign(url);
  }

  btn.addEventListener('click', go);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); }
    else if (!done) raf = requestAnimationFrame(tick);
  });

  raf = requestAnimationFrame(tick);
})();