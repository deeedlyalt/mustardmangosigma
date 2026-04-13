import { motion } from 'framer-motion';
import { useProgress } from '@/context/ProgressContext';
import { chapters } from '@/data/chapters';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Star, Flame, TrendingUp } from 'lucide-react';

const ProgressPage = () => {
  const { xp, streak, badges, quizResults, getLevel, getChapterMastery } = useProgress();
  const level = getLevel();

  const nextLevelXp = level.nextXp;
  const xpProgress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Framsteg" subtitle="Din resa mot biologiexpertis" icon="📊" showBack={false} />

        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
            <Star className="mx-auto text-xp mb-1" size={24} />
            <p className="text-xl font-extrabold text-foreground">{xp}</p>
            <p className="text-xs text-muted-foreground">XP totalt</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
            <Flame className="mx-auto text-streak mb-1" size={24} />
            <p className="text-xl font-extrabold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Dagars streak</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm">
            <TrendingUp className="mx-auto text-primary mb-1" size={24} />
            <p className="text-xl font-extrabold text-foreground">{level.icon}</p>
            <p className="text-xs text-muted-foreground">{level.name}</p>
          </motion.div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 mb-6 shadow-sm">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-foreground">Nivå {level.level}: {level.name}</span>
            <span className="text-muted-foreground">{xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <motion.div className="bg-primary h-3 rounded-full" animate={{ width: `${xpProgress}%` }} transition={{ duration: 0.8 }} />
          </div>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Kapitelöversikt</h2>
        <div className="space-y-2 mb-6">
          {chapters.map((ch, i) => {
            const m = getChapterMastery(ch.id);
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">{ch.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{ch.title}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div className={`h-2 rounded-full transition-all`} style={{ width: `${m}%`, backgroundColor: `hsl(var(--ch-${ch.id}))` }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-muted-foreground">{m}%</span>
              </motion.div>
            );
          })}
        </div>

        <h2 className="text-lg font-bold text-foreground mb-3">Utmärkelser</h2>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-card rounded-xl border border-border p-3 text-center shadow-sm ${!badge.earned ? 'opacity-40 grayscale' : ''}`}
            >
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <p className="text-xs font-bold text-foreground">{badge.title}</p>
              <p className="text-[10px] text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        {quizResults.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-foreground mb-3">Senaste quiz</h2>
            <div className="space-y-2">
              {quizResults.slice(-5).reverse().map((r, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-3 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.chapterId === 'mixed' ? 'Snabbquiz' : chapters.find(c => c.id === r.chapterId)?.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('sv-SE')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{r.score}/{r.total}</p>
                    <p className="text-xs text-xp font-semibold">+{r.xpEarned} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default ProgressPage;
