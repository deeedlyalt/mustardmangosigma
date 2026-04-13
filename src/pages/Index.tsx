import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { chapters } from '@/data/chapters';
import ChapterCard from '@/components/ChapterCard';
import ProgressHeader from '@/components/ProgressHeader';
import BottomNav from '@/components/BottomNav';
import { Shuffle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">🧬 BioPrepp</h1>
          <p className="text-sm text-muted-foreground">Plugga inför nationella provet i biologi – åk 9</p>
        </motion.div>

        <div className="mb-6">
          <ProgressHeader />
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/quiz/mixed')}
          className="w-full bg-gradient-to-r from-primary to-chapter-ekologi text-primary-foreground rounded-2xl p-4 shadow-lg mb-6 flex items-center justify-center gap-3 font-bold text-lg"
        >
          <Shuffle size={22} /> Snabbquiz – 10 slumpade frågor
        </motion.button>

        <h2 className="text-lg font-bold text-foreground mb-3">Kapitel</h2>
        <div className="grid grid-cols-2 gap-3">
          {chapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={i} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Index;
