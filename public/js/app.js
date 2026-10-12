// =========================================================
// AlkindiX — Shared App Logic
// =========================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Modal backgrounds stay out of the keyboard and accessibility tree.
const navToggle = document.querySelector('.nav__toggle');
const navOverlay = document.getElementById('navOverlay');
const desktopNav = window.matchMedia('(min-width: 900px)');
const pageRegions = [...document.querySelectorAll('main, .footer')];
const headerRegions = [...document.querySelectorAll('.brand, .nav__links')];

function setBackgroundInert(active, includeHeader = false) {
  [...pageRegions, ...(includeHeader ? [document.querySelector('.nav')] : headerRegions)]
    .filter(Boolean).forEach(element => { element.inert = active; });
}

function trapFocus(event, elements) {
  if (event.key !== 'Tab' || !elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first.focus();
  }
}

function closeOverlay(restoreFocus = true) {
  if (!navOverlay || navOverlay.hidden) return;
  navOverlay.classList.remove('active');
  navOverlay.hidden = true;
  navOverlay.setAttribute('aria-hidden', 'true');
  navToggle?.classList.remove('active');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation');
  setBackgroundInert(false);
  document.body.style.overflow = '';
  if (restoreFocus) navToggle?.focus();
}

if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    if (!navOverlay.hidden) { closeOverlay(); return; }
    navOverlay.hidden = false;
    navOverlay.classList.add('active');
    navOverlay.setAttribute('aria-hidden', 'false');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation');
    setBackgroundInert(true);
    document.body.style.overflow = 'hidden';
    navOverlay.querySelector('a')?.focus();
  });
  navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeOverlay(false));
  });
  navOverlay.addEventListener('click', event => {
    if (event.target === navOverlay) closeOverlay();
  });
  document.addEventListener('keydown', event => {
    if (navOverlay.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeOverlay(); }
    trapFocus(event, [navToggle, ...navOverlay.querySelectorAll('a')]);
  });
  desktopNav.addEventListener('change', event => {
    if (event.matches) closeOverlay(false);
  });
}

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = String(new Date().getFullYear());
});

// Active nav link based on current path
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav__menu a, .nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  const hrefPath = href ? new URL(href, window.location.href).pathname.replace(/\/$/, '') : '';
  if (hrefPath === currentPath) {
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
  }
});

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
  setBackgroundInert(false, true);
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
    setBackgroundInert(true, true);
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
  if (event.key === 'Escape') { event.preventDefault(); closeLightbox(); }
  trapFocus(event, [...lightbox.querySelectorAll('button')]);
  if (event.key === 'ArrowLeft') moveLightbox(-1);
  if (event.key === 'ArrowRight') moveLightbox(1);
});

// Native anchors preserve URL history and keyboard focus.
document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    document.querySelector('.brand')?.focus({ preventScroll: true });
  });
});
