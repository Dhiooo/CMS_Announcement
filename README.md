# Timedoor CMS — Announcement & Notification Prototype

Prototype Next.js (App Router) untuk fitur **Notification & Announcement** pada CMS.
Semua data **statis dari JSON** dan CRUD berjalan **in-memory** — kalau halaman di-refresh, data kembali ke state awal (sesuai arahan SPV).

## Fitur / Flow

### Sisi Admin (`/notifications`)
1. **List** — tabs (All / Active / Scheduled / Draft), search, filter Type/Priority/Source.
2. **Create Notification** (`/notifications/new`) — wizard 4 langkah:
   - Content (tipe Notification/Announcement, Source, Category, Priority, Title, Message)
   - Audience (Country / Branch / Role → hitung recipients + View recipients)
   - Schedule & Delivery (Send immediately / Schedule + Display behavior)
   - Review → Publish / Save as Draft
3. **Detail** (`/notifications/[id]`) — Message, info (Audience/Published/Version), **Delivery Overview**, **Version History**, hapus.
4. **Edit & Publish Version** (`/notifications/[id]/edit`) — ubah konten, isi "What's changed", toggle **Resend to Readers**, **Publish Version N**.

### Sisi User (`/preview`)
5. **Notification Center** — bell menu dengan **2 tab**: Notifications & Announcements (filtered), badge UPDATED + "Changes in vN".
6. **Popup Acknowledge** — announcement Urgent (Until acknowledged) muncul otomatis; ada blok **What's changed** untuk versi baru; checkbox + tombol Acknowledge.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 (otomatis diarahkan ke `/notifications`).
Klik **Preview as user** (kanan atas) untuk melihat sisi user.

## Build produksi

```bash
npm run build
npm start
```

## Deploy ke Vercel (gratis)

**Cara tercepat (via GitHub):**
1. Push folder ini ke sebuah repo GitHub.
2. Buka https://vercel.com → **Add New → Project** → import repo tsb.
3. Framework otomatis terdeteksi **Next.js** — biarkan setting default → **Deploy**.

**Atau via Vercel CLI:**
```bash
npm i -g vercel
vercel        # ikuti prompt, pilih scope & nama project
vercel --prod # deploy ke production
```

Tidak perlu environment variable atau database — semuanya statis.

## Struktur

```
app/
  notifications/            # list
    new/                    # create wizard
    [id]/                   # detail
      edit/                 # edit & versioning
  preview/                  # user-side view
components/                 # Shell, icons, badges, NotificationCenter, AckModal
data/                       # notifications.json, recipients.json (seed statis)
lib/                        # store (in-memory), types, format
```

## Catatan
- Data reset saat refresh — ini disengaja (prototype tanpa backend).
- Angka Delivery/Read/Acknowledged adalah dummy dari JSON, dan ikut berubah saat user melakukan aksi di `/preview`.
