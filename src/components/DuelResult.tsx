import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useProgress } from '@/context/ProgressContext';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Swords, Coins } from 'lucide-react';

interface DuelResultProps {
  duel: any;
  userId: string;
}

const DuelResult = ({ duel, userId }: DuelResultProps) => {
  const navigate = useNavigate();
  const { addCoins } = useProgress();
  const isCreator = duel.creator_id === userId;
  const myScore = isCreator ? duel.creator_score : duel.opponent_score;
  const opponentScore = isCreator ? duel.opponent_score : duel.creator_score;
  const myTime = isCreator ? duel.creator_time_ms : duel.opponent_time_ms;
  const opponentTime = isCreator ? duel.opponent_time_ms : duel.creator_time_ms;
  const iWon = duel.winner_id === userId;
  const isDraw = duel.winner_id === null;

  const [opponentName, setOpponentName] = useState('Motståndare');
  const [coinsAwarded, setCoinsAwarded] = useState(false);

  useEffect(() => {
    const opponentId = isCreator ? duel.opponent_id : duel.creator_id;
    if (opponentId) {
      supabase.from('profiles').select('display_name').eq('user_id', opponentId).maybeSingle().then(({ data }) => {
        if (data) setOpponentName(data.display_name);
      });
    }
  }, [duel, isCreator]);

  useEffect(() => {
    if (iWon && !coinsAwarded) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      addCoins(100);
      setCoinsAwarded(true);
    }
  }, [iWon, coinsAwarded, addCoins]);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-6xl mb-4">
        {iWon ? '🏆' : isDraw ? '🤝' : '😤'}
      </motion.div>

      <h2 className="text-2xl font-extrabold text-foreground mb-1">
        {iWon ? 'Du vann!' : isDraw ? 'Oavgjort!' : 'Du förlorade!'}
      </h2>
      <p className="text-muted-foreground mb-2">mot {opponentName}</p>

      {iWon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full mb-4"
        >
          <Coins size={18} className="text-yellow-500" />
          <span className="font-bold text-foreground">+100 coins!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-2xl border-2 ${iWon ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
          <p className="text-sm font-semibold text-muted-foreground mb-1">Du</p>
          <p className="text-3xl font-extrabold text-foreground flex items-center justify-center gap-1">
            <Trophy size={20} className="text-primary" /> {myScore}/10
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Clock size={12} /> {formatTime(myTime)}
          </p>
        </div>
        <div className={`p-4 rounded-2xl border-2 ${!iWon && !isDraw ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
          <p className="text-sm font-semibold text-muted-foreground mb-1">{opponentName}</p>
          <p className="text-3xl font-extrabold text-foreground flex items-center justify-center gap-1">
            <Trophy size={20} /> {opponentScore}/10
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Clock size={12} /> {formatTime(opponentTime)}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/duel')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold"
        >
          <Swords size={18} /> Ny duell
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leaderboard')}
          className="px-5 py-2.5 bg-card border border-border text-foreground rounded-xl font-semibold"
        >
          Topplista
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DuelResult;
