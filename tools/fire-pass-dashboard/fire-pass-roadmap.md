# FIRE PASS — Roadmap de Ejecución

> LECTURA ONLY. No editar el contenido de tickets a mano mientras el dashboard esté corriendo — `server.mjs` reescribe la línea `- **Estado:**` de cada ticket. Fuente: blueprint `proyectos/100lat-firepass/blueprint/` (docs 01-09) + `PROMPT_MADRE.md`. Autoridad de diseño: `09_UI_RADICAL_INTEGRATION.md` (manda sobre 01 y sobre docs 02-06 donde choquen). Autoridad de secuencia de ejecución: `07_MASTER_CHECKLIST_CODEX.md`.

## Hito I: TOF Game (Top of Funnel — juego de trivia gamificado)

### T-I0: Design System
- **ID:** T-I0
- **Descripción:** Design tokens (paleta v2 de `09_UI_RADICAL_INTEGRATION.md` §1 — reemplaza §1 de `01_DESIGN_SYSTEM.md`), identidad visual Candy Crush/Royal Match, tipografía Nunito (headers/CTAs) + Inter (cuerpo) vía `next/font`, gradientes oficiales como CSS vars (`--grad-levelup`, `--grad-success`, `--grad-royal`, `--grad-fire`, `--grad-card`), sombras de color (nunca gris puro), escala tipográfica y radios 20-32px.
- **Dependencias:** ninguna
- **Estado:** ✅ Completado
- **Modelo recomendado:** Fable
- **Verificación:**
  - Página `/dev/tokens` (solo dev) muestra todos los tokens, gradientes y sombras de color
  - Nombres de tokens coinciden 1:1 con `09_UI_RADICAL_INTEGRATION.md` §1
  - Contraste AA verificado: texto sobre gradientes fire/gold = navy/ink (nunca white); sobre royal = white
  - Componentes base (Button, Input, AnswerCard, ProgressDots, Toast, XPFloat) visibles en `/dev/ui` con overrides de §2

### T-I1: Game UI Framework
- **ID:** T-I1
- **Descripción:** Next.js 15 App Router + Zustand (estado del juego) + Framer Motion (animaciones). 10 preguntas sin progress bar de texto visible (sustituida por ProgressDots — un solo color de relleno, jamás marca correcta/incorrecta). Charlie como presentador (placeholder emoji gigante interino, ver T-I4). Feedback con humor por respuesta (nunca verde/rojo ni reveal de correcta). State token `CA.json` cargado según estado geográfico del lead. Pantalla de resultados con JACKPOT (WIN ≥9/10) y badges gamificados (LOSS, sin la palabra "perdiste"). A/B test de avatar Gloria vs George en pantallas donde aplique.
- **Subtareas:**
  - Máquina de estados del juego (doc 03 §3.3): intro → 10 preguntas → resultado
  - Sorteo de preguntas (doc 03 §3.2): distribución 3/4/3 por nivel de dificultad, sin repetidos
  - Comodines/lifelines (doc 03 §3.4): eliminar 50/50 (opacity .3 + strike, sin colorear verde/rojo)
  - Timer con anillo SVG (colores sky→gold→coral, pulso ≤5s restantes)
  - Integración `track()` de eventos Pixel/GA4: `GameStart`, `QuizComplete` (score, segment, variant)
- **Dependencias:** T-I0 ✅
- **Estado:** 🔄 En curso
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Test unitario del sorteo: distribución 3/4/3, sin preguntas repetidas
  - `getSegment()` corregido a rangos 0-4 / 5-7 / 8-10
  - Sin score visible durante el quiz (solo en resultado si WIN)
  - Sin "Pregunta X de 10" en texto — solo ProgressDots
  - `prefers-reduced-motion` respetado en animaciones Framer Motion

