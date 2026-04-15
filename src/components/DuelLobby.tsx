import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { chapters } from '@/data/chapters';
import { Swords, Plus, Users } from 'lucide-react';

interface DuelLobbyProps {
  pendingDuel?: any;
}

const DuelLobby = ({ pendingDuel }: DuelLobbyProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [myDuels, setMyDuels] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchMyDuels = async () => {
      const { data } = await supabase
        .from('duels')
        .select('*')
        .or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setMyDuels(data);
    };
    fetchMyDuels();
  }, [user]);

  const createDuel = async () => {
    if (!user || creating) return;
    setCreating(true);

    const allQuestions = chapters.flatMap(c => c.questions.map(q => ({ ...q, chapterId: c.id })));
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    const { data, error } = await supabase
      .from('duels')
      .insert({
        creator_id: user.id,
        questions: selected as any,
        status: 'waiting',
      })
      .select()
      .single();

    setCreating(false);
    if (data) navigate(`/duel/${data.id}`);
  };

  const joinDuel = async () => {
    if (!user || !pendingDuel || joining) return;
    setJoining(true);

    await supabase
      .from('duels')
      .update({ opponent_id: user.id, status: 'active' })
      .eq('id', pendingDuel.id);

    setJoining(false);
    navigate(`/duel/${pendingDuel.id}`);
  };

  if (pendingDuel) {
    return (
      <div className="text-center py-8">
        <p className="text-6xl mb-4">⚔️</p>
        <h2 className="text-xl font-bold text-foreground mb-2">Du har blivit utmanad!</h2>
        <p className="text-muted-foreground mb-6">10 slumpmässiga frågor – den bästa vinner!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={joinDuel}
          disabled={joining}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg flex items-center gap-2 mx-auto"
        >
          <Swords size={20} /> {joining ? 'Ansluter...' : 'Acceptera duell!'}
        </motion.button>
      </div>
    );
  }

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={createDuel}
        disabled={creating}
        className="w-full p-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg flex items-center justify-center gap-3 mb-6 shadow-lg"
      >
        <Plus size={22} /> {creating ? 'Skapar...' : 'Starta en ny duell'}
      </motion.button>

      <p className="text-xs text-muted-foreground mb-4 text-center">
        Skapa en duell och dela länken med en vän. Ni får samma 10 frågor!
      </p>

      {myDuels.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
            <Users size={14} /> Dina senaste dueller
          </h3>
          <div className="space-y-2">
            {myDuels.map(d => {
              const isCreator = d.creator_id === user?.id;
              const statusLabel = d.status === 'waiting' ? '⏳ Väntar' : d.status === 'active' ? '🔥 Pågår' : '✅ Klar';
              let resultLabel = '';
              if (d.status === 'completed') {
                if (d.winner_id === user?.id) resultLabel = '🏆 Vinst';
                else if (d.winner_id === null) resultLabel = '🤝 Oavgjort';
                else resultLabel = '😞 Förlust';
              }
              return (
                <motion.button
                  key={d.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => navigate(`/duel/${d.id}`)}
                  className="w-full text-left p-3 bg-card rounded-xl border border-border flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-semibold text-foreground">{statusLabel}</span>
                    {resultLabel && <span className="text-sm ml-2">{resultLabel}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(d.created_at).toLocaleDateString('sv-SE')}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DuelLobby;
