<p align="center">
  <img src="static/logo.png" alt="be-diary" width="160" />
</p>

# be-diary

Aplikasi diary harian berbasis PWA dengan enkripsi ujung ke ujung. Server menyimpan tulisanmu, tapi
secara teknis tidak bisa membukanya.

Tampilannya bukan tabel: kartu kertas ditancap paku pin di papan flanel, dikelompokkan dalam map
manila per bulan.

## Yang membuatnya beda

- **Privasi kriptografis, bukan janji kebijakan.** Enkripsi terjadi di perangkat dengan
  XChaCha20-Poly1305. Yang sampai ke server hanya `ciphertext`, `nonce`, dan kunci terbungkus.
- **Jalan penuh tanpa jaringan.** Tulis, baca, sunting, hapus, cari, ganti tema — semuanya offline.
- **Bisa dijalankan sendiri.** AGPL-3.0, ada `docker-compose.yml` lengkap.

Fitur yang lengkap: papan pin per bulan dan map per tahun, editor markdown dengan autosave, mood,
tag, lampiran terenkripsi, lokasi dan cuaca opsional, pencarian lokal, linimasa dengan heatmap dan
"di tanggal ini tahun lalu", sinkronisasi delta dengan resolusi konflik, transfer perangkat lewat
QR dan PIN, pemulihan 24 kata, rotasi kunci master, passkey sebagai faktor kedua, kunci aplikasi
dengan PIN lokal, jalan keluar "mulai dari nol" saat semua kunci hilang, sinkronisasi
selektif per bulan, pengingat harian lewat Web Push, penerbitan ke
halaman publik dengan moderasi, tautan rahasia yang tetap terenkripsi, ekspor dan impor, serta
5 tema × 2 mode dalam dua bahasa.

## Mulai cepat

```bash
pnpm install
cp .env.example .env          # isi DATABASE_URL dan rahasia server
pnpm db:migrate
pnpm dev
```

Buka <http://localhost:4820>.

Port sengaja bukan default Vite (5173) supaya tidak bentrok dengan aplikasi lain.

Butuh Postgres. Kalau belum punya:

```bash
docker compose up -d db   # Postgres di port 5442
```

## Status

| Bagian | Keadaan |
|---|---|
| Unit, test vector kriptografi, dan kontras tema | 274 test hijau |
| End-to-end (Playwright) | 28 skenario hijau, termasuk transfer dua perangkat, pemulihan 24 kata, rotasi kunci master, mulai dari nol, centang terverifikasi, dan pencarian feed publik |
| TypeScript strict | 0 error (`noUncheckedIndexedAccess` aktif) |
| Bundle `/read` | 0 KB JS khusus rute — halaman publik dirender server, tanpa kode kriptografi |
| Bundle rute aplikasi | 2–11 KB gzip per rute di atas shell bersama |
| libsodium WASM | dimuat lazy di Web Worker, tidak memblokir first paint |
| Kontras | 5 tema x 2 mode lolos WCAG AA, diperiksa otomatis di tes |

## Perintah

| Perintah | Isi |
|---|---|
| `pnpm dev` | Server pengembangan di port **4820** |
| `pnpm build` | Build produksi (adapter Vercel) |
| `BEDIARY_ADAPTER=node pnpm build` | Build untuk self-host (`node build/index.js`) |
| `pnpm check` | `svelte-check` dengan TypeScript strict |
| `pnpm test` | Unit dan test vector kriptografi (Vitest) |
| `pnpm preview` | Pratinjau build di port **4821** |
| `pnpm test:e2e` | End-to-end (Playwright) |
| `pnpm db:generate` | Buat migrasi Drizzle dari skema |
| `pnpm db:migrate` | Jalankan migrasi |
| `pnpm seed` | Buat akun contoh berisi tulisan (butuh server dev jalan) |

## Arsitektur singkat

```
Perangkat                           Server
─────────                           ──────
SvelteKit UI                        SvelteKit server routes (Node)
  └─ Crypto Worker (libsodium)      Postgres (Drizzle)
       ├─ Master Key hidup di sini  Blob storage (lampiran terenkripsi)
       └─ tidak pernah keluar       Redis (rate limit, opsional)
IndexedDB (Dexie) - sumber kebenaran
Service Worker (shell offline)
```

Aturan yang tidak dilanggar:

1. Semua operasi kriptografi terjadi di Web Worker terpisah. Master key tidak pernah menyentuh
   thread utama.
2. Route server tidak pernah menerima field plaintext untuk entri privat.
3. IndexedDB adalah sumber kebenaran untuk pengguna. Server adalah replika terenkripsi.
4. Halaman publik `/read` tidak memuat kode kriptografi sama sekali.

## Struktur

```
src/
├─ lib/
│  ├─ crypto/       kdf, aead, envelope, recovery, transfer, worker
│  ├─ db/local/     skema Dexie dan repositori
│  ├─ db/server/    skema Drizzle per domain
│  ├─ sync/         mesin sinkronisasi dan resolusi konflik
│  ├─ state/        store berbasis runes Svelte 5
│  ├─ components/   dipecah per domain: dasar, papan, tahun, entri, nav, auth, pengaturan, publik
│  ├─ server/       auth, rate limit, sanitasi, blob, feed
│  └─ i18n/         kamus ID dan EN
├─ routes/
│  ├─ (marketing)/  landing, privasi, keamanan
│  ├─ (auth)/       daftar, masuk, pulih, verifikasi, sambung
│  ├─ (app)/        aplikasi dan pengaturan (butuh auth)
│  ├─ (public)/read feed publik, SSR
│  └─ api/          kontrak API
└─ service-worker.ts
```

## Dokumentasi

- [`SECURITY.md`](SECURITY.md) — kebijakan disclosure dan cakupan laporan
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — setup lokal dan aturan review kode kripto

Spesifikasi kriptografi lengkap, model ancaman, dan panduan self-host disimpan terpisah di luar
repositori ini.

## Lisensi

AGPL-3.0-or-later. Layanan turunan wajib membuka kodenya juga — itu memang tujuannya untuk aplikasi
privasi.
