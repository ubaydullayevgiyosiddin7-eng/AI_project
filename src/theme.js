// Surdo AI — "Zumrad & Laym" mavzusi
// Sayt (frontend) palitrasiga to'liq mos: zumrad #10b981 → laym #a3e635, mint #2dd4bf

export const theme = {
  // Asosiy ranglar
  primary:       '#059669',   // zumrad — asosiy
  primaryLight:  '#10b981',   // yorqin zumrad — aksent
  primaryDark:   '#04291a',   // to'q — sarlavhalar
  accent:        '#65a30d',   // laym — tasdiqlash
  accentLight:   '#a3e635',
  lime:          '#a3e635',
  mint:          '#2dd4bf',
  danger:        '#dc2626',   // qizil — xatolar
  warning:       '#ca8a04',   // sariq
  info:          '#0d9488',   // mint-havorang

  // Gradientlar
  gradient:      'linear-gradient(120deg,#10b981,#4ade80 48%,#a3e635)',
  gradientSoft:  'linear-gradient(135deg,rgba(16,185,129,.12),rgba(163,230,53,.12))',

  // Fon va sirtlar
  bg:            '#f5fdf8',   // sahifa foni — yashil-oq
  bgAlt:         '#e9f8f0',
  surface:       '#ffffff',
  surfaceHover:  '#f1fbf5',
  surfaceAlt:    '#e4f6ea',

  // Matn
  text:          '#04291a',
  textMuted:     '#2b5a43',
  textLight:     '#6d9a84',
  textOnPrimary: '#ffffff',
  textOnLime:    '#04180f',   // laym/zumrad gradient ustidagi matn

  // Chegaralar
  border:        '#cdeada',
  borderStrong:  '#a2d9bc',
  borderFocus:   '#10b981',

  // Soyalar — yashil ohangli
  shadow:        '0 1px 3px rgba(4,41,26,0.06), 0 1px 2px rgba(4,41,26,0.04)',
  shadowMd:      '0 6px 24px rgba(4,41,26,0.09)',
  shadowLg:      '0 18px 50px rgba(4,41,26,0.13)',
  shadowAcc:     '0 8px 30px rgba(16,185,129,0.28)',

  // Radius — sayt bilan bir xil
  radius:        '12px',
  radiusLg:      '18px',
  radiusSm:      '8px',

  // Spacing scale
  s1:  '4px',
  s2:  '8px',
  s3:  '12px',
  s4:  '16px',
  s5:  '20px',
  s6:  '24px',
  s8:  '32px',
  s10: '40px',

  // Shriftlar — sayt bilan bir xil juftlik
  font:          "'Inter', -apple-system, system-ui, sans-serif",
  fontDisplay:   "'Outfit', 'Inter', sans-serif",
};

// Umumiy uslublar
export const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: theme.bg,
    color: theme.text,
    fontFamily: theme.font,
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
    background: theme.gradient,
    color: theme.textOnLime,
    border: 'none',
    borderRadius: theme.radius,
    padding: '11px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: theme.shadowAcc,
    transition: 'transform 0.18s, box-shadow 0.18s',
  },
  btnSecondary: {
    background: theme.surface,
    color: theme.primary,
    border: `1.5px solid ${theme.borderStrong}`,
    borderRadius: theme.radius,
    padding: '11px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s, background 0.18s',
  },
  btnGhost: {
    background: 'transparent',
    color: theme.textMuted,
    border: 'none',
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  input: {
    width: '100%',
    background: theme.surface,
    border: `1.5px solid ${theme.border}`,
    borderRadius: theme.radius,
    padding: '11px 14px',
    fontSize: 14,
    color: theme.text,
    fontFamily: 'inherit',
    outline: 'none',
  },
  label: {
    display: 'block',
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: 700,
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
