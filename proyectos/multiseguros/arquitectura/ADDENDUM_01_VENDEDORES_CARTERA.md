# ADDENDUM 01 — Vendedores, Cartera y Comisiones
**Fecha:** 2026-07-04 · **Arquitecto:** Fable · **Estado:** diseño, pendiente construcción
**Extiende:** PLAN_ARQUITECTURA_MSDS.md (Milestone A) — no reemplaza, agrega.

---

## 0. Por qué este addendum

Dos hallazgos operativos no cubiertos en el plan original:

1. `polizas` no registra **quién vendió** — no hay campo vendedor, solo `pagador_id` (legacy, no relacionado).
2. Dos áreas nuevas con flujo propio y NO atienden clientes externos: **Cartera** (cobro post-suscripción) y **Comisiones** (pago a vendedores externos vs ingreso neto).

Ambas requieren su propio mini-agente Telegram (misma mecánica que Siniestros/Autos/Vida/Cotizaciones: fila en `bots`, notificaciones automáticas, sin routing de W01).

---

## 1. Hallazgo `pagador_id` — investigado y documentado

**Origen:** `sql/01_crear_tablas.sql` líneas 69-70:
```sql
cliente_id  bigint references clientes(id) on delete cascade,   -- tomador
pagador_id  bigint references clientes(id) on delete set null,  -- si difiere del tomador
```

**Qué es:** distinción tomador vs pagador — cuando un cliente distinto al tomador de la póliza es quien paga (ej. empresa paga póliza de un empleado). FK a `clientes`, **no** a vendedores ni asesores.

**Por qué está en null en todos los registros:** el flujo de ingesta (migración Airtable / carga manual) nunca captura este dato — no es que falte diseño, es que el campo existe pero el proceso operativo no lo alimenta.

**Referencia cruzada:** `CELER_REFERENCIA.md:90` ya señala esto como pendiente: *"polizas: agregar tomador vs pagador, plan, modalidad, sucursal, vigencia_inicial vs vigencia_actual, municipio."*

**Decisión:** `pagador_id` se mantiene tal cual (no se toca en este addendum). Es un concepto distinto de `vendedor` y no bloquea nada de lo que sigue. Si se decide poblarlo, es trabajo de captura de datos, no de schema.

---

## 2. DDL — vendedores y cartera

Archivo a crear: `sql/05_vendedores_cartera_comisiones.sql`

```sql
-- ============================================================
-- ADDENDUM 01 — Vendedores externos, Cartera, Comisiones
-- Fecha: 2026-07-04
-- ============================================================

-- 1. VENDEDORES EXTERNOS (no son asesores internos ni tienen usuario CRM)
create table vendedores_externos (
  id         bigint generated always as identity primary key,
  nombre     text not null,
  documento  text,                    -- cédula/NIT, para conciliación de pagos
  telefono   text,
  email      text,
  activo     boolean default true,
  creado_en  timestamptz default now()
);

-- 2. EXTENSIÓN polizas — vendedor obligatorio (interno o externo)
alter table polizas
  add column vendedor_tipo          text check (vendedor_tipo in ('interno','externo')),
  add column vendedor_interno_id    bigint references asesores(id) on delete set null,
  add column vendedor_externo_id    bigint references vendedores_externos(id) on delete set null,
  add column vendedor_externo_nombre text; -- fallback si el vendedor externo aún no está registrado en la tabla

-- Regla de integridad (aplicar en W01/formulario de suscripción, no como CHECK duro
-- para no romper pólizas históricas sin vendedor):
--   vendedor_tipo = 'interno'  → vendedor_interno_id NOT NULL
--   vendedor_tipo = 'externo'  → vendedor_externo_id NOT NULL OR vendedor_externo_nombre NOT NULL

create index idx_polizas_vendedor_interno on polizas(vendedor_interno_id);
create index idx_polizas_vendedor_externo on polizas(vendedor_externo_id);

-- 3. MINI-AGENTES Cartera y Comisiones (misma tabla bots del plan original)
-- Handles definitivos confirmados AP 2026-07-04 — ver PLAN_ARQUITECTURA_MSDS.md sección 5
insert into bots (nombre, tipo, area, telegram_handle, token_ref, system_prompt_file, chat_id_destino) values
  ('Coordinador Cartera',    'mini_agente', 'cartera',    '@MSDS_Cartera_bot',    'TG_CARTERA',    'system-prompts/MINI_CARTERA_SYSTEM.md',    null),
  ('Coordinador Comisiones', 'mini_agente', 'comisiones', '@MSDS_Comisiones_bot', 'TG_COMISIONES', 'system-prompts/MINI_COMISIONES_SYSTEM.md', null);
```

