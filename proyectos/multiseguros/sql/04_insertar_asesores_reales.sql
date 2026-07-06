-- ============================================================
-- INSERCIÓN ASESORES REALES — reemplaza los 3 demo
-- Tabla definitiva confirmada por AP 2026-07-04
-- Requiere: ALTER TABLE asesores ADD COLUMN telegram_chat_id bigint,
--           ADD COLUMN telegram_username text
--           (ver ADDENDUM_01_VENDEDORES_CARTERA.md sección 8, D10)
-- Ejecutado en: Supabase producción, 2026-07-06
-- Estado: chat_ids pendientes salvo gerente general (Fabio)
-- ============================================================

insert into asesores (nombre, correo, rol, ramo, chat_id, telegram_chat_id, telegram_username, activo)
values
  -- Fabio confirmado por AP: gerencia_neiva = gerente general, 1 sola persona/fila
  ('Fabio',     null, 'gerente',    'gerencia_neiva',      '8695082898', 8695082898, null, true),
  ('Santiago',  null, 'gerente',    'gerencia_bogota',     null, null, null, true),
  ('Gabriel',   null, 'asesor',     'autos_nuevos',        null, null, null, true),
  ('Valentina', null, 'asesor',     'autos_renovaciones',  null, null, null, true),
  ('Geraldin',  null, 'asesor',     'cartera',             null, null, null, true),
  ('Natalia',   null, 'asesor',     'caja',                null, null, null, true),
  ('Aida',      null, 'asesor',     'generales',           null, null, null, true),
  ('Leonela',   null, 'asesor',     'cumplimiento',        null, null, null, true),
  ('Oscar',     null, 'asesor',     'siniestros',          null, null, null, true),
  ('Yamaira',   null, 'asesor',     'comisiones',          null, null, null, true),
  ('Jorge',     null, 'supervisor', 'supervisor',          null, null, null, true)
on conflict (correo) do update set
  rol               = excluded.rol,
  ramo              = excluded.ramo,
  chat_id           = excluded.chat_id,
  telegram_chat_id  = excluded.telegram_chat_id,
  telegram_username = excluded.telegram_username,
  activo            = excluded.activo;

-- NOTA: el ON CONFLICT usa `correo` porque es la única columna UNIQUE en `asesores`
-- (ver sql/01_crear_tablas.sql línea 13). Los correos reales no están confirmados aún
-- — con correo = null, el UNIQUE constraint no bloquea duplicados y el ON CONFLICT
-- no dispara: cada re-ejecución de este script antes de tener correos creará filas
-- nuevas en vez de actualizar. Completar columna `correo` de cada persona ANTES de
-- volver a correr este script, o cambiar la estrategia de upsert a `nombre + ramo`.
