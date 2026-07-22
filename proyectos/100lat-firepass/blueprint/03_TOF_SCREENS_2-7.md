# TOF — SCREENS 2–7 (Instructions · Game · Loss · Win · Unlock · Share)
**Fecha:** 2026-07-06 · Referencias obligadas: `01_DESIGN_SYSTEM.md`, `02_TOF_SCREEN1_HOME.md`
Fondo de TODO el TOF: gradiente navy. Transición entre pantallas: slide horizontal 300ms (§5 DS).

**Decisión registrada (conflicto de spec resuelto):** el blueprint madre prohíbe mostrar score acumulado/progreso, pero define reacciones de Charlie a respuesta correcta/incorrecta. Regla final: **Charlie SÍ reacciona a la correctitud de cada respuesta (ese es el entretenimiento), pero NUNCA se muestra contador, progreso, ni resumen de aciertos hasta la pantalla de resultado.** El usuario intuye, no contabiliza.

---

## SCREEN 2 — INSTRUCTIONS (`/instrucciones`)

```
┌──────────────────────────────────┐
│      ╭──────────╮                │
│      │ CHARLIE  │  estado:       │  ← CharacterSlot 200px, mira a cámara
│      │ welcome  │                │
│      ╰──────────╯                │
│  Las reglas son simples,         │  ← H2 24px Nunito 800 white
│  {name}:                         │
│                                  │
│  ⏱  20 segundos por pregunta     │  ← 3 bullets, cards navy-800
│  🎯  10 preguntas, sin segundas  │    rounded-2xl, icono 24px +
│      oportunidades               │    texto 16px Inter 500 white
│  🛟  2 comodines: 50/50 y una    │
│      pista de Charlie            │
│                                  │
│  ┌────────────────────────────┐  │
│  │       ESTOY LISTO  →       │  │  ← Button primary gold
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

- Bullets entran en cascada (stagger 120ms, slide-up + fade).
- Copy `es.json → instructions`: exactamente los 3 bullets de arriba. Máximo 3, regla dura.
- Sin nombre en store (acceso directo a URL) → redirect a `/`.
- Al tap CTA: animación scale + `router.push('/juego')`. Prefetch de `questions_pool.json` y assets Charlie de juego ya debe estar hecho aquí.
- Evento GA4: `instructions_viewed`, y al tap `game_start` (+ Pixel custom `GameStart`).

## SCREEN 3 — GAME (`/juego`, una sola ruta para las 10 preguntas)

```
┌──────────────────────────────────┐
│  Pregunta 3 de 10        ⏱ 14   │  ← contador de POSICIÓN (permitido:
│                        (Timer)   │    es ubicación, no score) + Timer §4.4
│                                  │
│  ¿Qué hace la mayoría de los     │  ← pregunta 22px Nunito 800 white
│  latinos cuando recibe $10,000   │    centrada, min-h fija 96px
│  inesperados?                    │    (evita salto de layout)
│                                  │
│  ┌ A │ Los invierte ───────────┐ │
│  ┌ B │ Los guarda ─────────────┐ │  ← 4× AnswerCard §4.3, stack
│  ┌ C │ Los gasta en gustos ────┐ │    vertical gap 12px
│  ┌ D │ Los dona ───────────────┐ │
│                                  │
│  [🔀 50/50]   [💡 Pista]         │  ← LifelineButtons §4.5, fila
│                                  │
│  ╭────────╮                      │
│  │CHARLIE │ ← game 96px esquina  │  ← reactivo, con bocadillo para
│  ╰────────╯   inferior izquierda │    pista y reacciones
└──────────────────────────────────┘
```

### 3.1 Pool de preguntas — `src/data/questions_pool.json`
Schema por pregunta:
```json
{
  "id": "q_017",
  "level": 1,                       // 1 fácil · 2 media · 3 específica
  "text": "¿Cuál es el salario mínimo en California en 2026?",
  "text_tokens": ["STATE.MIN_WAGE"],// tokens usados (documental)
  "options": ["$13.50", "$15.00", "$16.50", "{{STATE.MIN_WAGE}}"],
  "correctIndex": 3,
  "hint": "Charlie dice: 'Piensa en el más alto… California no es barata, mi gente.'",
  "variant": "A"                    // A/B/C — heredado de Build B
}
```
50 preguntas total (generación = tarea Codex, ver checklist; las 10 del build Next.js actual se migran como semilla nivel 1–2). Tokens `{{STATE.X}}` se resuelven en runtime desde `src/data/states/CA.json`:
```json
{ "code": "CA", "MIN_WAGE": "$16.90", "STATE_TAX_TOP": "13.3%", "COL_INDEX": 142 }
```
Estado activo: `NEXT_PUBLIC_DEFAULT_STATE` (default `CA`). Añadir estado = añadir JSON, cero cambios de código.

### 3.2 Sorteo de sesión
- 3 aleatorias de level 1 → posiciones Q1–Q3
- 4 aleatorias de level 2 → Q4–Q7
- 3 aleatorias de level 3 → Q8–Q10
- Sin repetición dentro de sesión. Variantes A/B/C: elegir variante por sesión (aleatoria uniforme) y sortear solo dentro de esa variante; registrar `variant` en evento y en update del lead (columna `quiz_variant TEXT`).
- Semilla del sorteo en Zustand; refresh de página re-sortea y reinicia (aceptado v1).

### 3.3 Máquina de estados por pregunta
```
SHOWING → (tap opción) LOCKED → REACTION (Charlie, 1.4s) → ADVANCE (slide) → SHOWING siguiente
        → (timer 0)   TIMEOUT → cuenta como incorrecta → REACTION tensión → ADVANCE
