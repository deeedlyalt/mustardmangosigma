import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from '@/data/chapters';
import { ArrowRight } from 'lucide-react';

interface DuelGameProps {
  duel: any;
  userId: string;
}

const DuelGame = ({ duel, userId }: DuelGameProps) => {
  const rawQuestions: QuizQuestion[] = duel.questions || [];
  // Shuffle options per question so correct answer position is random (per-client)
  const questions = useMemo(() => rawQuestions.map(q => {
    if (q.type === 'multiple-choice' && q.options) {
      return { ...q, options: [...q.options].sort(() => Math.random() - 0.5) };
    }
    return q;
  }), [duel.id]);
  const isCreator = duel.creator_id === userId;
  const startTimeRef = useRef(Date.now());

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleMcAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNext = async () => {
    const isCorrect = selectedAnswer === current.correctAnswer;

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
              Flerval
            </span>
          </div>

          <h3 className="text-lg font-bold text-foreground mb-5">{current.question}</h3>

          {current.options && (
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

          {showAnswer && current.explanation && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground mt-3 italic">
              💡 {current.explanation}
            </motion.p>
          )}

          {showAnswer && (
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
