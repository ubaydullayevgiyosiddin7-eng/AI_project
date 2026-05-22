// Birinchi kirishda kalibratsiya
// MUHIM: holistic faqat step >= 1 da yoqiladi — Welcome ekranida kamerani band qilmaymiz.

import { useRef, useState, useEffect } from 'react';
import useHolistic from '../hooks/useHolistic';
import SignCameraFeed from '../components/SignCameraFeed';
import { CalibrationCollector, saveCalibration, loadCalibration } from '../core/calibration';
import theme from '../theme';

const CALIBRATION_FRAMES = 10;
const MANUAL_SKIP_DELAY_MS = 1500;
const AUTO_SKIP_DELAY_MS  = 8000;

export default function OnboardingPage({ onDone, onSkip }) {
  const videoRef = useRef(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [handSize, setHandSize] = useState(null);
  const [dominantHand, setDominantHand] = useState('right');
  const collectorRef = useRef(new CalibrationCollector(CALIBRATION_FRAMES));
  const [calibStart, setCalibStart] = useState(null);
  const [, setTick] = useState(0);  // force re-render har 200ms

  // Kamera 1 va 2-bosqichlarda kerak (Welcome va Hand Preference da kerak emas)
  const cameraNeeded = step === 1 || step === 2;
  const holistic = useHolistic(videoRef, cameraNeeded);

  // Step 2: kalibratsiya — yangi natija kelganda freym qo'shish
  useEffect(() => {
    if (step !== 2) return;
    if (calibStart == null) setCalibStart(Date.now());
    if (!holistic.results) return;

    const done = collectorRef.current.push(holistic.results);
    setProgress(collectorRef.current.progress());
    if (done) {
      const size = collectorRef.current.result();
      setHandSize(size);
      setStep(3);
    }
  }, [holistic.results, step, calibStart]);

  // Force-tick: holistic yangilanmasa ham UI ni jonli ushlab turamiz
  useEffect(() => {
    if (step !== 2) return;
    const id = setInterval(() => setTick(t => t + 1), 200);
    return () => clearInterval(id);
  }, [step]);

  // Auto-skip: 8 sekund o'tib hech narsa to'planmagan bo'lsa, default bilan o'tamiz
  useEffect(() => {
    if (step !== 2) return;
    if (!calibStart) return;
    const id = setTimeout(() => {
      if (collectorRef.current.progress() < 0.5) {
        setHandSize(CalibrationCollector.getDefault());
        setStep(3);
      }
    }, AUTO_SKIP_DELAY_MS);
    return () => clearTimeout(id);
  }, [step, calibStart]);

  const finish = () => {
    saveCalibration({
      ...loadCalibration(),
      handSize: handSize,
      dominantHand,
    });
    onDone?.();
  };

  const skipCalibration = () => {
    setHandSize(CalibrationCollector.getDefault());
    setStep(3);
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <Stepper step={step} max={4} />

        {step === 0 && (
          <Welcome onNext={() => setStep(1)} onSkip={onSkip} />
        )}
        {step === 1 && (
          <CameraTest
            holistic={holistic}
            videoRef={videoRef}
            onNext={() => { collectorRef.current.reset(); setStep(2); }}
          />
        )}
        {step === 2 && (
          <CalibrationStep
            videoRef={videoRef}
            holistic={holistic}
            progress={progress}
            elapsed={calibStart ? Date.now() - calibStart : 0}
            onSkip={skipCalibration}
          />
        )}
        {step === 3 && (
          <HandPreference
            value={dominantHand}
            onChange={setDominantHand}
            onNext={finish}
          />
        )}
      </div>
    </div>
  );
}

function Stepper({ step, max }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 1.5,
          background: i <= step ? theme.primary : theme.border,
          transition: 'background 0.25s',
        }} />
      ))}
    </div>
  );
}

function Welcome({ onNext, onSkip }) {
  return (
    <>
      <h2 style={titleStyle}>Salom!</h2>
      <p style={textStyle}>
        SignHand — O'zbek imo-ishora tilini o'rgatuvchi platforma. Boshlash uchun bir necha kichik sozlash kerak.
      </p>
      <ul style={{ marginTop: 14, marginBottom: 22, paddingLeft: 18, color: theme.textMuted, fontSize: 13, lineHeight: 1.7 }}>
        <li>Kameraga ruxsat berasiz</li>
        <li>Qo'l hajmingizni o'lchaymiz</li>
        <li>Sevimli qo'lingizni tanlaysiz</li>
      </ul>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onNext} style={primaryBtn}>Boshlash</button>
        {onSkip && <button onClick={onSkip} style={ghostBtn}>O'tkazib yuborish</button>}
      </div>
    </>
  );
}

