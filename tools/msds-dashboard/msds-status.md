## Estado Proyecto MSDS-CRM
**Última actualización:** 2026-07-10 00:00 UTC

### Hito A: Sistema Comunicaciones
| Ticket | Estado | Desde | Logs | Bloqueador |
|--------|--------|-------|------|-----------|
| T-A1 | Completado | 2026-07-04 | — | — |
| T-A2 | Completado | 2026-07-04 | — | — |
| T-A3 | Completado | 2026-07-11 | 12 credentials telegramApi creadas en n8n via API, verificadas con GET /credentials | — |
| T-A4 | Bloqueante humano | — | — | Asesores /start en Telegram |
| T-A5 | Bloqueado | — | — | Depende T-A4 |
| T-A6 | Bloqueado | — | — | Depende T-A4 |

### Hito B: CRM Operativo
| Ticket | Estado | Desde | Logs | Bloqueador |
|--------|--------|-------|------|-----------|
| T-B1 | En progreso | 2026-07-10 | KPIs completadas/sin-contacto/urgentes cableados a Supabase real; filtros estado corregidos (case+enum bugs) | Ejecutado con dep T-A6 sin cumplir, por decisión AP (KPIs no dependen de bots Telegram) |
| T-B2 | Completado | 2026-07-11 | CRUD clientes contra Supabase (server.mjs + index.html) | — |
| T-B3 | Completado | 2026-07-11 | CRUD pólizas contra Supabase (server.mjs + index.html), esquema en proyectos/multiseguros/sql/01_crear_tablas.sql | — |
| T-B4 | Completado | 2026-07-11 | Monitor SLA siniestros contra Supabase (server.mjs + index.html); umbrales 15/30 min de sla_config (siniestro), calculados en server sobre fecha_notif_asesor/fecha_ocurrencia | sla_config/casos de Milestone A aún no aplicadas en Supabase — umbral hardcodeado en server.mjs, migrar cuando esas tablas existan |
| T-B5 | Planeado | — | — | Depende T-B4 |

### Hito C: Cotizador + Financiero
| Ticket | Estado | Desde | Logs | Bloqueador |
|--------|--------|-------|------|-----------|
| T-C1 | Futuro | — | — | Depende T-B5 |
| T-C2 | Futuro | — | — | Depende T-C1 |
| T-C3 | Futuro | — | — | Depende T-C2 |

### Hito D: Marketing y Promoción
| Ticket | Estado | Desde | Logs | Bloqueador |
|--------|--------|-------|------|-----------|
| T-D1 | Futuro | — | — | — |
| T-D2 | Futuro | — | — | — |
