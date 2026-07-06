# DECISIONES PENDIENTES — MSDS Milestone A
**Fecha:** 2026-07-03 · **Responde:** AP (Andrés)
Solo lo que bloquea el inicio de construcción. Cada ítem: opciones, recomendación del arquitecto, qué pasa si no se responde.

---

## 1. `actividades`: extender la tabla actual o crear `actividades_v2`
- **Opción A (recomendada):** `ALTER TABLE actividades` agregando `caso_id, sla_horas, escalado, puntos_otorgados, ultima_actualizacion`. Una sola fuente de verdad; gerencia.html y P4 siguen funcionando sin cambios.
- **Opción B (master doc literal):** tabla nueva `actividades_v2` con PK propia. Obliga a migrar gerencia.html, P4 y P5, y mantener dos tablas sincronizadas durante la transición.
- **Si no se responde:** CC construye con Opción A.

## 2. SLA: watchdog único (W10) o 4 crons por área (W04–W07)
- **Opción A (recomendada):** un solo W10 cada 5 min, parametrizado por `sla_config` + `casos.area`, notificando con el token del mini-agente de cada área. Menos carga en el VPS, un solo punto a depurar, agregar un ramo nuevo = una fila en `bots`, cero workflows nuevos.
- **Opción B (master doc literal):** W04 (5 min) + W05/W06/W07 (30 min) + W10 global. 5 crons con la misma lógica clonada.
- **Si no se responde:** CC construye con Opción A.

## 3. Mapeo asesores ↔ ramos ↔ supervisor (D5 del master doc)
Necesario para el routing de W01 y el alcance de W03. Entregar tabla:
`nombre asesor · ramo(s) · quién lo supervisa · chat_id de Telegram`.
Hoy `asesores` tiene 3 filas demo ("Asesor 1", "Asesor 2", "Supervisor") — hay que reemplazarlas con el equipo real antes de la Semana 2.
- **Si no se responde:** W01 asigna todo al único asesor demo activo — inútil en producción.

## 4. Gamificación: reset mensual o acumulado histórico (D6)
- **Opción A (recomendada):** ranking mensual (consulta filtra por mes — los datos siempre se conservan, solo cambia la vista) + tabla histórica acumulada visible aparte. Motivación fresca cada mes sin perder historia.
- **Opción B:** acumulado perpetuo único.
- **Si no se responde:** CC implementa Opción A (no destruye datos; cambiar de vista después es trivial).

## 5. Cuenta Gmail a monitorear (D4)
¿Cuál buzón se conecta por OAuth a n8n? ¿`info@`, `contacto@`, el personal del gerente? ¿Quién autoriza el OAuth?
- **Si no se responde:** W08 (Semana 3) se bloquea; el resto avanza.

## 6. Chat IDs reales de gerente y supervisor
W02/W03 validan identidad por `chat_id` — es la única barrera de acceso a datos del CRM por Telegram.
Acción: cada uno le escribe a `@userinfobot` y entrega su número. El chat_id `8695082898` usado en P4/P5, ¿es el del gerente real o el de AP para pruebas?
- **Si no se responde:** los bots personales no pueden salir a producción (riesgo de acceso no autorizado).

## 7. Confirmar rotación de la service_role key expuesta en gerencia.html
Bitwarden registra "MSDS Supabase service_role — ACTIVA 2026-06-30". Confirmar que:
1. La key vieja (hardcodeada en gerencia.html desde junio) fue **revocada** en Supabase, no solo se creó una nueva.
2. gerencia.html quedó apuntando a la key vigente — y decidir si se sirve solo en localhost o pasará a un host con backend (la key en HTML es legible por cualquiera que reciba el archivo).
- **Si no se responde:** riesgo de seguridad activo — la key da acceso total a la base con 523 clientes reales.

---

## Ya resueltas (no re-discutir)
- D1 nombres de bots → sección 4.4/5 del plan. · D2 SLAs → `sla_config` seeds. · D4 proveedor email → Gmail OAuth (arquitectura soporta Outlook después). · D7 número WhatsApp → Fase 3, disponible cuando se necesite. · D3 fórmula comisiones → Milestone C, no bloquea.
- **D8 (2026-07-04):** corte de comisión = Opción B, `estado_cobro = 'pagado_por_aseguradora'`. Ver ADDENDUM_01_VENDEDORES_CARTERA.md sección 8.
- **D9 (2026-07-04):** trigger W11 = Opción A, dispara en INSERT `polizas`, crea tarea automática en `actividades` (tipo `gestion_cobro`, SLA 48h). Ver ADDENDUM_01 sección 8.
- **D10 (2026-07-04):** chat IDs individuales confirmados — cada asesor físico tiene `telegram_chat_id` + `telegram_username` propios en tabla `asesores`. Ver ADDENDUM_01 sección 8.

**Nota (2026-07-04):** Handles de bots redefinidos por AP el 2026-07-04. 7 bots ya creados en BotFather con handles originales — verificar cuáles coinciden con tabla definitiva y cuáles necesitan recrearse mañana. Ver PLAN_ARQUITECTURA_MSDS.md sección 5 (tabla de 12 bots) y MSDS_CHECKLIST_MAESTRA.md fase A2.
