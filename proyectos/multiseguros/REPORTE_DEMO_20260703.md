# REPORTE ESTADO MSDS-CRM — 2026-07-03

## BLOQUES COMPLETADOS ✅
- Bloque 1 — Migración clientes (2026-06-16): 7 tablas Supabase creadas, 523 clientes migrados (531→528→523 sin duplicados), validado
- Bloque 2 — P4 Siniestro Urgente (2026-06-20): operativo en producción. Flujo completo verificado (Buscar Póliza → Crear Siniestro → Notificar Telegram), POL-0001 probado, mensaje llegó a gerente (chat 8695082898), siniestro creado en Supabase
- Bloque 4 — AndyBot Telegram (2026-06-22): operativo, cerebro completo en Supabase andybot-memory (7 tablas, 71+ registros), prueba ácida pasada
- ABM en GitHub privado
- AndyBot + SCMSDS_bot separados y operativos (credenciales y system prompts independientes)

## EN PROGRESO ⏳
- P3 Cotizaciones: CHECKPOINT dice "✅ importado, activo" pero **sin respaldo local exportado** — nunca re-verificado en n8n UI desde 2026-06-20
- P2 Pólizas por Vencer (Asistente Agenda): CHECKPOINT dice "✅ importado, credenciales asignadas" pero SPRINT_FINAL_MVP (misma fecha, 2026-06-20) tiene la tarea A1 "Importar P2" **sin marcar** — contradicción entre los dos documentos, no resuelta
- Bloque 3 — gerencia.html: reescrito para Supabase (KPIs + ficha cliente) pero nunca testeado en browser, KPIs no confirmados
- Bloque 5 — Módulo Comunicaciones (2026-07-01): tabla Supabase creada, workflow P5 escrito, tab "Comunicaciones" agregada a gerencia.html — pero P5 sigue `active:false`, key placeholder sin reemplazar, credencial Telegram sin asignar

## PENDIENTE CRÍTICO 🔴
- **gerencia.html no existe en el repo** — solo referenciado en docs, nunca commiteado. Bloquea demo del módulo Comercial y validación de KPIs
- P2 y P3: estado real desconocido — contradicción entre CHECKPOINT y SPRINT_FINAL_MVP, sin export JSON que lo confirme
- Rotar `service_role` key de Supabase — hallazgo de seguridad pendiente desde 2026-06-21
- P5 Comunicaciones sin importar/activar en n8n

## PENDIENTE NO CRÍTICO ⚪
- Bloque C — Agente conversacional con OpenAI (C2)
- Bloque D — Dashboard: campo ramo + filtros (D1, D2)
- Bloque E — Actualizar discurso de ventas (E1)
- Conectar Evolution API (WhatsApp) al webhook P5
- Voz/Whisper en AndyBot — no implementado
- Eliminar footer n8n en Easypanel
- Exportar P2/P3 a `/workflows/` como respaldo (una vez confirmado su estado)

## LISTO PARA DEMO ✅/❌
❌ NO. P4 (Siniestros) sí está listo y validado, pero la demo completa del Hito A requiere gerencia.html (no existe) y confirmación real de P2/P3 en n8n — ninguno verificable hoy sin entrar a n8n UI.

## PRÓXIMA ACCIÓN RECOMENDADA
Entrar a n8n UI y confirmar de una vez el estado real de P2 y P3 (Active/Inactive, credenciales) — resuelve la contradicción entre CHECKPOINT y SPRINT_FINAL_MVP y desbloquea todo lo demás en la ruta a demo.
