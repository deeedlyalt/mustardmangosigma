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

export interface ActiveBoost {
  type: 'double-xp';
  expiresAt: string; // ISO date string
}

interface ProgressState {
  xp: number;
  streak: number;
  coins: number;
  lastStudyDate: string | null;
  cardMastery: Record<ChapterId, CardMastery>;
  quizResults: QuizResult[];
  badges: Badge[];
  chaptersStudied: ChapterId[];
  activeBoosts: ActiveBoost[];
  ownedItems: string[]; // item IDs
  equippedBanner: string | null;
}

const defaultBadges: Badge[] = [
  { id: 'first-quiz', title: 'Första quizet!', description: 'Klara ditt första quiz', icon: '🎯', earned: false },
  { id: 'quiz-5', title: 'Quizfantast', description: 'Klara 5 quiz', icon: '📝', earned: false },
  { id: 'quiz-20', title: 'Quizmaskin', description: 'Klara 20 quiz', icon: '🤖', earned: false },
  { id: 'quiz-50', title: 'Quizlegend', description: 'Klara 50 quiz', icon: '👑', earned: false },
  { id: 'perfect-quiz', title: 'Perfekt!', description: 'Få alla rätt på ett quiz', icon: '✨', earned: false },
  { id: 'perfect-3', title: 'Trippel perfekt', description: 'Få 3 perfekta quiz', icon: '💎', earned: false },
  { id: 'all-chapters', title: 'Utforskaren', description: 'Studera alla 6 kapitel', icon: '🗺️', earned: false },
  { id: 'xp-100', title: 'Hundralansen', description: 'Samla 100 XP', icon: '💯', earned: false },
  { id: 'xp-250', title: 'Kvartsprofilen', description: 'Samla 250 XP', icon: '🎖️', earned: false },
  { id: 'xp-500', title: 'Halvtusen', description: 'Samla 500 XP', icon: '🌟', earned: false },
  { id: 'xp-1000', title: 'Tusentaktikern', description: 'Samla 1000 XP', icon: '🏆', earned: false },
  { id: 'xp-2000', title: 'Dubbeltusen', description: 'Samla 2000 XP', icon: '🚀', earned: false },
  { id: 'streak-3', title: 'Trestreak!', description: '3 dagars streak', icon: '🔥', earned: false },
  { id: 'streak-7', title: 'Veckokrigaren', description: '7 dagars streak', icon: '⚡', earned: false },
  { id: 'streak-14', title: 'Tvåveckorshjälte', description: '14 dagars streak', icon: '🌋', earned: false },
  { id: 'streak-30', title: 'Månadsmästare', description: '30 dagars streak', icon: '🏅', earned: false },
  { id: 'flashcard-master', title: 'Kortmästaren', description: 'Bemästra alla kort i ett kapitel', icon: '🃏', earned: false },
  { id: 'flashcard-all', title: 'Totalmästare', description: 'Bemästra alla kort i alla kapitel', icon: '🎓', earned: false },
];

const defaultState: ProgressState = {
  xp: 0,
  streak: 0,
  coins: 0,
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
  activeBoosts: [],
  ownedItems: [],
  equippedBanner: null,
};

