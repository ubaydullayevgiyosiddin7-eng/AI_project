// LandingPage.jsx — SignHand AI Imo-Ishora Tili Platformasi
import React from 'react';
import BorderGlow from './BorderGlow';

export default function LandingPage({ navigateTo, dark, openApp }) {
  const t1 = dark ? '#f0f6ff' : '#0f172a';
  const t2 = dark ? 'rgba(196,220,255,.85)' : '#374151';
  const t3 = dark ? 'rgba(148,180,220,.65)' : '#94a3b8';
  const border = dark ? 'rgba(99,180,255,.2)' : '#cbd5e1';
  const cardBg = dark ? 'rgba(4,14,36,.82)' : '#ffffff';

  const FEATURES = [
    { icon:'🖐️', t:'29 ta Daktil Harfi', d:'O\'zbek imo-ishora alifbosining barcha 29 ta harfini bosqichma-bosqich o\'rganing — statik va harakatli.', c:'#0ea5e9', g:'200 80 80' },
    { icon:'📷', t:'Real-Time Tanish', d:'MediaPipe AI texnologiyasi qo\'l va yuz harakatlarini sekundiga 30 marta tahlil qilib, harfni darrov aniqlaydi.', c:'#0c4a6e', g:'210 75 30' },
    { icon:'💬', t:'Jonli Tarjimon', d:'Qo\'l harakatlaringizni real vaqtda matnga aylantiradi va o\'zbek tilida ovoz bilan o\'qib beradi.', c:'#16a34a', g:'140 70 45' },
    { icon:'👤', t:'Yuz Grammatikasi', d:'Qoshlar ko\'tarilsa savol belgisi, pastga tushsa inkor — yuz mimikasi ham gap qismi.', c:'#f59e0b', g:'45 90 70' },
    { icon:'📚', t:'24 ta Dars', d:'Bosqichli dars rejasi: oddiy harflardan boshlab, harakatli harflar, so\'zlar va gaplargacha.', c:'#a855f7', g:'270 75 68' },
    { icon:'🏆', t:'Sertifikat va XP', d:'Har bir bosqichni tugatganda XP, daraja va sertifikat olasiz. Geymifikatsiya bilan o\'rgatish.', c:'#ef4444', g:'0 85 65' },
  ];

  const STATS = [
    { n:'29',    l:'Daktil harflari' },
    { n:'24',    l:'Bosqichli dars'   },
    { n:'85%',   l:'Aniqlik darajasi' },
    { n:'AI',    l:"MediaPipe + GPT"  },
  ];

  return (
    <div style={{ padding:'0 0 80px', minHeight:'100vh' }}>

      {/* ── HERO ── */}
      <section style={{ padding:'80px clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:40, flexWrap:'wrap' }}>

          {/* Chap: matn */}
          <div style={{ maxWidth:580, flex:'1 1 400px' }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'5px 14px', borderRadius:100, marginBottom:28,
              background: dark?'rgba(16,185,129,.14)':'rgba(16,185,129,.08)',
              border:`1px solid ${dark?'rgba(16,185,129,.45)':'rgba(16,185,129,.3)'}`,
              fontFamily:'monospace', fontSize:10, fontWeight:800,
              letterSpacing:'.16em', textTransform:'uppercase',
              color: dark?'#34d399':'#059669',
            }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 6px #10b981' }}/>
              O'zbek Imo-Ishora Tili AI Platformasi
            </div>

            <div style={{
              background: dark?'rgba(2,11,26,.65)':'#fff',
              backdropFilter: dark?'blur(16px)':'none',
              borderRadius:20, padding:'28px 30px',
              border:`1px solid ${dark?'rgba(56,189,248,.28)':border}`,
              boxShadow: dark?'0 8px 32px rgba(0,0,0,.3)':'0 4px 20px rgba(14,165,233,.08)',
              marginBottom:36,
            }}>
              <h1 style={{
                fontFamily:"'Space Grotesk',sans-serif",
                fontSize:'clamp(32px,4.2vw,58px)', fontWeight:900,
                lineHeight:1.08, letterSpacing:'-.04em',
                color:t1, marginBottom:16,
              }}>
                Imo-ishora tilini{' '}
                <span style={{
                  background:'linear-gradient(135deg,#0ea5e9,#0c4a6e)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>
                  AI yordamida
                </span>
                {" "}o'rganing
              </h1>
              <p style={{ fontSize:'clamp(14px,1.3vw,17px)', lineHeight:1.82, color:t2, margin:0 }}>
                O'zbek daktil alifbosining 29 ta harfini bosqichma-bosqich o'rganing.
                Real vaqtda qo'l va yuz harakatlarini matnga aylantiruvchi tarjimon —
                kar-soqovlar bilan muloqotni osonlashtiradi.
              </p>
            </div>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:40 }}>
              <button onClick={() => openApp && openApp('app')} className="btn btn-p btn-lg">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ilovani ochish
                </span>
              </button>
              <button onClick={() => navigateTo('about')} style={{
                padding:'14px 28px', borderRadius:12,
                background: dark?'rgba(255,255,255,.06)':'#fff',
                border:`1.5px solid ${border}`,
                color:t1, fontSize:15, fontWeight:600,
                cursor:'pointer', transition:'all .2s',
              }}
                onMouseOver={e => e.currentTarget.style.background=dark?'rgba(99,102,241,.15)':'#f5f3ff'}
                onMouseOut={e  => e.currentTarget.style.background=dark?'rgba(255,255,255,.06)':'#fff'}>
                Batafsil →
              </button>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
              {STATS.map(s => (
                <div key={s.l}>
                  <div style={{ fontSize:26, fontWeight:900, color:dark?'#38bdf8':'#0ea5e9', fontFamily:"'Space Grotesk',sans-serif", letterSpacing:'-.03em' }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize:11, color:t3, fontWeight:600, letterSpacing:'.04em' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* O'ng: orb */}
          <div style={{ flex:'0 0 380px', height:420, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {/* Orb */}
            <div style={{
              width:180, height:180, borderRadius:'50%', zIndex:3, position:'relative',
              background:'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.9), rgba(99,102,241,0.8))',
              boxShadow:'0 0 80px rgba(56,189,248,.4), inset 0 0 40px rgba(255,255,255,.3)',
              border:'1px solid rgba(255,255,255,.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <span style={{ fontSize:64, filter:'drop-shadow(0 0 12px rgba(255,255,255,.5))' }}>🧬</span>
            </div>

            {/* Halqalar */}
            <div style={{ position:'absolute', width:320, height:320, border:'1.5px solid rgba(56,189,248,.25)', borderRadius:'50%' }}/>
            <div style={{ position:'absolute', width:360, height:360, border:'1px dashed rgba(99,102,241,.3)', borderRadius:'50%' }}/>

            {/* Ikonkalar — sekin aylanuvchan orbit */}
            <style>{`
              @keyframes orb-cw  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
              @keyframes orb-ccw { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
            `}</style>
            <div style={{
              position:'absolute', width:320, height:320,
              animation:'orb-cw 60s linear infinite',
            }}>
              {[
                { e:'✋', l:"Qo'l", top:'0%',   left:'50%' },
                { e:'👤', l:'Yuz',  top:'20%',  left:'93%' },
                { e:'💬', l:'Matn', top:'73%',  left:'93%' },
                { e:'🖐️', l:"Qo'l", top:'100%', left:'50%' },
                { e:'🤖', l:'AI',   top:'73%',  left:'7%'  },
                { e:'🔊', l:'Ovoz', top:'20%',  left:'7%'  },
              ].map((item, i) => (
                <div key={i} style={{
                  position:'absolute', top:item.top, left:item.left,
                  transform:'translate(-50%,-50%)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                  animation:'orb-ccw 60s linear infinite',
                }}>
                  <div style={{
                    width:44, height:44, borderRadius:12,
                    background: dark?'rgba(255,255,255,.1)':'rgba(255,255,255,.9)',
                    backdropFilter:'blur(10px)',
                    border:`1px solid ${dark?'rgba(255,255,255,.2)':'rgba(14,165,233,.2)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:20, boxShadow:'0 4px 14px rgba(0,0,0,.2)',
                  }}>{item.e}</div>
                  <span style={{
                    fontSize:8, fontWeight:800, letterSpacing:'.5px',
                    background: dark?'rgba(0,0,0,.5)':'rgba(0,0,0,.7)',
                    color:'#fff', padding:'3px 8px', borderRadius:8,
                    whiteSpace:'nowrap',
                  }}>{item.l}</span>
                </div>
              ))}
            </div>          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 60px', maxWidth:1280, margin:'0 auto' }}>
        <h2 style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:'clamp(24px,2.8vw,36px)', fontWeight:900,
          color:t1, marginBottom:8, letterSpacing:'-.03em',
          textShadow: dark?'0 0 30px rgba(56,189,248,.2)':'none',
        }}>Imkoniyatlar</h2>
        <p style={{ fontSize:15, color:t2, marginBottom:36 }}>Ilg'or texnologiyalar bilan boyitilgan ta'lim tajribasi</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {FEATURES.map(f => (
            <BorderGlow key={f.t} backgroundColor={cardBg} glowColor={f.g}
              borderRadius={18} glowRadius={48} glowIntensity={1.3} coneSpread={30}
              colors={[f.c,'#818cf8','#38bdf8']}>
              <div style={{ padding:'26px 24px' }}>
                <div style={{
                  width:50, height:50, borderRadius:14, marginBottom:18,
                  background:`${f.c}1a`, border:`1.5px solid ${f.c}33`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                }}>{f.icon}</div>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:17, fontWeight:800, color:t1, marginBottom:10 }}>{f.t}</h3>
                <p style={{ fontSize:13.5, color:t2, lineHeight:1.72 }}>{f.d}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'0 clamp(24px,5vw,80px) 20px', maxWidth:1280, margin:'0 auto', textAlign:'center' }}>
        <BorderGlow backgroundColor={cardBg} glowColor="200 80 75"
          borderRadius={24} glowRadius={60} glowIntensity={1.4} coneSpread={40}
          colors={['#0ea5e9','#6366f1','#10b981']}>
          <div style={{ padding:'48px 40px' }}>
            <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(28px,3vw,40px)', fontWeight:900, color:t1, marginBottom:14, letterSpacing:'-.03em' }}>
              Imo-Ishorani Bugun O'rganing
            </h2>
            <p style={{ fontSize:15, color:t2, marginBottom:32, maxWidth:480, margin:'0 auto 32px' }}>
              Sun'iy intellekt va MediaPipe AI bilan o'zbek imo-ishora tilini o'rganing.
              Mashq qiling, tarjima qiling, ovozda eshiting.
            </p>
            <button onClick={() => openApp && openApp('app')} className="btn btn-p btn-lg">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3l14 9-14 9V3z" fill="white"/>
                </svg>
                Ilovani Ochish
              </span>
            </button>
          </div>
        </BorderGlow>
      </section>
    </div>
  );
}