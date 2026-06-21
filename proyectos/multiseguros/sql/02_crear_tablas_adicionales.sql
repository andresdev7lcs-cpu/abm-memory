-- ============================================================
-- TABLAS ADICIONALES — Cotizaciones y Logs
-- Bloque 2: P2/P3 workflows
-- Correr en: Supabase -> SQL Editor -> pegar -> Run
-- Fecha: 2026-06-17
-- ============================================================

-- 1. COTIZACIONES (cuelgan de cliente; ramo flexible)
create table cotizaciones (
  id                bigint generated always as identity primary key,
  cliente_id        bigint references clientes(id) on delete cascade,
  asesor_id         bigint references asesores(id) on delete set null,
  aseguradora       text,
  ramo              text,
  resultado_final   text,                            -- aprobada / denegada / pendiente
  estado            text default 'pendiente',        -- pendiente / presentada / aceptada / rechazada
  prima             numeric,
  vigencia_inicio   date,
  vigencia_fin      date,
  notas             text,
  creado_en         timestamptz default now()
);

-- 2. LOGS (auditoría de cambios en cotizaciones)
create table logs (
  id                bigint generated always as identity primary key,
  cotizacion_id     bigint references cotizaciones(id) on delete cascade,
  asesor_id         bigint references asesores(id) on delete set null,
  cambio_estado     text,                            -- descripción del cambio
  estado_anterior   text,
  estado_nuevo      text,
  timestamp         timestamptz default now()
);
