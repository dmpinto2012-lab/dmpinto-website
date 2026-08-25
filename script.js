/* =============================================================
   DUARTE PINTO — dmpinto.com
   JavaScript principal — sem dependências externas.

   O que este ficheiro faz:
   1. Atualiza o ano no rodapé automaticamente
   2. Muda a aparência da navbar quando o utilizador faz scroll
   3. Abre/fecha o menu de navegação em telemóvel
   4. Faz scroll suave até às secções ao clicar num link do menu
   5. Anima as secções (fade/slide) à medida que entram no ecrã
      — respeita sempre "prefers-reduced-motion"
   ============================================================= */

(function () {
  "use strict";

  /* Verifica se o utilizador pediu menos animações ao sistema.
     Se sim, desativamos as animações de entrada (as secções
     aparecem logo visíveis, sem deslizar). */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* -----------------------------------------------------------
     1. ANO AUTOMÁTICO NO RODAPÉ
     ----------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* -----------------------------------------------------------
     2. NAVBAR — muda de aparência depois de X pixels de scroll
     ----------------------------------------------------------- */
  var header = document.getElementById("site-header");
  var SCROLL_THRESHOLD = 24;

  function updateHeaderOnScroll() {
    if (!header) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }
  }

  updateHeaderOnScroll();
  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });


  /* -----------------------------------------------------------
     3. MENU MOBILE (hamburguer)
     ----------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function toggleMenu() {
    if (!navToggle || !navMenu) return;
    var isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", toggleMenu);

    /* Fecha o menu automaticamente quando se clica num link */
    navMenu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    /* Fecha o menu com a tecla Escape (acessibilidade) */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }


  /* -----------------------------------------------------------
     4. SCROLL SUAVE ATÉ ÀS SECÇÕES
     (CSS já trata disto via "scroll-behavior: smooth", isto é
     apenas uma rede de segurança para browsers mais antigos e
     para garantir que o foco do teclado também se move.)
     ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      /* Move o foco para a secção de destino, por acessibilidade,
         sem voltar a fazer scroll (o scrollIntoView já tratou disso). */
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });


  /* -----------------------------------------------------------
     5. REVEAL ON SCROLL — fade/slide subtil ao entrar no ecrã
     ----------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    /* Sem animação: mostra tudo de imediato */
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
