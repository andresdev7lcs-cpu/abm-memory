# Memory Index

- [fix-001-panel-ops-el-bug](code-notes.md#2026-07-18-coder-sonnet--fix-001-panel-ops-dashboard-el-null-attribute-bug) — Panel-Ops dashboard: `el()` helper seteaba atributos booleanos falsy (null/undefined/false), causando que el botón Ejecutar quedara siempre disabled. Fix de una línea en `index.html`.
- [fix-002-panel-ops-claude-runner-permisos](code-notes.md#2026-07-17-coder-sonnet--fix-002-panel-ops-claude-runner-bloqueado-por-sandbox-de-permisos-interactivo) — Panel-Ops dashboard: spawn del runner `claude` en `server.mjs` sin flag de permisos no-interactivo, Write/Edit rechazados en background. Fix: `--permission-mode acceptEdits` agregado al array de args; verificado contra INF-001 re-ejecutado (Write real exitoso en disco).
