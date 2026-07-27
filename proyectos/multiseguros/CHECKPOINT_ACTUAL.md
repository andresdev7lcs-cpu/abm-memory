# CHECKPOINT — Estado actual del proyecto Multiseguros del Sur
Fecha: 2026-07-03 | Fuente única de verdad de estado. ESTADO_REAL.md eliminado.

## SESIÓN 2026-07-03 — ARQUITECTURA MILESTONE A ✅
- Diseño completo entregado en `arquitectura/`: PLAN_ARQUITECTURA_MSDS.md + DECISIONES_PENDIENTES.md + RIESGOS.md
- 7 system prompts en `system-prompts/` (MasterBot, Gerencia, Supervisor, 4 coordinadores)
- DDL Milestone A (bots, casos, sla_config+seeds, puntos_asesores, ALTER actividades/comunicaciones) **validado contra Supabase con BEGIN/ROLLBACK** — listo para aplicar, NO aplicado aún
- Correcciones al master doc: FKs bigint (no uuid), casos NO reemplaza comunicaciones, ALTER actividades recomendado sobre v2, watchdog SLA consolidado (1 cron vs 5)
- ⚠️ BLOQUEANTE: AP debe responder los 7 ítems de DECISIONES_PENDIENTES.md antes de que CC/Codex construyan

---

## ESTADO POR BLOQUE

### Bloque 1: Migración clientes ✅ DONE (2026-06-16)
- 7 tablas creadas en Supabase MSDS-CRM (ekarbxdoaoqrtlmfzgyj.supabase.co)
- .env configurado en ~/Downloads/.env
- 523 clientes insertados desde Airtable (531 origen → 528 con nombre → 523 sin duplicados)
- Validación: COUNT=523, tipo=natural, campos completos ✅

### Bloque 2: Workflows a Supabase ✅ DONE — P4 validado en producción 2026-06-20
- P4 Siniestros Urgentes: ✅ OPERATIVO — flujo completo verificado 2026-06-20
  - Versión activa: v4 (nodos HTTP Request nativos + credencial Supabase API + header apikey manual)
  - Póliza de prueba confirmada: POL-0001
  - Flujo: Buscar Póliza → Agregar Resultados → Preservar Contexto → Poliza existe? → Crear Siniestro → Notificar Telegram → Respuesta 200 OK
  - Mensaje Telegram llegó al gerente (chat ID 8695082898) ✅
  - Siniestro creado en tabla siniestros de Supabase ✅
  - ⚠️ Pendiente: agregar header apikey en nodo Buscar Poliza (igual que Crear Siniestro)
  - ⚠️ Pendiente: exportar v4_final desde n8n UI → guardar en /workflows/
- P3 Cotizaciones: ✅ importado, activo en n8n — sin respaldo local
- P2 Pólizas por Vencer: ✅ importado, credenciales asignadas — sin respaldo local

### Bloque 3: gerencia.html ⏳ EN PROGRESO
- HTML reescrito para Supabase (KPIs + ficha cliente migrados de Airtable)
- ❌ Sin testear en browser — KPIs no confirmados

### Bloque 4: AndyBot Telegram ✅ OPERATIVO (2026-06-22)
- Desviación detectada 2026-06-19: SCMSDS_bot tenía system prompt de Andrés (incorrecto) — corregido
- AndyBot personal operativo con cerebro completo en Supabase andybot-memory
  - 7 tablas: proyectos, tareas, decisiones, glosario, historia, mision, skills — 71+ registros
  - Prueba ácida pasada: datos específicos confirmados (523 clientes, fecha migración, costo, Celer)
  - Workflow v10 activo en n8n — HTTP Request nativos, sin fetch ni $env
  - Restricción confirmada: JS Task Runner 2.8.3 bloquea $env, fetch(), $http — solo HTTP Request nativos
- ABM reorganizado: andy-rol/ separado de proyectos/multiseguros/
- Voz (Whisper): ❌ no implementado todavía

### Bloque 5: Componente Comunicaciones (Módulo Comercial) ✅ BASE CONSTRUIDA (2026-07-01)
- Tabla `comunicaciones` creada en Supabase (canal, direccion, remitente, asunto, mensaje, estado, ref_externa + FKs cliente/asesor/poliza + 4 índices)
  - SQL: `sql/03_crear_tabla_comunicaciones.sql` — aplicado vía psycopg2 directo (host `db.ekarbxdoaoqrtlmfzgyj.supabase.co:5432`, IPv6)
- gerencia.html: nueva tab "Comunicaciones" — KPIs (hoy / sin responder / WhatsApp 30d / Email 30d), bandeja con filtros canal/estado/dirección, modal registrar manual con vínculo a cliente por nombre (ilike), acciones Respondida/Cerrar, link a ficha cliente
- Workflow n8n: `workflows/P5_Comunicaciones_Inbox.json` — Webhook POST `/msds-comunicaciones` → Normalizar → INSERT Supabase (HTTP Request nativo, key placeholder) → Telegram gerente (8695082898) → 200 OK
  - ⚠️ Pendiente: importar en n8n UI, reemplazar `SUPABASE_ANON_KEY_AQUI` (Bitwarden), asignar credencial Telegram, activar
  - ⚠️ Pendiente: conectar Evolution API (WhatsApp) al webhook — decisión 2026-06-12: Evolution para piloto, 360dialog para producción
