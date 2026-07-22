# 10 — PIPELINE VISUAL HIGGSFIELD (personajes + UI Candy Crush)
**Fecha:** 2026-07-22 · **Precedencia:** este doc ejecuta lo que 09_UI_RADICAL_INTEGRATION.md ya definió como estilo. No cambia paleta/tokens — los usa como input de prompt. Reemplaza únicamente `[CHARACTER_ASSETS_PENDING]` y componentes visuales de fondo/UI que hoy son placeholder plano.

**Decisión AP 2026-07-22:** Fase 0-1 del checklist (tokens + componentes UI) construida hasta ahora era versión BETA. Este doc + su ejecución es la VERSIÓN DEFINITIVA de la capa visual — se autoriza revestir/reemplazar lo de Fase 0-1 sin preservarlo como legado. Componentes mantienen su API (regla doc 09 §3), la implementación visual interna sí puede descartarse por completo.

**Precondición bloqueante:** correr `higgsfield auth login` en máquina de desarrollo antes de ejecutar cualquier script de esta fase. Sin token válido nada de esto corre.

---

## 0. Objetivo

Generar y descargar, vía `@higgsfield/cli`, los assets visuales que hoy son placeholder (emojis gigantes, fondos planos) para:
1. Presentador **Charlie** — estilo "Steve Harvey en modo Pixar", personaje 3D animado tipo reality show ("¿Quién quiere ser millonario?").
2. Avatar jugador **masculino** y **femenino** — mismo estilo Pixar, coherentes con Charlie en iluminación/paleta.
3. Fondos y elementos de UI con acabado "Candy Crush / Royal Crush": fondos de escena con profundidad/brillo, marcos de card con gloss, botones con acabado 3D-candy (complementa, no reemplaza, los tokens CSS ya definidos en doc 09 §1-2 — Higgsfield genera las TEXTURAS/ILUSTRACIONES, el CSS sigue manejando layout/estado).

Formato de salida: **video loop corto (2-4s, seamless loop, sin audio)** para personajes — reemplaza el `hero` bounce de CharacterSlot. Fondos/UI: imagen estática alta resolución (loops de video no aplican a fondos estáticos).

## 1. Setup CLI (hace AP, una vez)

```bash
higgsfield auth login          # browser OAuth, requiere cuenta Higgsfield
higgsfield auth token          # verificar token activo
higgsfield model list --video  # confirmar modelos de video disponibles y sus IDs exactos
higgsfield model list          # modelos de imagen disponibles
```

Codex/Claude Code NO puede ejecutar `auth login` (requiere browser interactivo del usuario). Todo lo demás (`generate`, `upload`, `workflow`) sí es scriptable una vez el token existe en `~/.higgsfield/` (o equivalente — confirmar con `higgsfield auth token`).

## 2. Script de generación

Archivo: `scripts/generate_visual_assets.ts` (o `.sh` si CLI se prefiere sin Node). Requisitos:
- Lee prompts fijos de `blueprint/10_prompts/*.json` (uno por asset, ver §3).
- Llama `higgsfield generate create <model> --prompt "<prompt>" [--image <ref_upload_id>]` por asset.
- Usa `higgsfield generate wait <job_id>` (o equivalente de polling) hasta job completo.
- Descarga resultado a `public/media/characters/` (video) o `public/images/generated/` (estático).
- Idempotente: si el archivo destino ya existe, skip (no regenerar y gastar créditos sin querer).
- Log de costo por asset (`higgsfield generate cost` si el comando existe) antes de confirmar generación — nunca disparar generación sin mostrar costo estimado primero.

✅ Criterio: correr el script dos veces seguidas no duplica gasto de créditos en assets ya descargados.

## 3. Prompts fijos por asset

Mantener **consistencia de personaje** entre generaciones: usar `soul-id` de Higgsfield (`higgsfield soul-id train`) si el modelo lo soporta, entrenando un Soul ref por personaje a partir de la primera generación aceptada, para que las siguientes tomas (distintos estados: idle, celebración, reacción) mantengan la misma cara/outfit. Si `soul-id` no aplica al modelo de video elegido, fijar semilla + describir rasgos de forma idéntica en cada prompt.

