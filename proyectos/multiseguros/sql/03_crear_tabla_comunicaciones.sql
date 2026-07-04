-- ============================================================
-- TABLA COMUNICACIONES — Módulo Comercial (componente comunicaciones)
-- Centraliza mensajes WhatsApp / email / Telegram / llamadas
-- para visibilidad de gerencia (decisión 2026-06-12: módulo 2).
-- Correr en: Supabase -> SQL Editor -> pegar -> Run
-- Fecha: 2026-07-01
-- ============================================================

create table comunicaciones (
  id            bigint generated always as identity primary key,
  cliente_id    bigint references clientes(id) on delete set null,
  asesor_id     bigint references asesores(id) on delete set null,
  poliza_id     bigint references polizas(id) on delete set null,
  canal         text not null,                      -- whatsapp / email / telegram / llamada / sms
  direccion     text not null default 'entrante',   -- entrante / saliente
  remitente     text,                               -- número o correo de origen
  asunto        text,
  mensaje       text,
  estado        text not null default 'nueva',      -- nueva / leida / respondida / cerrada
  ref_externa   text,                               -- id externo (Evolution API msg id, email Message-ID)
  creado_en     timestamptz default now()
);

create index idx_comunicaciones_cliente on comunicaciones(cliente_id);
create index idx_comunicaciones_estado  on comunicaciones(estado);
create index idx_comunicaciones_canal   on comunicaciones(canal);
create index idx_comunicaciones_creado  on comunicaciones(creado_en desc);
