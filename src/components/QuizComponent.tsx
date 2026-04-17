import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from '@/data/chapters';
import { useProgress } from '@/context/ProgressContext';
import { ChapterId } from '@/data/chapters';
import confetti from 'canvas-confetti';
import { ArrowRight, RotateCcw, Check, Eye } from 'lucide-react';

interface QuizComponentProps {
  questions: QuizQuestion[];
  chapterId: ChapterId | 'mixed';
  onComplete: () => void;
}

const QuizComponent = ({ questions, chapterId, onComplete }: QuizComponentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selfAssessed, setSelfAssessed] = useState<boolean | null>(null);
  const [results, setResults] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [retryMode, setRetryMode] = useState(false);

  const { addQuizResult, updateStreak } = useProgress();

  const activeQuestions = useMemo(() => {
    const base = !retryMode
      ? questions
      : questions.filter(q => results.filter(r => !r.correct).map(r => r.questionId).includes(q.id));
    // Shuffle options per question so the correct answer's position is random
    return base.map(q => {
      if (q.type === 'multiple-choice' && q.options) {
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        return { ...q, options: shuffledOptions };
      }
      return q;
    });
  }, [retryMode, questions, results]);

  const current = activeQuestions[currentIndex];
  const isLastQuestion = currentIndex === activeQuestions.length - 1;

  const handleMcAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleOpenEndedReveal = () => {
    setShowAnswer(true);
  };

  const handleSelfAssess = (correct: boolean) => {
    setSelfAssessed(correct);
  };

  const handleNext = () => {
    const isCorrect = current.type === 'multiple-choice'
      ? selectedAnswer === current.correctAnswer
      : selfAssessed === true;

    setResults(prev => [...prev, { questionId: current.id, correct: isCorrect }]);

    if (isLastQuestion) {
      const allResults = [...results, { questionId: current.id, correct: isCorrect }];
      const correct = allResults.filter(r => r.correct).length;
      const xp = correct * 10;
      addQuizResult({ chapterId, score: correct, total: allResults.length, xpEarned: xp });
      updateStreak();
      setQuizDone(true);
      if (correct === allResults.length) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else if (correct >= allResults.length * 0.7) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      setSelfAssessed(null);
    }
  };

  const handleRetry = () => {
    const wrongIds = results.filter(r => !r.correct).map(r => r.questionId);
    if (wrongIds.length === 0) return;
    setRetryMode(true);
    setCurrentIndex(0);
    setResults([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setSelfAssessed(null);
    setQuizDone(false);
  };

  if (quizDone) {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const percentage = Math.round((correct / total) * 100);
    const wrongCount = total - correct;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-6xl mb-4">
          {percentage === 100 ? '🏆' : percentage >= 70 ? '🎉' : '💪'}
        </motion.div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2">Quiz klart!</h2>
        <p className="text-lg text-muted-foreground mb-1">{correct} av {total} rätt ({percentage}%)</p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xp font-bold text-lg mb-6 animate-pulse-glow inline-block px-4 py-1 rounded-full">
          +{correct * 10} XP
        </motion.p>
        <div className="flex gap-3 justify-center flex-wrap">
          {wrongCount > 0 && (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRetry} className="flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-semibold">
              <RotateCcw size={18} /> Repetera fel ({wrongCount} st)
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold">
            Tillbaka
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">Fråga {currentIndex + 1} / {activeQuestions.length}</span>
        <div className="flex-1 mx-4 bg-muted rounded-full h-2">
          <motion.div className="bg-primary h-2 rounded-full" animate={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-card rounded-2xl shadow-lg border border-border p-6">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-3 inline-block">
            {current.type === 'multiple-choice' ? 'Flerval' : 'Öppen fråga'}
          </span>
          <h3 className="text-lg font-bold text-foreground mb-5">{current.question}</h3>

          {current.type === 'multiple-choice' && current.options && (
            <div className="space-y-3">
              {current.options.map((opt) => {
                let optionClass = 'bg-muted hover:bg-muted/80 text-foreground border-transparent';
                if (showAnswer) {
                  if (opt === current.correctAnswer) optionClass = 'bg-success/20 text-foreground border-success';
                  else if (opt === selectedAnswer) optionClass = 'bg-destructive/20 text-foreground border-destructive animate-shake';
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
                  onClick={handleOpenEndedReveal}
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
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSelfAssess(true)} className="flex items-center gap-2 px-4 py-2 bg-success text-primary-foreground rounded-xl font-semibold">
                        <Check size={16} /> Jag hade rätt
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSelfAssess(false)} className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-xl font-semibold">
                        Jag hade fel
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
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold">
                {isLastQuestion ? 'Se resultat' : 'Nästa'} <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizComponent;
