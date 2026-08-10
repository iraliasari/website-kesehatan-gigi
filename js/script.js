/* =========================================================
   SCRIPT.JS
   Interaksi UI dasar: menu hamburger, header sticky, kotak pencarian,
   dan penanda menu aktif. Tidak berhubungan dengan data CMS.
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
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        hamburger.classList.remove("active");
      });
    });
  }

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

});
