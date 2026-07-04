# PLAN DE ARQUITECTURA — MSDS-CRM
**Proyecto:** Multiseguros del Sur — Sistema de comunicaciones y coordinación por bots
**Arquitecto:** Fable | **Constructores:** CC (Claude Code) + Codex
**Fecha:** 2026-07-03 | **Versión:** 1.0
**Alcance de este documento:** Milestone A (sistema de comunicaciones) — diseño completo, sin implementación.

---

## 0. Correcciones al Master Doc incorporadas en este diseño

Antes de construir, CC y Codex deben saber que este plan **corrige** cuatro puntos del `MSDS_MASTER_PROJECT.md`:

| # | Master doc decía | Realidad verificada | Corrección aplicada |
|---|---|---|---|
| C1 | `casos.cliente_id uuid REFERENCES clientes(id)` | `clientes.id` y `asesores.id` son `bigint identity` (verificado vía REST 2026-07-03) | Todo el DDL usa `bigint`. El DDL del master doc **fallaría tal cual** |
| C2 | `casos` "replaces comunicaciones" | `comunicaciones` ya existe y opera (P5 en producción) | `casos` = expediente/proceso. `comunicaciones` = log de mensajes. Se relacionan vía `comunicaciones.caso_id` |
| C3 | Tabla nueva `actividades_v2` | `gerencia.html` y P4 leen `actividades` — tabla paralela = doble fuente de verdad | Recomendado: `ALTER TABLE actividades` (columnas nuevas). Alternativa v2 documentada. **Requiere firma AP → DECISIONES_PENDIENTES #1** |
| C4 | W04–W07 (4 crons por área) + W10 (cron global) | 5 crons ejecutando la misma lógica SLA | Recomendado: **un solo W10 Watchdog** parametrizado por `sla_config` + `casos.area`; los mini-agentes son identidades de notificación (token por área), no lógica duplicada. **Requiere firma AP → DECISIONES_PENDIENTES #2** |

Además: el proyecto tiene **10 tablas** (no 9) — `comunicaciones` se agregó 2026-07-01.

---

## 1. Diagrama de componentes

```
                    CANALES DE ENTRADA
  ┌──────────────┬──────────────────┬─────────────────────┐
  │  Telegram    │   Gmail (OAuth)  │  WhatsApp (Fase 3)  │
  │  (interno)   │   poll 15 min    │  — no diseñar —     │
  └──────┬───────┴────────┬─────────┴─────────────────────┘
         │                │
         ▼                ▼
  ┌─────────────────────────────────────────┐
  │  W01 MASTERBOT — clasificador y router  │
  │  GPT-4o-mini: tipo + área + prioridad   │
  │  Crea caso en Supabase → asigna asesor  │
  └──────┬──────────────────────────────────┘
         │ INSERT casos (con sla_alerta_at / sla_escalar_at
         │ calculados desde sla_config)
         ▼
  ┌─────────────────────────────────────────────────────┐
  │                SUPABASE ekarbxdoaoqrtlmfzgyj        │
  │  existentes: clientes·asesores·polizas·vehiculos·   │
  │   siniestros·pendientes·actividades·cotizaciones·   │
  │   logs·comunicaciones                               │
  │  nuevas:     bots·casos·sla_config·puntos_asesores  │
  └───┬─────────────┬───────────────┬───────────────────┘
      │             │               │
      ▼             ▼               ▼
  ┌─────────┐ ┌───────────────┐ ┌──────────────────────┐
  │ W02/W03 │ │ W10 SLA       │ │ W09 Gamificación     │
  │ Gerencia│ │ Watchdog      │ │ (webhook al cerrar   │
  │ y Super │ │ cron 5 min    │ │  caso/actividad)     │
  │ visor   │ │ alerta→escala │ │ puntos_asesores      │
  │ bots    │ └──────┬────────┘ └──────────┬───────────┘
  └────┬────┘        │ notifica con token  │
       │             │ del mini-agente     │
       ▼             ▼ del área            ▼
  ┌──────────────────────────────────────────────────┐
  │              SALIDAS TELEGRAM                    │
  │ @MSDS_Gerencia_bot   → gerente (privado)         │
  │ @MSDS_Supervisor_bot → subgerente (privado)      │
  │ @MSDS_Siniestros_bot ┐                           │
  │ @MSDS_Autos_bot      ├ notifican a asesores      │
  │ @MSDS_Vida_bot       │ y escalan a supervisor/   │
  │ @MSDS_Cotiza_bot     ┘ gerente                   │
  └──────────────────────────────────────────────────┘
       ▲
       │ lectura KPIs / casos / ranking
  ┌────┴──────────────────────────┐
  │ gerencia.html (localhost:8080)│
  └───────────────────────────────┘
```

