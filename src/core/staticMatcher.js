// Statik harf aniqlovchi — IKKI BOSQICHLI:
//   1. Decision Tree (asosiy) — signature [T,I,M,R,P] + orientation + contacts
//   2. Soft scoring (zaxira) — borderline holatlar uchun
//
// Hujjat asosida — o'zbek qo'l alifbosini aynan rasmdek aniqlash.

import { ALPHABET } from '../data/alphabet';

// ───────────────────────────────────────────────
// 1-BOSQICH: DECISION TREE CLASSIFIER
// ───────────────────────────────────────────────

// Imzo (signature) qisman moslashishi (3-states: 0|1|2)
//   target ichida '*' — wildcard
function signatureMatch(actual, target) {
  let score = 0;
  for (let i = 0; i < 5; i++) {
    if (target[i] === '*') { score++; continue; }
    if (actual[i] === target[i]) { score++; continue; }
    // 1 va 2 — ikkalasi ham "ochiq" — yuqori kredit
    if ((actual[i] === 2 && target[i] === 1) ||
        (actual[i] === 1 && target[i] === 2)) { score += 0.85; }
    // 0 va 2 — biroz mos (yopiq vs yarim-egilgan)
    else if ((actual[i] === 0 && target[i] === 2) ||
             (actual[i] === 2 && target[i] === 0)) { score += 0.4; }
  }
  return score / 5;
}

