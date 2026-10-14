
/* =========================================================
   ALANKRITA MEHNDI ART
   Luxury Website Interactions
   ========================================================= */

(() => {
  "use strict";

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const body = document.body;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------- Page loader ---------- */

    const pageLoader = document.getElementById("pageLoader");

    const hideLoader = () => {
      if (pageLoader) {
        pageLoader.classList.add("is-loaded");
        pageLoader.setAttribute("aria-hidden", "true");
      }
    };

    window.addEventListener("load", hideLoader, { once: true });

    // Prevent the loader from remaining visible if a photo loads slowly.
    window.setTimeout(hideLoader, 2500);

    /* ---------- Copyright year ---------- */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
      currentYear.textContent = new Date().getFullYear();
    }

    /* ---------- Mobile navigation ---------- */

    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    const closeMenu = () => {
      if (!menuToggle || !mainNavigation) return;

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      mainNavigation.classList.remove("nav-open");
      body.classList.remove("menu-is-open");
    };

    if (menuToggle && mainNavigation) {
      menuToggle.addEventListener("click", () => {
        const isOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute(
          "aria-label",
          isOpen ? "Open navigation" : "Close navigation"
        );

        mainNavigation.classList.toggle("nav-open", !isOpen);
        body.classList.toggle("menu-is-open", !isOpen);
      });

      mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });

      document.addEventListener("click", (event) => {
        if (
          menuToggle.getAttribute("aria-expanded") === "true" &&
          !mainNavigation.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {
          closeMenu();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 800) closeMenu();
      });
    }

    /* ---------- Scroll reveal animations ---------- */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -35px 0px"
        }
      );

      revealElements.forEach((element, index) => {
        // Small stagger for grouped cards, without long delays.
        if (element.matches(".collection-card, .gallery-tile")) {
          element.style.transitionDelay = `${(index % 4) * 65}ms`;
        }

        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    }

    /* ---------- Photo gallery data ---------- */

    const galleryData = {
      premium: {
        title: "Premium Bridal",
        photos: [
          "Premium.bridal.1.jpg",
          "Premium.bridal.2.jpg",
          "Premium.bridal.3.jpg",
          "Premium.bridal.4.JPG"
        ]
      },
      bridal: {
        title: "Bridal",
        photos: [
          "Bridal.1.JPG",
          "Bridal.2.jpg",
          "Bridal.3.jpg",
          "Bridal.4.jpg"
        ]
      },
      arabic: {
        title: "Arabic",
        photos: [
          "Arabic.1.JPG",
          "Arabic.2.JPG",
          "Arabic.3.JPG",
          "Arabic.4.JPG"
        ]
      },
      indian: {
        title: "Indian",
        photos: [
          "Indian.1.JPG",
          "Indian.2.JPG",
          "Indian.3.JPG",
          "Indian.4.JPG"
        ]
      },
      mandala: {
        title: "Mandala",
        photos: [
          "Mandal.1.JPG",
          "Mandal.2.JPG",
          "Mandal.3.JPG",
          "Mandal.4.JPG"
        ]
      }
    };

    /* ---------- Full-screen gallery viewer ---------- */

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let activeGallery = null;
    let activeIndex = 0;
    let lastFocusedElement = null;

    const getActivePhotos = () => {
      if (!activeGallery || !galleryData[activeGallery]) return [];
      return galleryData[activeGallery].photos;
    };

    const updateLightbox = () => {
      if (!lightboxImage || !lightboxCaption) return;

      const photos = getActivePhotos();
      if (!photos.length) return;

      activeIndex = (activeIndex + photos.length) % photos.length;

      const gallery = galleryData[activeGallery];

      lightboxImage.src = photos[activeIndex];
      lightboxImage.alt =
        `${gallery.title} mehndi design, photo ${activeIndex + 1}`;

      lightboxCaption.textContent =
        `${gallery.title} · ${String(activeIndex + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

      if (lightboxPrev) {
        lightboxPrev.disabled = photos.length < 2;
      }

      if (lightboxNext) {
        lightboxNext.disabled = photos.length < 2;
      }
    };

    const openLightbox = (galleryName, index, trigger) => {
      if (!lightbox || !galleryData[galleryName]) return;

      activeGallery = galleryName;
      activeIndex = index;
      lastFocusedElement = trigger;

      updateLightbox();

      if (typeof lightbox.showModal === "function") {
        if (!lightbox.open) lightbox.showModal();
      } else {
        // Fallback for browsers without native dialog support.
        lightbox.setAttribute("open", "");
      }

      body.classList.add("lightbox-is-open");

      if (lightboxClose) lightboxClose.focus();
    };

    const closeLightbox = () => {
      if (!lightbox) return;

      if (typeof lightbox.close === "function" && lightbox.open) {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
      }

      body.classList.remove("lightbox-is-open");

      if (lastFocusedElement) {
        lastFocusedElement.focus({ preventScroll: true });
      }
    };

    document.querySelectorAll(".gallery-tile[data-gallery]").forEach((tile) => {
      tile.addEventListener("click", () => {
        const galleryName = tile.dataset.gallery;
        const index = Number.parseInt(tile.dataset.index, 10);

        if (!Number.isInteger(index)) return;

        openLightbox(galleryName, index, tile);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", () => {
        activeIndex -= 1;
        updateLightbox();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", () => {
        activeIndex += 1;
        updateLightbox();
      });
    }

    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        // Close when the backdrop itself is tapped.
        if (event.target === lightbox) closeLightbox();
      });

      lightbox.addEventListener("close", () => {
        body.classList.remove("lightbox-is-open");
      });

      document.addEventListener("keydown", (event) => {
        if (!lightbox.open) return;

        if (event.key === "ArrowRight") {
          event.preventDefault();
          activeIndex += 1;
          updateLightbox();
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          activeIndex -= 1;
          updateLightbox();
        }
      });
    }

    /* ---------- Gentle 3D hero movement ---------- */

    const heroVisual = document.querySelector(".hero-visual");
    const heroFrame = document.querySelector(".hero-frame-front");

    const canUseFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (
      heroVisual &&
      heroFrame &&
      canUseFinePointer &&
      !reducedMotion
    ) {
      let animationFrame = null;

      heroVisual.addEventListener("pointermove", (event) => {
        const bounds = heroVisual.getBoundingClientRect();

        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;

        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        animationFrame = window.requestAnimationFrame(() => {
          heroFrame.style.transform =
            `rotateY(${x * 7}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
        });
      });

      heroVisual.addEventListener("pointerleave", () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        heroFrame.style.transform = "";
      });
    }

    /* ---------- Gentle collection card depth ---------- */

    const collectionCards = document.querySelectorAll(".collection-card");

    if (canUseFinePointer && !reducedMotion) {
      collectionCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const bounds = card.getBoundingClientRect();

          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;

          card.style.transform =
            `perspective(1000px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
          card.style.transform = "";
        });
      });
    }

    /* ---------- Smooth internal navigation ---------- */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        // Keep the URL useful without jumping the page.
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", href);
        }
      });
    });

    /* ---------- Image fallback ---------- */

    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", () => {
        // Keep the layout intact if a file is missing.
        img.classList.add("image-load-error");
      });
    });

    /* ---------- Optional decorative sparkle creation ---------- */

    const hero = document.querySelector(".hero");

    if (hero && !reducedMotion) {
      const sparkleContainer = document.createElement("div");
      sparkleContainer.className = "hero-sparkle-layer";
      sparkleContainer.setAttribute("aria-hidden", "true");

      for (let i = 0; i < 7; i += 1) {
        const sparkle = document.createElement("span");
        sparkle.className = "generated-sparkle";
        sparkle.textContent = i % 2 === 0 ? "✧" : "·";
        sparkle.style.setProperty("--sparkle-index", String(i));
        sparkleContainer.appendChild(sparkle);
      }

      hero.appendChild(sparkleContainer);
    }

    console.info("Alankrita Mehndi Art: interactions initialized.");
  });
})();