### T-I2: H1 Questions Pool — "100 Millonarios Dicen"
- **ID:** T-I2
- **Descripción:** Pool de 50 preguntas sobre seguros de vida y cultura financiera latina (temas de comportamiento/decisión, NO trivia técnica tipo "¿qué es un 401k?"). Vocabulario PROHIBIDO: IUL, annuity/anualidad, insurance/seguro (excepto "Seguro Social"), póliza, prima, WFG, WSB, "inteligencia artificial"/IA/AI, "perdiste", promesas de resultado económico. Distribución de dificultad 15 (nivel 1) / 20 (nivel 2) / 15 (nivel 3). Español latam con tono cultural (dichos, referencias familiares/comadres-compadres).
- **Dependencias:** T-I0 ✅
- **Estado:** ✅ Completado
- **Nota de verificación (discrepancia detectada 2026-07-10):** El roadmap resumido original marcaba este ticket como "🔄 En curso", pero `src/data/questions_pool.json` YA CONTIENE 50 preguntas válidas con distribución exacta 15/20/15 por nivel (level 1/2/3), formato `{id, level, text, text_tokens, options, correctIndex, hint, variant}`. Verificado por lectura directa del archivo. Se corrige el estado a Completado; falta correr `scripts/validate_pool.ts` (mencionado en checklist F2.3) para certificación formal contra schema y grep de compliance — si ese script no existe todavía, crearlo es la única subtarea pendiente real.
- **Modelo recomendado:** Fable+Sonnet
- **Verificación:**
  - `scripts/validate_pool.ts` corre limpio contra las 50 preguntas (crear si no existe)
  - Distribución ≥15/≥20/≥15 confirmada
  - Grep de compliance sobre `questions_pool.json`: cero coincidencias de vocabulario prohibido

### T-I3: H2 Questions Pool — "Latinos en USA"
- **ID:** T-I3
- **Descripción:** Segundo pool de 50 preguntas enfocado en experiencia de latinos en USA (seguros internacionales, remesas, cultura financiera de inmigrante — mismas restricciones de vocabulario que T-I2). Debe soportar swap de state token (`CA.json` u otro estado) sin romper la máquina de estados del juego.
- **Dependencias:** T-I1 🔄, T-I2 ✅
- **Estado:** 🔄 En curso
- **Nota:** Revisar si existe ya un segundo archivo de pool (`questions_pool_h2.json` o variante `variant: "B"` dentro del mismo `questions_pool.json`) antes de crear desde cero — el archivo actual usa un campo `"variant": "A"` por pregunta, posible indicio de que el swap H1/H2 se implementa como variante dentro del mismo pool en vez de archivo separado. Confirmar con el research/blueprint antes de duplicar trabajo.
- **Modelo recomendado:** Fable+Sonnet
- **Verificación:**
  - 50 preguntas válidas contra el mismo schema que T-I2
  - Swap de pool H1↔H2 no rompe sorteo ni comodines
  - Grep de compliance limpio

### T-I4: Charlie Presenter Animation
- **ID:** T-I4
- **Descripción:** Presentador Charlie con estética Pixar 3D (no emoji) reaccionando cada 3-4 preguntas, animado con Framer Motion.
- **Nota de riesgo/decisión pendiente (NO resuelta en este ticket):** Existe una discrepancia documentada entre la intención original del proyecto (Charlie Pixar 3D) y la decisión adoptada en `09_UI_RADICAL_INTEGRATION.md` §0 y §3: *"emojis gigantes como assets interinos de personajes"* fue formalmente ADOPTADO como solución temporal mientras se resuelve `[CHARACTER_ASSETS_PENDING]` (Charlie/Gloria/George — prompts semilla en Design System §6). El componente `CharacterSlot` debe exponer una API estable (tamaño, estado, nombre en pill) que hoy renderiza emoji gigante (120-200px, bounce sutil 3s loop, emoji secundario flotante para reacciones: correct 👏, wrong 😬, win 🎉, tension 😰) y que al llegar los renders Pixar reales simplemente sustituya el componente interno sin cambiar la API. Este ticket NO decide si "Pixar 3D" se implementa ya o se pospone — eso requiere resolución de `[CHARACTER_ASSETS_PENDING]` fuera de este ticket.
- **Dependencias:** T-I1 🔄
- **Estado:** 🔄 En curso
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - `CharacterSlot` en 3 tamaños, API estable documentada
  - Placeholder emoji gigante funcional con bounce loop y reacciones secundarias
  - Bocadillos y copys de Charlie funcionan igual con placeholder que con asset final (no bloqueante)