// Asosiy decision tree — hujjatga va foydalanuvchi sinovlariga moslangan
function decisionTree(hand) {
  if (!hand) return null;
  const sig    = hand.signature;
  const orient = hand.orientation;
  const c      = hand.contacts;

  // Helper: imzo mos kelishi (0.7 — yumshoq tolerantlik)
  const sig_eq = (target) => signatureMatch(sig, target) >= 0.7;

  // ═══ [0,0,0,0,0] — yopiq musht ═══
  if (sig_eq([0,0,0,0,0])) {
    if (c.thumb_above_index_mcp) {
      return { id: 'S', confidence: 0.92 };
    }
    return { id: 'A', confidence: 0.92 };
  }

  // ═══ [0,2,2,2,2] yoki yumshoq variant — E (barmoqlar yarim egilgan) ═══
  if (sig_eq([0,2,2,2,2])) {
    return { id: 'E', confidence: 0.92 };
  }
  // Yumshoq E: kamida 2 ta hook + qolgani yopiq yoki hook
  const hookCount = (sig[1] === 2 ? 1 : 0) + (sig[2] === 2 ? 1 : 0) +
                    (sig[3] === 2 ? 1 : 0) + (sig[4] === 2 ? 1 : 0);
  if (sig[0] === 0 && hookCount >= 3) {
    // 3+ barmoq yarim egilgan + thumb yopiq = E
    return { id: 'E', confidence: 0.88 };
  }

  // ═══ [1,0,0,0,0] — faqat bosh barmoq ═══
  if (sig_eq([1,0,0,0,0])) {
    return { id: 'A', confidence: 0.94 };
  }

  // ═══ [0,0,0,0,1] — faqat chinchaloq ═══
  if (sig_eq([0,0,0,0,1])) {
    return { id: 'I', confidence: 0.95 };
  }

  // ═══ [1,0,0,0,1] — bosh + chinchaloq (shaka) ═══
  if (sig_eq([1,0,0,0,1])) {
    return { id: 'U', confidence: 0.94 };
  }

  // ═══ [0,1,1,0,1] — N harfi (foydalanuvchi tavsifi) ═══
  // 3 barmoq ochiq (index, middle, pinky) + thumb-ring tegishi
  if (sig_eq([0,1,1,0,1])) {
    if (c.thumb_ring_touch) {
      return { id: 'N', confidence: 0.93 };
    }
    return { id: 'Ng', confidence: 0.85 };
  }

  // ═══ [0,1,0,1,1] — R harfi (foydalanuvchi tavsifi) ═══
  // 3 barmoq ochiq (index, ring, pinky) + thumb-middle tegishi
  if (sig_eq([0,1,0,1,1])) {
    if (c.thumb_middle_touch) {
      return { id: 'R', confidence: 0.93 };
    }
    return { id: 'R', confidence: 0.82 };
  }

  // ═══ [0,1,1,0,0] — index + middle UP → B (foydalanuvchi tanlovi) ═══
  // Foydalanuvchi B qilganda middle ham biroz ko'tarilishi mumkin
  if (sig_eq([0,1,1,0,0])) {
    if (orient === 'DOWN') {
      return { id: 'P', confidence: 0.92 };
    }
    if (c.index_middle_crossed) {
      return { id: 'R', confidence: 0.88 };
    }
    // UP: B (avval Q edi, hozir B priority)
    return { id: 'B', confidence: 0.92 };
  }

  // ═══ [1,1,0,0,0] — bosh + ko'rsatkich ═══
  if (sig_eq([1,1,0,0,0])) {
    if (c.thumb_index_touch) {
      // Foydalanuvchi tanlovi: pinch shape = S
      return { id: 'S', confidence: 0.92 };
    }
    if (orient === 'SIDE') {
      return { id: 'G', confidence: 0.90 };
    }
    if (orient === 'DOWN') {
      return { id: 'P', confidence: 0.85 };
    }
    // UP: L (faqat aniq 90° atrofidagi L shakli) yoki B (oddiy index UP)
    if (hand.thumbIndexAngle >= 75 && hand.thumbIndexAngle <= 110) {
      return { id: 'L', confidence: 0.90 };
    }
    // Tabiiy holatda thumb ozgina chiqib turadi — bu B
    return { id: 'B', confidence: 0.91 };
  }

  // ═══ [1,1,1,1,1] — hammasi cho'zilgan ═══
  if (sig_eq([1,1,1,1,1])) {
    if (c.fingers_spread) {
      return { id: 'L', confidence: 0.94 };
    }
    return { id: 'V', confidence: 0.92 };
  }

  // ═══ Generic: thumb=0, pinky=0, 3 o'rta barmoq ochiq (1 yoki 2) ═══
  // T (DOWN) yoki Sh (UP) — orientation bilan ajratiladi
  const sig3middle = sig[0] === 0 && sig[4] === 0 &&
                     sig[1] >= 1 && sig[2] >= 1 && sig[3] >= 1;
  if (sig3middle) {
    if (orient === 'DOWN') {
      return { id: 'T', confidence: 0.93 };
    }
    // UP yoki SIDE — Sh
    // Lekin agar uchchala barmoq aniq hook bo'lsa, Ch ham bo'lishi mumkin
    const allHooked = sig[1] === 2 && sig[2] === 2 && sig[3] === 2;
    if (allHooked && orient !== 'DOWN') {
      return { id: 'Ch', confidence: 0.90 };
    }
    return { id: 'Sh', confidence: 0.93 };
  }

  // ═══ [0,1,1,1,1] — 4 barmoq tik (thumb yopiq) ═══
  if (sig_eq([0,1,1,1,1])) {
    if (orient === 'SIDE') {
      return { id: 'X', confidence: 0.90 };
    }
    if (orient === 'DOWN') {
      return { id: 'D', confidence: 0.90 };
    }
    if (c.fingers_close) {
      return { id: 'M', confidence: 0.92 };
    }
    return { id: 'M', confidence: 0.88 };
  }

  // ═══ [0,2,2,0,0] — index+middle hook (F) ═══
  if (sig_eq([0,2,2,0,0])) {
    return { id: 'F', confidence: 0.90 };
  }

  // ═══ [0,2,2,2,0] — 3 barmoq hook (Ch) ═══
  if (sig_eq([0,2,2,2,0])) {
    return { id: 'Ch', confidence: 0.90 };
  }

  // ═══ [0,2,0,0,0] — faqat index hook (X / Y) ═══
  if (sig_eq([0,2,0,0,0])) {
    // X — ilmoq (ko'rsatkich yarim-egilgan)
    // Y — image dan ko'rinishidan farqli
    return { id: 'X', confidence: 0.90 };
  }

  // ═══ [0,1,0,0,0] — faqat ko'rsatkich (B statik yoki G/K/Z dynamic) ═══
  if (sig_eq([0,1,0,0,0])) {
    if (orient === 'SIDE') {
      return { id: 'G', confidence: 0.90 };
    }
    // UP — B statik (yoki K/Z harakatli — dynamic matcher hal qiladi)
    return { id: 'B', confidence: 0.90 };
  }

  // ═══ [0,1,0,0,1] — index + chinchaloq (Ng statik) ═══
  if (sig_eq([0,1,0,0,1])) {
    return { id: 'Ng', confidence: 0.85 };
  }

  // ═══ FALLBACK B — index UP dominant, juda yumshoq qabul ═══
  // Foydalanuvchi B qilganda boshqa barmoqlar tabiiy ravishda biroz chiqib qolishi mumkin
  if (orient === 'UP' && sig[1] === 1) {
    // Index aniq tik
    // Q (index+middle) yoki I (faqat pinky) bilan adashmaslik uchun:
    //   - middle ochiq emas → B
    //   - middle ochiq + ring/pinky yopiq → Q (allaqachon yuqorida)
    if (sig[2] !== 1 && sig[3] !== 1) {
      // index + (pinky bo'lishi mumkin) — pinky noise qabul
      return { id: 'B', confidence: 0.88 };
    }
  }

  return null;
}

