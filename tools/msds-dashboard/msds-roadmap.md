# MSDS-CRM Roadmap

> LECTURA ONLY. No editar desde server.mjs. Fuente: definición Fable 2026-07-10.

## Hito A: Sistema Comunicaciones Telegram

### T-A1: MasterBot Coordinator
- **ID:** T-A1
- **Descripción:** Crear workflow W00 que coordine todos los bots
- **Dependencias:** ninguna
- **Estado:** Completado
- **Modelo recomendado:** Fable
- **Ejecutor:** Codex
- **Verificación:**
  - W00.json importado en n8n
  - Endpoints coordinador activos
  - Test /start desde Telegram válido

### T-A2: Bots Personales por Asesor
- **ID:** T-A2
- **Descripción:** Crear bots personales por asesor (W01-W03)
- **Dependencias:** T-A1
- **Estado:** Completado
- **Modelo recomendado:** Fable
- **Ejecutor:** Codex
- **Verificación:**
  - W01-W03 importados en n8n
  - Bots registrados por asesor

### T-A3: Cargar Credenciales Telegram n8n
- **ID:** T-A3
- **Descripción:** Verificado 2026-07-12 vía n8n API real: 12 credenciales "MSDS Bot — X" con IDs reales, todas wired en W00/W01/W02/W03 (Master, Gerencia N/B, Autos N/R, Cartera, Caja, Generales, Cumplimiento, Siniestros, Comisiones, Supervisor). El bloqueante previo (Caja_bot truncado, __PENDIENTE__) era diagnóstico erróneo sobre un set duplicado/huérfano "MSDS_X_bot" sin uso real en ningún workflow.
- **Dependencias:** T-A1, T-A2
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex
- **Verificación:**
  - 12 credentials tipo telegramApi cargadas ✅ (confirmado GET /api/v1/credentials)
  - Caja_bot token validado vía Telegram getMe: ok=true, 46 chars, sin webhook conflictivo ✅
  - Workflows W00-W03 referencian credenciales reales por ID ✅

### T-A3b: Crear Tabla `casos` en Supabase — DESCARTADO
- **ID:** T-A3b
- **Descripción:** Verificado 2026-07-12 vía REST API real (GET/POST /rest/v1/casos): la tabla SÍ existe en Supabase con schema completo (canal_origen, cliente_id, tipo_requerimiento, area, estado, prioridad, asesor_id, bot_asignado, sla_alerta_at, sla_escalar_at, alertado, escalado, ref_externa, resumen, notas, timestamps) — coincide exacto con diseño en PLAN_ARQUITECTURA_MSDS.md:108. Creada fuera de los scripts versionados sql/01-04 (igual que `bots`), por eso el checkpoint anterior (grep sobre archivos .sql) no la detectó. Insert/delete de prueba confirmaron funcionamiento correcto. 0 filas (esperado, sin intake real aún).
- **Dependencias:** ninguna
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-A3c: Validar Credential Caja_bot — DESCARTADO
- **ID:** T-A3c
- **Descripción:** Descartado 2026-07-12: el diagnóstico original apuntaba al set huérfano "MSDS_X_bot" (sin uso). La credencial real wired en W00 es "MSDS Bot — Caja" (id FB7PIJjENbsktCh2), token validado vía Telegram getMe (ok=true, 46 chars, bot "MSDS Caja" activo, sin webhook pendiente). No hay acción pendiente.
- **Dependencias:** ninguna
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-A4: Team /start Activation
- **ID:** T-A4
- **Descripción:** Cada asesor envía /start a su bot (genera chat_id). BLOQUEANTE: solo Fabio confirmado (chat_id 8695082898); 10 de 11 asesores + Jorge sin chat_id en Supabase. Recolectar con @userinfobot → UPDATE asesores.chat_id.
- **Dependencias:** T-A3
- **Estado:** Bloqueante humano
- **Modelo recomendado:** Manual
- **Ejecutor:** Manual (AP)
- **Prioridad:** Crítica
- **Checklist:**
  - [x] Fabio → @MSDS_Gerencia_N_bot /start (chat_id 8695082898 confirmado)
  - [ ] Santiago → @MSDS_Gerencia_B_bot /start
  - [ ] Gabriel → @MSDS_Autos_N_bot /start
  - [ ] Valentina, Geraldin, Natalia, Aida, Leonela, Oscar, Yamaira (7 pendientes)
  - [ ] Jorge → @MSDS_Supervisor_bot /start

