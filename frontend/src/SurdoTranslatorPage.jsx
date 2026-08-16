// SurdoTranslatorPage.jsx — Matn / ovoz → 3D avatar imo-ishora
// Surdo-Avatar-Demo (index.html) React'ga ko'chirildi; avatar videolari
// MMS Player (DFKI) + AVASAG korpusi orqali oldindan render qilingan.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AvatarModel from './AvatarModel';

const V = process.env.PUBLIC_URL + '/surdo/videos/';

// ── Lug'at ── (17 ta so'z)
const WORDS = [
  { id:'HALLO',       uz:'Salom',                 video:V + 'HALLO.mp4' },
  { id:'DANKE',       uz:'Rahmat',                video:V + 'DANKE.mp4' },
  { id:'BITTE',       uz:'Iltimos',               video:V + 'BITTE.mp4' },
  { id:'OK',          uz:'OK / Yaxshi',           video:V + 'OK.mp4' },
  { id:'ARZT',        uz:'Shifokor',              video:V + 'ARZT.mp4' },
  { id:'BAHNHOF',     uz:'Vokzal',                video:V + 'BAHNHOF.mp4' },
  { id:'ZUG',         uz:'Poyezd',                video:V + 'ZUG.mp4' },
  { id:'POLIZEI',     uz:'Politsiya',             video:V + 'POLIZEI.mp4' },
  { id:'FEUER',       uz:"Yong'in",               video:V + 'FEUER.mp4' },
  { id:'TOILETTE',    uz:'Hojatxona',             video:V + 'TOILETTE.mp4' },
  { id:'AUSGANG',     uz:'Chiqish',               video:V + 'AUSGANG.mp4' },
  { id:'HEUTE',       uz:'Bugun',                 video:V + 'HEUTE.mp4' },
  { id:'ZEIT',        uz:'Vaqt',                  video:V + 'ZEIT.mp4' },
  { id:'WARTEN',      uz:'Kutish',                video:V + 'WARTEN.mp4' },
  { id:'INFORMATION', uz:"Ma'lumot",              video:V + 'INFORMATION.mp4' },
  { id:'ANKOMMEN',    uz:'Kelmoq / Yetib kelish', video:V + 'ANKOMMEN.mp4' },
  { id:'UHR',         uz:'Soat',                  video:V + 'UHR.mp4' },
];

const SPEEDS = [
  { v:0.5, l:'0.5×' },
  { v:0.7, l:'0.7×' },
  { v:1,   l:'1×'   },
];

