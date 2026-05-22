// Foydalanuvchi kalibratsiyasi — qo'l hajmi, dominant qo'l, neytral pozitsiya
import { handSize } from './handFeatures';

const STORAGE_KEY = 'signhand_calibration';

const DEFAULT = {
  handSize: null,         // bilek → o'rta MCP masofa
  dominantHand: 'right',
  faceSize: null,
  neutralFingerBend: null,
  calibrated: false,
  calibratedAt: null,
};

export function loadCalibration() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveCalibration(cal) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...cal,
      calibrated: true,
      calibratedAt: Date.now(),
    }));
  } catch {}
}

export function clearCalibration() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// O'rtacha qo'l hajmi (median) — outliers ta'sirini kamaytiradi
const DEFAULT_HAND_SIZE = 0.18; // taxminiy o'rtacha qiymat

export class CalibrationCollector {
  constructor(frameCount = 15) {
    this.frameCount = frameCount;
    this.samples = [];
  }

  push(holisticResults) {
    const lm = holisticResults?.rightHandLandmarks || holisticResults?.leftHandLandmarks;
    if (!lm) return false;
    const s = handSize(lm);
    if (s > 0.01) {
      this.samples.push(s);
    }
    return this.samples.length >= this.frameCount;
  }

  result() {
    if (!this.samples.length) return null;
    const sorted = [...this.samples].sort((a, b) => a - b);
    // Median — outliers ta'sirini kamaytirish
    return sorted[Math.floor(sorted.length / 2)];
  }

  reset() { this.samples = []; }
  progress() { return Math.min(1, this.samples.length / this.frameCount); }

  // Manual skip uchun: defaultni qaytaradi
  static getDefault() { return DEFAULT_HAND_SIZE; }
}