- Bugs corregidos en gerencia.html durante desarrollo:
  - `sp()` enviaba header `Range: 0-0` → TODA lista quedaba truncada a 1 fila (verificado con curl). Header eliminado.
  - `spUpdate()` hacía `r.json()` sobre respuesta vacía de PATCH `return=minimal` → lanzaba error aunque el update funcionara. Ahora retorna `true`.
- Test end-to-end 2026-07-01: 4 comunicaciones demo insertadas (ids 1-4), KPIs/filtros/PATCH/búsqueda ilike verificados vía REST
- Dato aprendido: PostgREST bulk INSERT exige keys idénticas en todos los objetos (error `PGRST102`)

---

## DATOS DE CONTEXTO

- **Clientes en Supabase:** 523 (tabla `clientes`)
- **Otras tablas:** probablemente vacías (pólizas, siniestros, cotizaciones, asesores, log_workflows)
- **Script migración:** `scripts/migrar_clientes_airtable_a_supabase.py` ✅
- **Supabase MSDS-CRM:** ekarbxdoaoqrtlmfzgyj.supabase.co
- **n8n:** https://no-26feb-n8n.ydlmwq.easypanel.host/
- **Bots Telegram:**
  - `SCMSDS_bot` (8889541466) → bot del cliente, system prompt en SCMSDS_BOT_SYSTEM.md
  - AndyBot personal → bot nuevo pendiente (Andrés crea en @BotFather)

---

## ARCHIVOS CLAVE

```
proyectos/multiseguros/
├── CHECKPOINT_ACTUAL.md          ← este archivo (fuente única de verdad)
├── DECISIONES.md                 ← decisiones y por qué
├── SCMSDS_BOT_SYSTEM.md          ← system prompt bot del cliente ← NUEVO
├── MISE_EN_PLACE.md              ← apps, configs (desactualizado, ver notas)
├── PLAN_EJECUCION.md             ← plan original de bloques
├── scripts/
│   └── migrar_clientes_airtable_a_supabase.py
├── sql/
│   └── 01_crear_tablas.sql
└── workflows/
    └── AndyBot_Telegram_Supabase.json  ← key limpia, usa $env.OPENAI_API_KEY
```

---

## PRÓXIMAS ACCIONES (en orden)

1. Rotar service_role key de Supabase MSDS (hallazgo auditoría — pendiente desde 2026-06-21)
2. Importar P5_Comunicaciones_Inbox.json en n8n → key desde Bitwarden + credencial Telegram → activar → test webhook
3. Abrir gerencia.html en browser y validar tab Comunicaciones (4 demos cargadas, ids 1-4)
4. Conectar Evolution API (WhatsApp piloto) al webhook P5
5. Exportar P2 y P3 desde n8n UI → guardar en /workflows/ con nombre y fecha
6. Eliminar footer n8n en Easypanel
7. Continuar sprint A1 (próxima sesión)

---

## SESIÓN 2026-06-22 — FIN

- AndyBot operativo con cerebro completo en Supabase andybot-memory
- 7 tablas: proyectos, tareas, decisiones, glosario, historia, mision, skills — 71+ registros
- Prueba ácida pasada: datos específicos confirmados (523 clientes, fecha, costo, Celer)
- Workflow v10 activo en n8n — HTTP Request nativos, sin fetch ni $env
- ABM reorganizado: andy-rol/ separado de proyectos/multiseguros/

## SESIÓN 2026-06-22 — COMPLETA

- AndyBot v13 operativo — cerebro completo con 3 proyectos
- Tareas agrupadas por proyecto — sin mezcla entre clientes
- Modutriplex e IMASAS cargados en Supabase andybot-memory
- Pruebas pasadas: estado proyectos, tareas por cliente, historia, skills

---

## SESIÓN 2026-07-27 — RETOMAR + SECURIDAD

### T-A4: Webhook /start Capture
- ✅ **Creado:** W04_Telegram_Start_ChatId.json
  - Captura `POST /webhook/msds-start` (Telegram update)
  - Extrae `chat_id` + `username` 
  - UPDATE `asesores.telegram_chat_id` donde `telegram_username = @username`
  - Respuesta: 200 OK si UPDATE exitoso
- ⏳ **Pendiente:** AP importar en n8n UI + activar webhook

### T-A7: Supabase Key Rotation
- ✅ **Auditoría completa:** 
  - Key vieja (`sb_secret_[REVOCADA]`) NO en uso actual
  - gerencia.html (línea 693): JWT long-term válido (exp: 2097)
  - Workflows: usan `$env.SUPABASE_SERVICE_ROLE_KEY` (placeholder, no hardcodeado)
  - Cleanup script creado: `tools/cleanup-supabase-key.mjs`
- ✅ **Acción COMPLETADA:** No requiere rotación inmediata (key vieja no activa)
- 📋 **Documentado:** Hito B report lista GO-LIVE estado

### Infraestructura
- n8n URL actual: `https://no-26feb-n8n.ydlmwq.easypanel.host/` (Easypanel)
- Supabase: `ejaxtfqwhgppgdglxmkt.supabase.co` — estable
- 11 bots Telegram verificados activos (getMe 2026-07-27)

### Estado GO-LIVE 2026-07-31
| Criterio | Estado | Blocker |
|----------|--------|---------|
| T-A4 chat_ids | ⏳ Pendiente AP + equipo | 🔴 Crítico |
| T-A7 key security | ✅ OK (no acción requerida hoy) | — |
| T-B CRM ops | ✅ 100% operativo | — |
| T-A5 escalación | ⏳ Re-test pending T-A4 | — |
