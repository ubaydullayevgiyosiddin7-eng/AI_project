import { LESSONS, LESSON_LEVELS } from '../data/lessons';
import useProgress from '../hooks/useProgress';
import theme from '../theme';

export default function DashboardPage({ user, onNavigate, onLogout }) {
  const { progress, isLessonComplete } = useProgress();
  const completedCount = Object.keys(progress.completedLessons).length;
  const totalLessons = LESSONS.length;
  const nextLesson = LESSONS.find(l => !isLessonComplete(l.id));

  return (
    <div style={pageStyle}>
      {/* Top bar */}
      <header style={topBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={emblemStyle}>SH</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.primaryDark, letterSpacing: '-0.01em' }}>SignHand</div>
            <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: '0.05em' }}>O'zbek imo-ishora tili platformasi</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: theme.textMuted }}>{user?.full_name || user?.username}</div>
          <button onClick={onLogout} style={{
            background: theme.surface, border: `1px solid ${theme.borderStrong}`,
            color: theme.textMuted, padding: '6px 12px', borderRadius: theme.radiusSm,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>Chiqish</button>
        </div>
      </header>

      <main style={mainStyle}>
        {/* XP + Stats kompakt qator */}
        <section style={topRowStyle}>
          <XPCard progress={progress} />
          <StatCard label="Tugatilgan darslar" value={`${completedCount} / ${totalLessons}`} accent={theme.primary} />
          <StatCard label="O'rganilgan harflar" value={Object.keys(progress.learnedLetters).length} accent={theme.accent} />
          <StatCard label="Sertifikatlar" value={progress.certificates.length} accent={theme.info} />
        </section>

        {/* 3 ta rejim */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <ModeCard
            title="Darslik"
            subtitle="Bosqichli kurs"
            description="29 harf, so'zlar, gaplar"
            color={theme.primary}
            onClick={() => onNavigate('lessons')}
            cta={nextLesson ? `Davom: ${nextLesson.title}` : "Boshlash"}
          />
          <ModeCard
            title="Tarjimon"
            subtitle="Real-time"
            description="Qo'l harakatini matn qiladi"
            color={theme.info}
            onClick={() => onNavigate('translator')}
            cta="Ochish"
          />
          <ModeCard
            title="Mashq"
            subtitle="Erkin sinov"
            description="Bilganlaringizni sinang"
            color={theme.accent}
            onClick={() => onNavigate('practice')}
            cta="Sinash"
          />
        </section>

        {/* Bosqichlar */}
        <section>
          <h2 style={sectionTitle}>Bosqichlar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {LESSON_LEVELS.map(lv => {
              const inLevel = LESSONS.filter(l => l.level === lv.level);
              const done = inLevel.filter(l => isLessonComplete(l.id)).length;
              const pct = (done / inLevel.length) * 100;
              return (
                <div key={lv.level} style={levelCardStyle}>
                  <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>BOSQICH {lv.level}</div>
                  <div style={{ fontSize: 14, color: theme.text, fontWeight: 700, marginTop: 4, marginBottom: 8 }}>{lv.name}</div>
                  <div style={{ height: 4, background: theme.border, borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: theme.primary, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: theme.textMuted }}>{done} / {inLevel.length}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function XPCard({ progress }) {
  const xp = progress.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const nextLevel = level * 100;
  const pct = ((xp % 100) / 100) * 100;

  return (
    <div style={{
      ...statCardBase,
      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
      color: '#fff',
      border: 'none',
    }}>
      <div style={{ fontSize: 10, opacity: 0.85, fontWeight: 600, letterSpacing: '0.05em' }}>JORIY DARAJA</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
        {level}-daraja
      </div>
      <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>{xp} / {nextLevel} XP</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, marginTop: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#fff', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={statCardBase}>
      <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: theme.text, marginTop: 4 }}>{value}</div>
      <div style={{ height: 2, width: 30, background: accent, marginTop: 8, borderRadius: 1 }} />
    </div>
  );
}

function ModeCard({ title, subtitle, description, color, cta, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusLg,
      padding: '18px 20px',
      textAlign: 'left',
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 0.15s',
      color: theme.text,
      boxShadow: theme.shadow,
      borderLeft: `4px solid ${color}`,
    }}
      onMouseOver={e => {
        e.currentTarget.style.boxShadow = theme.shadowMd;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.boxShadow = theme.shadow;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: '0.06em' }}>{subtitle.toUpperCase()}</div>
      <div style={{ fontSize: 20, color: theme.text, fontWeight: 700, marginTop: 4, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 14 }}>{description}</div>
      <div style={{
        display: 'inline-block',
        background: color,
        color: '#fff',
        borderRadius: theme.radiusSm,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 600,
      }}>{cta} →</div>
    </button>
  );
}

const pageStyle = {
  minHeight: '100vh',
  width: '100%',
  background: theme.bg,
  color: theme.text,
  fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle = {
  background: theme.surface,
  borderBottom: `1px solid ${theme.border}`,
  padding: '12px 28px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
};

const emblemStyle = {
  width: 40, height: 40,
  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
  color: '#fff',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16, fontWeight: 800,
};

const mainStyle = {
  flex: 1,
  maxWidth: 1280,
  width: '100%',
  margin: '0 auto',
  padding: '24px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
};

const topRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 12,
};

const statCardBase = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: '14px 18px',
  boxShadow: theme.shadow,
};

const sectionTitle = {
  fontSize: 14,
  fontWeight: 700,
  color: theme.primaryDark,
  marginTop: 4,
  marginBottom: 12,
  letterSpacing: '0.02em',
};

const levelCardStyle = {
  background: theme.surface,
  border: `1px solid ${theme.border}`,
  borderRadius: theme.radius,
  padding: '12px 14px',
  boxShadow: theme.shadow,
};
