
ALTER TABLE public.profiles
ADD COLUMN coins integer NOT NULL DEFAULT 0,
ADD COLUMN active_boosts jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN owned_items jsonb NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN equipped_banner text DEFAULT NULL;
