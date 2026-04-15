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
  // Quiz
  { id: 'first-quiz', title: 'Första quizet!', description: 'Klara ditt första quiz', icon: '🎯', earned: false },
  { id: 'quiz-5', title: 'Quizfantast', description: 'Klara 5 quiz', icon: '📝', earned: false },
  { id: 'quiz-10', title: 'Quizveteran', description: 'Klara 10 quiz', icon: '📋', earned: false },
  { id: 'quiz-20', title: 'Quizmaskin', description: 'Klara 20 quiz', icon: '🤖', earned: false },
  { id: 'quiz-50', title: 'Quizlegend', description: 'Klara 50 quiz', icon: '👑', earned: false },
  { id: 'quiz-100', title: 'Quizgudomlig', description: 'Klara 100 quiz', icon: '⚜️', earned: false },
  // Perfekta quiz
  { id: 'perfect-quiz', title: 'Perfekt!', description: 'Få alla rätt på ett quiz', icon: '✨', earned: false },
  { id: 'perfect-3', title: 'Trippel perfekt', description: '3 perfekta quiz', icon: '💎', earned: false },
  { id: 'perfect-5', title: 'Femfaldig', description: '5 perfekta quiz', icon: '🌠', earned: false },
  { id: 'perfect-10', title: 'Ofelbar', description: '10 perfekta quiz', icon: '🔮', earned: false },
  // Kapitel & studier
  { id: 'first-chapter', title: 'Första kapitlet', description: 'Studera ditt första kapitel', icon: '📖', earned: false },
  { id: 'three-chapters', title: 'Halvvägs', description: 'Studera 3 kapitel', icon: '📚', earned: false },
  { id: 'all-chapters', title: 'Utforskaren', description: 'Studera alla 6 kapitel', icon: '🗺️', earned: false },
  // XP
  { id: 'xp-50', title: 'Första stegen', description: 'Samla 50 XP', icon: '👣', earned: false },
  { id: 'xp-100', title: 'Hundralansen', description: 'Samla 100 XP', icon: '💯', earned: false },
  { id: 'xp-250', title: 'Kvartsprofilen', description: 'Samla 250 XP', icon: '🎖️', earned: false },
  { id: 'xp-500', title: 'Halvtusen', description: 'Samla 500 XP', icon: '🌟', earned: false },
  { id: 'xp-1000', title: 'Tusentaktikern', description: 'Samla 1000 XP', icon: '🏆', earned: false },
  { id: 'xp-2000', title: 'Dubbeltusen', description: 'Samla 2000 XP', icon: '🚀', earned: false },
  { id: 'xp-5000', title: 'Femtusen!', description: 'Samla 5000 XP', icon: '💫', earned: false },
  // Streak
  { id: 'streak-3', title: 'Trestreak!', description: '3 dagars streak', icon: '🔥', earned: false },
  { id: 'streak-7', title: 'Veckokrigaren', description: '7 dagars streak', icon: '⚡', earned: false },
  { id: 'streak-14', title: 'Tvåveckorshjälte', description: '14 dagars streak', icon: '🌋', earned: false },
  { id: 'streak-30', title: 'Månadsmästare', description: '30 dagars streak', icon: '🏅', earned: false },
  { id: 'streak-60', title: 'Tvåmånadslegend', description: '60 dagars streak', icon: '🌊', earned: false },
  // Flashcards
  { id: 'flashcard-master', title: 'Kortmästaren', description: 'Bemästra alla kort i ett kapitel', icon: '🃏', earned: false },
  { id: 'flashcard-3', title: 'Tre kapitel klara', description: 'Bemästra kort i 3 kapitel', icon: '🎴', earned: false },
  { id: 'flashcard-all', title: 'Totalmästare', description: 'Bemästra alla kort i alla kapitel', icon: '🎓', earned: false },
  // Speciella
  { id: 'night-owl', title: 'Nattuggle', description: 'Studera efter kl 22', icon: '🦉', earned: false },
  { id: 'early-bird', title: 'Morgonpigg', description: 'Studera före kl 7', icon: '🐦', earned: false },
  { id: 'comeback', title: 'Comeback!', description: 'Kom tillbaka efter 3+ dagar', icon: '💪', earned: false },
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
        .maybeSingle();
      if (data) {
        const dbMastery = (data.card_mastery as any) || {};
        setState({
          xp: data.xp,
          streak: data.streak,
          lastStudyDate: data.last_study_date,
          cardMastery: { ...defaultState.cardMastery, ...dbMastery },
          quizResults: (data.quiz_results as any) || [],
          badges: (() => {
            const dbBadges = (data.badges as any) || [];
            if (!dbBadges.length) return defaultBadges;
            // Merge: keep earned status from DB, add any new badges
            const dbMap = new Map(dbBadges.map((b: Badge) => [b.id, b]));
            return defaultBadges.map(b => dbMap.has(b.id) ? { ...b, ...(dbMap.get(b.id) as Badge) } : b);
          })(),
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
    // Quiz milestones
    if (s.quizResults.length >= 1) earn('first-quiz');
    if (s.quizResults.length >= 5) earn('quiz-5');
    if (s.quizResults.length >= 10) earn('quiz-10');
    if (s.quizResults.length >= 20) earn('quiz-20');
    if (s.quizResults.length >= 50) earn('quiz-50');
    if (s.quizResults.length >= 100) earn('quiz-100');
    // Perfect quizzes
    const perfectQuizzes = s.quizResults.filter(r => r.score === r.total && r.total > 0);
    if (perfectQuizzes.length >= 1) earn('perfect-quiz');
    if (perfectQuizzes.length >= 3) earn('perfect-3');
    if (perfectQuizzes.length >= 5) earn('perfect-5');
    if (perfectQuizzes.length >= 10) earn('perfect-10');
    // Chapter milestones
    if (s.chaptersStudied.length >= 1) earn('first-chapter');
    if (s.chaptersStudied.length >= 3) earn('three-chapters');
    if (s.chaptersStudied.length >= 6) earn('all-chapters');
    // XP milestones
    if (s.xp >= 50) earn('xp-50');
    if (s.xp >= 100) earn('xp-100');
    if (s.xp >= 250) earn('xp-250');
    if (s.xp >= 500) earn('xp-500');
    if (s.xp >= 1000) earn('xp-1000');
    if (s.xp >= 2000) earn('xp-2000');
    if (s.xp >= 5000) earn('xp-5000');
    // Streak milestones
    if (s.streak >= 3) earn('streak-3');
    if (s.streak >= 7) earn('streak-7');
    if (s.streak >= 14) earn('streak-14');
    if (s.streak >= 30) earn('streak-30');
    if (s.streak >= 60) earn('streak-60');
    // Flashcard mastery
    const chapterIds: ChapterId[] = ['grundbiologi', 'ekologi', 'kroppen', 'nervsystemet', 'genetik', 'evolution'];
    let allChaptersMastered = true;
    let chaptersWithMastery = 0;
    for (const ch of chapterIds) {
      const mastery = s.cardMastery?.[ch];
      if (!mastery) { allChaptersMastered = false; continue; }
      const values = Object.values(mastery);
      if (values.length >= 5 && values.every(v => v === 'mastered')) {
        earn('flashcard-master');
        chaptersWithMastery++;
      } else {
        allChaptersMastered = false;
      }
    }
    if (chaptersWithMastery >= 3) earn('flashcard-3');
    if (allChaptersMastered) earn('flashcard-all');
    // Time-based badges
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) earn('night-owl');
    if (hour >= 5 && hour < 7) earn('early-bird');
    // Comeback badge
    if (s.lastStudyDate) {
      const last = new Date(s.lastStudyDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 3 && s.streak === 1) earn('comeback');
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
    const mastery = state.cardMastery?.[chapterId];
    if (!mastery) return 0;
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