interface ProgressContextType extends ProgressState {
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  setCardMastery: (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => void;
  addQuizResult: (result: Omit<QuizResult, 'date'>) => void;
  markChapterStudied: (chapterId: ChapterId) => void;
  getChapterMastery: (chapterId: ChapterId) => number;
  getLevel: () => { name: string; level: number; nextXp: number; icon: string };
  updateStreak: () => void;
  activateBoost: (type: 'double-xp', durationMinutes: number) => void;
  getXpMultiplier: () => number;
  hasActiveBoost: (type: 'double-xp') => boolean;
  purchaseItem: (itemId: string) => void;
  ownsItem: (itemId: string) => boolean;
  equipBanner: (bannerId: string | null) => void;
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
          coins: (data as any).coins || 0,
          lastStudyDate: data.last_study_date,
          cardMastery: { ...defaultState.cardMastery, ...dbMastery },
          quizResults: (data.quiz_results as any) || [],
          badges: (data.badges as any)?.length ? (data.badges as any) : defaultBadges,
          chaptersStudied: (data.chapters_studied as any) || [],
          activeBoosts: (data as any).active_boosts || [],
          ownedItems: (data as any).owned_items || [],
          equippedBanner: (data as any).equipped_banner || null,
        });
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const saveToDb = useCallback((s: ProgressState) => {
    if (!user) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await supabase
        .from('profiles')
        .update({
          xp: s.xp,
          streak: s.streak,
          coins: s.coins,
          last_study_date: s.lastStudyDate,
          card_mastery: s.cardMastery as any,
          quiz_results: s.quizResults as any,
          badges: s.badges as any,
          chapters_studied: s.chaptersStudied as any,
          active_boosts: s.activeBoosts as any,
          owned_items: s.ownedItems as any,
          equipped_banner: s.equippedBanner,
        } as any)
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
    if (s.quizResults.length >= 5) earn('quiz-5');
    if (s.quizResults.length >= 20) earn('quiz-20');
    if (s.quizResults.length >= 50) earn('quiz-50');
    if (s.chaptersStudied.length >= 6) earn('all-chapters');
    if (s.xp >= 100) earn('xp-100');
    if (s.xp >= 250) earn('xp-250');
    if (s.xp >= 500) earn('xp-500');
    if (s.xp >= 1000) earn('xp-1000');
    if (s.xp >= 2000) earn('xp-2000');
    if (s.streak >= 3) earn('streak-3');
    if (s.streak >= 7) earn('streak-7');
    if (s.streak >= 14) earn('streak-14');
    if (s.streak >= 30) earn('streak-30');
    const perfectQuizzes = s.quizResults.filter(r => r.score === r.total && r.total > 0);
    if (perfectQuizzes.length >= 1) earn('perfect-quiz');
    if (perfectQuizzes.length >= 3) earn('perfect-3');
    const chapterIds: ChapterId[] = ['grundbiologi', 'ekologi', 'kroppen', 'nervsystemet', 'genetik', 'evolution'];
    let allChaptersMastered = true;
    for (const ch of chapterIds) {
      const mastery = s.cardMastery?.[ch];
      if (!mastery) { allChaptersMastered = false; continue; }
      const values = Object.values(mastery);
      if (values.length >= 5 && values.every(v => v === 'mastered')) {
        earn('flashcard-master');
      } else {
        allChaptersMastered = false;
      }
    }
    if (allChaptersMastered) earn('flashcard-all');
    return { ...s, badges };
  }, []);

  const updateAndSave = useCallback((updater: (s: ProgressState) => ProgressState) => {
    setState(prev => {
      const next = updater(prev);
      saveToDb(next);
      return next;
    });
  }, [saveToDb]);

  const getActiveBoosts = (boosts: ActiveBoost[]): ActiveBoost[] => {
    const now = new Date().toISOString();
    return boosts.filter(b => b.expiresAt > now);
  };

  const getXpMultiplier = (): number => {
    const active = getActiveBoosts(state.activeBoosts);
    const hasShopBoost = active.some(b => b.type === 'double-xp');
    return hasShopBoost ? 2 : 1;
  };

  const hasActiveBoost = (type: 'double-xp'): boolean => {
    return getActiveBoosts(state.activeBoosts).some(b => b.type === type);
  };

  const addXp = (amount: number) => updateAndSave(s => {
    const multiplier = getActiveBoosts(s.activeBoosts).some(b => b.type === 'double-xp') ? 2 : 1;
    return checkBadges({ ...s, xp: s.xp + amount * multiplier });
  });

  const addCoins = (amount: number) => updateAndSave(s => ({ ...s, coins: s.coins + amount }));

  const spendCoins = (amount: number): boolean => {
    let success = false;
    updateAndSave(s => {
      if (s.coins >= amount) {
        success = true;
        return { ...s, coins: s.coins - amount };
      }
      return s;
    });
    return success;
  };

  const activateBoost = (type: 'double-xp', durationMinutes: number) => {
    updateAndSave(s => {
      const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      const cleaned = getActiveBoosts(s.activeBoosts);
      return { ...s, activeBoosts: [...cleaned, { type, expiresAt }] };
    });
  };

  const purchaseItem = (itemId: string) => {
    updateAndSave(s => {
      if (s.ownedItems.includes(itemId)) return s;
      return { ...s, ownedItems: [...s.ownedItems, itemId] };
    });
  };

  const ownsItem = (itemId: string): boolean => state.ownedItems.includes(itemId);

  const equipBanner = (bannerId: string | null) => {
    updateAndSave(s => ({ ...s, equippedBanner: bannerId }));
  };

  const setCardMastery = (chapterId: ChapterId, cardId: string, status: 'mastered' | 'review') => {
    updateAndSave(s => {
      const newMastery = { ...s.cardMastery, [chapterId]: { ...s.cardMastery[chapterId], [cardId]: status } };
      return checkBadges({ ...s, cardMastery: newMastery });
    });
  };

  const addQuizResult = (result: Omit<QuizResult, 'date'>) => {
    updateAndSave(s => {
      const newResult = { ...result, date: new Date().toISOString() };
      const multiplier = getActiveBoosts(s.activeBoosts).some(b => b.type === 'double-xp') ? 2 : 1;
      return checkBadges({ ...s, quizResults: [...s.quizResults, newResult], xp: s.xp + result.xpEarned * multiplier });
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
    <ProgressContext.Provider value={{
      ...state,
      addXp, addCoins, spendCoins,
      setCardMastery, addQuizResult, markChapterStudied,
      getChapterMastery, getLevel, updateStreak,
      activateBoost, getXpMultiplier, hasActiveBoost,
      purchaseItem, ownsItem, equipBanner,
      loaded,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
