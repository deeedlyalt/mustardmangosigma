import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ChapterId } from '@/data/chapters';

interface CardMastery {
  [cardId: string]: 'mastered' | 'review' | 'unseen';
}

interface QuizResult {
  date: string;
  chapterId: ChapterId | 'mixed';
  score: number;
  total: number;
  xpEarned: number;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface ProgressState {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  cardMastery: Record<ChapterId, CardMastery>;
  quizResults: QuizResult[];
  badges: Badge[];
  chaptersStudied: ChapterId[];
}

const defaultBadges: Badge[] = [
  { id: 'first-quiz', title: 'Första quizet!', description: 'Klara ditt första quiz', icon: '🎯', earned: false },
  { id: 'all-chapters', title: 'Utforskaren', description: 'Studera alla 6 kapitel', icon: '🗺️', earned: false },
  { id: 'xp-100', title: 'Hundralansen', description: 'Samla 100 XP', icon: '💯', earned: false },
  { id: 'xp-500', title: 'Halvtusen', description: 'Samla 500 XP', icon: '🌟', earned: false },
  { id: 'xp-1000', title: 'Tusentaktikern', description: 'Samla 1000 XP', icon: '🏆', earned: false },
  { id: 'streak-3', title: 'Trestreak!', description: '3 dagars streak', icon: '🔥', earned: false },
  { id: 'streak-7', title: 'Veckokrigaren', description: '7 dagars streak', icon: '⚡', earned: false },
  { id: 'perfect-quiz', title: 'Perfekt!', description: 'Få alla rätt på ett quiz', icon: '✨', earned: false },
  { id: 'flashcard-master', title: 'Kortmästaren', description: 'Bemästra alla kort i ett kapitel', icon: '🃏', earned: false },
];

const STORAGE_KEY = 'bio-study-progress';

const getInitialState = (): ProgressState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    cardMastery: {
      grundbiologi: {},
      ekologi: {},
      kroppen: {},
      nervsystemet: {},
      genetik: {},
      evolution: {},
    },
    quizResults: [],
    badges: defaultBadges,
    chaptersStudied: [],
  };
};

interface ProgressContextType extends ProgressState {
  addXp: (amount: number) => void;
  setCardMastery: (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => void;
  addQuizResult: (result: Omit<QuizResult, 'date'>) => void;
  markChapterStudied: (chapterId: ChapterId) => void;
  getChapterMastery: (chapterId: ChapterId) => number;
  getLevel: () => { name: string; level: number; nextXp: number; icon: string };
  updateStreak: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
};

const levels = [
  { name: 'Nybörjare', minXp: 0, icon: '🌱' },
  { name: 'Biologielev', minXp: 100, icon: '📖' },
  { name: 'Kunnig', minXp: 300, icon: '🧪' },
  { name: 'Expert', minXp: 600, icon: '🎓' },
  { name: 'Mästare', minXp: 1000, icon: '👑' },
];

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProgressState>(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const checkBadges = useCallback((s: ProgressState): ProgressState => {
    const badges = [...s.badges];
    const earn = (id: string) => {
      const b = badges.find(b => b.id === id);
      if (b && !b.earned) { b.earned = true; b.earnedDate = new Date().toISOString(); }
    };
    if (s.quizResults.length >= 1) earn('first-quiz');
    if (s.chaptersStudied.length >= 6) earn('all-chapters');
    if (s.xp >= 100) earn('xp-100');
    if (s.xp >= 500) earn('xp-500');
    if (s.xp >= 1000) earn('xp-1000');
    if (s.streak >= 3) earn('streak-3');
    if (s.streak >= 7) earn('streak-7');
    if (s.quizResults.some(r => r.score === r.total && r.total > 0)) earn('perfect-quiz');
    const chapterIds: ChapterId[] = ['grundbiologi', 'ekologi', 'kroppen', 'nervsystemet', 'genetik', 'evolution'];
    for (const ch of chapterIds) {
      const mastery = s.cardMastery[ch];
      const values = Object.values(mastery);
      if (values.length >= 5 && values.every(v => v === 'mastered')) { earn('flashcard-master'); break; }
    }
    return { ...s, badges };
  }, []);

  const addXp = (amount: number) => setState(s => checkBadges({ ...s, xp: s.xp + amount }));

  const setCardMastery = (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => {
    setState(s => {
      const newMastery = { ...s.cardMastery, [chapterId]: { ...s.cardMastery[chapterId], [cardId]: status } };
      return checkBadges({ ...s, cardMastery: newMastery });
    });
  };

  const addQuizResult = (result: Omit<QuizResult, 'date'>) => {
    setState(s => {
      const newResult = { ...result, date: new Date().toISOString() };
      return checkBadges({ ...s, quizResults: [...s.quizResults, newResult], xp: s.xp + result.xpEarned });
    });
  };

  const markChapterStudied = (chapterId: ChapterId) => {
    setState(s => {
      if (s.chaptersStudied.includes(chapterId)) return s;
      return checkBadges({ ...s, chaptersStudied: [...s.chaptersStudied, chapterId] });
    });
  };

  const getChapterMastery = (chapterId: ChapterId): number => {
    const mastery = state.cardMastery[chapterId];
    const values = Object.values(mastery);
    if (values.length === 0) return 0;
    const mastered = values.filter(v => v === 'mastered').length;
    return Math.round((mastered / values.length) * 100);
  };

  const getLevel = () => {
    let current = levels[0];
    for (const l of levels) {
      if (state.xp >= l.minXp) current = l;
    }
    const idx = levels.indexOf(current);
    const next = levels[idx + 1];
    return {
      name: current.name,
      level: idx + 1,
      nextXp: next ? next.minXp : current.minXp,
      icon: current.icon,
    };
  };

  const updateStreak = () => {
    setState(s => {
      const today = new Date().toDateString();
      if (s.lastStudyDate === today) return s;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = s.lastStudyDate === yesterday.toDateString();
      const newStreak = isConsecutive ? s.streak + 1 : 1;
      return checkBadges({ ...s, streak: newStreak, lastStudyDate: today });
    });
  };

  return (
    <ProgressContext.Provider value={{ ...state, addXp, setCardMastery, addQuizResult, markChapterStudied, getChapterMastery, getLevel, updateStreak }}>
      {children}
    </ProgressContext.Provider>
  );
};