**Nota de diseño:** `vendedor_tipo`/`vendedor_interno_id`/`vendedor_externo_id` no llevan `CHECK` cruzado en DB porque las pólizas históricas no tendrán vendedor — forzarlo rompería el historial. La obligatoriedad se aplica **hacia adelante**, en el punto de captura (formulario de suscripción / comando del asesor), no en el schema.

---

## 3. Query — reporte mensual de comisiones

Vendedor × pólizas × prima × aseguradora, agrupado, para un mes dado (`$1` = primer día del mes, `$2` = primer día del mes siguiente):

```sql
-- Vendedores internos (asesores)
select
  'interno'                as vendedor_tipo,
  a.id                      as vendedor_id,
  a.nombre                  as vendedor_nombre,
  p.aseguradora,
  count(*)                  as num_polizas,
  sum(p.prima)              as suma_primas
from polizas p
join asesores a on a.id = p.vendedor_interno_id
where p.vendedor_tipo = 'interno'
  and p.fecha_inicio >= $1 and p.fecha_inicio < $2
group by a.id, a.nombre, p.aseguradora

union all

-- Vendedores externos (registrados o solo por nombre)
select
  'externo'                                              as vendedor_tipo,
  coalesce(v.id, 0)                                       as vendedor_id,
  coalesce(v.nombre, p.vendedor_externo_nombre, 'sin nombre') as vendedor_nombre,
  p.aseguradora,
  count(*)                                                as num_polizas,
  sum(p.prima)                                            as suma_primas
from polizas p
left join vendedores_externos v on v.id = p.vendedor_externo_id
where p.vendedor_tipo = 'externo'
  and p.fecha_inicio >= $1 and p.fecha_inicio < $2
group by v.id, v.nombre, p.vendedor_externo_nombre, p.aseguradora

order by vendedor_tipo, vendedor_nombre, aseguradora;
```

**Nota:** filtra por `fecha_inicio` (vigencia de la póliza), no por fecha de creación del registro — confirmar con AP si el corte de comisión es por fecha de suscripción o por fecha de cobro efectivo (relevante una vez Cartera esté operando; ver sección 4).

---

## 4. Flujo crítico — Cartera y Comisiones

```
Asesor suscribe póliza
  → vendedor_tipo + vendedor_interno_id/vendedor_externo_id obligatorio
  → INSERT polizas
       │
       ▼
  W11 Cartera Notifier (trigger INSERT polizas)
       │
       ▼
  Notifica @MSDS_Cartera_bot: "Póliza #id — cliente X — prima $Y — pendiente cobro"
       │
       ▼
  Asesor 2b confirma recaudo (comando en Cartera_bot, ej. /cobrado [poliza_id])
       │
       ▼
  (fin de mes)
       │
       ▼
  W12 Reporte Comisiones — asesor 6 solicita → genera CSV
       │
       ▼
  Asesor 6 descarga → concilia pago vendedores externos vs ingreso neto empresa
```

**Cartera y Comisiones NO atienden clientes externos** — no requieren routing de W01, no aparecen en `sla_config`, no generan `casos`. Son notificación + confirmación interna únicamente.

---

## 5. Workflow — W11 Cartera Notifier

