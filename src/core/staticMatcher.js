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
    // 1 va 2 — qisman (hooked vs extended)
    if ((actual[i] === 2 && target[i] === 1) ||
        (actual[i] === 1 && target[i] === 2)) { score += 0.5; }
  }
  return score / 5;
}

// Asosiy decision tree
function decisionTree(hand) {
  if (!hand) return null;
  const sig    = hand.signature;
  const orient = hand.orientation;
  const c      = hand.contacts;

  // Helper: imzo mos kelishi
  const sig_eq = (target) => signatureMatch(sig, target) >= 0.8;

  // ═══ [0,0,0,0,0] — yopiq musht ═══
  if (sig_eq([0,0,0,0,0])) {
    // A — bosh barmoq yon tomonda
    // S — bosh barmoq barmoqlar ustida
    if (c.thumb_above_index_mcp) {
      return { id: 'S', confidence: 0.88 };
    }
    return { id: 'A', confidence: 0.90 };
  }

  // ═══ [1,0,0,0,0] — faqat bosh barmoq ═══
  if (sig_eq([1,0,0,0,0])) {
    return { id: 'A', confidence: 0.92 };
  }

  // ═══ [0,0,0,0,1] — faqat chinchaloq ═══
  if (sig_eq([0,0,0,0,1])) {
    return { id: 'I', confidence: 0.95 };
  }

  // ═══ [1,0,0,0,1] — bosh + chinchaloq (shaka) ═══
  if (sig_eq([1,0,0,0,1])) {
    // U — statik
    // O' — harakat bilan (dynamic matcher hal qiladi)
    return { id: 'U', confidence: 0.92 };
  }

  // ═══ [0,1,1,0,0] — index + middle ═══
  if (sig_eq([0,1,1,0,0])) {
    if (orient === 'DOWN') {
      return { id: 'P', confidence: 0.85 };
    }
    if (c.index_middle_crossed) {
      return { id: 'R', confidence: 0.90 };
    }
    if (c.index_middle_close) {
      return { id: 'B', confidence: 0.88 };
    }
    return { id: 'N', confidence: 0.78 };
  }

  // ═══ [1,1,0,0,0] — bosh + ko'rsatkich ═══
  if (sig_eq([1,1,0,0,0])) {
    // O — uchlari tegadi (doira)
    // Q — pastga qaragan
    // G — yon tomonga
    // L — agar barmoq orasida burchak katta bo'lsa
    if (c.thumb_index_touch) {
      return { id: 'O', confidence: 0.92 };
    }
    if (orient === 'DOWN') {
      return { id: 'Q', confidence: 0.82 };
    }
    if (orient === 'SIDE') {
      return { id: 'G', confidence: 0.85 };
    }
    // UP — L (agar burchak yetarli)
    if (hand.thumbIndexAngle >= 50 && hand.thumbIndexAngle <= 130) {
      return { id: 'L', confidence: 0.90 };
    }
    return { id: 'L', confidence: 0.75 };
  }

  // ═══ [1,1,1,1,1] — hammasi cho'zilgan ═══
  if (sig_eq([1,1,1,1,1])) {
    // L — kerilgan (barmoq orasi katta)
    // V — barmoqlar yopishgan
    // Sh — kaft kameraga to'g'ri vertikal
    if (c.fingers_spread) {
      return { id: 'L', confidence: 0.90 };
    }
    if (orient === 'FORWARD') {
      return { id: 'Sh', confidence: 0.82 };
    }
    return { id: 'V', confidence: 0.80 };
  }

  // ═══ [0,1,1,1,1] — 4 barmoq (thumb yopiq) ═══
  if (sig_eq([0,1,1,1,1])) {
    // Sh — vertikal, 4 barmoq tik
    // X — gorizontal (yon)
    // M — yopishgan
    if (orient === 'SIDE') {
      return { id: 'X', confidence: 0.82 };
    }
    if (c.fingers_close) {
      return { id: 'M', confidence: 0.80 };
    }
    return { id: 'Sh', confidence: 0.85 };
  }

  // ═══ [0,2,2,2,2] — hammasi yarim-egilgan (E) ═══
  if (sig_eq([0,2,2,2,2])) {
    return { id: 'E', confidence: 0.85 };
  }

  // ═══ [0,2,2,0,0] — index+middle hook (F) ═══
  if (sig_eq([0,2,2,0,0])) {
    return { id: 'F', confidence: 0.82 };
  }

  // ═══ [0,2,2,2,0] — 3 barmoq hook (Ch) ═══
  if (sig_eq([0,2,2,2,0])) {
    return { id: 'Ch', confidence: 0.82 };
  }

  // ═══ [0,2,0,0,0] — faqat index hook (Y) ═══
  if (sig_eq([0,2,0,0,0])) {
    return { id: 'Y', confidence: 0.82 };
  }

  // ═══ [0,1,0,0,0] — faqat ko'rsatkich (G/K/T/Z) ═══
  if (sig_eq([0,1,0,0,0])) {
    // Harakatga qarab ajratiladi (dynamic matcher)
    // Statik bo'lsa — G (agar SIDE), aks holda noaniq
    if (orient === 'SIDE') {
      return { id: 'G', confidence: 0.78 };
    }
    // UP holatda — G yoki harakatli (K, T, Z) — dynamic matcher hal qiladi
    return { id: 'B', confidence: 0.55 };  // B ga yumshoq taxmin
  }

  // ═══ [0,1,0,0,1] — index + chinchaloq (Ng) ═══
  if (sig_eq([0,1,0,0,1])) {
    return { id: 'Ng', confidence: 0.78 };
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

export function matchStaticLetter(features, threshold = 0.5) {
  if (!features?.dominant && !features?.secondary) return null;

  // 1) Decision tree
  const dt = bestDecisionAcrossHands(features);

  // 2) Soft scoring (zaxira yoki katta ball uchun)
  let softBest = null;
  let softScore = 0;
  const allScores = {};

  for (const letter of ALPHABET) {
    if (letter.type !== 'static') continue;
    const score = bestScoreAcrossHands(letter, features);
    allScores[letter.id] = score;
    if (score > softScore) { softScore = score; softBest = letter; }
  }

  // Decision tree natijasi yetarli ishonchli bo'lsa — uni qabul qilamiz
  if (dt && dt.confidence >= threshold) {
    return {
      letter: dt.id,
      label: ALPHABET.find(l => l.id === dt.id)?.uzbekLabel || dt.id,
      confidence: dt.confidence,
      all: allScores,
      method: 'decision_tree',
    };
  }

  // Aks holda soft scoring natijasi
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

  // Decision tree boshqa harfni topgan bo'lsa, biroz pasaytirib soft ball
  if (dt && dt.id !== letterId && dt.confidence > 0.7) {
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