### T-A5: Validar P4 Siniestros End-to-End
- **ID:** T-A5
- **Descripción:** Crear caso siniestro test → verificar notificación Telegram en 15min → escala en 30min
- **Dependencias:** T-A3b, T-A4
- **Estado:** Bloqueado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex
- **Prioridad:** Crítica
- **Verificación:**
  - Caso creado en Supabase
  - Notificación recibida en chat de Fabio
  - Escala automática al gerente

### T-A6: Validar P5 Comunicaciones End-to-End
- **ID:** T-A6
- **Descripción:** Validar flujo P5 comunicaciones completo entre bots y Supabase. W03 aún rutea a chat test de Andrés, pendiente cambiar a Jorge real una vez T-A4 resuelto.
- **Dependencias:** T-A3b, T-A4
- **Estado:** Bloqueado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex
- **Prioridad:** Crítica
- **Verificación:**
  - P5 importado en n8n
  - Test mensaje end-to-end exitoso
  - W03 rutea a Jorge, no a Andrés

### T-A7: Rotar Service_role Key + Mover a Env Vars
- **ID:** T-A7
- **Descripción:** Supabase service_role key expuesta en texto plano en gerencia.html (~línea 981). Rotar key en Supabase, eliminar de HTML, mover a backend .env o variable de entorno n8n.
- **Dependencias:** ninguna
- **Estado:** Bloqueado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex
- **Prioridad:** Alta

### T-A8: Verificar Sincronización Active/Inactive Workflows n8n
- **ID:** T-A8
- **Descripción:** Checklist local marca W00-W03/W10/W11 como activos (2026-07-11), pero JSON local muestra "active": false. Consultar estado real via n8n API y reconciliar contra JSON local.
- **Dependencias:** ninguna
- **Estado:** En curso
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex
- **Prioridad:** Media

## Hito B: CRM Operativo Completo

### T-B1: Dashboard Gerencia.html Refinamiento KPIs
- **ID:** T-B1
- **Descripción:** Refinar dashboard gerencia.html con KPIs actualizados
- **Dependencias:** T-A6
- **Estado:** Planeado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-B2: Módulo Clientes (CRUD via Supabase)
- **ID:** T-B2
- **Descripción:** CRUD completo de clientes contra Supabase
- **Dependencias:** T-B1
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-B3: Módulo Pólizas (CRUD via Supabase)
- **ID:** T-B3
- **Descripción:** CRUD completo de pólizas contra Supabase
- **Dependencias:** T-B2
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-B4: Módulo Siniestros (SLA Monitor)
- **ID:** T-B4
- **Descripción:** Monitor SLA de siniestros
- **Dependencias:** T-B3
- **Estado:** Completado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-B5: Módulo Actividades (Timeline + Seguimiento)
- **ID:** T-B5
- **Descripción:** Timeline y seguimiento de actividades
- **Dependencias:** T-B4
- **Estado:** Planeado
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

## Hito C: Cotizador + Financiero

### T-C1: Motor Cotizador Seguros Auto
- **ID:** T-C1
- **Descripción:** Motor de cotización para seguros de auto
- **Dependencias:** T-B5
- **Estado:** Futuro
- **Modelo recomendado:** Opus
- **Ejecutor:** Codex

### T-C2: Integración Wompi Pagos
- **ID:** T-C2
- **Descripción:** Integración de pagos con Wompi
- **Dependencias:** T-C1
- **Estado:** Futuro
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

### T-C3: Módulo Comisiones y Reportes
- **ID:** T-C3
- **Descripción:** Módulo de comisiones y reportes financieros
- **Dependencias:** T-C2
- **Estado:** Futuro
- **Modelo recomendado:** Sonnet
- **Ejecutor:** Codex

## Hito D: Marketing y Promoción

### T-D1: Automatización WhatsApp Leads
- **ID:** T-D1
- **Descripción:** Automatizar captura y seguimiento de leads via WhatsApp
- **Dependencias:** ninguna
- **Estado:** Futuro
- **Modelo recomendado:** Fable
- **Ejecutor:** Codex

### T-D2: Email Campaigns
- **ID:** T-D2
- **Descripción:** Campañas de email marketing
- **Dependencias:** ninguna
- **Estado:** Futuro
- **Modelo recomendado:** Fable
- **Ejecutor:** Codex
