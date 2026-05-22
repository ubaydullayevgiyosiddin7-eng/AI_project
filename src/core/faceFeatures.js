// Yuz landmark (468 nuqta) → grammatika uchun xususiyatlar
//
// Asosiy nuqtalar:
//   1   — burun uchi
//   13  — yuqori labning markazi (ichi)
//   14  — pastki labning markazi (ichi)
//   17  — engak
//   33  — chap ko'z tashqi burchak
//   263 — o'ng ko'z tashqi burchak
//   61  — chap og'iz burchagi
//   291 — o'ng og'iz burchagi
//   105 — chap qosh markazi
//   334 — o'ng qosh markazi
//   159 — chap yuqori ko'z qovog'i
//   145 — chap pastki ko'z qovog'i
//   386 — o'ng yuqori ko'z qovog'i
//   374 — o'ng pastki ko'z qovog'i
//   234 — chap quloq
//   454 — o'ng quloq

import { dist2D, dist3D, angleAt } from './mathUtils';

export function faceSize(lm) {
  if (!lm || !lm[234] || !lm[454]) return 0.2;
  return dist3D(lm[234], lm[454]) || 0.2;
}

export function extractFaceFeatures(lm) {
  if (!lm || lm.length < 468) return null;

  const fsize = faceSize(lm);

  // Qoshlar — ko'zga nisbatan qancha yuqorida?
  const leftEyebrowY = lm[105].y;
  const rightEyebrowY = lm[334].y;
  const leftEyeY = lm[159].y;
  const rightEyeY = lm[386].y;

  const eyebrowRaise = (
    (leftEyeY - leftEyebrowY) + (rightEyeY - rightEyebrowY)
  ) / (2 * fsize);

  // Og'iz ochiqligi
  const mouthOpen = dist2D(lm[13], lm[14]) / fsize;

  // Og'iz kengligi/balandligi (sifat — "katta/kichik" uchun)
  const mouthWidth  = dist2D(lm[61], lm[291]) / fsize;
  const mouthHeight = dist2D(lm[13], lm[14]) / fsize + 0.001;
  const mouthAspect = mouthWidth / mouthHeight;

  // Ko'z ochiqligi (kuzatish/diqqat uchun)
  const leftEyeOpen  = dist2D(lm[159], lm[145]) / fsize;
  const rightEyeOpen = dist2D(lm[386], lm[374]) / fsize;
  const eyeOpen = (leftEyeOpen + rightEyeOpen) / 2;

  // Bosh egilishi (chap-o'ng)
  const headTilt = (lm[234].y - lm[454].y) / fsize;

  // Og'iz burchagi (tabassum/qovoq)
  const mouthCornerAvg = (lm[61].y + lm[291].y) / 2;
  const mouthCenterY = (lm[13].y + lm[14].y) / 2;
  const smile = (mouthCenterY - mouthCornerAvg) / fsize;

  // Kadrning markazi qaerda
  const center = lm[1];

  return {
    eyebrowRaise,    // > 0.05 → ko'tarilgan (savol)
    mouthOpen,       // > 0.04 → ochiq
    mouthAspect,     // > 2.5 → keng (I shakli), < 1.5 → tor (O shakli)
    eyeOpen,
    headTilt,
    smile,           // > 0 → tabassum, < 0 → qovoq
    nosePos: { x: center.x, y: center.y },
    faceSize: fsize,
    rawLandmarks: lm,
  };
}

// Yuz grammatikasini aniqlash — gap modifikatori
export function detectGrammar(faceFeatures) {
  if (!faceFeatures) return 'statement';

  if (faceFeatures.eyebrowRaise > 0.06) return 'question';
  if (faceFeatures.eyebrowRaise < -0.04) return 'negation';
  if (faceFeatures.mouthAspect > 3.0) return 'intensity_high';
  if (faceFeatures.mouthAspect < 1.4 && faceFeatures.mouthOpen > 0.03) return 'intensity_low';
  return 'statement';
}
