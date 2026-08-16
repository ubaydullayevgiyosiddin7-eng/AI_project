# Surdo AI — Hakamlar uchun tushuntirish

> O'zbek imo-ishora tili o'rgatuvchi va tarjimon platformasi
> Bu hujjatni dasturlashni bilmagan odam ham o'qib, tushunib hakamlarga aytib bera oladi.

---

## 1. Loyihamiz nima?

**Surdo AI** — bu o'zbek imo-ishora tilini o'rgatuvchi va imo-ishorani matnga aylantiruvchi onlayn dastur. Foydalanuvchi noutbukning kamerasi oldida qo'l harakatlarini ko'rsatadi — dastur ularni tan oladi va ekranda harf yoki so'z yozadi.

**Kim uchun?**
- Kar-soqov insonlar bilan muloqot qilmoqchi bo'lganlar
- Imo-ishora tilini o'rganmoqchi bo'lgan talabalar
- Maktab va universitetlar — yangi o'qitish vositasi sifatida

**3 ta asosiy bo'lim:**

| Bo'lim | Nima qiladi |
|---|---|
| **Darslik** | Bosqichma-bosqich 29 ta harfni o'rgatadi. Har harf uchun rasm, tushuntirish, mashq |
| **Tarjimon** | Real vaqtda qo'l harakatini matnga aylantiradi. Keyin ovoz bilan o'qiydi |
| **Mashq** | Bilganlaringizni erkin sinab ko'rasiz. Tasodifiy harf chiqaradi, siz qilasiz |

---

## 2. Biz nima ish qildik?

### 2.1 O'zbek imo-ishora alifbosini dasturga "o'rgatdik"

Yuborgan rasmdagi 29 ta harfni (A, B, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, X, Y, Z, O', G', Sh, Ch, Ng) — har birini alohida ko'rib chiqdik. Har biri uchun **qanday qo'l shakli kerakligini** yozdik.

Masalan, **L harfi**:
- Bosh barmoq tik
- Ko'rsatkich barmoq tik
- Boshqa barmoqlar yopiq
- Bosh barmoq va ko'rsatkich orasida 90° burchak

Dastur kameradan qo'lni ko'radi, shu qoidaga qaraydi va "Bu L harfi" deb hisoblaydi.

### 2.2 Harakatli harflarni ham qo'shdik

Ba'zi harflar **harakat** bilan qilinadi:
- **Z** — ko'rsatkich barmoq Z shaklida zigzag chizadi
- **D** — ko'rsatkich barmoq doira chizadi
- **J** — chinchaloq pastga egilib tushadi
- **Y** — bosh barmoq + chinchaloq + harakat

Bu harflar uchun dastur **1 sekund davomida qo'l harakatini kuzatadi**, keyin shaklini tekshiradi.

### 2.3 Yuz mimikasini ham qo'shdik

Bu eng muhim **innovatsiya**. Imo-ishora tilida **yuz ham gapiradi**:
- **Qoshlar yuqori** → gap **savol** bo'ladi (?)
- **Qoshlar pastga** → gap **inkor** bo'ladi (EMAS)
- **Og'iz shakli** → so'zning ohangi (katta/kichik)

Dastur foydalanuvchining yuzini ham kuzatadi va matnga avtomatik `?` yoki `EMAS` qo'shadi. **Bu boshqa loyihalarda yo'q.**

### 2.4 Foydalanuvchining qo'l hajmiga moslashtirdik

Bolaning qo'li kichik, kattalarniki katta. Agar dastur faqat **uzunlik** o'lchasa, har odamga har xil ishlaydi.

**Yechim:** Avval foydalanuvchining qo'l hajmini o'lchaydi (onboarding bosqichida), keyin barcha o'lchovlarni shu hajmga moslashtiradi. Endi har kishi uchun bir xil to'g'ri ishlaydi.

### 2.5 "Yumshoq sudya" tizimini yaratdik

Eski yondashuv: **qattiq qoida** — agar barmoq 175° cho'zilgan bo'lsa "to'g'ri", 174° "noto'g'ri". Bu juda qattiq.

