// Aniqlik chizig'i + barqarorlik (light/dark variantlar)
import theme from '../theme';

export default function ConfidenceBar({ confidence = 0, stableProgress = 0, label = '', target = null, light = true }) {
  const pct = Math.round(confidence * 100);
  const stablePct = Math.round(stableProgress * 100);
  const color =
    confidence >= 0.75 ? theme.accent :
    confidence >= 0.55 ? theme.primary :
    confidence >= 0.35 ? theme.warning : theme.danger;

  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radius,
      padding: '12px 14px',
      boxShadow: theme.shadow,
    }}>
      {target && (
        <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
          MAQSAD: {target}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <div style={{
          fontSize: 26, fontWeight: 800, color: theme.primaryDark,
          lineHeight: 1,
        }}>
          {label || '—'}
        </div>
        <div style={{ fontSize: 14, color, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {pct}%
        </div>
      </div>

      <div style={{ height: 6, background: theme.bg, borderRadius: 3, overflow: 'hidden', marginBottom: stableProgress > 0 ? 8 : 0 }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          transition: 'width 0.15s, background 0.2s',
          borderRadius: 3,
        }} />
      </div>

      {stableProgress > 0 && (
        <>
          <div style={{ fontSize: 9, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 3 }}>
            TASDIQLAYAPMAN ({stablePct}%)
          </div>
          <div style={{ height: 3, background: theme.bg, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${stablePct}%`,
              background: stableProgress >= 1 ? theme.accent : theme.primaryLight,
              transition: 'width 0.1s',
            }} />
          </div>
        </>
      )}
    </div>
  );
}
