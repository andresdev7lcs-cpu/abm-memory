-- SCHEMA: AndyBot Memory
-- Proyecto: andybot-memory (lddkqfgpjjuxkccjfjud)
-- Creado: 2026-06-21

create table if not exists proyectos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  cliente text,
  estado text default 'activo',
  stack text,
  checkpoint text,
  updated_at timestamp default now()
);

create table if not exists tareas (
  id uuid default gen_random_uuid() primary key,
  proyecto_id uuid references proyectos(id),
  descripcion text not null,
  estado text default 'pendiente',
  orden int default 0,
  updated_at timestamp default now()
);

create table if not exists decisiones (
  id uuid default gen_random_uuid() primary key,
  proyecto_id uuid references proyectos(id),
  decision text not null,
  razon text,
  fecha date default current_date
);

create table if not exists glosario (
  id uuid default gen_random_uuid() primary key,
  termino text not null,
  definicion text not null,
  contexto text
);

-- DATOS INICIALES: MSDS-CRM
insert into proyectos (nombre, cliente, estado, stack, checkpoint) values (
  'MSDS-CRM',
  'Multiseguros del Sur',
  'activo',
  'Supabase + n8n + OpenAI GPT-4o-mini + Telegram',
  'P4 operativo 2026-06-20. 523 clientes migrados. ABM en GitHub.'
);

-- TAREAS MSDS (orden estricto)
with p as (select id from proyectos where nombre = 'MSDS-CRM')
insert into tareas (proyecto_id, descripcion, estado, orden) values
  ((select id from p), 'Rotar service_role key de Supabase MSDS', 'pendiente', 1),
  ((select id from p), 'Exportar P2 y P3 desde n8n como respaldo', 'pendiente', 2),
  ((select id from p), 'Agregar header apikey en nodo Buscar Poliza de P4', 'pendiente', 3),
  ((select id from p), 'Verificar SCMSDS_BOT_SYSTEM.md inyectado en workflow', 'pendiente', 4),
  ((select id from p), 'Importar AndyBot workflow actualizado en n8n', 'pendiente', 5),
  ((select id from p), 'A1: Importar P2 Asistente Agenda v10 en n8n', 'pendiente', 6),
  ((select id from p), 'B1: Workflow recepción Telegram SCMSDS_bot', 'pendiente', 7),
  ((select id from p), 'B2: Test end-to-end Telegram SCMSDS_bot', 'pendiente', 8),
  ((select id from p), 'C2: Agente asesor conversacional con OpenAI', 'pendiente', 9),
  ((select id from p), 'E1: Actualizar discurso de ventas', 'pendiente', 10);

-- DECISIONES MSDS
with p as (select id from proyectos where nombre = 'MSDS-CRM')
insert into decisiones (proyecto_id, decision, razon) values
  ((select id from p), 'Usar OpenAI API (no Claude API)', 'Decisión de costo — gpt-4o-mini más económico'),
  ((select id from p), 'Sin portal de clientes', 'Asesor gestiona todo — simplicidad operativa'),
  ((select id from p), 'Dashboard polling cada 60s', 'Sin websockets — infraestructura más simple'),
  ((select id from p), 'Migrar de Airtable a Supabase', '523 clientes migrados — mayor control y costo cero'),
  ((select id from p), 'Credenciales nunca hardcodeadas en JSONs', 'Seguridad — siempre en n8n credentials o Bitwarden');

-- GLOSARIO
insert into glosario (termino, definicion, contexto) values
  ('P2', 'Asistente Agenda — workflow que notifica pólizas por vencer', 'n8n MSDS'),
  ('P3', 'Asistente Cotización — workflow que procesa solicitudes de cotización', 'n8n MSDS'),
  ('P4', 'Asistente Urgencias — workflow que procesa siniestros urgentes vía Telegram', 'n8n MSDS'),
  ('ABM', 'AndyBot Memory — sistema de archivos markdown con contexto de proyectos', 'Personal Andrés'),
  ('SCMSDS_bot', 'Bot de Telegram del cliente Multiseguros del Sur', 'MSDS'),
  ('AndyBot', 'Bot personal de Telegram de Andrés — asistente operativo', 'Personal Andrés'),
  ('Easypanel', 'Panel de administración del VPS donde vive n8n', 'Infraestructura'),
  ('service_role key', 'Key de Supabase con acceso total sin RLS — nunca exponer', 'Seguridad'),
  ('ramo', 'Categoría de seguro: Autos, Hogar, Vida', 'MSDS'),
  ('Fable', 'Nombre alternativo de Claude en el contexto de trabajo de Andrés', 'Personal Andrés');