// Decision tree — ikkala qo'lda eng yaxshi natija
function bestDecisionAcrossHands(features) {
  let best = null;
  const tryHand = (hand) => {
    if (!hand) return;
    const r = decisionTree(hand);
    if (r && (!best || r.confidence > best.confidence)) best = r;
  };
  tryHand(features.dominant);
  tryHand(features.secondary);
  return best;
}

// ───────────────────────────────────────────────
// 2-BOSQICH: SOFT SCORING (zaxira)
// ───────────────────────────────────────────────

// Qattiqroq scoring: faqat aniq holatlarda yuqori ball, borderline da 0
function softFingerScore(extScore, expected) {
  if (expected === 'extended') {
    if (extScore >= 0.75) return 1.0;
    if (extScore >= 0.55) return 0.5;
    if (extScore >= 0.40) return 0.2;
    return 0;
  }
  if (expected === 'closed') {
    if (extScore <= 0.25) return 1.0;
    if (extScore <= 0.45) return 0.5;
    if (extScore <= 0.60) return 0.2;
    return 0;
  }
  return 0.5;
}

function rangeScore(value, [lo, hi], tolerance = 0.25) {
  if (value >= lo && value <= hi) return 1;
  const mid = (lo + hi) / 2;
  const half = (hi - lo) / 2;
  const dist = Math.abs(value - mid);
  const limit = half * (1 + tolerance);
  if (dist <= limit) return 1 - (dist - half) / (limit - half + 0.001);
  return 0;
}

function scoreSingleRule(rules, handFeatures, handToFace) {
  if (!handFeatures || !rules) return 0;
  const f = handFeatures;
  let totalWeight = 0;
  let totalScore = 0;

  if (rules.fingers) {
    for (const [finger, expected] of Object.entries(rules.fingers)) {
      const extScore = f.extension?.[finger] ?? (f.extended[finger] ? 1 : 0);
      const score = softFingerScore(extScore, expected);
      totalScore += score * 2;
      totalWeight += 2;
    }
  }

  if (rules.thumbIndexAngle) {
    const score = rangeScore(f.thumbIndexAngle, rules.thumbIndexAngle);
    totalScore += score * 1.5;
    totalWeight += 1.5;
  }

  if (rules.tipDistances) {
    for (const [pair, range] of Object.entries(rules.tipDistances)) {
      const actual = f.tipDist[pair];
      if (actual == null) continue;
      const score = rangeScore(actual, range);
      totalScore += score * 1.2;
      totalWeight += 1.2;
    }
  }

  if (rules.bend) {
    for (const [finger, range] of Object.entries(rules.bend)) {
      const actual = f.bend[finger];
      if (actual == null) continue;
      const score = rangeScore(actual, range);
      totalScore += score * 1.0;
      totalWeight += 1.0;
    }
  }

  if (totalWeight === 0) return 0;
  return totalScore / totalWeight;
}

