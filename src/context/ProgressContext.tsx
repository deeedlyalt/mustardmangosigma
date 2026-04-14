import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { ChapterId } from '@/data/chapters';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

const defaultState: ProgressState = {
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

interface ProgressContextType extends ProgressState {
  addXp: (amount: number) => void;
  setCardMastery: (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => void;
  addQuizResult: (result: Omit<QuizResult, 'date'>) => void;
  markChapterStudied: (chapterId: ChapterId) => void;
  getChapterMastery: (chapterId: ChapterId) => number;
  getLevel: () => { name: string; level: number; nextXp: number; icon: string };
  updateStreak: () => void;
  loaded: boolean;
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
  const { user } = useAuth();
  const [state, setState] = useState<ProgressState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Load from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setState(defaultState);
      setLoaded(true);
      return;
    }
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setState({
          xp: data.xp,
          streak: data.streak,
          lastStudyDate: data.last_study_date,
          cardMastery: (data.card_mastery as any) || defaultState.cardMastery,
          quizResults: (data.quiz_results as any) || [],
          badges: (data.badges as any)?.length ? (data.badges as any) : defaultBadges,
          chaptersStudied: (data.chapters_studied as any) || [],
        });
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  // Save to Supabase (debounced)
  const saveToDb = useCallback((s: ProgressState) => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await supabase
        .from('profiles')
        .update({
          xp: s.xp,
          streak: s.streak,
          last_study_date: s.lastStudyDate,
          card_mastery: s.cardMastery as any,
          quiz_results: s.quizResults as any,
          badges: s.badges as any,
          chapters_studied: s.chaptersStudied as any,
        })
        .eq('user_id', user.id);
    }, 500);
  }, [user]);

  const checkBadges = useCallback((s: ProgressState): ProgressState => {
    const badges = [...(s.badges?.length ? s.badges : defaultBadges)];
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

  const updateAndSave = useCallback((updater: (s: ProgressState) => ProgressState) => {
    setState(prev => {
      const next = updater(prev);
      saveToDb(next);
      return next;
    });
  }, [saveToDb]);

  const addXp = (amount: number) => updateAndSave(s => checkBadges({ ...s, xp: s.xp + amount }));

  const setCardMastery = (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => {
    updateAndSave(s => {
      const newMastery = { ...s.cardMastery, [chapterId]: { ...s.cardMastery[chapterId], [cardId]: status } };
      return checkBadges({ ...s, cardMastery: newMastery });
    });
  };

  const addQuizResult = (result: Omit<QuizResult, 'date'>) => {
    updateAndSave(s => {
      const newResult = { ...result, date: new Date().toISOString() };
      return checkBadges({ ...s, quizResults: [...s.quizResults, newResult], xp: s.xp + result.xpEarned });
    });
  };

  const markChapterStudied = (chapterId: ChapterId) => {
    updateAndSave(s => {
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
    return { name: current.name, level: idx + 1, nextXp: next ? next.minXp : current.minXp, icon: current.icon };
  };

  const updateStreak = () => {
    updateAndSave(s => {
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
    <ProgressContext.Provider value={{ ...state, addXp, setCardMastery, addQuizResult, markChapterStudied, getChapterMastery, getLevel, updateStreak, loaded }}>
      {children}
    </ProgressContext.Provider>
  );
};