function CameraTest({ holistic, videoRef, onNext }) {
  const ready = holistic.status === 'active' && holistic.isTracking;
  return (
    <>
      <h2 style={titleStyle}>Kamera tekshiruvi</h2>
      <p style={textStyle}>Yuzingiz va qo'lingiz kadrda ko'rinib turishini tekshiring.</p>

      <div style={{ marginTop: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}>
        <SignCameraFeed
          videoRef={videoRef}
          results={holistic.results}
          isTracking={holistic.isTracking}
          status={holistic.status}
          error={holistic.error}
          fps={holistic.fps}
          size="small"
        />
      </div>

      {holistic.status === 'loading' && (
        <div style={infoBox}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Yuklanmoqda...</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>
            {holistic.loadingStep || 'Boshlanmoqda...'}
          </div>
        </div>
      )}
      {holistic.status === 'error' && (
        <div style={errBox}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Xatolik:</div>
          <div style={{ fontSize: 13 }}>{holistic.error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: '6px 12px',
              background: theme.surface, border: `1px solid ${theme.danger}`,
              color: theme.danger, borderRadius: 6, fontSize: 12, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >Sahifani qayta yuklash</button>
        </div>
      )}
      {holistic.status === 'active' && !holistic.isTracking && (
        <div style={infoBox}>Kamerada yuzingiz va qo'lingiz ko'rinmayapti. Yorug'lik yetarlimi?</div>
      )}
      {ready && (
        <div style={okBox}>
          Topildi: {holistic.handsCount > 0 ? `qo'l (×${holistic.handsCount})` : ''}
          {holistic.handsCount > 0 && holistic.hasFace ? ' + ' : ''}
          {holistic.hasFace ? 'yuz' : ''}
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <button
          onClick={onNext}
          disabled={!ready}
          style={ready ? primaryBtn : disabledBtn}
        >
          {holistic.status === 'loading' ? 'Yuklanmoqda...' :
           ready ? 'Davom etish' :
           holistic.status === 'error' ? 'Qayta urinib ko\'ring' :
           'Kutilmoqda...'}
        </button>
      </div>
    </>
  );
}

function CalibrationStep({ videoRef, holistic, progress, elapsed, onSkip }) {
  const handVisible = !!(holistic.results?.rightHandLandmarks || holistic.results?.leftHandLandmarks);
  const faceVisible = !!holistic.results?.faceLandmarks;
  const canSkip = elapsed > MANUAL_SKIP_DELAY_MS;
  const autoSkipIn = Math.max(0, Math.ceil((AUTO_SKIP_DELAY_MS - elapsed) / 1000));

  return (
    <>
      <h2 style={titleStyle}>Qo'l hajmini o'lchaymiz</h2>
      <p style={textStyle}>
        Qo'lingizni kadrga olib keling. Topilmasa — pastdagi <strong style={{ color: '#a78bfa' }}>O'tkazib yuborish</strong> tugmasini bosing.
      </p>

      <div style={{ marginTop: 16, marginBottom: 12, borderRadius: 12, overflow: 'hidden', aspectRatio: '16/10' }}>
        <SignCameraFeed
          videoRef={videoRef}
          results={holistic.results}
          isTracking={holistic.isTracking}
          status={holistic.status}
          fps={holistic.fps}
          size="large"
        />
      </div>

      {/* Real-time detection indikatorlari */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <DetectChip label="Yuz" found={faceVisible} />
        <DetectChip label="Qo'l" found={handVisible} />
      </div>

      <div style={{ height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.round(progress * 100)}%`,
          background: 'linear-gradient(90deg, #a78bfa, #06b6d4)',
          transition: 'width 0.2s',
        }} />
      </div>
      <div style={{ fontSize: 11, color: 'rgba(200,200,255,0.5)', fontFamily: 'monospace', marginTop: 6, textAlign: 'center' }}>
        {Math.round(progress * 100)}% — {handVisible ? "qo'lingizni harakat qildirmang" : "qo'l topilmadi"}
      </div>

      {/* Yordam */}
      {!handVisible && elapsed > 1500 && (
        <div style={hintBox}>
          <strong>Qo'l topilmadi.</strong> Quyidagilarni tekshiring:
          <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 12, lineHeight: 1.6 }}>
            <li>Qo'l kameradan 30-60 sm uzoqlikda</li>
            <li>Yorug'lik yetarli (orqada yorug' deraza bo'lmasin)</li>
            <li>Kaft kameraga qaragan, barmoqlar ochiq</li>
          </ul>
          {autoSkipIn > 0 && autoSkipIn < 8 && (
            <div style={{ marginTop: 8, fontSize: 11, color: '#a78bfa', fontFamily: 'monospace' }}>
              {autoSkipIn} sek dan keyin avtomatik o'tiladi...
            </div>
          )}
        </div>
      )}

      {/* Manual skip — 1.5 sek dan keyin */}
      {canSkip && (
        <button onClick={onSkip} style={skipBtnStyle}>
          O'tkazib yuborish (taxminiy hajm bilan)
        </button>
      )}
    </>
  );
}

function DetectChip({ label, found }) {
  const color = found ? '#10b981' : 'rgba(200,200,255,0.4)';
  const bg = found ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)';
  return (
    <div style={{
      flex: 1,
      background: bg,
      border: `1px solid ${found ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 10,
      padding: '8px 12px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontFamily: 'monospace',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color,
        boxShadow: found ? `0 0 8px ${color}` : 'none',
      }} />
      <span style={{ color }}>{label}: {found ? 'bor' : "yo'q"}</span>
    </div>
  );
}

function HandPreference({ value, onChange, onNext }) {
  const options = [
    { id: 'right', label: "O'ng qo'l", icon: '→' },
    { id: 'left',  label: "Chap qo'l", icon: '←' },
  ];
  return (
    <>
      <h2 style={titleStyle}>Sevimli qo'lingiz</h2>
      <p style={textStyle}>
        Qaysi qo'lingiz bilan ko'proq imo-ishora qilasiz?
        <br />
        <span style={{ fontSize: 12, color: theme.textLight }}>
          (Eslatma: dastur <strong>ikkala qo'lingiz</strong> bilan ham ishlaydi. Bu faqat afzallik.)
        </span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, marginBottom: 18 }}>
        {options.map(o => (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            background: value === o.id ? `${theme.primary}10` : theme.surface,
            border: `2px solid ${value === o.id ? theme.primary : theme.border}`,
            borderRadius: theme.radius,
            padding: '16px 12px',
            fontSize: 14,
            color: theme.text,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s',
            fontWeight: 600,
          }}>
            <div style={{ fontSize: 24, marginBottom: 4, color: value === o.id ? theme.primary : theme.textMuted, fontWeight: 800 }}>{o.icon}</div>
            <div>{o.label}</div>
          </button>
        ))}
      </div>

      <button onClick={onNext} style={primaryBtn}>Yakunlash</button>
    </>
  );
}

const pageStyle = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bgAlt} 100%)`,
  padding: 20,
  fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
};

const cardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: '28px 28px',
  width: '100%',
  maxWidth: 560,
  boxShadow: theme.shadowLg,
};

const titleStyle = {
  fontSize: 20,
  fontWeight: 700,
  color: theme.primaryDark,
  marginBottom: 6,
  marginTop: 0,
};

const textStyle = {
  fontSize: 13,
  color: theme.textMuted,
  lineHeight: 1.6,
  margin: 0,
};

const primaryBtn = {
  flex: 1,
  background: theme.primary,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radius,
  padding: '11px',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  letterSpacing: '0.05em',
};

const disabledBtn = {
  ...primaryBtn,
  background: theme.borderStrong,
  color: theme.textLight,
  cursor: 'not-allowed',
};

const ghostBtn = {
  background: theme.surface,
  color: theme.textMuted,
  border: `1px solid ${theme.borderStrong}`,
  borderRadius: theme.radius,
  padding: '11px 18px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const infoBox = {
  padding: '10px 14px',
  background: '#fef3c7',
  border: `1px solid #fde68a`,
  borderRadius: theme.radius,
  color: theme.warning,
  fontSize: 12,
};

const errBox = {
  padding: '10px 14px',
  background: '#fef2f2',
  border: `1px solid #fecaca`,
  borderRadius: theme.radius,
  color: theme.danger,
  fontSize: 13,
};

const okBox = {
  padding: '10px 14px',
  background: '#f0fdf4',
  border: `1px solid #bbf7d0`,
  borderRadius: theme.radius,
  color: theme.accent,
  fontSize: 12,
  fontWeight: 600,
};

const hintBox = {
  marginTop: 12,
  padding: '12px 14px',
  background: '#fef3c7',
  border: `1px solid #fde68a`,
  borderRadius: theme.radius,
  color: '#92400e',
  fontSize: 13,
};

const skipBtnStyle = {
  marginTop: 12,
  width: '100%',
  background: theme.surface,
  border: `1px solid ${theme.primary}`,
  color: theme.primary,
  borderRadius: theme.radius,
  padding: '11px',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
