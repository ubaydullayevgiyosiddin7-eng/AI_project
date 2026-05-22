// O'zbek daktil alifbosi — 29 harf
//
// Har harf endi 2 ta yondashuvni qo'llaydi:
//   1. signature [T,I,M,R,P] — decision tree (asosiy)
//   2. variants — soft scoring (zaxira/borderline holatlar uchun)
//
// signature ma'nosi:
//   0 = barmoq yopiq
//   1 = barmoq cho'zilgan
//   2 = barmoq yarim-egilgan (hook)
//   T  I  M  R  P
//   bosh, ko'rsatkich, o'rta, nomsiz, chinchaloq

export const ALPHABET = [
  // ═════════════ 1-QATOR: A B D E F G ═════════════
  {
    id: 'A', type: 'static', uzbekLabel: "A harfi",
    description: "Musht, bosh barmoq yon tomonda",
    signature: [1, 0, 0, 0, 0],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      { fingers: { thumb: 'extended', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' } },
      { fingers: { index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    ],
  },
  {
    id: 'B', type: 'static', uzbekLabel: "B harfi",
    description: "Index + middle yopishgan, tik",
    signature: [0, 1, 1, 0, 0],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      {
        fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'closed', pinky: 'closed' },
        tipDistances: { index_middle: [0, 0.35] },
      },
      { fingers: { index: 'extended', middle: 'extended', ring: 'closed', pinky: 'closed' } },
    ],
  },
  {
    id: 'D', type: 'static', uzbekLabel: "D harfi",
    description: "4 barmoq oldinga + bosh barmoq tagida",
    signature: [0, 1, 1, 1, 1],
    orientation: 'FORWARD',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' } },
    ],
  },
  {
    id: 'E', type: 'static', uzbekLabel: "E harfi",
    description: "Barmoqlar yarim egilgan (C / ilgak)",
    signature: [0, 2, 2, 2, 2],
    orientation: 'SIDE',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' },
        bend: { index: [40, 110], middle: [40, 110] } },
    ],
  },
  {
    id: 'F', type: 'static', uzbekLabel: "F harfi",
    description: "Index + middle yarim egilgan, bosh ularga tegadi",
    signature: [0, 2, 2, 0, 0],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { ring: 'closed', pinky: 'closed' },
        tipDistances: { thumb_index: [0, 0.55] } },
    ],
  },
  {
    id: 'G', type: 'static', uzbekLabel: "G harfi",
    description: "Ko'rsatkich yon tomonga ishora",
    signature: [0, 1, 0, 0, 0],
    orientation: 'SIDE',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    ],
  },

  // ═════════════ 2-QATOR: H I J K L M ═════════════
  {
    id: 'H', type: 'dynamic', uzbekLabel: "H harfi",
    description: "Index egilgan + aylana harakat",
    signature: [0, 2, 0, 0, 0],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: 'circle', holdPose: { index: 'extended' } },
    difficulty: 3, xpReward: 20,
  },
  {
    id: 'I', type: 'static', uzbekLabel: "I harfi",
    description: "Faqat chinchaloq tik",
    signature: [0, 0, 0, 0, 1],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      { fingers: { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'extended' } },
    ],
  },
  {
    id: 'J', type: 'dynamic', uzbekLabel: "J harfi",
    description: "Yopiq musht + J shaklida harakat (pastga ilmoq)",
    signature: [0, 0, 0, 0, 0],
    rules: { fingers: { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: ['j-curve', 'zigzag'] },
    difficulty: 3, xpReward: 20,
  },
  {
    id: 'K', type: 'dynamic', uzbekLabel: "K harfi",
    description: "Ko'rsatkich tik + aylana harakat",
    signature: [0, 1, 0, 0, 0],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: 'circle', holdPose: { index: 'extended' } },
    difficulty: 3, xpReward: 20,
  },
  {
    id: 'L', type: 'static', uzbekLabel: "L harfi",
    description: "Hamma 5 barmoq kerilgan",
    signature: [1, 1, 1, 1, 1],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      // L = hamma barmoq ochiq, kerilgan
      { fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' } },
      // Klassik L: faqat bosh + ko'rsatkich (alternativ shakl)
      { fingers: { thumb: 'extended', index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' },
        thumbIndexAngle: [50, 130] },
    ],
  },
  {
    id: 'M', type: 'static', uzbekLabel: "M harfi",
    description: "4 barmoq yopishgan + bosh yopiq",
    signature: [0, 1, 1, 1, 1],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' },
        tipDistances: { index_middle: [0, 0.32] } },
    ],
  },

  // ═════════════ 3-QATOR: N O P Q R S ═════════════
  {
    id: 'N', type: 'static', uzbekLabel: "N harfi",
    description: "Index + middle bir-biriga tegadi (kesishmagan)",
    signature: [0, 1, 1, 0, 0],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'closed', pinky: 'closed' },
        tipDistances: { index_middle: [0.05, 0.30] } },
    ],
  },
  {
    id: 'O', type: 'static', uzbekLabel: "O harfi",
    description: "Bosh + ko'rsatkich doira shaklida (uchlari tegadi)",
    signature: [1, 1, 0, 0, 0],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      { tipDistances: { thumb_index: [0, 0.30] } },
    ],
  },
  {
    id: 'P', type: 'static', uzbekLabel: "P harfi",
    description: "B shakli, pastga qaragan",
    signature: [0, 1, 1, 0, 0],
    orientation: 'DOWN',
    difficulty: 3, xpReward: 20,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'closed', pinky: 'closed' } },
    ],
  },
  {
    id: 'Q', type: 'static', uzbekLabel: "Q harfi",
    description: "Thumb + index pastga, alohida (O emas)",
    signature: [1, 1, 0, 0, 0],
    orientation: 'DOWN',
    difficulty: 3, xpReward: 20,
    variants: [
      { fingers: { thumb: 'extended', index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    ],
  },
  {
    id: 'R', type: 'static', uzbekLabel: "R harfi",
    description: "Index + middle kesishgan",
    signature: [0, 1, 1, 0, 0],
    orientation: 'UP',
    difficulty: 3, xpReward: 20,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'closed', pinky: 'closed' },
        tipDistances: { index_middle: [0, 0.40] } },
    ],
  },
  {
    id: 'S', type: 'static', uzbekLabel: "S harfi",
    description: "Musht, bosh barmoq barmoqlar ustida",
    signature: [0, 0, 0, 0, 0],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'closed', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    ],
  },

  // ═════════════ 4-QATOR: T U V X Y Z ═════════════
  {
    id: 'T', type: 'dynamic', uzbekLabel: "T harfi",
    description: "Ko'rsatkich tik + chap-o'ng tebranish",
    signature: [0, 1, 0, 0, 0],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: 'shake', holdPose: { index: 'extended' } },
    difficulty: 3, xpReward: 20,
  },
  {
    id: 'U', type: 'static', uzbekLabel: "U harfi",
    description: "Shaka — bosh barmoq + chinchaloq ochiq",
    signature: [1, 0, 0, 0, 1],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { thumb: 'extended', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'extended' } },
    ],
  },
  {
    id: 'V', type: 'static', uzbekLabel: "V harfi",
    description: "Hamma barmoq ochiq, yopishgan (M ga o'xshash, lekin thumb ochiq)",
    signature: [1, 1, 1, 1, 1],
    orientation: 'UP',
    difficulty: 1, xpReward: 10,
    variants: [
      { fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' },
        tipDistances: { index_middle: [0.15, 0.50] } },
    ],
  },
  {
    id: 'X', type: 'static', uzbekLabel: "X harfi",
    description: "4 barmoq yopishgan, kaft gorizontal (yotgan)",
    signature: [0, 1, 1, 1, 1],
    orientation: 'SIDE',
    difficulty: 3, xpReward: 20,
    variants: [
      { fingers: { thumb: 'closed', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' } },
    ],
  },
  {
    id: 'Y', type: 'static', uzbekLabel: "Y harfi",
    description: "Faqat ko'rsatkich, yarim-egilgan (ilgak)",
    signature: [0, 2, 0, 0, 0],
    orientation: 'UP',
    difficulty: 2, xpReward: 15,
    variants: [
      { fingers: { middle: 'closed', ring: 'closed', pinky: 'closed' },
        bend: { index: [30, 100] } },
    ],
  },
  {
    id: 'Z', type: 'dynamic', uzbekLabel: "Z harfi",
    description: "Ko'rsatkich tik + havoda Z chizadi (zigzag)",
    signature: [0, 1, 0, 0, 0],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: 'zigzag', holdPose: { index: 'extended' } },
    difficulty: 4, xpReward: 25,
  },

  // ═════════════ 5-QATOR: O' G' Sh Ch Ng ═════════════
  {
    id: "O'", type: 'dynamic', uzbekLabel: "O' harfi",
    description: "U (shaka) + qo'l aylanadi",
    signature: [1, 0, 0, 0, 1],
    rules: { fingers: { thumb: 'extended', index: 'closed', middle: 'closed', ring: 'closed', pinky: 'extended' } },
    dynamic: { motion: 'circle' },
    difficulty: 4, xpReward: 25,
  },
  {
    id: "G'", type: 'dynamic', uzbekLabel: "G' harfi",
    description: "G (yon ishora) + index silkinadi",
    signature: [0, 1, 0, 0, 0],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'closed' } },
    dynamic: { motion: 'shake', holdPose: { index: 'extended' } },
    difficulty: 4, xpReward: 25,
  },
  {
    id: 'Sh', type: 'static', uzbekLabel: "Sh harfi",
    description: "M ga o'xshash, lekin kaft kameraga toza vertikal",
    signature: [1, 1, 1, 1, 1],
    orientation: 'FORWARD',
    difficulty: 2, xpReward: 15,
    variants: [
      // Sh = hamma ochiq, kaft kameraga
      { fingers: { thumb: 'extended', index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' } },
      // Yoki 4 barmoq tik, thumb yopiq
      { fingers: { index: 'extended', middle: 'extended', ring: 'extended', pinky: 'extended' } },
    ],
  },
  {
    id: 'Ch', type: 'static', uzbekLabel: "Ch harfi",
    description: "3 barmoq yarim egilgan, chinchaloq yopiq",
    signature: [0, 2, 2, 2, 0],
    orientation: 'UP',
    difficulty: 3, xpReward: 20,
    variants: [
      { fingers: { pinky: 'closed' },
        bend: { index: [30, 100], middle: [30, 100] } },
    ],
  },
  {
    id: 'Ng', type: 'dynamic', uzbekLabel: "Ng harfi",
    description: "Index + chinchaloq (rock) + yon siljish",
    signature: [0, 1, 0, 0, 1],
    rules: { fingers: { index: 'extended', middle: 'closed', ring: 'closed', pinky: 'extended' } },
    dynamic: { motion: ['slide', 'shake'] },
    difficulty: 4, xpReward: 25,
  },
];

export const ALPHABET_BY_ID = Object.fromEntries(ALPHABET.map(l => [l.id, l]));
export const STATIC_LETTERS  = ALPHABET.filter(l => l.type === 'static');
export const DYNAMIC_LETTERS = ALPHABET.filter(l => l.type === 'dynamic');
