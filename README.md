# 🎬 Bronime — Anime Streaming Frontend

Bronime adalah website **streaming anime (frontend only)** yang dibangun menggunakan **React.js (Vite)** dan **Tailwind CSS**, dengan data anime yang diambil secara real-time dari **Jikan API (MyAnimeList)**.

Project ini berfokus pada **UI modern, bersih, responsif**, dan pengalaman pengguna ala platform streaming seperti Netflix (tanpa backend & tanpa autentikasi).

---

## 🚀 Demo & Preview
> _(Tambahkan screenshot UI di sini jika sudah push ke GitHub)_  
> Contoh:



---

## ✨ Fitur Utama

- ✅ List Anime Populer (Top Anime)
- 🔍 Search anime berdasarkan judul
- 🏷️ Filter anime berdasarkan genre
- 🎴 Card anime (poster, judul, rating)
- 📄 Halaman detail anime
- 🎥 Player video (UI only / placeholder)
- ❤️ Favorites (localStorage)
- ⬆️ Scroll to top + title dinamis
- 📱 Responsive design (mobile – desktop)
- ⏳ Loading & empty state handling

---

## 🛠️ Tech Stack

- **React.js** (Vite)
- **Tailwind CSS**
- **React Router DOM**
- **Jikan API** (MyAnimeList)
- **Fetch API**
- **LocalStorage**

---

## 🌐 API yang Digunakan

- Top Anime  
  `https://api.jikan.moe/v4/top/anime`

- Search Anime  
  `https://api.jikan.moe/v4/anime?q=naruto`

- Genre Anime  
  `https://api.jikan.moe/v4/genres/anime`

> ⚠️ API gratis → memiliki limit request (429 Too Many Requests)

---

## 📁 Struktur Folder

src/
├── components/
│ ├── AnimeCard.jsx
│ ├── AnimeDetail.jsx
│ ├── SearchBar.jsx
│ ├── GenreFilter.jsx
│ └── Navbar.jsx
├── pages/
│ ├── Home.jsx
│ └── Favorites.jsx
├── App.jsx
├── main.jsx
└── index.css


---

## ⚙️ Cara Menjalankan Project

### 1️⃣ Clone Repository
```bash
git clone https://github.com/username/bronime.git
cd bronime

## install dependecies
npm install

##jalankan development server
npm run dev


- Catatan Penting

Project ini frontend only

Tidak ada backend & autentikasi

Streaming video hanya UI (placeholder)

Data sepenuhnya dari Jikan API

Jika muncul error 429, tunggu beberapa saat sebelum reload

- Tujuan Project

Latihan membangun frontend modern dengan React

Konsumsi public API (REST)

Menerapkan UI/UX ala platform streaming

Cocok untuk portfolio frontend developer