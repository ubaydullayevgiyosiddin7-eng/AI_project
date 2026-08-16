// LandingPage.jsx — Surdo AI Imo-Ishora Tili Platformasi
import React from 'react';
import BorderGlow from './BorderGlow';
import HandModel  from './HandModel';

export default function LandingPage({ navigateTo, dark, openApp }) {
  const t1     = 'var(--t1)';
  const t2     = 'var(--t2)';
  const t3     = 'var(--t3)';
  const cardBg = dark ? 'rgba(7,26,19,.88)' : '#ffffff';

  const FEATURES = [
    { icon:'🖐️', t:'29 ta Daktil Harfi', d:"O'zbek imo-ishora alifbosining barcha 29 ta harfini bosqichma-bosqich o'rganing — statik va harakatli.", c:'#10b981', g:'160 78 58' },
    { icon:'📷', t:'Real-Time Tanish',   d:'MediaPipe AI texnologiyasi qo\'l va yuz harakatlarini sekundiga 30 marta tahlil qilib, harfni darrov aniqlaydi.', c:'#2dd4bf', g:'172 72 62' },
    { icon:'💬', t:'Jonli Tarjimon',     d:"Qo'l harakatlaringizni real vaqtda matnga aylantiradi va o'zbek tilida ovoz bilan o'qib beradi.", c:'#a3e635', g:'82 78 62' },
    { icon:'👤', t:'Yuz Grammatikasi',   d:"Qoshlar ko'tarilsa savol belgisi, pastga tushsa inkor — yuz mimikasi ham gap qismi.", c:'#34d399', g:'160 70 66' },
    { icon:'📚', t:'24 ta Dars',         d:"Bosqichli dars rejasi: oddiy harflardan boshlab, harakatli harflar, so'zlar va gaplargacha.", c:'#84cc16', g:'80 78 56' },
    { icon:'🏆', t:'Sertifikat va XP',   d:'Har bir bosqichni tugatganda XP, daraja va sertifikat olasiz. Geymifikatsiya bilan o\'rgatish.', c:'#059669', g:'162 80 48' },
  ];

  const STATS = [
    { n:'29',  l:'Daktil harflari'  },
    { n:'24',  l:'Bosqichli dars'   },
    { n:'85%', l:'Aniqlik darajasi' },
    { n:'AI',  l:'MediaPipe + GPT'  },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ padding:'56px clamp(20px,5vw,72px) 60px', maxWidth:1240, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:44, flexWrap:'wrap' }}>

          {/* Chap: matn */}
          <div style={{ maxWidth:600, flex:'1 1 400px' }}>
            <div className="chip a-su d0" style={{ marginBottom:26 }}>
              <span className="dot"/>
              O'zbek Imo-Ishora Tili AI Platformasi
            </div>

            <h1 className="a-su d1" style={{
              fontFamily:'var(--font-d)',
              fontSize:'clamp(34px,4.6vw,62px)', fontWeight:800,
              lineHeight:1.06, letterSpacing:'-.045em',
              color:t1, marginBottom:20,
            }}>
              Imo-ishora tilini{' '}
              <span className="grad-text">AI yordamida</span>{' '}
              o'rganing
            </h1>

            <p className="a-su d2" style={{
              fontSize:'clamp(14.5px,1.3vw,17px)', lineHeight:1.85, color:t2,
              maxWidth:530, marginBottom:34,
            }}>
              O'zbek daktil alifbosining 29 ta harfini bosqichma-bosqich o'rganing.
              Real vaqtda qo'l va yuz harakatlarini matnga aylantiruvchi tarjimon —
              eshitish va nutqda nuqsoni borlar bilan muloqotni osonlashtiradi.
            </p>

            <div className="a-su d3" style={{ display:'flex', gap:13, flexWrap:'wrap', marginBottom:42 }}>
              <button onClick={() => openApp && openApp('app')} className="btn btn-p btn-lg">
                <span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3.4h6.6V10"/><path d="M20.6 3.4 11.4 12.6"/>
                    <path d="M18.4 13.5V19a1.9 1.9 0 0 1-1.9 1.9H5A1.9 1.9 0 0 1 3.1 19V7.5A1.9 1.9 0 0 1 5 5.6h5.5"/>
                  </svg>
                  Ilovani ochish
                </span>
              </button>
              <button onClick={() => navigateTo('about')} className="btn btn-g btn-lg">
                Batafsil →
              </button>
            </div>

            {/* Statistika */}
            <div className="a-su d4" style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              {STATS.map(s => (
                <div key={s.l} style={{
                  padding:'13px 20px', borderRadius:14, minWidth:120,
                  background:'var(--surf2)', border:'1px solid var(--brd)',
                }}>
                  <div className="grad-text" style={{
                    fontSize:27, fontWeight:800, fontFamily:'var(--font-d)', letterSpacing:'-.04em',
                  }}>{s.n}</div>
                  <div style={{ fontSize:11, color:t3, fontWeight:700, letterSpacing:'.05em', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* O'ng: sichqonchaga ergashuvchi 3D qo'l */}
          <HandModel dark={dark}/>
        </div>
      </section>

      {/* ── IMKONIYATLAR ── */}
      <section className="sec">
        <div className="sec-head">
          <h2>Imkoniyatlar</h2>
          <div className="rule"/>
        </div>
        <p style={{ fontSize:15, color:t2, marginTop:-18, marginBottom:32 }}>
          Ilg'or texnologiyalar bilan boyitilgan ta'lim tajribasi
        </p>

        <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {FEATURES.map(f => (
            <BorderGlow key={f.t} backgroundColor={cardBg} glowColor={f.g}
              borderRadius={18} glowRadius={48} glowIntensity={1.3} coneSpread={30}
              colors={[f.c,'#a3e635','#2dd4bf']}>
              <div style={{ padding:'26px 24px' }}>
                <div style={{
                  width:50, height:50, borderRadius:14, marginBottom:18,
                  background:`${f.c}1f`, border:`1.5px solid ${f.c}44`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                  boxShadow:dark ? `0 0 22px ${f.c}2e` : 'none',
                }}>{f.icon}</div>
                <h3 style={{ fontFamily:'var(--font-d)', fontSize:17.5, fontWeight:800, color:t1, marginBottom:10 }}>{f.t}</h3>
                <p style={{ fontSize:13.5, color:t2, lineHeight:1.75 }}>{f.d}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec" style={{ textAlign:'center', paddingBottom:28 }}>
        <BorderGlow backgroundColor={cardBg} glowColor="160 78 58"
          borderRadius={24} glowRadius={60} glowIntensity={1.4} coneSpread={40}
          colors={['#10b981','#a3e635','#2dd4bf']}>
          <div style={{ padding:'52px 40px' }}>
            <h2 style={{
              fontFamily:'var(--font-d)', fontSize:'clamp(27px,3vw,40px)', fontWeight:800,
              color:t1, marginBottom:14, letterSpacing:'-.04em',
            }}>
              Imo-Ishorani Bugun O'rganing
            </h2>
            <p style={{ fontSize:15, color:t2, lineHeight:1.75, maxWidth:500, margin:'0 auto 32px' }}>
              Sun'iy intellekt va MediaPipe AI bilan o'zbek imo-ishora tilini o'rganing.
              Mashq qiling, tarjima qiling, ovozda eshiting.
            </p>
            <button onClick={() => openApp && openApp('app')} className="btn btn-p btn-lg">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 3.5l13 8.5-13 8.5V3.5z"/>
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