**Flujo externo (cliente → empresa):** canal → W01 clasifica → `casos` + `comunicaciones` → routing por área → tarea en `actividades` → asesor notificado por el mini-agente del área → asesor gestiona → W10 vigila SLA → cierre → W09 otorga puntos → dashboard refleja todo.

**Flujo interno (equipo → equipo):** gerente/supervisor escribe o dicta a su bot → W02/W03 interpreta intención (consulta / tarea / alerta) → si consulta: SELECT Supabase y responde; si tarea: INSERT `actividades` + notifica destinatario; si alerta: notificación inmediata. Todo queda en `comunicaciones`.

---

## 2. Esquema Supabase — DDL definitivo

Archivo a crear: `sql/04_crear_tablas_milestone_a.sql`. Convenciones: español, `bigint generated always as identity`, FKs `bigint` (corrección C1).

```sql
-- ============================================================
-- MILESTONE A — Bots, casos, SLA y gamificación
-- Correr en: Supabase -> SQL Editor (o psycopg2 directo)
-- Fecha: 2026-07-03
-- ============================================================

-- 1. REGISTRO DE BOTS
create table bots (
  id                 bigint generated always as identity primary key,
  nombre             text not null,           -- "MasterBot MSDS", "Coordinador Siniestros"...
  tipo               text not null,           -- masterbot / gerencia / supervisor / mini_agente
  area               text,                    -- siniestros / autos / vida / cotizaciones / null
  telegram_handle    text,                    -- @MSDS_Master_bot...
  token_ref          text,                    -- nombre de la credencial en n8n (NUNCA el token)
  system_prompt_file text,                    -- ruta al .md en system-prompts/
  chat_id_destino    text,                    -- chat que este bot notifica por defecto
  activo             boolean default true,
  creado_en          timestamptz default now()
);

-- 2. CASOS (expediente unificado; NO reemplaza comunicaciones)
create table casos (
  id                 bigint generated always as identity primary key,
  canal_origen       text not null,           -- telegram / gmail / whatsapp / manual
  cliente_id         bigint references clientes(id) on delete set null,
  tipo_requerimiento text not null,           -- siniestro / cotizacion / renovacion / consulta / interno / email
  area               text not null,           -- siniestros / autos / vida / generales / patrimoniales / cotizaciones
  estado             text not null default 'abierto',  -- abierto / en_curso / resuelto / cerrado / escalado
  prioridad          text not null default 'normal',   -- urgente / alta / normal / baja
  asesor_id          bigint references asesores(id) on delete set null,
  bot_asignado       bigint references bots(id) on delete set null,
  sla_alerta_at      timestamptz,             -- calculado al crear: now() + sla_alerta_minutos
  sla_escalar_at     timestamptz,             -- calculado al crear: now() + sla_escalar_minutos
  alertado           boolean default false,   -- W10 ya envió primera alerta
  escalado           boolean default false,   -- W10 ya escaló a gerencia
  ref_externa        text,                    -- message-id de email, message_id de telegram
  resumen            text,                    -- resumen del clasificador (GPT-4o-mini)
  notas              text,
  creado_en          timestamptz default now(),
  actualizado_en     timestamptz default now(),
  cerrado_en         timestamptz
);
create index idx_casos_estado     on casos(estado);
create index idx_casos_area       on casos(area);
create index idx_casos_asesor     on casos(asesor_id);
create index idx_casos_sla_activo on casos(sla_escalar_at)
  where estado in ('abierto','en_curso');

-- 3. CONFIGURACIÓN SLA (configurable — nunca hardcodear umbrales)
create table sla_config (
  id                  bigint generated always as identity primary key,
  tipo_requerimiento  text not null,
  area                text,                   -- null = aplica a todas las áreas
  sla_alerta_minutos  integer not null,
  sla_escalar_minutos integer not null,
  activo              boolean default true,
  unique nulls not distinct (tipo_requerimiento, area)
);

insert into sla_config (tipo_requerimiento, sla_alerta_minutos, sla_escalar_minutos) values
  ('siniestro',   15,  30),
  ('cotizacion',  120, 240),
  ('renovacion',  240, 480),
  ('consulta',    240, 480),
  ('email',       240, 480);

-- 4. GAMIFICACIÓN
create table puntos_asesores (
  id           bigint generated always as identity primary key,
  asesor_id    bigint not null references asesores(id) on delete cascade,
  caso_id      bigint references casos(id) on delete set null,
  actividad_id bigint references actividades(id) on delete set null,
  puntos       integer not null,
  motivo       text not null,                 -- antes_sla / a_tiempo / tarde / satisfaccion_cliente
  otorgado_por text default 'sistema',        -- sistema / gerente
  fecha        timestamptz default now()
);
create index idx_puntos_asesor on puntos_asesores(asesor_id);
create index idx_puntos_fecha  on puntos_asesores(fecha desc);

-- 5. EXTENSIÓN DE actividades (corrección C3 — pendiente firma AP, DECISIONES #1)
alter table actividades
  add column caso_id              bigint references casos(id) on delete set null,
  add column sla_horas            integer,
  add column escalado             boolean default false,
  add column puntos_otorgados     integer default 0,
  add column ultima_actualizacion timestamptz default now();
create index idx_actividades_caso on actividades(caso_id);

-- 6. TRAZABILIDAD comunicaciones ↔ casos (corrección C2)
alter table comunicaciones
  add column caso_id bigint references casos(id) on delete set null;
create index idx_comunicaciones_caso on comunicaciones(caso_id);
```

