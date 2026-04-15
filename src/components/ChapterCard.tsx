import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Chapter } from '@/data/chapters';
import { useProgress } from '@/context/ProgressContext';

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

const ChapterCard = ({ chapter, index }: ChapterCardProps) => {
  const navigate = useNavigate();
  const { getChapterMastery } = useProgress();
  const mastery = getChapterMastery(chapter.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/chapter/${chapter.id}`)}
      className={`${chapter.colorClass} rounded-2xl p-5 cursor-pointer shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10 text-7xl flex items-center justify-center">
        {chapter.icon}
      </div>
      <div className="relative z-10">
        <span className="text-4xl mb-2 block">{chapter.icon}</span>
        <h3 className="text-lg font-extrabold text-primary-foreground mb-1">{chapter.title}</h3>
        <p className="text-sm text-primary-foreground/80 mb-3">{chapter.subtitle}</p>
        <div className="w-full bg-primary-foreground/20 rounded-full h-2.5">
          <motion.div
            className="bg-primary-foreground/90 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${mastery}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          />
        </div>
        <p className="text-xs text-primary-foreground/70 mt-1">{mastery}% bemästrat</p>
      </div>
    </motion.div>
  );
};

export default ChapterCard;
