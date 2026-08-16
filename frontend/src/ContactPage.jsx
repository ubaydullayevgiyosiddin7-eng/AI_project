// ContactPage.jsx — Bog'lanish
import React, { useState } from 'react';
import BorderGlow from './BorderGlow';

const INFO = [
  { icon:'📧', t:'Email',     v:'info@surdo.uz',  d:'Texnik savollar uchun', c:'#10b981', g:'160 78 58' },
  { icon:'📱', t:'Telegram',  v:'@surdo_ai',      d:'Tezkor javob uchun',    c:'#2dd4bf', g:'172 72 62' },
  { icon:'🕐', t:'Ish vaqti', v:'09:00 – 18:00',    d:'Dushanba – Juma',       c:'#a3e635', g:'82 78 62'  },
];

const LINKS = [
  { icon:'🎓', l:"Ta'lim bo'limiga o'tish", p:'education' },
  { icon:'✦',  l:'Loyiha haqida',           p:'about'     },
  { icon:'🏠', l:'Bosh sahifa',              p:'landing'   },
];

export default function ContactPage({ navigateTo, dark }) {
  const [form, setForm]       = useState({ name:'', email:'', type:'general', message:'' });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const t1 = 'var(--t1)', t2 = 'var(--t2)', t3 = 'var(--t3)';
  const cardBg = dark ? 'rgba(7,26,19,.88)' : '#ffffff';

  const submit = e => {
    e.preventDefault(); setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

  if (sent) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'62vh', padding:40 }}>
      <div className="a-pop" style={{ textAlign:'center', maxWidth:430 }}>
        <div style={{
          width:82, height:82, borderRadius:26, margin:'0 auto 22px', fontSize:38,
          background:'linear-gradient(135deg,var(--acc-v),var(--acc2-v))',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 12px 40px rgba(16,185,129,.45)',
        }}>✓</div>
        <h2 style={{ fontFamily:'var(--font-d)', fontSize:32, fontWeight:800, color:t1, marginBottom:12, letterSpacing:'-.04em' }}>
          Xabar yuborildi!
        </h2>
        <p style={{ fontSize:15.5, color:t2, lineHeight:1.75, marginBottom:30 }}>
          Tez orada siz bilan bog'lanamiz. Odatda 1-2 ish kuni ichida javob beramiz.
        </p>
        <button onClick={() => navigateTo('landing')} className="btn btn-p btn-lg">
          <span>Bosh sahifaga qaytish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ padding:'52px clamp(20px,5vw,72px) 46px', maxWidth:1240, margin:'0 auto' }}>
        <div style={{ maxWidth:600 }}>
          <div className="chip a-su d0" style={{ marginBottom:26 }}>
            <span className="dot"/> Aloqa
          </div>
          <h1 className="a-su d1" style={{
            fontFamily:'var(--font-d)', fontSize:'clamp(34px,4.6vw,60px)', fontWeight:800,
            lineHeight:1.06, letterSpacing:'-.045em', color:t1, marginBottom:18,
          }}>
            Biz bilan <span className="grad-text">bog'laning</span>
          </h1>
          <p className="a-su d2" style={{ fontSize:'clamp(15px,1.4vw,17.5px)', lineHeight:1.85, color:t2 }}>
            Savollaringiz, takliflaringiz yoki hamkorlik bo'yicha murojaat qiling.
          </p>
        </div>
      </section>

      {/* ── Asosiy grid ── */}
      <section className="sec" style={{ paddingBottom:28 }}>
        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:20, alignItems:'start' }}>

          {/* Forma */}
          <BorderGlow backgroundColor={cardBg} glowColor="160 78 58"
            borderRadius={22} glowRadius={55} glowIntensity={1.4} coneSpread={38}
            colors={['#10b981','#a3e635','#2dd4bf']}>
            <div style={{ padding:'36px 34px' }}>
              <h2 style={{ fontFamily:'var(--font-d)', fontSize:22, fontWeight:800, color:t1, marginBottom:26, letterSpacing:'-.03em' }}>
                Xabar yuborish
              </h2>
              <form onSubmit={submit}>
                <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                  <div>
                    <div className="label">Ism-familiya *</div>
                    <input className="field" placeholder="Sizning ismingiz" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))}/>
                  </div>
                  <div>
                    <div className="label">Email *</div>
                    <input className="field" type="email" placeholder="email@example.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))}/>
                  </div>
                </div>

                <div style={{ marginBottom:14 }}>
                  <div className="label">Murojaat turi</div>
                  <select className="field" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type:e.target.value }))}>
                    <option value="general">Umumiy savol</option>
                    <option value="technical">Texnik yordam</option>
                    <option value="bug">Xato xabari</option>
                    <option value="partnership">Hamkorlik</option>
                  </select>
                </div>

                <div style={{ marginBottom:24 }}>
                  <div className="label">Xabar *</div>
                  <textarea className="field" rows={5} placeholder="Xabaringizni yozing..." required
                    style={{ resize:'vertical', minHeight:130 }}
                    value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))}/>
                </div>

                <button type="submit" disabled={sending} className="btn btn-p"
                  style={{ width:'100%', padding:'15px 0', fontSize:16 }}>
                  <span>
                    {sending ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation:'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="rgba(4,24,15,.3)" strokeWidth="2.4"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                        </svg>
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.5 2.5 11 13"/><path d="M21.5 2.5 15 21.5 11 13 2.5 9z"/>
                        </svg>
                        Xabar Yuborish
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </BorderGlow>

          {/* O'ng panel */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {INFO.map(c => (
              <BorderGlow key={c.t} backgroundColor={cardBg} glowColor={c.g}
                borderRadius={16} glowRadius={44} glowIntensity={1.3} coneSpread={30}
                colors={[c.c,'#a3e635','#2dd4bf']}>
                <div style={{ padding:'20px 22px', display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{
                    width:48, height:48, borderRadius:13, flexShrink:0, fontSize:22,
                    background:`${c.c}20`, border:`1.5px solid ${c.c}47`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{c.icon}</div>
                  <div>
                    <div className="label" style={{ marginBottom:4 }}>{c.t}</div>
                    <div style={{ fontSize:15.5, fontWeight:800, color:c.c, marginBottom:2, letterSpacing:'-.015em' }}>{c.v}</div>
                    <div style={{ fontSize:12.5, color:t2 }}>{c.d}</div>
                  </div>
                </div>
              </BorderGlow>
            ))}

            {/* Havolalar */}
            <div style={{ padding:22, borderRadius:18, background:'var(--surf2)', border:'1px solid var(--brd)' }}>
              <div className="label" style={{ marginBottom:14 }}>Foydali havolalar</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {LINKS.map(l => (
                  <button key={l.l} onClick={() => navigateTo(l.p)} style={{
                    display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderRadius:11,
                    background:'var(--surf)', border:'1px solid var(--brd)',
                    cursor:'pointer', color:t1, fontSize:14, fontWeight:600,
                    textAlign:'left', fontFamily:'var(--font)', transition:'all .2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor='var(--brd-a)'; e.currentTarget.style.background='var(--surf3)'; }}
                    onMouseOut={e  => { e.currentTarget.style.borderColor='var(--brd)';   e.currentTarget.style.background='var(--surf)'; }}>
                    <span style={{ fontSize:17 }}>{l.icon}</span>{l.l}
                    <span style={{ marginLeft:'auto', color:t3 }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Holat */}
            <div style={{ padding:'18px 20px', borderRadius:18, background:'var(--ok-bg)', border:'1px solid var(--ok-b)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <span style={{
                  width:10, height:10, borderRadius:'50%', flexShrink:0,
                  background:'var(--ok)', boxShadow:'0 0 10px var(--ok)',
                  animation:'pulse 2.2s ease-in-out infinite',
                }}/>
                <span style={{ fontSize:15, fontWeight:800, color:t1, fontFamily:'var(--font-d)' }}>Tizim ishlayapti</span>
              </div>
              <div style={{ fontSize:13, color:t2, lineHeight:1.6 }}>
                Barcha servislar normal ishlayapti. Javob vaqti &lt;30s
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
