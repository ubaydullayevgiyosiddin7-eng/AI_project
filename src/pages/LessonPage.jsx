// Dars sahifasi — ochiq rasmiy dizayn, yon-yon, bitta ekranda
import { useRef, useState, useEffect, useCallback } from 'react';
import useHolistic from '../hooks/useHolistic';
import useSignDetector from '../hooks/useSignDetector';
import useProgress from '../hooks/useProgress';
import SignCameraFeed from '../components/SignCameraFeed';
import ConfidenceBar from '../components/ConfidenceBar';
import DemoSign from '../components/DemoSign';
import SignImage from '../components/SignImage';
import { LESSONS_BY_ID, CERTIFICATES } from '../data/lessons';
import { ALPHABET_BY_ID } from '../data/alphabet';
import theme from '../theme';

const HOLD_REQUIRED_MS = 3500;   // 3.5 sek — to'g'ri ushlab turish
const CORRECT_THRESHOLD = 0.85;  // 85% — yuqori ishonch talab qilinadi

export default function LessonPage({ lessonId, onBack }) {
  const videoRef = useRef(null);
  const lesson = LESSONS_BY_ID[lessonId];
  const { completeLesson, learnLetter } = useProgress();

  const [itemIdx, setItemIdx] = useState(0);
  const [scores, setScores] = useState({});
  const [phase, setPhase] = useState('intro');
  const [holdStart, setHoldStart] = useState(null);
  const [, setTick] = useState(0);

  const currentItem = lesson?.items[itemIdx];
  const currentLetter = ALPHABET_BY_ID[currentItem];

  const holistic = useHolistic(videoRef, phase === 'learn');
  const detection = useSignDetector(holistic.results, {
    mode: 'lesson',
    targetSign: phase === 'learn' ? currentItem : null,
  });

  const score = detection.targetScore || 0;
  const isCorrect = score >= CORRECT_THRESHOLD;

  useEffect(() => {
    if (phase !== 'learn') return;
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, [phase]);

  const completeCurrent = useCallback(() => {
    const finalScore = Math.round((detection.targetScore || 0) * 100);
    setScores(prev => {
      const next = { ...prev, [currentItem]: finalScore };
      if (itemIdx + 1 < lesson.items.length) {
        setItemIdx(itemIdx + 1);
      } else {
        const total = Object.values(next).reduce((s, v) => s + v, 0);
        const avg = total / lesson.items.length;
        const passed = avg >= lesson.passingScore;
        if (passed) completeLesson(lesson.id, Math.round(avg), lesson.xpReward, lesson.awardCertificate);
        setPhase('done');
      }
      return next;
    });
    learnLetter(currentItem);
    setHoldStart(null);
  }, [currentItem, detection.targetScore, itemIdx, lesson, completeLesson, learnLetter]);

  useEffect(() => {
    if (phase !== 'learn') return;
    if (isCorrect && !holdStart) setHoldStart(Date.now());
    else if (!isCorrect && holdStart) setHoldStart(null);
  }, [isCorrect, holdStart, phase]);

  useEffect(() => {
    if (phase !== 'learn' || !holdStart) return;
    const id = setInterval(() => {
      if (Date.now() - holdStart >= HOLD_REQUIRED_MS) {
        clearInterval(id);
        completeCurrent();
      }
    }, 60);
    return () => clearInterval(id);
  }, [holdStart, phase, completeCurrent]);

  useEffect(() => { setHoldStart(null); }, [itemIdx]);

  if (!lesson) {
    return (
      <div style={pageStyle}>
        <header style={topBarStyle}>
          <button onClick={onBack} style={backBtn}>← Orqaga</button>
        </header>
        <main style={{ padding: 40, textAlign: 'center', color: theme.textMuted }}>Dars topilmadi</main>
      </div>
    );
  }

  // ── INTRO ekrani ────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={pageStyle}>
        <TopBar lesson={lesson} onBack={onBack} />
        <main style={{ ...mainCenter }}>
          <div style={{ ...intoCardStyle }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
              DARS {lesson.order} · BOSHLASH
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.primaryDark, margin: 0 }}>
              {lesson.title}
            </h1>
            <p style={{ fontSize: 14, color: theme.textMuted, marginTop: 8, marginBottom: 18 }}>
              {lesson.description}
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
              {lesson.items.map(id => (
                <div key={id} style={{
                  width: 80, padding: 10,
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: theme.radius,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                  <SignImage letterId={id} size={56} rounded={6} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.primaryDark }}>{id}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: theme.bg, borderRadius: theme.radius, marginBottom: 18 }}>
              <span style={{ fontSize: 12, color: theme.textMuted }}>O'tish balli: <strong style={{ color: theme.text }}>{lesson.passingScore}%</strong></span>
              <span style={{ fontSize: 12, color: theme.textMuted }}>Mukofot: <strong style={{ color: theme.accent }}>+{lesson.xpReward} XP</strong></span>
            </div>

            <button onClick={() => setPhase('learn')} style={primaryBtn}>BOSHLASH</button>
          </div>
        </main>
      </div>
    );
  }

  // ── DONE ekrani ───────────────────────────────────────────
  if (phase === 'done') {
    const total = Object.values(scores).reduce((s, v) => s + v, 0);
    const avg = Math.round(total / lesson.items.length);
    const passed = avg >= lesson.passingScore;
    const cert = lesson.awardCertificate ? CERTIFICATES[lesson.awardCertificate] : null;

    return (
      <div style={pageStyle}>
        <TopBar lesson={lesson} onBack={onBack} />
        <main style={mainCenter}>
          <div style={{ ...intoCardStyle, textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 16px',
              background: passed ? `${theme.accent}20` : `${theme.warning}20`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: passed ? theme.accent : theme.warning,
            }}>{avg}%</div>

            <h1 style={{ fontSize: 22, fontWeight: 700, color: passed ? theme.accent : theme.warning, margin: 0 }}>
              {passed ? "Tabriklaymiz!" : "Yana mashq qiling"}
            </h1>
            <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>
              O'rtacha ball — {passed ? "darsdan o'tdingiz" : `o'tish balli ${lesson.passingScore}%`}
            </p>

            {passed && cert && (
              <div style={{
                marginTop: 20, padding: 16,
                background: `${theme.accent}10`,
                border: `1px solid ${theme.accent}40`,
                borderRadius: theme.radius,
              }}>
                <div style={{ fontSize: 11, color: theme.accent, fontWeight: 700, letterSpacing: '0.05em' }}>SERTIFIKAT</div>
                <div style={{ fontSize: 15, color: theme.text, fontWeight: 700, marginTop: 4 }}>{cert.title}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{cert.description}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
              <button onClick={onBack} style={primaryBtn}>DARSLARGA</button>
              <button onClick={() => { setItemIdx(0); setScores({}); setPhase('intro'); }} style={secondaryBtn}>
                Qaytarish
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── LEARN ekrani ─────────────────────────────────────────
  const stableProgress = holdStart ? Math.min(1, (Date.now() - holdStart) / HOLD_REQUIRED_MS) : 0;
  const secondsLeft = holdStart ? Math.max(0, Math.ceil((HOLD_REQUIRED_MS - (Date.now() - holdStart)) / 1000)) : 0;

  return (
    <div style={pageStyle}>
      <TopBar lesson={lesson} onBack={onBack} progress={{ idx: itemIdx, total: lesson.items.length }} />

      <main style={learnGridStyle}>
        {/* CHAP: kamera */}
        <section style={cameraCardStyle}>
          <div style={{ borderRadius: theme.radius, overflow: 'hidden', flex: 1, minHeight: 0, position: 'relative' }}>
            <SignCameraFeed
              videoRef={videoRef}
              results={holistic.results}
              detection={detection}
              isTracking={holistic.isTracking}
              status={holistic.status}
              error={holistic.error}
              size="large"
            />

            {/* TO'G'RI BAJARDINGIZ — countdown overlay (kameraga ustiga) */}
            {isCorrect && holdStart && (
              <div style={correctOverlayStyle}>
                <div style={correctRingStyle(stableProgress)}>
                  <div style={correctIconStyle}>✓</div>
                </div>
                <div style={correctLabelStyle}>TO'G'RI BAJARDINGIZ!</div>
                <div style={correctCountdownStyle}>
                  {secondsLeft > 0
                    ? `${secondsLeft} sek dan keyin keyingisiga...`
                    : "Keyingisiga o'tilmoqda..."}
                </div>
                <div style={correctSubStyle}>
                  Qo'lingizni shu holatda ushlab turing
                </div>
              </div>
            )}
          </div>
        </section>

        {/* O'NG: yo'riqnoma + indikator */}
        <section style={sidebarStyle}>
          {/* Bosqich indikatori */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4, flex: 1 }}>
              {lesson.items.map((id, i) => (
                <div key={id} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < itemIdx ? theme.accent : i === itemIdx ? theme.primary : theme.border,
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
              {itemIdx + 1} / {lesson.items.length}
            </div>
          </div>

          {/* Joriy harf — katta */}
          <div style={currentSignCardStyle}>
            <SignImage letterId={currentItem} size={130} rounded={10} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
                {currentLetter?.type === 'static' ? 'STATIK' : 'HARAKATLI'} IMORA
              </div>
              <div style={{ fontSize: 48, color: theme.primaryDark, fontWeight: 800, lineHeight: 1, margin: '6px 0 8px' }}>
                {currentItem}
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.5 }}>
                {currentLetter?.description}
              </div>
            </div>
          </div>

          {/* Harakatli harflar uchun yo'riqnoma */}
          {currentLetter?.type === 'dynamic' && (
            <div style={dynamicHintBoxStyle}>
              <div style={{ fontSize: 10, color: theme.primary, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
                HARAKAT KERAK
              </div>
              <div style={{ fontSize: 12, color: theme.text, lineHeight: 1.5 }}>
                {currentLetter.dynamic?.motion === 'circle' && "Ko'rsatkich barmoq bilan havoda DOIRA chizing"}
                {currentLetter.dynamic?.motion === 'zigzag' && "Ko'rsatkich barmoq bilan Z shaklida zigzag chizing"}
                {currentLetter.dynamic?.motion === 'shake' && "Qo'lingizni chap-o'ngga tebrating"}
                {currentLetter.dynamic?.motion === 'slide' && "Qo'lingizni bir tomonga siljiting"}
                {(currentLetter.dynamic?.motion === 'j-curve' ||
                  (Array.isArray(currentLetter.dynamic?.motion) && currentLetter.dynamic.motion.includes('j-curve'))) &&
                  "Pastga + chapga J shaklida ilmoq qiling"}
                {Array.isArray(currentLetter.dynamic?.motion) &&
                  currentLetter.dynamic.motion.includes('slide') &&
                  !currentLetter.dynamic.motion.includes('j-curve') &&
                  "Qo'lingizni yon tomonga siljiting"}
              </div>
            </div>
          )}

          {/* Aniqlik */}
          <ConfidenceBar
            confidence={score}
            stableProgress={stableProgress}
            label={currentItem}
            target={currentLetter?.uzbekLabel}
            light
          />

          {/* Xato fidbek */}
          {detection.mistakes && detection.mistakes.length > 0 && score < 0.4 && (
            <div style={mistakeBoxStyle}>
              <div style={{ fontSize: 10, color: theme.warning, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
                MASLAHAT
              </div>
              <div style={{ fontSize: 12, color: theme.text }}>
                {detection.mistakes[0].tip}
              </div>
            </div>
          )}

          {/* Manual o'tkazish — har vaqt mavjud */}
          <button onClick={completeCurrent} style={skipBtnStyle}>
            Keyingisiga o'tkazish →
          </button>
        </section>
      </main>
    </div>
  );
}

function TopBar({ lesson, onBack, progress }) {
  return (
    <header style={topBarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onBack} style={backBtn}>← Chiqish</button>
        <div style={{ width: 1, height: 24, background: theme.border }} />
        <div>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>DARS {lesson.order}</div>
          <div style={{ fontSize: 14, color: theme.primaryDark, fontWeight: 700, marginTop: 1 }}>{lesson.title}</div>
        </div>
      </div>
      {progress && (
        <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>
          {progress.idx + 1} / {progress.total}
        </div>
      )}
    </header>
  );
}

const pageStyle = {
  height: '100vh',
  width: '100%',
  background: theme.bg,
  color: theme.text,
  fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const topBarStyle = {
  background: theme.surface,
  borderBottom: `1px solid ${theme.border}`,
  padding: '10px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
};

const backBtn = {
  background: theme.surface,
  border: `1px solid ${theme.borderStrong}`,
  color: theme.textMuted,
  padding: '6px 12px',
  borderRadius: theme.radiusSm,
  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
};

const mainCenter = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const intoCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: 24,
  maxWidth: 580,
  width: '100%',
  textAlign: 'center',
  boxShadow: theme.shadowLg,
};

const learnGridStyle = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1.4fr 1fr',
  gap: 16,
  padding: 16,
  minHeight: 0,
};

const cameraCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadow,
  overflow: 'hidden',
};

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minHeight: 0,
};

const currentSignCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  boxShadow: theme.shadow,
};

const mistakeBoxStyle = {
  background: '#fef3c7',
  border: `1px solid #fde68a`,
  borderRadius: theme.radius,
  padding: '10px 14px',
};

const dynamicHintBoxStyle = {
  background: '#eff6ff',
  border: `1px solid #bfdbfe`,
  borderRadius: theme.radius,
  padding: '10px 14px',
};

const skipBtnStyle = {
  background: theme.primary,
  border: 'none',
  color: '#fff',
  padding: '12px 14px',
  borderRadius: theme.radius,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginTop: 'auto',
  letterSpacing: '0.04em',
};

// ─── TO'G'RI BAJARDINGIZ overlay uslublari ───
const correctOverlayStyle = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(22, 163, 74, 0.85)',  // yashil (rasmiy)
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  pointerEvents: 'none',
  zIndex: 10,
  backdropFilter: 'blur(2px)',
};

const correctRingStyle = (progress) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: `conic-gradient(#fff ${progress * 360}deg, rgba(255,255,255,0.25) 0deg)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.1s linear',
});

const correctIconStyle = {
  width: 100,
  height: 100,
  borderRadius: '50%',
  background: '#16a34a',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 60,
  fontWeight: 900,
  color: '#fff',
  lineHeight: 1,
};

const correctLabelStyle = {
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
};

const correctCountdownStyle = {
  fontSize: 16,
  fontWeight: 600,
  opacity: 0.95,
};

const correctSubStyle = {
  fontSize: 13,
  opacity: 0.8,
  marginTop: -8,
};

const primaryBtn = {
  background: theme.primary,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radius,
  padding: '12px 24px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
  letterSpacing: '0.05em',
};

const secondaryBtn = {
  background: theme.surface,
  border: `1px solid ${theme.borderStrong}`,
  color: theme.text,
  padding: '12px 24px',
  borderRadius: theme.radius,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
