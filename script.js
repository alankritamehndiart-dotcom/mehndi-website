
document.addEventListener("DOMContentLoaded", () => {
  const pageLoader = document.getElementById("pageLoader");
  const currentYear = document.getElementById("currentYear");
  const menuToggle = document.getElementById("menuToggle");
  const mainNavigation = document.getElementById("mainNavigation");

  // Keep the footer year up to date.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Hide the loading screen when the page is ready.
  const hideLoader = () => {
    if (pageLoader) {
      pageLoader.classList.add("is-loaded");
    }
  };

  window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 2200);

  // Mobile navigation.
  const closeMenu = () => {
    if (!menuToggle || !mainNavigation) return;

    mainNavigation.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNavigation.classList.toggle("nav-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        mainNavigation.classList.contains("nav-open") &&
        !mainNavigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // Reveal sections gently as visitors scroll.
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Premium photo gallery lightbox.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const galleryGroups = new Map();
  let activeGallery = [];
  let activeIndex = 0;

  document.querySelectorAll(".gallery-tile").forEach((tile) => {
    const groupName = tile.dataset.gallery || "gallery";

    if (!galleryGroups.has(groupName)) {
      galleryGroups.set(groupName, []);
    }

    galleryGroups.get(groupName).push(tile);
  });

  const showGalleryImage = (index) => {
    if (!activeGallery.length || !lightboxImage) return;

    activeIndex =
      (index + activeGallery.length) % activeGallery.length;

    const tile = activeGallery[activeIndex];
    const image = tile.querySelector("img");

    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Mehndi design";
    
    if (lightboxCaption) {
      lightboxCaption.textContent =
        image.alt || "Alankrita Mehndi Art";
    }

    if (lightboxPrev) {
      lightboxPrev.disabled = activeGallery.length < 2;
    }

    if (lightboxNext) {
      lightboxNext.disabled = activeGallery.length < 2;
    }
  };

  document.querySelectorAll(".gallery-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const groupName = tile.dataset.gallery || "gallery";
      activeGallery = galleryGroups.get(groupName) || [];
      activeIndex = activeGallery.indexOf(tile);

      showGalleryImage(activeIndex);

      if (lightbox && !lightbox.open) {
        if (typeof lightbox.showModal === "function") {
          lightbox.showModal();
        } else {
          lightbox.setAttribute("open", "");
        }
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightbox && typeof lightbox.close === "function") {
        lightbox.close();
      } else if (lightbox) {
        lightbox.removeAttribute("open");
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      showGalleryImage(activeIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      showGalleryImage(activeIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        if (typeof lightbox.close === "function") {
          lightbox.close();
        } else {
          lightbox.removeAttribute("open");
        }
      }
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        showGalleryImage(activeIndex + 1);
      } else if (event.key === "ArrowLeft") {
        showGalleryImage(activeIndex - 1);
      }
    });
  }

  // Small, subtle hero movement on desktop only.
  const hero = document.querySelector(".hero");
  const heroFrame = document.querySelector(".hero-frame-front");

  if (
    hero &&
    heroFrame &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroFrame.style.transform =
        `translate3d(${x * 7}px, ${y * 7}px, 0)`;
    });

    hero.addEventListener("pointerleave", () => {
      heroFrame.style.transform = "";
    });
  }
});
