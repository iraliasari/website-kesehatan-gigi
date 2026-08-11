# Panduan Lengkap untuk Pemula
## Website Jurusan Kesehatan Gigi — Poltekkes Kemenkes Makassar

Panduan ini ditulis untuk staf yang **belum pernah membuat website sama sekali**.
Ikuti urutannya dari atas ke bawah. Tidak perlu memahami kode — semua
langkah di sini dilakukan lewat klik-klik di browser.

---

## A. Cara Membuat Repository GitHub

1. Buka **https://github.com** lalu buat akun (tombol **Sign up**) jika belum punya.
2. Setelah login, klik tombol **+** di pojok kanan atas, lalu pilih **New repository**.
3. Isi:
   - **Repository name**: contoh `website-kesehatan-gigi`
   - **Public** atau **Private**: pilih **Private** jika belum ingin publik, atau **Public** jika tidak masalah dilihat orang lain (kode tetap aman, tidak berisi password).
4. **Jangan centang** "Add a README file" (folder kita sudah lengkap).
5. Klik **Create repository**.
6. Anda akan melihat halaman kosong dengan instruksi — biarkan saja, lanjut ke langkah B.

---

## B. Cara Upload Seluruh Folder Website ke GitHub

**Cara termudah untuk pemula (tanpa aplikasi tambahan):**

1. Di halaman repository yang baru dibuat, cari tulisan **"uploading an existing file"** (ada di tengah halaman, di bawah instruksi command line).
2. Klik tulisan tersebut.
3. Buka folder `website-kesehatan-gigi` di komputer Anda, **pilih semua file dan folder di dalamnya** (bukan folder pembungkusnya), lalu **drag & drop** ke area upload GitHub.
   - Jika GitHub menolak upload folder kosong (seperti `images/uploads`), itu wajar — GitHub memang tidak bisa menyimpan folder kosong. Ini tidak masalah, karena folder tersebut akan otomatis terbentuk begitu ada foto pertama yang diunggah lewat CMS.
4. Scroll ke bawah, isi kolom **"Commit changes"** dengan tulisan singkat, misalnya `Upload awal website`.
5. Klik tombol hijau **Commit changes**.
6. Tunggu proses upload selesai. Refresh halaman untuk memastikan semua file (index.html, css, js, admin, content, images) sudah muncul.

