// =========================================================
// PhotographyX — Gallery Controller (Robust)
// =========================================================

// Change this if your folder is not named "images"
const IMAGES_DIR = 'images';

// Maximum number of images to scan per prefix
const MAX_IMAGES = 50;

// Try these extensions (case-sensitive hosts safe)
const EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG'];

// Optional captions
const imageCaptions = {
  // Horizontal images
  'h1': 'Terraced order at dusk',
  'h2': 'Geometry across hillsides',
  'h3': 'Light mapping structure',

  // Vertical images
  'v1': 'Human scale in symmetry',
  'v2': 'Vertical tension in light',
  'v3': 'Silence between forms',
};

// Arrays to store loaded images
let horizontalImages = [];
let verticalImages = [];

// DOM elements
const horizontalGallery = document.querySelector('.horizontal-gallery');
const verticalGallery = document.querySelector('.vertical-gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('closeBtn');

// Build a URL that works even if the site is hosted under a subpath
function toAbsoluteUrl(relativePath) {
  return new URL(relativePath, window.location.href).toString();
}

// Check if an image exists
function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Find the first existing file for a base name across extensions
async function firstExistingSrc(baseName) {
  for (const ext of EXTENSIONS) {
    const candidate = toAbsoluteUrl(`${IMAGES_DIR}/${baseName}.${ext}`);
    if (await imageExists(candidate)) return candidate;
  }
  return null;
}

// Load images for a prefix: h1..hN or v1..vN
async function loadSeries(prefix) {
  const images = [];

  for (let i = 1; i <= MAX_IMAGES; i++) {
    const filename = `${prefix}${i}`;
    const src = await firstExistingSrc(filename);

    if (src) {
      images.push({
        src,
        caption: imageCaptions[filename] || ''
      });
    }
    // IMPORTANT: do NOT break. Keep scanning even if a number is missing.
  }

  console.log(`[PhotographyX] Loaded ${prefix}-images:`, images.map(x => x.src));
  return images;
}

// Create image element with click handler
function createImageElement(image) {
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.caption || 'Photography';
  img.loading = 'lazy';
  img.addEventListener('click', () => openLightbox(image));
  return img;
}

// Populate gallery
function populateGallery(images, container) {
  if (!container) return;

  container.innerHTML = '';

  if (images.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.textContent = 'No images found';
    placeholder.style.opacity = '0.5';
    placeholder.style.textAlign = 'center';
    placeholder.style.gridColumn = '1 / -1';
    container.appendChild(placeholder);
    return;
  }

  images.forEach(image => container.appendChild(createImageElement(image)));
}

// Open lightbox
function openLightbox(image) {
  lightboxImg.src = image.src;
  lightboxImg.alt = image.caption || 'Photography';
  lightboxCaption.textContent = image.caption || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

// Initialize galleries
async function initGalleries() {
  if (horizontalGallery) {
    horizontalGallery.innerHTML =
      '<p style="opacity: 0.5; text-align: center; grid-column: 1 / -1;">Loading...</p>';
  }
  if (verticalGallery) {
    verticalGallery.innerHTML =
      '<p style="opacity: 0.5; text-align: center; grid-column: 1 / -1;">Loading...</p>';
  }

  horizontalImages = await loadSeries('h');
  verticalImages = await loadSeries('v');

  populateGallery(horizontalImages, horizontalGallery);
  populateGallery(verticalImages, verticalGallery);

  // Observe images after render
  setTimeout(() => {
    document.querySelectorAll('.gallery img').forEach(img => imageObserver.observe(img));
  }, 100);
}

// Close button
if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

// Click outside image to close
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Escape key closes lightbox
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

// =========================================================
// Mobile Navigation
// =========================================================

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// =========================================================
// Smooth Scroll
// =========================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href === '#' || href === '#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// =========================================================
// Active Nav Highlighting
// =========================================================

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute('id');

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${sectionId}`) item.classList.add('active');
      });
    }
  });
}

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
  scrollTimeout = window.requestAnimationFrame(() => highlightNavOnScroll());
});

// =========================================================
// Image Loading Animation
// =========================================================

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.opacity = '0';
      img.style.transform = 'scale(0.95)';

      setTimeout(() => {
        img.style.transition = 'all 0.6s ease';
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 100);

      imageObserver.unobserve(img);
    }
  });
}, { threshold: 0.1, rootMargin: '50px' });

// =========================================================
// Initialize Everything
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initGalleries();
  highlightNavOnScroll();
});
