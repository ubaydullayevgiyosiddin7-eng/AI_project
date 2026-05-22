// Qo'l landmark (21 nuqta) → invariant xususiyatlar va IMZO (signature)
//
// MediaPipe Hands indekslari:
//   0  — bilek (wrist)
//   1-4   — bosh barmoq (thumb): CMC, MCP, IP, TIP
//   5-8   — ko'rsatkich (index)
//   9-12  — o'rta (middle)
//   13-16 — nomsiz (ring)
//   17-20 — chinchaloq (pinky)

import { dist3D, sub, norm, angleAt, cross } from './mathUtils';

const TIPS = { thumb: 4,  index: 8,  middle: 12, ring: 16, pinky: 20 };
const DIPS = { thumb: 3,  index: 7,  middle: 11, ring: 15, pinky: 19 };
const PIPS = { thumb: 3,  index: 6,  middle: 10, ring: 14, pinky: 18 };
const MCPS = { thumb: 2,  index: 5,  middle: 9,  ring: 13, pinky: 17 };

const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky'];

// Qo'l hajmi — bilekdan o'rta MCP ga
export function handSize(lm) {
  if (!lm || !lm[0] || !lm[9]) return 0.1;
  return dist3D(lm[0], lm[9]) || 0.1;
}

// ── Barmoq holati (3-states): 0=yopiq, 1=ochiq, 2=yarim-egilgan (hook) ──
// Yumshoqroq threshold — odamlar tabiiy holatda bajarsa ham aniqlansin
function fingerExtState(lm, finger) {
  const tip = lm[TIPS[finger]];
  const pip = lm[PIPS[finger]];
  const mcp = lm[MCPS[finger]];
  if (!tip || !pip || !mcp) return 0;

  if (finger === 'thumb') {
    const ang = angleAt(lm[4], lm[3], lm[2]);
    if (ang >= 130) return 1;     // juda yumshoq — tabiiy thumb
    return 0;
  }
  const ang = angleAt(tip, pip, mcp);
  if (ang >= 135) return 1;       // juda yumshoq — tabiiy cho'zilish
  if (ang >= 90)  return 2;       // hook
  return 0;
}

// ── Uzluksiz cho'zilish darajasi (0..1) — yumshoq scoring uchun ──
function fingerExtension(lm, finger) {
  const tip = lm[TIPS[finger]];
  const pip = lm[PIPS[finger]];
  const mcp = lm[MCPS[finger]];
  if (!tip || !pip || !mcp) return 0;
  if (finger === 'thumb') {
    const ang = angleAt(lm[4], lm[3], lm[2]);
    return Math.max(0, Math.min(1, (ang - 130) / 45));
  }
  const ang = angleAt(tip, pip, mcp);
  return Math.max(0, Math.min(1, (ang - 140) / 35));
}

function isFingerExtended(extScore) {
  return extScore > 0.5;
}

function fingerBendAngle(lm, finger) {
  const tip = lm[TIPS[finger]];
  const pip = lm[PIPS[finger]];
  const mcp = lm[MCPS[finger]];
  if (!tip || !pip || !mcp) return 0;
  return 180 - angleAt(tip, pip, mcp);
}

// ── Kaft yo'nalishi (UP / DOWN / SIDE / FORWARD) ──
function handOrientation(lm) {
  if (!lm || !lm[0] || !lm[9]) return 'UP';
  const wrist = lm[0];
  const midMcp = lm[9];
  const vx = midMcp.x - wrist.x;
  const vy = midMcp.y - wrist.y;
  const vz = (midMcp.z || 0) - (wrist.z || 0);

  const ax = Math.abs(vx);
  const ay = Math.abs(vy);
  const az = Math.abs(vz);

  // Z dominant — kaft kameraga to'g'ri yoki teskari qaratilgan (FORWARD)
  if (az > ax * 1.4 && az > ay * 1.4) return 'FORWARD';
  // Y dominant
  if (ay > ax) return vy < 0 ? 'UP' : 'DOWN';
  // X dominant
  return 'SIDE';
}

// ── Kaft normali — kaft qaysi tomonga qaragan ──
function palmNormal(lm) {
  const v1 = sub(lm[5], lm[0]);
  const v2 = sub(lm[17], lm[0]);
  return norm(cross(v1, v2));
}

