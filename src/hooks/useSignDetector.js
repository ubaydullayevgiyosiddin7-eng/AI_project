// Holistic natija → tasdiqlangan imora
// - feature extraction
// - statik (qoida) va harakatli (trajektoriya) detektorlar
// - temporal smoothing
// - stabillik tracker
// - dynamic trajektoriya buferi

import { useEffect, useRef, useState } from 'react';
import { extractFullFeatures } from '../core/featureExtractor';
import { matchStaticLetter, scoreSpecificLetter } from '../core/staticMatcher';
import { matchDynamicSign } from '../core/dynamicMatcher';
import { TemporalBuffer, StabilityTracker, Cooldown } from '../core/temporalBuffer';
import { TrajectoryBuffer } from '../core/dynamicMatcher';
import { detectGrammar } from '../core/faceFeatures';
import { ALPHABET } from '../data/alphabet';
import { loadCalibration } from '../core/calibration';

export default function useSignDetector(holisticResults, opts = {}) {
  const {
    mode = 'translator', // 'translator' | 'lesson' | 'practice'
    targetSign = null,    // lesson mode: belgilangan harf
    threshold = 0.62,
    holdMs = 700,
    cooldownMs = 1400,
  } = opts;

  const calibrationRef = useRef(loadCalibration());
  const tempBufRef = useRef(new TemporalBuffer(15));
  // Har QO'L uchun alohida trajektoriya
  const dominantTrajRef = useRef(new TrajectoryBuffer(45));
  const secondaryTrajRef = useRef(new TrajectoryBuffer(45));
  const stabilityRef = useRef(new StabilityTracker(holdMs));
  const cooldownRef = useRef(new Cooldown(cooldownMs));

  const [detection, setDetection] = useState({
    features: null,
    grammar: 'statement',
    candidate: null,      // { letter, label, confidence } — eng yaqin imora
    confirmed: null,      // { letter, label, confidence, t } — tasdiqlangan
    stable: { progress: 0, value: null },
    targetScore: null,    // lesson mode uchun: belgilangan harf bali
    mistakes: [],
  });

  // Calibration o'zgartirish
  useEffect(() => {
    const onStorage = () => { calibrationRef.current = loadCalibration(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!holisticResults) return;

    const features = extractFullFeatures(holisticResults, calibrationRef.current);
    if (!features?.dominant && !features?.secondary) {
      tempBufRef.current.clear();
      dominantTrajRef.current.clear();
      secondaryTrajRef.current.clear();
      stabilityRef.current.reset();
      setDetection(d => ({ ...d, features, candidate: null, stable: { progress: 0, value: null } }));
      return;
    }

    const grammar = detectGrammar(features.face);

    // ── Trajektoriya buferlari (harakatli imoralar uchun) — har QO'L alohida
    if (features.dominant?.indexTip) {
      const tip = features.dominant.indexTip;
      const holdPose = { ...features.dominant.extended };
      dominantTrajRef.current.push({ x: tip.x, y: tip.y }, holdPose);
    }
    if (features.secondary?.indexTip) {
      const tip = features.secondary.indexTip;
      const holdPose = { ...features.secondary.extended };
      secondaryTrajRef.current.push({ x: tip.x, y: tip.y }, holdPose);
    }

    // ── Statik harf — decision tree + soft scoring
    const staticResult = matchStaticLetter(features, 0.5);

    // ── Harakatli imora — har 2 qo'lda sinab, yaxshisini olamiz
    let dynamicResult = null;
    if (mode !== 'lesson_static_only') {
      const dDom = matchDynamicSign(dominantTrajRef.current, ALPHABET, 0.55);
      const dSec = features.secondary ? matchDynamicSign(secondaryTrajRef.current, ALPHABET, 0.55) : null;
      if (dDom && dSec) dynamicResult = (dSec.confidence > dDom.confidence) ? dSec : dDom;
      else dynamicResult = dDom || dSec;
    }

    // ── Eng yaxshi nomzodni tanlaymiz
    let candidate = null;
    if (dynamicResult && dynamicResult.confidence >= 0.7) {
      candidate = { type: 'dynamic', ...dynamicResult };
    } else if (staticResult?.letter) {
      candidate = { type: 'static', ...staticResult };
    }

    // ── Temporal smoothing
    if (candidate) {
      tempBufRef.current.push(candidate.letter || candidate.id, candidate.confidence);
    } else {
      tempBufRef.current.push(null, 0);
    }

    const consensus = tempBufRef.current.consensus(0.55, threshold);

    // ── Stabillik (hold-to-confirm)
    let stable = { progress: 0, value: null };
    let confirmed = null;

    if (consensus?.value) {
      const stab = stabilityRef.current.update(consensus.value, consensus.confidence);
      stable = stab;
      if (stab.stable && cooldownRef.current.canFire(stab.value)) {
        confirmed = {
          value: stab.value,
          confidence: stab.confidence,
          t: Date.now(),
          grammar,
        };
        cooldownRef.current.fire(stab.value);
        stabilityRef.current.reset();
        // Harakatli imora tasdiqlangach ikkala buferni ham tozalaymiz
        if (candidate?.type === 'dynamic') {
          dominantTrajRef.current.clear();
          secondaryTrajRef.current.clear();
        }
      }
    } else {
      stabilityRef.current.reset();
    }

    // ── Lesson rejimi: belgilangan harf uchun ball
    let targetScore = null;
    let mistakes = [];
    if (mode === 'lesson' && targetSign) {
      const r = scoreSpecificLetter(targetSign, features);
      targetScore = r.confidence;
      mistakes = r.mistakes;
    }

    setDetection({
      features,
      grammar,
      candidate,
      confirmed,
      stable,
      targetScore,
      mistakes,
    });
  }, [holisticResults, mode, targetSign, threshold]);

  return detection;
}

// Mode'larni tezda almashtirish
export const DETECTOR_MODES = {
  TRANSLATOR: 'translator',
  LESSON: 'lesson',
  PRACTICE: 'practice',
};
