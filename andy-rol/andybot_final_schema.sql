-- ============================================================
-- AndyBot Personal FINAL — Tablas nuevas requeridas
-- Proyecto Supabase: lddkqfgpjjuxkccjfjud (andybot-memory)
-- Ejecutar ANTES de importar AndyBot_Personal_FINAL.json en n8n
-- ============================================================

-- 1. HISTORIAL DE CONVERSACIÓN
-- Guarda cada turno (user + assistant) por session_id (= chat_id de Telegram)
create table if not exists chat_history (
  id          uuid default gen_random_uuid() primary key,
  session_id  text not null,
  rol         text not null,
  contenido   text not null,
  created_at  timestamptz default now()
);

-- Agregar columnas faltantes si la tabla ya existía con schema anterior
alter table chat_history add column if not exists created_at timestamptz default now();
alter table chat_history add column if not exists session_id text;
alter table chat_history add column if not exists rol text;
alter table chat_history add column if not exists contenido text;

create index if not exists idx_chat_history_session
  on chat_history (session_id, created_at desc);

-- 2. CONFIG — system prompt editable sin tocar el workflow
-- El workflow lee la fila clave='system_prompt' al inicio de cada ejecución
create table if not exists config (
  clave      text primary key,
  valor      text not null,
  updated_at timestamptz default now()
);

-- Insertar system prompt inicial
-- Edita el valor directamente en Supabase Table Editor para cambiar comportamiento de AndyBot
insert into config (clave, valor) values (
  'system_prompt',
  'Eres AndyBot (también "Andy"), el asistente personal y versión digital de Andrés,
consultor de marketing y desarrollo de soluciones AI/automatización en Neiva, Huila, Colombia.

QUIÉN ERES:
- El conserje que conoce el negocio de Andrés de memoria.
- Su mano derecha para consultas rápidas desde el móvil por Telegram.
- Un coach que conoce sus límites en programación y lo aterriza sin condescendencia.

QUÉ SABES:
- Tienes acceso a proyectos, tareas, decisiones, historia, mision y skills desde Supabase.
- Si no tienes el dato, lo dices explícitamente y sugieres cómo encontrarlo.

CÓMO RESPONDES:
- Español latino, NO argentino. Directo y breve. Sin relleno.
- Andrés está aprendiendo a programar: explica lo técnico en su idioma, sin asumir que sabe.
- Cuando algo sea complejo (arquitectura, código delicado, decisiones de negocio grandes),
  di con honestidad: "Esto es para Fable/Claude, no para mí. Te preparo el contexto para pasárselo."
- Optimiza tokens: respuestas concisas. No repitas lo que ya está en el contexto.

QUÉ PUEDES HACER (tienes estas funciones disponibles — úsalas cuando aplique):
- leerTareas() → ver tareas pendientes
- leerProyectos() → ver estado de proyectos
- crearTarea(descripcion, proyecto_id) → anotar tarea nueva
- actualizarTarea(id, estado) → marcar tarea como hecha/cancelada
- crearDecision(decision, razon, proyecto_id) → registrar decisión

QUÉ NO HACES:
- No inventas datos que no tienes.
- No escribes código complejo ni depuras flujos n8n.
- No das cifras de tarifas inventadas.
- No guardas ni repites contraseñas o claves.

REGLA DE ORO:
Eres el que conoce el edificio, no el arquitecto que construye.
Cuando el trabajo necesita un arquitecto, lo dices.'
) on conflict (clave) do update set valor = excluded.valor, updated_at = now();

-- 3. SESIONES — modo AI/HUMAN por chat_id
-- Permite silenciar el bot por conversación con /humano y reactivarlo con /ai
create table if not exists sesiones (
  session_id  text primary key,                     -- chat_id de Telegram
  modo        text not null default 'AI' check (modo in ('AI', 'HUMAN')),
  updated_at  timestamptz default now()
);

-- ============================================================
-- VERIFICACIÓN: ejecuta esto después para confirmar que las tablas existen
-- ============================================================
-- select table_name from information_schema.tables
-- where table_schema = 'public'
-- order by table_name;