function scoreLetterWithHand(letter, handFeatures) {
  if (!handFeatures) return 0;
  const variants = letter.variants && letter.variants.length > 0
    ? letter.variants
    : (letter.rules ? [letter.rules] : []);
  let best = 0;
  for (const v of variants) {
    const s = scoreSingleRule(v, handFeatures);
    if (s > best) best = s;
  }
  return best;
}

function bestScoreAcrossHands(letter, features) {
  let best = 0;
  if (features.dominant) {
    const s = scoreLetterWithHand(letter, features.dominant);
    if (s > best) best = s;
  }
  if (features.secondary) {
    const s = scoreLetterWithHand(letter, features.secondary);
    if (s > best) best = s;
  }
  return best;
}

// ───────────────────────────────────────────────
// EKSPORT: matchStaticLetter — birlashtirilgan
// ───────────────────────────────────────────────

export function matchStaticLetter(features, threshold = 0.5, allowedLetters = null) {
  if (!features?.dominant && !features?.secondary) return null;

  const isAllowed = (id) => !allowedLetters || allowedLetters.has(id);

  // 1) Decision tree
  const dt = bestDecisionAcrossHands(features);

  // 2) Soft scoring — faqat ruxsat etilgan harflarni hisoblaymiz
  let softBest = null;
  let softScore = 0;
  const allScores = {};

  for (const letter of ALPHABET) {
    if (letter.type !== 'static') continue;
    if (!isAllowed(letter.id)) continue;     // filter
    const score = bestScoreAcrossHands(letter, features);
    allScores[letter.id] = score;
    if (score > softScore) { softScore = score; softBest = letter; }
  }

  // Decision tree natijasi qabul qilinadi faqat ruxsat etilgan bo'lsa
  if (dt && dt.confidence >= threshold && isAllowed(dt.id)) {
    return {
      letter: dt.id,
      label: ALPHABET.find(l => l.id === dt.id)?.uzbekLabel || dt.id,
      confidence: dt.confidence,
      all: allScores,
      method: 'decision_tree',
    };
  }

  // Aks holda soft scoring natijasi (faqat ruxsat etilgan harflar orasidan)
  if (softBest && softScore >= threshold) {
    return {
      letter: softBest.id,
      label: softBest.uzbekLabel || softBest.id,
      confidence: softScore,
      all: allScores,
      method: 'soft',
    };
  }

  return { letter: null, confidence: Math.max(softScore, dt?.confidence || 0), all: allScores };
}

export function matchStaticSign(features, signList, threshold = 0.5) {
  if (!features?.dominant && !features?.secondary) return null;
  let best = null;
  let bestScore = 0;
  for (const sign of signList) {
    if (sign.type !== 'static') continue;
    const score = bestScoreAcrossHands(sign, features);
    if (score > bestScore) { bestScore = score; best = sign; }
  }
  if (!best || bestScore < threshold) return null;
  return { id: best.id, label: best.uzbekLabel || best.id, confidence: bestScore };
}