- **Trigger:** en n8n 2.8.3 no hay trigger nativo de Postgres INSERT sobre Supabase vía REST — se implementa como **paso adicional dentro del flujo de suscripción existente** (el mismo workflow/proceso que hace el INSERT en `polizas` llama a W11 por webhook justo después del INSERT), o alternativamente **cron corto (cada 2-5 min)** que hace `GET polizas?notificado_cartera=eq.false` si se prefiere desacoplar.
- **Recomendado:** webhook `POST /msds-cartera-notify` invocado por quien crea la póliza, payload `{poliza_id}`.
- **Lógica:**
  1. GET `polizas?id=eq.<poliza_id>` (join manual con cliente, vendedor).
  2. Formatear mensaje: póliza, cliente, prima, aseguradora, vendedor (interno/externo).
  3. POST Telegram al chat_id de Cartera (token `TG_CARTERA`).
  4. PATCH `polizas.notificado_cartera = true` (requiere columna adicional si no existe — agregar en el mismo ALTER si se aprueba este mecanismo de dedupe).
- **Output:** 200 `{ok:true}`.
- **Error:** igual patrón que W01/W10 — INSERT en `logs`, reintentos 2x.

## 6. Workflow — W12 Reporte Comisiones

- **Trigger:** Webhook `POST /msds-reporte-comisiones` (parámetros `mes`, `anio`) — invocado por comando del asesor 6 vía Comisiones_bot o llamada directa.
- **Lógica:**
  1. Calcular rango de fechas del mes solicitado.
  2. Ejecutar query de sección 3 (vía RPC de Postgres en Supabase, o replicar la lógica con dos GET + agregación en Code node de lógica pura — sin llamadas HTTP adicionales).
  3. Convertir resultado a CSV (columnas: vendedor_tipo, vendedor_nombre, aseguradora, num_polizas, suma_primas).
  4. Responder con el CSV como archivo descargable (`Content-Type: text/csv`) o subir a Supabase Storage y devolver URL, según lo que soporte el nodo Telegram/webhook de salida.
- **Recomendado implementación de la query:** crear función Postgres (`create function reporte_comisiones_mensual(...)`) invocable vía RPC de PostgREST — evita reconstruir el JOIN/UNION en n8n con Code node y respeta la regla de "HTTP nativo, no lógica de negocio en Code node con fetch".
- **Output:** 200 con CSV adjunto o `{ok:true, url_csv}`.

---

## 7. Decisiones pendientes que abre este addendum

| ID | Pregunta | Recomendación | Bloquea |
|---|---|---|---|
| D8 | Corte de comisión: fecha de suscripción (`fecha_inicio`) o fecha de cobro confirmado por Cartera | Fecha de cobro confirmado (más preciso para pago real) — requiere columna `fecha_cobro` en `polizas` o tabla de movimientos de cartera | W12, A3.8 |
| D9 | Mecanismo de trigger W11: webhook desde el flujo de suscripción o cron de polling | Webhook (tiempo real, menos carga que polling) | A3.7 |
| D10 | Chat ID de asesores 2a/2b (Cartera) y asesor 6 (Comisiones) | Mismo método que D6 — `@userinfobot` | A4.6, A4.7 |

**Nota:** D8 es la decisión de mayor impacto — si el corte es por cobro confirmado (no por suscripción), la query de sección 3 y el trigger de W12 cambian de fuente (`polizas.fecha_inicio` → tabla de cobros/cartera). Recomendado resolver antes de A3.8.

---

## 8. Decisiones confirmadas (AP — 2026-07-04)

### D8 — Corte de comisión: OPCIÓN B confirmada

W12 opera sobre pólizas donde `estado_cobro = 'pagado_por_aseguradora'`.

**Flujo completo:**
1. Póliza suscrita → `estado_cobro = 'pendiente_cliente'`
2. Cliente paga prima → Cartera confirma → `estado_cobro = 'pagado_cliente'`
3. Empresa factura a aseguradora
4. Aseguradora paga → `estado_cobro = 'pagado_por_aseguradora'`
5. W12 incluye la póliza en el reporte de comisiones del mes

**DDL adicional** (agregar a `sql/05_vendedores_cartera_comisiones.sql`):
```sql
alter table polizas
  add column estado_cobro text default 'pendiente_cliente'
    check (estado_cobro in (
      'pendiente_cliente',
      'pagado_cliente',
      'facturado_aseguradora',
      'pagado_por_aseguradora'
    ));
```