**Regla de cálculo SLA al crear caso (en W01, no en la DB):**
`sla_alerta_at = now() + sla_alerta_minutos` y `sla_escalar_at = now() + sla_escalar_minutos`, tomando la fila de `sla_config` que coincida con (`tipo_requerimiento`, `area`) y si no existe, la fila con `area = null`. Si no hay config → usar `consulta` como fallback y registrar advertencia en `logs`.

---

## 3. Workflows n8n — especificación detallada

**Patrón obligatorio para todo acceso a Supabase** (restricción n8n 2.8.3):
- Nodo **HTTP Request nativo** v4.2 — jamás Code node con fetch/$http/$env.
- Doble header en cada llamada: `Authorization: Bearer <service_role>` + `apikey: <service_role>`.
- Key desde **n8n Credentials** (httpHeaderAuth) — placeholder `SUPABASE_KEY_AQUI` en los JSON del repo.
- Telegram: **texto plano** (sin parse_mode MarkdownV2 — bugs de escaping).
- GPT-4o-mini: HTTP Request a `https://api.openai.com/v1/chat/completions`, credencial `OPENAI_MSDS` en n8n, `response_format: {"type":"json_object"}` para clasificación.

**Manejo de errores estándar (todos los workflows):**
1. Nodos HTTP con `retryOnFail: true`, 2 reintentos, 3 s entre intentos.
2. Rama de error → INSERT en `logs` (cambio_estado = descripción del fallo) → notificación Telegram al gerente solo si el fallo es de un flujo crítico (W01, W10).
3. Webhooks siempre responden 200 con `{"ok":false,"error":"..."}` ante fallo interno — nunca dejar al emisor sin respuesta.

