// Mashq — yon-yon ochiq dizayn
import { useRef, useState, useEffect } from 'react';
import useHolistic from '../hooks/useHolistic';
import useSignDetector from '../hooks/useSignDetector';
import useProgress from '../hooks/useProgress';
import SignCameraFeed from '../components/SignCameraFeed';
import ConfidenceBar from '../components/ConfidenceBar';
import SignImage from '../components/SignImage';
import { ALPHABET, ALPHABET_BY_ID } from '../data/alphabet';
import theme from '../theme';

export default function PracticePage({ onBack }) {
  const videoRef = useRef(null);
  const [mode, setMode] = useState('free'); // 'free' | 'random'
  const [randomTarget, setRandomTarget] = useState(null);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const { addXP, learnLetter } = useProgress();

  const holistic = useHolistic(videoRef, true);
  const detection = useSignDetector(holistic.results, {
    mode: mode === 'random' ? 'lesson' : 'practice',
    targetSign: mode === 'random' ? randomTarget : null,
    threshold: 0.5,
    holdMs: 700,
  });

  useEffect(() => {
    if (mode !== 'random') return;
    if (!detection.confirmed) return;
    if (detection.confirmed.value === randomTarget) {
      setStreak(s => s + 1);
      setSolved(s => s + 1);
      addXP(5);
      learnLetter(randomTarget);
      pickRandom();
    } else {
      setStreak(0);
    }
  }, [detection.confirmed, mode, randomTarget]);

  const pickRandom = () => {
    const staticOnes = ALPHABET.filter(l => l.type === 'static');
    const r = staticOnes[Math.floor(Math.random() * staticOnes.length)];
    setRandomTarget(r.id);
  };

  const startRandom = () => {
    setMode('random');
    setStreak(0);
    setSolved(0);
    pickRandom();
  };

  const candidate = detection.candidate;
  const targetLetter = randomTarget ? ALPHABET_BY_ID[randomTarget] : null;

  return (
    <div style={pageStyle}>
      <header style={topBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={backBtn}>← Orqaga</button>
          <div style={{ width: 1, height: 24, background: theme.border }} />
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>MASHQ</div>
            <div style={{ fontSize: 15, color: theme.primaryDark, fontWeight: 700 }}>
              {mode === 'random' ? 'Tasodifiy harflar' : 'Erkin mashq'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <ModeBtn active={mode === 'free'} onClick={() => setMode('free')}>Erkin</ModeBtn>
          <ModeBtn active={mode === 'random'} onClick={startRandom}>Tasodifiy</ModeBtn>
        </div>
      </header>

      <main style={mainGridStyle}>
        {/* CHAP: kamera */}
        <section style={cameraCardStyle}>
          <div style={cameraInnerStyle}>
            <SignCameraFeed
              videoRef={videoRef}
              results={holistic.results}
              detection={detection}
              isTracking={holistic.isTracking}
              status={holistic.status}
              error={holistic.error}
              size="large"
            />
          </div>
        </section>

        {/* O'NG: maqsad va aniqlik */}
        <section style={sidebarStyle}>
          {mode === 'random' && targetLetter && (
            <>
              <div style={statsRowStyle}>
                <Stat label="Yechilgan" value={solved} color={theme.accent} />
                <Stat label="Streak" value={streak} color={theme.warning} />
              </div>

              <div style={currentSignCardStyle}>
                <SignImage letterId={randomTarget} size={130} rounded={10} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
                    KO'RSATING:
                  </div>
                  <div style={{ fontSize: 48, color: theme.primaryDark, fontWeight: 800, lineHeight: 1, margin: '6px 0 4px' }}>
                    {randomTarget}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{targetLetter.description}</div>
                </div>
              </div>

              <ConfidenceBar
                confidence={detection.targetScore || 0}
                stableProgress={detection.stable?.progress || 0}
                label={targetLetter.id}
                target={targetLetter.uzbekLabel}
              />
            </>
          )}

          {mode === 'free' && (
            <>
              <div style={detectedCardStyle}>
                <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
                  ANIQLANGAN HARF
                </div>
                <div style={{ fontSize: 72, fontWeight: 800, color: theme.primaryDark, lineHeight: 1, textAlign: 'center', margin: '12px 0' }}>
                  {candidate?.letter || candidate?.id || '—'}
                </div>
                <div style={{ fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>
                  {candidate
                    ? `${Math.round((candidate.confidence || 0) * 100)}% ishonch`
                    : 'Imo-ishora qiling'}
                </div>
              </div>

              <ConfidenceBar
                confidence={candidate?.confidence || 0}
                stableProgress={detection.stable?.progress || 0}
                label={candidate?.letter || candidate?.id || ''}
              />

              <div style={hintStyle}>
                <strong style={{ color: theme.primary }}>Erkin rejim:</strong> Istalgan imorni sinang.
                Model sizning harakatingizni real vaqtda taniydi.
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? theme.primary : theme.surface,
      color: active ? '#fff' : theme.textMuted,
      border: `1px solid ${active ? theme.primary : theme.borderStrong}`,
      padding: '6px 14px',
      borderRadius: theme.radiusSm,
      fontSize: 12, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit',
    }}>{children}</button>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      flex: 1,
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radius,
      padding: '12px 14px',
      boxShadow: theme.shadow,
    }}>
      <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, marginTop: 4 }}>
        {value}
      </div>
    </div>
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

const mainGridStyle = {
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

const cameraInnerStyle = {
  flex: 1, minHeight: 0,
  borderRadius: theme.radius, overflow: 'hidden',
};

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minHeight: 0,
};

const statsRowStyle = {
  display: 'flex', gap: 10,
};

const currentSignCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  boxShadow: theme.shadow,
};

const detectedCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: 18,
  boxShadow: theme.shadow,
};

const hintStyle = {
  fontSize: 11,
  color: theme.textMuted,
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  padding: 12,
  borderRadius: theme.radius,
  lineHeight: 1.6,
};
