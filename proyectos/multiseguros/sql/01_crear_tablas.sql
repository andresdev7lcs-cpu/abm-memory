-- ============================================================
-- ESQUEMA MSDS-CRM — Multiseguros del Sur
-- Versión AMPLIADA (alineada con Celer/AIS Cloud)
-- 7 tablas. Multi-ramo. Nombres en español.
-- Correr en: Supabase -> SQL Editor -> pegar -> Run
-- Fecha: 2026-06-15
-- ============================================================

-- 1. ASESORES (personas internas: asesores, supervisor, gerente)
create table asesores (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  correo      text unique,
  rol         text not null default 'asesor',   -- asesor / supervisor / gerente
  ramo        text,                             -- Autos / Hogar / Vida / Patrimoniales / SOAT
  telefono    text,
  chat_id     text,                             -- Telegram, para notificaciones
  activo      boolean default true,
  creado_en   timestamptz default now()
);

-- 2. CLIENTES (el centro; soporta natural y jurídica como Celer)
create table clientes (
  id              bigint generated always as identity primary key,
  tipo            text default 'natural',       -- natural / juridica
  tipo_doc        text default 'CC',            -- CC / NIT / CE / etc
  identificacion  text unique,                  -- cédula o NIT
  nombre          text not null,                -- nombre completo o razón social
  primer_apellido text,
  segundo_apellido text,
  genero          text,
  estado_civil    text,
  fecha_nacimiento date,
  -- contacto (campos principales; Celer maneja varios, aquí los de uso real)
  telefono        text,
  celular         text,
  correo          text,
  direccion       text,
  municipio       text,
  -- perfil
  profesion       text,
  ocupacion       text,
  estrato         int,
  observaciones   text,
  creado_en       timestamptz default now()
);

-- 3. VEHICULOS (cuelgan de cliente; ramo Autos)
create table vehiculos (
  id              bigint generated always as identity primary key,
  cliente_id      bigint references clientes(id) on delete cascade,
  placa           text,
  clase           text,                         -- AUTOMOVIL / CAMIONETA / MOTO / etc
  marca           text,
  linea           text,
  modelo_anio     int,                          -- el año del vehículo
  color           text,
  servicio        text default 'Particular',
  cilindraje      text,
  fasecolda       text,
  venc_tecnomecanica date,
  observaciones   text,
  creado_en       timestamptz default now()
);

-- 4. POLIZAS (cuelgan de cliente; aquí vive el ramo)
create table polizas (
  id                bigint generated always as identity primary key,
  cliente_id        bigint references clientes(id) on delete cascade, -- tomador
  pagador_id        bigint references clientes(id) on delete set null, -- si difiere del tomador
  vehiculo_id       bigint references vehiculos(id) on delete set null,
  numero            text,
  ramo              text not null,              -- Autos / Hogar / Vida / Patrimoniales / SOAT
  aseguradora       text,
  plan              text,
  modalidad         text,                       -- Individual / Colectiva
  sucursal          text,
  municipio_expedicion text,
  vigencia_inicial  date,                       -- inicio histórico
  fecha_inicio      date,                       -- vigencia actual inicio
  fecha_vencimiento date,                       -- vigencia actual fin
  prima             numeric,                    -- valor en pesos
  estado            text default 'vigente',     -- vigente / sin_renovar / cancelada / renovada
  creado_en         timestamptz default now()
);

-- 5. SINIESTROS (cuelgan de póliza)
create table siniestros (
  id                bigint generated always as identity primary key,
  poliza_id         bigint references polizas(id) on delete cascade,
  num_aseguradora   text,                       -- Nº siniestro de la aseguradora
  asegurado         text,                       -- nombre del asegurado afectado
  fecha_ocurrencia  date,
  fecha_notif_asesor date,
  fecha_notif_aseguradora date,
  descripcion       text,
  estado            text default 'avisado',     -- avisado / definido / cerrado
  valor_indemnizado numeric default 0,
  creado_en         timestamptz default now()
);

-- 6. PENDIENTES (trámites/solicitudes a aseguradoras)
create table pendientes (
  id              bigint generated always as identity primary key,
  cliente_id      bigint references clientes(id) on delete set null,
  poliza_id       bigint references polizas(id) on delete set null,
  asesor_id       bigint references asesores(id) on delete set null,
  tipo            text,                         -- Solicitud / etc
  aseguradora     text,
  ramo            text,
  descripcion     text,
  prima           numeric,
  estado          text default 'pendiente',     -- pendiente_aseguradora / definido / etc
  fecha_inicio    date default current_date,
  fecha_definicion date,
  creado_en       timestamptz default now()
);

-- 7. ACTIVIDADES (gestión; se asocia a cliente, póliza, siniestro o pendiente)
create table actividades (
  id              bigint generated always as identity primary key,
  asesor_id       bigint references asesores(id) on delete set null,
  cliente_id      bigint references clientes(id) on delete cascade,
  poliza_id       bigint references polizas(id) on delete set null,
  siniestro_id    bigint references siniestros(id) on delete set null,
  pendiente_id    bigint references pendientes(id) on delete set null,
  clase           text,                         -- llamada / correo / visita / nota
  descripcion     text,
  estado          text default 'abierta',
  fecha_inicio    date default current_date,
  fecha_fin       date,
  creado_en       timestamptz default now()
);
