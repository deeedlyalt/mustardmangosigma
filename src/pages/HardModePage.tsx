import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hardModeQuestions, HardModeQuestion } from '@/data/hardModeQuestions';
import { useProgress } from '@/context/ProgressContext';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Loader2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const HardModePage = () => {
  const navigate = useNavigate();
  const { ownsItem, addXp, updateStreak, hasActiveBoost } = useProgress();
  const [questions] = useState<HardModeQuestion[]>(() => 
    [...hardModeQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [grading, setGrading] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const current = questions[currentIndex];

  if (!ownsItem('hard-mode')) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4 text-center">
          <PageHeader title="Hard Mode" icon="💀" showBack />
          <p className="text-6xl mb-4">🔒</p>
          <p className="text-muted-foreground mb-4">Du måste köpa Hard Mode i shoppen först!</p>
          <button onClick={() => navigate('/shop')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold">
            Till shoppen
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userAnswer.trim() || grading) return;
    setGrading(true);

    try {
      const { data, error } = await supabase.functions.invoke('grade-answer', {
        body: {
          question: current.question,
          expectedAnswer: current.expectedAnswer,
          userAnswer: userAnswer.trim(),
        },
      });

      if (error) throw error;
      setFeedback(data);
      setResults(prev => [...prev, data.correct]);
    } catch (e) {
      console.error('Grading error:', e);
      setFeedback({ correct: false, feedback: 'Kunde inte bedöma svaret just nu. Försök igen.' });
    } finally {
      setGrading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      // Done
      const correct = results.length > 0 ? results.filter(Boolean).length : 0;
      // Hard mode gives double XP (20 per correct), stacks with boost
      const baseXp = correct * 20;
      addXp(baseXp);
      updateStreak();
      setDone(true);
      if (correct >= 7) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  if (done) {
    const correct = results.filter(Boolean).length;
    const baseXp = correct * 20;
    const multiplier = hasActiveBoost('double-xp') ? 2 : 1;
    const totalXp = baseXp * multiplier;

    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Hard Mode Resultat" icon="💀" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <p className="text-6xl mb-4">{correct >= 8 ? '🏆' : correct >= 5 ? '💪' : '📚'}</p>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">
              {correct} av {results.length} rätt!
            </h2>
            <p className="text-lg text-muted-foreground mb-1">Hard Mode ger dubbla XP-poäng!</p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-primary font-bold text-xl mb-1">
              +{totalXp} XP
            </motion.p>
            {multiplier > 1 && (
              <p className="text-xs text-muted-foreground mb-4">({baseXp} × {multiplier} med boost!)</p>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => navigate('/shop')} className="px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-semibold">
                Shoppen
              </button>
              <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold">
                Hem
              </button>
            </div>
          </motion.div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Hard Mode 💀" subtitle="Skrivfrågor – AI rättar ditt svar" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Fråga {currentIndex + 1} / {questions.length}
          </span>
          <div className="flex-1 mx-4 bg-muted rounded-full h-2">
            <motion.div
              className="bg-red-500 h-2 rounded-full"
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-card rounded-2xl shadow-lg border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-500">
                💀 Hard Mode
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {current.topic}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-5">{current.question}</h3>

            {!feedback ? (
              <div className="space-y-3">
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Skriv ditt svar här..."
                  className="w-full min-h-[120px] p-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={grading}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!userAnswer.trim() || grading}
                  className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {grading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> AI rättar...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Skicka svar
                    </>
                  )}
                </motion.button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`rounded-xl p-4 mb-4 border-2 ${feedback.correct ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}>
                  <p className="font-bold text-lg mb-1">
                    {feedback.correct ? '✅ Rätt!' : '❌ Inte riktigt'}
                  </p>
                  <p className="text-sm text-foreground">{feedback.feedback}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 mb-4 border border-border">
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Förväntat svar:</p>
                  <p className="text-sm text-foreground">{current.expectedAnswer}</p>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold"
                  >
                    {currentIndex === questions.length - 1 ? 'Se resultat' : 'Nästa'} <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default HardModePage;
