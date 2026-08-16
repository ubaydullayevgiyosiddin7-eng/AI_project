// AboutPage.jsx — Loyiha haqida
import React from 'react';
import BorderGlow from './BorderGlow';

const TECH = [
  { icon:'🤖', n:'MediaPipe Holistic', d:"Google AI: qo'l (21 nuqta), yuz (468 nuqta) va tana — brauzerda real-time", c:'#10b981', g:'160 78 58' },
  { icon:'🧠', n:'Decision Tree',      d:'Har harf uchun aniq qoidalar (signature + orientation + contacts)',           c:'#2dd4bf', g:'172 72 62' },
  { icon:'⚛️', n:'React 18 + Vite',    d:'Modern frontend — komponent-asoslangan UI, tez build',                        c:'#a3e635', g:'82 78 62'  },
  { icon:'🎯', n:'Soft Scoring',       d:'Yumshoq aniqlash — barmoq holatlari uchun uzluksiz ball (0-1)',               c:'#34d399', g:'160 70 66' },
  { icon:'🎤', n:'Web Speech API',     d:"O'zbek tilida ovozli o'qish — brauzer nativ texnologiya",                     c:'#84cc16', g:'80 78 56'  },
  { icon:'⚡', n:'Client-Side',        d:'Server kerak emas — hammasi foydalanuvchi brauzerida ishlaydi',               c:'#059669', g:'162 80 48' },
];

const CARDS = [
  { icon:'🎯', t:'Maqsad',      d:"O'zbek imo-ishora tilini sun'iy intellekt yordamida o'rgatish. Kar-soqovlar bilan muloqotni osonlashtirish — 15-20 ming o'zbek aholisi uchun yangi imkoniyat.", color:'#10b981', glow:'160 78 58' },
  { icon:'🔬', t:'Yondashuv',   d:'29 ta daktil harfi uchun aniq qoidalar yozilgan. Yuz mimikasi grammatika rolini bajaradi (savol, inkor). 24 bosqichli dars + erkin tarjimon.', color:'#2dd4bf', glow:'172 72 62' },
  { icon:'⚡', t:'Texnologiya', d:"MediaPipe Holistic AI + Decision Tree classifier + soft scoring. Brauzerda to'liq ishlaydi — server kerak emas.", color:'#a3e635', glow:'82 78 62' },
  { icon:'🛡️', t:'Xavfsizlik',  d:"Barcha ma'lumotlar foydalanuvchi brauzerida saqlanadi. Kamera faqat tahlil uchun — hech qanday video yozib olinmaydi yoki yuborilmaydi.", color:'#22c55e', glow:'142 70 55' },
];

const PIPELINE = [
  { n:'01', icon:'📷', t:'Kamera oqimi',      d:"Brauzer kamerasi ochiladi. Video kadr hech qayerga yuborilmaydi — barchasi qurilmangizda qoladi.", c:'#10b981' },
  { n:'02', icon:'🕸️', t:'Nuqtalar aniqlanadi', d:'MediaPipe Holistic har kadrda 21 ta qo\'l va 468 ta yuz nuqtasini chiqaradi.',                    c:'#2dd4bf' },
  { n:'03', icon:'🧮', t:'Harf tasniflanadi',  d:'Barmoq holati, kaft yo\'nalishi va kontaktlar bo\'yicha soft scoring — eng mos harf tanlanadi.',    c:'#a3e635' },
  { n:'04', icon:'🔊', t:'Matn va ovoz',       d:"Aniqlangan harflar so'zga birikadi va Web Speech API o'zbek tilida o'qib beradi.",                 c:'#84cc16' },
];

const STATS = [
  { n:'29',  l:'Daktil harflari', c:'#10b981' },
  { n:'21',  l:"Qo'l nuqtasi",    c:'#2dd4bf' },
  { n:'468', l:'Yuz nuqtasi',     c:'#a3e635' },
  { n:'30',  l:'FPS real-time',   c:'#84cc16' },
];

