
/* ============================================
   ALANKRITA MEHNDI ART
   Website interactions
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // MOBILE NAVIGATION
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("nav-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      mainNav.classList.toggle("nav-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // GALLERY LIGHTBOX
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption =
    document.getElementById("lightboxCaption");
  const lightboxClose =
    document.getElementById("lightboxClose");
  const lightboxPrev =
    document.getElementById("lightboxPrev");
  const lightboxNext =
    document.getElementById("lightboxNext");

  const galleryButtons = Array.from(
    document.querySelectorAll(".gallery-tile")
  );

  let currentImageIndex = 0;
  let lastFocusedElement = null;

  function getGalleryImage(button) {
    const image = button.querySelector("img");

    return {
      src:
        button.dataset.fullImage ||
        (image ? image.currentSrc || image.src : ""),
      alt: image ? image.alt : "Mehndi design",
      caption:
        button.querySelector(".gallery-caption")?.textContent
          .trim() || "Alankrita Mehndi Art",
    };
  }

  function showGalleryImage(index) {
    if (!galleryButtons.length || !lightboxImage) return;

    currentImageIndex =
      (index + galleryButtons.length) % galleryButtons.length;

    const imageData = getGalleryImage(
      galleryButtons[currentImageIndex]
    );

    lightboxImage.src = imageData.src;
    lightboxImage.alt = imageData.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent = imageData.caption;
    }
  }

  function openLightbox(index, trigger) {
    if (!lightbox || !lightboxImage) return;

    lastFocusedElement = trigger;
    showGalleryImage(index);

    if (typeof lightbox.showModal === "function") {
      if (!lightbox.open) lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }

    document.body.classList.add("lightbox-open");

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }

    document.body.classList.remove("lightbox-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      openLightbox(index, button);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      showGalleryImage(currentImageIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      showGalleryImage(currentImageIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.open) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showGalleryImage(currentImageIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showGalleryImage(currentImageIndex + 1);
      }
    });
  }

  // SUBTLE SCROLL REVEALS
  const revealElements = document.querySelectorAll(
    ".section-heading, .value-item, .service-card, " +
    ".gallery-tile, .experience-image, .experience-content, " +
    ".faq details"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // AUTOMATIC COPYRIGHT YEAR
  const copyright = document.querySelector(".copyright");

  if (copyright) {
    copyright.innerHTML = copyright.innerHTML.replace(
      /\b202\d\b/g,
      String(new Date().getFullYear())
    );
  }

  // PREVENT EMPTY LINKS FROM JUMPING TO THE TOP
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  console.log("Alankrita Mehndi Art website is ready.");
});
