import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from '@/data/chapters';
import { ArrowRight, Eye, Check } from 'lucide-react';

interface DuelGameProps {
  duel: any;
  userId: string;
}

const DuelGame = ({ duel, userId }: DuelGameProps) => {
  const questions: QuizQuestion[] = duel.questions || [];
  const isCreator = duel.creator_id === userId;
  const startTimeRef = useRef(Date.now());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleMcAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNext = async () => {
    const isCorrect = current.type === 'multiple-choice'
      ? selectedAnswer === current.correctAnswer
      : selfAssessed === true;

    const newCorrect = correctCount + (isCorrect ? 1 : 0);
    if (isCorrect) setCorrectCount(newCorrect);

    if (isLast) {
      const timeTaken = Date.now() - startTimeRef.current;
      const updateData: any = {};
      if (isCreator) {
        updateData.creator_score = newCorrect;
        updateData.creator_time_ms = timeTaken;
      } else {
        updateData.opponent_score = newCorrect;
        updateData.opponent_time_ms = timeTaken;
      }

      // Check if opponent already finished
      const otherScoreField = isCreator ? 'opponent_score' : 'creator_score';
      if (duel[otherScoreField] !== null) {
        // Both done - determine winner
        const otherScore = duel[otherScoreField];
        const otherTime = isCreator ? duel.opponent_time_ms : duel.creator_time_ms;
        let winnerId: string | null = null;

        if (newCorrect > otherScore) winnerId = userId;
        else if (newCorrect < otherScore) winnerId = isCreator ? duel.opponent_id : duel.creator_id;
        else if (timeTaken < otherTime) winnerId = userId;
        else if (timeTaken > otherTime) winnerId = isCreator ? duel.opponent_id : duel.creator_id;

        updateData.status = 'completed';
        updateData.winner_id = winnerId;
        updateData.completed_at = new Date().toISOString();
      }

      await supabase.from('duels').update(updateData).eq('id', duel.id);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setSelfAssessed(null);
    }
  };

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Fråga {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex-1 mx-4 bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
              ⚔️ Duell
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {current.type === 'multiple-choice' ? 'Flerval' : 'Öppen fråga'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-5">{current.question}</h3>

          {current.type === 'multiple-choice' && current.options && (
            <div className="space-y-3">
              {current.options.map((opt) => {
                let optionClass = 'bg-muted hover:bg-muted/80 text-foreground border-transparent';
                if (showAnswer) {
                  if (opt === current.correctAnswer) optionClass = 'bg-success/20 text-foreground border-success';
                  else if (opt === selectedAnswer) optionClass = 'bg-destructive/20 text-foreground border-destructive';
                }
                return (
                  <motion.button
                    key={opt}
                    whileHover={!showAnswer ? { scale: 1.01 } : {}}
                    whileTap={!showAnswer ? { scale: 0.99 } : {}}
                    onClick={() => handleMcAnswer(opt)}
                    className={`w-full text-left p-4 rounded-xl font-medium border-2 transition-colors ${optionClass}`}
                    disabled={!!selectedAnswer}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          )}

          {current.type === 'open-ended' && (
            <div>
              {!showAnswer ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-accent text-accent-foreground rounded-xl font-semibold border border-border"
                >
                  <Eye size={18} /> Visa modellsvar
                </motion.button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="bg-muted rounded-xl p-4 mb-4 border border-border">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Modellsvar:</p>
                    <p className="text-foreground">{current.correctAnswer}</p>
                  </div>
                  {selfAssessed === null && (
                    <div className="flex gap-3">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelfAssessed(true)} className="flex items-center gap-2 px-4 py-2 bg-success text-primary-foreground rounded-xl font-semibold">
                        <Check size={16} /> Rätt
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSelfAssessed(false)} className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-xl font-semibold">
                        Fel
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {showAnswer && current.explanation && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-3 italic">
              💡 {current.explanation}
            </motion.p>
          )}

          {((current.type === 'multiple-choice' && showAnswer) || (current.type === 'open-ended' && selfAssessed !== null)) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold"
              >
                {isLast ? 'Skicka in' : 'Nästa'} <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DuelGame;
