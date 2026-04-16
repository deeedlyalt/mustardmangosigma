import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { bannerItems } from '@/data/shopItems';
import PageHeader from '@/components/PageHeader';
import BottomNav from '@/components/BottomNav';
import { Star, Swords, Crown, Medal, Coins, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SortBy = 'xp' | 'duels';

interface DuelWinEntry {
  user_id: string;
  display_name: string;
  wins: number;
  equipped_banner: string | null;
}

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  xp: number;
  streak: number;
  equipped_banner: string | null;
  coins: number;
}

const getBannerGradient = (bannerId: string | null): string | null => {
  if (!bannerId) return null;
  const b = bannerItems.find(bi => bi.id === bannerId);
  return b ? b.gradient : null;
};

const LeaderboardPage = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>('xp');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [duelEntries, setDuelEntries] = useState<DuelWinEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      if (sortBy === 'xp') {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, display_name, xp, streak, equipped_banner, coins')
          .order('xp', { ascending: false })
          .limit(50);
        if (!error && data) setEntries(data as any);
      } else {
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
              .select('user_id, display_name, equipped_banner')
              .in('user_id', userIds);

            const duelList: DuelWinEntry[] = (profiles || []).map((p: any) => ({
              user_id: p.user_id,
              display_name: p.display_name,
              wins: winMap.get(p.user_id) || 0,
              equipped_banner: p.equipped_banner,
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

  const renderEntry = (userId: string, displayName: string, equippedBanner: string | null, isMe: boolean, rightContent: React.ReactNode, index: number) => {
    const gradient = getBannerGradient(equippedBanner);
    return (
      <motion.div
        key={userId}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`relative flex items-center gap-3 p-3 rounded-xl border shadow-sm overflow-hidden ${isMe ? 'border-primary bg-primary/10' : 'bg-card border-border'}`}
      >
        {gradient && (
          <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10`} />
        )}
        <div className="relative w-6 flex justify-center">{getRankIcon(index)}</div>
        <div className="relative flex-1 min-w-0">
          <p className={`text-sm font-bold truncate ${isMe ? 'text-primary' : 'text-foreground'}`}>
            {displayName} {isMe && '(du)'}
          </p>
        </div>
        <div className="relative">{rightContent}</div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <PageHeader title="Topplista" subtitle="Vem pluggar mest?" icon="🏆" showBack={false} />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-sm font-bold text-foreground"
          >
            <ShoppingBag size={16} className="text-yellow-500" /> Shop
          </motion.button>
        </div>

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
              {entries.map((entry, i) => {
                const isMe = entry.user_id === user?.id;
                return renderEntry(
                  entry.user_id,
                  entry.display_name,
                  entry.equipped_banner,
                  isMe,
                  <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                    <Star size={14} className="text-yellow-500" /> {entry.xp} XP
                  </div>,
                  i
                );
              })}
            </div>
          )
        ) : (
          duelEntries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">Inga dueller avklarade ännu!</div>
          ) : (
            <div className="space-y-2">
              {duelEntries.map((entry, i) => {
                const isMe = entry.user_id === user?.id;
                return renderEntry(
                  entry.user_id,
                  entry.display_name,
                  entry.equipped_banner,
                  isMe,
                  <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                    <Swords size={14} className="text-primary" /> {entry.wins} vinster
                  </div>,
                  i
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