**3.1 Charlie (presentador)**
```
Base: hombre latino/afroamericano carismático 50s, estilo animación 3D Pixar/Disney,
traje morado royal brillante con solapa dorada (paleta: royal #6C3FA0, gold #FFD700),
sonrisa amplia tipo showman de TV, bigote prolijo, calvo o cabeza rapada estilo Steve Harvey,
micrófono dorado en mano, plató de game show con luces de neón fire/gold de fondo desenfocado,
iluminación cálida tipo estudio de TV, render limpio fondo transparente/verde para recorte.
Variantes de estado: [idle-bounce-loop] [reacción-sorpresa] [reacción-celebración] [guiño-complicidad]
Formato: video loop 2-4s sin costuras, 1080x1080 o proporción cuadrada, sin audio, sin texto en pantalla.
```

**3.2 Avatar jugador masculino**
```
Hombre latino 28-35 años, estilo animación 3D Pixar, casual-aspiracional (camisa clara,
sin traje formal — es el "jugador", no el presentador), expresión de esperanza/nervios,
misma calidad de render y esquema de luz que Charlie, fondo transparente/verde.
Variantes: [idle] [nervioso-esperando-respuesta] [festejo-victoria] [decepción-suave-sin-tristeza-extrema]
Formato: video loop 2-4s, cuadrado, sin audio.
```

**3.3 Avatar jugador femenino**
```
Mujer latina 28-35 años, estilo animación 3D Pixar, casual-aspiracional, misma consistencia
de render/luz que Charlie y avatar masculino, expresión de esperanza/nervios.
Variantes: [idle] [nervioso-esperando-respuesta] [festejo-victoria] [decepción-suave-sin-tristeza-extrema]
Formato: video loop 2-4s, cuadrado, sin audio.
```

**3.4 Fondos de escena (estático, alta resolución)**
```
Fondo de plató de concurso de TV estilo "¿Quién Quiere Ser Millonario?" fusionado con
estética "Candy Crush Royal" — superficies brillantes tipo caramelo, profundidad con
bokeh dorado/royal, luces de neón fire (#FF6B35) y sky (#00D9FF), sin texto, sin logos,
composición que deje espacio negativo arriba/centro para overlay de UI.
Variantes: [fondo-TOF-navy] [fondo-guia-cream] [fondo-BPA-ciudad-noche]
Formato: PNG 1920x1080 mínimo, comprimir a <500KB post-proceso.
```

## 4. Integración en código

- `CharacterSlot` (`src/components/...`): swap interno de emoji → `<video autoplay loop muted playsinline>` apuntando a `public/media/characters/{charlie|hombre|mujer}-{estado}.mp4`. **La API pública del componente no cambia** (regla ya fijada en doc 09 §3) — solo la implementación interna.
- Fallback obligatorio: si el video no carga (404, offline), mostrar el emoji placeholder actual — nunca romper la pantalla.
- Peso: cada loop de video <1.5MB (comprimir con `ffmpeg` a H.264 + `-movflags faststart`); lazy-load con `loading="lazy"` / IntersectionObserver, nunca autoplay de los 3 personajes simultáneo si no están en viewport.
- Fondos estáticos: usar `next/image` con `priority` solo en el fondo de la pantalla actual, resto lazy.

✅ Criterio Fase visual: Lighthouse mobile de `/`, `/game`, `/guia/1` no empeora vs. baseline actual (LCP <2.5s ya exigido en checklist F6.4) — video de personaje NUNCA bloquea LCP del texto/CTA.

## 5. Compliance (hereda F6.1 del checklist)

Ningún prompt de generación debe incluir: nombres de marcas reales de seguros/finanzas, logos, texto renderizado en la imagen que mencione "IA"/"seguro"/cifras de ganancia. "Steve Harvey" es referencia de ESTILO SOLO para instrucción interna al operador humano/IA generadora — **el string literal "Steve Harvey" NUNCA entra al prompt real enviado a Higgsfield, ni a ningún copy, metadata, filename o commit público**. El prompt de generación (§3.1) ya describe rasgos genéricos (edad, complexión, bigote, calvicie, traje) sin el nombre — mantenerlo así. Grep compliance F6.1 debe incluir también `Steve Harvey|Harvey` como patrón prohibido en `src/`, `public/`, y nombres de archivo generados.

## 6. Fuera de scope de este doc

Entrenar Soul-ID completo, publicar el juego como Marketplace card de Higgsfield (`higgsfield game deploy/publish`), integración de audio/voces (`higgsfield voices`) — quedan para fase posterior si se decide.