### T-I5: Results Screen & Badges
- **ID:** T-I5
- **Descripción:** Pantalla de resultados. WIN (≥9/10): JACKPOT completo — confetti multicolor 3s (gold/royal/fire/success), score count-up 0→N visible, badge "TOP 10%" 96px giro+scale, CTA pulse. LOSS (≤8/10): "LOSS gamificado" — sin la palabra "perdiste" ni "ganaste", badge de perfil por segmento (low = "CORAZÓN DE CALLE" 🔥, medium = "TALENTO NATURAL" ⚡, spring+sparkles gold, sin confetti que es exclusivo de WIN), StatCard $340,000 intacta como trigger. Share buttons con Meta Pixel detrás de flag `NEXT_PUBLIC_LEADERBOARD` / share P1.
- **Dependencias:** T-I1 🔄, T-I4 🔄
- **Estado:** 🔄 En curso
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Score ≤8 → LOSS sin score visible en pantalla; ≥9 → WIN con confetti y score
  - `segment` correcto persistido en Supabase (`leads`)
  - Evento Pixel/GA4 `CTAClick` con payload `{result: 'win'|'loss'}`
  - Share buttons invisibles si flag off; funcionales (wa.me con ref) si on

## Hito II: PDF Guide (AP-owned)

### T-II1: PDF Generation
- **ID:** T-II1
- **Descripción:** Generación de guía en PDF (~20 páginas equivalente en cards, ver doc 04) usando renderer de Next.js, con branding de Charlie y contenido de los 7 capítulos (`src/content/guide/cap{1..7}.json`) siguiendo los beats de `04_GUIDE_ARCHITECTURE.md` §5.
- **Dependencias:** T-I5 🔄
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Fable
- **Verificación:**
  - Contenido de 7 capítulos redactado con tono especificado y reframes obligatorios
  - Script de grep de compliance pasa sobre `src/content/guide/**`
  - Cada capítulo 8-12 cards; copys clave verbatim donde el doc lo exige

### T-II2: PDF Download + Email Capture
- **ID:** T-II2
- **Descripción:** Descarga de guía + captura de email en tabla `leads` de Supabase con tracking de opt-in. Guard server-side de acceso (`/guia/**`, `/guia/expirada`), cookie httpOnly con expiración COALESCE 72h.
- **Dependencias:** T-II1
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Acceso a `/guia/**` imposible sin cookie válida
  - Re-visita no reinicia progreso; expiración server-side testeada con timestamp manipulado en DB
  - Eventos `GuideUnlocked` y `GuideComplete` disparan una sola vez cada uno

## Hito III: BPA $5 Mini-App (AP-owned)

### T-III1: Mini-app UI SIMS-style
- **ID:** T-III1
- **Descripción:** UI de mini-app estilo SIMS con 4 pantallas: Intake → Calculation → Results → CTA, manejadas con Zustand. La ciudad SVG por capas es el avatar central de personalización (NO se reemplaza por metáfora huevo→águila — decisión ya tomada en `09_UI_RADICAL_INTEGRATION.md` §6).
- **Dependencias:** T-I5 🔄
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - 4 pantallas navegables sin pérdida de estado Zustand
  - Ciudad SVG renderiza según perfil/nivel; morph animado en level-up
  - Onboarding de 5 pasos con recompensa visual por paso; datos prohibidos ausentes