```
- `LOCKED`: opciones disabled, seleccionada con borde gold 150ms. NO se colorea verde/rojo la opción.
- `REACTION`: Charlie `correct` ("¡Eso es!") o `wrong` ("ay no…") con bocadillo breve — pool de 4 frases por tipo en `es.json`, rotación aleatoria. Duración fija 1.4s, auto-advance.
- Timer: 20s por pregunta, reinicia en cada `SHOWING`. En `REACTION` se oculta.
- Q10 → `ADVANCE` navega a `/resultado` (una sola ruta; variante WIN/LOSS por estado).

### 3.4 Comodines (1 uso cada uno por sesión)
- **50/50:** elimina 2 incorrectas aleatorias → estado `opacity-30 + strike` (§4.3). Charlie `lifeline` (guiño).
- **Pista:** bocadillo de Charlie con `hint` de la pregunta, permanece hasta responder. Charlie `lifeline`.
- Usados quedan disabled resto de sesión. Timer NO se pausa al usar comodín.

### 3.5 Scoring y datos
- Score interno en Zustand (`correctness[]` como build actual). WIN = **score ≥ 9**.
- Segmentación (actualiza lead al terminar): `low 0–4 · medium 5–7 · high 8–10` (spec madre; **corregir** `getSegment()` actual).
- Update Supabase al terminar: `UPDATE leads SET score, segment, quiz_variant WHERE email` (vía upsert helper).
- Eventos GA4 por respuesta: `question_answered {question_id, position, correct, lifelines_used, seconds_left}`. Al terminar: `quiz_complete {score, segment}` + Pixel custom `QuizComplete`.

## SCREEN 4 — RESULT LOSS (`/resultado`, flujo mayoritario, score ≤ 8)

```
┌──────────────────────────────────┐
│      ╭──────────╮                │
│      │ CHARLIE  │  estado: loss  │  ← 200px, postura cálida
│      ╰──────────╯                │
│  No es tu culpa.                 │  ← H1 28px Nunito 900 white
│  Nadie nos enseñó esto.          │
│                                  │
│  ┌────────────────────────────┐  │
│  │ Con los hábitos financieros│  │  ← StatCard navy-800: cifra
│  │ promedio, los latinos dejan│  │    $340,000 en gold 32px
│  │ de acumular hasta          │  │    Nunito 900, count-up 800ms
│  │      $340,000              │  │
│  │ para su retiro             │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │  QUIERO MI GUÍA GRATUITA → │  │  ← Button primary gold + glow
│  └────────────────────────────┘  │
│  La guía que el {score}% no      │
│  llegó a ver · gratis 72 horas   │  ← microcopy 12px white/40
└──────────────────────────────────┘
```

- **NO se muestra el score numérico.** Regla dura. Tampoco "perdiste".
- Microcopy usa porcentaje FIJO de copy ("90%"), no el score real: `"La guía que el 90% no llega a ver · gratis por 72 horas"`.
- Charlie loss = empático, esperanzador. Sin confetti, sin rojo.
- CTA → flujo unlock (Screen 6). Evento `cta_guide_click {result:'loss'}`.

## SCREEN 5 — RESULT WIN (`/resultado`, score ≥ 9)

- Confetti al montar (§5 DS, doble burst). Charlie `win` celebración total.
- H1: `¡Eres del 10% que lo sabe!` · Sub: `Ahora descubre cómo usar lo que sabes para cambiar tu futuro financiero`
- Badge gold grande "TOP 10%" (Badge §4.6 tamaño 96px) con spring.
- Mismo CTA y destino que LOSS: `QUIERO MI GUÍA GRATUITA` (framing distinto, misma guía). Evento `cta_guide_click {result:'win'}`.
- Aquí SÍ se puede mostrar "10/10" o "9/10" (ganó — mostrar refuerza ego). Score en gold 48px encima del badge.

## SCREEN 6 — GUIDE UNLOCK (`/guia/acceso`)

```
┌──────────────────────────────────┐
│  [CountdownBanner 72h coral]     │  ← arranca AQUÍ
│      ╭──────────╮                │
│      │ CHARLIE  │ estado welcome │
│      ╰──────────╯                │
│  Tu guía está lista, {name}.     │  ← H2
│  Tienes 72 horas de acceso.      │
│                                  │
│  ┌ 📖 7 capítulos ──────────────┐│  ← 3 mini-cards preview
│  ┌ 🏅 7 insignias ──────────────┐│    (qué hay dentro)
│  ┌ ⏱ 10 min por capítulo ──────┐│
│                                  │
│  ┌────────────────────────────┐  │
│  │      ACCEDER AHORA  →      │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Mecánica server-side del unlock (CONFIRMADA por AP — enforcement en servidor):**
1. Al montar, cliente llama `POST /api/guide/unlock` con email del store.
2. Route handler (service_role key, server only):
   - Genera `access_token` UUID.
   - `UPDATE leads SET guide_unlocked_at = COALESCE(guide_unlocked_at, now()), guide_access_token = <uuid> WHERE email` — `COALESCE` evita reiniciar las 72h en re-visitas.
   - Set cookie `fp_guide` httpOnly, Secure, SameSite=Lax, maxAge 72h, valor = token.