// ── Kontaktlar va munosabatlar — disambiguation uchun ──
function computeContacts(lm, hsize) {
  // Masofalar (hand size ga normallashtirilgan)
  const d_thumb_index   = dist3D(lm[4],  lm[8])  / hsize;
  const d_thumb_middle  = dist3D(lm[4],  lm[12]) / hsize;  // YANGI — R uchun
  const d_thumb_ring    = dist3D(lm[4],  lm[16]) / hsize;  // YANGI — N uchun
  const d_thumb_pinky   = dist3D(lm[4],  lm[20]) / hsize;
  const d_index_middle  = dist3D(lm[8],  lm[12]) / hsize;
  const d_middle_ring   = dist3D(lm[12], lm[16]) / hsize;
  const d_ring_pinky    = dist3D(lm[16], lm[20]) / hsize;

  // Index/middle kesishganmi? MCP da x tartibi tip da x tartibidan farq qiladi
  const mcpOrder = lm[5].x < lm[9].x;
  const tipOrder = lm[8].x < lm[12].x;
  const indexMiddleCrossed = mcpOrder !== tipOrder && d_index_middle < 0.5;

  // Barmoqlar kerilganmi? — o'rtacha qo'shni masofa
  const avgSpread = (d_index_middle + d_middle_ring + d_ring_pinky) / 3;

  // Bosh barmoq panjarada ichidami? (S harfi) yoki yon tomondami? (A harfi)
  // Thumb tip x koordinatasi index MCP va pinky MCP orasidami?
  const thumbX = lm[4].x;
  const idxMcpX = lm[5].x;
  const pinkyMcpX = lm[17].x;
  const minX = Math.min(idxMcpX, pinkyMcpX);
  const maxX = Math.max(idxMcpX, pinkyMcpX);
  const thumbInside = thumbX > minX - 0.02 && thumbX < maxX + 0.02;

  // Bosh barmoq tip y koordinatasi: yon tomonda (A) yoki ustida (S)?
  // A: thumb.y ≈ index MCP y (yonida)
  // S: thumb.y < index MCP y (musht ustida)
  // Yumshoq threshold: thumb biroz tepada bo'lsa ham S
  const thumbAboveMcp = lm[4].y < lm[5].y + 0.01;

  return {
    thumb_index_dist:  d_thumb_index,
    thumb_middle_dist: d_thumb_middle,
    thumb_ring_dist:   d_thumb_ring,
    thumb_pinky_dist:  d_thumb_pinky,
    index_middle_dist: d_index_middle,

    thumb_index_touch:  d_thumb_index  < 0.35,
    thumb_middle_touch: d_thumb_middle < 0.35,    // YANGI — R harfi
    thumb_ring_touch:   d_thumb_ring   < 0.35,    // YANGI — N harfi
    thumb_pinky_touch:  d_thumb_pinky  < 0.35,
    index_middle_close: d_index_middle < 0.30,
    index_middle_spread: d_index_middle >= 0.30,
    index_middle_crossed: indexMiddleCrossed,

    fingers_spread:    avgSpread > 0.40,   // L harfi (0.45 → 0.40)
    fingers_close:     avgSpread < 0.30,

    thumb_inside_fist: thumbInside,
    thumb_outside_fist: !thumbInside,
    thumb_above_index_mcp: thumbAboveMcp,
  };
}

// ── ASOSIY FUNKSIYA: barcha xususiyatlar ──
export function extractHandFeatures(lm, calibratedHandSize = null) {
  if (!lm || lm.length < 21) return null;

  const hsize = calibratedHandSize || handSize(lm);

  // Holatlar
  const fingerState = {};        // {finger: 0|1|2}
  const extension   = {};         // {finger: 0..1 uzluksiz}
  const extended    = {};         // {finger: bool}
  const bend        = {};
  FINGERS.forEach(f => {
    fingerState[f] = fingerExtState(lm, f);
    extension[f]   = fingerExtension(lm, f);
    extended[f]    = isFingerExtended(extension[f]);
    bend[f]        = fingerBendAngle(lm, f);
  });

  // Imzo (signature) — [T, I, M, R, P]
  const signature = [
    fingerState.thumb,
    fingerState.index,
    fingerState.middle,
    fingerState.ring,
    fingerState.pinky,
  ];

  const tipDist = {
    thumb_index:  dist3D(lm[4],  lm[8])  / hsize,
    thumb_middle: dist3D(lm[4],  lm[12]) / hsize,
    thumb_ring:   dist3D(lm[4],  lm[16]) / hsize,
    thumb_pinky:  dist3D(lm[4],  lm[20]) / hsize,
    index_middle: dist3D(lm[8],  lm[12]) / hsize,
    middle_ring:  dist3D(lm[12], lm[16]) / hsize,
    ring_pinky:   dist3D(lm[16], lm[20]) / hsize,
  };

  const thumbIndexAngle = angleAt(lm[4], lm[2], lm[8]);
  const orientation = handOrientation(lm);
  const contacts = computeContacts(lm, hsize);

  const palmCenter = {
    x: (lm[5].x + lm[9].x + lm[13].x + lm[17].x + lm[0].x) / 5,
    y: (lm[5].y + lm[9].y + lm[13].y + lm[17].y + lm[0].y) / 5,
    z: (lm[5].z + lm[9].z + lm[13].z + lm[17].z + lm[0].z) / 5,
  };

  return {
    // YANGI: signature va kontekst
    signature,        // [T, I, M, R, P] — 3-states (0|1|2)
    fingerState,      // {thumb: 0|1, index: 0|1|2, ...}
    orientation,      // 'UP' | 'DOWN' | 'SIDE' | 'FORWARD'
    contacts,         // disambiguation belgilari

    // Eskilari (mosligi uchun)
    extension,        // uzluksiz 0..1
    extended,         // boolean
    bend,
    tipDist,
    thumbIndexAngle,
    palmNormal: palmNormal(lm),
    palmCenter,
    wrist: lm[0],
    indexTip: lm[8],
    thumbTip: lm[4],
    pinkyTip: lm[20],
    handSize: hsize,
    extCount: Object.values(extended).filter(Boolean).length,
    rawLandmarks: lm,
  };
}
