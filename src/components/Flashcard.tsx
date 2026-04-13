import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard as FlashcardType } from '@/data/chapters';
import { Check, X } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  mastery?: 'mastered' | 'review' | 'unseen';
  onMastered: () => void;
  onReview: () => void;
}

const Flashcard = ({ card, mastery = 'unseen', onMastered, onReview }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  const masteryColor = mastery === 'mastered' ? 'bg-success' : mastery === 'review' ? 'bg-error' : 'bg-muted-foreground/30';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flashcard-flip w-full h-64 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard-inner w-full h-full relative ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-front absolute inset-0 bg-card rounded-2xl shadow-lg border border-border p-6 flex flex-col items-center justify-center">
            <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${masteryColor}`} />
            <p className="text-xs text-muted-foreground mb-2">Tryck för att vända</p>
            <h3 className="text-xl font-bold text-foreground text-center">{card.term}</h3>
          </div>
          <div className="flashcard-back absolute inset-0 bg-card rounded-2xl shadow-lg border border-border p-6 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground mb-2">Definition</p>
            <p className="text-base text-foreground text-center leading-relaxed">{card.definition}</p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-4 justify-center mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onReview(); setFlipped(false); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-semibold shadow-md"
            >
              <X size={18} /> Repetera igen
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onMastered(); setFlipped(false); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-success text-primary-foreground rounded-xl font-semibold shadow-md"
            >
              <Check size={18} /> Kan det!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcard;
