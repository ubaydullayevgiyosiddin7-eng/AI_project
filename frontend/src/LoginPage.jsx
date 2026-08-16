// LoginPage.jsx — Tizimga kirish
import React, { useState } from 'react';
import { login } from './utils/auth';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [show, setShow]         = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true); setError('');
    try {
      const user = await login(username.trim(), password);
      onLogin(user);
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg)', padding:20, position:'relative', overflow:'hidden',
    }}>
      <div className="aurora" aria-hidden="true"><i/><i/><i/></div>

      <div className="a-su" style={{
        width:'100%', maxWidth:420, position:'relative', zIndex:1, overflow:'hidden',
        background:'var(--glass)', border:'1px solid var(--brd2)',
        backdropFilter:'blur(24px) saturate(170%)', WebkitBackdropFilter:'blur(24px) saturate(170%)',
        borderRadius:24, padding:'42px 38px', boxShadow:'var(--sh-lg)',
      }}>
        {/* Yuqori gradient chiziq */}
        <div aria-hidden="true" style={{
          position:'absolute', top:0, left:0, right:0, height:3,
          background:'linear-gradient(90deg,var(--acc3),var(--acc-v),var(--acc2-v))',
        }}/>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <div className="mark" style={{
            width:64, height:64, margin:'0 auto 14px',
            boxShadow:'0 10px 28px rgba(16,185,129,.32)',
          }}><img src={process.env.PUBLIC_URL + '/logo-mark.png'} alt="Surdo AI"/></div>
          <div className="wordmark" style={{ fontSize:21 }}>Surdo AI</div>
          <div style={{ fontSize:10, color:'var(--t3)', letterSpacing:'.13em', marginTop:4, fontWeight:700 }}>
            IMO-ISHORA TILI · AI
          </div>
        </div>

        {/* Sarlavha */}
        <div style={{ marginBottom:22 }}>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:19, fontWeight:800, color:'var(--t1)', marginBottom:4 }}>
            Tizimga kirish
          </h2>
          <p style={{ fontSize:13, color:'var(--t3)' }}>Login va parolingizni kiriting</p>
        </div>

        <form onSubmit={handle}>
          {/* Login */}
          <div style={{ marginBottom:14 }}>
            <div className="label">Foydalanuvchi nomi</div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--t3)', display:'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <input className="field" type="text" value={username} placeholder="foydalanuvchi"
                autoComplete="username" style={{ paddingLeft:39 }}
                onChange={e => setUsername(e.target.value)}/>
            </div>
          </div>

          {/* Parol */}
          <div style={{ marginBottom:20 }}>
            <div className="label">Parol</div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--t3)', display:'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2.4"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input className="field" type={show ? 'text' : 'password'} value={password}
                placeholder="••••••••" autoComplete="current-password"
                style={{ paddingLeft:39, paddingRight:44 }}
                onChange={e => setPassword(e.target.value)}/>
              <button type="button" onClick={() => setShow(s => !s)}
                aria-label={show ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                style={{
                  position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', padding:4,
                  color:'var(--t3)', display:'flex',
                }}>
                {show
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="m1 1 22 22"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {/* Xatolik */}
          {error && (
            <div className="a-fd" style={{
              padding:'11px 14px', borderRadius:11, marginBottom:16,
              background:'var(--er-bg)', border:'1px solid var(--er-b)',
              fontSize:13, color:'var(--er)', display:'flex', alignItems:'center', gap:9,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              {error}
            </div>
          )}

          {/* Kirish */}
          <button type="submit" disabled={loading || !username || !password}
            className="btn btn-p" style={{ width:'100%', padding:14, fontSize:15.5 }}>
            <span>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(4,24,15,.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Kirilmoqda...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>
                  </svg>
                  Kirish
                </>
              )}
            </span>
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:11.5, color:'var(--t3)', marginTop:20 }}>
          Muammo bo'lsa administrator bilan bog'laning
        </p>
      </div>
    </div>
  );
}