> **Alternatif (lebih rapi untuk jangka panjang):** install aplikasi **GitHub Desktop** (https://desktop.github.com), lalu gunakan menu **"Add local repository"** untuk menghubungkan folder di komputer Anda ke repository GitHub. Ini memudahkan upload ulang di masa depan.

---

## C. Cara Menghubungkan Repository GitHub ke Netlify

1. Buka **https://app.netlify.com** lalu buat akun / login (bisa langsung pakai akun GitHub Anda — pilih **"Sign up with GitHub"**).
2. Klik tombol **Add new site** → **Import an existing project**.
3. Pilih **Deploy with GitHub**, lalu izinkan Netlify mengakses akun GitHub Anda jika diminta.
4. Cari dan klik repository `website-kesehatan-gigi` yang tadi dibuat.
5. Pada halaman pengaturan deploy:
   - **Build command**: kosongkan saja (biarkan blank)
   - **Publish directory**: isi dengan tanda titik `.`
6. Klik **Deploy site**.
7. Tunggu beberapa saat. Setelah selesai, Netlify akan memberi alamat acak seperti `https://nama-acak-123.netlify.app` — itu alamat website Anda yang sudah bisa dibuka!
8. *(Opsional)* Klik **Site settings** → **Change site name** untuk mengganti nama subdomain menjadi lebih rapi, misalnya `kesehatangigi-poltekkesmakassar`.

---

## D. Cara Mengaktifkan CMS (Decap CMS)

Decap CMS di website ini menggunakan sistem login **Netlify Identity + Git Gateway**, supaya staf tidak perlu tahu apa pun soal GitHub untuk login sehari-hari.

1. Di dashboard Netlify, buka situs Anda, lalu klik tab **Identity**.
2. Klik **Enable Identity**.
3. Scroll ke bagian **Registration preference**, pilih **Invite only** (supaya tidak sembarang orang bisa mendaftar sendiri).
4. Scroll ke bagian **Services**, cari **Git Gateway**, klik **Enable Git Gateway**. Ini menghubungkan CMS ke repository GitHub Anda secara otomatis, tanpa perlu setting OAuth manual.
5. Kembali ke tab **Identity**, klik tombol **Invite users**, masukkan email staf yang akan mengelola konten, lalu klik **Send**.
6. Staf yang diundang akan menerima email berisi tautan untuk membuat password — ini menjadi akun login CMS mereka.

**Terakhir, edit file `admin/config.yml`** di GitHub (klik file → ikon pensil untuk edit):
- Ganti `https://[NAMA-SITUS-ANDA].netlify.app` pada baris `site_url` dan `display_url` dengan alamat Netlify Anda yang sebenarnya (dari langkah C).
- Simpan perubahan (**Commit changes**).

---

## E. Cara Membuka Halaman Admin (`/admin`)

Setelah situs live, buka browser dan ketik:

```
https://nama-situs-anda.netlify.app/admin
```

Anda akan diminta login — gunakan email & password yang dibuat saat menerima undangan di langkah D. Setelah login, Anda akan melihat menu-menu: **Berita, Agenda, Prestasi, Penelitian, Pengabdian Masyarakat, Galeri, Download, Profil Jurusan**.

---

## F. Cara Menambah Berita Baru dari CMS

1. Buka `/admin`, klik **Berita** di menu kiri.
2. Klik **Daftar Berita**.
3. Anda akan melihat daftar berita yang sudah ada. Klik tombol **+ Add "items"** (ada di bagian bawah daftar) untuk menambah berita baru.
4. Isi semua kolom: Judul, Slug (contoh: `kegiatan-vaksinasi-2026`, tanpa spasi/huruf besar), Tanggal, Kategori, Penulis, Foto Utama, Ringkasan Singkat, dan Isi Berita Lengkap.
5. Pastikan tombol **Publikasikan?** dinyalakan (ON) supaya berita langsung tampil di website.
6. Klik **Save** di pojok kanan atas, lalu klik **Publish** (jika menggunakan mode editorial) atau langsung tersimpan (mode simple, default situs ini).
7. Buka website Anda, berita baru akan otomatis muncul di halaman **Beranda** dan **Berita** dalam beberapa menit (setelah Netlify selesai memproses perubahan).

---

## G. Cara Upload Foto

Foto selalu diunggah **langsung dari dalam form CMS**, bukan lewat GitHub:

1. Saat mengisi form (berita, agenda, prestasi, dll), klik kolom bergambar seperti **Foto Utama**.
2. Akan muncul jendela **Media Library** — klik **Choose an image** atau seret file foto dari komputer ke area tersebut.
3. Setelah foto terunggah, klik foto tersebut untuk memilihnya.
4. Foto otomatis tersimpan di folder `images/uploads/` dan langsung tersambung ke berita/agenda/dll yang sedang Anda edit.

---

## H. Cara Menambah Agenda

1. Buka `/admin` → **Agenda** → **Daftar Agenda**.
2. Klik **+ Add "items"**.
3. Isi: Judul Kegiatan, Tanggal, Waktu (contoh `08:00 - 12:00 WITA`), Lokasi, Deskripsi Singkat, dan foto (opsional).
4. Klik **Save**. Agenda otomatis tampil di halaman **Beranda** (3 agenda terdekat) dan halaman **Agenda** (semua agenda).

---

## I. Cara Menambah Prestasi

1. Buka `/admin` → **Prestasi Mahasiswa** → **Daftar Prestasi**.
2. Klik **+ Add "items"**.
3. Isi: Nama Prestasi/Lomba, Nama Mahasiswa, Nama Kompetisi, Juara/Penghargaan, Tingkat Lomba, Tanggal, Foto, dan Deskripsi.
4. Klik **Save**. Prestasi otomatis tampil di halaman **Beranda** dan halaman **Prestasi**.

---

## J. Cara Memperbarui Penelitian dan Pengabdian Masyarakat

**Penelitian:**
1. Buka `/admin` → **Penelitian** → **Daftar Penelitian** → **+ Add "items"**.
2. Isi: Judul, Peneliti/Dosen, Tahun, Kategori, Abstrak Singkat, Tautan Publikasi (jika ada), Foto (opsional).
3. Klik **Save**. Data otomatis tampil di halaman **Penelitian**.

**Pengabdian Masyarakat:**
1. Buka `/admin` → **Pengabdian Masyarakat** → **Daftar Kegiatan Pengabdian** → **+ Add "items"**.
2. Isi: Judul Kegiatan, Tanggal, Lokasi, Ketua Kegiatan, Deskripsi, Foto (opsional).
3. Klik **Save**. Data otomatis tampil di halaman **Pengabdian Masyarakat**.

---

## K. Cara Mengubah Konten Statis seperti Visi-Misi

Semua teks "tetap" (bukan daftar berulang) — seperti judul hero, paragraf "Tentang Kami", Sejarah, Visi, Misi, isi Sambutan Ketua Jurusan, angka statistik, dan info kontak — dikelola dalam **satu tempat**:

1. Buka `/admin` → klik **Profil Jurusan** → **Konten Profil & Beranda**.
2. Edit kolom yang diinginkan (misalnya **Visi** atau **Misi**).
3. Klik **Save**.
4. Perubahan otomatis tampil di halaman **Beranda**, **Profil**, dan **Kontak** — tidak perlu menyentuh file HTML sama sekali.

---

## L. Cara Menghubungkan Custom Domain

1. Di dashboard Netlify, buka situs Anda → tab **Domain management** (atau **Domain settings**).
2. Klik **Add a domain**, lalu ketik domain resmi institusi, misalnya `kesehatangigi.poltekkesmakassar.ac.id`.
3. Netlify akan menampilkan catatan DNS yang perlu ditambahkan (biasanya berupa **CNAME** atau **A record**).
4. Berikan catatan DNS tersebut ke pengelola domain/IT institusi Anda untuk didaftarkan di panel DNS domain `.ac.id`.
5. Setelah DNS aktif (bisa memakan waktu beberapa jam), Netlify otomatis menerbitkan **sertifikat HTTPS gratis** untuk domain tersebut.
6. Setelah domain aktif, perbarui juga `site_url` dan `display_url` di `admin/config.yml` (lihat langkah D) supaya tombol preview di CMS mengarah ke domain baru.

---

## Ringkasan Alur Kerja Sehari-hari

Setelah semua langkah A–E selesai (dilakukan sekali di awal), staf **cukup mengulangi F–K** setiap kali ada konten baru:

```
Buka /admin  →  Login  →  Pilih jenis konten  →  Isi form  →  Save
```

Tidak ada file HTML yang perlu dibuka atau diedit untuk pekerjaan sehari-hari.

## Bantuan Tambahan

- Jika halaman CMS di `/admin` menampilkan layar putih kosong: pastikan file `admin/config.yml` sudah benar (tidak ada kesalahan penulisan) dan `site_url` sudah sesuai.
- Jika perubahan konten belum muncul di website: tunggu 1–2 menit (Netlify perlu memproses perubahan), lalu refresh halaman dengan **Ctrl+Shift+R** (hard refresh).
- Jika lupa password CMS: di halaman login `/admin`, klik **Forgot password?**.
