import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectionExercises } from '@/data/connections';
import { chapters } from '@/data/chapters';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Eye, EyeOff } from 'lucide-react';

const chapterColorMap: Record<string, string> = {
  grundbiologi: 'bg-chapter-grundbiologi',
  ekologi: 'bg-chapter-ekologi',
  kroppen: 'bg-chapter-kroppen',
  nervsystemet: 'bg-chapter-nervsystemet',
  genetik: 'bg-chapter-genetik',
  evolution: 'bg-chapter-evolution',
};

const ConnectionsPage = () => {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Sambandsövningar" subtitle="Koppla ihop kunskaper från olika kapitel" icon="🔗" />

        <div className="space-y-4">
          {connectionExercises.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl shadow-md border border-border p-5"
            >
              <h3 className="font-bold text-foreground mb-2">{ex.title}</h3>
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {ex.chapters.map(ch => {
                  const chapter = chapters.find(c => c.id === ch);
                  return (
                    <span key={ch} className={`${chapterColorMap[ch]} text-primary-foreground text-xs px-2.5 py-0.5 rounded-full font-semibold`}>
                      {chapter?.title}
                    </span>
                  );
                })}
              </div>
              <p className="text-foreground mb-4">{ex.prompt}</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleReveal(ex.id)}
                className="flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {revealedAnswers.has(ex.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                {revealedAnswers.has(ex.id) ? 'Dölj svar' : 'Visa modellsvar'}
              </motion.button>
              <AnimatePresence>
                {revealedAnswers.has(ex.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted rounded-xl p-4 mt-3 border border-border">
                      <p className="text-sm text-foreground leading-relaxed">{ex.modelAnswer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ConnectionsPage;
