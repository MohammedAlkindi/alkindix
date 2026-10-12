// alkindix.com, homepage behaviour.
// Both plots compute the Collatz map in the browser; nothing here is a static image.

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // ---------- Collatz helpers ----------
  function trajectory(n) {
    const out = [n];
    while (n !== 1) {
      n = n % 2 === 0 ? n / 2 : 3 * n + 1;
      out.push(n);
    }
    return out;
  }

  function stoppingTimes(limit) {
    const steps = new Uint16Array(limit + 1);
    for (let start = 2; start <= limit; start++) {
      let n = start;
      let count = 0;
      while (n >= start) {
        n = n % 2 === 0 ? n / 2 : 3 * n + 1;
        count++;
      }
      steps[start] = count + steps[n];
    }
    return steps;
  }

  // Deterministic seeds so the hero looks the same on every visit.
  function seeds(count) {
    const list = [27];
    let x = 20261012;
    while (list.length < count) {
      x = (x * 1103515245 + 12345) % 2147483648;
      const n = 2 + (x % 9998);
      if (!list.includes(n)) list.push(n);
    }
    return list;
  }

  function sizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: rect.width, h: rect.height };
  }

  // ---------- hero: trajectories ----------
  const hero = document.getElementById('heroPlot');
  const heroPaths = seeds(48).map(trajectory);
  const heroMaxSteps = Math.max(...heroPaths.map((p) => p.length - 1));
  const heroMaxLog = Math.log(Math.max(...heroPaths.flat()));
  let heroFrame = 0;

  function drawHero(progress) {
    if (!hero) return;
    const { ctx, w, h } = sizeCanvas(hero);
    const narrow = w < 700;
    const left = narrow ? w * 0.04 : w * 0.46;
    const right = w * 0.97;
    let top = h * 0.1;
    let bottom = h * 0.9;
    if (narrow) {
      // On phones the plot gets its own band between the links and the note.
      const base = hero.getBoundingClientRect().top;
      const linksEl = document.querySelector('.hero__links');
      const noteEl = document.querySelector('.hero__note');
      if (linksEl && noteEl) {
        top = linksEl.getBoundingClientRect().bottom - base + 28;
        bottom = noteEl.getBoundingClientRect().top - base + parseFloat(getComputedStyle(noteEl).paddingTop) - 24;
      }
    }
    const ink = css('--ink');
    const signal = css('--signal');

    ctx.clearRect(0, 0, w, h);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const project = (i, v) => [
      left + (i / heroMaxSteps) * (right - left),
      bottom - (Math.log(v) / heroMaxLog) * (bottom - top),
    ];

    heroPaths.forEach((path, k) => {
      const highlight = k === 0;
      const end = Math.max(1, Math.floor((path.length - 1) * progress));
      ctx.beginPath();
      for (let i = 0; i <= end; i++) {
        const [x, y] = project(i, path[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = highlight ? signal : ink;
      ctx.globalAlpha = highlight ? 0.95 : 0.12;
      ctx.lineWidth = highlight ? 2.2 : 1;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Fade the plot out under the text column so the copy stays readable.
    if (!narrow) {
      ctx.globalCompositeOperation = 'destination-out';
      const fade = ctx.createLinearGradient(0, 0, w * 0.72, 0);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(0.72, 'rgba(0,0,0,0.92)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function animateHero() {
    cancelAnimationFrame(heroFrame);
    if (reduceMotion.matches) {
      drawHero(1);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      drawHero(1 - Math.pow(1 - t, 3));
      if (t < 1) heroFrame = requestAnimationFrame(tick);
    };
    heroFrame = requestAnimationFrame(tick);
  }

  // ---------- ProofX: stopping times ----------
  const plot = document.getElementById('stoppingPlot');
  const LIMIT = 30000;
  let stops = null;

  function drawStopping() {
    if (!plot) return;
    if (!stops) stops = stoppingTimes(LIMIT);
    const { ctx, w, h } = sizeCanvas(plot);
    const pad = { l: 40, r: 10, t: 12, b: 28 };
    const yMax = 320;
    const ink = css('--graphite');
    const rule = css('--rule');
    const signal = css('--signal');
    const X = (n) => pad.l + (n / LIMIT) * (w - pad.l - pad.r);
    const Y = (s) => h - pad.b - (s / yMax) * (h - pad.t - pad.b);

    ctx.clearRect(0, 0, w, h);
    ctx.font = '12px "Schibsted Grotesk", system-ui, sans-serif';
    ctx.fillStyle = ink;
    ctx.strokeStyle = rule;
    ctx.lineWidth = 1;

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let s = 0; s <= 300; s += 100) {
      const y = Math.round(Y(s)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.fillText(String(s), pad.l - 8, y);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let n = 0; n <= LIMIT; n += 10000) {
      ctx.fillText(n === 0 ? '0' : `${n / 1000}k`, X(n), h - pad.b + 8);
    }

    ctx.fillStyle = signal;
    ctx.globalAlpha = 0.5;
    const size = w < 480 ? 1.2 : 1.4;
    for (let n = 1; n <= LIMIT; n++) {
      ctx.fillRect(X(n), Y(stops[n]), size, size);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- bars: grow once when seen ----------
  const bars = document.querySelector('.bars');
  if (bars) {
    bars.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
  }

  // ---------- visibility ----------
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target === plot) drawStopping();
        if (entry.target === bars) bars.classList.remove('is-pending');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    if (plot) seen.observe(plot);
    if (bars) {
      bars.classList.add('is-pending');
      seen.observe(bars);
    }
  } else {
    drawStopping();
  }

  animateHero();

  // Redraw on resize or theme change; the hero redraws at full progress.
  let resizeTimer = 0;
  const redraw = () => {
    cancelAnimationFrame(heroFrame);
    drawHero(1);
    if (stops) drawStopping();
  };
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redraw, 120);
  });
  darkScheme.addEventListener?.('change', redraw);
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (stops) drawStopping(); });

  // ---------- top bar ----------
  const top = document.querySelector('.top');
  const onScroll = () => top?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = [...document.querySelectorAll('.top__nav a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => current.observe(s));
  }
})();
