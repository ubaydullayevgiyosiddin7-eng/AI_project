// MediaPipe Holistic chiqishidan to'liq xususiyatlar
//
// MUHIM: dominantHand sozlamasi faqat AFZALLIK belgilaydi.
// Agar tanlangan qo'l ko'rinmasa, boshqa qo'lni ishlatamiz.
// Agar IKKALA qo'l ham ko'rinsa, har ikkalasi xususiyatlari berildi
// (matcher ikkalasini sinab, eng yaxshi ballni oladi).

import { extractHandFeatures } from './handFeatures';
import { extractFaceFeatures } from './faceFeatures';
import { dist3D } from './mathUtils';

export function extractFullFeatures(holisticResults, calibration = {}) {
  const right = holisticResults?.rightHandLandmarks
    ? extractHandFeatures(holisticResults.rightHandLandmarks, calibration.handSize)
    : null;

  const left = holisticResults?.leftHandLandmarks
    ? extractHandFeatures(holisticResults.leftHandLandmarks, calibration.handSize)
    : null;

  const face = holisticResults?.faceLandmarks
    ? extractFaceFeatures(holisticResults.faceLandmarks)
    : null;

  // Afzallik (UI sozlamasi) — lekin qo'l ko'rinmasa, boshqasini olamiz
  const preferred = calibration.dominantHand || 'right';
  const preferredHand = preferred === 'right' ? right : left;
  const otherHand    = preferred === 'right' ? left  : right;

  // Dominant = afzallik, lekin yo'q bo'lsa fallback
  const dominant  = preferredHand || otherHand;
  // Secondary = ikkala ham ko'rinsa, boshqasi
  const secondary = (right && left) ? otherHand : null;

  // Hand-to-face — har qo'l uchun alohida
  const handToFace          = computeHandToFace(dominant, face);
  const secondaryHandToFace = computeHandToFace(secondary, face);

  return {
    dominant,
    secondary,
    face,
    handToFace,
    secondaryHandToFace,
    rightHand: right,
    leftHand: left,
    handsCount: (right ? 1 : 0) + (left ? 1 : 0),
    hasFace: !!face,
    timestamp: Date.now(),
  };
}

function computeHandToFace(hand, face) {
  if (!hand || !face) return null;
  const d = dist3D(hand.palmCenter, face.nosePos);
  return {
    distance: d / (face.faceSize || 1),
    handX: hand.palmCenter.x - face.nosePos.x,
    handY: hand.palmCenter.y - face.nosePos.y,
    region: classifyHandRegion(hand.palmCenter, face),
  };
}

function classifyHandRegion(palmCenter, face) {
  if (!face) return 'unknown';
  const dx = palmCenter.x - face.nosePos.x;
  const dy = palmCenter.y - face.nosePos.y;
  const fs = face.faceSize || 0.2;

  if (Math.abs(dy) < fs * 0.5 && Math.abs(dx) < fs * 0.7) return 'face';
  if (dy < -fs * 0.5) return 'forehead';
  if (dy > fs * 1.2) return 'chest';
  if (dy > fs * 0.5) return 'chin';
  if (dx > fs * 0.7) return 'right';
  if (dx < -fs * 0.7) return 'left';
  return 'neutral';
}
