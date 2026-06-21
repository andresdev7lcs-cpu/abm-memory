# AUDITORÍA ABM — Reporte completo
> Fecha: 2026-06-19 | Realizado por: CC (Claude Code)
> Solo diagnóstico. Sin correcciones todavía.

---

## A) DESVIACIÓN CRÍTICA — Confusión de bots

### El problema
`SCMSDS_bot` (Telegram ID 8889541466) es el bot del **cliente Multiseguros del Sur**.
Su rol correcto: asistente operativo de la empresa → consulta clientes, pólizas, siniestros en Supabase.

`AndyBot` es el asistente **personal de Andrés** para todos sus proyectos.
Su rol correcto: conserje de ABM → responde sobre proyectos, decisiones, tareas de Andrés.

### Lo que está mal hoy
- El workflow `AndyBot_Telegram_Supabase.json` está conectado a `telegram_bot` (que apunta a `SCMSDS_bot`).
- El system prompt hardcodeado es `ANDYBOT_SYSTEM.md` — el rol personal de Andrés.
- Resultado: el bot del **cliente** responde como si fuera el asistente **personal** de Andrés.
- No existe todavía un bot de Telegram separado para AndyBot personal.

### Estado en TAREAS.md
`A-002` marca el flujo AndyBot como `⏳ PENDIENTE` — nunca se debió haber implementado en SCMSDS_bot.

### Separación necesaria

| Bot | Para quién | System prompt | Datos que consulta |
|-----|-----------|---------------|--------------------|
| `SCMSDS_bot` (8889541466) | Gerencia Multiseguros | Asistente Operativo MSDS | Supabase: clientes, pólizas, siniestros |
| **Bot nuevo** (crear) | Andrés personal | ANDYBOT_SYSTEM.md | ABM: TAREAS.md, ESTADO.md proyectos |

---

## B) ESTADO REAL DE ABM

### Archivos que EXISTEN y están completos ✅

| Archivo | Ubicación | Estado |
|---------|-----------|--------|
| LEEME_PRIMERO.md | ABM/ | ✅ Completo, bien escrito |
| INSTRUCCIONES_CEREBROS.md | ABM/ | ✅ Completo |
| TAREAS.md | ABM/ | ✅ Activo (6 tareas, 2 DONE) |
| _QUE_CARGO_EN_CADA_CHAT.md | ABM/ | ✅ Existe |
| ANDYBOT_SYSTEM.md | andy-rol/ | ✅ Completo |
| GLOSARIO.md | andy-rol/ | ✅ Existe |
| capacidades.md | andy-rol/ | ✅ Existe |
| PLANTILLA_PROYECTO.md | biblioteca/plantillas/ | ✅ Completa |
| ESTADO_VACIO.md | biblioteca/plantillas/ | ✅ Plantilla lista |
| SEGURIDAD.md | _seguridad/ | ✅ Existe |
| GUIA_COSTOS_PYMES.md | biblioteca/como-cobrar/ | ✅ Existe |
| INDICE.md | biblioteca/aprendizajes/ | ✅ Existe (índice) |
| INDICE.md | biblioteca/flujos-reutilizables/ | ✅ Existe (índice) |

### Archivos que FALTAN o están VACÍOS ❌

| Lo que falta | Dónde debería estar | Impacto |
|-------------|--------------------|---------| 
| Aprendizajes reales documentados | biblioteca/aprendizajes/ | Solo existe INDICE.md — ningún aprendizaje guardado pese a múltiples fallas resueltas (psycopg2, Airtable 422, etc.) |
| Flujos reutilizables documentados | biblioteca/flujos-reutilizables/ | Solo INDICE.md — el flujo AndyBot resuelto no está ahí |
| stack-docs/ | biblioteca/stack-docs/ | Carpeta vacía (sin notas de Supabase, n8n, OpenAI) |
| System prompt MSDS para SCMSDS_bot | proyectos/multiseguros/ | No existe ningún archivo con el rol del bot del cliente |
| Protocolo onboarding cliente nuevo | biblioteca/plantillas/ | PLANTILLA_PROYECTO.md dice QUÉ crear pero no HOW TO ejecutar el onboarding |
| BITACORA.md con entradas reales | proyectos/multiseguros/ | Existe el archivo pero no se sabe si tiene registros (no leído) |

