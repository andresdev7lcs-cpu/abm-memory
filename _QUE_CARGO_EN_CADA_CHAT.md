# ¿QUÉ CARGO EN CADA CHAT NUEVO?

> ABM = AndyBot Memory. Esta carpeta ES la memoria.
> Cuando abras un chat nuevo con cualquier cerebro, carga lo que diga aquí.

---

## Con Claude app / Fable (planear, decidir, propuestas)

Pega estos 2 archivos al inicio del chat:
1. `INSTRUCCIONES_CEREBROS.md`   (las reglas)
2. `proyectos/<proyecto>/ESTADO.md`   (dónde vamos)

Si la tarea toca decisiones pasadas, agrega también `DECISIONES.md`.
Listo. El cerebro queda al día en 10 segundos.

---

## Con CC (construir en VSCode)

Dile: "Lee ABM/INSTRUCCIONES_CEREBROS.md y ABM/TAREAS.md antes de trabajar."
Luego pega el prompt de la tarea específica.

---

## Con Codex (depurar en VSCode)

Igual que CC: que lea INSTRUCCIONES_CEREBROS.md y TAREAS.md.
Luego pega el código o el error a resolver.

---

## Con AndyBot-Telegram (consulta rápida móvil)

No cargas nada. Él ya tiene su contexto desde GitHub (vía n8n).
Solo pregunta.

---

## Regla de oro al cerrar CUALQUIER chat

Antes de cerrar:
1. Actualiza ESTADO.md (dónde quedaste)
2. Actualiza TAREAS.md (qué terminó)
3. Guarda en Git (commit)

Si no, el próximo chat empieza perdido.
