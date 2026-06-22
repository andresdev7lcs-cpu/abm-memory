# CHECKPOINT — Estado actual del proyecto Multiseguros del Sur
Fecha: 2026-06-22 | Fuente única de verdad de estado. ESTADO_REAL.md eliminado.

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
2. Exportar P2 y P3 desde n8n UI → guardar en /workflows/ con nombre y fecha
3. Eliminar footer n8n en Easypanel
4. Continuar sprint A1 (próxima sesión)

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
