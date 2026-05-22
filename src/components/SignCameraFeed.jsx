// Katta kamera oynasi + qo'l/yuz skeleton overlay
import { useEffect, useRef } from 'react';
import theme from '../theme';

const HAND_CONN = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];

// Yuz to'rining ahamiyatli chiziqlari — qoshlar va og'iz
const FACE_EYEBROW_LEFT  = [70, 63, 105, 66, 107];
const FACE_EYEBROW_RIGHT = [336, 296, 334, 293, 300];
const FACE_LIP_OUTER     = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 61];

const TIPS = new Set([4, 8, 12, 16, 20]);

export default function SignCameraFeed({
  videoRef,
  results,
  detection,
  isTracking,
  fps,
  status,
  error,
  size = 'large', // 'large' | 'small'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!results) return;

    // Mirror: kamera ko'rinishi flipped, biz x ni teskari ko'rsatamiz
    const mx = x => (1 - x) * W;
    const my = y => y * H;

    const mistakes = detection?.mistakes || [];
    const wrongFingers = new Set(mistakes.map(m => m.finger));

    // ── 1. Qo'l skeletonlari ─────────────────────────────────────
    const drawHand = (lm, color, dimColor) => {
      if (!lm) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = size === 'large' ? 2.2 : 1.2;
      HAND_CONN.forEach(([a, b]) => {
        if (!lm[a] || !lm[b]) return;
        ctx.beginPath();
        ctx.moveTo(mx(lm[a].x), my(lm[a].y));
        ctx.lineTo(mx(lm[b].x), my(lm[b].y));
        ctx.stroke();
      });

      lm.forEach((pt, i) => {
        if (!pt) return;
        const isTip = TIPS.has(i);
        ctx.beginPath();
        ctx.arc(mx(pt.x), my(pt.y), isTip ? 4.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? '#ffd700' : color;
        ctx.fill();
      });
    };

    drawHand(results.rightHandLandmarks, theme.primaryLight, theme.primary);
    drawHand(results.leftHandLandmarks,  theme.accent, theme.primary);

    // ── 2. Yuz: TO'LIQ MESH + qoshlar va og'iz ─────────────────
    if (results.faceLandmarks) {
      const flm = results.faceLandmarks;
      const grammar = detection?.grammar || 'statement';
      const grammarColor =
        grammar === 'question' ? theme.warning :
        grammar === 'negation' ? theme.danger :
        theme.primaryLight;

      // 2a. TO'LIQ FACE MESH — 468 nuqta, kichik nuqtalar bilan
      const dotR = size === 'large' ? 0.8 : 0.5;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.45)';  // primaryLight transparent
      for (let i = 0; i < flm.length; i++) {
        const p = flm[i];
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(mx(p.x), my(p.y), dotR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2b. Qoshlar — qalin chiziq bilan ajratamiz
      ctx.strokeStyle = grammarColor;
      ctx.lineWidth = size === 'large' ? 2.5 : 1.5;

      const drawPath = (indices) => {
        ctx.beginPath();
        indices.forEach((idx, i) => {
          const p = flm[idx];
          if (!p) return;
          if (i === 0) ctx.moveTo(mx(p.x), my(p.y));
          else ctx.lineTo(mx(p.x), my(p.y));
        });
        ctx.stroke();
      };

      drawPath(FACE_EYEBROW_LEFT);
      drawPath(FACE_EYEBROW_RIGHT);

      // 2c. Og'iz — alohida rang
      ctx.strokeStyle = theme.info;
      ctx.lineWidth = size === 'large' ? 1.8 : 1.0;
      drawPath(FACE_LIP_OUTER);
    }

    // ── 3. Xato barmoqlar — qizil ramz ───────────────────────────
    if (results.rightHandLandmarks && wrongFingers.size > 0) {
      const lm = results.rightHandLandmarks;
      const fingerTipIdx = { thumb: 4, index: 8, middle: 12, ring: 16, pinky: 20 };
      wrongFingers.forEach(f => {
        const idx = fingerTipIdx[f];
        if (!lm[idx]) return;
        ctx.beginPath();
        ctx.arc(mx(lm[idx].x), my(lm[idx].y), 12, 0, Math.PI * 2);
        ctx.strokeStyle = theme.danger;
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    }
  }, [results, detection, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const isLarge = size === 'large';
  const W = isLarge ? '100%' : 260;
  const H = isLarge ? '100%' : 200;

  return (
    <div style={{
      position: 'relative',
      width: W, height: H,
      borderRadius: isLarge ? theme.radius : theme.radius,
      overflow: 'hidden',
      background: '#1a1f2e',
      border: `1px solid ${error ? theme.danger : theme.border}`,
    }}>
      <video
        ref={videoRef}
        autoPlay muted playsInline
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: 'scaleX(-1)',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Status bar — yuqorida o'ng burchakda */}
      <div style={{
        position: 'absolute', top: 8, right: 8,
        background: 'rgba(255,255,255,0.95)',
        padding: '4px 10px',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 10, fontWeight: 600,
        borderRadius: theme.radiusSm,
        boxShadow: theme.shadow,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: status === 'active' ? theme.accent : status === 'error' ? theme.danger : theme.warning,
        }} />
        <span style={{ color: theme.text }}>{status === 'active' ? 'ULANGAN' : status === 'error' ? 'XATO' : 'YUKLANYAPTI'}</span>
        {fps > 0 && <span style={{ color: theme.textMuted }}>· {fps} FPS</span>}
      </div>

      {error && (
        <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          background: theme.danger,
          color: '#fff',
          padding: '6px 10px',
          fontSize: 11, fontWeight: 500,
          borderRadius: theme.radiusSm,
        }}>{error}</div>
      )}
    </div>
  );
}
