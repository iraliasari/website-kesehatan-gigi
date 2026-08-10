/* =========================================================
   CONTENT-LOADER.JS
   Bertugas mengambil data dari file JSON di folder /content
   (yang diperbarui otomatis oleh Decap CMS) dan menampilkannya
   ke dalam halaman HTML tanpa perlu edit HTML manual.

   Semua fungsi berada di objek global "CL" (Content Loader)
   supaya mudah dipanggil dari <script> di tiap halaman.
   ========================================================= */

var CL = (function () {

  var MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  var MONTHS_SHORT_ID = ["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGT","SEP","OKT","NOV","DES"];

  /* ---------- Util dasar ---------- */

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.getDate() + " " + MONTHS_ID[d.getMonth()] + " " + d.getFullYear();
  }

  function formatDay(dateStr) {
    var d = new Date(dateStr);
    return isNaN(d) ? "--" : d.getDate();
  }

  function formatMonthShort(dateStr) {
    var d = new Date(dateStr);
    return isNaN(d) ? "---" : MONTHS_SHORT_ID[d.getMonth()];
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Mengambil satu file JSON koleksi (mis. content/berita/berita.json)
  // dan mengembalikan array "items" di dalamnya. Jika file belum ada
  // atau kosong, kembalikan array kosong (tidak membuat halaman error).
  function loadCollection(path) {
    return fetch(path, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Gagal memuat " + path);
        return res.json();
      })
      .then(function (data) {
        return Array.isArray(data.items) ? data.items : [];
      })
      .catch(function (err) {
        console.warn("[content-loader]", err.message);
        return [];
      });
  }

  // Mengambil file profil.json (bukan list, tapi objek tunggal)
  function loadProfil() {
    return fetch("content/profil/profil.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : {}; })
      .catch(function () { return {}; });
  }

  // Membuat HTML gambar: pakai foto asli jika ada, kalau tidak
  // tampilkan kotak placeholder rapi supaya tidak muncul gambar pecah.
  function imageBlock(src, label, extraClass) {
    var cls = "img-placeholder" + (extraClass ? " " + extraClass : "");
    if (src) {
      return '<img class="' + (extraClass || "") + '" src="' + escapeHTML(src) +
        '" alt="' + escapeHTML(label || "") + '" loading="lazy">';
    }
    return '<div class="' + cls + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/>' +
      '<path d="M21 15l-5-5-4 4-3-3-6 6"/></svg>' +
      '<span>' + escapeHTML(label || "Foto belum tersedia") + '</span></div>';
  }

  function el(id) { return document.getElementById(id); }

  function showLoading(container) {
    if (container) container.innerHTML = '<p class="loading-text">Memuat konten...</p>';
  }

  function showEmpty(container, msg) {
    if (container) container.innerHTML = '<p class="empty-text">' + (msg || "Belum ada konten.") + '</p>';
  }

  function sortByDateDesc(items, field) {
    field = field || "date";
    return items.slice().sort(function (a, b) {
      return new Date(b[field] || 0) - new Date(a[field] || 0);
    });
  }

  /* Konversi markdown sederhana ke HTML tanpa library eksternal.
     Mendukung: heading (## / ###), bold, italic, list (- item),
     paragraf, dan link [teks](url). Untuk kebutuhan lebih lengkap,
     marked.js (CDN) sudah disiapkan sebagai cadangan di berita-detail.html */
  function simpleMarkdown(text) {
    if (!text) return "";
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(text);
    }
    var lines = text.split("\n");
    var html = "";
    var inList = false;
    lines.forEach(function (line) {
      line = line.trim();
      if (line.startsWith("### ")) { html += "<h3>" + line.slice(4) + "</h3>"; return; }
      if (line.startsWith("## ")) { html += "<h2>" + line.slice(3) + "</h2>"; return; }
      if (line.startsWith("- ")) {
        if (!inList) { html += "<ul>"; inList = true; }
        html += "<li>" + line.slice(2) + "</li>";
        return;
      }
      if (inList) { html += "</ul>"; inList = false; }
      if (line === "") return;
      var withInline = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      html += "<p>" + withInline + "</p>";
    });
    if (inList) html += "</ul>";
    return html;
  }

  /* ---------- BERITA ---------- */

  function renderBeritaTerbaru(containerId, limit) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/berita/berita.json").then(function (items) {
      items = items.filter(function (i) { return i.published !== false; });
      items = sortByDateDesc(items);
      items = items.slice(0, limit || 3);
      if (!items.length) return showEmpty(container, "Belum ada berita yang dipublikasikan.");
      container.innerHTML = items.map(function (item) {
        return '<div class="content-card">' +
          '<div class="card-img">' + imageBlock(item.featured_image, item.title, "card-img") + '</div>' +
          '<div class="card-body">' +
            '<div class="card-meta"><span>' + escapeHTML(formatDate(item.date)) + '</span><span>' + escapeHTML(item.category || "Umum") + '</span></div>' +
            '<h3>' + escapeHTML(item.title) + '</h3>' +
            '<p>' + escapeHTML(item.excerpt || "") + '</p>' +
            '<a class="card-link" href="berita-detail.html?slug=' + encodeURIComponent(item.slug) + '">Baca Selengkapnya →</a>' +
          '</div></div>';
      }).join("");
    });
  }

  function renderBeritaList(containerId, searchInputId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/berita/berita.json").then(function (all) {
      all = sortByDateDesc(all.filter(function (i) { return i.published !== false; }));

      function draw(items) {
        if (!items.length) return showEmpty(container, "Berita tidak ditemukan.");
        container.innerHTML = items.map(function (item) {
          return '<div class="content-card">' +
            '<div class="card-img">' + imageBlock(item.featured_image, item.title, "card-img") + '</div>' +
            '<div class="card-body">' +
              '<div class="card-meta"><span>' + escapeHTML(formatDate(item.date)) + '</span><span>' + escapeHTML(item.category || "Umum") + '</span></div>' +
              '<h3>' + escapeHTML(item.title) + '</h3>' +
              '<p>' + escapeHTML(item.excerpt || "") + '</p>' +
              '<a class="card-link" href="berita-detail.html?slug=' + encodeURIComponent(item.slug) + '">Baca Selengkapnya →</a>' +
            '</div></div>';
        }).join("");
      }

      draw(all);

      var searchInput = searchInputId ? el(searchInputId) : null;
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          var q = searchInput.value.toLowerCase().trim();
          var filtered = !q ? all : all.filter(function (i) {
            return (i.title || "").toLowerCase().indexOf(q) > -1 ||
                   (i.excerpt || "").toLowerCase().indexOf(q) > -1;
          });
          draw(filtered);
        });
      }
    });
  }

  function renderBeritaDetail(containerId, relatedContainerId) {
    var container = el(containerId);
    if (!container) return;
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    showLoading(container);

    loadCollection("content/berita/berita.json").then(function (all) {
      var item = all.find(function (i) { return i.slug === slug; });
      if (!item) {
        container.innerHTML = '<p class="empty-text">Berita tidak ditemukan. ' +
          '<a class="card-link" href="berita.html">Kembali ke daftar berita</a></p>';
        return;
      }

      document.title = item.title + " | Jurusan Kesehatan Gigi Poltekkes Kemenkes Makassar";
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", item.excerpt || "");

      container.innerHTML =
        '<a href="berita.html" class="back-link">← Kembali ke Berita</a>' +
        '<div class="detail-meta"><span class="badge">' + escapeHTML(item.category || "Umum") + '</span>' +
        '<span>' + escapeHTML(formatDate(item.date)) + '</span>' +
        '<span>Oleh ' + escapeHTML(item.author || "Admin") + '</span></div>' +
        '<h1>' + escapeHTML(item.title) + '</h1>' +
        '<div class="detail-image">' + imageBlock(item.featured_image, item.title, "detail-image") + '</div>' +
        '<div class="detail-body">' + simpleMarkdown(item.body || item.excerpt || "") + '</div>';

      if (relatedContainerId) {
        var relContainer = el(relatedContainerId);
        if (relContainer) {
          var related = sortByDateDesc(all.filter(function (i) {
            return i.slug !== item.slug && i.published !== false;
          })).slice(0, 3);
          if (related.length) {
            relContainer.innerHTML = related.map(function (r) {
              return '<div class="content-card">' +
                '<div class="card-img">' + imageBlock(r.featured_image, r.title, "card-img") + '</div>' +
                '<div class="card-body">' +
                  '<div class="card-meta"><span>' + escapeHTML(formatDate(r.date)) + '</span></div>' +
                  '<h3>' + escapeHTML(r.title) + '</h3>' +
                  '<a class="card-link" href="berita-detail.html?slug=' + encodeURIComponent(r.slug) + '">Baca Selengkapnya →</a>' +
                '</div></div>';
            }).join("");
          }
        }
      }
    });
  }

  /* ---------- AGENDA ---------- */

  function agendaItemHTML(item) {
    return '<div class="agenda-item">' +
      '<div class="agenda-date"><span class="day">' + formatDay(item.date) + '</span><span class="month">' + formatMonthShort(item.date) + '</span></div>' +
      '<div><div class="agenda-extra">' + escapeHTML(item.time || "") + (item.location ? " · " + escapeHTML(item.location) : "") + '</div>' +
      '<h4>' + escapeHTML(item.title) + '</h4>' +
      '<p>' + escapeHTML(item.description || "") + '</p></div></div>';
  }

  function renderAgendaTerbaru(containerId, limit) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/agenda/agenda.json").then(function (items) {
      var now = new Date();
      items = items.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      var upcoming = items.filter(function (i) { return new Date(i.date) >= new Date(now.toDateString()); });
      var list = (upcoming.length ? upcoming : items).slice(0, limit || 3);
      if (!list.length) return showEmpty(container, "Belum ada agenda.");
      container.innerHTML = list.map(agendaItemHTML).join("");
    });
  }

  function renderAgendaList(containerId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/agenda/agenda.json").then(function (items) {
      items = items.slice().sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      if (!items.length) return showEmpty(container, "Belum ada agenda.");
      container.innerHTML = items.map(agendaItemHTML).join("");
    });
  }

  /* ---------- PRESTASI ---------- */

  function prestasiCardHTML(item) {
    return '<div class="content-card">' +
      '<div class="card-img">' + imageBlock(item.image, item.title, "card-img") + '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span>' + escapeHTML(item.level || "") + '</span><span>' + escapeHTML(item.achievement || "") + '</span></div>' +
        '<h3>' + escapeHTML(item.title) + '</h3>' +
        '<p><strong>' + escapeHTML(item.student_name || "") + '</strong> — ' + escapeHTML(item.competition || "") + '</p>' +
        '<p>' + escapeHTML(item.description || "") + '</p>' +
      '</div></div>';
  }

  function renderPrestasiTerbaru(containerId, limit) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/prestasi/prestasi.json").then(function (items) {
      items = sortByDateDesc(items).slice(0, limit || 3);
      if (!items.length) return showEmpty(container, "Belum ada prestasi yang ditambahkan.");
      container.innerHTML = items.map(prestasiCardHTML).join("");
    });
  }

  function renderPrestasiList(containerId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/prestasi/prestasi.json").then(function (items) {
      items = sortByDateDesc(items);
      if (!items.length) return showEmpty(container, "Belum ada prestasi yang ditambahkan.");
      container.innerHTML = items.map(prestasiCardHTML).join("");
    });
  }

  /* ---------- PENELITIAN ---------- */

  function renderPenelitianList(containerId, searchInputId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/penelitian/penelitian.json").then(function (all) {
      all = all.slice().sort(function (a, b) { return (b.year || 0) - (a.year || 0); });

      function draw(items) {
        if (!items.length) return showEmpty(container, "Belum ada data penelitian.");
        container.innerHTML = items.map(function (item) {
          return '<div class="list-card">' +
            '<div class="card-img">' + imageBlock(item.image, item.title, "card-img") + '</div>' +
            '<div>' +
              '<div class="card-meta"><span>' + escapeHTML(item.year || "") + '</span><span>' + escapeHTML(item.category || "") + '</span></div>' +
              '<h3>' + escapeHTML(item.title) + '</h3>' +
              '<p><strong>Peneliti:</strong> ' + escapeHTML(item.researchers || "") + '</p>' +
              '<p>' + escapeHTML(item.abstract || "") + '</p>' +
              (item.publication_url ? '<a class="card-link" href="' + escapeHTML(item.publication_url) + '" target="_blank" rel="noopener">Lihat Publikasi →</a>' : "") +
            '</div></div>';
        }).join("");
      }

      draw(all);

      var searchInput = searchInputId ? el(searchInputId) : null;
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          var q = searchInput.value.toLowerCase().trim();
          draw(!q ? all : all.filter(function (i) {
            return (i.title || "").toLowerCase().indexOf(q) > -1 ||
                   (i.abstract || "").toLowerCase().indexOf(q) > -1 ||
                   (i.researchers || "").toLowerCase().indexOf(q) > -1;
          }));
        });
      }
    });
  }

  /* ---------- PENGABDIAN MASYARAKAT ---------- */

  function renderPengabmasList(containerId, searchInputId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/pengabmas/pengabmas.json").then(function (all) {
      all = sortByDateDesc(all);

      function draw(items) {
        if (!items.length) return showEmpty(container, "Belum ada data pengabdian masyarakat.");
        container.innerHTML = items.map(function (item) {
          return '<div class="list-card">' +
            '<div class="card-img">' + imageBlock(item.image, item.title, "card-img") + '</div>' +
            '<div>' +
              '<div class="card-meta"><span>' + escapeHTML(formatDate(item.date)) + '</span><span>' + escapeHTML(item.location || "") + '</span></div>' +
              '<h3>' + escapeHTML(item.title) + '</h3>' +
              '<p><strong>Ketua Kegiatan:</strong> ' + escapeHTML(item.team || "") + '</p>' +
              '<p>' + escapeHTML(item.description || "") + '</p>' +
            '</div></div>';
        }).join("");
      }

      draw(all);

      var searchInput = searchInputId ? el(searchInputId) : null;
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          var q = searchInput.value.toLowerCase().trim();
          draw(!q ? all : all.filter(function (i) {
            return (i.title || "").toLowerCase().indexOf(q) > -1 ||
                   (i.description || "").toLowerCase().indexOf(q) > -1;
          }));
        });
      }
    });
  }

  /* ---------- GALERI ---------- */

  function renderGaleri(containerId, filterContainerId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/galeri/galeri.json").then(function (all) {
      all = sortByDateDesc(all);

      function draw(items) {
        if (!items.length) return showEmpty(container, "Belum ada foto di galeri.");
        container.innerHTML = items.map(function (item) {
          return '<div class="gallery-item">' +
            imageBlock(item.image, item.title) +
            '<div class="gallery-overlay"><span>' + escapeHTML(item.caption || item.title || "") + '</span></div>' +
          '</div>';
        }).join("");
      }

      draw(all);

      var filterContainer = filterContainerId ? el(filterContainerId) : null;
      if (filterContainer) {
        var categories = ["Semua"];
        all.forEach(function (i) { if (i.category && categories.indexOf(i.category) === -1) categories.push(i.category); });
        filterContainer.innerHTML = categories.map(function (c, idx) {
          return '<button class="filter-tab' + (idx === 0 ? " active" : "") + '" data-cat="' + escapeHTML(c) + '">' + escapeHTML(c) + '</button>';
        }).join("");
        filterContainer.querySelectorAll(".filter-tab").forEach(function (btn) {
          btn.addEventListener("click", function () {
            filterContainer.querySelectorAll(".filter-tab").forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            var cat = btn.getAttribute("data-cat");
            draw(cat === "Semua" ? all : all.filter(function (i) { return i.category === cat; }));
          });
        });
      }
    });
  }

  /* ---------- DOWNLOAD ---------- */

  function renderDownloadList(containerId, searchInputId, filterContainerId) {
    var container = el(containerId);
    if (!container) return;
    showLoading(container);
    loadCollection("content/download/download.json").then(function (all) {
      all = all.slice().sort(function (a, b) { return (b.year || 0) - (a.year || 0); });

      function draw(items) {
        if (!items.length) return showEmpty(container, "Belum ada dokumen yang diunggah.");
        container.innerHTML =
          '<table class="download-table"><thead><tr>' +
          '<th>Nama Dokumen</th><th>Kategori</th><th>Tahun</th><th>Keterangan</th><th></th>' +
          '</tr></thead><tbody>' +
          items.map(function (item) {
            return "<tr><td>" + escapeHTML(item.title) + "</td>" +
              "<td><span class=\"badge\">" + escapeHTML(item.category || "") + "</span></td>" +
              "<td>" + escapeHTML(item.year || "") + "</td>" +
              "<td>" + escapeHTML(item.description || "") + "</td>" +
              "<td>" + (item.file ? '<a class="btn btn-navy btn-small" href="' + escapeHTML(item.file) + '" target="_blank" rel="noopener">Unduh</a>' : "-") + "</td></tr>";
          }).join("") +
          "</tbody></table>";
      }

      draw(all);

      var searchInput = searchInputId ? el(searchInputId) : null;
      var filterContainer = filterContainerId ? el(filterContainerId) : null;
      var currentCat = "Semua";

      function applyFilters() {
        var q = searchInput ? searchInput.value.toLowerCase().trim() : "";
        var filtered = all.filter(function (i) {
          var matchCat = currentCat === "Semua" || i.category === currentCat;
          var matchQ = !q || (i.title || "").toLowerCase().indexOf(q) > -1 || (i.description || "").toLowerCase().indexOf(q) > -1;
          return matchCat && matchQ;
        });
        draw(filtered);
      }

      if (searchInput) searchInput.addEventListener("input", applyFilters);

      if (filterContainer) {
        var categories = ["Semua"];
        all.forEach(function (i) { if (i.category && categories.indexOf(i.category) === -1) categories.push(i.category); });
        filterContainer.innerHTML = categories.map(function (c, idx) {
          return '<button class="filter-tab' + (idx === 0 ? " active" : "") + '" data-cat="' + escapeHTML(c) + '">' + escapeHTML(c) + '</button>';
        }).join("");
        filterContainer.querySelectorAll(".filter-tab").forEach(function (btn) {
          btn.addEventListener("click", function () {
            filterContainer.querySelectorAll(".filter-tab").forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            currentCat = btn.getAttribute("data-cat");
            applyFilters();
          });
        });
      }
    });
  }

  /* ---------- PROFIL JURUSAN (konten statis via CMS) ---------- */

  // Mengisi otomatis semua elemen yang punya atribut data-cms="nama_field"
  // dengan isi dari content/profil/profil.json. Contoh pemakaian di HTML:
  // <p data-cms="sejarah">Teks sementara...</p>
  function bindProfil() {
    var targets = document.querySelectorAll("[data-cms]");
    if (!targets.length) return;
    loadProfil().then(function (data) {
      targets.forEach(function (elm) {
        var field = elm.getAttribute("data-cms");
        if (data[field] !== undefined && data[field] !== "") {
          elm.innerHTML = escapeHTML(data[field]).replace(/\n/g, "<br>");
        }
      });
    });
  }

  return {
    formatDate: formatDate,
    renderBeritaTerbaru: renderBeritaTerbaru,
    renderBeritaList: renderBeritaList,
    renderBeritaDetail: renderBeritaDetail,
    renderAgendaTerbaru: renderAgendaTerbaru,
    renderAgendaList: renderAgendaList,
    renderPrestasiTerbaru: renderPrestasiTerbaru,
    renderPrestasiList: renderPrestasiList,
    renderPenelitianList: renderPenelitianList,
    renderPengabmasList: renderPengabmasList,
    renderGaleri: renderGaleri,
    renderDownloadList: renderDownloadList,
    bindProfil: bindProfil
  };

})();

document.addEventListener("DOMContentLoaded", function () {
  CL.bindProfil();
});
