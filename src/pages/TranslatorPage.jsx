// Real-time tarjimon — yon-yon dizayn, yo'riqnoma bilan
import { useRef, useState, useEffect } from 'react';
import useHolistic from '../hooks/useHolistic';
import useSignDetector from '../hooks/useSignDetector';
import SignCameraFeed from '../components/SignCameraFeed';
import ConfidenceBar from '../components/ConfidenceBar';
import TranslatorGuide from '../components/TranslatorGuide';
import { SentenceBuilder } from '../core/sentenceBuilder';
import theme from '../theme';

const GUIDE_KEY = 'signhand_translator_guide_seen';

export default function TranslatorPage({ onBack }) {
  const videoRef = useRef(null);
  const builderRef = useRef(new SentenceBuilder());
  const [, forceUpdate] = useState(0);
  const [lastGrammar, setLastGrammar] = useState('statement');

  // Yo'riqnoma — birinchi marta avtomatik ochiladi
  const [showGuide, setShowGuide] = useState(() => {
    try { return !localStorage.getItem(GUIDE_KEY); } catch { return true; }
  });

  const holistic = useHolistic(videoRef, true);
  // 4 sek qimirlatmay ushlash + 80% threshold — adashish kamayadi
  const detection = useSignDetector(holistic.results, {
    mode: 'translator',
    threshold: 0.80,
    holdMs: 4000,
    cooldownMs: 1500,
  });

  useEffect(() => {
    if (!detection.confirmed) return;
    builderRef.current.addSign(
      detection.confirmed.value,
      detection.confirmed.value.length === 1 ? 'letter' : 'word',
      detection.confirmed.grammar
    );
    setLastGrammar(detection.confirmed.grammar);
    forceUpdate(x => x + 1);
  }, [detection.confirmed]);

  useEffect(() => {
    if (detection.grammar !== lastGrammar) setLastGrammar(detection.grammar);
  }, [detection.grammar, lastGrammar]);

  const handleClose = () => {
    setShowGuide(false);
    try { localStorage.setItem(GUIDE_KEY, '1'); } catch {}
  };

  const handleClear = () => { builderRef.current.clear(); forceUpdate(x => x + 1); };
  const handleUndo = () => { builderRef.current.undo();   forceUpdate(x => x + 1); };
  const handleSpeak = () => {
    const text = builderRef.current.finalize(lastGrammar);
    if (!text) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'uz-UZ'; utter.rate = 0.9;
      speechSynthesis.speak(utter);
    } catch {}
  };

  const text = builderRef.current.preview();
  const candidate = detection.candidate;

  return (
    <div style={pageStyle}>
      {/* Top bar */}
      <header style={topBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={backBtn}>← Orqaga</button>
          <div style={{ width: 1, height: 24, background: theme.border }} />
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>REAL-TIME</div>
            <div style={{ fontSize: 15, color: theme.primaryDark, fontWeight: 700 }}>Tarjimon</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge holistic={holistic} />
          <button onClick={() => setShowGuide(true)} style={helpBtn} title="Yo'riqnoma">
            <span style={{ fontSize: 14, fontWeight: 800 }}>?</span> Yo'riq
          </button>
        </div>
      </header>

      {/* Body — kamera + tarjima yonma-yon */}
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

          {/* Kameraning ostida — aniqlik */}
          <div style={{ marginTop: 12 }}>
            <ConfidenceBar
              confidence={candidate?.confidence || 0}
              stableProgress={detection.stable?.progress || 0}
              label={candidate?.letter || candidate?.id || ''}
              light
            />
          </div>
        </section>

        {/* O'NG: tarjima paneli */}
        <section style={translationPanelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
              TARJIMA
            </div>
            <GrammarBadge grammar={lastGrammar} />
          </div>

          {/* Yig'ilgan matn — katta */}
          <div style={textAreaStyle}>
            {text ? (
              <div style={{ fontSize: 28, color: theme.primaryDark, fontWeight: 700, lineHeight: 1.4, letterSpacing: '0.02em' }}>
                {text}
                <span style={cursorStyle}>|</span>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: theme.textLight }}>
                Imo-ishorangizni ko'rsating — bu yerga matn yig'iladi
              </div>
            )}
          </div>

          {/* Boshqaruv tugmalari */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <button onClick={handleUndo} disabled={!text} style={secondaryBtn}>
              ← Bekor
            </button>
            <button onClick={handleClear} disabled={!text} style={secondaryBtn}>
              Tozalash
            </button>
            <button onClick={handleSpeak} disabled={!text} style={primaryBtn}>
              ♪ O'qish
            </button>
          </div>

          {/* Qisqa eslatma */}
          <div style={hintStyle}>
            <strong style={{ color: theme.primary }}>Maslahat:</strong> Imorani <strong>4 sekund qimirlatmay</strong> ushlang — tasdiqlanadi.
            Pauza — bo'sh joy. Qoshlar yuqori — savol belgisi.
          </div>
        </section>
      </main>

      <TranslatorGuide open={showGuide} onClose={handleClose} />
    </div>
  );
}

function StatusBadge({ holistic }) {
  const color = holistic.status === 'active' ? theme.accent :
                holistic.status === 'error'  ? theme.danger : theme.warning;
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusSm,
      padding: '5px 10px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
      <span style={{ color }}>{holistic.status === 'active' ? 'ULANGAN' : holistic.status === 'error' ? 'XATO' : 'YUKLANYAPTI'}</span>
      {holistic.fps > 0 && <span style={{ color: theme.textMuted }}>· {holistic.fps} FPS</span>}
    </div>
  );
}

function GrammarBadge({ grammar }) {
  const labels = {
    statement: { text: 'GAP', color: theme.textMuted },
    question:  { text: 'SAVOL ?',  color: theme.info },
    negation:  { text: 'INKOR (EMAS)', color: theme.danger },
  };
  const l = labels[grammar] || labels.statement;
  return (
    <div style={{
      background: `${l.color}15`,
      color: l.color,
      padding: '4px 10px',
      borderRadius: 4,
      fontSize: 10, fontWeight: 700,
      letterSpacing: '0.06em',
    }}>
      {l.text}
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

const helpBtn = {
  background: theme.primary,
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: theme.radiusSm,
  fontSize: 12, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', gap: 6,
};

const mainGridStyle = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1.3fr 1fr',
  gap: 16,
  padding: 16,
  minHeight: 0,
};

const cameraCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadow,
  overflow: 'hidden',
};

const cameraInnerStyle = {
  flex: 1,
  minHeight: 0,
  borderRadius: theme.radius,
  overflow: 'hidden',
};

const translationPanelStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radiusLg,
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  boxShadow: theme.shadow,
};

const textAreaStyle = {
  flex: 1,
  background: theme.bg,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: '16px 18px',
  minHeight: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  overflowY: 'auto',
};

const cursorStyle = {
  display: 'inline-block',
  width: 2,
  height: '1em',
  marginLeft: 2,
  background: theme.primary,
  animation: 'blink 1s infinite',
  verticalAlign: 'text-bottom',
};

const primaryBtn = {
  background: theme.primary,
  color: '#fff',
  border: 'none',
  padding: '10px 12px',
  borderRadius: theme.radius,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const secondaryBtn = {
  background: theme.surface,
  border: `1px solid ${theme.borderStrong}`,
  color: theme.text,
  padding: '10px 12px',
  borderRadius: theme.radius,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const hintStyle = {
  fontSize: 11,
  color: theme.textMuted,
  background: theme.bg,
  padding: 10,
  borderRadius: theme.radiusSm,
  lineHeight: 1.5,
};
