-- ============================================================
-- FIRE PASS — Migración blueprint (F0.5)
-- Idempotente: corre N veces sin error sobre schema.sql base.
-- ============================================================

-- --- leads: extensión TOF (doc 02) + UTM + guide unlock (doc 03) ---
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'tof_entry',
  ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT 'CA',
  ADD COLUMN IF NOT EXISTS guide_unlocked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS guide_access_token UUID,
  ADD COLUMN IF NOT EXISTS referred_by UUID,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT;

ALTER TABLE leads ALTER COLUMN score DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN segment DROP NOT NULL;

CREATE INDEX IF NOT EXISTS leads_guide_token_idx ON leads (guide_access_token);

-- --- guide_progress (doc 04) ---
CREATE TABLE IF NOT EXISTS guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  chapter INT NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  cards_seen INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  interactions JSONB NOT NULL DEFAULT '{}',
  UNIQUE (lead_id, chapter)
);
ALTER TABLE guide_progress ENABLE ROW LEVEL SECURITY;
-- Sin políticas anon: todo acceso vía route handlers con service_role.

-- --- bpa_profiles (doc 05) ---
CREATE TABLE IF NOT EXISTS bpa_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  avatar TEXT NOT NULL CHECK (avatar IN ('gloria','george')),
  city_name TEXT, income_range TEXT, dependents INT,
  debt_types TEXT[] DEFAULT '{}', savings_band TEXT,
  level INT NOT NULL DEFAULT 1, streak INT NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bpa_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,              -- mission_done | daily_done | level_up | badge
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  question TEXT NOT NULL, answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bpa_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bpa_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User reads own profile" ON bpa_profiles;
CREATE POLICY "User reads own profile" ON bpa_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User updates own profile" ON bpa_profiles;
CREATE POLICY "User updates own profile" ON bpa_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User reads own events" ON bpa_events;
CREATE POLICY "User reads own events" ON bpa_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User reads own feedback" ON feedback;
CREATE POLICY "User reads own feedback" ON feedback
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- --- call_bookings (doc 06) ---
CREATE TABLE IF NOT EXISTS call_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  calendly_event_id TEXT
);
ALTER TABLE call_bookings ENABLE ROW LEVEL SECURITY;
-- Sin políticas anon: solo service_role (webhook Calendly) escribe.
