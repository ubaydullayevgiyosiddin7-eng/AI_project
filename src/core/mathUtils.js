// Asosiy vektor/geometriya yordamchilari

export function dist2D(a, b) {
  if (!a || !b) return 0;
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function dist3D(a, b) {
  if (!a || !b) return 0;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + dz * dz);
}

export function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: (a.z || 0) - (b.z || 0) };
}

export function norm(v) {
  const m = Math.sqrt(v.x * v.x + v.y * v.y + (v.z || 0) * (v.z || 0)) || 1;
  return { x: v.x / m, y: v.y / m, z: (v.z || 0) / m };
}

export function dot(a, b) {
  return a.x * b.x + a.y * b.y + (a.z || 0) * (b.z || 0);
}

export function cross(a, b) {
  return {
    x: a.y * (b.z || 0) - (a.z || 0) * b.y,
    y: (a.z || 0) * b.x - a.x * (b.z || 0),
    z: a.x * b.y - a.y * b.x,
  };
}

// Uch nuqta orasidagi burchak (B — markaz), darajada
export function angleAt(A, B, C) {
  const ba = sub(A, B);
  const bc = sub(C, B);
  const cosA = dot(norm(ba), norm(bc));
  const clamped = Math.max(-1, Math.min(1, cosA));
  return (Math.acos(clamped) * 180) / Math.PI;
}

export function clamp(v, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function expSmooth(prev, next, alpha) {
  return prev + (next - prev) * alpha;
}

// Ko'p chastotali ovoz berish — qaysi qiymat ko'pchilik?
export function majority(arr, minCount = 1) {
  const map = new Map();
  for (const v of arr) {
    if (v == null) continue;
    map.set(v, (map.get(v) || 0) + 1);
  }
  let best = null;
  let bestCount = 0;
  for (const [k, c] of map.entries()) {
    if (c > bestCount) { best = k; bestCount = c; }
  }
  if (bestCount < minCount) return null;
  return { value: best, count: bestCount, ratio: bestCount / arr.length };
}
