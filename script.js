
const tiles = [...document.querySelectorAll(".gallery-tile")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
let currentPhoto = 0;

function showPhoto(index) {
  if (!tiles.length || !lightbox || !lightboxImage) return;
  currentPhoto = (index + tiles.length) % tiles.length;

  const tile = tiles[currentPhoto];
  const image = tile.querySelector("img");
  lightboxImage.src = tile.dataset.full || image.src;
  lightboxImage.alt = image.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
}

tiles.forEach((tile, index) => {
  tile.addEventListener("click", () => showPhoto(index));
});

document.querySelector(".lightbox-close")?.addEventListener("click", closePhoto);
document.querySelector(".lightbox-prev")?.addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector(".lightbox-next")?.addEventListener("click", () => showPhoto(currentPhoto + 1));

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closePhoto();
});

document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closePhoto();
  if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

// Pause moving elements while a visitor interacts with the gallery.
tiles.forEach(tile => {
  tile.addEventListener("pointerdown", () => tile.classList.add("is-paused"));
  tile.addEventListener("pointerleave", () => tile.classList.remove("is-paused"));
});

// Gentle reveal animation for sections as they enter the screen.
const revealItems = document.querySelectorAll(
  ".service-card, .social-card, .section-heading, .story"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => {
    item.classList.add("reveal-ready");
    observer.observe(item);
  });
}
