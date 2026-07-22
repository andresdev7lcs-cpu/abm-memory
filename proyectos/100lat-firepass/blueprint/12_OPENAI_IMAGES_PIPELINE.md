# 12 — PIPELINE VISUAL OPENAI IMAGES (reemplaza Higgsfield)
**Fecha:** 2026-07-22 · **Precedencia:** reemplaza docs 10 y 11 como método de generación. El estilo/paleta objetivo NO cambia (sigue siendo 09_UI_RADICAL_INTEGRATION.md), solo cambia el proveedor: Higgsfield descartado (cuenta sin créditos, free trial bloqueado en CLI y dashboard). Formato de salida cambia de video-loop a **imagen estática** (`gpt-image-1` no genera video).

**Precondición ya resuelta:** `OPENAI_API_KEY` guardada en `.env.local` (gitignored, verificada — API responde, billing activo, `gpt-image-1` confirmado funcional con test real 2026-07-22).

---

## 0. Objetivo

Generar 3 imágenes estáticas vía OpenAI Images API (`gpt-image-1`) para reemplazar los emojis placeholder de `CharacterSlot`:
1. Charlie (presentador) — rasgos genéricos de showman, **nunca el nombre real de ninguna celebridad en el prompt**.
2. Avatar jugador masculino.
3. Avatar jugadora femenina.

Video-loop queda descartado por ahora (fuera de alcance de esta API) — se puede retomar más adelante con otro proveedor si se decide.

## 1. Script

Archivo: `scripts/generate_visual_assets.mjs` (Node, usa `fetch` nativo — Node 24 ya instalado, no requiere librería extra).

Requisitos:
- Lee `OPENAI_API_KEY` de `process.env` (cargado desde `.env.local` vía `dotenv` si no está ya en el shell — agregar `dotenv` a devDependencies si no existe).
- Llama `POST https://api.openai.com/v1/images/generations` con `model: "gpt-image-1"`, `size: "1024x1024"`, `n: 1`, `background: "transparent"` si el modelo lo soporta para facilitar integración sobre fondos de la app.
- Decodifica `b64_json` de la respuesta y escribe PNG a disco.
- Idempotente: si el archivo destino ya existe, skip (no gastar de nuevo sin confirmación explícita de `--force`).
- Log de costo aproximado antes de generar (gpt-image-1 1024x1024 ronda centavos por imagen — imprimir aviso, no bloquear, ya que ya se confirmó billing activo).
- Nunca imprime la API key en logs ni la escribe en ningún archivo fuera de `.env.local`.

Destino de archivos: `public/images/generated/`:
- `charlie-idle.png`
- `hombre-idle.png`
- `mujer-idle.png`

## 2. Prompts (usar tal cual, en inglés)

**Charlie:**
```
3D Pixar/Disney-style animated character illustration, charismatic TV game-show host,
man in his 50s, warm brown skin, clean shaved bald head, neat trimmed mustache, big
genuine showman smile, wearing a bright royal purple suit jacket with a golden lapel
trim, holding a golden microphone, standing on a game-show stage with blurred neon
fire-orange and gold lights in the background, warm cinematic studio lighting, square
1:1 framing, clean render, no text, no logos, no watermark
```

**Avatar masculino:**
```
3D Pixar-style animated character illustration, Latino man, late 20s to mid 30s,
casual aspirational outfit (light collared shirt, no formal suit), hopeful nervous
expression, same rendering style and warm studio lighting as a game-show contestant,
square 1:1 framing, clean render, no text, no logos, no watermark
```

**Avatar femenino:**
```
3D Pixar-style animated character illustration, Latina woman, late 20s to mid 30s,
casual aspirational outfit, hopeful nervous expression, same rendering style and warm
studio lighting as a game-show contestant, square 1:1 framing, clean render, no text,
no logos, no watermark
```

## 3. Integración en código

- `CharacterSlot`: swap interno de emoji gigante → `<img>`/`next/image` apuntando a `public/images/generated/{charlie|hombre|mujer}-idle.png`. API pública del componente no cambia (regla ya fijada en doc 09 §3).
- Fallback: si el archivo no existe (404), mostrar el emoji placeholder actual — nunca romper la pantalla.
- Animación de "idle bounce" que antes daría el video-loop se logra ahora con CSS (`animation: bounce 3s ease-in-out infinite` ya definido en spec original de CharacterSlot, doc 01 §4) aplicada sobre la imagen estática — no se pierde la sensación de vida, solo cambia el medio.

## 4. Compliance (hereda F6.1 del checklist + regla de doc 10 §5)

Ningún prompt/filename/commit contiene nombres reales de celebridades, marcas de seguros/finanzas, ni texto renderizado prohibido. Grep compliance debe seguir cubriendo `Steve Harvey|Harvey` como patrón vetado en `src/`, `public/`, nombres de archivo y mensajes de commit.

## 5. Fuera de scope

Video-loop de personajes, fondos de escena adicionales (doc 10 §3.4 — puede retomarse con este mismo pipeline si se decide, mismo script, prompts nuevos), entrenamiento de consistencia tipo Soul-ID (no aplica a esta API).
