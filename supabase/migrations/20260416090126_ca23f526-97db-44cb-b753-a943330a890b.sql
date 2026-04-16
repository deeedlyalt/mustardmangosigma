
-- Drop the old policy
DROP POLICY "Participants can update their duel" ON public.duels;

-- Allow joining a waiting duel OR updating as a participant
CREATE POLICY "Participants can update their duel"
ON public.duels
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = creator_id) 
  OR (auth.uid() = opponent_id) 
  OR (status = 'waiting' AND opponent_id IS NULL)
);