**Impacto en sección 3 (query reporte mensual):** el filtro de fecha (`fecha_inicio >= $1 and < $2`) se mantiene para el corte de mes, pero se agrega `and p.estado_cobro = 'pagado_por_aseguradora'` en ambos SELECT del UNION — una póliza solo entra al reporte cuando la aseguradora ya pagó, sin importar en qué mes se suscribió.

**Impacto en W12:** el disparador de generación de reporte no cambia (webhook a demanda), pero el filtro de la query/RPC debe usar `estado_cobro`, no solo el rango de fechas.

### D9 — Trigger W11: OPCIÓN A confirmada

W11 Cartera Notifier se dispara directo en INSERT de `polizas` — no requiere acción manual del asesor.

**Tarea automática en `actividades`:**
```sql
insert into actividades (tipo, descripcion, estado, sla_horas, caso_id)
values (
  'gestion_cobro',
  'Gestionar pago prima póliza ' || p.numero || ' - cliente ' || c.nombre,
  'pendiente',
  48,   -- 2 días hábiles para primer contacto con cliente
  null
);
```

Esto reemplaza el mecanismo de "webhook invocado por quien crea la póliza" descrito en sección 5 — el INSERT en `polizas` **es** el trigger; W11 escucha ese evento (vía el mismo flujo que hace el INSERT, que ahora también dispara W11 y crea la fila en `actividades` en el mismo paso) en vez de depender de que el creador de la póliza llame al webhook aparte.

**Actualiza sección 5 (W11):** el mecanismo recomendado deja de ser "cron de polling" opcional — queda fijo: INSERT en `polizas` → mismo flujo dispara notificación a Cartera + INSERT en `actividades` con los campos de arriba.

### D10 — Chat IDs individuales: confirmado

Cada asesor físico tiene su propio `telegram_chat_id` — no solo gerente/supervisor/mini-agentes.

**DDL adicional:**
```sql
alter table asesores add column telegram_chat_id bigint;
alter table asesores add column telegram_username text;
```

Esto habilita notificación directa 1:1 a cada asesor (ej. W01 notificando al asesor asignado, W11 pudiendo notificar también al vendedor si aplica) sin depender solo de los mini-agentes de área.

**Equipo confirmado — 10 personas físicas activas + 2 futuras (arquitectura debe soportar 12):**

| Rol | Ramo | chat_id |
|---|---|---|
| Gerente general | todos | `8695082898` ✅ |
| Gerente Bogotá | vida/ARL | pendiente |
| Asesor 1a | autos nuevos | pendiente |
| Asesor 1b | autos renovación | pendiente |
| Asesor 2a | cartera | pendiente |
| Asesor 2b | caja/cobros | pendiente |
| Asesor 3 | generales | pendiente |
| Asesor 4 | cumplimiento | pendiente |
| Asesor 5 | siniestros | pendiente |
| Asesor 6 | comisiones | pendiente |

Insertar en tabla `asesores` a medida que lleguen los `telegram_chat_id` (método: cada persona escribe a `@userinfobot`). El diseño de columnas (`telegram_chat_id`, `telegram_username`) ya soporta las 2 posiciones futuras sin cambios de schema.

**Bots pendientes de crear en BotFather — mañana 2026-07-05 (límite diario de BotFather alcanzado hoy):**
- `@MSDS_Cartera_bot` — Coordinador Cartera
- `@MSDS_Comisiones_bot` — Coordinador Comisiones

Tokens → Bitwarden ("MSDS Telegram Cartera" / "MSDS Telegram Comisiones") → credenciales n8n (`TG_CARTERA` / `TG_COMISIONES`, ya referenciadas en el INSERT de `bots` de sección 2).

---

*Diseño: Fable · 2026-07-04 · Extiende PLAN_ARQUITECTURA_MSDS.md · Ver MSDS_CHECKLIST_MAESTRA.md fases A0/A2/A3/A4 actualizadas. Decisiones D8/D9/D10 confirmadas por AP 2026-07-04.*
