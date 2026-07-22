# VSL BRIEF — DOS VIDEOS (P1)
**Fecha:** 2026-07-06 · Formato ambos: vertical 9:16 (mobile-first), subtítulos quemados SIEMPRE (mayoría ve sin audio), español, estilo visual = universo Pixar de los personajes + motion graphics con paleta del design system.
**Producción:** fuera de scope Codex. Este brief alimenta al productor/herramienta de video. Placeholder en código: `[VSL_BRIDGE_PENDING]`, `[VSL_CALL_PENDING]`.

---

## VSL 1 — PUENTE GUÍA → BPA
**Ubicación:** card de video dentro del capítulo 7, antes del CTA "$5". **Duración: 60–75 segundos.** Narrador: GLORIA (voz cálida, cómplice, cero vendedora).

**Objetivo:** convertir el momento de máxima autoestima del usuario (acaba de terminar 7 capítulos, tiene 7 badges) en la compra de $5. El video NO vende features: vende la brecha entre saber y hacer.

**Estructura (6 beats):**

| # | Beat | Segundos | Contenido / visual |
|---|---|---|---|
| 1 | Espejo | 0–8 | Gloria a cámara: "Acabas de terminar algo que el 90% de los latinos nunca empieza." Visual: los 7 badges del usuario cayendo en fila (personalizable = motion template) |
| 2 | La verdad incómoda | 8–20 | "Pero te voy a decir la verdad, porque te la mereces: saber no cambia cuentas de banco." Visual: libreta llena de apuntes junto a un estado de cuenta que no cambia |
| 3 | El común denominador | 20–35 | "Todos los que SÍ lo lograron tienen una sola cosa en común: alguien les mostró cómo aplicarlo a SUS números. No a los del ejemplo. A los suyos." Visual: transición de gráfica genérica → ciudad-avatar personalizada |
| 4 | Presentación BPA | 35–52 | "Por eso construimos tu Agente Financiero Personal. No es un curso. No es un coach. Es una herramienta que toma TUS números y construye TU mapa — jugando." Visual: demo real de la ciudad: onboarding paso 4 (nubes de deuda) y un level-up |
| 5 | Ancla de precio | 52–62 | "¿El precio? Cinco dólares. Menos que el combo que te comiste hoy. Una sola vez." Visual: $5 grande gold, tachado junto a íconos de gasto diario |
| 6 | CTA + Zeigarnik | 62–75 | "Tu ciudad ya existe. Está esperando que llegues. Constrúyela." Visual: ciudad en gris/apagada que se enciende parcialmente — queda claramente incompleta. Botón animado gold |

Reglas: cero mención de llamada/asesor/productos (eso vive en nivel 5, no aquí). Tono chisme-esperanza, nunca urgencia agresiva. Última palabra siempre CTA visual, no logo.

## VSL 2 — LANDING DE LLAMADA
**Ubicación:** `/llamada`, entre hero y beneficios (opcional autoplay muted con play manual de audio). **Duración: 45–60 segundos.** Narrador: GEORGE si el usuario venía con George, GLORIA si venía con Gloria (2 renders del mismo guion — refuerza confianza con la cara ya conocida). Fallback único: Gloria.

**Objetivo:** eliminar el miedo #1 ("me van a vender algo") y hacer que agendar se sienta como premio ganado, no como cita de ventas.

**Estructura (5 beats):**

| # | Beat | Segundos | Contenido / visual |
|---|---|---|---|
| 1 | Reconocimiento | 0–8 | "Llegaste más lejos que el 85%. Eso no es suerte — es decisión." Visual: nivel 5, ciudad iluminada del usuario |
| 2 | Desarme de objeción (CLAVE) | 8–22 | "Y sé lo que estás pensando: 'aquí viene la venta'. No. Esta sesión no es una venta. Es 30 minutos donde un experto certificado mira TU mapa contigo." Visual: George/Gloria niega con la cabeza, sonríe — cero corporate |
| 3 | Qué pasa en la llamada | 22–38 | "Vas a salir con tres cosas: dónde estás parado de verdad, tu plan de 90 días, y una estrategia que la mayoría de los latinos nunca escucha." Visual: los 3 íconos de la landing animados |
| 4 | Escasez honesta | 38–48 | "Solo hay unas cuantas sesiones por semana, porque son de verdad, con una persona de verdad." Visual: calendario con pocos slots gold |
| 5 | CTA | 48–60 | "Te la ganaste. Elige tu momento." Visual: flecha hacia el embed de Calendly (el video vive ARRIBA del embed) |

**Compliance duro en ambos guiones:** prohibido: seguro, IUL, póliza, anualidad, inversión garantizada, nombres de producto. La sesión se nombra ÚNICAMENTE "sesión estratégica gratuita con un experto financiero certificado". Guion final pasa el mismo grep de compliance que el contenido web antes de grabar.

**Checklist de producción (por video):**
- [ ] Guion literal aprobado por AP (grep compliance pasado)
- [ ] Subtítulos quemados, legibles a 390px
- [ ] Primeros 3 segundos funcionan SIN audio (hook visual)
- [ ] Versión con y sin CTA final embebido (para reusar en ads si aplica)
- [ ] Export: 1080×1920 H.264 <15MB (web) + master
- [ ] Eventos al integrar: `vsl_play`, `vsl_complete {video, pct}`
