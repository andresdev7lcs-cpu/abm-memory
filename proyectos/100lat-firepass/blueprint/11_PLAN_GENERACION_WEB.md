# 11 — PLAN GENERACIÓN WEB (free tier higgsfield.ai)
**Fecha:** 2026-07-22 · CLI bloqueado en plan "plus" (`free_trial_model_requires_plan` en todos los modelos probados: seedance1_5, nano_banana). Free tier corre solo en dashboard web. Este doc = paso a paso manual AP + destino exacto de cada archivo para integración directa sin retrabajo.

---

## PASO 1 — Entra a higgsfield.ai, confirma free activo

Dashboard → verifica créditos free disponibles hoy. Si pide elegir modelo, prioriza los más baratos primero (imagen antes que video: menos costo, permite iterar el prompt del personaje antes de gastar en video).

## PASO 2 — Genera Charlie (presentador) — PRIMERO, es la referencia de estilo para todo lo demás

**Prompt (copiar tal cual, en inglés — mejor resultado en la mayoría de modelos):**
```
3D Pixar/Disney-style animated character, charismatic TV game-show host, man in his 50s,
warm brown skin, clean shaved bald head, neat trimmed mustache, big genuine showman smile,
wearing a bright royal purple suit jacket with a golden lapel trim, holding a golden
microphone, standing on a game-show stage with blurred neon fire-orange and gold lights
in the background, warm cinematic studio lighting, square 1:1 framing, clean render,
transparent or solid dark background, no text, no logos, no watermark
```

- Si el modelo es de IMAGEN: genera 2-3 variantes, elige la que mejor capture "showman calvo, bigote, traje royal+gold, sonrisa amplia" — esa referencia fija el estilo para avatares.
- Si el modelo permite VIDEO/loop corto: pide explícitamente "short 2-4 second seamless idle loop, subtle breathing/bounce motion, no camera cut".
- **Guarda el archivo elegido como:** `charlie-idle.mp4` (si video) o `charlie-idle.png` (si imagen) → carpeta `public/media/characters/` ya creada en el repo.

## PASO 3 — Avatar jugador masculino (usa Charlie como referencia de estilo/luz si el modelo soporta imagen de referencia)

```
3D Pixar-style animated character, Latino man, late 20s to mid 30s, casual aspirational
outfit (light collared shirt, no formal suit), hopeful nervous expression, same rendering
style and warm studio lighting as a game-show contestant, square 1:1 framing, clean render,
transparent or solid dark background, no text, no logos, no watermark
```
Guardar como `hombre-idle.mp4` / `hombre-idle.png` → `public/media/characters/`

## PASO 4 — Avatar jugadora femenina

```
3D Pixar-style animated character, Latina woman, late 20s to mid 30s, casual aspirational
outfit, hopeful nervous expression, same rendering style and warm studio lighting as a
game-show contestant, square 1:1 framing, clean render, transparent or solid dark
background, no text, no logos, no watermark
```
Guardar como `mujer-idle.mp4` / `mujer-idle.png` → `public/media/characters/`

## PASO 5 (opcional, si queda free) — Fondo de escena TOF

```
Game-show stage background fused with glossy candy-crush-style aesthetic, shiny bright
surfaces, deep navy base (#1A1A2E) with royal purple (#6C3FA0) and gold (#FFD700) neon
accent lights, soft bokeh, no text, no logos, leave empty negative space in upper-center
area for UI overlay, 16:9, high resolution
```
Guardar como `fondo-tof.png` → `public/images/generated/`

## PASO 6 — Súbeme lo generado

Cuando tengas los archivos, dime la ruta local (o simplemente confírmame que ya están en `public/media/characters/` y `public/images/generated/` si los arrastraste tú directo al repo) y yo:
1. Verifico peso/formato (video <1.5MB, comprimo con ffmpeg si hace falta).
2. Conecto `CharacterSlot` para que use el asset real en vez del emoji placeholder, con fallback si falla carga (regla ya fijada en doc 09 §3 y doc 10 §4).
3. Corro build + reviso visualmente antes de dar por cerrado.

## Notas

- Nombre "Steve Harvey" NUNCA se escribe en prompts reales — este doc ya lo evita (rasgos genéricos únicamente), cumple regla de compliance de doc 10 §5.
- Si el modelo free no soporta video, no hay drama: arrancamos con PNG estático (`CharacterSlot` ya soporta imagen como implementación interna, doc 10 §4) y migramos a video cuando haya créditos.
- Si algún prompt da resultado que no calza (outfit incorrecto, expresión rara), regenera variando solo la frase de expresión/outfit — mantén el resto idéntico para conservar consistencia de estilo entre los 3 personajes.
