// =========================================================
// AlkindiX — Shared App Logic
// =========================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Nav overlay
const navToggle = document.querySelector('.nav__toggle');
const navOverlay = document.getElementById('navOverlay');

function closeOverlay() {
  navOverlay?.classList.remove('active');
  navToggle?.classList.remove('active');
  navToggle?.setAttribute('aria-expanded', 'false');
  navOverlay?.setAttribute('aria-hidden', 'true');
  navOverlay?.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    const open = !navOverlay.classList.contains('active');

    if (!open) {
      closeOverlay();
      return;
    }

    navOverlay.removeAttribute('hidden');
    navOverlay.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
  });
}

// ---------------------------------------------------------
// Scroll state — one rAF-batched reader, compositor-only writes
// ---------------------------------------------------------
const nav = document.querySelector('.nav');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

let scrollQueued = false;
let navScrolled = false;

function applyScroll() {
  scrollQueued = false;

  const y = window.scrollY;
  const shouldBeScrolled = y > 40;
  if (shouldBeScrolled !== navScrolled) {
    navScrolled = shouldBeScrolled;
    nav?.classList.toggle('scrolled', shouldBeScrolled);
  }

  const h = document.documentElement;
  const scrollable = h.scrollHeight - h.clientHeight;
  const progress = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
  // scaleX stays on the compositor; animating width forces layout on every frame.
  progressBar.style.transform = `scaleX(${progress})`;
}

window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(applyScroll);
}, { passive: true });

applyScroll();

// Active nav link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav__menu a, .nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  const hrefPath = href ? new URL(href, window.location.href).pathname.replace(/\/$/, '') : '';
  if (hrefPath === currentPath) {
    a.classList.add('active');
  }
});

// ---------------------------------------------------------
// Scroll reveal
// Fires as soon as an element crosses the viewport edge. The old
// -60px bottom margin plus a 10% threshold meant a tall card had to be
// well inside the fold before it started a 700ms fade, which read as lag.
// ---------------------------------------------------------
const revealTargets = document.querySelectorAll('[data-reveal]');

if (reduceMotion.matches) {
  revealTargets.forEach(el => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });

  revealTargets.forEach(el => {
    // Anything already on screen at load must not wait for a scroll event.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // Stagger children of a marked group so a list resolves in sequence
  // rather than as one slab.
  document.querySelectorAll('[data-reveal-children]').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty('--stagger', `${Math.min(i * 55, 440)}ms`);
    });
  });
}

// ---------------------------------------------------------
// Count-up for measured figures. Values come from the markup, so the
// number on screen is always the number in the HTML.
// ---------------------------------------------------------
const counters = document.querySelectorAll('[data-count]');

if (counters.length) {
  if (reduceMotion.matches) {
    counters.forEach(el => { el.textContent = el.dataset.count; });
  } else {
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const runCount = el => {
      const target = parseFloat(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const suffix = el.dataset.countSuffix || '';
      const duration = 1100;
      const start = performance.now();

      const fmt = n => n.toLocaleString('en-US');

      const step = now => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = fmt(Math.round(easeOut(t) * target)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };

      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        runCount(e.target);
        countObserver.unobserve(e.target);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => countObserver.observe(el));
  }
}

// Photography filters
document.querySelectorAll('[data-gallery-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.galleryFilter;
    const group = button.closest('[data-filter-group]');
    const gallery = document.querySelector('[data-gallery]');

    group?.querySelectorAll('[data-gallery-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    gallery?.querySelectorAll('[data-gallery-item]').forEach(item => {
      const match = filter === 'all' || item.dataset.galleryItem === filter;
      item.toggleAttribute('hidden', !match);
    });
  });
});

// ---------------------------------------------------------
// Photo lightbox
// ---------------------------------------------------------
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
const lightboxCaption = lightbox?.querySelector('[data-lightbox-caption]');
const lightboxClose = lightbox?.querySelector('[data-lightbox-close]');
const lightboxPrevious = lightbox?.querySelector('[data-lightbox-prev]');
const lightboxNext = lightbox?.querySelector('[data-lightbox-next]');
let lightboxItems = [];
let lightboxIndex = 0;
let lightboxTrigger = null;

function showLightboxImage() {
  const button = lightboxItems[lightboxIndex];
  if (!button || !lightboxImage) return;

  lightboxImage.src = button.dataset.lightboxSrc;
  lightboxImage.alt = `Photograph ${lightboxIndex + 1} of ${lightboxItems.length}`;
  if (lightboxCaption) {
    lightboxCaption.textContent = `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
  }
}

function moveLightbox(step) {
  if (!lightboxItems.length) return;
  lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
  showLightboxImage();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.setAttribute('hidden', '');
  lightboxImage?.removeAttribute('src');
  lightboxImage?.setAttribute('alt', '');
  document.body.style.overflow = '';
  lightboxTrigger?.focus();
}

document.querySelectorAll('[data-lightbox-src]').forEach(button => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxItems = [...document.querySelectorAll('[data-lightbox-src]')].filter(item => !item.hidden);
    lightboxIndex = Math.max(0, lightboxItems.indexOf(button));
    lightboxTrigger = button;
    showLightboxImage();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrevious?.addEventListener('click', () => moveLightbox(-1));
lightboxNext?.addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const behavior = reduceMotion.matches ? 'auto' : 'smooth';

    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior });
    }
  });
});
