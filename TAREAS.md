# TAREAS — Control central

> Verdad única sobre quién hace qué y en qué estado.
> REGLA: ningún cerebro toca una tarea sin leer esto. Ninguno termina sin actualizarlo.
> Estados: ⏳ PENDIENTE · 🔄 EN_CURSO · ✅ DONE · ⛔ BLOQUEADA

> Cómo evita que se pisen: si Codex marca una tarea ✅ DONE, cuando CC abra este
> archivo la ve hecha y NO la repite. El estado vive aquí, no en la memoria del chat.

---

## Cómo se actualiza una tarea

Quien trabaja una tarea cambia su línea. Ejemplo:
- Antes:  `| T-001 | Importar P2 en n8n | Andrés | ⏳ PENDIENTE | — |`
- Después: `| T-001 | Importar P2 en n8n | Andrés | ✅ DONE | P2 activo, Telegram OK |`

---

## Tareas activas — MULTISEGUROS

| ID | Tarea | Responsable | Estado | Nota / resultado |
|----|-------|-------------|--------|------------------|
| T-001 | Crear cuenta GitHub profesional nueva | Andrés | ⏳ PENDIENTE | correo dedicado, no afpalomaresr |
| T-002 | Subir carpeta ANDYBOT a repo privado | Andrés | ⏳ PENDIENTE | depende de T-001 |
| T-003 | Crear cuenta Bitwarden y cargar claves | Andrés | ⏳ PENDIENTE | VPS, n8n, Airtable, OpenAI, Telegram |
| T-004 | Configurar 2FA en GitHub | Andrés | ⏳ PENDIENTE | la "doble verificación" real |
| T-005 | Decidir: migrar a Supabase o cerrar sobre Airtable | Andrés + Fable | ✅ DONE | SUPABASE (def. 2026-06-15) |
| T-006 | Migrar 531 clientes Airtable → Supabase | CC | ✅ DONE | 523 clientes insertados, validados 2026-06-16 |

> A medida que avancemos, Fable agrega las tareas siguientes aquí.
> No llenar de tareas futuras: solo lo que está activo o inmediato.

---

## Tareas activas — ANDYBOT

| ID | Tarea | Responsable | Estado | Nota / resultado |
|----|-------|-------------|--------|------------------|
| A-001 | Revisar ANDYBOT_SYSTEM.md y aprobar el rol | Andrés | ⏳ PENDIENTE | leer andy-rol/ANDYBOT_SYSTEM.md |
| A-002 | Construir flujo n8n: Telegram → Whisper → GPT → respuesta | CC | ⏳ PENDIENTE | después de Multiseguros Bloque A |

---

## Historial de tareas cerradas

| Fecha | ID | Resultado |
|-------|----|-----------|
| 2026-06-12 | — | Sistema ANDYBOT creado por Fable |