// Lesson rejimi — belgilangan harf uchun ball
export function scoreSpecificLetter(letterId, features) {
  const letter = ALPHABET.find(l => l.id === letterId);
  if (!letter) return { confidence: 0, mistakes: [] };

  // Decision tree dan ham foydalanamiz — agar dt aynan shu harfni topsa, yuqori ball
  const dt = bestDecisionAcrossHands(features);
  if (dt && dt.id === letterId) {
    return { confidence: dt.confidence, mistakes: [], letter };
  }

  // Aks holda soft scoring
  let bestScore = 0;
  let bestHand = null;
  if (features.dominant) {
    const s = scoreLetterWithHand(letter, features.dominant);
    if (s > bestScore) { bestScore = s; bestHand = features.dominant; }
  }
  if (features.secondary) {
    const s = scoreLetterWithHand(letter, features.secondary);
    if (s > bestScore) { bestScore = s; bestHand = features.secondary; }
  }

  // Maxsus: B target — index aniq UP bo'lsa, balni ko'taramiz
  if (letterId === 'B' && bestScore < 0.85) {
    const indexUpAndSimple = (hand) => {
      if (!hand) return false;
      return hand.fingerState?.index === 1 &&
             hand.fingerState?.ring !== 1 &&
             hand.fingerState?.pinky !== 1 &&
             hand.orientation === 'UP';
    };
    if (indexUpAndSimple(features.dominant) || indexUpAndSimple(features.secondary)) {
      bestScore = Math.max(bestScore, 0.88);
    }
  }

  // Maxsus: S target — thumb+index pinch (foydalanuvchi tanlovi)
  if (letterId === 'S' && bestScore < 0.85) {
    const pinchShape = (hand) => {
      if (!hand) return false;
      return hand.contacts?.thumb_index_touch &&
             hand.fingerState?.middle !== 1 &&
             hand.fingerState?.ring  !== 1 &&
             hand.fingerState?.pinky !== 1;
    };
    if (pinchShape(features.dominant) || pinchShape(features.secondary)) {
      bestScore = Math.max(bestScore, 0.92);
    }
  }

  // Maxsus: Ch target — eski qoidasi (3 hooked) bilan ham qabul qilinsin
  if (letterId === 'Ch' && bestScore < 0.85) {
    const pinchShape = (hand) => {
      if (!hand) return false;
      return hand.contacts?.thumb_index_touch &&
             hand.fingerState?.middle !== 1 &&
             hand.fingerState?.ring  !== 1 &&
             hand.fingerState?.pinky !== 1;
    };
    if (pinchShape(features.dominant) || pinchShape(features.secondary)) {
      bestScore = Math.max(bestScore, 0.85);
    }
  }

  // Adashtirish riski past harflar — DT boshqa harfni topsa ham cap qo'ymaymiz
  const sharedGestures = new Set(['B', 'Ch', 'S']);
  if (dt && dt.id !== letterId && dt.confidence > 0.7 && !sharedGestures.has(letterId)) {
    bestScore = Math.min(bestScore, 0.4);
  }

  const mistakes = bestHand ? analyzeMistakes(letter, bestHand) : [];
  return { confidence: bestScore, mistakes, letter };
}

function analyzeMistakes(letter, handFeatures) {
  if (!handFeatures) return [];
  const variants = letter.variants && letter.variants.length > 0
    ? letter.variants
    : (letter.rules ? [letter.rules] : []);
  if (!variants.length) return [];

  let bestVariant = variants[0];
  let bestScore = 0;
  for (const v of variants) {
    const s = scoreSingleRule(v, handFeatures);
    if (s > bestScore) { bestScore = s; bestVariant = v; }
  }

  const f = handFeatures;
  const mistakes = [];

  if (bestVariant.fingers) {
    for (const [finger, expected] of Object.entries(bestVariant.fingers)) {
      const extScore = f.extension?.[finger] ?? 0;
      const score = softFingerScore(extScore, expected);
      if (score < 0.5) {
        mistakes.push({
          finger,
          tip: getMistakeTip(finger, expected === 'extended'),
        });
      }
    }
  }

  return mistakes;
}

function getMistakeTip(finger, shouldExtend) {
  const names = {
    thumb: "bosh barmog'ingiz",
    index: "ko'rsatkich barmog'ingiz",
    middle: "o'rta barmog'ingiz",
    ring: "nomsiz barmog'ingiz",
    pinky: "chinchalog'ingiz",
  };
  const name = names[finger] || finger;
  return shouldExtend
    ? `${name} to'g'ri va tik bo'lishi kerak`
    : `${name} yopiq bo'lishi kerak`;
}