### T-III2: Calculation Engine
- **ID:** T-III2
- **Descripción:** Motor de cálculo que produce un estimado de premium/protección para el usuario, con capa de niveles 1-5 (misiones, +150 XP por misión, +50 XP reto diario, +100 XP bonus racha 7 días) y check de compliance vía grep automatizado sobre el contenido generado dinámicamente.
- **Dependencias:** T-III1
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Fórmulas de cálculo verificadas con valores de prueba documentados (test unitario)
  - Level-up ceremony solo dispara con misión 3/3 completa
  - Grep compliance corre sobre outputs de texto generado (nombres/copys dinámicos), no solo contenido estático

### T-III3: Wompi Payment Integration
- **ID:** T-III3
- **Descripción:** Cobro de $5 pago único (sin suscripción, sin trial — decisión AP confirmada) vía Wompi. Webhook de confirmación, pantallas success/failure, evento Pixel `InitiateCheckout` al tap "EMPEZAR POR $5" y `Purchase` al confirmar pago.
- **Dependencias:** T-III2
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Checkout mock funcional solo en dev; Wompi real en staging/producción
  - Webhook idempotente (no duplica `Purchase` en reintentos)
  - Perfil BPA creado con `lead_id` correcto y avatar A/B determinista tras pago confirmado

## Hito IV: BOF Calendly

### T-IV1: Calendly Iframe
- **ID:** T-IV1
- **Descripción:** Embed de Calendly con pre-fill de datos del lead (nombre, email desde Supabase), sincronización CRM Supabase↔Calendly vía `/api/webhooks/calendly` → tabla `call_bookings` + eventos. Fila de trust signals sobre el embed y CTA sticky inferior (aparece tras scroll pasado el hero).
- **Dependencias:** T-II2 ⬜, T-III3 ⬜
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Pre-fill correcto probado con cada combinación de envs disponibles
  - Webhook registra `call_bookings` y dispara evento `Schedule` (Pixel) server-side
  - Cadena Calendly→WhatsApp→form probada end-to-end

### T-IV2: Advisory Call Follow-up Automation
- **ID:** T-IV2
- **Descripción:** Secuencia de emails de seguimiento post-agendamiento. **Regla de compliance crítica: disclosure de IUL/annuity SOLO puede ocurrir en llamada viva con asesor humano, NUNCA en ninguna superficie digital** (email, PDF, app, web). Los scripts de llamada son la única excepción whitelisteada al grep de compliance (T-V1).
- **Dependencias:** T-IV1
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Fable+Sonnet
- **Verificación:**
  - Grep de compliance confirma cero menciones de IUL/annuity/insurance fuera de la whitelist de scripts de llamada
  - Secuencia de email no contiene vocabulario prohibido (`\bIA\b`, "perdiste", promesas de resultado económico, etc.)
  - Test manual: booking confirmado dispara secuencia correcta según flag de envs

## Hito V: Compliance & Deployment

### T-V1: Compliance Grep Check (build-breaking)
- **ID:** T-V1
- **Descripción:** Script CI que falla el build si `src/content/**` o componentes contienen patrones prohibidos: `seguro(?! Social)`, IUL, póliza, anualidad, prima, insurance, WFG, WSB, "inteligencia artificial", `\bIA\b`, `\bAI\b`, "perdiste", patrones de promesa económica (`gan(a|ar\w*).{0,15}\$`), `asesor.{0,10}(IA|AI)`. Exención documentada única: "Seguro Social". Whitelist explícita solo para scripts de llamada humana (T-IV2).
- **Dependencias:** todos los anteriores (T-I0 a T-IV2)
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Codex
- **Verificación:**
  - Script corre en CI y rompe el build ante cualquier coincidencia no whitelisteada
  - Whitelist de scripts de llamada documentada y auditada explícitamente (no implícita)
  - Corrida completa sobre `src/content/**` y componentes sin falsos negativos conocidos

