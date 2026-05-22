# SignHand

> O'zbek imo-ishora tilini o'rgatuvchi va real-time tarjimon platformasi

## Loyiha haqida

SignHand — onlayn dastur. Foydalanuvchi web-kamera oldida qo'l harakatlarini ko'rsatadi, dastur ularni tan oladi va ekranda harf yoki so'z yozadi.

**3 ta asosiy bo'lim:**
- **Darslik** — bosqichli imo-ishora kursi (29 harf, 24 dars)
- **Tarjimon** — real vaqtda qo'l → matn → ovoz
- **Mashq** — erkin yoki tasodifiy sinov

## Texnologiyalar

- **JavaScript + React 18** — frontend
- **Vite** — build tool
- **MediaPipe Holistic** (Google) — qo'l (21 nuqta) + yuz (468 nuqta) tanish
- **Three.js** — 3D vizualizatsiya
- **Web Speech API** — ovoz sintezi (uz-UZ)

## Kerakli narsalar

- Node.js 18+
- Chrome yoki Edge (MediaPipe uchun)
- Kamera

## O'rnatish

```bash
# 1. Repository'ni klonlash
git clone https://github.com/lexoraai-web/sign.git
cd sign

# 2. Kutubxonalarni o'rnatish
npm install

# 3. .env fayl yaratish (API kalitlar uchun)
cp .env.example .env
# .env ichiga o'z API kalitlaringizni yozing

# 4. Ishga tushirish
npm run dev
```

Brauzerda oching: http://localhost:5173

## Loyiha tuzilishi

```
src/
├── AppRoot.jsx              # Asosiy routing
├── theme.js                 # Yagona dizayn tizimi
├── components/              # UI komponentlar
│   ├── SignCameraFeed       # Kamera + skeleton overlay
│   ├── ConfidenceBar        # Aniqlik chizig'i
│   ├── DemoSign             # Harf namunasi
│   ├── SignImage            # Harf rasmi (fallback bilan)
│   └── TranslatorGuide      # Yo'riqnoma modal
├── core/                    # Biznes mantiq
│   ├── handFeatures         # 21 nuqta → xususiyatlar + signature
│   ├── faceFeatures         # 468 nuqta → grammatika
│   ├── staticMatcher        # Decision tree harf aniqlovchi
│   ├── dynamicMatcher       # Harakat (trajektoriya) tahlili
│   ├── temporalBuffer       # Consensus voting
│   └── calibration          # Foydalanuvchi qo'l hajmi
├── data/
│   ├── alphabet.js          # 29 harf qoidalari
│   ├── lessons.js           # 24 dars
│   └── letterImages.js      # Rasm yo'llari
├── hooks/
│   ├── useHolistic          # MediaPipe ulanishi
│   ├── useSignDetector      # Asosiy detector
│   ├── useAuth              # Demo login
│   └── useProgress          # XP, level, progress
└── pages/
    ├── DashboardPage
    ├── LessonPage
    ├── TranslatorPage
    ├── PracticePage
    └── ...
```

## Demo kirish

```
talaba / talaba123
admin / admin123
demo / demo
```

## Harf imzosi tizimi

Har harf 5 ta barmoq holati bilan aniqlanadi: `[T, I, M, R, P]`

```
0 = yopiq
1 = ochiq (cho'zilgan)
2 = yarim-egilgan (hook)
```

Misol:
- **A** = `[1,0,0,0,0]` UP — musht, bosh barmoq yon
- **L** = `[1,1,1,1,1]` UP — hamma 5 barmoq kerilgan
- **U** = `[1,0,0,0,1]` UP — shaka (bosh + chinchaloq)

## Ovoz buyruqlari

Tarjimon yig'ilgan matnni `uz-UZ` tilida ovoz bilan o'qiydi.

## Litsenziya

MIT