### Plantillas para nuevos clientes
- `PLANTILLA_PROYECTO.md` ✅ — dice qué archivos crear
- `ESTADO_VACIO.md` ✅ — plantilla del ESTADO.md
- **Falta**: plantillas vacías de DECISIONES, DUDAS, BITACORA, MISE_EN_PLACE, CREDENCIALES
- **Falta**: prompt de onboarding completo con pasos ejecutables (hoy es solo 1 párrafo)

### Protocolo de onboarding de nuevos clientes
**No existe.** PLANTILLA_PROYECTO.md tiene un prompt de 2 líneas pero no un protocolo paso a paso.

---

## C) ESTADO REAL DE MULTISEGUROS

### PLAN_EJECUCION.md vs realidad

| Paso | Plan dice | Realidad |
|------|-----------|----------|
| 1.1 — 7 tablas Supabase | ✅ | ✅ DONE (confirmado foto) |
| 1.2 — .env configurado | ✅ | ✅ DONE |
| 1.3 — Dry-run 5 registros | ✅ | ✅ DONE |
| 1.4 — 523 clientes migrados | ✅ | ✅ DONE (2026-06-16) |
| 2.1 — P4 a Supabase | ✅ | ✅ DONE |
| 2.2 — P3 a Supabase | ✅ | ✅ DONE |
| 2.3 — P2 importado | ✅ | ✅ DONE (credenciales asignadas) |
| Validación workflows ejecutados | — | ⚠️ `count_logs = 0` — NINGUNO ejecutado con datos reales todavía |
| 3.1 — gerencia.html a Supabase | 🔄 | ⚠️ Reescrito pero NO testeado en browser |
| 4.1 — AndyBot Telegram | ⏳ | ⚠️ Workflow existe pero con bot equivocado y sin voz |

### Tablas Supabase — datos reales vs vacías

| Tabla | Datos reales | Estado |
|-------|-------------|--------|
| `clientes` | 523 registros | ✅ Con datos |
| `polizas` | Desconocido | ❓ No hay migración documentada |
| `siniestros` | Desconocido | ❓ No hay migración documentada |
| `cotizaciones` | Desconocido | ❓ No hay migración documentada |
| `asesores` | Desconocido | ❓ No hay migración documentada |
| `log_workflows` | 0 registros | ⚠️ Vacía (workflows no ejecutados) |
| Tabla 7 | Desconocido | ❓ |

> Solo `clientes` tiene datos confirmados. Las otras 6 tablas probablemente vacías.

### Workflows n8n — activos vs funcionando

| Workflow | ¿Activo en n8n? | ¿Ejecutado con datos reales? |
|----------|----------------|------------------------------|
| P3 Cotizaciones | ✅ ON | ❓ No confirmado |
| P4 Siniestros Urgentes | ✅ ON | ❓ No confirmado |
| P2 Pólizas por Vencer | ✅ ON (importado) | ❓ No confirmado |
| AndyBot Telegram | ✅ Importado | ⚠️ Error 404 en primer test (ya corregido) |

> **Ningún workflow tiene ejecución real validada con datos de producción.**
> MISE_EN_PLACE.md muestra P2 como "❌ falta importar" — desincronizado con la realidad (ya importado).

### Deuda de documentación en Multiseguros

- `ESTADO.md` dice Bloque 2 como "próximo" pero está DONE → desactualizado
- `MISE_EN_PLACE.md` dice P2 falta importar → está importado → desactualizado
- `CHECKPOINT_ACTUAL.md` y `ESTADO_REAL.md` son más recientes y más precisos que `ESTADO.md`
- Hay duplicación: ESTADO.md + ESTADO_REAL.md + CHECKPOINT_ACTUAL.md → tres fuentes de verdad para el mismo dato

---

## D) LISTA DE CORRECCIONES NECESARIAS

