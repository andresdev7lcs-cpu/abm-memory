# BITÁCORA — Multiseguros del Sur

> Registro de qué pasó cada día. Para que al volver tras una pausa sepas dónde quedaste.
> Nuevo arriba, viejo abajo. Una línea por día basta.

---

## 2026-06-17
P4 reconectado a Supabase. Corre sin errores. Bloque 2 en progreso. Pendiente: P3 y P2.

## 2026-06-15
Bloque 1 completo. 7 tablas Supabase creadas. 523 clientes migrados. ABM operativo en VSCode. Flujo CC/Codex/GPT/Claude establecido.

## 2026-06-15
Decidido: migrar todo el CRM a Supabase (no solo tracker). Roles oficiales definidos
(Claude=estrategia, CC=constructor con acceso, Codex=obrero de volumen, Andrés=director).
URL n8n confirmada (.host). Celer documentado como referencia. README de contexto integrado.
Pendiente: decidir esquema solo-Autos vs multi-ramo, luego diseñar tablas Supabase.

## 2026-06-12
Reframe completo del proyecto: de piloto a producción real, arquitectura de 3 módulos.
Creado el sistema ANDYBOT (memoria persistente). Definidas decisiones clave (ver DECISIONES.md).
Pendiente: subir a GitHub, montar Bitwarden, decidir Supabase, importar P2.

## 2026-06-11
Sprint Final MVP. P3 y P4 activos. P2 con JSON listo pero sin importar.
Supabase Sprint Tracker configurado.

## 2026-07-07 — Sesión ejecutor Milestone A (Fable)

- Tokens 12 bots validados con getMe: 11 OK, handles coinciden con tabla `bots`. **@MSDS_Caja_bot token truncado — AP debe re-copiar/regenerar.**
- 6 workflows construidos y validados (JSON en /workflows/): W00 Notificador (nuevo, D11), W01 MasterBot, W02 Gerencia, W03 Supervisor, W10 SLA Watchdog, W11 Cartera.
- Tests DB-level pasados: P4/P5 tablas 200 OK; embeds asesores/clientes OK (FK desambiguada en polizas); ciclo SLA completo con caso sintético (alerta→escala→exclusión→delete).
- Desviaciones registradas D11-D13 en DECISIONES_PENDIENTES.md (W00 por credencial dinámica imposible; columna `clase` no `tipo`; no duplicar area/bot_handle en asesores).
- BLOQUEANTES para activar: (1) AP carga 12 credenciales en n8n UI (sin API key no se puede automatizar), (2) reemplazar placeholders SUPABASE_KEY_AQUI/OPENAI_KEY_AQUI/SUPERVISOR_CHAT_ID_AQUI, (3) Fabio debe dar /start a @MSDS_Gerencia_N_bot (getChat: chat not found), (4) token Caja.
- Tests en vivo (A4: /pendientes de Fabio, SLA 15/30 min real, póliza→Cartera) requieren workflows importados y activos — no ejecutables desde local.
