// SignHand — asosiy routing
// State'lar: login → onboarding (birinchi marta) → dashboard → tanlangan rejim

import { useState } from 'react';
import useAuth from './hooks/useAuth';
import { loadCalibration } from './core/calibration';

import LoginPage         from './pages/LoginPage';
import OnboardingPage    from './pages/OnboardingPage';
import DashboardPage     from './pages/DashboardPage';
import LessonsListPage   from './pages/LessonsListPage';
import LessonPage        from './pages/LessonPage';
import TranslatorPage    from './pages/TranslatorPage';
import PracticePage      from './pages/PracticePage';

export default function AppRoot() {
  const { user, isLoggedIn, logout } = useAuth();
  const [page, setPage] = useState('dashboard');
  const [activeLessonId, setActiveLessonId] = useState(null);
  // Synchronous initial — flash yo'q
  const [needsOnboarding, setNeedsOnboarding] = useState(() => !loadCalibration().calibrated);

  // ── 1. Login ekrani
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // ── 2. Onboarding (birinchi kirishda)
  if (needsOnboarding) {
    return (
      <OnboardingPage
        onDone={() => setNeedsOnboarding(false)}
        onSkip={() => setNeedsOnboarding(false)}
      />
    );
  }

  const goBack = () => setPage('dashboard');

  // ── 3. Sahifalar
  if (page === 'lessons') {
    return (
      <LessonsListPage
        onBack={goBack}
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          setPage('lesson');
        }}
      />
    );
  }

  if (page === 'lesson') {
    return (
      <LessonPage
        lessonId={activeLessonId}
        onBack={() => setPage('lessons')}
      />
    );
  }

  if (page === 'translator') {
    return <TranslatorPage onBack={goBack} />;
  }

  if (page === 'practice') {
    return <PracticePage onBack={goBack} />;
  }

  // Default: Dashboard
  return (
    <DashboardPage
      user={user}
      onNavigate={setPage}
      onLogout={logout}
    />
  );
}
