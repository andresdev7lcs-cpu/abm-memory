# MOF-1 — MINI APP GUÍA INTERACTIVA (7 capítulos)
**Fecha:** 2026-07-06 · Referencias: `01_DESIGN_SYSTEM.md` · Contenido fuente: PDF "Rescatando Nuestro Futuro" (SOLO conceptos y estadísticas; prohibido reproducir estructura, marca o lenguaje literal WSB/WFG)
**Metáfora:** revista de chismes sobre dinero. Cards tipo reel, swipe/tap, nunca scroll largo. Fondo: `cream`, texto `ink`. Personaje: GLORIA.

---

## 1. RUTAS Y GUARDIA DE ACCESO

| Ruta | Contenido |
|---|---|
| `/guia` | Índice: 7 capítulos como cards, progreso, badges, CountdownBanner |
| `/guia/[n]` (n=1–7) | Player de cards del capítulo n |
| `/guia/expirada` | Pantalla LOCKED post-72h |
| `/api/guide/unlock` | (doc 03 §Screen 6) |
| `/api/guide/progress` | GET/POST progreso |

**Guardia server-side (regla confirmada):** layout de `/guia/**` es Server Component que lee cookie `fp_guide`, consulta lead por `guide_access_token` y valida `now() < guide_unlocked_at + interval '72 hours'`. Falla → redirect `/guia/expirada`. El cliente jamás decide acceso; countdown visual solo cosmético.

## 2. MODELO DE DATOS

```sql
CREATE TABLE IF NOT EXISTS guide_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  chapter INT NOT NULL CHECK (chapter BETWEEN 1 AND 7),
  cards_seen INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  interactions JSONB NOT NULL DEFAULT '{}',   -- respuestas de micro-interacciones
  UNIQUE (lead_id, chapter)
);
ALTER TABLE guide_progress ENABLE ROW LEVEL SECURITY;
-- Sin políticas anon: TODO acceso vía route handlers con service_role (token cookie identifica al lead).
```
Escritura de progreso: POST `/api/guide/progress` en cada card avanzada (debounce 2s) y al completar capítulo.

## 3. PLAYER DE CARDS — MECÁNICA

- Un capítulo = secuencia de **8–12 cards**. Una card = una pantalla completa (`h-dvh` menos banner), sin scroll interno salvo overflow accesible.
- Avance: tap en mitad derecha o swipe izquierda; retroceso: tap mitad izquierda. Barra de progreso del capítulo arriba: segmentos finos estilo stories (PERMITIDO aquí — no es el quiz).
- Cards interactivas BLOQUEAN el avance hasta interactuar (regla: mínimo 1 interacción por sección; el usuario nunca solo lee).
- Al completar capítulo: badge (spring §5 DS) + Gloria `proud` + card final con CTA al siguiente capítulo.
- Zeigarnik: en el índice, el capítulo siguiente al último completado se ve con preview borroso (`blur-sm`) + candado; los posteriores solo candado.

## 4. TIPOS DE CARD (componentes en `src/components/guide/`)

| Tipo | Uso | Spec |
|---|---|---|
| `HookCard` | apertura de capítulo | Stat gigante gold 48px + pregunta directa. Fondo navy (contraste con cream del resto — momento "portada de revista") |
| `StoryCard` | historia humanizada | Foto-ilustración placeholder + narración ≤60 palabras por card, tono prima/o mayor |
| `StatCard` | dato duro | Cifra count-up + fuente en microcopy 12px |
| `TapChoiceCard` | interacción "cuál eres tú" | 2–4 opciones AnswerCard; SIN respuesta incorrecta; feedback = Gloria reacciona + texto validante. Respuesta → `interactions` JSONB |
| `RevealCard` | chisme/secreto | Card cubierta "toca para descubrir" → flip 3D 400ms |
| `SliderCalcCard` | calculadora viva | Slider input → resultado recalcula en vivo (fórmulas §5 por capítulo), resultado gold Nunito 800 |
| `DragRankCard` | ordenar (cap. 4) | Drag vertical de 3–4 cards (framer-motion Reorder) |
| `MicroWinCard` | cierre de sección | "Ya sabes más que la mayoría" + check verde |
| `BadgeCard` | fin de capítulo | Badge + resumen 3 bullets de lo aprendido + CTA siguiente |

Copy: TODO en `src/content/guide/cap{n}.json` — card por card, cero hardcode. Tono: cálido, cero vergüenza, chisme, esperanza. Vocabulario OBLIGATORIO según tabla de reframes del blueprint (ej.: "el interés multiplicador", "el juego fiscal", "tu libertad financiera futura"). PROHIBIDO: seguro, IUL, póliza, anualidad, WSB, WFG.

## 5. LOS 7 CAPÍTULOS — CONTENIDO CARD A CARD (estructura; redacción final = tarea de contenido con estos beats)

Conceptos extraídos del PDF (permitido): 44% no cubre gasto de $400 · fórmula de la riqueza (Dinero+Tiempo±Retorno−Inflación−Impuestos) · Regla del 72 · interés simple vs compuesto · $16K deuda promedio de tarjetas · 3 cubetas de impuestos (ahora/después/con ventaja) · Seguro Social ~$1,400/mes y ratio 40→3 trabajadores/retirado · fórmula 10/20 · ahorrar temprano (Sr. Ahorros Temprano vs Sr. Esperar Mucho) · páguese usted primero (5–15%) · deuda bola de nieve.

