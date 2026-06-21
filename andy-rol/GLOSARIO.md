# GLOSARIO — Diccionario técnico en mi idioma

> Tu antídoto contra "el flujo corrió pero no entendí nada".
> Cada vez que no entiendas un término, se anota aquí explicado a tu nivel.
> Andy lee este archivo para traducirte las cosas.

---

**Commit (Git):** Un "guardado con foto" de tu proyecto en un momento dado.
Cada commit es un punto al que puedes volver si algo se daña después.

**Rewind / revert:** Volver a un commit anterior. Es el "deshacer" del proyecto
completo, no solo de un archivo. Tu salvavidas cuando una IA daña todo.

**Repo (repositorio):** La carpeta de tu proyecto guardada en GitHub (la nube).
Privado = solo tú lo ves. Es donde vive tu ANDYBOT.

**API:** Una puerta para que dos programas se hablen. La "API de Airtable" es
la puerta por la que tu código entra a tu base de datos de Airtable.

**Secret key / token / API key:** La llave de esa puerta. Si alguien la tiene,
entra como si fueras tú. Por eso van en Bitwarden, NUNCA en un archivo del repo.

**Webhook:** Un timbre. Cuando pasa algo (llega un mensaje a Telegram), el webhook
"toca el timbre" en n8n para que arranque un flujo.

**n8n:** Tu fábrica de automatizaciones. Arrastras bloques (nodos) que hacen tareas
y los conectas con líneas. Cada cadena de bloques es un "workflow" o flujo.

**Workflow / flujo:** Una receta automática en n8n. Ej: "cuando llegue un siniestro
por Telegram, guárdalo en la base de datos y avisa al gerente."

**Whisper:** El programa de OpenAI que convierte voz en texto. Lo usa AndyBot para
entender tus notas de voz.

**Supabase:** Una base de datos en la nube (tipo Excel gigante con superpoderes) que
además trae login de usuarios y permisos. Reemplazaría a Airtable en producción.

**RLS (Row Level Security):** Reglas que deciden qué filas puede ver cada usuario.
Ej: un asesor solo ve SUS clientes, no los de otros. Airtable no lo tiene bien; Supabase sí.

**Frontend:** Lo que el usuario ve (la pantalla, los botones). Tus archivos .html.

**Backend:** El motor que el usuario NO ve (donde viven las claves y la lógica pesada).
Importante: las claves van en el backend, nunca en el frontend.

**Dry-run:** Ensayo en seco. El código dice qué VA a hacer sin hacerlo de verdad.
Se usa antes de borrar o migrar datos, para no romper nada.

---

> Para agregar un término: solo escríbelo aquí o pídele a Andy/Fable que lo agregue.
