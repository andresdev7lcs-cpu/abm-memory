-- ============================================================
-- FIRE PASS – 100Lat App
-- Supabase Schema
-- ============================================================

-- Tabla principal de leads capturados
CREATE TABLE IF NOT EXISTS leads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  phone      TEXT,
  score      INTEGER NOT NULL CHECK (score BETWEEN 0 AND 10),
  segment    TEXT NOT NULL CHECK (segment IN ('low', 'medium', 'high')),
  avatar     TEXT CHECK (avatar IN ('male', 'female')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS leads_segment_idx ON leads (segment);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_score_idx ON leads (score);

-- Row Level Security (habilitar en producción)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: solo el backend (service_role) puede leer todos los leads
-- El cliente anon solo puede insertar (captura de leads)
CREATE POLICY "Anon can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Vista de resumen por segmento (útil para dashboard)
CREATE VIEW leads_summary AS
SELECT
  segment,
  COUNT(*)                               AS total,
  ROUND(AVG(score), 2)                   AS avg_score,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS last_7_days
FROM leads
GROUP BY segment;
