# 🛡️ Telegram Anonim Murojaatlar Boti & Admin Boshqaruv Paneli (Dashboard)

Ushbu loyiha Node.js da Telegram Bot va Express Backend hamda React + Tailwind CSS da tayyorlangan Admin Dashboard tizimidan iborat.

---

## 🚀 Xususiyatlar

### 1. Telegram Bot (Node.js + Telegraf)
- **3 ta tilda ishlaydi**: 🇺🇿 O'zbekcha, 🇷🇺 Русский, 🇬🇧 English.
- **Bosqichma-bosqich murojaat yuborish oqimi**:
  1. `/start` -> Tilni tanlash (`uz`, `ru`, `en`).
  2. Main menyu: `🔒 Anonim murojaat yuborish`.
  3. Telefon raqam so'rash (Tugma orqali yuborish yoki anonim rejim).
  4. Murojaat turini tanlash (`🚨 Korrupsion Holat` yoki `⚙️ Tizim muammosi`).
  5. Murojaat matnini kiritish (`✍️ Murojaat matnini yozing:`).
  6. Tasdiqlash bosqichi (`Murojaatingizni to'g'ri ekanligini tasdiqlaysizmi?`).
  7. Rasm biriktirish (ixtiyoriy yoki "O'tkazib yuborish").
  8. Murojaat saqlanishi va unikal `#APP-XXXXXX` raqam berilishi (`✅ Murojaatingiz qabul qilindi!!!`).
- **Qayta aloqa**: Admin dashboarddan holat o'zgartirilganda yoki javob yozilganda fuqaroga Telegram orqali avtomatik bildirishnoma boradi.

### 2. Backend (Express + SQLite Database)
- **SQLite ma'lumotlar bazasi**: Zero-config, alohida DB server talab qilmaydi.
- **Fayllarni saqlash**: Telegram orqali yuborilgan rasmlarni avtomatik yuklab olib, dashboardda ko'rsatadi.
- **JWT Autentifikatsiya**: Admin paneli uchun xavfsiz tokenli autentifikatsiya.

### 3. Admin Dashboard (React + Tailwind CSS)
- **Zamonaviy Glassmorphic dizayn**: Dark mode, interaktiv KPI kartalar, tezkor filtrlar va qidiruv.
- **Filtrlar**: Kategoriyalar (Korrupsiya / Tizim), Holatlar (Yangi / Jarayonda / Bajarildi / Rad etildi) hamda Tillar bo'yicha saralash.
- **Batafsil ko'rish va Rasmlar**: Murojaatchi rasmini ko'rish, holatni o'zgartirish va to'g'ridan-to me Telegram'ga javob xati yuborish.

---

## 🛠 Ishga tushirish (Setup Instructions)

### 1. Telegram Bot Tokenini sozlash
`backend/.env` faylini oching va `@BotFather` dan olingan tokeningizni qo'ying:
```env
PORT=5000
JWT_SECRET=transparency_secret_jwt_key_2026_key
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN_HERE
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 2. Backend & Botni ishga tushirish
Alohida terminalda backend papkasida:
```bash
cd backend
npm run dev
```
*(Yoki ildiz papkadan: `npm run backend`)*

### 3. Dashboard (React Panel)ni ishga tushirish
Boshqa terminalda dashboard papkasida:
```bash
cd dashboard
npm run dev
```
*(Yoki ildiz papkadan: `npm run dashboard`)*

Dashboard brauzerda ochiladi: **`http://localhost:3000`**

### 4. Admin Login Ma'lumotlari
- **Foydalanuvchi nomi**: `admin`
- **Parol**: `admin123`

---

## 📁 Loyiha Strukturasi

```
transparency_bot/
├── backend/
│   ├── src/
│   │   ├── bot/
│   │   │   ├── locales.js    # UZ, RU, EN lug'atlari
│   │   │   └── bot.js        # Telegram Bot Telegraf mantiqi
│   │   ├── db/
│   │   │   ├── database.js   # SQLite DB yaratish va jadvallar
│   │   │   └── seed.js       # Test ma'lumotlarini to'ldirish
│   │   ├── routes/
│   │   │   ├── auth.js       # JWT Login router
│   │   │   ├── appeals.js    # Murojaatlar CRUD & Telegram javob
│   │   │   └── stats.js      # Dashboard statistika API
│   │   └── index.js          # Express server va Bot launcher
│   ├── uploads/              # Yuklangan rasmlar joyi
│   └── .env
└── dashboard/                # React + Tailwind CSS Admin Panel
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatsCards.jsx
    │   │   ├── AppealTable.jsx
    │   │   ├── AppealDetailModal.jsx
    │   │   └── LoginModal.jsx
    │   ├── api.js            # Express API integratsiyasi
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```
