/* =========================================================
   SCRIPT.JS
   Interaksi UI dasar: menu hamburger, header sticky, kotak pencarian,
   dropdown menu, carousel hero, dan penanda menu aktif.
   Untuk pemuatan konten dari CMS, lihat js/content-loader.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Menu hamburger (HP/tablet) ---------- */
  var hamburger = document.getElementById("hamburger");
  var navMenu = document.getElementById("navMenu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("open");
    });
    navMenu.querySelectorAll(":scope > li > a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        hamburger.classList.remove("active");
      });
    });
  }

  /* ---------- Dropdown menu (Profil, Program Studi, dll) ---------- */
  document.querySelectorAll(".dropdown-toggle").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // Di layar sempit (mobile), klik dipakai untuk buka/tutup submenu.
      // Di layar lebar, submenu sudah muncul otomatis lewat hover (CSS).
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var parentLi = btn.parentElement;
        var alreadyOpen = parentLi.classList.contains("open");
        document.querySelectorAll(".nav-menu li.open").forEach(function (li) {
          if (li !== parentLi) li.classList.remove("open");
        });
        parentLi.classList.toggle("open", !alreadyOpen);
      }
    });
  });

  /* ---------- Header berubah saat discroll ---------- */
  var header = document.getElementById("mainHeader");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  /* ---------- Kotak pencarian header (buka/tutup) ---------- */
  var searchIcon = document.getElementById("searchIcon");
  var searchBox = document.getElementById("searchBox");
  if (searchIcon && searchBox) {
    searchIcon.addEventListener("click", function () {
      searchBox.classList.toggle("open");
      if (searchBox.classList.contains("open")) {
        var input = searchBox.querySelector("input");
        if (input) input.focus();
      }
    });
  }

  /* ---------- Menandai menu yang sedang aktif ---------- */
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  /* ---------- Carousel hero (beranda) ---------- */
  // Slide pertama memakai judul/subjudul dari CMS (elemen data-cms tetap
  // seperti biasa, tidak diubah oleh carousel). Slide ke-2 dan ke-3 hanya
  // dekorasi visual tambahan supaya hero terasa seperti carousel.
  var heroSlides = [
    { src: "images/hero.jpg", alt: "Mahasiswa Jurusan Kesehatan Gigi sedang praktik menggunakan phantom di laboratorium", label: "Praktik Laboratorium Kesehatan Gigi" }
  ];
  var heroMedia = document.getElementById("heroMedia");
  var heroDotsNav = document.getElementById("heroDotsNav");
  var heroPrev = document.getElementById("heroPrev");
  var heroNext = document.getElementById("heroNext");
  var heroIndex = 0;
  var heroTimer = null;

  function renderHeroSlide(i) {
    if (!heroMedia) return;
    var slide = heroSlides[i];
    heroMedia.innerHTML =
      '<img class="hero-photo" src="' + slide.src + '" alt="' + slide.alt + '" loading="eager">';
    if (heroDotsNav) {
      heroDotsNav.querySelectorAll("button").forEach(function (d, idx) {
        d.classList.toggle("active", idx === i);
      });
    }
  }

  function goToHeroSlide(i) {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    renderHeroSlide(heroIndex);
  }

  function restartHeroAutoplay() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function () { goToHeroSlide(heroIndex + 1); }, 6000);
  }

  if (heroMedia) {
    if (heroDotsNav) {
      heroDotsNav.innerHTML = heroSlides.map(function (_, idx) {
        return '<button aria-label="Slide ' + (idx + 1) + '"' + (idx === 0 ? ' class="active"' : "") + '></button>';
      }).join("");
      heroDotsNav.querySelectorAll("button").forEach(function (btn, idx) {
        btn.addEventListener("click", function () { goToHeroSlide(idx); restartHeroAutoplay(); });
      });
    }
    if (heroPrev) heroPrev.addEventListener("click", function () { goToHeroSlide(heroIndex - 1); restartHeroAutoplay(); });
    if (heroNext) heroNext.addEventListener("click", function () { goToHeroSlide(heroIndex + 1); restartHeroAutoplay(); });
    renderHeroSlide(0);
    restartHeroAutoplay();
  }

});