3. Toda ruta/API de la guía valida server-side: token cookie → fila lead → `now() < guide_unlocked_at + interval '72 hours'`. Expirado o sin token → render pantalla LOCKED (ver doc 04 §6).
4. Countdown del banner en cliente = **cosmético**, calculado desde `guide_unlocked_at` devuelto por la API (no desde reloj local de inicio).

Migración adicional:
```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS guide_access_token UUID;
CREATE INDEX IF NOT EXISTS leads_guide_token_idx ON leads (guide_access_token);
```
Eventos: `guide_unlocked` GA4 + n8n webhook `{event:'guide_unlocked', email}`.

## SCREEN 7 — SHARE / VIRAL LOOP (P1 — construir al final, feature-flag `NEXT_PUBLIC_SHARE_ENABLED`)

- Se muestra como card secundaria DEBAJO del CTA en Screens 4/5 (no pantalla propia): `¿Cuánto saben tus amigos? Reta a alguien.`
- Botón secundario teal `RETAR A UN AMIGO` → Web Share API con fallback a WhatsApp URL:
  `https://wa.me/?text=` + encodeURIComponent(`Acabo de jugar "100 Latinos en USA dijeron…" 🎤 ¿Tú cuánto sabes de dinero? Juega gratis: {APP_URL}?ref={leadId}`)
- `?ref=` se guarda en columna `leads.referred_by UUID` al capturar el nuevo lead.
- Evento `share_click {channel}`.

## CRITERIOS DE ACEPTACIÓN GLOBALES TOF

- [ ] Nunca visible: score acumulado, progreso de aciertos, verde/rojo en opciones
- [ ] Siempre visible en juego: posición (n de 10), timer, 2 comodines
- [ ] Timeout de timer = incorrecta + reacción tensión + auto-advance
- [ ] WIN = score ≥ 9; segmentos low 0–4 / medium 5–7 / high 8–10 (corregido vs código legacy)
- [ ] Re-visita a `/guia/acceso` NO reinicia las 72h (COALESCE verificado)
- [ ] Cookie `fp_guide` httpOnly; validación de expiración ocurre en servidor, test con reloj adelantado
- [ ] Acceso directo a `/juego` o `/resultado` sin estado → redirect `/`
- [ ] Todos los eventos GA4/Pixel de la tabla de auditoría disparan con payload correcto
