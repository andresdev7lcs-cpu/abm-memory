# CHECKPOINT — Estado actual del proyecto Multiseguros del Sur
Fecha: 2026-06-20 | Fuente única de verdad de estado. ESTADO_REAL.md eliminado.

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

### Bloque 4: AndyBot Telegram ⚠️ DESVIACIÓN CORREGIDA
- Desviación detectada 2026-06-19: SCMSDS_bot tenía system prompt de Andrés (incorrecto)
- Correcciones aplicadas:
  - API key de OpenAI eliminada de JSONs → ahora usa `{{ $env.OPENAI_API_KEY }}`
  - SCMSDS_BOT_SYSTEM.md creado con rol correcto del bot del cliente
  - AndyBot personal: pendiente que Andrés cree bot nuevo en @BotFather
- Workflow AndyBot personal: ⏳ pendiente bot nuevo
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

1. P4 — agregar header `apikey` en nodo "Buscar Poliza" (igual al nodo "Crear Siniestro")
2. P4 — exportar v4_final desde n8n UI → guardar en /workflows/P4_Siniestro_Urgente_Supabase_v4_final.json
3. Rotar service_role key de Supabase (hallazgo auditoría pendiente)
4. Exportar P2 y P3 desde n8n UI → guardar en /workflows/ con nombre y fecha
5. Configurar `OPENAI_API_KEY` en n8n → Settings → Environment Variables (nueva key de Bitwarden)
6. Andrés crea bot nuevo en @BotFather para AndyBot personal → trae token a CC
7. Testear gerencia.html en browser → confirmar KPIs
8. Construir workflow `SCMSDS_Bot_Operativo.json` (bot del cliente con Supabase)
