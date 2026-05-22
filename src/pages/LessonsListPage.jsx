// Barcha darslar ro'yxati — ochiq rasmiy dizayn
import { LESSONS, LESSON_LEVELS } from '../data/lessons';
import useProgress from '../hooks/useProgress';
import theme from '../theme';

export default function LessonsListPage({ onSelectLesson, onBack }) {
  const { isLessonComplete, getLessonScore } = useProgress();

  return (
    <div style={pageStyle}>
      <header style={topBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={onBack} style={backBtn}>← Orqaga</button>
          <div style={{ width: 1, height: 24, background: theme.border }} />
          <div>
            <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em' }}>DARSLIK</div>
            <div style={{ fontSize: 15, color: theme.primaryDark, fontWeight: 700 }}>Barcha darslar</div>
          </div>
        </div>
      </header>

      <main style={contentStyle}>
        {LESSON_LEVELS.map(lv => {
          const lessons = LESSONS.filter(l => l.level === lv.level);
          return (
            <section key={lv.level} style={{ marginBottom: 24 }}>
              <div style={levelHeaderStyle}>
                <div style={{ fontSize: 10, color: theme.primary, fontWeight: 700, letterSpacing: '0.06em' }}>BOSQICH {lv.level}</div>
                <div style={{ fontSize: 16, color: theme.text, fontWeight: 700 }}>{lv.name}</div>
              </div>

              <div style={lessonsGridStyle}>
                {lessons.map((l, idx) => {
                  const done = isLessonComplete(l.id);
                  const score = getLessonScore(l.id);
                  const prev = idx > 0 ? lessons[idx - 1] : null;
                  const prevDone = !prev || isLessonComplete(prev.id);
                  const locked = !prevDone && !done;

                  return (
                    <button
                      key={l.id}
                      onClick={() => !locked && onSelectLesson(l.id)}
                      disabled={locked}
                      style={lessonCardStyle(done, locked)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 10, color: done ? theme.accent : theme.primary, fontWeight: 700, letterSpacing: '0.05em' }}>
                          DARS {l.order}
                        </div>
                        {done && <div style={completedBadge}>{score}%</div>}
                        {locked && <div style={{ fontSize: 11, color: theme.textLight }}>QULFLI</div>}
                      </div>
                      <div style={{ fontSize: 15, color: theme.text, fontWeight: 700, marginTop: 6, marginBottom: 4 }}>
                        {l.title}
                      </div>
                      <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4, marginBottom: 10 }}>
                        {l.description}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textLight, fontWeight: 500 }}>
                        <span>{l.items.length} imora</span>
                        <span>+{l.xpReward} XP</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
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
  padding: '10px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
};

const backBtn = {
  background: theme.surface,
  border: `1px solid ${theme.borderStrong}`,
  color: theme.textMuted,
  padding: '6px 12px',
  borderRadius: theme.radiusSm,
  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
};

const contentStyle = {
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  padding: '20px 24px 40px',
};

const levelHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  marginBottom: 10,
  paddingBottom: 8,
  borderBottom: `2px solid ${theme.border}`,
};

const lessonsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 10,
};

function lessonCardStyle(done, locked) {
  return {
    background: done ? `${theme.accent}08` : locked ? theme.bg : theme.surface,
    border: `1px solid ${done ? theme.accent + '50' : theme.border}`,
    borderRadius: theme.radius,
    padding: '14px 16px',
    cursor: locked ? 'not-allowed' : 'pointer',
    opacity: locked ? 0.55 : 1,
    color: 'inherit',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'all 0.15s',
    width: '100%',
    boxShadow: theme.shadow,
  };
}

const completedBadge = {
  background: theme.accent,
  color: '#fff',
  borderRadius: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
};
