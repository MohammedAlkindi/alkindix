// =========================================================
// PhotographyX — Gallery Controller
// =========================================================

// Image arrays with new naming convention
const horizontalImages = [
  { src: 'images/h1.jpg', caption: 'Terraced order at dusk' },
  { src: 'images/h2.jpg', caption: 'Geometry across hillsides' },
  { src: 'images/h3.jpg', caption: 'Light mapping structure' },
  { src: 'images/h4.jpg', caption: 'Patterns in architecture' },
  { src: 'images/h5.jpg', caption: 'Horizon lines and symmetry' },
  { src: 'images/h6.jpg', caption: 'Natural tessellation' }
];

const verticalImages = [
  { src: 'images/v1.jpg', caption: 'Human scale in symmetry' },
  { src: 'images/v2.jpg', caption: 'Vertical tension in light' },
  { src: 'images/v3.jpg', caption: 'Silence between forms' },
  { src: 'images/v4.jpg', caption: 'Ascending structures' },
  { src: 'images/v5.jpg', caption: 'Shadow and repetition' },
  { src: 'images/v6.jpg', caption: 'Compressed perspectives' }
];

// DOM elements
const horizontalGallery = document.querySelector('.horizontal-gallery');
const verticalGallery = document.querySelector('.vertical-gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('closeBtn');

// Create image element with click handler
function createImageElement(image) {
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.caption;
  img.loading = 'lazy';

  img.addEventListener('click', () => {
    openLightbox(image);
  });

  return img;
}

// Populate gallery
function populateGallery(images, container) {
  if (!container) return;
  
  images.forEach(image => {
    const imgEl = createImageElement(image);
    container.appendChild(imgEl);
  });
}

// Open lightbox
function openLightbox(image) {
  lightboxImg.src = image.src;
  lightboxImg.alt = image.caption;
  lightboxCaption.textContent = image.caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear image after animation
  setTimeout(() => {
    lightboxImg.src = '';
  }, 300);
}

// Initialize galleries
populateGallery(horizontalImages, horizontalGallery);
populateGallery(verticalImages, verticalGallery);

// Close button
if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
}

// Click outside image to close
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Escape key closes lightbox
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
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

  // Close mobile nav when any link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav when clicking outside
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
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
        if (item.getAttribute('href') === `#${sectionId}`) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Throttle scroll event
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    highlightNavOnScroll();
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  highlightNavOnScroll();
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
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

// Observe all gallery images
setTimeout(() => {
  document.querySelectorAll('.gallery img').forEach(img => {
    imageObserver.observe(img);
  });
}, 100);