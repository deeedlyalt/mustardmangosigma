import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Star, Swords, Crown, Medal } from 'lucide-react';

type SortBy = 'xp' | 'duels';

interface DuelWinEntry {
  user_id: string;
  display_name: string;
  wins: number;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp: number;
  streak: number;
}

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [duelEntries, setDuelEntries] = useState<DuelWinEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      if (sortBy === 'xp') {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, display_name, xp, streak')
          .order('xp', { ascending: false })
          .limit(50);
        if (!error && data) setEntries(data);
      } else {
        // Fetch duel wins
        const { data: duels } = await supabase
          .from('duels')
          .select('winner_id')
          .eq('status', 'completed')
          .not('winner_id', 'is', null);

        if (duels) {
          const winMap = new Map<string, number>();
          duels.forEach((d: any) => {
            winMap.set(d.winner_id, (winMap.get(d.winner_id) || 0) + 1);
          });

          const userIds = Array.from(winMap.keys());
          if (userIds.length > 0) {
            const { data: profiles } = await supabase
              .from('profiles')
              .select('user_id, display_name')
              .in('user_id', userIds);

            const duelList: DuelWinEntry[] = (profiles || []).map((p: any) => ({
              user_id: p.user_id,
              display_name: p.display_name,
              wins: winMap.get(p.user_id) || 0,
            })).sort((a: DuelWinEntry, b: DuelWinEntry) => b.wins - a.wins);

            setDuelEntries(duelList);
          } else {
            setDuelEntries([]);
          }
        }
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [sortBy]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="text-yellow-500" size={20} />;
    if (index === 1) return <Medal className="text-gray-400" size={20} />;
    if (index === 2) return <Medal className="text-amber-600" size={20} />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Topplista" subtitle="Vem pluggar mest?" icon="🏆" showBack={false} />

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSortBy('xp')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${sortBy === 'xp' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <Star size={16} /> XP
          </button>
          <button
            onClick={() => setSortBy('duels')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors ${sortBy === 'duels' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card border border-border text-muted-foreground'}`}
          >
            <Swords size={16} /> Dueller
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Laddar...</div>
        ) : sortBy === 'xp' ? (
          entries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Inga spelare ännu. Var först!</div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry: LeaderboardEntry, i: number) => {
                const isMe = entry.user_id === user?.id;
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm ${isMe ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
                  >
                    <div className="w-6 flex justify-center">{getRankIcon(i)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {entry.display_name} {isMe && '(du)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                      <Star size={14} className="text-xp" /> {entry.xp} XP
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          duelEntries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Inga dueller avklarade ännu!</div>
          ) : (
            <div className="space-y-2">
              {duelEntries.map((entry: DuelWinEntry, i: number) => {
                const isMe = entry.user_id === user?.id;
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm ${isMe ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
                  >
                    <div className="w-6 flex justify-center">{getRankIcon(i)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {entry.display_name} {isMe && '(du)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                      <Swords size={14} className="text-primary" /> {entry.wins} vinster
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;