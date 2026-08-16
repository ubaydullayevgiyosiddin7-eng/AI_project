// Harf rasm yo'lini olish — public/alifbo/ dan
//
// Foydalanuvchining mavjud fayl tuzilishi (kichik harf):
//   a.png, b.png, d.png, ..., z.png
//   o'.png, g'.png        ← apostrof bilan
//   sh.png, ch.png, ng.png
//
// MUHIM: yo'l BASE_URL bilan yasaladi. Ilova development'da '/' da,
// production'da esa saytning '/app/' yo'li ostida tarqatiladi.
// Absolyut '/alifbo/...' yozilsa, production'da rasm topilmaydi.

const BASE = import.meta.env.BASE_URL; // dev: '/', prod: '/app/'

// Harf ID → fayl nomi
const FILE_NAME = {
  "A": "a", "B": "b", "D": "d", "E": "e", "F": "f", "G": "g",
  "H": "h", "I": "i", "J": "j", "K": "k", "L": "l", "M": "m",
  "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r", "S": "s",
  "T": "t", "U": "u", "V": "v", "X": "x", "Y": "y", "Z": "z",
  "O'": "o'",
  "G'": "g'",
  "Sh": "sh",
  "Ch": "ch",
  "Ng": "ng",
};

export function letterImagePath(letterId) {
  const name = FILE_NAME[letterId] || letterId.toLowerCase();
  // Apostrof URL'da xavfsiz, lekin encodeURIComponent ishlatib aniq qilamiz
  return `${BASE}alifbo/${encodeURIComponent(name)}.png`;
}

// Bir necha kengaytmali fallback
export function letterImageCandidates(letterId) {
  const name = FILE_NAME[letterId] || letterId.toLowerCase();
  const enc = encodeURIComponent(name);
  return [
    `${BASE}alifbo/${enc}.png`,
    `${BASE}alifbo/${enc}.jpg`,
    `${BASE}alifbo/${enc}.jpeg`,
    `${BASE}alifbo/${enc}.webp`,
    // Eski public/images/alphabet/ joyini ham qo'llab-quvvatlaymiz
    `${BASE}images/alphabet/${letterId}.png`,
  ];
}
