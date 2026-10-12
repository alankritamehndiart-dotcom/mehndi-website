
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    });
  });
}

const tiles = [...document.querySelectorAll('.gallery-tile')];
const lightbox = document.getElementById('lightbox');
const largeImage = document.getElementById('lightbox-image');
const caption = document.getElementById('lightbox-caption');
let current = 0;

function showPhoto(index) {
  if (!tiles.length || !largeImage) return;

  current = (index + tiles.length) % tiles.length;
  const image = tiles[current].querySelector('img');

  largeImage.src = image.src;
  largeImage.alt = image.alt;

  if (caption) {
    caption.textContent =
      tiles[current].querySelector('figcaption')?.textContent || '';
  }
}

function openPhoto(index) {
  if (!lightbox) return;

  showPhoto(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
}

function closePhoto() {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
}

tiles.forEach((tile, index) => {
  tile.addEventListener('click', () => openPhoto(index));
});

if (lightbox) {
  lightbox.querySelector('.lightbox-close')
    ?.addEventListener('click', closePhoto);

  lightbox.querySelector('.lightbox-prev')
    ?.addEventListener('click', () => showPhoto(current - 1));

  lightbox.querySelector('.lightbox-next')
    ?.addEventListener('click', () => showPhoto(current + 1));

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closePhoto();
  });
}

document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;

  if (event.key === 'Escape') closePhoto();
  if (event.key === 'ArrowRight') showPhoto(current + 1);
  if (event.key === 'ArrowLeft') showPhoto(current - 1);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.service-card, .gallery-tile, .intro, .booking, .experience-item, .faq details'
  ).forEach(item => {
    item.classList.add('reveal');
    observer.observe(item);
  });
}
