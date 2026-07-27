## Estado Proyecto MSDS-CRM
**Última actualización:** 2026-07-27 21:15 UTC
**Responsable:** Andrés Palomares (AP)

## 🔴 BLOCKERS CRÍTICOS PARA OPERATIVO

| Ticket | Bloqueador | Impacto | ETA |
|--------|-----------|--------|-----|
| T-A4 | 10/11 asesores sin /start en Telegram (chat_id faltante) | T-A5/T-A6 no validadas end-to-end con equipo real | Depende asesores |
| T-A7 | Service_role key expuesta en gerencia.html + n8n workflows | Risk compliance/datos sensibles visible en APIs | PRE-PRODUCCIÓN |

---

### Hito A: Sistema Comunicaciones Telegram
| Ticket | Estado | Desde | Ev. | Bloqueador |
|--------|--------|-------|-----|-----------|
| T-A1 | ✅ Completado | 2026-07-04 | W00 coordinador activo, endpoints OK | — |
| T-A2 | ✅ Completado | 2026-07-04 | W01-W03 importados, bots registrados por asesor | — |
| T-A3 | ✅ Completado | 2026-07-12 | 12 credentials Telegram verificadas via n8n API, token Caja_bot válido (getMe ok) | — |
| T-A3b | ✅ Descartado | 2026-07-12 | Tabla `casos` EXISTS en Supabase, schema OK, false blocker resolv. | — |
| T-A3c | ✅ Descartado | 2026-07-12 | Caja_bot credential real wired, false blocker resolv. | — |
| T-A4 | 🔴 Bloqueante | — | Fabio OK (8695082898). Santiago, Gabriel, V/G/N/A/L/O/Y, Jorge: pending /start | 10 asesores |
| T-A5 | ⚠️ Parcial | 2026-07-11 | Alerta SLA (15min) ✅ end-to-end verificada (exec W10#127321, webhook OK). Escalación: interrumpida por timeout n8n 22:40, recovery confirmed 2026-07-14, re-test pending | T-A4 |
| T-A6 | ⏸️ Bloqueado | 2026-07-27 | P5 webhooks ready, Telegram API timeout, require T-A4 + Jorge chat_id | T-A4 |
| T-A7 | 🔐 Pendiente | — | Key rotation + env vars (security pre-go-live) | PRE-PRODUCCIÓN |
| T-A8 | ⏳ Diagnostic | 2026-07-27 | W00-W03/W10/W11 state sync pending (JSON "active":false vs checklist "activos") | Info only |

---

### Hito B: CRM Operativo Completo
| Ticket | Estado | Desde | Ev. | Bloqueador |
|--------|--------|-------|-----|-----------|
| T-B1 | ✅ Completado | 2026-07-10 | KPIs (completadas/sin-contacto/urgentes) wired Supabase, filtros caso/enum fixed | — |
| T-B2 | ✅ Completado | 2026-07-11 | CRUD clientes Supabase (server.mjs + kanban UI) | — |
| T-B3 | ✅ Completado | 2026-07-11 | CRUD pólizas Supabase, schema validado sql/01_crear_tablas.sql | — |
| T-B4 | ✅ Completado | 2026-07-11 | SLA monitor siniestros (15/30min umbrales, calculado server-side), alertas webhook OK | — |
| T-B5 | ⏸️ Planeado | — | Timeline actividades (pending T-B4 dependency met) | Diseño |

---

### Hito C: Cotizador + Financiero
| Ticket | Estado | Desde | Ev. | Bloqueador |
|--------|--------|-------|-----|-----------|
| T-C1 | ⏳ Futuro | — | Motor cotizador autos (dep T-B5) | Diseño |
| T-C2 | ⏳ Futuro | — | Integración Wompi pagos (dep T-C1) | Integración |
| T-C3 | ⏳ Futuro | — | Comisiones + reportes (dep T-C2) | Reportería |

---

### Hito D: Marketing y Promoción
| Ticket | Estado | Desde | Ev. | Bloqueador |
|--------|--------|-------|-----|-----------|
| T-D1 | ⏳ Futuro | — | WhatsApp leads (indep.) | Workflow |
| T-D2 | ⏳ Futuro | — | Email campaigns (indep.) | Workflow |
