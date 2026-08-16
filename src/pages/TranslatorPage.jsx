// Real-time tarjimon — yon-yon dizayn, yo'riqnoma bilan
import { useRef, useState, useEffect } from 'react';
import useHolistic from '../hooks/useHolistic';
import useSignDetector from '../hooks/useSignDetector';
import SignCameraFeed from '../components/SignCameraFeed';
import ConfidenceBar from '../components/ConfidenceBar';
import TranslatorGuide from '../components/TranslatorGuide';
import { SentenceBuilder } from '../core/sentenceBuilder';
import theme from '../theme';

const GUIDE_KEY = 'surdo_ai_translator_guide_seen';

// Demo cheklovi: faqat "BU SUV" gapi uchun kerakli harflar
const ALLOWED_DEMO_LETTERS = new Set(['B', 'U', 'S', 'V']);

// Qo'l ko'rinmaganda so'z yakunlanishi uchun vaqt (3 sek)
const WORD_PAUSE_MS = 3000;

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
  // Demo uchun cheklangan — faqat "BU SUV" gapi uchun kerakli harflar
  // Qoshlar yuqori → "?", pastga → "EMAS"
  const detection = useSignDetector(holistic.results, {
    mode: 'translator',
    threshold: 0.55,
    holdMs: 2000,
    cooldownMs: 1200,
    allowedLetters: ALLOWED_DEMO_LETTERS,
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

  // ── Qo'l ko'rinmagan vaqtni kuzatish (so'z chegarasi) ──
  const handsCountRef = useRef(0);
  const lastHandSeenRef = useRef(Date.now());
  const [pauseProgress, setPauseProgress] = useState(0);

  // handsCount ni ref ga sync qilamiz (stale closure'dan qochish uchun)
  useEffect(() => {
    handsCountRef.current = holistic.handsCount;
    if (holistic.handsCount > 0) {
      lastHandSeenRef.current = Date.now();
    }
  }, [holistic.handsCount]);

  // Bitta interval (mount'da bir marta yaratiladi)
  useEffect(() => {
    const id = setInterval(() => {
      // Qo'l ko'rinyaptimi?
      if (handsCountRef.current > 0) {
        setPauseProgress(p => (p > 0 ? 0 : p));
        return;
      }
      // Qo'l yo'q — lekin so'z hozircha bo'sh bo'lsa ham progress bilinsin
      const hasWord = builderRef.current.currentWord.length > 0;
      const elapsed = Date.now() - lastHandSeenRef.current;
      const progress = Math.min(1, elapsed / WORD_PAUSE_MS);
      setPauseProgress(progress);

      // 3 sek o'tdi va so'z bor bo'lsa — yakunlash
      if (elapsed >= WORD_PAUSE_MS && hasWord) {
        builderRef.current.flushWord();
        lastHandSeenRef.current = Date.now();
        setPauseProgress(0);
        forceUpdate(x => x + 1);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);  // bo'sh dependencies — mount'da bir marta

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

          {/* Pauza countdown — qo'l ko'rinmagan paytda */}
          {pauseProgress > 0.05 && (
            <div style={pauseBoxStyle}>
              <div style={{ fontSize: 11, color: theme.warning, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>
                {builderRef.current.currentWord.length > 0
                  ? `BO'SH JOY ${Math.max(0, Math.ceil((WORD_PAUSE_MS - pauseProgress * WORD_PAUSE_MS) / 1000))} SEK...`
                  : `Qo'l ko'rinmayapti`}
              </div>
              <div style={{ height: 6, background: theme.bg, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pauseProgress * 100}%`,
                  background: theme.warning,
                  transition: 'width 0.1s',
                }} />
              </div>
              {builderRef.current.currentWord.length > 0 && (
                <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 4 }}>
                  3 sek qo'l ko'rinmasa — so'z yakunlanadi
                </div>
              )}
            </div>
          )}
        </section>

        {/* O'NG: tarjima paneli */}
        <section style={translationPanelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
              TARJIMA
            </div>
            <GrammarBadge grammar={lastGrammar} />
          </div>

          {/* Yig'ilgan matn — token-asoslangan (so'z chegaralari ko'rinadi) */}
          <div style={textAreaStyle}>
            {(builderRef.current.tokens.length > 0 || builderRef.current.currentWord.length > 0) ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                {builderRef.current.tokens.map((t, i) => (
                  <span key={i} style={{
                    fontSize: 28, fontWeight: 700, color: theme.primaryDark,
                    background: '#d9f7e6', padding: '4px 14px', borderRadius: 8,
                  }}>
                    {t.value}
                  </span>
                ))}
                {builderRef.current.currentWord && (
                  <span style={{
                    fontSize: 28, fontWeight: 700, color: theme.primary,
                    background: '#fef3c7', padding: '4px 14px', borderRadius: 8,
                    border: `2px dashed ${theme.warning}`,
                  }}>
                    {builderRef.current.currentWord}
                    <span style={cursorStyle}>|</span>
                  </span>
                )}
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
            <strong style={{ color: theme.primary }}>Demo rejimi:</strong> Faqat <strong>B, U, S, V</strong> harflari aniqlanadi (gap: "BU SUV").
            <br />
            Qoshlar yuqori → <strong>"?"</strong>, qoshlar pastga → <strong>"EMAS"</strong>.
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

const pauseBoxStyle = {
  marginTop: 10,
  background: '#fef3c7',
  border: `1px solid #fde68a`,
  borderRadius: theme.radius,
  padding: '10px 12px',
};
