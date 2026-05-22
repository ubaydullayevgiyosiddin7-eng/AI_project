// MediaPipe Holistic — yuz + 2 qo'l + tana, brauzerda CDN orqali
//
// MUHIM: hook faqat `enabled === true` bo'lganda kamerani ochadi.
// Diagnostika xabarlari `loadingStep` orqali UI ga qaytariladi.

import { useEffect, useRef, useState, useCallback } from 'react';
import { createLogger } from '../utils/logger';

const log = createLogger('HOLISTIC');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Umumiy timeout (sekund)
const STEP_TIMEOUT = {
  video_ref:    5,
  camera:       10,
  video_play:   5,
  mediapipe:    20,  // CDN dan ~10MB yuklanadi
  holistic:     5,
  total:        45,  // butun init uchun max
};

function timeout(promise, sec, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`${label} — ${sec} sek o'tdi`)), sec * 1000)),
  ]);
}

function loadMediaPipe(onProgress) {
  return new Promise((resolve, reject) => {
    if (window.__mp_holistic_loaded && typeof window.Holistic === 'function') {
      resolve();
      return;
    }
    const loadScript = src => new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) { res(); return; }
      const s = document.createElement('script');
      s.src = src; s.async = false; s.crossOrigin = 'anonymous';
      s.onload = () => res();
      s.onerror = () => rej(new Error('Yuklanmadi: ' + src));
      document.head.appendChild(s);
    });
    const B = 'https://cdn.jsdelivr.net/npm/@mediapipe';
    onProgress?.('holistic.js yuklanmoqda...');
    loadScript(`${B}/holistic@0.5.1675471629/holistic.js`)
      .then(() => {
        onProgress?.('camera_utils.js yuklanmoqda...');
        return loadScript(`${B}/camera_utils@0.3.1675466862/camera_utils.js`);
      })
      .then(() => { window.__mp_holistic_loaded = true; resolve(); })
      .catch(reject);
  });
}

export default function useHolistic(videoRef, enabled = true) {
  const holisticRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(true);
  const fpsRef = useRef({ n: 0, last: Date.now(), val: 0 });

  const [state, setState] = useState({
    results: null,
    isTracking: false,
    fps: 0,
    error: null,
    status: 'idle',          // idle | loading | active | error
    loadingStep: '',          // foydalanuvchi ko'radigan tafsilot
    handsCount: 0,
    hasFace: false,
  });

  const onResults = useCallback((results) => {
    if (!mountedRef.current) return;
    fpsRef.current.n++;
    const now = Date.now();
    if (now - fpsRef.current.last >= 1000) {
      fpsRef.current.val = fpsRef.current.n;
      fpsRef.current.n = 0;
      fpsRef.current.last = now;
    }
    const handsCount =
      (results.leftHandLandmarks ? 1 : 0) + (results.rightHandLandmarks ? 1 : 0);
    const hasFace = !!results.faceLandmarks;
    const isTracking = handsCount > 0 || hasFace;

    setState(s => ({
      ...s,
      results,
      isTracking,
      fps: fpsRef.current.val,
      error: null,
      status: 'active',
      loadingStep: '',
      handsCount,
      hasFace,
    }));
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState(s => ({ ...s, status: 'idle', isTracking: false, results: null, loadingStep: '' }));
      return;
    }

    mountedRef.current = true;
    let cancelled = false;
    const setStep = (step) => {
      if (cancelled) return;
      log.info('Step:', step);
      setState(s => ({ ...s, status: 'loading', loadingStep: step, error: null }));
    };
    const setErr = (msg) => {
      if (cancelled) return;
      log.error(msg);
      setState(s => ({ ...s, status: 'error', error: msg, loadingStep: '' }));
    };

    setStep('Video element kutilmoqda...');

    async function init() {
      // 1) Video element
      let attempts = 0;
      while (!videoRef?.current && attempts < STEP_TIMEOUT.video_ref * 10) {
        await sleep(100);
        attempts++;
        if (cancelled) return;
      }
      if (!videoRef?.current) {
        setErr('Video element 5 sek ichida ulanmadi');
        return;
      }

      // 2) Kamera ruxsati va stream
      setStep('Kamera ochilmoqda...');
      let stream;
      try {
        stream = await timeout(
          navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user', frameRate: { ideal: 30 } },
            audio: false,
          }),
          STEP_TIMEOUT.camera,
          'Kamera ochilmadi'
        );
        streamRef.current = stream;
      } catch (e) {
        if (cancelled) { stream?.getTracks().forEach(t => t.stop()); return; }
        const msg = e.name === 'NotAllowedError'
          ? 'Kameraga ruxsat berilmadi (brauzerda Allow bosing)'
          : e.name === 'NotFoundError'
            ? 'Kamera topilmadi'
            : e.message;
        setErr(msg);
        return;
      }
      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

      // 3) Video play
      setStep('Video oqim ulanmoqda...');
      const video = videoRef.current;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      try {
        await timeout(video.play(), STEP_TIMEOUT.video_play, 'Video play');
      } catch (e) {
        log.warn(e.message);
      }
      try {
        await timeout(new Promise(r => {
          if (video.readyState >= 2) { r(); return; }
          video.addEventListener('loadeddata', r, { once: true });
        }), STEP_TIMEOUT.video_play, 'Video tayyor emas');
      } catch (e) { log.warn(e.message); }
      if (cancelled) return;

      // 4) MediaPipe yuklash (eng sekin qadam — CDN dan ~10MB)
      setStep('AI modeli yuklanmoqda (1-tomondan)...');
      try {
        await timeout(loadMediaPipe(msg => setStep('AI modeli: ' + msg)), STEP_TIMEOUT.mediapipe, 'MediaPipe yuklash');
      } catch (e) {
        setErr('AI modeli yuklanmadi: ' + e.message + '. Internet aloqasini tekshiring.');
        return;
      }
      if (cancelled) return;

      // 5) Holistic instance
      setStep('AI tayyorlanmoqda...');
      try {
        if (typeof window.Holistic !== 'function') {
          throw new Error('Holistic class topilmadi');
        }
        const holistic = new window.Holistic({
          locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${f}`,
        });
        holistic.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          refineFaceLandmarks: false,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        holistic.onResults(onResults);
        holisticRef.current = holistic;
      } catch (e) {
        setErr('AI sozlash xatosi: ' + e.message);
        return;
      }
      if (cancelled) return;

      // 6) Render loop
      setStep('Tekshiruv boshlandi...');
      const loop = async () => {
        if (cancelled) return;
        try {
          const v = videoRef.current;
          if (v?.readyState >= 2 && v.videoWidth > 0) {
            await holisticRef.current.send({ image: v });
          }
        } catch (e) { log.warn(e.message); }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    // Total timeout
    const totalTimer = setTimeout(() => {
      if (cancelled) return;
      if (mountedRef.current) {
        setErr('Yuklash juda uzoq cho\'zildi. Sahifani qayta yuklang (F5)');
      }
    }, STEP_TIMEOUT.total * 1000);

    init().catch(e => {
      if (!cancelled) setErr(e.message);
    });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      clearTimeout(totalTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { holisticRef.current?.close?.(); } catch {}
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      holisticRef.current = null;
    };
  }, [enabled, onResults, videoRef]);

  return state;
}