export default function AboutPage({ navigateTo, dark }) {
  const cardBg = dark ? 'rgba(7,26,19,.9)' : '#ffffff';
  const t1 = 'var(--t1)', t2 = 'var(--t2)', t3 = 'var(--t3)';

  return (
    <div>
      <style>{'@keyframes count-up{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}'}</style>

      {/* ── HERO ── */}
      <section style={{ padding:'52px clamp(20px,5vw,72px) 52px', maxWidth:1240, margin:'0 auto' }}>
        <div style={{
          borderRadius:26, overflow:'hidden', position:'relative',
          background:'var(--glass)', backdropFilter:'blur(18px) saturate(160%)',
          border:'1px solid var(--brd2)',
          boxShadow:'var(--sh-lg)',
          padding:'50px clamp(26px,4vw,60px)',
        }}>
          <div aria-hidden="true" style={{ position:'absolute', top:-70, left:-70, width:290, height:290, borderRadius:'50%', background:'rgba(16,185,129,.22)', filter:'blur(64px)', pointerEvents:'none' }}/>
          <div aria-hidden="true" style={{ position:'absolute', bottom:-50, right:-50, width:230, height:230, borderRadius:'50%', background:'rgba(163,230,53,.18)', filter:'blur(56px)', pointerEvents:'none' }}/>

          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:40, flexWrap:'wrap' }}>
            <div style={{ flex:'1 1 360px' }}>
              <div className="chip" style={{ marginBottom:24 }}>
                <span className="dot"/> Loyiha haqida
              </div>

              <h1 style={{
                fontFamily:'var(--font-d)', fontSize:'clamp(36px,4.8vw,66px)', fontWeight:800,
                lineHeight:1.04, letterSpacing:'-.05em', color:t1, marginBottom:6,
              }}>Surdo AI</h1>
              <h1 className="grad-text" style={{
                fontFamily:'var(--font-d)', fontSize:'clamp(36px,4.8vw,66px)', fontWeight:800,
                lineHeight:1.04, letterSpacing:'-.05em', marginBottom:24,
              }}>Imo-Ishora Tili AI</h1>

              <p style={{ fontSize:'clamp(15px,1.3vw,17.5px)', lineHeight:1.85, color:t2, maxWidth:490, marginBottom:26 }}>
                O'zbek daktil alifbosini AI yordamida o'rgatuvchi platforma.
                MediaPipe AI qo'l va yuz harakatlarini real vaqtda taniydi.
                Kar-soqovlar bilan muloqotni osonlashtiradi.
              </p>

              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['MediaPipe AI','29 Harf','Tarjimon','Yuz Grammatika','Bepul'].map(b => (
                  <span key={b} style={{
                    padding:'6px 15px', borderRadius:100, fontSize:12, fontWeight:700,
                    background:'var(--surf2)', border:'1px solid var(--brd2)', color:'var(--t2)',
                  }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Statistika */}
            <div style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', gap:12, minWidth:214 }}>
              {STATS.map((s,i) => (
                <div key={s.l} style={{
                  padding:'15px 22px', borderRadius:15,
                  background:'var(--surf2)', border:`1px solid ${s.c}33`,
                  display:'flex', alignItems:'center', gap:14,
                  animation:`count-up .5s ${i*.09}s both`,
                }}>
                  <div style={{
                    fontSize:27, fontWeight:800, color:s.c, minWidth:58,
                    fontFamily:'var(--font-d)', letterSpacing:'-.04em',
                    textShadow: dark ? `0 0 22px ${s.c}77` : 'none',
                  }}>{s.n}</div>
                  <div style={{ fontSize:12, color:t3, fontWeight:700 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ASOSLAR ── */}
      <section className="sec">
        <div className="sec-head"><h2>Platformaning asoslari</h2><div className="rule"/></div>
        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:18 }}>
          {CARDS.map(c => (
            <BorderGlow key={c.t} backgroundColor={cardBg} glowColor={c.glow}
              borderRadius={20} glowRadius={55} glowIntensity={1.6} coneSpread={38}
              colors={[c.color,'#a3e635','#2dd4bf']}>
              <div style={{ padding:'34px 32px' }}>
                <div style={{
                  width:58, height:58, borderRadius:16, marginBottom:20,
                  background:`${c.color}20`, border:`2px solid ${c.color}4d`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:28,
                  boxShadow: dark ? `0 0 26px ${c.color}33` : 'none',
                }}>{c.icon}</div>
                <h3 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:800, color:t1, marginBottom:13, letterSpacing:'-.035em' }}>{c.t}</h3>
                <p style={{ fontSize:14.5, color:t2, lineHeight:1.82 }}>{c.d}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── QANDAY ISHLAYDI ── */}
      <section className="sec">
        <div className="sec-head"><h2>Qanday ishlaydi</h2><div className="rule"/></div>
        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {PIPELINE.map((p, i) => (
            <div key={p.n} style={{
              position:'relative', padding:'26px 22px', borderRadius:18,
              background:'var(--surf2)', border:'1px solid var(--brd)',
              animation:`count-up .5s ${i*.08}s both`,
            }}>
              {/* bog'lovchi chiziq */}
              {i < PIPELINE.length - 1 && (
                <div aria-hidden="true" style={{
                  position:'absolute', top:44, right:-14, width:14, height:2, zIndex:2,
                  background:`linear-gradient(90deg,${p.c},transparent)`,
                }}/>
              )}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{
                  width:46, height:46, borderRadius:14, fontSize:21,
                  background:`${p.c}1f`, border:`1.5px solid ${p.c}4d`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{p.icon}</div>
                <span style={{
                  fontFamily:'var(--font-d)', fontSize:26, fontWeight:800,
                  color:`${p.c}`, opacity:.32, letterSpacing:'-.05em',
                }}>{p.n}</span>
              </div>
              <div style={{ fontFamily:'var(--font-d)', fontSize:15.5, fontWeight:800, color:t1, marginBottom:8 }}>{p.t}</div>
              <p style={{ fontSize:12.8, color:t2, lineHeight:1.7 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEXNOLOGIYA STEKI ── */}
      <section className="sec">
        <div className="sec-head"><h2>Texnologiya steki</h2><div className="rule"/></div>
        <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {TECH.map(t => (
            <BorderGlow key={t.n} backgroundColor={cardBg} glowColor={t.g}
              borderRadius={16} glowRadius={46} glowIntensity={1.45} coneSpread={32}
              colors={[t.c,'#a3e635','#2dd4bf']}>
              <div style={{ padding:'24px 22px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{
                  width:52, height:52, borderRadius:14, flexShrink:0,
                  background:`${t.c}20`, border:`2px solid ${t.c}47`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                  boxShadow: dark ? `0 0 22px ${t.c}30` : 'none',
                }}>{t.icon}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-d)', fontWeight:800, fontSize:16, color:t1, marginBottom:5 }}>{t.n}</div>
                  <div style={{ fontSize:12.5, color:t2, lineHeight:1.62 }}>{t.d}</div>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div style={{ textAlign:'center', padding:'8px 0 28px' }}>
        <button onClick={() => navigateTo('education')} className="btn btn-p btn-lg">
          <span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5.2A2.2 2.2 0 0 1 5.2 3H10a2 2 0 0 1 2 2v15a1.7 1.7 0 0 0-1.7-1.7H3z"/>
              <path d="M21 5.2A2.2 2.2 0 0 0 18.8 3H14a2 2 0 0 0-2 2v15a1.7 1.7 0 0 1 1.7-1.7H21z"/>
            </svg>
            Ta'limni Boshlash →
          </span>
        </button>
      </div>
    </div>
  );
}
