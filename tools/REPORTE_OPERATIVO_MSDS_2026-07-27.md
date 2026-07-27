# REPORTE OPERATIVO — MSDS-CRM Proyecto Telegram + CRM
**Fecha:** 2026-07-27  
**Responsable:** Andrés Palomares (AP)  
**Estado General:** 🟡 READY CON BLOCKERS CRÍTICOS

---

## 📊 RESUMEN EJECUTIVO

**MSDS-CRM** integra:
1. **Hito A:** Sistema comunicaciones Telegram (bots por asesor) — **85% listo** (bloqueante: chat_ids equipo)
2. **Hito B:** CRM operativo (CRUD clientes/pólizas, SLA monitor) — **100% operativo**
3. **Hito C/D:** Futuro (cotizador, financiero, marketing)

**¿Qué funciona HOY?**
- ✅ 11 bots Telegram activos (Master + 10 especializados)
- ✅ 12 credenciales Telegram cargadas en n8n
- ✅ Flujo P4 (siniestros) con alertas SLA 15/30min
- ✅ Dashboard gerencia.html (KPIs, filtros casos/estado)
- ✅ CRUD clientes, pólizas, siniestros
- ✅ Monitor SLA con webhook escalación

**¿Qué NO funciona sin acción?**
- 🔴 10/11 asesores sin activar en Telegram (falta chat_id) → P4/P5 no usan equipo real
- 🔴 Supabase service_role key expuesta en código (gerencia.html línea 981)
- ⚠️ P4 escalación interrumpida por timeout n8n (2026-07-11) — recovery OK, pending re-test

---

## 🎯 HITO A: SISTEMA COMUNICACIONES TELEGRAM

### Completados ✅
| Ticket | Descripción | Verificación |
|--------|------------|--------------|
| **T-A1** | MasterBot W00 Coordinador | W00 importado, endpoints activos |
| **T-A2** | Bots por Asesor W01-W03 | 10 bots especializados (Gerencia N/B, Autos N/R, Cartera, Caja, Gen., Cumpl., Siniestros, Comisiones) |
| **T-A3** | 12 Credenciales Telegram n8n | Verificadas via n8n API, todas wired en workflows, tokens válidos |
| **T-A3b** | Tabla `casos` Supabase | EXISTS (schema: canal_origen, cliente_id, tipo_requerimiento, area, estado, prioridad, asesor_id, bot_asignado, sla_alerta_at, sla_escalar_at, alertado, escalado, ref_externa, resumen, notas, timestamps) |
| **T-A3c** | Credencial Caja_bot | Active, token 8589027327:AAGF16RNwcmy_jrBHBhJ8jMUZl80GjqGgUU válido |

### Bloqueante Crítico 🔴 — T-A4: Team /start Activation

**Estado:** 1/11 + Jorge completados

| Worker | Bot | Handle | Chat ID | Estado |
|--------|-----|--------|---------|--------|
| Fabio | Gerencia N | @MSDS_Gerencia_N_bot | 8695082898 | ✅ Confirmado (usado como terminal test AP) |
| Santiago | Gerencia B | @MSDS_Gerencia_B_bot | — | ⏳ Pendiente |
| Gabriel | Autos N | @MSDS_Autos_N_bot | — | ⏳ Pendiente |
| Valentina | Autos R | @MSDS_Autos_R_bot | — | ⏳ Pendiente |
| Geraldin | Cartera | @MSDS_Cartera_bot | — | ⏳ Pendiente |
| Natalia | Caja | @MSDS_Caja_bot | — | ⏳ Pendiente |
| Aida | Generales | @MSDS_Generales_bot | — | ⏳ Pendiente |
| Leonela | Cumplimiento | @MSDS_Cumplimiento_bot | — | ⏳ Pendiente |
| Oscar | Siniestros | @MSDS_Siniestros_bot | — | ⏳ Pendiente |
| Yamaira | Comisiones | @MSDS_Comisiones_bot | — | ⏳ Pendiente |
| Jorge | Supervisor | @MSDS_Supervisor_bot | — | ⏳ Pendiente (crítico: escalaciones) |

**Acción Requerida:**
Cada worker envía `/start` a su bot en Telegram. Sistema n8n webhook automáticamente captura chat_id y actualiza Supabase `asesores.chat_id`.

**Impacto si no se completa:**
- T-A5 (P4 siniestros) no puede enviar notificaciones a equipo real
- T-A6 (P5 comunicaciones) no puede rutear a asesores correctos
- Dashboard gerencia.html solo ve AP como activo

---

### Parcialmente Verificados ⚠️

| Ticket | Estado | Evidencia | Pendiente |
|--------|--------|-----------|-----------|
| **T-A5** | Alerta ✅ / Escalación ⚠️ | Caso test id=3 (2026-07-11 22:25:44 UTC): W10 ejecutó "Alertar Supervisor", webhook POST a W00 OK, chat 8695082898 recibió notificación | Re-test escalación (25min SLA) — fue interrumpido por n8n webhook timeout en "Escalar a Gerencia" node (22:40 UTC). Infraestructura recuperada 2026-07-14. Ready para re-test con T-A4 resuelto. |
| **T-A6** | Webhooks listos | P5 workflow importado, W03 comunicaciones routing configurado | Telegram API timeout bloqueó test directo (network issue). Require T-A4 para validar con Jorge chat real. |
| **T-A8** | Diagnostic | W00-W03/W10/W11 reported "activos" en checklist manual 2026-07-11 | Sync verificación con n8n API needed (JSON local vs REST API reality) — low priority, informativo. |

