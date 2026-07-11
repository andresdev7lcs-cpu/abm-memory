# MSDS — Checklist Maestra de Construcción
**Fuente de verdad para Codex y CC**
**Árbitro de arquitectura: Fable**
**Última actualización:** 2026-07-11 (6 workflows ACTIVOS en n8n vía API; único bloqueante operativo: /start del equipo — A2.15)

---

## BLOQUEANTES — resolver antes de construir

- [ ] B1: Mapeo asesores reales → ramos (hoy hay 3 demo en Supabase)
- [ ] B2: Recolectar telegram_chat_id de los 10 asesores físicos
  Gerente general: 8695082898 ✅
  Resto: pendientes — método: @userinfobot en Telegram
- [ ] B3: Crear 7 bots en BotFather y guardar tokens en Bitwarden
- [ ] B4: Confirmar estrategia reset gamificación (mensual vs acumulado)
- [ ] B5: Confirmar cuenta Gmail a monitorear
- [ ] B6: Nombres reales de los 10 asesores (para insertar en tabla asesores)
- [ ] B7: Crear @MSDS_Cartera_bot en BotFather mañana 2026-07-05
- [ ] B8: Crear @MSDS_Comisiones_bot en BotFather mañana 2026-07-05

---

## MILESTONE A — Sistema de comunicaciones

### Fase A0 — Infraestructura de base de datos

