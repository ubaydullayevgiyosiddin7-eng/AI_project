// Vaqt bo'yicha smoothing — flikering oldini olish

import { majority } from './mathUtils';

export class TemporalBuffer {
  constructor(size = 15) {
    this.size = size;
    this.entries = []; // [{ value, confidence, t }]
  }

  push(value, confidence = 1) {
    this.entries.push({ value, confidence, t: Date.now() });
    if (this.entries.length > this.size) this.entries.shift();
  }

  clear() { this.entries = []; }

  // Tasdiqlangan natija — ko'pchilik ovoz va minimal ishonch
  consensus(minRatio = 0.6, minConfidence = 0.7) {
    if (this.entries.length < Math.floor(this.size / 2)) return null;

    const values = this.entries.map(e => e.value);
    const m = majority(values);
    if (!m || m.ratio < minRatio) return null;

    // Shu qiymatga tegishli o'rtacha ishonch
    const matching = this.entries.filter(e => e.value === m.value);
    const avgConf = matching.reduce((s, e) => s + e.confidence, 0) / matching.length;

    if (avgConf < minConfidence) return null;
    return { value: m.value, confidence: avgConf, ratio: m.ratio };
  }
}

// Stabil tutib turish detektori — bir imora N millisekund barqaror ushlanyaptimi?
export class StabilityTracker {
  constructor(holdMs = 800) {
    this.holdMs = holdMs;
    this.current = null;
    this.startTime = null;
  }

  update(value, confidence) {
    const now = Date.now();
    if (value !== this.current) {
      this.current = value;
      this.startTime = now;
      return { stable: false, progress: 0 };
    }
    const elapsed = now - this.startTime;
    const progress = Math.min(1, elapsed / this.holdMs);
    return {
      stable: elapsed >= this.holdMs,
      progress,
      value,
      confidence,
    };
  }

  reset() {
    this.current = null;
    this.startTime = null;
  }
}

// Cooldown — bir xil natijani ketma-ket qaytarmaslik
export class Cooldown {
  constructor(ms = 1500) {
    this.ms = ms;
    this.lastValue = null;
    this.lastTime = 0;
  }

  canFire(value) {
    const now = Date.now();
    if (value === this.lastValue && now - this.lastTime < this.ms) return false;
    return true;
  }

  fire(value) {
    this.lastValue = value;
    this.lastTime = Date.now();
  }

  clear() {
    this.lastValue = null;
    this.lastTime = 0;
  }
}