### P1 — URGENTE (bloquea o engaña)

| # | Corrección | Por qué es P1 |
|---|-----------|---------------|
| P1-01 | Crear bot de Telegram nuevo para AndyBot personal (diferente a SCMSDS_bot) | SCMSDS_bot con system prompt de Andrés es una confusión de roles activa |
| P1-02 | Crear system prompt "Asistente Operativo MSDS" para SCMSDS_bot | El bot del cliente no tiene rol definido |
| P1-03 | Actualizar workflow AndyBot para apuntar al bot personal nuevo | Flujo actual usa bot incorrecto |
| P1-04 | **SEGURIDAD**: el JSON de AndyBot tiene la OpenAI API key en texto plano (`sk-proj-vVNJis...`) | Viola la regla cardinal del sistema. La key está en el archivo que CC ya guardó en Downloads |

### P2 — IMPORTANTE (afecta calidad del sistema)

| # | Corrección | Por qué es P2 |
|---|-----------|---------------|
| P2-01 | Ejecutar y validar P2/P3/P4 con datos reales → confirmar logs en Supabase | count_logs=0 significa que nada ha corrido en producción |
| P2-02 | Testear gerencia.html en browser y confirmar que KPIs cargan de Supabase | Bloque 3 está "en progreso" sin validación |
| P2-03 | Consolidar ESTADO.md como única fuente de verdad (eliminar duplicación con ESTADO_REAL.md y CHECKPOINT_ACTUAL.md) | Tres archivos dicen cosas distintas sobre el mismo estado |
| P2-04 | Actualizar MISE_EN_PLACE.md (P2 ya importado, estado workflows actualizado) | Información desactualizada confunde a los cerebros |
| P2-05 | Actualizar TAREAS.md: marcar A-002 con estado real, agregar tareas de Bloque 3-4 | TAREAS.md no refleja trabajo real hecho en sesiones recientes |
| P2-06 | Documentar en biblioteca/aprendizajes/ los 3+ aprendizajes clave de esta sesión (psycopg2, Airtable 422, bot equivocado) | Regla de INSTRUCCIONES_CEREBROS.md ignorada hasta ahora |

### P3 — PUEDE ESPERAR (mejora el sistema pero no bloquea)

| # | Corrección | Por qué es P3 |
|---|-----------|---------------|
| P3-01 | Completar plantillas vacías (DECISIONES, DUDAS, BITACORA, MISE_EN_PLACE, CREDENCIALES vacías) en biblioteca/plantillas/ | Solo hay 2 de 6 plantillas |
| P3-02 | Crear protocolo de onboarding de cliente paso a paso | Hoy es un párrafo; debe ser un checklist ejecutable |
| P3-03 | Poblar biblioteca/stack-docs/ con notas de Supabase, n8n, OpenAI (lecciones ya aprendidas) | Carpeta vacía |
| P3-04 | Registrar flujo AndyBot en biblioteca/flujos-reutilizables/ | Flujo probado, listo para reutilizar en otros proyectos |
| P3-05 | Agregar funcionalidad de voz (Whisper) a AndyBot cuando el bot personal esté creado | Bloque 4 completo requiere voz |
| P3-06 | Resolver T-001/T-002/T-003/T-004 (GitHub profesional, Bitwarden, 2FA) | Pendientes desde inicio del proyecto |

---

## RESUMEN EJECUTIVO

```
SISTEMA ABM:        Estructura correcta. Poca ejecución de la disciplina de documentación.
MULTISEGUROS:       Bloque 1 ✅ real. Bloque 2 ✅ importado pero sin validar en producción.
                    Bloque 3 ⏳ sin testear. Bloque 4 ⚠️ bot equivocado + API key expuesta.
DESVIACIÓN CRÍTICA: SCMSDS_bot tiene rol de Andrés, no de Multiseguros.
SEGURIDAD:          API key de OpenAI en texto plano en JSON guardado en Downloads.
PRIORIDAD MÁXIMA:   P1-04 (key expuesta) + P1-01/P1-02/P1-03 (separar bots).
```