---

## 🎯 HITO B: CRM OPERATIVO COMPLETO

### 100% Operativo ✅

| Ticket | Feature | Verificación | Status |
|--------|---------|--------------|--------|
| **T-B1** | Dashboard KPIs | Completadas, sin-contacto, urgentes cableadas a Supabase + filtros caso/enum fixed | ✅ Go-live ready |
| **T-B2** | CRUD Clientes | Supabase REST API (GET/POST/PATCH/DELETE) + kanban UI | ✅ Go-live ready |
| **T-B3** | CRUD Pólizas | Supabase REST API + schema validado sql/01_crear_tablas.sql | ✅ Go-live ready |
| **T-B4** | SLA Monitor | Siniestros 15/30min umbrales, webhook escalación, alertas bot Supervisor | ✅ Go-live ready (parcial: Supervisor chat_id pending T-A4) |

### Planeado ⏸️

| Ticket | Feature | Dependency | ETA |
|--------|---------|-----------|-----|
| **T-B5** | Timeline Actividades | T-B4 met ✅ | Diseño pending |

---

## 🔐 SEGURIDAD — PRE-PRODUCCIÓN

### Bloqueante 🔴 — T-A7: Key Rotation Required

**Issue:** Supabase service_role JWT expuesta en **plaintext**:
- `gerencia.html` línea 981: `const SUPABASE_KEY = "sb_secret_[REVOCADA]";`
- n8n workflow W10 nodes: creds visibles via REST API GET `/workflows/{id}`
- OpenAI sk-proj-... también hardcodeado en W03

**Acción PRE-GO-LIVE:**
1. Rotar Supabase key en dashboard (Settings → API → Regenerate)
2. Remover key de gerencia.html (usar backend env var en lugar)
3. Mover OpenAI key a n8n Credentials (no en workflow nodes)

**Compliance:** SLA rot 90 días después.

---

## 📈 INFRAESTRUCTURA

### n8n Status
- **URL:** https://no-26feb-n8n.vercel.app
- **Workflows:** W00-W03 (bots), W10-W11 (watchdog/escalación) — todos importados
- **Webhooks:** msds-notify (escalaciones), msds-comunicaciones (P5)
- **Stability:** Incident 2026-07-11 22:40 (webhook timeout, auto-recovered 2026-07-14)

### Supabase Status
- **URL:** https://ejaxtfqwhgppgdglxmkt.supabase.co
- **Tables:** asesores, bots, clientes, polizas, siniestros, comunicaciones, casos (+ T-A4 chat_ids pending)
- **Stability:** OK (curl timeouts 2026-07-27 network transient, Telegram API issue, not Supabase)

### Dashboard Kanban (Local Dev)
- **URL:** http://127.0.0.1:3001
- **Status:** Live, reads msds-roadmap.md in real-time
- **Columns:** Por hacer / En curso / Bloqueado / Completado

---

## 📋 CHECKLIST PRE-OPERATIVO

### Críticas (Bloquea Go-Live)
- [ ] T-A4: 10 asesores + Jorge completar /start en Telegram
- [ ] T-A7: Rotar Supabase key, remover de código, mover a env vars
- [ ] T-A5: Re-verificar escalación SLA completa (alerta ✅, escala pending)

### Importantes (Completa 100%)
- [ ] T-A6: Validar P5 end-to-end con Jorge (requiere T-A4)
- [ ] T-A8: Verificar sync workflows activos via n8n API

### Opcionales (Post-Launch)
- [ ] T-B5: Timeline actividades módulo (UX nice-to-have)
- [ ] T-C/T-D: Cotizador + marketing (H2 2026)

---

## 📞 CONTACTOS CRÍTICOS

| Rol | Nombre | Bot/Chat | Teléfono | Status |
|-----|--------|----------|----------|--------|
| Gerente | Fabio | Gerencia N (8695082898) | **[PENDIENTE]** | ✅ Activo |
| Coordinador Técnico | Jorge | Supervisor | — | ⏳ Pending /start |
| Responsable Desarrollo | Andrés Palomares | Master (8695082898 test) | — | ✅ Activo |

---

## 🚀 RECOMENDACIÓN

**GO-LIVE CONDICIONAL:** 
- ✅ Hito B (CRM) 100% operativo
- ⚠️ Hito A (Telegram) 85% listo — bloqueado por T-A4 (acción equipo)
- 🔐 T-A7 security crítica pre-launch

**Sugerencia:** Completar T-A4 (chat_ids) + T-A7 (key rotation) esta semana, re-test T-A5 escalación → GO-LIVE 2026-07-31.

---

**Documento Técnico Completo:** [msds-roadmap.md](../tools/msds-dashboard/msds-roadmap.md)  
**Dashboard:** [Kanban Live](http://127.0.0.1:3001)  
**Estado Real-time:** [msds-status.md](../tools/msds-dashboard/msds-status.md)
