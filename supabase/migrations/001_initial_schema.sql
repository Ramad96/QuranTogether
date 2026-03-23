-- QuranTogether Database Schema
-- Run this in the Supabase SQL Editor or via supabase db push

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE journey_type AS ENUM ('QURAN', 'YASEEN_40');
CREATE TYPE unit_status AS ENUM ('UNASSIGNED', 'ASSIGNED', 'COMPLETED');

-- ============================================================
-- TABLES
-- ============================================================

-- Users: mirrors auth.users with additional profile fields
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  avatar_url  TEXT,
  is_guest    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Journeys: the core group recitation goal
CREATE TABLE IF NOT EXISTS public.journeys (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  dedication_name  TEXT NOT NULL,
  type             journey_type NOT NULL,
  description      TEXT,
  created_by       UUID NOT NULL REFERENCES public.users(id),
  invite_code      TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journeys_invite_code ON public.journeys(invite_code);
CREATE INDEX IF NOT EXISTS idx_journeys_active_created ON public.journeys(is_active, created_at DESC);

-- Journey Participants: who is in each journey
CREATE TABLE IF NOT EXISTS public.journey_participants (
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  journey_id  UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_admin    BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (user_id, journey_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_journey ON public.journey_participants(journey_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON public.journey_participants(user_id);

-- Journey Units: individual Juz or Yaseen slots
CREATE TABLE IF NOT EXISTS public.journey_units (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id   UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  unit_number  INT NOT NULL,
  assigned_to  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status       unit_status NOT NULL DEFAULT 'UNASSIGNED',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (journey_id, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_units_journey ON public.journey_units(journey_id, status);
CREATE INDEX IF NOT EXISTS idx_units_assigned ON public.journey_units(assigned_to);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_units ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- JOURNEYS policies
CREATE POLICY "journeys_select_active" ON public.journeys
  FOR SELECT USING (is_active = true);

CREATE POLICY "journeys_insert_auth" ON public.journeys
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

CREATE POLICY "journeys_update_admin" ON public.journeys
  FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.journey_participants
      WHERE journey_id = id AND user_id = auth.uid() AND is_admin = true
    )
  );

-- JOURNEY PARTICIPANTS policies
CREATE POLICY "participants_select_member_or_self" ON public.journey_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.journey_participants p2
      WHERE p2.journey_id = journey_participants.journey_id AND p2.user_id = auth.uid()
    )
  );

CREATE POLICY "participants_insert_self" ON public.journey_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "participants_delete_self_or_admin" ON public.journey_participants
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.journey_participants p2
      WHERE p2.journey_id = journey_participants.journey_id
        AND p2.user_id = auth.uid()
        AND p2.is_admin = true
    )
  );

CREATE POLICY "participants_update_admin" ON public.journey_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.journey_participants p2
      WHERE p2.journey_id = journey_participants.journey_id
        AND p2.user_id = auth.uid()
        AND p2.is_admin = true
    )
  );

-- JOURNEY UNITS policies
-- Any journey participant can read units
CREATE POLICY "units_select_participant" ON public.journey_units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.journey_participants
      WHERE journey_id = journey_units.journey_id AND user_id = auth.uid()
    )
  );

-- Any participant can update units (admin-only business rules enforced in API)
CREATE POLICY "units_update_participant" ON public.journey_units
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.journey_participants
      WHERE journey_id = journey_units.journey_id AND user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at on journey_units
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journey_units_updated_at
  BEFORE UPDATE ON public.journey_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- REALTIME
-- ============================================================

-- Enable realtime for journey_units so clients get live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.journey_units;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journey_participants;
