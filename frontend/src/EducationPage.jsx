// EducationPage.jsx — Darslik: asosiy kurs, o'quv yo'li va kelgusi modullar
import React, { useState } from 'react';
import BorderGlow from './BorderGlow';

// O'zbek daktil alifbosi — 29 harf
const ALPHABET = ['A','B','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','Z',"O'","G'",'Sh','Ch','Ng'];

// O'quv yo'li — ilovadagi darslarning bosqichlari
const PATH = [
  {
    n: '01', c: '#10b981', icon: '✋',
    title: 'Statik harflar',
    sub: "Qo'l qimirlamaydi — faqat barmoq shakli",
    lessons: ['A, B, E', 'I, L, O', 'V, U, Sh', 'Ch, F, G', 'M, N, R, S, T, X'],
  },
  {
    n: '02', c: '#2dd4bf', icon: '🔄',
    title: 'Harakatli harflar',
    sub: "Kaft yo'nalishi va qo'l harakati qo'shiladi",
    lessons: ['P, Q — kaft pastga', 'D, K — oddiy harakat', 'H, Y, J — egri chiziq', 'Z — zigzag', "O' — halqa"],
  },
  {
    n: '03', c: '#a3e635', icon: '💬',
    title: "So'z va iboralar",
    sub: "Harflardan ma'noli birikmalarga o'tish",
    lessons: ['Salomlashish', "Oila a'zolari", 'Tasdiq va inkor', 'Raqamlar 1-5', 'Olmoshlar: Men, Sen'],
  },
  {
    n: '04', c: '#84cc16', icon: '🏆',
    title: 'Sinov va sertifikat',
    sub: 'Bilimni tekshirish, XP va daraja',
    lessons: ['Statik alifbo bilimdoni', 'Alifbo ustasi'],
  },
];

const SOON = [
  { icon: '📖', label: "Kengaytirilgan lug'at", desc: "500+ kundalik so'z: ranglar, kunlar, kasblar, ovqatlar.", c: '#2dd4bf' },
  { icon: '📝', label: 'Gap tuzish',            desc: 'Savol, inkor va tasdiq jumlalari yuz mimikasi orqali.', c: '#a3e635' },
  { icon: '👥', label: 'Jonli suhbat',          desc: 'Kar-soqovlar bilan muloqot uchun amaliy modullar.',     c: '#22c55e' },
];