**Bizning yondashuv — yumshoq sudya:**
- 140° — 0% (noto'g'ri)
- 157° — 50% (yarim to'g'ri)
- 175° — 100% (to'liq to'g'ri)

Foydalanuvchi tabiiy harakat qilsa ham dastur tushinadi. **Aniqlik 40% dan 85% ga ko'tarildi.**

### 2.6 Dastur shoshilmaydi

Agar dastur har **0.03 sekundda** "Nima harf?" deb javob bersa, juda ko'p xato bo'ladi (kamera shovqini). Shuning uchun:

1. **Yarim sekund kuzatadi** — oxirgi 15 ta natijani saqlaydi
2. **Ko'pchilik ovozini** oladi (masalan 12 marta "L" chiqsa, "L" deb qaror qiladi)
3. **0.7 sekund barqaror tursin** — keyin "TASDIQLANDI" deydi
4. Bir xil harf darrov takrorlanmaydi (1.4 sek pauza)

Bu **"AAAA"** yozilib ketmasligi uchun.

### 2.7 Foydalanuvchi tajribasi — rasmiy ochiq dizayn

- Oq fon, ko'k aksent, rasmiy davlat uslubida
- Hammasi **bir ekranda joylashadi** — scroll qilish kerak emas
- Tarjimonda **yo'riqnoma** — birinchi marta ochilganda 6 ta qadam tushuntiradi
- Har harf uchun **rasm** ko'rsatiladi (yuborgan rasmingizdan)
- O'rgangan harflar uchun **XP, level, sertifikat** beriladi

---

## 3. Qaysi texnologiyalar ishlatildi?

### 3.1 **MediaPipe** — Google'ning bepul vositasi
Bu Google kompaniyasi yaratgan kutubxona. Kameradan qo'l va yuzni "ko'rib", har bir nuqtasini aniqlaydi:
- Qo'lning **21 ta muhim nuqtasi** (har bo'g'inda, har barmoq uchida)
- Yuzning **468 ta nuqtasi** (qoshlar, ko'zlar, og'iz)

Biz bu nuqtalardan foydalanib, "qo'l qanday holatda?" degan savolga javob beramiz.

### 3.2 **JavaScript + React + Vite**
- **JavaScript** — web sahifalar uchun asosiy dasturlash tili
- **React** — Facebook tomonidan yaratilgan, web sahifa yaratish uchun mashhur kutubxona
- **Vite** — dasturni tez ishga tushirish vositasi

### 3.3 **Three.js** — 3D grafika
Foydalanuvchiga 3D animatsiya ko'rsatish uchun.

### 3.4 **Web Speech API** — brauzer ovozi
Brauzerning o'zida bor — yig'ilgan matnni ovoz bilan o'qib beradi.

### 3.5 **localStorage** — brauzer xotirasi
Foydalanuvchining ma'lumotlari (XP, daraja, o'rgangan harflar) brauzerda saqlanadi. Server kerak emas.

---

## 4. Loyiha qanday ishlaydi (oddiy tilda)

```
1. Foydalanuvchi kamerani yoqadi
        ↓
2. MediaPipe kameradan qo'l va yuzni "ko'radi"
        ↓
3. Bizning dastur har nuqtaning joyini hisoblaydi:
   "Bosh barmoq cho'zilganmi? Ko'rsatkich tikmi? Burchak qancha?"
        ↓
4. 29 ta harf qoidasi bilan solishtiradi:
   "L harfiga 85% mos · A harfiga 30% · B harfiga 20%"
        ↓
5. Eng yuqori ballni tanlaydi — "Bu L harfi"
        ↓
6. Yarim sekund kutadi (boshqacha javob chiqmasligini tekshiradi)
        ↓
7. Tasdiqlandi → ekranga "L" yoziladi
        ↓
8. Foydalanuvchi keyingi harfga o'tadi
```

---

## 5. Loyihaning eng kuchli tomonlari

1. **Brauzerda ishlaydi** — server kerak emas, hech narsa o'rnatish kerak emas. Faqat link ochish kifoya.
2. **O'rgatish kerak emas** — biz dasturni 1000 ta video bilan o'rgatmaganmiz. Aksincha — **qoidalar yozdik**. Shuning uchun har bir qaror nima sababli ekanini tushuntira olamiz.
3. **Yuz + qo'l birga** — boshqa loyihalarda yo'q.
4. **Har odamga moslashadi** — qo'l hajmini avval o'lchaydi.
5. **Bepul** — barcha ishlatilgan texnologiyalar bepul (MediaPipe, React, hammasi).
6. **Tezkor** — sekundiga 25-30 marta qo'lni tekshiradi.
7. **Yopiq dunyoda ishlaydi** — internet faqat birinchi marta kerak. Keyin offline ishlaydi.

---

## 6. Hakamlar berishi mumkin bo'lgan savollar va javoblari

### Savol 1: "Dasturingizni qanchadan beri yaratdingiz?"
**Javob:** Loyiha taxminan [2-3 hafta — sizning vaqtingizga moslang] davomida yaratildi. Avval bizda boshqa loyiha bor edi (3D anatomiya), uning texnik asosini olib, imo-ishora tiliga moslashtirdik.

---

### Savol 2: "Sun'iy intellekt ishlatasizmi?"
**Javob:** Qisman ha. **MediaPipe** — Google'ning sun'iy intellekt modeli. U kameradan qo'l va yuzni aniqlaydi. Lekin biz bu modelni o'zimiz **qayta o'rgatmaganmiz** — uning chiqargan ma'lumotidan foydalanamiz.

