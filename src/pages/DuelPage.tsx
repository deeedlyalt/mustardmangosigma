import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '../components/PageHeader';
import BottomNav from '../components/BottomNav';
import DuelLobby from '../components/DuelLobby';
// import DuelGame from '../components/DuelGame';
// import DuelResult from '../components/DuelResult';

const DuelPage = () => {
  const { duelId } = useParams<{ duelId: string }>();
  const { user } = useAuth();
  const [duel, setDuel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!duelId) { setLoading(false); return; }

    const fetchDuel = async () => {
      const { data } = await supabase.from('duels').select('*').eq('id', duelId).maybeSingle();
      setDuel(data);
      setLoading(false);
    };
    fetchDuel();

    const channel = supabase
      .channel(`duel-${duelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'duels', filter: `id=eq.${duelId}` }, (payload) => {
        setDuel(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [duelId]);

  if (!duelId) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Duellläge" subtitle="Utmana en vän!" icon="⚔️" />
          <DuelLobby />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <p className="text-muted-foreground">Laddar duell...</p>
      </div>
    );
  }

  if (!duel) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Duell" icon="⚔️" />
          <p className="text-center text-muted-foreground py-8">Duellen hittades inte.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const isCreator = duel.creator_id === user?.id;
  const myScore = isCreator ? duel.creator_score : duel.opponent_score;
  const myTime = isCreator ? duel.creator_time_ms : duel.opponent_time_ms;
  const iCompleted = myScore !== null && myTime !== null;

  if (duel.status === 'completed') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Duellresultat" icon="⚔️" />
          {/* <DuelResult duel={duel} userId={user?.id || ''} /> */}
          <p>Duel completed</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (duel.status === 'waiting' && !isCreator) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Duell" icon="⚔️" />
          <DuelLobby pendingDuel={duel} />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (duel.status === 'waiting' && isCreator) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Väntar på motståndare..." icon="⏳" />
          <div className="text-center py-10">
            <p className="text-6xl mb-4">⏳</p>
            <p className="text-muted-foreground mb-2">Dela denna länk med din vän:</p>
            <div className="bg-muted rounded-xl p-3 text-sm font-mono break-all mb-4">
              {window.location.href}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
            >
              📋 Kopiera länk
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // status === 'active'
  if (iCompleted) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container max-w-2xl py-6 px-4">
          <PageHeader title="Väntar på motståndare..." icon="⏳" />
          <div className="text-center py-10">
            <p className="text-6xl mb-4">✅</p>
            <p className="text-lg font-bold text-foreground mb-2">Du är klar!</p>
            <p className="text-muted-foreground">Väntar på att din motståndare ska bli klar...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-2xl py-6 px-4">
        <PageHeader title="Duell ⚔️" />
        {/* <DuelGame duel={duel} userId={user?.id || ''} /> */}
        <p>Duel game</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default DuelPage;