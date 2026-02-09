// =========================================================
// AlkindiX — Elevated Interactive Behaviors
// Sophisticated animations & micro-interactions
// =========================================================

// ==================== UTILITIES ====================

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ==================== MOBILE NAVIGATION ====================

const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
    }
  });
}

// ==================== SMOOTH SCROLL ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ==================== SCROLL-BASED NAV HIGHLIGHTING ====================

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav__links a[href^="#"]');

function highlightNavOnScroll() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
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

// ==================== SCROLL REVEAL ANIMATIONS ====================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const revealElements = document.querySelectorAll('.card, .project-card, .hero__wrap');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => {
  el.classList.add('reveal-element');
  observer.observe(el);
});

// ==================== PARALLAX HERO ====================

const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero__wrap');

const parallaxHero = throttle(() => {
  if (!hero || window.innerWidth < 768) return;
  
  const scrolled = window.pageYOffset;
  const heroHeight = hero.offsetHeight;
  
  if (scrolled < heroHeight) {
    const opacity = 1 - (scrolled / heroHeight) * 0.8;
    const translateY = scrolled * 0.3;
    
    if (heroContent) {
      heroContent.style.transform = `translateY(${translateY}px)`;
      heroContent.style.opacity = opacity;
    }
  }
}, 10);

// ==================== MAGNETIC BUTTONS ====================

const magneticButtons = document.querySelectorAll('.btn, .project-card');

magneticButtons.forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transition = 'none';
  });

  button.addEventListener('mousemove', function(e) {
    if (window.innerWidth < 768) return;
    
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = x * 0.15;
    const moveY = y * 0.15;
    
    this.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  button.addEventListener('mouseleave', function() {
    this.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    this.style.transform = 'translate(0, 0)';
  });
});

// ==================== CURSOR TRAIL (Desktop only) ====================

let cursorTrail = null;
let cursorX = 0;
let cursorY = 0;
let isHovering = false;

if (window.innerWidth > 768) {
  cursorTrail = document.createElement('div');
  cursorTrail.className = 'cursor-trail';
  document.body.appendChild(cursorTrail);

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Detect hovering over interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      cursorTrail?.classList.add('cursor-trail--hover');
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      cursorTrail?.classList.remove('cursor-trail--hover');
    });
  });

  // Smooth cursor trail animation
  function animateCursor() {
    if (cursorTrail) {
      cursorTrail.style.left = cursorX + 'px';
      cursorTrail.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ==================== HEADER BLUR ON SCROLL ====================

const header = document.querySelector('.nav');
let lastScroll = 0;

const handleHeaderScroll = throttle(() => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
  
  // Auto-hide header on scroll down, show on scroll up
  if (currentScroll > lastScroll && currentScroll > 100) {
    header?.classList.add('hidden');
  } else {
    header?.classList.remove('hidden');
  }
  
  lastScroll = currentScroll;
}, 100);

// ==================== TEXT GRADIENT ANIMATION ====================

const heroTitle = document.querySelector('.hero__h1');

if (heroTitle) {
  let gradientPosition = 0;
  
  setInterval(() => {
    gradientPosition = (gradientPosition + 1) % 360;
    heroTitle.style.backgroundImage = `linear-gradient(${gradientPosition}deg, #ffffff 0%, #c0c0c0 50%, #ffffff 100%)`;
  }, 50);
}

// ==================== PROJECT CARD TILT EFFECT ====================

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth < 768) return;
    
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ==================== SCROLL PROGRESS INDICATOR ====================

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

const updateScrollProgress = throttle(() => {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.pageYOffset / windowHeight) * 100;
  progressBar.style.width = scrolled + '%';
}, 10);

// ==================== TYPEWRITER EFFECT FOR HERO SUBTITLE ====================

const heroSub = document.querySelector('.hero__sub');
if (heroSub) {
  const originalText = heroSub.textContent;
  heroSub.textContent = '';
  heroSub.style.opacity = '1';
  
  let charIndex = 0;
  
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (charIndex < originalText.length) {
        heroSub.textContent += originalText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30);
  }, 500);
}

// ==================== EASTER EGG: KONAMI CODE ====================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join('') === konamiSequence.join('')) {
    document.body.classList.add('matrix-mode');
    setTimeout(() => {
      document.body.classList.remove('matrix-mode');
    }, 5000);
  }
});

// ==================== EVENT LISTENERS ====================

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    highlightNavOnScroll();
    parallaxHero();
    handleHeaderScroll();
    updateScrollProgress();
  });
});

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  highlightNavOnScroll();
  
  // Preload animation for page
  document.body.classList.add('loaded');
  
  // Add stagger delay to project cards
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });
});

// ==================== ACCESSIBILITY ====================

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  
  // Disable parallax and complex animations
  revealElements.forEach(el => {
    el.classList.add('revealed');
  });
}

// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});