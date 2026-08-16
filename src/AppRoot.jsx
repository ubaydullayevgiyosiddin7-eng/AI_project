// Surdo AI — asosiy routing
// State'lar: onboarding (birinchi marta) → dashboard → tanlangan rejim
// Ro'yxatdan o'tish yo'q — ilova hamma uchun ochiq (useAuth.js ga qarang)

import { useState } from 'react';
import useAuth from './hooks/useAuth';
import { loadCalibration } from './core/calibration';

import OnboardingPage    from './pages/OnboardingPage';
import DashboardPage     from './pages/DashboardPage';
import LessonsListPage   from './pages/LessonsListPage';
import LessonPage        from './pages/LessonPage';
import TranslatorPage    from './pages/TranslatorPage';
import PracticePage      from './pages/PracticePage';

// Ilova sayt ichiga (iframe) joylashtirilganmi? Shunda pastda suzib turuvchi
// dok kontentni yopmasligi uchun sahifa oxiriga bo'sh joy qo'shamiz.
const EMBEDDED = typeof window !== 'undefined' && window.self !== window.top;
const DOCK_SPACE = 118;

export default function AppRoot() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [activeLessonId, setActiveLessonId] = useState(null);
  // Synchronous initial — flash yo'q
  const [needsOnboarding, setNeedsOnboarding] = useState(() => !loadCalibration().calibrated);

  const goBack = () => setPage('dashboard');

  let content;

  if (needsOnboarding) {
    content = (
      <OnboardingPage
        onDone={() => setNeedsOnboarding(false)}
        onSkip={() => setNeedsOnboarding(false)}
      />
    );
  } else if (page === 'lessons') {
    content = (
      <LessonsListPage
        onBack={goBack}
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          setPage('lesson');
        }}
      />
    );
  } else if (page === 'lesson') {
    content = <LessonPage lessonId={activeLessonId} onBack={() => setPage('lessons')} />;
  } else if (page === 'translator') {
    content = <TranslatorPage onBack={goBack} />;
  } else if (page === 'practice') {
    content = <PracticePage onBack={goBack} />;
  } else {
    content = <DashboardPage user={user} onNavigate={setPage} />;
  }

  return (
    <>
      {content}
      {EMBEDDED && <div style={{ height: DOCK_SPACE, flexShrink: 0 }} aria-hidden="true" />}
    </>
  );
}