**Cap 1 — Tu dinero, tu historia (🏠 "Punto de partida")**
Cards: Hook("44% de los latinos en USA no podría cubrir un gasto inesperado de $400. ¿Y tú?") → Story(Carlos, jardinero en LA, 10 años trabajando, $0 ahorrados — sin juicio) → Stat(sueldo a sueldo) → TapChoice("¿Cuál suena más a ti?" 4 perfiles, todos validados) → MicroWin("Ya conoces tu punto de partida. Eso es más de lo que hace la mayoría.") → Badge 🏠.

**Cap 2 — Cómo funciona el dinero (badge 🧮)**
Hook(fórmula de la riqueza, animada término a término) → RevealCard("¿Por qué el banco te paga 0.5% y te cobra 24% por el MISMO dinero?") → SliderCalc("Si guardas $X/día…" → FV mensual, 8%, 30 años; fórmula `FV = P·((1+r)^n −1)/r`, r=0.08/12) → Story → MicroWin → Badge.

**Cap 3 — El interés multiplicador: arma o trampa (badge ⚡)**
Hook(Regla del 72: "72 ÷ tu tasa = años en duplicar") → Story(dos primos, mismo sueldo, resultados opuestos — datos del Sr. Temprano vs Sr. Tarde: $25,200 aportados vs $61,200 y llegan casi igual) → TapChoice("¿A cuál primo te pareces hoy?") → RevealCard chisme("Tu tarjeta usa este MISMO poder contra ti ahora mismo") → StatCard California($5,000 al 24% APR pagando mínimo ≈ $X extra en 3 años — calcular con fórmula estándar y fijar cifra en contenido) → Badge.

**Cap 4 — Maneja las deudas antes de que te manejen (badge ✂️)**
Hook("La deuda es lo único que crece sin que hagas nada") → concepto bola de nieve con animación (deuda chica muere primero → libera pago) → DragRank("Ordena estas deudas de menor a mayor" 4 cards ejemplo) → tip práctico("Cancela UNA suscripción hoy = $15/mes = $180/año") → MicroWin → Badge.

**Cap 5 — El juego fiscal (badge 🎩)**
Hook("Hay 3 maneras de pagar impuestos por tu dinero. La mayoría solo conoce una.") → visual 3 cubetas(Ahora / Después / Con Ventaja — comparación simple) → StatCard California(capa estatal explicada simple) → **card semilla CLAVE, copy exacto:** "Existen vehículos financieros donde tu dinero crece completamente libre de impuestos. Poca gente los conoce." (SIN nombrar producto — planta para la llamada) → TapChoice("¿En qué cubeta está tu dinero hoy?") → Badge.

**Cap 6 — Tu retiro: nadie más lo va a construir (badge 🕰)**
Hook("El Seguro Social paga en promedio $1,400/mes a los 67. ¿Te alcanza?") → Stat(ratio 40→3 trabajadores por retirado) → fórmula 10/20 explicada como "tu número" → SliderCalc("Tus gastos mensuales → tu número de retiro" = gastos×12×20) → StatCard urgencia("Cada año que esperas te cuesta $X" — usar duplicación Regla 72) → card emocional, copy exacto: "Tu pareja no tiene pensión. No tiene ahorros. Si algo te pasa esta noche, ¿qué pasa con ella?" (Gloria seria, fondo navy) → Badge.

**Cap 7 — De saber a hacer (badge 🚀 "Listo para actuar")**
Recap(badges ganados, grid animado) → Stat("Acabas de aprender lo que el 90% de los latinos aún no sabe") → card puente, copy exacto: "Pero saber no basta. Los que SÍ cambian sus finanzas tienen una cosa en común: alguien les mostró CÓMO aplicarlo a SU situación." → presentación BPA("Conoce a tu Agente Financiero Personal — $5. No es un curso. No es un coach. Es la herramienta que construye TU mapa financiero.") → CTA gold `CONSTRUIR MI MAPA — $5` → `/bpa` → Badge final.

## 6. TIMER 72H — UX DE EXPIRACIÓN Y NUDGES

- `CountdownBanner` (§4.7 DS) en todo `/guia/**`, HH:MM:SS desde `guide_unlocked_at` servido por API.
- **T+48h nudge:** workflow n8n (cron 1h) busca leads con `guide_unlocked_at BETWEEN now()-49h AND now()-48h` y guía incompleta → email/Telegram según canal disponible: "Gloria: Te quedan 24 horas de acceso. Tu capítulo {n} te espera." [Implementación n8n = Claude Code, fuera de scope Codex.]
- **Expirada** (`/guia/expirada`): Gloria `nudge` + "Tu acceso gratuito terminó. Lo que aprendiste sigue siendo tuyo — el siguiente paso está listo." + CTA gold al BPA ($5) + secundario ghost "Volver a jugar". NO se re-otorga acceso gratis v1.
- Última card de sesión abandonada: al volver, deep-link al capítulo/card exacto desde `guide_progress`.

## 7. EVENTOS

`guide_opened` · `chapter_started {n}` · `card_viewed {n, card}` (sample 1/3 para no inflar GA4) · `interaction {n, card, value}` · `chapter_completed {n}` (+ Pixel custom en n=7: `GuideComplete`) · `bpa_cta_click`.

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] Sin cookie válida o expirado → server redirect, imposible ver cards vía cliente
- [ ] Cards interactivas bloquean avance hasta interactuar
- [ ] Progreso persiste server-side; volver retoma card exacta
- [ ] Countdown coincide con `guide_unlocked_at` server (tolerancia 2s)
- [ ] Los 7 badges otorgan y persisten; grid del cap. 7 los refleja
- [ ] Calculadoras: fórmulas exactas de §5, resultados con tabular-nums y count-up
- [ ] Cero vocabulario prohibido (grep CI sobre `src/content/guide/`)
- [ ] Reframes de vocabulario aplicados según tabla blueprint