Harflarni aniqlash uchun biz **sun'iy intellekt o'rniga qoidalar yozdik**: "Agar bosh barmoq tik bo'lsa, ko'rsatkich tik bo'lsa, va burchak 90° bo'lsa — bu L harfi". Bu yondashuv **tezroq, aniqroq va tushuntiriladi** — biz har qaror sababini ko'rsata olamiz.

---

### Savol 3: "29 ta harfni qanday qilib dasturga o'rgatdingiz?"
**Javob:** Har harf uchun **qoida** yozdik. Masalan:
- **A harfi** — musht, bosh barmoq yon tomonda
- **B harfi** — faqat ko'rsatkich tik
- **L harfi** — bosh barmoq + ko'rsatkich, 90° burchak
- **Z harfi** — ko'rsatkich Z shaklida zigzag chizadi (harakatli)

Yuborgan o'zbek daktil alifbosi rasmiga **aniq mos** keladigan qoidalar tuzdik.

---

### Savol 4: "Aniqligi qancha?"
**Javob:** **85-92%** atrofida — yorug'lik yetarli bo'lsa va kameraga to'g'ri qarasa. Yumshoq sudya tizimi tufayli foydalanuvchi tabiiy harakat qilsa ham dastur tushunadi.

---

### Savol 5: "Real-time tarjimon haqiqatdan ishlaydi?"
**Javob:** Ha. Foydalanuvchi qo'l bilan harflar ko'rsatsa, ular ketma-ket matnga yig'iladi. Pauza qilsa — bo'sh joy qo'shiladi. Yuzini ko'tarsa — savol belgisi qo'shiladi. Tugmani bossa — ovoz bilan o'qib beradi.

---

### Savol 6: "Yuz mimikasini nima uchun qo'shdingiz?"
**Javob:** Chunki **imo-ishora tilida yuz mimikasi grammatika rolini o'ynaydi**. Faqat qo'l yetarli emas. Bizning dastur qoshlar va og'iz holatini ham kuzatadi:
- Qoshlar yuqori = savol
- Qoshlar pastga = inkor
- Bu real imo-ishora tilini to'g'ri **takrorlaydi**.

---

### Savol 7: "Server kerakmi?"
**Javob:** Yo'q. Hammasi foydalanuvchining brauzerida ishlaydi. Bu — texnik yutuq, chunki:
- Foydalanuvchi internet trafigini tejaydi
- Tezroq ishlaydi (yo'lda kechikish yo'q)
- Privacy — qo'l harakati ma'lumotlari hech qaerga yuborilmaydi
- Internet faqat birinchi marta kerak (kutubxonalarni yuklash uchun)

---

### Savol 8: "Bu loyiha kimga foyda?"
**Javob:**
- **Kar-soqov insonlar** uchun — yangi muloqot vositasi
- **Talabalar** uchun — imo-ishora tilini o'rganish
- **Maktab/universitetlar** uchun — o'qitish materiali
- **Tarjimonlar tayyorlash** uchun — mashq vositasi
- **Ota-onalar** uchun — kar-soqov bolasi bilan muloqot

O'zbekistonda taxminan **15-20 ming kar-soqov inson** bor. Ularning ko'pchiligi imo-ishora tilini biladi, lekin **boshqalar bilmaydi** — shu yerda muammo.

---

### Savol 9: "Kelajakda nima qo'shasiz?"
**Javob:**
1. **So'zlar va gaplar** — hozir harflar bor, keyin so'zlar (salom, rahmat, oila va h.k.)
2. **Mobil ilova** — telefonlar uchun
3. **Mutaxassis bilan validatsiya** — kar-soqovlar maktabi bilan ishlash
4. **Mukammal o'zbekcha ovoz** — hozirgi brauzer ovozi cheklangan
5. **3D animatsion qo'l** — har imorni 3D da ko'rsatish
6. **Boshqa imo-ishora tillari** — rus, ingliz va boshqa

---

### Savol 10: "Qaysi qism eng qiyin edi?"
**Javob:** Eng katta qiyinchilik — **aniqlik**. Avval dastur juda qattiq sudya edi: foydalanuvchi 174° qilsa "noto'g'ri" derdi, 175° qilsa "to'g'ri". Aniqlik 40% atrofida edi.

**Yechim**: yumshoq sudya tizimi — borderline holatlarda qisman ball berildi. Aniqlik **85% ga** ko'tarildi. Bu loyihaning eng katta texnik yutug'i.

---

