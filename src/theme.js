// Rasmiy davlat uslubidagi ochiq tema
// O'zbekiston bayrog'i rangidan ilhomlangan: ko'k, oq, yashil
// Toza, professional, ochiq dizayn

export const theme = {
  // Asosiy ranglar
  primary:       '#0c4a6e',   // chuqur ko'k — rasmiy
  primaryLight:  '#0ea5e9',   // yorqin ko'k — aksent
  primaryDark:   '#082f49',   // qoramtir ko'k — sarlavhalar
  accent:        '#16a34a',   // yashil — tasdiqlash
  accentLight:   '#22c55e',
  danger:        '#dc2626',   // qizil — xatolar
  warning:       '#d97706',   // sariq-jigarrang
  info:          '#0891b2',   // havorang

  // Fon va sirtlar
  bg:            '#f1f5f9',   // sahifa foni — ochiq kulrang
  bgAlt:         '#e2e8f0',   // alt fon
  surface:       '#ffffff',   // kartochka foni
  surfaceHover:  '#f8fafc',   // ustki holat

  // Matn
  text:          '#0f172a',   // asosiy matn
  textMuted:     '#475569',   // ikkilamchi matn
  textLight:     '#94a3b8',   // ozgina matn
  textOnPrimary: '#ffffff',

  // Chegaralar
  border:        '#e2e8f0',
  borderStrong:  '#cbd5e1',
  borderFocus:   '#0ea5e9',

  // Konteyner uchun shadow
  shadow:        '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
  shadowMd:      '0 4px 12px rgba(15,23,42,0.08)',
  shadowLg:      '0 10px 30px rgba(15,23,42,0.12)',

  // Radius
  radius:        '10px',
  radiusLg:      '14px',
  radiusSm:      '6px',

  // Spacing scale
  s1:  '4px',
  s2:  '8px',
  s3:  '12px',
  s4:  '16px',
  s5:  '20px',
  s6:  '24px',
  s8:  '32px',
  s10: '40px',
};

// Umumiy uslublar
export const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: theme.bg,
    color: theme.text,
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radiusLg,
    boxShadow: theme.shadow,
  },
  cardPad: {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: theme.radiusLg,
    boxShadow: theme.shadow,
    padding: theme.s6,
  },
  btnPrimary: {
    background: theme.primary,
    color: theme.textOnPrimary,
    border: 'none',
    borderRadius: theme.radius,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background 0.15s',
  },
  btnSecondary: {
    background: theme.surface,
    color: theme.primary,
    border: `1px solid ${theme.borderStrong}`,
    borderRadius: theme.radius,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  btnGhost: {
    background: 'transparent',
    color: theme.textMuted,
    border: 'none',
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  input: {
    width: '100%',
    background: theme.surface,
    border: `1px solid ${theme.borderStrong}`,
    borderRadius: theme.radius,
    padding: '10px 14px',
    fontSize: 14,
    color: theme.text,
    fontFamily: 'inherit',
    outline: 'none',
  },
  label: {
    display: 'block',
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: 600,
    marginBottom: 6,
    letterSpacing: '0.02em',
  },
  topbar: {
    background: theme.surface,
    borderBottom: `1px solid ${theme.border}`,
    padding: `${theme.s3} ${theme.s6}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
};

export default theme;
