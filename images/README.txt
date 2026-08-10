PANDUAN FOLDER IMAGES
======================

Folder ini untuk foto-foto "tetap" yang jarang berubah (logo, foto hero,
foto gedung, foto ketua jurusan). Foto-foto KONTEN (berita, agenda,
prestasi, galeri, dll) TIDAK perlu ditaruh manual di sini — itu otomatis
masuk ke folder images/uploads/ setiap kali staf mengunggah lewat CMS.

Cara mengganti foto placeholder tetap:

1. Simpan foto ke folder ini dengan nama:
   - logo.png            -> logo resmi Poltekkes / Jurusan
   - hero.jpg             -> foto besar banner utama beranda
   - gedung.jpg           -> foto gedung/kegiatan (section "Tentang Kami")
   - ketua-jurusan.jpg    -> foto Ketua Jurusan (section "Sambutan")

2. Buka file HTML terkait, cari <div class="img-placeholder"> yang
   sesuai, lalu ganti isinya dengan tag <img>, contoh:

   Sebelum:
   <div class="img-placeholder">
     <svg>...</svg>
     <span>Foto Gedung Jurusan Kesehatan Gigi</span>
   </div>

   Sesudah:
   <img src="images/gedung.jpg" alt="Gedung Jurusan Kesehatan Gigi"
        style="width:100%;height:100%;object-fit:cover;border-radius:14px;">

3. Simpan file, lalu commit & push ke GitHub (Netlify akan otomatis
   membangun ulang situsnya).

Folder images/uploads/ JANGAN dihapus — ini adalah folder tempat semua
foto dan file yang diunggah lewat halaman admin (/admin) disimpan.
