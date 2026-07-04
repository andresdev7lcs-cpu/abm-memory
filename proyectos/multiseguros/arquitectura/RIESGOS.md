# RIESGOS — MSDS Milestone A
**Fecha:** 2026-07-03 · Qué puede fallar, qué es frágil, qué validar antes de producción.

---

## Críticos (pueden comprometer datos o dejar clientes sin respuesta)

### R1 — service_role key con acceso total, en demasiados lugares
La key da lectura/escritura ilimitada a 523 clientes reales. Vive en gerencia.html (texto plano), en `.env` local y en n8n. RLS está deshabilitado en todas las tablas.
**Mitigación:** confirmar rotación real (DECISIONES #7) · gerencia.html solo en localhost · plan a mediano plazo: backend mínimo que proxee las llamadas y key `anon` + RLS por rol.
**Validar antes de producción:** que la key vieja de junio esté revocada.

### R2 — Clasificación errónea de GPT-4o-mini en W01
Un siniestro urgente clasificado como "consulta" recibe SLA de 4 h en vez de 15 min. Es el riesgo operativo más alto del sistema.
**Mitigación (ya en diseño):** campo `confianza` — bajo 0.6 el caso se marca para revisión manual y notifica al supervisor · listas cerradas validadas en el workflow (valor fuera de lista → fallback conservador: consulta/generales/normal) · palabra clave dura: si el texto contiene choque/accidente/robo/herido y GPT no dijo siniestro, forzar revisión.
**Validar:** batería de 30–50 mensajes reales de clientes MSDS clasificados a mano vs GPT antes de activar routing automático.

### R3 — Pérdida de correos en W08
Si se marca como leído antes de confirmar la creación del caso, un fallo de W01 pierde el correo silenciosamente.
**Mitigación (ya en diseño):** marcar leído SOLO tras `ok:true` de W01 · dedupe por `ref_externa` evita duplicados en reintentos.
**Validar:** simular caída de W01 con correo entrante → el correo debe seguir unread y procesarse en el siguiente ciclo.

## Altos (degradan el servicio)

### R4 — VPS Easypanel único punto de falla
n8n caído = MasterBot, bots personales, SLA watchdog y Gmail muertos a la vez. Nadie se entera de que nadie se entera.
**Mitigación:** healthcheck externo (cron-job.org u UptimeRobot gratuito → ping a webhook n8n cada 5 min → alerta a Telegram del gerente por canal independiente) · backups de workflows exportados al repo tras cada cambio.

### R5 — Sprawl de 7 tokens Telegram
7 bots = 7 tokens en Bitwarden + 7 credenciales n8n. Un token filtrado permite suplantar a un coordinador.
**Mitigación:** nomenclatura estricta (tabla sección 5 del plan) · tokens jamás en JSONs del repo (regla vigente) · revocar en BotFather ante cualquier sospecha (regenerar es gratis e inmediato).

### R6 — Cron cada 5 min sobre n8n 2.8.3 con Task Runner externo
W10 + healthchecks + Gmail 15 min suman ejecuciones constantes; n8n en VPS modesto puede encolar y demorar alertas SLA.
**Mitigación:** W10 procesa en lote (una corrida = todas las alertas pendientes) · límite 50 casos por corrida · monitorear duración de ejecuciones la primera semana; si excede 60 s, subir el intervalo a 10 min (el SLA más corto es 15 min — sigue cumpliendo).

## Medios (fricción y deuda)

### R7 — Datos demo mezclados con producción
`asesores` tiene 3 demo, `comunicaciones` 4 demo, `polizas`/`siniestros` cargas de prueba. El routing de W01 y los KPIs se contaminan.
**Mitigación:** limpieza antes de la Semana 2 (equipo real en `asesores` — DECISIONES #3) · script de purga documentado, no borrado manual.

### R8 — MarkdownV2 de Telegram
Escaping agresivo rompe mensajes con caracteres comunes (`.`, `-`, `(`).
**Mitigación (regla de diseño):** todo texto plano, sin parse_mode. Ya adoptado en todos los prompts y plantillas.

### R9 — OAuth Gmail: expiración y cuota
Refresh token de Google caduca si la app queda en modo "testing" (7 días) o si se revoca el acceso; polling cada 15 min consume cuota mínima (no es riesgo real de límite).
**Mitigación:** app OAuth en modo producción o cuenta Workspace · alerta si W08 falla 3 ciclos seguidos (aviso al gerente: "Gmail desconectado").

### R10 — Round-robin de asignación sin asesor disponible
Área sin asesor activo (vacaciones, ramo nuevo) → caso creado sin `asesor_id`, nadie notificado.
**Mitigación (ya en diseño):** si el GET de asesores del área devuelve 0 → asignar al supervisor + prioridad alta + nota "sin asesor de área disponible".

### R11 — Deriva entre system prompts del repo y los cargados en n8n
Editar el .md del repo no actualiza el workflow — los prompts viven copiados dentro de los nodos.
**Mitigación:** regla operativa: cambio de prompt = editar .md primero, copiar a n8n después, registrar en BITACORA.md · los .md del repo son la fuente canónica.

---

## Qué validar sí o sí antes de decir "producción"
1. Key vieja de Supabase revocada (R1).
2. Batería de clasificación ≥ 90 % acierto en tipo+área (R2).
3. Correo sobrevive a caída simulada de W01 (R3).
4. Alerta SLA llega en ≤ 10 min desde el vencimiento con 20 casos abiertos simultáneos (R6).
5. Chat IDs reales validados — nadie más puede hablar con los bots personales (DECISIONES #6).
6. Datos demo purgados (R7).