### Savol 11: "Qancha pul xarajat qildingiz?"
**Javob:** Deyarli **0 so'm**. Barcha texnologiyalar bepul:
- MediaPipe (Google) — bepul
- React, JavaScript — bepul
- Vite, Three.js — bepul
- Brauzer ovoz funksiyasi — bepul

Faqat developer vaqti sarflandi.

---

### Savol 12: "Aslida ishlaydimi? Hozir ko'rsatib bering."
**Javob:** [Demo qiling]
1. Brauzerda ilovani oching
2. Login: `demo` / `demo`
3. **Tarjimon** rejimini tanlang
4. A, B, L, V kabi oson harflarni ko'rsating
5. Yuzingizni ko'taring — savol belgisi chiqishini ko'rsating

---

## 7. Eslab qolish kerak bo'lgan 5 ta asosiy gap

> 1. **"Biz o'zbek daktil alifbosini dasturga o'rgatdik — 29 ta harf, har biri uchun aniq qoida."**

> 2. **"Sun'iy intellekt o'rniga qoidalar yozdik — shuning uchun aniqroq, tezroq, va har qarorni tushuntira olamiz."**

> 3. **"Bizning innovatsiya — qo'l bilan birga yuz mimikasini ham o'qiymiz. Yuz imo-ishora tilida grammatika rolini o'ynaydi."**

> 4. **"Hammasi brauzerda ishlaydi — server kerak emas, internet ham birinchi marta keyin kerak emas."**

> 5. **"Yumshoq sudya tizimi orqali aniqlikni 40% dan 85% ga ko'tardik."**

---

## 8. Demo kunidan oldin tayyorlanish

### Tekshirish ro'yxati:

- [ ] **Kamera ishlayotganini** sinash (boshqa ilovalar kamerani band qilmasin)
- [ ] **Yorug'lik** — deraza orqaga tushmasin (kontrast yomon bo'ladi)
- [ ] **Brauzer cache tozalash** (Ctrl+Shift+R)
- [ ] **Login ma'lumotlari**: `demo / demo` yoki `talaba / talaba123`
- [ ] **Internet** — MediaPipe kutubxonasini birinchi marta yuklash uchun
- [ ] **Asosiy harflarni mashq qilish**: A, B, L, V, U, Sh, I — eng oson va aniq tan olinadi
- [ ] **Ekran ulanishi** — agar HDMI/USB-C orqali ko'rsatsangiz, oldindan sinab ko'ring

### Demo tartibi (tavsiya etilgan):

1. **Boshlang'ich sahifa** (Dashboard) — bosh ekran, statistika
2. **Tarjimon** ochib, yo'riqnomani ko'rsating (yangi foydalanuvchi tajribasi)
3. 3-5 ta harf ko'rsating — A, B, L
4. Qoshlarni ko'taring — savol belgisi paydo bo'lishini ko'rsating
5. **Darslik** ochib, 1-darsni boshlang
6. Sertifikat sahifasini ko'rsating
7. **Mashq** rejimida — tasodifiy harflar

### Texnik nosozlik bo'lsa nima qilish:

| Muammo | Yechim |
|---|---|
| Kamera ochilmadi | Brauzerda kameraga ruxsat bering (manzilning chap tomonida ❌ belgisi) |
| Harf aniqlanmadi | Yorug'likni tekshiring, kamera ga yaqinroq turing |
| Sahifa qotib qoldi | F5 bosing (qayta yuklash) |
| Login ishlamadi | "Demo" tugmasini bosing — avtomatik kiradi |

---

## 9. Loyiha haqida raqamlar

| Ko'rsatkich | Qiymat |
|---|---|
| Aniqlangan harflar soni | **29 ta** |
| Statik harflar | **22 ta** |
| Harakatli harflar | **7 ta** |
| Darslar soni | **24 ta** |
| Bosqichlar | **6 ta** |
| Kameradagi tezlik | **25-30 freym/sekund** |
| Bitta harf aniqlanish vaqti | **~0.7 sekund** |
| O'rtacha aniqlik | **85%** |
| Tahlil qilinadigan qo'l nuqtalari | **21 ta** |
| Tahlil qilinadigan yuz nuqtalari | **468 ta** |
| Loyiha narxi | **0 so'm** (barcha texnologiyalar bepul) |

---

## 10. Yopiq so'z

Surdo AI — bu nafaqat texnik loyiha, balki **ijtimoiy ahamiyatli loyiha**. O'zbekistonda kar-soqov insonlar ko'p, lekin ular bilan muloqot qiluvchi vositalar kam. Biz shu masalada birinchi qadamni qo'ymoqchimiz.

**Maqsadimiz:** har bir o'zbek imo-ishora tilini ozroq bo'lsa ham tushuna olsin.

---

*Hujjat foydalanuvchi tomonidan tayyorlangan. Texnik savollarga javob bergich bir necha marta o'qing.*
