import { motion } from 'framer-motion';
import { useProgress } from '@/context/ProgressContext';
import { Flame, Star, TrendingUp } from 'lucide-react';

const ProgressHeader = () => {
  const { xp, streak, getLevel } = useProgress();
  const level = getLevel();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
        <Star className="text-xp" size={20} />
        <div>
          <p className="text-xs text-muted-foreground">XP</p>
          <p className="text-sm font-bold text-foreground">{xp}</p>
        </div>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
        <Flame className="text-streak" size={20} />
        <div>
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-sm font-bold text-foreground">{streak} dagar</p>
        </div>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
        <TrendingUp className="text-primary" size={20} />
        <div>
          <p className="text-xs text-muted-foreground">Nivå</p>
          <p className="text-sm font-bold text-foreground">{level.icon} {level.name}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressHeader;
