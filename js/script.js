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

  /* ---------- Hero image (beranda) ---------- */
  // Hero dibuat statis agar lebih sederhana dan stabil.
  // Gambar dapat diganti cukup dengan mengganti file images/hero.jpg.
  var heroMedia = document.getElementById("heroMedia");
  if (heroMedia) {
    heroMedia.innerHTML =
      '<img class="hero-media-photo" src="images/hero.jpg" ' +
      'alt="Mahasiswa Jurusan Kesehatan Gigi sedang praktik pada phantom di laboratorium" loading="eager">';
  }


});
