# ANDYBOT — Sistema operativo de proyectos de Andrés

> Esta carpeta ES tu AndyBot. No es un programa que corre solo.
> Es la memoria que ningún chat puede perder, porque vive en archivos.
> Cualquier cerebro (Claude/Fable, CC, Codex, AndyBot) la lee y queda al día.

---

## Qué es esto en una frase

La inteligencia (los modelos de IA) se enciende y se apaga en cada sesión.
La memoria (estos archivos) **nunca se pierde**. Por eso el trabajo se acumula
en vez de empezar de cero cada vez.

---

## El equipo de trabajo

| Quién | Rol | Cuándo lo uso |
|-------|-----|---------------|
| **Andrés (yo)** | Director. Decido, ejecuto los pasos manuales, mantengo el orden. | Siempre |
| **AndyBot / Andy** | Conserje que conoce el negocio. Consulta rápida por Telegram (voz/texto). | Preguntas rápidas desde el móvil |
| **Claude / Fable** | Asesor externo potente. Planea, decide arquitectura, resuelve lo difícil, explica. | Problemas complejos, decisiones |
| **CC (Claude Code)** | Constructor. Escribe y crea archivos y código en VSCode. | Construir |
| **Codex** | Mecánico. Depura y refactoriza código existente. | Arreglar |

**Regla base:** Andy y CC y Codex NO inventan cuando algo los supera.
Dicen "esto se lo paso a Fable". Un asistente que conoce sus límites vale más
que uno que finge.

---

## Mapa de la carpeta

```
ABM/
├── LEEME_PRIMERO.md          <- este archivo
├── INSTRUCCIONES_CEREBROS.md <- las reglas que todos leen al iniciar
├── TAREAS.md                 <- control central de tareas (evita que se pisen)
│
├── biblioteca/               <- conocimiento TRANSVERSAL (sirve a todo)
│   ├── flujos-reutilizables/ <- flujos n8n y agentes ya probados
│   ├── aprendizajes/         <- qué falló, por qué, cómo se arregló
│   ├── como-cobrar/          <- tarifas, propuestas (pendiente, futuro)
│   ├── plantillas/           <- plantillas .md para nuevos proyectos
│   └── stack-docs/           <- notas sobre Supabase, n8n, Airtable, OpenAI
│
├── andy-rol/                  <- TODO lo interno del rol de Andy (separado)
│   ├── ANDYBOT_SYSTEM.md      <- el "entrenamiento" del agente OpenAI
│   ├── GLOSARIO.md            <- diccionario técnico en mi idioma
│   └── capacidades.md         <- qué puede y qué no puede hacer Andy
│
├── proyectos/                <- un cliente = una carpeta independiente
│   └── multiseguros/
│       ├── ESTADO.md          <- DÓNDE VAMOS HOY (lo primero que se pega)
│       ├── DECISIONES.md      <- qué decidimos y por qué
│       ├── DUDAS.md           <- lo que no entiendo (se revisa en checkpoints)
│       ├── BITACORA.md        <- registro de qué pasó cada día
│       ├── MISE_EN_PLACE.md   <- apps, APIs, configs (SIN claves)
│       └── CREDENCIALES.md    <- ÍNDICE de claves (apuntan a Bitwarden)
│
└── _seguridad/
    └── SEGURIDAD.md           <- cómo se protege todo esto (de verdad)
```

---

## Cómo arranco una sesión (el ritual de 30 segundos)

**Con Claude/Fable (web o móvil):**
1. Abro chat nuevo.
2. Pego `INSTRUCCIONES_CEREBROS.md` + el `ESTADO.md` del proyecto.
3. Ya está al día. Pregunto lo que necesite.

**Con CC o Codex (VSCode):**
1. Le digo: "Lee ABM/INSTRUCCIONES_CEREBROS.md y ABM/TAREAS.md antes de trabajar."
2. Le paso la tarea específica.

**Con AndyBot (Telegram):**
1. Le mando nota de voz o texto.
2. Ya tiene su contexto cargado desde GitHub (vía n8n).

---

## Cómo cierro una sesión (la regla que lo sostiene todo)

Antes de cerrar CUALQUIER sesión:
1. Actualizo `ESTADO.md` del proyecto (dónde quedé).
2. Actualizo `TAREAS.md` (marco lo que terminé).
3. Si aprendí algo, lo anoto en `biblioteca/aprendizajes/`.
4. Hago "guardar en Git" (commit). Esto crea el punto de retorno.

Si no hago esto, la próxima sesión empieza perdida. Es la única disciplina
no negociable del sistema.
