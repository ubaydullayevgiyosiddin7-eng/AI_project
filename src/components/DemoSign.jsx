// "Demo" — harf qoidasini matn + RASM bilan ko'rsatadi
// Rasm public/images/alphabet/ dan keladi (fallback: gradient harf)

import { ALPHABET_BY_ID } from '../data/alphabet';
import SignImage from './SignImage';
import theme from '../theme';

export default function DemoSign({ signId }) {
  const sign = ALPHABET_BY_ID[signId];
  if (!sign) return null;

  // Birinchi variant yoki rules dan barmoq holatlari
  const primaryRules = sign.variants?.[0] || sign.rules || {};
  const fingers = primaryRules.fingers || {};

  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radius,
      padding: '16px 18px',
      boxShadow: theme.shadow,
    }}>
      {/* Yuqori qator: katta rasm + harf belgisi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 16 }}>
        <SignImage letterId={sign.id} size={200} rounded={16} />

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#fff',
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(135deg, #84cc16, #2dd4bf)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {sign.id}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(200,200,255,0.5)', fontFamily: 'monospace', letterSpacing: '0.12em' }}>
            {sign.type === 'static' ? 'STATIK IMORA' : 'HARAKATLI IMORA'}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: '#e4f6ea', marginBottom: 14, lineHeight: 1.5 }}>
        {sign.description}
      </div>

      <FingerVisual fingers={fingers} />

      {sign.type === 'dynamic' && sign.dynamic?.pattern && (
        <div style={dynamicHintStyle}>
          Harakat: {sign.dynamic.pattern.join(' → ')}
        </div>
      )}
      {sign.type === 'dynamic' && sign.dynamic?.circular && (
        <div style={dynamicHintStyle}>
          Harakat: doira chizish
        </div>
      )}
    </div>
  );
}

function FingerVisual({ fingers }) {
  const names = [
    { id: 'thumb',  label: 'Bosh' },
    { id: 'index',  label: "Ko'rsatkich" },
    { id: 'middle', label: "O'rta" },
    { id: 'ring',   label: 'Nomsiz' },
    { id: 'pinky',  label: 'Chinchaloq' },
  ];

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
      {names.map(f => {
        const state = fingers[f.id];
        const isExtended = state === 'extended';
        const isClosed   = state === 'closed';
        const color = isExtended ? '#10b981' : isClosed ? '#ef4444' : 'rgba(255,255,255,0.2)';
        return (
          <div key={f.id} style={{
            background: `${color}20`,
            border: `1px solid ${color}66`,
            borderRadius: 8,
            padding: '6px 8px',
            minWidth: 60,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 14, fontWeight: 800, color,
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 2,
            }}>
              {isExtended ? '↑' : isClosed ? '○' : '?'}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(200,200,255,0.5)', fontFamily: 'monospace' }}>
              {f.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const dynamicHintStyle = {
  marginTop: 14,
  padding: '8px 12px',
  background: 'rgba(245,158,11,0.12)',
  border: '1px solid rgba(245,158,11,0.4)',
  borderRadius: 10,
  fontSize: 11,
  color: '#f59e0b',
  fontFamily: 'monospace',
};
