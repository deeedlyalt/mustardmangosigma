import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapter, ChapterId } from '@/data/chapters';
import { useProgress } from '@/context/ProgressContext';
import Flashcard from '@/components/Flashcard';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { BookOpen, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ChapterPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const chapter = getChapter(chapterId as ChapterId);
  const { cardMastery, setCardMastery, markChapterStudied, addXp, updateStreak } = useProgress();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [tab, setTab] = useState<'flashcards' | 'vocabulary'>('flashcards');

  if (!chapter) return <div className="p-8 text-center text-foreground">Kapitlet hittades inte.</div>;

  markChapterStudied(chapter.id);
  const mastery = cardMastery[chapter.id];
  const currentCard = chapter.flashcards[currentCardIndex];

  const handleMastered = () => {
    setCardMastery(chapter.id, currentCard.id, 'mastered');
    addXp(5);
    updateStreak();
    if (currentCardIndex < chapter.flashcards.length - 1) setCurrentCardIndex(i => i + 1);
  };

  const handleReview = () => {
    setCardMastery(chapter.id, currentCard.id, 'review');
    if (currentCardIndex < chapter.flashcards.length - 1) setCurrentCardIndex(i => i + 1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title={chapter.title} subtitle={chapter.subtitle} icon={chapter.icon} />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/quiz/${chapter.id}`)}
          className={`w-full ${chapter.colorClass} text-primary-foreground rounded-2xl p-4 shadow-lg mb-6 flex items-center justify-center gap-3 font-bold`}
        >
          <HelpCircle size={20} /> Starta quiz – {chapter.title}
        </motion.button>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('flashcards')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'flashcards' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            <BookOpen size={16} /> Flashcards
          </button>
          <button
            onClick={() => setTab('vocabulary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${tab === 'vocabulary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Ordlista
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'flashcards' && (
            <motion.div key="flashcards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-semibold">
                  Kort {currentCardIndex + 1} / {chapter.flashcards.length}
                </span>
                <div className="flex gap-1">
                  {chapter.flashcards.map((c, i) => {
                    const m = mastery[c.id];
                    const dotColor = m === 'mastered' ? 'bg-success' : m === 'review' ? 'bg-error' : 'bg-muted-foreground/30';
                    return <div key={c.id} className={`w-2.5 h-2.5 rounded-full ${dotColor} ${i === currentCardIndex ? 'ring-2 ring-primary' : ''}`} />;
                  })}
                </div>
              </div>

              <Flashcard
                card={currentCard}
                mastery={mastery[currentCard.id] || 'unseen'}
                onMastered={handleMastered}
                onReview={handleReview}
              />

              <div className="flex justify-between mt-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
                  disabled={currentCardIndex === 0}
                  className="p-2 rounded-xl bg-muted text-muted-foreground disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentCardIndex(i => Math.min(chapter.flashcards.length - 1, i + 1))}
                  disabled={currentCardIndex === chapter.flashcards.length - 1}
                  className="p-2 rounded-xl bg-muted text-muted-foreground disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {tab === 'vocabulary' && (
            <motion.div key="vocabulary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-wrap gap-2">
                {chapter.vocabulary.map(word => (
                  <span key={word} className="px-3 py-1.5 bg-muted text-foreground rounded-full text-sm font-medium border border-border">
                    {word}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChapterPage;
