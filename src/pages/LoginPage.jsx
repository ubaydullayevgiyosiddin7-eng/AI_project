import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import theme from '../theme';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tryLogin = async (u, p) => {
    setError('');
    setLoading(true);
    try {
      await login((u || '').trim(), p || '');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    tryLogin(username, password);
  };

  const loginAsDemo = (u, p) => {
    setUsername(u);
    setPassword(p);
    tryLogin(u, p);
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Sarlavha */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={emblemStyle}>SH</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: theme.primaryDark, margin: 0, letterSpacing: '-0.01em' }}>
            SignHand
          </h1>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
            O'zbek imo-ishora tili o'qitish platformasi
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>FOYDALANUVCHI</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="talaba"
              style={inputStyle}
              autoComplete="username"
              autoFocus
              required
              disabled={loading}
            />
          </div>
          <div>
            <label style={labelStyle}>PAROL</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="•••••••"
              style={inputStyle}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={errorStyle}>{error}</div>
          )}

          <button type="submit" disabled={loading || !username || !password} style={loading ? disabledBtnStyle : primaryBtnStyle}>
            {loading ? 'Kirilmoqda...' : 'TIZIMGA KIRISH'}
          </button>
        </form>

        {/* Demo */}
        <div style={demoSectionStyle}>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>
            TEZ KIRISH (DEMO)
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <DemoBtn label="talaba" onClick={() => loginAsDemo('talaba', 'talaba123')} disabled={loading} />
            <DemoBtn label="admin"  onClick={() => loginAsDemo('admin', 'admin123')}   disabled={loading} />
            <DemoBtn label="demo"   onClick={() => loginAsDemo('demo', 'demo')}        disabled={loading} />
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${theme.border}`, fontSize: 11, color: theme.textLight, textAlign: 'center' }}>
          v1.0 · 2026
        </div>
      </div>
    </div>
  );
}

function DemoBtn({ label, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      background: theme.surface,
      border: `1px solid ${theme.borderStrong}`,
      color: theme.primary,
      padding: '6px 14px',
      fontSize: 12,
      fontWeight: 600,
      borderRadius: theme.radiusSm,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'inherit',
    }}>
      {label}
    </button>
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
  boxShadow: theme.shadowLg,
  padding: '32px 30px',
  width: '100%',
  maxWidth: 380,
};

const emblemStyle = {
  width: 60,
  height: 60,
  margin: '0 auto 14px',
  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
  color: '#fff',
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  boxShadow: '0 8px 20px rgba(12,74,110,0.25)',
};

const labelStyle = {
  display: 'block',
  fontSize: 11,
  color: theme.textMuted,
  fontWeight: 600,
  letterSpacing: '0.05em',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  background: theme.surface,
  border: `1px solid ${theme.borderStrong}`,
  borderRadius: theme.radius,
  padding: '11px 14px',
  fontSize: 14,
  color: theme.text,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const primaryBtnStyle = {
  width: '100%',
  background: theme.primary,
  color: '#fff',
  border: 'none',
  borderRadius: theme.radius,
  padding: '12px',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  marginTop: 6,
};

const disabledBtnStyle = {
  ...primaryBtnStyle,
  background: theme.borderStrong,
  color: theme.textLight,
  cursor: 'not-allowed',
};

const errorStyle = {
  padding: '10px 14px',
  background: '#fef2f2',
  border: `1px solid #fecaca`,
  borderRadius: theme.radius,
  color: theme.danger,
  fontSize: 13,
};

const demoSectionStyle = {
  marginTop: 22,
  padding: 14,
  background: theme.bg,
  borderRadius: theme.radius,
};
