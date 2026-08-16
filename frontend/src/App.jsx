// App.jsx — Surdo AI Landing Site
// Dizayn: "Zumrad & Laym" palitra + pastda macOS uslubidagi kattalashuvchi dok
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';

import LandingPage    from './LandingPage';
import EducationPage  from './EducationPage';
import AboutPage      from './AboutPage';
import ContactPage    from './ContactPage';
import LoginPage      from './LoginPage';
import AppFrame       from './AppFrame';
import SurdoTranslatorPage from './SurdoTranslatorPage';
import FloatingLines  from './FloatingLines';
import { isLoggedIn, getUser, logout } from './utils/auth';

const LOGO_MARK = process.env.PUBLIC_URL + '/logo-mark.png';

/* ── Ikonkalar ────────────────────────────────────────────── */
const S = { fill:'none', stroke:'currentColor', strokeWidth:1.9, strokeLinecap:'round', strokeLinejoin:'round' };

const IconSurdo = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M2.8 6.1A1.9 1.9 0 0 1 4.7 4.2h6.2a1.9 1.9 0 0 1 1.9 1.9v4a1.9 1.9 0 0 1-1.9 1.9H6.9L3.6 14.6v-2.6a1.9 1.9 0 0 1-.8-1.5z"/>
    <path d="M10.7 15.4v1.1a1.9 1.9 0 0 0 1.9 1.9h4.3l3.3 2.4v-2.6a1.9 1.9 0 0 0 .8-1.5v-3.3a1.9 1.9 0 0 0-1.9-1.9h-2.5"/>
  </svg>
);
const IconHome = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.7 20v-5.4h4.6V20"/>
  </svg>
);
const IconBook = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M3 5.2A2.2 2.2 0 0 1 5.2 3H10a2 2 0 0 1 2 2v15a1.7 1.7 0 0 0-1.7-1.7H3z"/>
    <path d="M21 5.2A2.2 2.2 0 0 0 18.8 3H14a2 2 0 0 0-2 2v15a1.7 1.7 0 0 1 1.7-1.7H21z"/>
  </svg>
);
const IconSpark = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M12 2.6c.9 4.6 3.9 7.6 8.5 8.5-4.6.9-7.6 3.9-8.5 8.5-.9-4.6-3.9-7.6-8.5-8.5 4.6-.9 7.6-3.9 8.5-8.5Z"/>
    <path d="M18.6 16.4c.4 1.6 1.4 2.6 3 3-1.6.4-2.6 1.4-3 3-.4-1.6-1.4-2.6-3-3 1.6-.4 2.6-1.4 3-3Z"/>
  </svg>
);
const IconMail = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <rect x="2.6" y="5" width="18.8" height="14" rx="3"/><path d="m3.4 7.4 7.5 5.1a2 2 0 0 0 2.2 0l7.5-5.1"/>
  </svg>
);
const IconLaunch = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M14 3.4h6.6V10"/><path d="M20.6 3.4 11.4 12.6"/>
    <path d="M18.4 13.5V19a1.9 1.9 0 0 1-1.9 1.9H5A1.9 1.9 0 0 1 3.1 19V7.5A1.9 1.9 0 0 1 5 5.6h5.5"/>
  </svg>
);
const IconLogout = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M9.5 20.5H6a2.5 2.5 0 0 1-2.5-2.5V6A2.5 2.5 0 0 1 6 3.5h3.5"/>
    <path d="m15.5 16.5 4.5-4.5-4.5-4.5"/><path d="M20 12H9"/>
  </svg>
);
const IconMoon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <path d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5a8.5 8.5 0 1 0 10.8 10.8Z"/>
  </svg>
);
const IconSun = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" {...S}>
    <circle cx="12" cy="12" r="4.2"/>
    <path d="M12 2.4v2M12 19.6v2M2.4 12h2M19.6 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/>
  </svg>
);