export default function EducationPage({ navigateTo, dark, openApp }) {
  const [hoverStage, setHoverStage] = useState(null);
  const t1 = 'var(--t1)', t2 = 'var(--t2)', t3 = 'var(--t3)';
  const cardBg = dark ? 'rgba(7,26,19,.88)' : '#ffffff';

  // Ilova saytning o'z ichida ochiladi — yangi tab emas
  const start = () => openApp && openApp('app');
  const totalLessons = PATH.reduce((s, p) => s + p.lessons.length, 0);

  return (
    <div>
      {/* ══ HERO ══ */}
      <section style={{ padding:'52px clamp(20px,5vw,72px) 40px', maxWidth:1240, margin:'0 auto' }}>
        <div className="chip a-su d0" style={{ marginBottom:24 }}>
          <span className="dot"/> Ta'lim markazi
        </div>
        <h1 className="a-su d1" style={{
          fontFamily:'var(--font-d)', fontSize:'clamp(34px,4.6vw,58px)', fontWeight:800,
          lineHeight:1.06, letterSpacing:'-.045em', color:t1, marginBottom:18, maxWidth:760,
        }}>
          Noldan <span className="grad-text">alifbo ustasi</span> darajasigacha
        </h1>
        <p className="a-su d2" style={{ fontSize:'clamp(14.5px,1.4vw,17px)', lineHeight:1.8, color:t2, maxWidth:620, marginBottom:28 }}>
          {totalLessons} ta bosqichli dars, {ALPHABET.length} ta daktil harfi va real-time tekshiruv.
          Har bir harfni kamera orqali mashq qilasiz — AI to'g'ri bajarganingizni darrov aytadi.
        </p>
        <div className="a-su d3" style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          {[
            { n: ALPHABET.length, l: 'Daktil harfi' },
            { n: totalLessons,    l: 'Bosqichli dars' },
            { n: PATH.length,     l: "O'quv bosqichi" },
            { n: '∞',             l: 'Mashq — bepul' },
          ].map(s => (
            <div key={s.l} style={{
              padding:'12px 20px', borderRadius:14, minWidth:118,
              background:'var(--surf2)', border:'1px solid var(--brd)',
            }}>
              <div className="grad-text" style={{ fontSize:24, fontWeight:800, fontFamily:'var(--font-d)', letterSpacing:'-.04em' }}>{s.n}</div>
              <div style={{ fontSize:11, color:t3, fontWeight:700, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ ASOSIY KURS ══ */}
      <section className="sec" style={{ paddingBottom:52 }}>
        <BorderGlow backgroundColor={cardBg} glowColor="160 78 58"
          borderRadius={24} glowRadius={58} glowIntensity={1.5} coneSpread={40}
          colors={['#10b981','#4ade80','#a3e635']}>
          <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1.15fr .85fr', gap:0 }}>

            {/* Chap — kurs tavsifi */}
            <div style={{ padding:'40px clamp(26px,3vw,40px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
                <div style={{
                  width:60, height:60, borderRadius:18, flexShrink:0, fontSize:28,
                  background:'rgba(16,185,129,.16)', border:'2px solid rgba(16,185,129,.4)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 26px rgba(16,185,129,.28)',
                }}>🖐️</div>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:t1, fontFamily:'var(--font-d)', letterSpacing:'-.035em' }}>
                    O'zbek Daktil Alifbosi
                  </div>
                  <div style={{ fontSize:11.5, fontWeight:800, color:'var(--acc)', letterSpacing:'.1em', textTransform:'uppercase', marginTop:3 }}>
                    Asosiy kurs · Boshlang'ich daraja
                  </div>
                </div>
                <span style={{
                  marginLeft:'auto', display:'flex', alignItems:'center', gap:6,
                  padding:'5px 13px', borderRadius:100, whiteSpace:'nowrap',
                  background:'var(--ok-bg)', border:'1.5px solid var(--ok-b)',
                  fontSize:10.5, fontWeight:800, color:'var(--ok)', letterSpacing:'.08em',
                }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--ok)', animation:'pulse 2s ease-in-out infinite' }}/>
                  FAOL
                </span>
              </div>

              <p style={{ fontSize:14.5, color:t2, lineHeight:1.78, marginBottom:22 }}>
                MediaPipe AI qo'lingizning 21 ta va yuzingizning 468 ta nuqtasini kuzatadi.
                Har bir harfni ko'rsatganingizda tizim uni tanib, to'g'riligini baholaydi —
                o'qituvchisiz, mustaqil mashq qilasiz.
              </p>

              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:28 }}>
                {['Real-time tekshiruv','Yuz mimikasi grammatikasi','Ovozli tarjimon','XP va daraja','Sertifikat'].map(f => (
                  <span key={f} style={{
                    padding:'6px 13px', borderRadius:100, fontSize:11.5, fontWeight:700,
                    background:'var(--surf2)', border:'1px solid var(--brd2)', color:t2,
                  }}>{f}</span>
                ))}
              </div>

              <div style={{ display:'flex', gap:11, flexWrap:'wrap' }}>
                <button onClick={start} className="btn btn-p btn-lg">
                  <span>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 3.5l13 8.5-13 8.5V3.5z"/>
                    </svg>
                    Darsni boshlash
                  </span>
                </button>
                <button onClick={() => navigateTo('about')} className="btn btn-g btn-lg">
                  Qanday ishlaydi?
                </button>
              </div>
            </div>

            {/* O'ng — alifbo panjarasi */}
            <div style={{
              padding:'40px clamp(26px,3vw,36px)',
              background:'var(--surf2)',
              borderLeft:'1px solid var(--brd)',
              display:'flex', flexDirection:'column',
            }}>
              <div className="label" style={{ marginBottom:14 }}>Kursdagi harflar</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(46px,1fr))', gap:7 }}>
                {ALPHABET.map((L, i) => (
                  <div key={L} title={`${L} harfi`} style={{
                    aspectRatio:'1', borderRadius:11,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    background:'var(--surf)', border:'1px solid var(--brd)',
                    fontFamily:'var(--font-d)', fontWeight:800, fontSize:15, color:t2,
                    transition:'transform .18s, border-color .18s, color .18s, background .18s',
                    animation:`pop .3s ${i * 0.014}s both`, cursor:'default',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background='linear-gradient(140deg,var(--acc-v),var(--acc2-v))'; e.currentTarget.style.color='#04180f'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.transform='translateY(-3px)'; }}
                    onMouseOut={e  => { e.currentTarget.style.background='var(--surf)'; e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.borderColor='var(--brd)'; e.currentTarget.style.transform='none'; }}>
                    {L}
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'auto', paddingTop:18, fontSize:12, color:t3, lineHeight:1.6 }}>
                Statik va harakatli harflar birga — har biri alohida darsda mustahkamlanadi.
              </div>
            </div>
          </div>
        </BorderGlow>
      </section>

      {/* ══ O'QUV YO'LI ══ */}
      <section className="sec">
        <div className="sec-head"><h2>O'quv yo'li</h2><div className="rule"/></div>
        <p style={{ fontSize:14.5, color:t2, marginTop:-20, marginBottom:30 }}>
          Darslar ketma-ket ochiladi — oldingisini tugatmasdan keyingisiga o'tolmaysiz.
        </p>

        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {PATH.map((p, i) => (
            <div key={p.n}
              onMouseEnter={() => setHoverStage(i)}
              onMouseLeave={() => setHoverStage(null)}
              style={{
                position:'relative', padding:'26px 22px', borderRadius:20,
                background:'var(--surf)',
                border:`1px solid ${hoverStage === i ? p.c + '77' : 'var(--brd)'}`,
                boxShadow: hoverStage === i ? `0 12px 34px ${p.c}22` : 'none',
                transform: hoverStage === i ? 'translateY(-4px)' : 'none',
                transition:'all .24s', animation:`su .45s ${i * 0.07}s both`,
              }}>

              {/* bosqichlarni bog'lovchi chiziq */}
              {i < PATH.length - 1 && (
                <div aria-hidden="true" style={{
                  position:'absolute', top:46, right:-15, width:15, height:2, zIndex:2,
                  background:`linear-gradient(90deg,${p.c},transparent)`,
                }}/>
              )}

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{
                  width:48, height:48, borderRadius:15, fontSize:22,
                  background:`${p.c}1c`, border:`1.5px solid ${p.c}4d`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{p.icon}</div>
                <span style={{
                  fontFamily:'var(--font-d)', fontSize:27, fontWeight:800,
                  color:p.c, opacity:.3, letterSpacing:'-.05em',
                }}>{p.n}</span>
              </div>

              <div style={{ fontFamily:'var(--font-d)', fontSize:16.5, fontWeight:800, color:t1, marginBottom:5 }}>
                {p.title}
              </div>
              <div style={{ fontSize:12, color:t3, lineHeight:1.55, marginBottom:16 }}>{p.sub}</div>

              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
                {p.lessons.map((l, k) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:9, fontSize:12.5, color:t2 }}>
                    <span style={{
                      width:19, height:19, borderRadius:6, flexShrink:0,
                      background:`${p.c}18`, border:`1px solid ${p.c}3a`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:9.5, fontWeight:800, color:p.c,
                    }}>{k + 1}</span>
                    {l}
                  </div>
                ))}
              </div>

              <div style={{
                paddingTop:13, borderTop:'1px dashed var(--brd)',
                fontSize:11, fontWeight:800, color:p.c, letterSpacing:'.06em', textTransform:'uppercase',
              }}>
                {p.lessons.length} ta dars
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TEZ KUNDA ══ */}
      <section className="sec">
        <div className="sec-head"><h2>Tez kunda</h2><div className="rule"/></div>
        <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {SOON.map(s => (
            <div key={s.label} style={{
              position:'relative', overflow:'hidden',
              padding:'24px 22px', borderRadius:18,
              background:'var(--surf2)', border:`1px dashed ${s.c}55`,
            }}>
              <div aria-hidden="true" style={{
                position:'absolute', top:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg,transparent,${s.c},transparent)`, opacity:.7,
              }}/>
              <div style={{ display:'flex', alignItems:'center', gap:13, marginBottom:12 }}>
                <div style={{
                  width:44, height:44, borderRadius:13, fontSize:20, flexShrink:0,
                  background:`${s.c}18`, border:`1px solid ${s.c}3a`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-d)', fontSize:15, fontWeight:800, color:t1 }}>{s.label}</div>
                  <div style={{ fontSize:10, fontWeight:800, color:s.c, letterSpacing:'.1em', textTransform:'uppercase', marginTop:2 }}>
                    ⏳ Ishlab chiqilmoqda
                  </div>
                </div>
              </div>
              <p style={{ fontSize:12.8, color:t2, lineHeight:1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ PASTKI CTA ══ */}
      <section className="sec" style={{ paddingBottom:28 }}>
        <div style={{
          padding:'32px clamp(24px,4vw,44px)', borderRadius:22,
          background:'var(--surf2)', border:'1px solid var(--brd2)',
          display:'flex', alignItems:'center', gap:24, flexWrap:'wrap',
        }}>
          <div style={{
            width:56, height:56, borderRadius:17, flexShrink:0, fontSize:26,
            background:'linear-gradient(135deg,var(--acc-v),var(--acc2-v))',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 8px 24px rgba(16,185,129,.35)',
          }}>🚀</div>
          <div style={{ flex:'1 1 300px' }}>
            <div style={{ fontFamily:'var(--font-d)', fontSize:19, fontWeight:800, color:t1, marginBottom:5 }}>
              Kamerangizni yoqing va birinchi harfni bugun o'rganing
            </div>
            <div style={{ fontSize:13.5, color:t2, lineHeight:1.65 }}>
              Ro'yxatdan o'tish shart emas — hammasi brauzeringizda ishlaydi va video hech qayerga yuborilmaydi.
            </div>
          </div>
          <button onClick={start} className="btn btn-p btn-lg">
            <span>Boshlash →</span>
          </button>
        </div>
      </section>
    </div>
  );
}
