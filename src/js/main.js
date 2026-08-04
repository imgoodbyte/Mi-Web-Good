/* =============================================
   GOOD PORTFOLIO — JavaScript
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // CURSOR PERSONALIZADO
  // ==============================
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");

  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Cursor dot sigue inmediato
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  // Cursor ring con suavizado
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect en interactivos
  const hoverTargets = document.querySelectorAll(
    "a, button, .service__card, .collaboration__card, .project__card, .skill-tag",
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor--hover"),
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor--hover"),
    );
  });

  // ==============================
  // NAVBAR — scroll & active link
  // ==============================
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("nav--scrolled");
    } else {
      navbar.classList.remove("nav--scrolled");
    }
    updateActiveLink();
    toggleBtnTop();
  });

  // Active nav link según sección visible
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  function updateActiveLink() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Smooth scroll para links del nav
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
        // Cerrar drawer si está abierto
        closeDrawer();
      }
    });
  });

  // ==============================
  // MOBILE DRAWER
  // ==============================
  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const navOverlay = document.getElementById("navOverlay");

  function openDrawer() {
    navDrawer.classList.add("is-open");
    navOverlay.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    navDrawer.classList.remove("is-open");
    navOverlay.classList.remove("is-active");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  navOverlay.addEventListener("click", closeDrawer);

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // ==============================
  // REVEAL ON SCROLL
  // ==============================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Opcional: dejar de observar una vez revelado
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Trigger inmediato para elementos ya visibles (hero)
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      setTimeout(() => el.classList.add("is-visible"), 100);
    }
  });

  // ==============================
  // CARRUSEL DE COLABORACIONES
  // ==============================
  document.querySelectorAll("[data-collaboration-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".collaboration__track");
    const slides = Array.from(
      carousel.querySelectorAll("[data-collaboration-slide]"),
    );
    const controls = carousel.querySelector(".collaboration__controls");
    const dotsWrap = carousel.querySelector(".collaboration__dots");
    const counter = carousel.querySelector(".collaboration__counter");
    const prevButton = carousel.querySelector(".collaboration__arrow--prev");
    const nextButton = carousel.querySelector(".collaboration__arrow--next");

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    const dots = slides.map((slide, index) => {
      slide.setAttribute("aria-roledescription", "diapositiva");
      slide.setAttribute("aria-label", `${slide.getAttribute("aria-label") || "Empresa"}, ${index + 1} de ${slides.length}`);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "collaboration__dot";
      dot.setAttribute("aria-label", `Ver empresa ${index + 1}`);
      dot.addEventListener("click", () => showSlide(index));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function showSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        const isInactive = slideIndex !== currentSlide;
        slide.setAttribute("aria-hidden", String(isInactive));
        slide.inert = isInactive;
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === currentSlide);
        dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
      });
      if (counter) counter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    if (slides.length > 1 && controls) {
      controls.hidden = false;
      prevButton?.addEventListener("click", () => showSlide(currentSlide - 1));
      nextButton?.addEventListener("click", () => showSlide(currentSlide + 1));

      carousel.setAttribute("tabindex", "0");
      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
        if (event.key === "ArrowRight") showSlide(currentSlide + 1);
      });

      carousel.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.changedTouches[0].clientX;
        },
        { passive: true },
      );
      carousel.addEventListener(
        "touchend",
        (event) => {
          touchEndX = event.changedTouches[0].clientX;
          const distance = touchEndX - touchStartX;
          if (Math.abs(distance) < 45) return;
          showSlide(distance > 0 ? currentSlide - 1 : currentSlide + 1);
        },
        { passive: true },
      );
    }

    showSlide(0);
  });

  // ==============================
  // BACK TO TOP
  // ==============================
  const btnTop = document.getElementById("btnTop");

  function toggleBtnTop() {
    if (window.scrollY > 400) {
      btnTop.classList.add("is-visible");
    } else {
      btnTop.classList.remove("is-visible");
    }
  }

  btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==============================
  // CONTACT FORM
  // ==============================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const span = btn.querySelector("span");
      const initialText = "Enviar mensaje";

      // Estado loading
      btn.disabled = true;
      span.textContent = "Enviando...";
      btn.style.opacity = "0.7";

      try {
        const formData = new FormData(contactForm);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        let response;

        try {
          response = await fetch(
            window.GOOD_CONFIG?.contactApiUrl || "/api/contact",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message"),
                website: formData.get("website"),
              }),
              signal: controller.signal,
            },
          );
        } finally {
          clearTimeout(timeoutId);
        }

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const apiError = new Error(
            result.message || "No se pudo enviar el mensaje.",
          );
          apiError.isContactApiError = true;
          throw apiError;
        }

        span.textContent = result.message || "¡Mensaje enviado! ✓";
        btn.style.background = "#16A34A";
        btn.style.boxShadow = "0 4px 24px rgba(22, 163, 74, 0.4)";
        contactForm.reset();

        setTimeout(() => {
          span.textContent = initialText;
          btn.disabled = false;
          btn.style.opacity = "";
          btn.style.background = "";
          btn.style.boxShadow = "";
        }, 3000);
      } catch (error) {
        span.textContent =
          error.name === "AbortError"
            ? "El envío tardó demasiado. Intenta otra vez."
            : error.isContactApiError
              ? error.message
              : "No se pudo conectar. Intenta otra vez.";
        btn.style.background = "#DC2626";
        btn.style.boxShadow = "0 4px 24px rgba(220, 38, 38, 0.35)";

        setTimeout(() => {
          span.textContent = initialText;
          btn.disabled = false;
          btn.style.opacity = "";
          btn.style.background = "";
          btn.style.boxShadow = "";
        }, 4000);
      }
    });
  }

  // ==============================
  // PARALLAX SUAVE EN HERO ORBS
  // ==============================
  const orbs = document.querySelectorAll(".hero__orb");

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.08;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ==============================
  // CARDS TILT EFFECT (desktop)
  // ==============================
  if (window.matchMedia("(hover: hover)").matches) {
    const tiltCards = document.querySelectorAll(
      ".service__card, .project__card",
    );

    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.transition = "transform 0.1s ease";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      });
    });
  }

  // ==============================
  // HERO BADGE — actualizar estado
  // ==============================
  // Puedes conectar esto a una API real o lógica de disponibilidad
  const badgeDot = document.querySelector(".hero__badge-dot");
  if (badgeDot) {
    // Parpadeo de "online"
    badgeDot.style.animation = "pulse 2s infinite";
  }
});