/* ── macOS uslubidagi kattalashuvchi DOK ──────────────────── */
function Dock({ items, active, onPick }) {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 720
  );
  const [mouseX, setMouseX] = useState(null);
  const [hover, setHover]   = useState(null);
  const [centers, setCenters] = useState([]);
  const slotRefs = useRef([]);

  const BASE  = compact ? 40 : 48;   // ikonka asosiy o'lchami
  const MAX   = compact ? 1 : 1.72;  // maksimal kattalashish
  const RANGE = compact ? 1 : 128;   // ta'sir radiusi (px)

  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 720);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Slot markazlarini o'lchash. transform layoutga ta'sir qilmagani uchun
  // bu qiymatlar kattalashish paytida ham barqaror qoladi.
  useLayoutEffect(() => {
    const measure = () => {
      setCenters(slotRefs.current.map(el => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      }));
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [items.length, compact]);

  // Har bir element uchun masshtab — kosinusli yumshoq pasayish
  const scales = useMemo(() => items.map((it, i) => {
    const c = centers[i];
    if (it.kind === 'sep' || mouseX == null || c == null) return 1;
    const d = Math.abs(mouseX - c);
    if (d >= RANGE) return 1;
    const f = Math.cos((d / RANGE) * (Math.PI / 2));
    return 1 + (MAX - 1) * f * f;
  }), [items, centers, mouseX, MAX, RANGE]);

  // Qo'shnilar kattalashganda elementlarni yon tomonga surish (macOS effekti)
  const offsets = useMemo(() => centers.map((c, i) => {
    if (c == null || mouseX == null) return 0;
    let o = 0;
    for (let j = 0; j < centers.length; j++) {
      if (j === i || centers[j] == null) continue;
      const grow = (scales[j] - 1) * BASE / 2;
      o += c > centers[j] ? grow : -grow;
    }
    return o;
  }), [centers, scales, mouseX, BASE]);

  return (
    <div className="dock-wrap">
      <nav
        className="dock"
        aria-label="Asosiy menyu"
        onPointerMove={e => { if (e.pointerType !== 'touch') setMouseX(e.clientX); }}
        onPointerLeave={() => { setMouseX(null); setHover(null); }}
      >
        {items.map((it, i) => {
          const dx = offsets[i] || 0;

          if (it.kind === 'sep') {
            return <div key={`sep-${i}`} ref={el => (slotRefs.current[i] = el)}
              className="dock-sep" style={{ transform:`translateX(${dx}px)` }}/>;
          }

          const s      = scales[i];
          // cta ham faol bo'la oladi (ilova sayt ichida ochilgani uchun)
          const isOn   = (it.kind === 'nav' || it.kind === 'cta') && active === it.id;
          const grow   = (s - 1) * BASE;

          return (
            <div key={it.id} ref={el => (slotRefs.current[i] = el)}
              className="dock-slot" style={{ width:BASE, height:BASE }}>

              {hover === i && (
                <div className="dock-tip" style={{ marginBottom: 14 + grow }}>{it.tip}</div>
              )}

              <button
                type="button"
                title={it.tip}
                aria-label={it.tip}
                aria-current={isOn ? 'page' : undefined}
                className={`dock-btn${isOn && it.kind === 'nav' ? ' on' : ''}${it.kind === 'cta' ? ' cta' : ''}`}
                style={{
                  transform:`translateX(${dx}px) scale(${s})`,
                  // kattaroq ikonka har doim ustida turadi
                  zIndex: Math.round(s * 100),
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(h => (h === i ? null : h))}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(h => (h === i ? null : h))}
                onClick={() => onPick(it)}
              >
                <span className="dock-icon">{it.icon}</span>
              </button>

              {isOn && <span className="dock-dot"/>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

/* ── APP ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id:'landing',   label:'Bosh Sahifa' },
  { id:'surdo',     label:'Surdo Translator' },
  { id:'education', label:'Darslik'     },
  { id:'about',     label:'Haqimizda'   },
  { id:'contact',   label:"Bog'lanish"  },
];

export default function App() {
  const [page, setPage] = useState('landing');
  const [dark, setDark] = useState(false);   // standart — kunduzgi (light) rejim
  const [user, setUser] = useState(() => isLoggedIn() ? getUser() : null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const nav = (p) => { setPage(p); window.scrollTo({ top:0, behavior:'smooth' }); };
  const handleLogout = () => { logout(); setUser(null); setPage('landing'); };

  // Ilova saytning o'z ichida ochiladi — yangi oyna/tab emas.
  const openApp = () => nav('app');

  const dockItems = useMemo(() => ([
    { kind:'nav', id:'landing',   tip:'Bosh Sahifa',    icon:<IconHome/>   },
    { kind:'nav', id:'surdo',     tip:'Surdo Translator', icon:<IconSurdo/> },
    { kind:'nav', id:'education', tip:'Darslik',        icon:<IconBook/>   },
    { kind:'nav', id:'about',     tip:'Haqimizda',      icon:<IconSpark/>  },
    { kind:'nav', id:'contact',   tip:"Bog'lanish",     icon:<IconMail/>   },
    { kind:'sep' },
    { kind:'cta', id:'app',       tip:'Ilovani ochish', icon:<IconLaunch/> },
    { kind:'sep' },
    { kind:'act', id:'theme',     tip: dark ? 'Kunduzgi rejim' : 'Tungi rejim',
      icon: dark ? <IconSun/> : <IconMoon/> },
    { kind:'act', id:'logout',    tip:'Chiqish',        icon:<IconLogout/> },
  ]), [dark]);

  const onPick = (it) => {
    if (it.kind === 'nav')      nav(it.id);
    else if (it.id === 'app')   openApp();
    else if (it.id === 'theme') setDark(d => !d);
    else if (it.id === 'logout') handleLogout();
  };

  if (!user) {
    return (
      <div data-theme={dark ? 'dark' : 'light'}>
        <LoginPage onLogin={(u) => setUser(u)} />
      </div>
    );
  }

  const initial = (user.full_name || user.username || 'U')[0].toUpperCase();

  return (
    <div data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight:'100vh', position:'relative', transition:'background .35s' }}>

      {/* ── GLOBAL FON ── */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'var(--bg)', transition:'background .35s' }}/>
      <div className="aurora" aria-hidden="true"><i/><i/><i/></div>
      <div className="grid-veil" aria-hidden="true"/>
      {dark && (
        <div aria-hidden="true" style={{
          position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
          opacity:.26, /* matn o'qilishi uchun sezilarli darajada susaytirilgan */
        }}>
          <FloatingLines
            enabledWaves={['top','bottom']}
            lineCount={5}
            lineDistance={5}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={false}
            parallax={false}
            animationSpeed={0.7}
            linesGradient={['#10b981','#a3e635','#2dd4bf','#4ade80','#65a30d','#10b981']}
            mixBlendMode="screen"
          />
        </div>
      )}

      {/* ── TEPA: faqat brend + profil (menyu emas).
             Ilova ochilganda yashiriladi: aks holda nom ikki marta
             takrorlanadi va ilovaga joy qolmaydi. ── */}
      {page !== 'app' && <header className="topbar">
        <div className="glass-pill click" onClick={() => nav('landing')}
          role="button" tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && nav('landing')}>
          <div className="mark"><img src={LOGO_MARK} alt=""/></div>
          <div>
            <div className="wordmark">Surdo AI</div>
            <div className="wordmark-sub">IMO-ISHORA TILI · AI</div>
          </div>
        </div>

        <div className="glass-pill">
          <div style={{
            width:26, height:26, borderRadius:9, flexShrink:0,
            background:'linear-gradient(135deg,var(--acc-v),var(--acc2-v))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:11, fontWeight:800, color:'#04180f',
          }}>{initial}</div>
          <span style={{ fontSize:12.5, fontWeight:650, color:'var(--t2)' }}>
            {user.full_name || user.username}
          </span>
          <span style={{
            width:7, height:7, borderRadius:'50%', background:'var(--acc2-v)',
            boxShadow:'0 0 7px var(--acc2-v)', animation:'pulse 2.4s ease-in-out infinite',
          }}/>
        </div>
      </header>}

      {/* ── SAHIFALAR ── */}
      <main className={`page${page === 'app' ? ' is-app' : ''}`}>
        {page === 'surdo'     && <SurdoTranslatorPage/>}
        {page === 'landing'   && <LandingPage   navigateTo={nav} dark={dark} openApp={openApp}/>}
        {page === 'education' && <EducationPage navigateTo={nav} dark={dark} openApp={openApp}/>}
        {page === 'about'     && <AboutPage     navigateTo={nav} dark={dark}/>}
        {page === 'contact'   && <ContactPage   navigateTo={nav} dark={dark}/>}
        {page === 'app'       && <AppFrame      navigateTo={nav} user={user}/>}
      </main>

      {/* ── FOOTER (ilova ochiq bo'lganda ko'rsatilmaydi) ── */}
      {page !== 'app' && <footer style={{
        position:'relative', zIndex:1,
        borderTop:'1px solid var(--brd)',
        background:'var(--glass)',
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        padding:'26px 0 calc(var(--dock-h) + 8px)',
      }}>
        <div className="container" style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:18,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div className="mark" style={{ width:26, height:26 }}><img src={LOGO_MARK} alt=""/></div>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>Surdo AI</span>
            <span style={{ fontSize:12, color:'var(--t3)' }}>· O'zbek Imo-Ishora Tili AI · 2026</span>
          </div>

          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {NAV_ITEMS.slice(1).map(n => (
              <button key={n.id} onClick={() => nav(n.id)} style={{
                background:'none', border:'none', cursor:'pointer',
                padding:'5px 10px', borderRadius:8,
                fontSize:12.5, fontWeight:600, color:'var(--t3)',
                fontFamily:'var(--font)', transition:'color .2s,background .2s',
              }}
                onMouseOver={e => { e.currentTarget.style.color='var(--acc)'; e.currentTarget.style.background='var(--surf3)'; }}
                onMouseOut={e  => { e.currentTarget.style.color='var(--t3)';  e.currentTarget.style.background='none'; }}>
                {n.label}
              </button>
            ))}
          </div>

          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['Darslik','Tarjimon','Mashq','MediaPipe AI'].map(t => (
              <span key={t} style={{
                padding:'3px 11px', borderRadius:100, fontSize:10, fontWeight:700,
                background:'var(--surf2)', border:'1px solid var(--brd)', color:'var(--t3)',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>}

      {/* ── PASTKI DOK MENYU ── */}
      <Dock items={dockItems} active={page} onPick={onPick}/>
    </div>
  );
}
