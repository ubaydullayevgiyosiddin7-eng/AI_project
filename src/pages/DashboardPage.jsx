import { LESSONS, LESSON_LEVELS } from '../data/lessons';
import useProgress from '../hooks/useProgress';
import theme from '../theme';

export default function DashboardPage({ user, onNavigate }) {
  const { progress, isLessonComplete } = useProgress();
  const completedCount = Object.keys(progress.completedLessons).length;
  const totalLessons   = LESSONS.length;
  const nextLesson     = LESSONS.find(l => !isLessonComplete(l.id));
  const letters        = Object.keys(progress.learnedLetters).length;
  const certs          = progress.certificates.length;

  const xp    = progress.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const inLvl = xp % 100;

  return (
    <div style={pageStyle}>
      <style>{CSS}</style>

      {/* ── Sarlavha ── */}
      <header style={topBarStyle}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={emblemStyle}>
            <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="" style={emblemImgStyle}/>
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:theme.primaryDark, letterSpacing:'-0.02em', fontFamily:theme.fontDisplay }}>
              Surdo AI
            </div>
            <div style={{ fontSize:10, color:theme.textLight, letterSpacing:'0.06em', fontWeight:600 }}>
              O'ZBEK IMO-ISHORA TILI PLATFORMASI
            </div>
          </div>
        </div>
      </header>

      <main style={mainStyle}>

        {/* ══ BENTO: daraja + statistika ══ */}
        <section className="bento">
          {/* Daraja — halqali progress */}
          <div className="tile tile-hero">
            <div className="hero-blob" aria-hidden="true"/>
            <div style={{ position:'relative', display:'flex', alignItems:'center', gap:22, height:'100%' }}>
              <Ring pct={inLvl} label={level}/>
              <div>
                <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:'.14em', opacity:.85 }}>JORIY DARAJA</div>
                <div style={{ fontSize:30, fontWeight:800, fontFamily:theme.fontDisplay, letterSpacing:'-.03em', margin:'2px 0 4px' }}>
                  {level}-daraja
                </div>
                <div style={{ fontSize:12.5, opacity:.92 }}>
                  {xp} XP · keyingi darajagacha <b>{100 - inLvl}</b>
                </div>
              </div>
            </div>
          </div>

          <Tile glyph="📚" label="Tugatilgan darslar" value={`${completedCount}`} suffix={`/ ${totalLessons}`}
            pct={(completedCount / totalLessons) * 100} color={theme.primaryLight}/>
          <Tile glyph="🖐️" label="O'rganilgan harflar" value={letters} suffix="/ 29"
            pct={(letters / 29) * 100} color={theme.mint}/>
          <Tile glyph="🏆" label="Sertifikatlar" value={certs} suffix=""
            pct={certs ? 100 : 0} color={theme.accent}/>
        </section>

        {/* ══ Rejimlar ══ */}
        <section className="modes">
          <ModeCard
            featured
            glyph="📖" tag="Bosqichli kurs" title="Darslik"
            desc="29 ta daktil harfi, so'zlar va gaplar — ketma-ket ochiluvchi darslar bilan."
            color={theme.primary} accent={theme.lime}
            cta={nextLesson ? `Davom: ${nextLesson.title}` : 'Boshlash'}
            onClick={() => onNavigate('lessons')}
          />
          <ModeCard
            glyph="💬" tag="Real-time" title="Tarjimon"
            desc="Qo'l harakatini matnga aylantiradi va ovozda o'qiydi."
            color={theme.mint} accent={theme.primaryLight}
            cta="Ochish" onClick={() => onNavigate('translator')}
          />
          <ModeCard
            glyph="🎯" tag="Erkin sinov" title="Mashq"
            desc="Bilganlaringizni cheklovsiz sinab ko'ring."
            color={theme.accent} accent={theme.lime}
            cta="Sinash" onClick={() => onNavigate('practice')}
          />
        </section>

        {/* ══ Bosqichlar — bog'langan yo'l ══ */}
        <section>
          <h2 style={sectionTitle}>Bosqichlar</h2>
          <div className="levels">
            {LESSON_LEVELS.map((lv, i) => {
              const inLevel = LESSONS.filter(l => l.level === lv.level);
              const done = inLevel.filter(l => isLessonComplete(l.id)).length;
              const pct = inLevel.length ? (done / inLevel.length) * 100 : 0;
              const full = pct >= 100;
              return (
                <div key={lv.level} className="lvl" style={{ animationDelay: `${i * 0.06}s` }}>
                  {i < LESSON_LEVELS.length - 1 && <span className="lvl-link" aria-hidden="true"/>}
                  <div className="lvl-top">
                    <span className={`lvl-node${full ? ' done' : ''}`}>{full ? '✓' : lv.level}</span>
                    <span className="lvl-count">{done}/{inLevel.length}</span>
                  </div>
                  <div className="lvl-name">{lv.name}</div>
                  <div className="lvl-bar"><i style={{ width: `${pct}%` }}/></div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Halqali progress ── */
function Ring({ pct, label }) {
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div style={{ position:'relative', width:88, height:88, flexShrink:0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="7"/>
        <circle cx="44" cy="44" r={R} fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100}
          style={{ transition:'stroke-dashoffset .6s ease' }}/>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:28, fontWeight:800, fontFamily:theme.fontDisplay, letterSpacing:'-.04em',
      }}>{label}</div>
    </div>
  );
}

/* ── Statistika plitkasi ── */
function Tile({ glyph, label, value, suffix, pct, color }) {
  return (
    <div className="tile">
      <span className="tile-glyph" aria-hidden="true">{glyph}</span>
      <div className="tile-label">{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:2 }}>
        <span style={{ fontSize:30, fontWeight:800, color:theme.text, fontFamily:theme.fontDisplay, letterSpacing:'-.04em' }}>{value}</span>
        {suffix && <span style={{ fontSize:13, color:theme.textLight, fontWeight:700 }}>{suffix}</span>}
      </div>
      <div className="tile-bar"><i style={{ width:`${Math.min(pct,100)}%`, background:color }}/></div>
    </div>
  );
}

/* ── Rejim kartasi ── */
function ModeCard({ glyph, tag, title, desc, color, accent, cta, onClick, featured }) {
  return (
    <button onClick={onClick} className={`mode${featured ? ' mode-f' : ''}`}
      style={{ '--c': color, '--a': accent }}>
      <span className="mode-blob" aria-hidden="true"/>
      <span className="mode-badge">{glyph}</span>
      <span className="mode-tag">{tag}</span>
      <span className="mode-title">{title}</span>
      <span className="mode-desc">{desc}</span>
      <span className="mode-cta">{cta}<i>→</i></span>
    </button>
  );
}

/* ══ Uslublar ══ */
const CSS = `
.bento{display:grid;grid-template-columns:1.45fr 1fr 1fr 1fr;gap:14}
.tile{position:relative;overflow:hidden;background:${theme.surface};border:1px solid ${theme.border};
  border-radius:${theme.radiusLg};padding:18px 20px;box-shadow:${theme.shadow};
  transition:transform .2s,box-shadow .2s,border-color .2s;animation:tile-in .45s cubic-bezier(.22,.68,0,1.2) both}
.tile:hover{transform:translateY(-3px);box-shadow:${theme.shadowMd};border-color:${theme.borderStrong}}
.tile-hero{background:${theme.gradient};border:none;color:#04180f;padding:22px 24px;box-shadow:${theme.shadowAcc}}
.hero-blob{position:absolute;right:-40px;top:-50px;width:180px;height:180px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.45),transparent 70%);pointer-events:none}
.tile-glyph{position:absolute;right:12px;top:8px;font-size:40px;opacity:.13;pointer-events:none;line-height:1}
.tile-label{font-size:10px;font-weight:800;letter-spacing:.11em;color:${theme.textLight};text-transform:uppercase}
.tile-bar{height:5px;border-radius:3px;background:${theme.surfaceAlt};margin-top:12px;overflow:hidden}
.tile-bar i{display:block;height:100%;border-radius:3px;transition:width .6s ease}
@keyframes tile-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

.modes{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:14}
.mode{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;
  background:${theme.surface};border:1px solid ${theme.border};border-radius:${theme.radiusLg};
  padding:22px 22px 20px;text-align:left;cursor:pointer;font-family:inherit;color:${theme.text};
  box-shadow:${theme.shadow};transition:transform .22s,box-shadow .22s,border-color .22s}
.mode:hover{transform:translateY(-4px);border-color:var(--c);box-shadow:0 14px 38px color-mix(in srgb,var(--c) 26%,transparent)}
.mode-blob{position:absolute;right:-56px;top:-56px;width:170px;height:170px;border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--c) 26%,transparent),transparent 68%);
  transition:transform .35s;pointer-events:none}
.mode:hover .mode-blob{transform:scale(1.35)}
.mode-badge{width:52px;height:52px;border-radius:16px;display:flex;align-items:center;justify-content:center;
  font-size:24px;margin-bottom:14px;background:linear-gradient(140deg,var(--c),var(--a));
  box-shadow:0 8px 22px color-mix(in srgb,var(--c) 42%,transparent)}
.mode-tag{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--c)}
.mode-title{font-family:${theme.fontDisplay};font-size:22px;font-weight:800;letter-spacing:-.03em;margin:3px 0 7px}
.mode-desc{font-size:13px;line-height:1.6;color:${theme.textMuted};margin-bottom:16px;max-width:34ch}
.mode-cta{margin-top:auto;display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:999px;
  background:linear-gradient(140deg,var(--c),var(--a));color:${theme.textOnLime};font-size:12.5px;font-weight:800}
.mode-cta i{font-style:normal;transition:transform .22s}
.mode:hover .mode-cta i{transform:translateX(4px)}
.mode-f .mode-title{font-size:26px}
.mode-f .mode-badge{width:58px;height:58px;font-size:27px}

.levels{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14}
.lvl{position:relative;background:${theme.surface};border:1px solid ${theme.border};
  border-radius:${theme.radiusLg};padding:16px 18px;box-shadow:${theme.shadow};
  transition:transform .2s,border-color .2s;animation:tile-in .45s cubic-bezier(.22,.68,0,1.2) both}
.lvl:hover{transform:translateY(-3px);border-color:${theme.borderStrong}}
.lvl-link{position:absolute;top:32px;right:-15px;width:14px;height:2px;
  background:linear-gradient(90deg,${theme.borderStrong},transparent);z-index:1}
.lvl-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.lvl-node{width:30px;height:30px;border-radius:11px;display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;color:${theme.primary};
  background:${theme.surfaceAlt};border:1.5px solid ${theme.border}}
.lvl-node.done{background:${theme.gradient};border-color:transparent;color:${theme.textOnLime}}
.lvl-count{font-size:12px;font-weight:800;color:${theme.textLight}}
.lvl-name{font-size:14.5px;font-weight:800;color:${theme.text};font-family:${theme.fontDisplay};margin-bottom:10px}
.lvl-bar{height:5px;border-radius:3px;background:${theme.surfaceAlt};overflow:hidden}
.lvl-bar i{display:block;height:100%;border-radius:3px;background:${theme.gradient};transition:width .6s ease}

@media (max-width:1000px){
  .bento{grid-template-columns:1fr 1fr}
  .modes{grid-template-columns:1fr}
}
@media (max-width:560px){ .bento{grid-template-columns:1fr} }
`;

const pageStyle = {
  minHeight: '100vh', width: '100%',
  background: theme.bg, color: theme.text,
  fontFamily: theme.font, display: 'flex', flexDirection: 'column',
};

const topBarStyle = {
  background: theme.surface,
  borderBottom: `1px solid ${theme.border}`,
  padding: '12px 28px',
  display: 'flex', alignItems: 'center',
  flexShrink: 0,
};

// Logotip belgisi — /logo-mark.png (cropped_circle_image.png dan)
const emblemStyle = {
  width: 42, height: 42,
  background: '#ffffff',
  border: `1px solid ${theme.border}`,
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 6px 18px rgba(16,185,129,.22)',
  flexShrink: 0,
};

const emblemImgStyle = { width: '78%', height: '78%', objectFit: 'contain', display: 'block' };

const mainStyle = {
  flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto',
  padding: '24px 28px 40px',
  display: 'flex', flexDirection: 'column', gap: 24,
};

const sectionTitle = {
  fontSize: 15, fontWeight: 800, color: theme.primaryDark,
  marginBottom: 13, letterSpacing: '-0.02em',
  fontFamily: theme.fontDisplay,
};
