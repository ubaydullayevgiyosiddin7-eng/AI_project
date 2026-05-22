// Harakatli imo-ishoralar — trajektoriya tahlili
// Motion turlari: none, circle, zigzag, shake (chap-o'ng), slide, j-curve

import { dist2D } from './mathUtils';

export class TrajectoryBuffer {
  constructor(maxLen = 45) {
    this.maxLen = maxLen;
    this.points = [];
  }

  push(point, holdPose = null) {
    this.points.push({ ...point, t: Date.now(), hold: holdPose });
    if (this.points.length > this.maxLen) this.points.shift();
  }

  clear() { this.points = []; }
  length() { return this.points.length; }
  recent(n) { return this.points.slice(-n); }
}

// ─── Motion type — umumiy harakat turi (yumshoq threshold) ───
export function classifyMotion(points) {
  if (points.length < 6) return 'none';   // 10 → 6

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const bboxW = xMax - xMin;
  const bboxH = yMax - yMin;

  // Juda kichik harakat
  if (bboxW < 0.02 && bboxH < 0.02) return 'none';   // 0.04 → 0.02

  // ── Boshlanish va tugash yaqinmi? (doira) ──
  const startEnd = dist2D(points[0], points[points.length - 1]);
  const pathLen = pathLength(points);

  // Doira: kengroq threshold
  if (startEnd < 0.08 && pathLen > 0.15 && bboxW > 0.03 && bboxH > 0.03) {
    return 'circle';
  }

  const directionChanges = countDirectionChanges(points);

  // Zigzag — kengroq
  if (directionChanges >= 2 && bboxW > 0.06) {     // 0.10 → 0.06
    return 'zigzag';
  }

  // Shake — yumshoqroq
  if (bboxW > 1.5 * bboxH && directionChanges >= 1 && bboxW > 0.05) {  // 0.08 → 0.05
    return 'shake';
  }

  // J-curve
  if (isJCurve(points)) {
    return 'j-curve';
  }

  // Slide — bitta yo'nalish
  if (bboxW > 0.06 && bboxH < 0.04) return 'slide';
  if (bboxH > 0.06 && bboxW < 0.04) return 'slide';

  return 'none';
}

function pathLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += dist2D(points[i], points[i - 1]);
  }
  return len;
}

function countDirectionChanges(points) {
  let changes = 0;
  for (let i = 2; i < points.length; i++) {
    const v1x = points[i - 1].x - points[i - 2].x;
    const v1y = points[i - 1].y - points[i - 2].y;
    const v2x = points[i].x - points[i - 1].x;
    const v2y = points[i].y - points[i - 1].y;
    if (v1x * v2x + v1y * v2y < -0.001) changes++;
  }
  return changes;
}

// J-curve: avval pastga, keyin chapga
function isJCurve(points) {
  if (points.length < 12) return false;
  const half = Math.floor(points.length / 2);
  const first = points.slice(0, half);
  const second = points.slice(half);
  const fdx = first[first.length - 1].x - first[0].x;
  const fdy = first[first.length - 1].y - first[0].y;
  const sdx = second[second.length - 1].x - second[0].x;
  const sdy = second[second.length - 1].y - second[0].y;
  // 1-yarim: pastga (dy > 0)
  // 2-yarim: chapga (dx < 0)
  return fdy > 0.05 && sdx < -0.04;
}

function isCircular(points) {
  if (points.length < 8) return 0;
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
  const radii = points.map(p => Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2));
  const meanR = radii.reduce((s, r) => s + r, 0) / radii.length;
  if (meanR < 0.02) return 0;
  const variance = radii.reduce((s, r) => s + (r - meanR) ** 2, 0) / radii.length;
  const cv = Math.sqrt(variance) / meanR;
  return Math.max(0, 1 - cv * 2);
}

function holdMatches(actualHold, expectedHold) {
  if (!actualHold || !expectedHold) return false;
  for (const [finger, expected] of Object.entries(expectedHold)) {
    const actual = actualHold[finger];
    const want = expected === 'extended';
    if (actual !== want) return false;
  }
  return true;
}

// ─── Bitta harakatli imora uchun ball ───
export function scoreDynamicSign(sign, buffer) {
  if (!sign.dynamic) return 0;
  if (buffer.length() < 6) return 0;   // 8 → 6

  const points = buffer.points;
  const motion = classifyMotion(points);
  const d = sign.dynamic;

  let score = 0;
  let weight = 0;

  // 1) Pose stabilligi
  if (d.holdPose) {
    const matchingFrames = points.filter(p => p.hold && holdMatches(p.hold, d.holdPose));
    const poseScore = matchingFrames.length / points.length;
    score += poseScore * 2;
    weight += 2;
  }

  // 2) Harakat turi mosligi
  if (d.motion) {
    const want = Array.isArray(d.motion) ? d.motion : [d.motion];
    const matched = want.includes(motion);
    score += (matched ? 1 : 0) * 3;
    weight += 3;
  }

  // 3) Doirasimi? (eski API mosligi uchun)
  if (d.circular) {
    const cscore = isCircular(points);
    score += cscore * 3;
    weight += 3;
  }

  // 4) Uzunlik (minimum harakat)
  if (d.minLength) {
    const len = pathLength(points);
    const ok = len >= d.minLength;
    score += (ok ? 1 : len / d.minLength) * 1;
    weight += 1;
  }

  if (weight === 0) return 0;
  return score / weight;
}

export function matchDynamicSign(buffer, signList, threshold = 0.6) {
  if (buffer.length() < 8) return null;

  let best = null;
  let bestScore = 0;

  for (const sign of signList) {
    if (sign.type !== 'dynamic' && !sign.dynamic) continue;
    const score = scoreDynamicSign(sign, buffer);
    if (score > bestScore) { bestScore = score; best = sign; }
  }

  if (!best || bestScore < threshold) return null;
  return { id: best.id, label: best.uzbekLabel || best.id, confidence: bestScore };
}
