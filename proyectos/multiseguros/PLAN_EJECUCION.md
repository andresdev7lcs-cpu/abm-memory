# PLAN DE EJECUCIÓN — MSDS-CRM
> Andrés ejecuta los pasos en orden. Claude solo valida checkpoints.
> CC y Codex leen este archivo al iniciar. No preguntan, ejecutan.

---

## BLOQUE 1 — BASE DE DATOS LISTA ← ESTAMOS AQUÍ
Objetivo: Supabase con datos reales de Airtable.

### Paso 1.1 — Crear tablas en Supabase (Andrés)
- Abrir Supabase → MSDS-CRM → SQL Editor
- Copiar contenido de: ABM/proyectos/multiseguros/sql/01_crear_tablas.sql
- Correr → confirmar 7 tablas verdes en Table Editor
- CHECKPOINT: foto de las 7 tablas → traer a Claude

### Paso 1.2 — Cargar .env con credenciales (Andrés)
Crear/editar ~/Downloads/.env con estos valores (claves en Bitwarden):
```
AIRTABLE_TOKEN=           <- Bitwarden → Multiseguros → Airtable API
AIRTABLE_BASE=app1UXLmLSjLDL5Mu
AIRTABLE_TABLE_CLIENTES=tblYb9IY2HOg3eFLI
SUPABASE_URL=https://ekarbxdoaoqrtlmfzgyj.supabase.co
SUPABASE_KEY=             <- Bitwarden → Multiseguros → Supabase (service_role)
SUPABASE_DB_PASSWORD=     <- Bitwarden → Multiseguros → Supabase DB password
```

### Paso 1.3 — Dry-run de migración (Andrés en terminal)
```bash
cd /Users/work945/Documents/Proyectos/ABM/proyectos/multiseguros/scripts/
pip install requests python-dotenv supabase --break-system-packages
python migrar_clientes_airtable_a_supabase.py
```
- CHECKPOINT: captura de los 5 registros → traer a Claude para validar

### Paso 1.4 — Migración real (solo después de validar 1.3)
```bash
python migrar_clientes_airtable_a_supabase.py --confirmar
```
- CHECKPOINT: "501 clientes migrados" → traer a Claude

---

## BLOQUE 2 — WORKFLOWS APUNTANDO A SUPABASE
Objetivo: P2, P3, P4 leyendo de Supabase, no de Airtable.
(Desbloquea cuando Bloque 1 esté completo)

### Paso 2.1 — Prompt para Codex
"Lee ABM/INSTRUCCIONES_CEREBROS.md y ABM/TAREAS.md.
Actualiza los workflows P2, P3, P4 para que usen Supabase
en vez de Airtable. Usa las credenciales del .env.
Un workflow a la vez. Empieza por P4 (el más simple)."

### Paso 2.2 — Importar P2 en n8n (Andrés, manual)
JSON listo en: ~/Downloads/P2_polizas_por_vencer_v10.json
URL n8n: https://no-26feb-n8n.ydlmwq.easypanel.host/
Igual que siempre: Import → asignar credenciales → activar → test.

---

## BLOQUE 3 — UI CONECTADA A DATOS REALES
Objetivo: gerencia.html mostrando datos de Supabase.
(Desbloquea cuando Bloque 2 esté completo)

### Paso 3.1 — Prompt para CC
"Lee ABM/INSTRUCCIONES_CEREBROS.md.
Conecta gerencia.html a Supabase (no a Airtable).
Las credenciales van en un backend mínimo en el VPS,
nunca en el HTML. Un KPI a la vez. Empieza por:
total clientes activos y valor de cartera en pesos."

---

## BLOQUE 4 — ANDYBOT TELEGRAM OPERATIVO
Objetivo: Andy respondiendo consultas por voz desde el móvil.
(Desbloquea cuando Bloque 3 esté completo)

### Paso 4.1 — Prompt para Codex
"Lee ABM/INSTRUCCIONES_CEREBROS.md y ABM/andy-rol/ANDYBOT_SYSTEM.md.
Crea el workflow n8n: Telegram → Whisper → GPT-4o-mini → respuesta.
Andy lee los .md de ABM desde GitHub vía raw URL.
Empieza por la transcripción de voz. Un nodo a la vez."

---

## REGLAS DE COORDINACIÓN

1. Andrés no abre Claude para preguntas que no sean checkpoints.
2. Claude solo valida checkpoints — no da instrucciones de ejecución.
3. CC y Codex ejecutan leyendo este archivo + INSTRUCCIONES_CEREBROS.md.
4. Cada bloque tiene UN checkpoint que cierra antes de abrir el siguiente.
5. Si algo falla: captura del error → checkpoint con Claude → Claude explica y da fix.