### W01 — MasterBot Clasificador y Router
- **Trigger:** Webhook `POST /msds-master` (entradas de Telegram trigger del MasterBot, W08 Gmail, formulario web futuro). Payload normalizado: `{canal_origen, remitente, texto, ref_externa, cliente_hint}`.
- **Lógica:**
  1. Normalizar payload (Set).
  2. Buscar cliente: GET `clientes?or=(telefono.eq.X,correo.eq.X,celular.eq.X)` con el remitente; si 0 resultados → `cliente_id = null`, caso queda "sin identificar".
  3. Clasificar con GPT-4o-mini (prompt = `MASTERBOT_SYSTEM.md`): retorna JSON `{tipo_requerimiento, area, prioridad, resumen}`. Validar contra listas cerradas; si valor fuera de lista o error de parseo → `tipo=consulta, area=generales, prioridad=normal` + flag para revisión manual (nota en caso).
  4. GET `sla_config` → calcular `sla_alerta_at` / `sla_escalar_at`.
  5. Elegir asesor: GET `asesores?ramo=eq.<area>&activo=eq.true` → asignación round-robin (el que tenga menos casos abiertos: GET casos agrupado; en n8n: traer casos abiertos por asesor y elegir mínimo en Code node de lógica pura — permitido, no hace HTTP).
  6. INSERT `casos` (Prefer: return=representation) → INSERT `comunicaciones` con `caso_id` → INSERT `actividades` con `caso_id`.
  7. Notificar asesor vía token del mini-agente del área (mensaje: caso #id, cliente, tipo, resumen, SLA).
- **Output:** 200 `{ok:true, caso_id}`.
- **No hace:** responder al cliente, decidir contenido, cerrar casos.

### W02 — Gerencia_bot
- **Trigger:** Telegram Trigger (token `@MSDS_Gerencia_bot`).
- **Seguridad:** primer nodo IF valida `chat.id == CHAT_ID_GERENTE` (DECISIONES #6) — si no coincide, responder "no autorizado" y terminar.
- **Voz:** si `message.voice` → GET file de Telegram → POST Whisper (`whisper-1`) → texto.
- **Comandos** (parseo por prefijo en Code node de lógica pura; si no hay prefijo → intención vía GPT-4o-mini):
  - `/pendientes` → GET `casos?estado=in.(abierto,en_curso)&order=sla_escalar_at.asc&limit=15`
  - `/proceso [id]` → GET caso + actividades + comunicaciones del caso
  - `/asesor [nombre]` → GET asesor ilike + sus casos abiertos + puntos del mes
  - `/criticos` → GET `casos?or=(escalado.eq.true,prioridad.eq.urgente)&estado=neq.cerrado`
  - `/resumen` → conteos del día: casos nuevos, cerrados, escalados, sin responder (Prefer: count=exact)
  - Texto libre "crear tarea para X: ..." → GPT extrae {asesor, descripcion, prioridad} → INSERT actividades + notifica asesor vía mini-agente.
- **Regla dura:** toda respuesta sale de datos de Supabase. Si la consulta no matchea nada: "No encuentro registros" — nunca inventar.
- Todo comando y respuesta → INSERT `comunicaciones` (canal telegram, direccion segun flujo, caso_id si aplica).

### W03 — Supervisor_bot
Clon de W02 con tres diferencias:
1. Token `@MSDS_Supervisor_bot`, IF `chat.id == CHAT_ID_SUPERVISOR`.
2. **Alcance:** solo casos/actividades de asesores bajo su supervisión — filtro `asesor_id=in.(<lista>)`. La lista sale de `asesores` (DECISIONES #3: mapeo asesor↔área↔supervisor).
3. **Bloqueado:** cualquier consulta financiera (comisiones, primas agregadas) → respuesta fija "Esa información es de gerencia."

### W08 — Gmail Monitor
- **Trigger:** Schedule cada 15 min.
- **Lógica:** Gmail node (OAuth, cuenta DECISIONES #5) → filtro `is:unread in:inbox` → por cada correo: extraer remitente/asunto/cuerpo (texto plano, truncar 2000 chars) → POST al webhook W01 con `canal_origen: gmail`, `ref_externa: message-id` → marcar como leído SOLO si W01 respondió `ok:true` (garantiza no perder correos si W01 falla).
- **Dedupe:** antes de postear, GET `casos?ref_externa=eq.<message-id>` — si existe, saltar.
- **Extensibilidad Outlook (D4):** W08 es el único punto que toca Gmail; migrar = reemplazar el nodo Gmail por nodo Outlook, el resto intacto.

### W10 — SLA Watchdog (consolidado — corrección C4)
- **Trigger:** Cron cada 5 min.
- **Lógica:**
  1. GET `casos?estado=in.(abierto,en_curso)&alertado=eq.false&sla_alerta_at=lte.now` → por cada uno: notificar al supervisor vía token del **mini-agente del área** (`bots.token_ref` según `casos.area`) → PATCH `alertado=true`.
  2. GET `casos?estado=in.(abierto,en_curso)&escalado=eq.false&sla_escalar_at=lte.now` → notificar al **gerente** (vía Gerencia_bot) con detalle + asesor responsable → PATCH `escalado=true, estado=escalado` + `actividades.escalado=true`.
  3. INSERT resumen de la corrida en `logs` (cuántos alertados/escalados).
- Los "mini-agentes" W04–W07 del master doc quedan implementados como **filas en `bots`** (identidad + token + área) usadas por W10 y W01 para notificar. Si AP rechaza la consolidación (DECISIONES #2), W10 se clona en 4 workflows con filtro `area=eq.X` — misma spec.

### W09 — Gamification Engine
- **Trigger:** Webhook `POST /msds-cierre` — invocado cuando un caso/actividad se cierra (desde W02/W03 al comando de cierre, o manual desde dashboard).
- **Lógica:**
  1. GET caso → validar `estado` pasa a cerrado → PATCH `cerrado_en=now()`.
  2. Calcular puntos: `cerrado_en < sla_alerta_at` → +10 (`antes_sla`) · `cerrado_en <= sla_escalar_at` → +5 (`a_tiempo`) · después → 0 (`tarde`, se registra con 0 puntos para trazabilidad).
  3. INSERT `puntos_asesores` + PATCH `actividades.puntos_otorgados`.
  4. Notificar al asesor (mini-agente del área): "Caso #id cerrado — +N puntos. Total del mes: M".
- **Satisfacción cliente (+15):** comando del gerente en W02 (`/felicitar [caso_id]`) → INSERT motivo `satisfaccion_cliente`.
- Ranking mensual: `gerencia.html` consulta `puntos_asesores` agregado por asesor (Milestone B integra la vista; el dato queda disponible desde ya).

**Tabla resumen:**

| ID | Nombre | Trigger | Estado |
|---|---|---|---|
| W01 | MasterBot Clasificador | Webhook POST /msds-master | diseñado |
| W02 | Gerencia Bot | Telegram trigger | diseñado |
| W03 | Supervisor Bot | Telegram trigger | diseñado |
| W08 | Gmail Monitor | Schedule 15 min | diseñado |
| W09 | Gamification Engine | Webhook POST /msds-cierre | diseñado |
| W10 | SLA Watchdog | Cron 5 min | diseñado (absorbe W04–W07) |

---

## 4. System prompts

Contenido completo en `system-prompts/` (7 archivos, fuente única de verdad — no duplicar aquí para evitar deriva):

| Archivo | Bot | Esencia |
|---|---|---|
| `MASTERBOT_SYSTEM.md` | MasterBot | Clasificador JSON estricto: tipo/área/prioridad/resumen. No conversa, no decide, no improvisa |
| `GERENCIA_BOT_SYSTEM.md` | Gerencia_bot | Asistente del gerente. Solo datos de Supabase. Comandos + lenguaje natural. Acceso total |
| `SUPERVISOR_BOT_SYSTEM.md` | Supervisor_bot | Igual que gerencia, alcance limitado a su equipo, financiero bloqueado |
| `MINI_SINIESTROS_SYSTEM.md` | Coordinador Siniestros | Plantillas de notificación SLA área siniestros (15/30 min) |
| `MINI_AUTOS_SYSTEM.md` | Coordinador Autos | Ídem, área autos |
| `MINI_VIDA_SYSTEM.md` | Coordinador Vida | Ídem, vida + generales + patrimoniales |
| `MINI_COTIZACIONES_SYSTEM.md` | Coordinador Cotizaciones | Ídem, pipeline cotizaciones (2h/4h) |

Cada archivo especifica: identidad · qué PUEDE y qué NO PUEDE · comandos con sintaxis · formato de respuesta (texto plano) · protocolo de escalamiento · contexto MSDS (ramos, equipo, SLAs).

---

## 5. Bots en BotFather (acción manual de AP)

| Bot | Handle sugerido | Token → Bitwarden como | n8n Credential |
|---|---|---|---|
| MasterBot MSDS | `@MSDS_Master_bot` | "MSDS Telegram Master" | `TG_MASTER` |
| Gerencia Bot | `@MSDS_Gerencia_bot` | "MSDS Telegram Gerencia" | `TG_GERENCIA` |
| Supervisor Bot | `@MSDS_Supervisor_bot` | "MSDS Telegram Supervisor" | `TG_SUPERVISOR` |
| Coordinador Siniestros | `@MSDS_Siniestros_bot` | "MSDS Telegram Siniestros" | `TG_SINIESTROS` |
| Coordinador Autos | `@MSDS_Autos_bot` | "MSDS Telegram Autos" | `TG_AUTOS` |
| Coordinador Vida | `@MSDS_Vida_bot` | "MSDS Telegram Vida" | `TG_VIDA` |
| Coordinador Cotizaciones | `@MSDS_Cotiza_bot` | "MSDS Telegram Cotiza" | `TG_COTIZA` |

Si un handle está tomado, sufijo `_msds` — registrar el definitivo en tabla `bots`.
`SCMSDS_bot` se mantiene vivo, fuera de producción (recepcionista Fase 3).

---

## 6. Plan de trabajo Milestone A — semana a semana

**Prerrequisito (Semana 0, AP — 1 a 2 días):**
- Responder DECISIONES_PENDIENTES (7 ítems).
- Crear los 7 bots en BotFather → tokens a Bitwarden → credenciales en n8n.
- Obtener chat_ids reales de gerente y supervisor (mensaje a @userinfobot).

**Semana 1 — Base de datos + primer bot visible:**
- Aplicar `04_crear_tablas_milestone_a.sql` (validado con BEGIN/ROLLBACK antes).
- Poblar `bots` (7 filas) y verificar `sla_config` seeds.
- Construir **W02 Gerencia_bot** completo (comandos + voz Whisper + guardia de chat_id).
- ✅ Checkpoint: gerente ejecuta `/resumen` y `/pendientes` con datos reales desde su Telegram.
- *Por qué primero W02:* valor visible inmediato para el cliente, valida todo el patrón (Telegram trigger + Supabase + GPT) antes de construir lo complejo.

**Semana 2 — Cerebro del sistema:**
- **W01 MasterBot** (clasificador + routing + creación de casos).
- **W03 Supervisor_bot** (clon W02 con alcance limitado).
- ✅ Checkpoint: mensaje de prueba a MasterBot → caso creado con SLA calculado → asesor notificado por el mini-agente correcto.

**Semana 3 — Vigilancia y correo:**
- **W10 SLA Watchdog** (alerta + escalamiento).
- **W08 Gmail Monitor** (OAuth + dedupe + handoff a W01).
- ✅ Checkpoint: caso con SLA vencido artificialmente → alerta al supervisor a los 5 min del cron → escalamiento al gerente. Email de prueba → caso creado.

**Semana 4 — Cierre del ciclo + endurecimiento:**
- **W09 Gamificación** + comando `/felicitar`.
- Pruebas end-to-end de los 4 flujos (externo, interno, email, SLA).
- Ramas de error en todos los workflows + registro en `logs`.
- Exportar JSONs a `/workflows/` (sin tokens) + actualizar CHECKPOINT_ACTUAL.md.
- ✅ Checkpoint final: demo completa al cliente.

**Orden de construcción y dependencias:**
```
DDL (04) ──► poblar bots ──► W02 ──► W03
                │                      
                ├──────────► W01 ──► W10
                │             │
                │             └────► W08 (requiere W01 vivo)
                └──────────────────► W09 (requiere casos existentes)
```

---

## 7. Reglas para CC y Codex durante la construcción

1. Un workflow a la vez; no abrir el siguiente sin checkpoint ✅ del anterior.
2. JSONs exportados al repo SIEMPRE con placeholders (`SUPABASE_KEY_AQUI`, credenciales por referencia) — regla vigente de seguridad.
3. Campos, tablas y comentarios en español.
4. Cualquier desviación del diseño → registrar en `DECISIONES.md` con fecha y por qué.
5. Probar cada INSERT masivo con keys idénticas en todos los objetos (PostgREST `PGRST102`).
6. Telegram siempre texto plano.

---

*Diseño: Fable · 2026-07-03 · Ver DECISIONES_PENDIENTES.md y RIESGOS.md en esta carpeta.*
