// PhotographyX — Gallery Controller

const horizontalImages = [
  { src: 'images/h1.jpg', caption: 'Terraced order at dusk' },
  { src: 'images/h2.jpg', caption: 'Geometry across hillsides' },
  { src: 'images/h3.jpg', caption: 'Light mapping structure' }
];

const verticalImages = [
  { src: 'images/v1.jpg', caption: 'Human scale in symmetry' },
  { src: 'images/v2.jpg', caption: 'Vertical tension in light' },
  { src: 'images/v3.jpg', caption: 'Silence between forms' }
];

const horizontalGallery = document.querySelector('.horizontal-gallery');
const verticalGallery = document.querySelector('.vertical-gallery');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('closeBtn');

function createImageElement(image) {
  const img = document.createElement('img');
  img.src = image.src;
  img.alt = image.caption;
  img.loading = 'lazy';

  img.addEventListener('click', () => {
    lightboxImg.src = image.src;
    lightboxCaption.textContent = image.caption;
    lightbox.classList.add('active');
  });

  return img;
}

function populateGallery(images, container) {
  images.forEach(image => {
    const imgEl = createImageElement(image);
    container.appendChild(imgEl);
  });
}

populateGallery(horizontalImages, horizontalGallery);
populateGallery(verticalImages, verticalGallery);

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
  lightboxImg.src = '';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }
});

// Escape key closes lightbox
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
  }
});