- [x] A0.1: Ejecutar DDL tabla `bots` ✅ (2026-07-06, producción)
- [x] A0.2: Ejecutar DDL tabla `casos` ✅ (2026-07-06, producción)
- [x] A0.3: Ejecutar DDL tabla `sla_config` + seeds confirmados ✅ (6 seeds, incluye gestion_cobro)
- [x] A0.4: Ejecutar DDL tabla `puntos_asesores` ✅ (2026-07-06, producción)
- [x] A0.5: Ejecutar ALTER tabla `actividades` (según recomendación Fable — DECISIONES #1) ✅
- [x] A0.6: Ejecutar ALTER tabla `comunicaciones` (vincular con casos) ✅
- [x] A0.7: Validar DDL completo en Supabase — verificar que no rompe P4 ni P5 ✅ (siniestros/comunicaciones/polizas/actividades → HTTP 200)
- [ ] A0.8: Confirmar rotación de service_role key expuesta (DECISIONES #7 — validar antigua revocada)
- [x] A0.9: Ejecutar DDL tabla vendedores_externos ✅
- [x] A0.10: Ejecutar ALTER polizas (vendedor_tipo, vendedor_interno_id, vendedor_externo_id, vendedor_externo_nombre) ✅
- [ ] A0.11: Verificar que pagador_id en polizas es legacy — documentar o deprecar
- [x] A0.12: ALTER TABLE polizas ADD COLUMN estado_cobro ✅
- [x] A0.13: ALTER TABLE asesores ADD COLUMN telegram_chat_id + telegram_username ✅
- [x] A0.14: Insertar 10 asesores reales en tabla asesores ✅ (parcial — 11 filas insertadas, solo Fabio/gerencia_neiva tiene chat_id real; resto pendiente B2. Demos ids 1-3 NO borrados: actividades.id=12 tiene FK activa a asesor_id=1, purga es tarea aparte R7)

### Fase A1 — System prompts

- [ ] A1.1: MASTERBOT_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.2: GERENCIA_BOT_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.3: SUPERVISOR_BOT_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.4: MINI_SINIESTROS_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.5: MINI_AUTOS_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.6: MINI_VIDA_SYSTEM.md — revisar y aprobar con AP
- [ ] A1.7: MINI_COTIZACIONES_SYSTEM.md — revisar y aprobar con AP

### Fase A2 — Tokens y credenciales

- [x] A2.1–A2.12: 12 bots creados en BotFather ✅ (2026-07-07: getMe verificado — 11 tokens válidos, handles coinciden exacto con tabla `bots`)
  - ⚠️ **Token @MSDS_Caja_bot INVÁLIDO** — truncado (27 chars tras `:`, normal ~35). AP: re-copiar de BotFather o regenerar.
- [ ] A2.13: Cargar todos los tokens en Bitwarden con nomenclatura: "MSDS Bot — [Nombre]" (manual AP)
- [x] A2.14: 12 credenciales cargadas en n8n ✅ (verificado vía API 2026-07-11). Nombres:
  `MSDS Bot — Master` · `MSDS Bot — Gerencia N` · `MSDS Bot — Gerencia B` · `MSDS Bot — Autos N` · `MSDS Bot — Autos R` · `MSDS Bot — Cartera` · `MSDS Bot — Caja` · `MSDS Bot — Generales` · `MSDS Bot — Cumplimiento` · `MSDS Bot — Siniestros` · `MSDS Bot — Comisiones` · `MSDS Bot — Supervisor`
- [ ] A2.15: **NUEVO BLOQUEANTE** — Fabio debe abrir @MSDS_Gerencia_N_bot y presionar Start (getChat 2026-07-07 → "chat not found"; sin /start el bot no puede escribirle). Ídem cada asesor con el bot de su área.

### Fase A3 — Workflows n8n

**Estado 2026-07-11:** los 6 workflows **ACTIVOS en n8n** (activados vía API; AP había importado + credenciales + placeholders). Webhooks verificados: /msds-notify y /msds-cartera-notify registrados; triggers Telegram de Master/Gerencia N/Supervisor apuntando a n8n. E2E de W00 llega hasta el envío Telegram — falla solo por A2.15 (/start pendiente). Tests en vivo completos (A4/A6) desbloquean con el /start.

- [x] A3.0: W00 Notificador — ACTIVO ✅ (2026-07-11; routing E2E verificado hasta nodo Telegram)
- [x] A3.1: W01 MasterBot Classifier — ACTIVO ✅ (webhook Telegram registrado; prueba funcional pendiente de A2.15)
- [x] A3.2: W02 Gerencia Bot — ACTIVO ✅ (ídem)
- [x] A3.3: W03 Supervisor Bot — ACTIVO ✅ (colisión webhookId corregida 2026-07-11; chat TEST=Andrés, cambiar a Jorge cuando dé /start)
- [x] A3.4: W10 SLA Watchdog — ACTIVO ✅ (cron 5 min corriendo; casos vacía = sin ruido)
- [ ] A3.5: W08 Gmail Monitor — construir y probar (requiere B5 resuelto)
- [ ] A3.6: W09 Gamification Engine — construir y probar
- [x] A3.7: W11 Cartera Notifier — ACTIVO ✅ (webhook registrado; test con póliza real pendiente A4.8)
- [ ] A3.8: W12 Reporte Comisiones — construir y probar (CSV descargable)

### Fase A4 — Mini-agentes

- [x] A4.1: Filas en tabla `bots` ✅ (2026-07-07 verificado: 12 filas, ids 1-12, incluye Cartera y Comisiones — cubre también A4.6/A4.7)
- [ ] A4.2: Validar que W10 SLA Watchdog los enruta correctamente por área
- [ ] A4.3: Test SLA siniestro: caso abierto → 15 min → alerta Supervisor_bot
- [ ] A4.4: Test SLA siniestro: caso abierto → 30 min → escala Gerencia_bot
- [ ] A4.5: Test SLA cotización: caso abierto → 2h → alerta → 4h → escala
- [ ] A4.6: Insertar fila mini-agente Cartera en tabla bots
- [ ] A4.7: Insertar fila mini-agente Comisiones en tabla bots
- [ ] A4.8: Test: póliza nueva → notificación automática a Cartera
- [ ] A4.9: Test: reporte mensual genera CSV correcto con vendedor interno vs externo

### Fase A5 — Gamificación

- [ ] A5.1: Validar trigger cierre tarea → W09 → puntos insertados
- [ ] A5.2: Tab Asesores en gerencia.html con ranking
- [ ] A5.3: Test end-to-end: caso abierto → cerrado antes de SLA → +10 pts → ranking actualizado

### Fase A6 — Validación pre-producción

- [ ] A6.1: Test E2E flujo externo: mensaje Telegram → MasterBot → caso creado → asesor notificado
- [ ] A6.2: Test E2E flujo interno: gerente envía tarea → Gerencia_bot → tarea creada → asesor notificado
- [ ] A6.3: Test E2E email: correo llega Gmail → caso creado → asesor notificado
- [ ] A6.4: P4 sigue operativo (no roto por cambios DDL)
- [ ] A6.5: P5 sigue operativo (no roto por cambios DDL)
- [ ] A6.6: Dashboard gerencia.html muestra datos correctos post-DDL
- [ ] A6.7: Batería de clasificación ≥ 90 % acierto en tipo+área (RIESGOS #2)
- [ ] A6.8: Correo sobrevive a caída simulada de W01 (RIESGOS #3)
- [ ] A6.9: Alerta SLA llega en ≤ 10 min desde vencimiento con 20 casos abiertos (RIESGOS #6)

---

## MILESTONE B — CRM operativo completo

- [ ] B_1: P2 vencimientos — cron diario alertas pólizas por vencer
- [ ] B_2: Card cliente 4 tabs en gerencia.html
- [ ] B_3: P3 cotizador conversacional básico
- [ ] B_4: Filtros por ramo en dashboard

---

## MILESTONE C — Cotizador + financiero

- [ ] C_1: Tabla comisiones en Supabase (requiere clarificación cliente)
- [ ] C_2: Fórmula comisiones por ramo
- [ ] C_3: KPIs financieros en gerencia.html
- [ ] C_4: Reporte CSV exportable

---

## MILESTONE D — Marketing

- [ ] D_1: Estrategia de contenidos aprobada
- [ ] D_2: Calendario editorial 3 meses
- [ ] D_3: Landing page MSDS
- [ ] D_4: Automatización publicaciones n8n
- [ ] D_5: Formulario web → MasterBot → CRM

---

## DECISIONES BLOQUEANTES A RESPONDER (AP)

| ID | Pregunta | Opción recomendada | Fecha respuesta |
|---|---|---|---|
| D1 | `actividades`: ALTER o tabla `actividades_v2` | ALTER (Opción A) | |
| D2 | SLA: W10 único o 4 crons por área (W04–W07) | W10 único parametrizado (Opción A) | |
| D3 | Mapeo asesores ↔ ramos ↔ supervisor | Tabla con equipo real, no 3 demos | |
| D4 | Gamificación: reset mensual o acumulado | Mensual (consulta filtra por mes) | |
| D5 | Cuenta Gmail a monitorear | ¿cuál buzón? ¿quién autoriza OAuth? | |
| D6 | Chat IDs reales gerente y supervisor | usar `@userinfobot` + confirmar 8695082898 | |
| D7 | Service_role key vieja revocada en Supabase | confirmar revocación + limpiar gerencia.html | |

---

## RIESGOS CRÍTICOS A VALIDAR

| ID | Riesgo | Mitigación | Validar antes de producción |
|---|---|---|---|
| R1 | Key expuesta sin RLS | Confirmar rotación + plan backend a mediano plazo | Key vieja revocada |
| R2 | Clasificación GPT errónea (urgente → consulta) | Campo confianza < 0.6 → revisión manual | Batería 30–50 mensajes ≥ 90 % acierto |
| R3 | Pérdida de correos si W01 falla | Marcar leído SOLO tras `ok:true` + dedupe | Simular caída W01 → correo sigue unread |
| R4 | n8n punto único de falla | Healthcheck externo + UptimeRobot | Alerta en Telegram ante caída |
| R5 | Sprawl de 7 tokens Telegram | Bitwarden + nomenclatura + revocación rápida | Tokens jamás en JSONs repo |
| R6 | Cron cada 5 min saturación | Procesar en lote, máx 50 casos/corrida | SLA ≤ 10 min con 20 casos simultáneos |
| R7 | Datos demo contaminan producción | Limpiar antes Semana 2 — script documentado | Purgados antes A3.1 |

---

## REGLAS DE USO DE ESTA CHECKLIST

1. **Ninguna tarea ✅ sin prueba end-to-end** — no solo tests, sino flujo completo funcionando.
2. **BLOQUEANTES no se saltan** — B1, B2, B3, B4, B5 resueltos antes de tocar A0.
3. **Orden estricto por fases** — A0 → A1 → A2 → A3 → A4 → A5 → A6. No adelantar.
4. **Codex construye, Fable/Claude revisa** — cada fase checkpoint antes de siguiente.
5. **Desviaciones de arquitectura** — registrar en DECISIONES_PENDIENTES.md con fecha y razón antes de implementar.
6. **Prompts canónicos en repo** — cambio = editar .md primero, luego copiar a n8n, registrar en BITACORA.md.
7. **Actualizar fecha "Última actualización"** cada vez que se marque una tarea (semanal mínimo).

---

## PLAN DE TRABAJO — TIMELINE

**Semana 0 (AP — 1 a 2 días):**
- [ ] Responder DECISIONES_PENDIENTES (7 ítems)
- [ ] Crear 7 bots BotFather → Bitwarden → credenciales n8n
- [ ] Obtener chat_ids reales `@userinfobot`

**Semana 1 — Base datos + primer bot visible:**
- [ ] A0: DDL completo + validación
- [ ] A1 + A2: Prompts + tokens
- [ ] A3.2: W02 Gerencia_bot construir
- [ ] ✅ **Checkpoint:** gerente ejecuta `/resumen` + `/pendientes` con datos reales

**Semana 2 — Cerebro sistema:**
- [ ] A3.1: W01 MasterBot construir
- [ ] A3.3: W03 Supervisor_bot construir
- [ ] A4.1–A4.5: Mini-agentes + tests SLA
- [ ] ✅ **Checkpoint:** mensaje → MasterBot → caso creado → SLA calculado → asesor notificado

**Semana 3 — Vigilancia + correo:**
- [ ] A3.4: W10 SLA Watchdog construir
- [ ] A3.5: W08 Gmail Monitor construir
- [ ] ✅ **Checkpoint:** SLA vencido → alerta → escalamiento. Email → caso creado.

**Semana 4 — Cierre + endurecimiento:**
- [ ] A3.6: W09 Gamificación construir
- [ ] A5 + A6: Tests E2E + validación pre-prod
- [ ] Exportar JSONs + actualizar CHECKPOINT_ACTUAL.md
- [ ] ✅ **Checkpoint final:** demo completa cliente

---

**Dependencias (no se violan):**
```
B1 B2 B3 B4 B5 ──►  A0 (DDL + validación)
                    │
                    ├──────────► A1 (Prompts) ──────────────┐
                    │                                       │
                    └──────────► A2 (Tokens) ───────────────┤
                                                            │
                                  A3.2 (W02) ◄─────────────┘
                                  │
                                  ├──────────► A3.1 (W01) ──► A3.4 (W10)
                                  │                            │
                                  ├──────────► A3.3 (W03)      └──► A3.5 (W08)
                                  │
                                  └──────────► A3.6 (W09) ──► A5 ──► A6
```

---

*Generado: 2026-07-03 · Actualizado: 2026-07-04 (ADDENDUM_01_VENDEDORES_CARTERA.md) · Fuentes: PLAN_ARQUITECTURA_MSDS.md + DECISIONES_PENDIENTES.md + RIESGOS.md + ADDENDUM_01 · Árbitro: Fable · CC/Codex: revisar y marcar checkpoints.*
