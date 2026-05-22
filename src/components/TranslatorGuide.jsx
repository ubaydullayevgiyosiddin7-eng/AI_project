// Tarjimon yo'riqnomasi — modal oynasi
// Birinchi marta kirganda avtomatik ochiladi (localStorage flag bilan)

import { useState } from 'react';
import SignImage from './SignImage';
import theme from '../theme';

const STEPS = [
  {
    n: 1,
    title: "Kameraga qarang",
    text: "Yuzingiz va qo'lingiz kadrda ko'rinib turishi kerak. Yorug'lik yetarli bo'lsin.",
    visual: 'face',
  },
  {
    n: 2,
    title: "Harfni ko'rsating",
    text: "Daktil alifbosi bo'yicha harf imorasini bajaring. Misol uchun \"A\" harfi — musht, bosh barmoq yon tomonda.",
    visual: 'A',
  },
  {
    n: 3,
    title: "0.7 sekund ushlab turing",
    text: "Imora barqaror bo'lganda yashil chiziq to'ladi. Tasdiqlangandan keyin harf matnga qo'shiladi.",
    visual: 'B',
  },
  {
    n: 4,
    title: "Pauza qiling — bo'sh joy",
    text: "Qo'lingizni 1 sekundga pastga tushiring. So'z tugadi, bo'sh joy qo'yiladi.",
    visual: 'pause',
  },
  {
    n: 5,
    title: "Yuz bilan grammatika",
    text: "Qoshlar yuqori — gap savol bo'ladi (?). Qoshlar pastga — bo'lishsiz (EMAS).",
    visual: 'face',
  },
  {
    n: 6,
    title: "Matnni o'qish",
    text: "Yig'ilgan matn o'ng panelda chiqadi. Ovoz tugmasi bilan o'qib eshitishingiz mumkin.",
    visual: 'voice',
  },
];

export default function TranslatorGuide({ open, onClose }) {
  const [step, setStep] = useState(0);
  if (!open) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em' }}>
              YO'RIQNOMA
            </div>
            <div style={{ fontSize: 16, color: theme.primaryDark, fontWeight: 700, marginTop: 2 }}>
              Tarjimon qanday ishlaydi?
            </div>
          </div>
          <button onClick={onClose} style={closeBtn}>×</button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 4, padding: '0 22px' }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 1.5,
              background: i <= step ? theme.primary : theme.border,
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <div style={visualBoxStyle}>
            <StepVisual visual={s.visual} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: theme.primary, fontWeight: 700, letterSpacing: '0.05em' }}>
              QADAM {s.n} / {STEPS.length}
            </div>
            <h3 style={{ fontSize: 18, color: theme.primaryDark, fontWeight: 700, margin: '8px 0 10px' }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, margin: 0 }}>
              {s.text}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ ...secondaryBtn, opacity: step === 0 ? 0.4 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Orqaga
          </button>

          {isLast ? (
            <button onClick={onClose} style={primaryBtn}>
              TUSHUNDIM, BOSHLAYMAN
            </button>
          ) : (
            <button onClick={() => setStep(step + 1)} style={primaryBtn}>
              Davom →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepVisual({ visual }) {
  // Harf rasmi
  if (['A', 'B', 'L', 'O'].includes(visual)) {
    return <SignImage letterId={visual} size={160} rounded={12} />;
  }

  // Yuz illustrastiya
  if (visual === 'face') {
    return (
      <div style={iconBoxStyle}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="32" stroke={theme.primary} strokeWidth="2.5" fill={theme.bg} />
          {/* Qoshlar */}
          <path d="M 24 30 Q 30 27 36 30" stroke={theme.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 44 30 Q 50 27 56 30" stroke={theme.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Ko'zlar */}
          <circle cx="30" cy="38" r="2" fill={theme.primary} />
          <circle cx="50" cy="38" r="2" fill={theme.primary} />
          {/* Og'iz */}
          <path d="M 32 52 Q 40 56 48 52" stroke={theme.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Pauza
  if (visual === 'pause') {
    return (
      <div style={iconBoxStyle}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="28" y="22" width="8" height="36" rx="2" fill={theme.primary} />
          <rect x="44" y="22" width="8" height="36" rx="2" fill={theme.primary} />
        </svg>
      </div>
    );
  }

  // Ovoz
  if (visual === 'voice') {
    return (
      <div style={iconBoxStyle}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M 22 32 L 22 48 L 30 48 L 42 58 L 42 22 L 30 32 Z" fill={theme.primary} />
          <path d="M 50 30 Q 56 40 50 50" stroke={theme.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 56 26 Q 64 40 56 54" stroke={theme.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return null;
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  padding: 20,
};

const modalStyle = {
  background: theme.surface,
  borderRadius: theme.radiusLg,
  maxWidth: 540, width: '100%',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  fontFamily: "'Inter', sans-serif",
};

const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '16px 22px 12px',
};

const closeBtn = {
  width: 32, height: 32,
  background: theme.bg,
  border: 'none',
  color: theme.textMuted,
  fontSize: 22,
  borderRadius: theme.radiusSm,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const bodyStyle = {
  padding: '22px',
  display: 'flex', gap: 18,
  alignItems: 'center',
};

const visualBoxStyle = {
  width: 160, height: 160, flexShrink: 0,
};

const iconBoxStyle = {
  width: 160, height: 160,
  background: `linear-gradient(135deg, ${theme.bg}, ${theme.bgAlt})`,
  borderRadius: 12,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: `1px solid ${theme.border}`,
};

const footerStyle = {
  padding: '12px 22px 18px',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  borderTop: `1px solid ${theme.border}`,
};

const primaryBtn = {
  background: theme.primary,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radius,
  padding: '10px 18px',
  fontSize: 13, fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  letterSpacing: '0.04em',
};

const secondaryBtn = {
  background: theme.surface,
  color: theme.textMuted,
  border: `1px solid ${theme.borderStrong}`,
  borderRadius: theme.radius,
  padding: '10px 18px',
  fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
};
