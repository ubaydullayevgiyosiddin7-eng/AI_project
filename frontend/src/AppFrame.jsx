// AppFrame.jsx — Surdo AI ilovasi saytning o'z ichida ochiladi.
// Alohida oyna/tab ochilmaydi: topbar va pastki dok joyida qoladi.
import React, { useState, useEffect, useCallback } from 'react';
import { APP_URL, checkAppAlive } from './config';

export default function AppFrame({ navigateTo, user }) {
  const [state, setState] = useState('checking'); // checking | ok | down
  const [nonce, setNonce] = useState(0);          // iframe'ni qayta yuklash uchun

  // Ilovada qayta ro'yxatdan o'tish yo'q — ism shu yerdan uzatiladi
  const name = user?.full_name || user?.username || '';
  const src  = name ? `${APP_URL}/?user=${encodeURIComponent(name)}` : APP_URL;

  const probe = useCallback(async () => {
    setState('checking');
    setState(await checkAppAlive() ? 'ok' : 'down');
  }, []);

  useEffect(() => { probe(); }, [probe]);

  // Server hali ko'tarilmagan bo'lsa — har 2.5 soniyada o'zi qayta urinadi.
  // Foydalanuvchi hech nima bosmasdan, tayyor bo'lishi bilan ulanadi.
  useEffect(() => {
    if (state !== 'down') return;
    let stopped = false;
    const id = setInterval(async () => {
      if (stopped) return;
      if (await checkAppAlive(2000) && !stopped) setState('ok');
    }, 2500);
    return () => { stopped = true; clearInterval(id); };
  }, [state]);

  const badge = {
    checking: { t: '● TEKSHIRILMOQDA', bg:'var(--surf3)', bd:'var(--brd2)', c:'var(--t3)' },
    ok:       { t: '● LIVE',           bg:'var(--ok-bg)', bd:'var(--ok-b)',  c:'var(--ok)'  },
    down:     { t: '● OFFLINE',        bg:'var(--wa-bg)', bd:'var(--wa-b)',  c:'var(--wa)'  },
  }[state];

  return (
    <div className="app-wrap">
      <div className="app-stage">

        {/* ── Ingichka boshqaruv chizig'i (brend tepada allaqachon bor) ── */}
        <div className="app-bar">
          <button onClick={() => navigateTo('education')} style={{
            display:'flex', alignItems:'center', gap:7,
            padding:'7px 14px', borderRadius:10, fontSize:12.5, fontWeight:700,
            background:'var(--surf3)', border:'1px solid var(--brd2)',
            color:'var(--t2)', cursor:'pointer', fontFamily:'var(--font)',
          }}>← Darslikka qaytish</button>

          <span style={{
            padding:'3px 11px', borderRadius:100, fontSize:10, fontWeight:800, letterSpacing:'.06em',
            background:badge.bg, border:`1px solid ${badge.bd}`, color:badge.c,
          }}>{badge.t}</span>

          {state === 'ok' && (
            <button onClick={() => setNonce(n => n + 1)} title="Qayta yuklash" style={{
              marginLeft:'auto',
              padding:'7px 14px', borderRadius:10, fontSize:12.5, fontWeight:700,
              background:'var(--surf3)', border:'1px solid var(--brd2)',
              color:'var(--t2)', cursor:'pointer', fontFamily:'var(--font)',
            }}>↻ Yangilash</button>
          )}
        </div>

        {/* ── Tarkib ── */}
        {state === 'checking' && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:12, color:'var(--t2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="var(--brd2)" strokeWidth="2.5"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize:14.5 }}>Ilova serveri tekshirilmoqda...</span>
          </div>
        )}

        {state === 'ok' && (
          <iframe key={nonce} src={src} title="Surdo AI"
            allow="camera; microphone"
            style={{ flex:1, width:'100%', border:'none', display:'block', background:'var(--surf)' }}/>
        )}

        {state === 'down' && (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:24, overflowY:'auto' }}>
            <div style={{ maxWidth:560, width:'100%', textAlign:'center' }}>
              <div style={{
                width:74, height:74, borderRadius:24, margin:'0 auto 20px', fontSize:32,
                background:'var(--wa-bg)', border:'1.5px solid var(--wa-b)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>🔌</div>
              <h3 style={{ fontFamily:'var(--font-d)', fontSize:23, fontWeight:800, color:'var(--t1)', marginBottom:12, letterSpacing:'-.035em' }}>
                Ilova serveriga ulanilmoqda…
              </h3>
              <p style={{ fontSize:14.5, color:'var(--t2)', lineHeight:1.75, marginBottom:18 }}>
                Ilova serveri ({APP_URL}) hali ko'tarilmagan. Sahifa <b>har 2 soniyada
                o'zi qayta urinib ko'radi</b> — tayyor bo'lishi bilan avtomatik ulanadi.
                Hech narsa bosish shart emas.
              </p>

              <div style={{
                display:'inline-flex', alignItems:'center', gap:10, marginBottom:22,
                padding:'9px 16px', borderRadius:100,
                background:'var(--surf3)', border:'1px solid var(--brd2)',
                fontSize:12.5, fontWeight:700, color:'var(--t2)',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1.6s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="var(--brd2)" strokeWidth="2.6"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--acc)" strokeWidth="2.6" strokeLinecap="round"/>
                </svg>
                Kutilmoqda…
              </div>

              <details style={{ textAlign:'left', maxWidth:460, margin:'0 auto 22px' }}>
                <summary style={{ cursor:'pointer', fontSize:13, color:'var(--t3)', fontWeight:700, marginBottom:10 }}>
                  Uzoq kutsa — qo'lda ishga tushirish
                </summary>
                <p style={{ fontSize:13, color:'var(--t2)', lineHeight:1.7, marginBottom:10 }}>
                  Loyihaning <b>ildiz</b> papkasida (frontend'da emas):
                </p>
                <div className="codeblock">{'npm run dev'}</div>
              </details>

              <button onClick={probe} className="btn btn-g">
                <span>↻ Hoziroq tekshirish</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