const normalize = s => (s || '')
  .toLowerCase()
  .replace(/[ʻ'’`]/g, '')
  .replace(/[^a-z0-9\s]/gi, '')
  .trim();

function findWord(token) {
  const norm = normalize(token);
  if (!norm) return null;
  return WORDS.find(w =>
    normalize(w.id) === norm ||
    normalize(w.uz).split('/').some(p => normalize(p) === norm)
  ) || null;
}

const resolveText = text => (text || '')
  .split(/\s+/).filter(Boolean)
  .map(token => ({ token, word: findWord(token) }));

export default function SurdoTranslatorPage() {
  const [text, setText]       = useState('');
  const [resolved, setResolved] = useState([]);
  const [queue, setQueue]     = useState([]);
  const [qi, setQi]           = useState(0);
  const [speed, setSpeed]     = useState(0.7);
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk]     = useState(false);

  const videoRef = useRef(null);
  const recRef   = useRef(null);

  const current = queue[qi] || null;
  const missing = resolved.some(r => !r.word);

  useEffect(() => {
    setMicOk(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // Navbatdagi so'zni o'ynatish
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !current) return;
    v.src = current.video;
    v.currentTime = 0;
    v.playbackRate = speed;
    v.play().catch(() => {});
  }, [current, speed]);

  const play = useCallback((words) => { setQueue(words); setQi(0); }, []);

  const submit = (e) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    const r = resolveText(t);
    setResolved(r);
    play(r.map(x => x.word).filter(Boolean));
  };

  const pickWord = (w) => {
    setText(w.uz.split('/')[0].trim());
    setResolved([{ token:w.uz, word:w }]);
    play([w]);
  };

  const onEnded = () => { if (qi + 1 < queue.length) setQi(qi + 1); };

  const replay = () => {
    if (!queue.length) return;
    setQi(0);
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  };

  // ── Mikrofon (Web Speech API) ──
  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    recRef.current = rec;
    rec.lang = 'uz-UZ';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = ev => {
      const said = ev.results[0][0].transcript;
      setText(said);
      const r = resolveText(said);
      setResolved(r);
      play(r.map(x => x.word).filter(Boolean));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <div>
      {/* ══ HERO ══ */}
      <section style={{ padding:'52px clamp(20px,5vw,72px) 34px', maxWidth:1240, margin:'0 auto' }}>
        <div className="chip a-su d0" style={{ marginBottom:24 }}>
          <span className="dot"/> Surdo · Matn → Imo-ishora
        </div>
        <h1 className="a-su d1" style={{
          fontFamily:'var(--font-d)', fontSize:'clamp(32px,4.4vw,56px)', fontWeight:800,
          lineHeight:1.06, letterSpacing:'-.045em', color:'var(--t1)', marginBottom:16, maxWidth:820,
        }}>
          Yozing yoki gapiring — <span className="grad-text">avatar imo-ishora qiladi</span>
        </h1>
        <p className="a-su d2" style={{ fontSize:'clamp(14.5px,1.4vw,17px)', lineHeight:1.8, color:'var(--t2)', maxWidth:640 }}>
          Bu — tarjimonning teskari yo'nalishi: kamera qo'lni matnga aylantirsa, bu yerda
          matn 3D avatar harakatiga aylanadi. Eshitmaydiganlar bilan muloqotda ikkala
          yo'nalish ham kerak.
        </p>
      </section>

      {/* ══ ASOSIY PANEL ══ */}
      <section className="sec" style={{ paddingBottom:34 }}>
        <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, alignItems:'stretch' }}>

          {/* ── Chap: kiritish ── */}
          <div style={{
            background:'var(--surf)', border:'1px solid var(--brd)', borderRadius:22,
            padding:'26px 26px 24px', display:'flex', flexDirection:'column', gap:16,
            boxShadow:'var(--sh)',
          }}>
            <div className="label" style={{ margin:0 }}>Matn yoki ovoz kiriting</div>

            <form onSubmit={submit} style={{ display:'flex', gap:9 }}>
              <input className="field" value={text} autoComplete="off"
                placeholder="masalan: salom rahmat iltimos"
                onChange={e => setText(e.target.value)}/>
              {micOk && (
                <button type="button" onClick={toggleMic}
                  aria-label={listening ? 'Tinglashni to\'xtatish' : 'Ovoz bilan kiritish'}
                  style={{
                    flexShrink:0, padding:'0 15px', borderRadius:12, cursor:'pointer',
                    fontFamily:'var(--font)', fontSize:13, fontWeight:700,
                    background: listening ? 'var(--er-bg)' : 'var(--surf2)',
                    border:`1.5px solid ${listening ? 'var(--er-b)' : 'var(--brd2)'}`,
                    color: listening ? 'var(--er)' : 'var(--t2)',
                    transition:'all .2s', whiteSpace:'nowrap',
                  }}>
                  {listening ? '● Tinglanmoqda' : '🎤'}
                </button>
              )}
              <button type="submit" className="btn btn-p" style={{ flexShrink:0, padding:'12px 22px' }}>
                <span>Ko'rsat</span>
              </button>
            </form>

            {/* Aniqlangan so'zlar */}
            {resolved.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                {resolved.map((r, i) => {
                  const active = r.word && r.word === current;
                  return (
                    <span key={i} style={{
                      padding:'5px 12px', borderRadius:9, fontSize:12.5, fontWeight:700,
                      ...(r.word
                        ? active
                          ? { background:'linear-gradient(140deg,var(--acc-v),var(--acc2-v))', color:'#04180f', border:'1px solid transparent' }
                          : { background:'var(--surf3)', color:'var(--t2)', border:'1px solid var(--brd2)' }
                        : { background:'var(--er-bg)', color:'var(--er)', border:'1px dashed var(--er-b)' }),
                    }}>{r.token}</span>
                  );
                })}
              </div>
            )}
            {missing && (
              <div style={{ fontSize:12, color:'var(--wa)', fontWeight:600, marginTop:-6 }}>
                Ba'zi so'zlar hozircha lug'atda yo'q — pastdagi ro'yxatdan tanlang.
              </div>
            )}

            <div style={{ height:1, background:'var(--brd)' }}/>

            <div className="label" style={{ margin:0 }}>Yoki lug'atdan tanlang ({WORDS.length})</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {WORDS.map(w => {
                const on = current && current.id === w.id;
                return (
                  <button key={w.id} onClick={() => pickWord(w)} style={{
                    padding:'7px 14px', borderRadius:100, cursor:'pointer',
                    fontFamily:'var(--font)', fontSize:12.5, fontWeight:600,
                    background: on ? 'linear-gradient(140deg,var(--acc-v),var(--acc2-v))' : 'var(--surf2)',
                    border:`1px solid ${on ? 'transparent' : 'var(--brd)'}`,
                    color: on ? '#04180f' : 'var(--t2)',
                    transition:'all .18s',
                  }}
                    onMouseOver={e => { if (!on) { e.currentTarget.style.borderColor='var(--brd-a)'; e.currentTarget.style.background='var(--surf3)'; } }}
                    onMouseOut={e  => { if (!on) { e.currentTarget.style.borderColor='var(--brd)';   e.currentTarget.style.background='var(--surf2)'; } }}>
                    {w.uz}
                  </button>
                );
              })}
            </div>

            <div style={{
              marginTop:'auto', padding:'13px 15px', borderRadius:13,
              background:'var(--surf2)', border:'1px solid var(--brd)',
              fontSize:12, color:'var(--t2)', lineHeight:1.65,
            }}>
              <b style={{ color:'var(--acc)' }}>MVP haqida:</b> avatar harakatlari{' '}
              <b>MMS Player</b> (DFKI tadqiqot loyihasi) va <b>AVASAG</b> korpusi orqali
              oldindan render qilingan. Hozircha {WORDS.length} ta so'z ishlaydi — asli nemis
              imo-ishora tilida yozib olingan, o'zbekcha ma'no bilan belgilangan.
            </div>
          </div>

          {/* ── O'ng: avatar ── */}
          <div style={{
            background:'var(--surf)', border:'1px solid var(--brd)', borderRadius:22,
            padding:'26px', display:'flex', flexDirection:'column', gap:14,
            boxShadow:'var(--sh)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div className="label" style={{ margin:0 }}>3D Avatar</div>
              {queue.length > 1 && (
                <span style={{
                  padding:'3px 10px', borderRadius:100, fontSize:10.5, fontWeight:800,
                  background:'var(--surf3)', border:'1px solid var(--brd2)', color:'var(--t2)',
                }}>{qi + 1} / {queue.length}</span>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap:5 }}>
                {SPEEDS.map(s => (
                  <button key={s.v} onClick={() => setSpeed(s.v)} title={`Tezlik ${s.l}`} style={{
                    padding:'4px 10px', borderRadius:8, cursor:'pointer',
                    fontFamily:'var(--font)', fontSize:11, fontWeight:800,
                    background: speed === s.v ? 'var(--acc)' : 'var(--surf2)',
                    border:`1px solid ${speed === s.v ? 'transparent' : 'var(--brd)'}`,
                    color: speed === s.v ? '#fff' : 'var(--t3)',
                  }}>{s.l}</button>
                ))}
              </div>
            </div>

            {/* Sahna */}
            <div style={{
              position:'relative', flex:1, minHeight:380, borderRadius:16, overflow:'hidden',
              background:'linear-gradient(165deg,#062018,#0a3226)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {/* Video o'ynayotganda ko'rinadi */}
              <video ref={videoRef} muted playsInline onEnded={onEnded}
                style={{
                  maxWidth:'100%', maxHeight:'100%', display: current ? 'block' : 'none',
                  position:'relative', zIndex:2,
                }}/>

              {/* Bo'sh holat — MMS Player avatari 3D da */}
              {!current && (
                <>
                  <AvatarModel/>
                  <div style={{
                    position:'absolute', bottom:16, left:16, right:16, zIndex:3,
                    textAlign:'center', fontSize:12.5, color:'rgba(255,255,255,.72)',
                    fontWeight:600, pointerEvents:'none',
                  }}>
                    Chapdan so'z yozing yoki tanlang — avatar shu yerda harakatlanadi
                  </div>
                </>
              )}
            </div>

            {/* Joriy so'z + qayta o'ynatish */}
            <div style={{ display:'flex', alignItems:'center', gap:10, minHeight:38 }}>
              {current && (
                <>
                  <span style={{
                    padding:'8px 18px', borderRadius:11,
                    background:'linear-gradient(140deg,var(--acc-v),var(--acc2-v))',
                    color:'#04180f', fontSize:16, fontWeight:800, fontFamily:'var(--font-d)',
                  }}>{current.uz}</span>
                  <span style={{ fontSize:11.5, color:'var(--t3)', fontWeight:700, letterSpacing:'.06em' }}>
                    {current.id}
                  </span>
                  <button onClick={replay} className="btn btn-g"
                    style={{ marginLeft:'auto', padding:'8px 16px', fontSize:12.5 }}>
                    ↻ Qaytadan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MANBALAR ══ */}
      <section className="sec" style={{ paddingBottom:28 }}>
        <div className="sec-head"><h2>Texnologiya va manbalar</h2><div className="rule"/></div>
        <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
          {[
            { icon:'🎬', t:'MMS Player', d:"DFKI ning ochiq tadqiqot loyihasi. MMS yozuvini (imo-ishora notatsiyasi) Blender orqali avatar animatsiyasiga aylantiradi — shu yerdagi videolar aynan shu quvur bilan render qilingan.", c:'#10b981' },
            { icon:'🧍', t:'AVASAG avatari', d:"avasag_avatar_casual.glb — MMS Player bilan kelgan skeletli 3D model. Veb uchun 5.5 MB dan 1.1 MB gacha siqildi va kutish holatida ko'rsatiladi.", c:'#2dd4bf' },
            { icon:'📚', t:'AVASAG korpusi', d:"Nemis imo-ishora tili (DGS) korpusi. 17 ta so'z shu korpusdan olinib, o'zbekcha ma'no bilan belgilandi — to'liq o'zbek surdo korpusi hali yo'q.", c:'#a3e635' },
          ].map(x => (
            <div key={x.t} style={{
              padding:'22px', borderRadius:18,
              background:'var(--surf2)', border:'1px solid var(--brd)',
            }}>
              <div style={{
                width:46, height:46, borderRadius:14, marginBottom:14, fontSize:21,
                background:`${x.c}1f`, border:`1.5px solid ${x.c}4d`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{x.icon}</div>
              <div style={{ fontFamily:'var(--font-d)', fontSize:16, fontWeight:800, color:'var(--t1)', marginBottom:8 }}>{x.t}</div>
              <p style={{ fontSize:12.8, color:'var(--t2)', lineHeight:1.7 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
