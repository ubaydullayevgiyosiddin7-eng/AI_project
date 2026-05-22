// XP, level, dars progress — localStorage
import { useState, useEffect, useCallback } from 'react';

const KEY = 'signhand_progress';

const DEFAULT = {
  xp: 0,
  level: 1,
  completedLessons: {},   // { lesson_1: { score, completedAt } }
  learnedLetters: {},     // { L: 5 } — necha marta o'rganilgan
  certificates: [],
  streak: 0,
  lastActivityDate: null,
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch { return { ...DEFAULT }; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

function xpToLevel(xp) {
  // Har 100 xp = 1 level
  return Math.floor(xp / 100) + 1;
}

export default function useProgress() {
  const [progress, setProgress] = useState(load);

  useEffect(() => { save(progress); }, [progress]);

  const addXP = useCallback((amount) => {
    setProgress(p => {
      const xp = p.xp + amount;
      const level = xpToLevel(xp);
      return { ...p, xp, level };
    });
  }, []);

  const completeLesson = useCallback((lessonId, score, xpReward, certificate = null) => {
    setProgress(p => {
      const completed = { ...p.completedLessons, [lessonId]: { score, completedAt: Date.now() } };
      const certs = certificate && !p.certificates.includes(certificate)
        ? [...p.certificates, certificate]
        : p.certificates;
      const xp = p.xp + xpReward;
      return {
        ...p,
        completedLessons: completed,
        certificates: certs,
        xp,
        level: xpToLevel(xp),
        lastActivityDate: Date.now(),
      };
    });
  }, []);

  const learnLetter = useCallback((letterId) => {
    setProgress(p => ({
      ...p,
      learnedLetters: { ...p.learnedLetters, [letterId]: (p.learnedLetters[letterId] || 0) + 1 },
    }));
  }, []);

  const resetAll = useCallback(() => {
    setProgress({ ...DEFAULT });
  }, []);

  const isLessonComplete = useCallback((lessonId) => {
    return !!progress.completedLessons[lessonId];
  }, [progress.completedLessons]);

  const getLessonScore = useCallback((lessonId) => {
    return progress.completedLessons[lessonId]?.score || 0;
  }, [progress.completedLessons]);

  return {
    progress,
    addXP,
    completeLesson,
    learnLetter,
    resetAll,
    isLessonComplete,
    getLessonScore,
  };
}
