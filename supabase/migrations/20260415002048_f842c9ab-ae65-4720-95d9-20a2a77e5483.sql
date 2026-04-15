
CREATE TABLE public.duels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  opponent_id UUID,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'waiting',
  creator_score INTEGER,
  creator_time_ms INTEGER,
  opponent_score INTEGER,
  opponent_time_ms INTEGER,
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view duels"
ON public.duels FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create duels"
ON public.duels FOR INSERT TO authenticated
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Participants can update their duel"
ON public.duels FOR UPDATE TO authenticated
USING (auth.uid() = creator_id OR auth.uid() = opponent_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.duels;