### T-V2: Meta Pixel + GA4 Tracking
- **ID:** T-V2
- **Descripción:** Implementación completa del wrapper `track(event, payload)` (dispara `fbq`+`gtag` si hay IDs configurados, si no `console.log` con prefijo `[track]`) y los 10 eventos obligatorios del mapa de `07_MASTER_CHECKLIST_CODEX.md` F0.4: `Lead`, `GameStart`, `QuizComplete`, `CTAClick`, `GuideUnlocked`, `GuideComplete`, `InitiateCheckout`, `Purchase`, `Level5`, `Schedule`. Cada evento Pixel tiene su gemelo GA4 en snake_case. Un disparo por ocurrencia, nunca en re-render.
- **Dependencias:** T-I1 🔄, T-II2 ⬜, T-III3 ⬜, T-IV1 ⬜
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Sonnet
- **Verificación:**
  - Sin IDs configurados: consola muestra los 10 eventos con prefijo `[track]`
  - Con IDs de prueba: hits visibles en Meta Pixel Helper y GA4 DebugView, verificados uno a uno
  - Auditoría de eventos: cada evento dispara una y solo una vez, payload documentado en `blueprint/EVENTS.md` generado

### T-V3: Vercel Deployment
- **ID:** T-V3
- **Descripción:** Deploy a Vercel con ambientes preview + staging + production. Dominio custom pendiente de definición por AP.
- **Dependencias:** T-V1 ⬜, T-V2 ⬜
- **Estado:** ⬜ Por hacer
- **Modelo recomendado:** Codex
- **Verificación:**
  - Preview deploy funcional en cada PR
  - Staging refleja producción con envs de prueba (Pixel/GA4 test IDs)
  - Production deploy sin errores de build; Lighthouse mobile en `/`, `/juego`, `/guia/1`: LCP <2.5s, CLS <0.1

---

## Ruta crítica

```
T-I0 → T-I1 → T-I4 → T-I5 → T-II2 → T-III3 → T-IV1 → T-V3
```

Esta cadena representa el camino mínimo para llegar de "design system" a "producción desplegada" pasando por TOF completo, guía desbloqueada, pago BPA confirmado y llamada agendada. Los tickets fuera de esta cadena (T-I2, T-I3, T-II1, T-III1, T-III2, T-IV2, T-V1, T-V2) son insumos o gates de calidad que deben resolverse en paralelo pero no son el cuello de botella secuencial estricto.

## Invariantes del proyecto (no negociables)

- **Compliance crítica:** los términos IUL, annuity/anualidad, insurance/seguro (excepto "Seguro Social"), póliza, prima, WFG, WSB nunca deben aparecer en superficies digitales (web, app, PDF, email). Su disclosure solo ocurre en llamada viva con un asesor humano (ver T-IV2, T-V1).
- **Governance de 3 checkpoints:** Fable define estrategia/contenido → Sonnet valida e implementa → Codex ejecuta tareas mecánicas/CI/deploy siguiendo orden estricto sin decidir secuencia ni diseño (ver `07_MASTER_CHECKLIST_CODEX.md` encabezado: "Codex NO decide secuencia ni diseño. Ante ambigüedad: PREGUNTA, no inventes").
- **Módulos AP-owned:** PDF Guide (Hito II) y BPA $5 Mini-App (Hito III) son propiedad y responsabilidad directa de AP — cualquier cambio de alcance en esos hitos debe confirmarse con AP antes de ejecutar.
- **Autoridad de diseño:** `09_UI_RADICAL_INTEGRATION.md` manda sobre `01_DESIGN_SYSTEM.md` y sobre las pantallas de docs 02-06 donde haya conflicto. Todo lo no mencionado en 09 queda como estaba en el doc original.
- **State tokens CA.json / swap H1↔H2:** el contenido de preguntas y textos regionales se carga vía tokens de estado (`src/data/states/CA.json` como primer estado soportado); el swap entre pool H1 ("100 Millonarios Dicen") y H2 ("Latinos en USA") debe funcionar sin romper la máquina de estados del juego ni el sorteo de preguntas.
