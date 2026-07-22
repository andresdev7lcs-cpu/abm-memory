# MASTER CHECKLIST PARA CODEX — ORDEN SECUENCIAL ESTRICTO
**Fecha:** 2026-07-06 · Codex NO decide secuencia ni diseño. Ejecuta tarea por tarea, marca ✅ solo si cumple criterios. Ante ambigüedad: PREGUNTA, no inventes.
**Base de código:** `proyectos/100lat-firepass/` (Build A Next.js existente — se migra encima). Pool de preguntas A/B/C de Build B (`PVSC_App/fire-pass` en USB) se importa en F2.3.
**Stack:** Next.js 15 App Router (downgrade desde 16 NO requerido si 16 ya instalado — usar lo instalado; App Router obligatorio) · Tailwind 4 · Zustand · Framer Motion · canvas-confetti · Supabase JS.

Convención: cada tarea lista **Archivos → Input → Output → ✅ Criterios**.

---

## FASE 0 — FUNDACIONES

**0.1 Variables de entorno**
Archivos: `.env.local.example`, `src/lib/env.ts`
Input: lista de envs del blueprint (SUPABASE_URL/ANON_KEY, META_PIXEL_ID, GA4_ID, CALENDLY_URL, N8N_WEBHOOK_URL, PAYMENT vars, DEFAULT_STATE=CA, SOCIAL_PROOF_MODE, SHARE_ENABLED, WEEKLY_SLOTS, BPA vars)
Output: `env.ts` con lectura tipada + helper `isConfigured(key)`
✅ App compila sin ninguna env definida; features pendientes degradan según sus specs (no crashean)

**0.2 Design tokens**
Archivos: `src/app/globals.css`, config Tailwind
Input: `01_DESIGN_SYSTEM.md` §2–3 + **paleta v2, gradientes y sombras de color de `09_UI_RADICAL_INTEGRATION.md` §1** (09 manda sobre 01 §1)
Output: tokens de color con nombres exactos, 5 gradientes oficiales como CSS vars, fuentes Nunito+Inter vía `next/font`, escala tipográfica, radios
✅ Página de prueba `/dev/tokens` (solo dev) muestra todos los tokens, gradientes y sombras de color; nombres coinciden 1:1 con el doc

**0.3 Contenido centralizado**
Archivos: `src/content/es.json`, `src/lib/t.ts`
Input: bloques de copy de docs 02, 03, 06
Output: helper `t('home.cta')` con interpolación `{name}` y soporte `<gold>`
✅ Grep: cero strings de UI hardcodeados en componentes

**0.4 Wrapper de tracking**
Archivos: `src/lib/tracking.ts` (adaptar el de Build B), `src/app/layout.tsx`
Input: tabla de eventos docs 02–06; envs Pixel/GA4
Output: `track(event, payload)` que dispara fbq+gtag si hay IDs, si no console.log con prefijo `[track]`

**Mapa de eventos Meta Pixel (obligatorio, exacto — `PageView` automático en todas las rutas no cuenta):**

| # | Evento Pixel | Tipo | Pantalla / trigger | Payload |
|---|---|---|---|---|
| 1 | `Lead` | estándar | TOF Screen 1 — submit válido del form | `{content_name:'tof_entry'}` |
| 2 | `GameStart` | custom | Screen 2 — tap "ESTOY LISTO" | — |
| 3 | `QuizComplete` | custom | fin de Q10 | `{score, segment, variant}` |
| 4 | `CTAClick` | custom | Screens 4/5 — tap CTA guía | `{result:'win'\|'loss'}` |
| 5 | `GuideUnlocked` | custom | Screen 6 — unlock exitoso | — |
| 6 | `GuideComplete` | custom | capítulo 7 completado | — |
| 7 | `InitiateCheckout` | estándar | `/bpa` — tap "EMPEZAR POR $5" | `{value:5, currency:'USD'}` |
| 8 | `Purchase` | estándar | pago confirmado | `{value:5, currency:'USD'}` |
| 9 | `Level5` | custom | nivel 5 BPA alcanzado | — |
| 10 | `Schedule` | estándar | `call_booked` (server-side vía webhook Calendly) | — |

Cada evento Pixel tiene su gemelo GA4 (nombres snake_case ya definidos en docs 02–06). Un disparo por ocurrencia, nunca en re-render.
✅ Sin IDs: consola muestra eventos; con IDs de prueba: hits visibles en Pixel Helper/GA4 DebugView; los 10 eventos de la tabla verificados uno a uno

**0.5 Cliente Supabase server/client + migración SQL**
Archivos: `src/lib/supabase/{client,server}.ts`, `supabase/migrations/001_blueprint.sql`
Input: `supabase/schema.sql` existente + ALTERs de docs 02/03 + tablas docs 04/05/06 (guide_progress, bpa_profiles, bpa_events, feedback, call_bookings) + RLS especificadas + **columnas UTM en `leads`:**
```sql
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT;
```
Output: migración única idempotente (IF NOT EXISTS en todo)
✅ Corre 2 veces seguidas sin error en proyecto Supabase limpio [SUPABASE_PENDING: validar en local con supabase CLI o dejar lista]

## FASE 1 — COMPONENTES UI (todos contra `01_DESIGN_SYSTEM.md` §4–5; página `/dev/ui` los exhibe)

**1.1** Button (4 variantes + estados — overrides gradiente de 09 §2) · **1.2** Input (+error/focus, borde gradiente 09 §2) · **1.3** AnswerCard (+eliminada 50/50; hover lift 09 §2; PROHIBIDO estados verde/rojo) · **1.4** Timer (anillo SVG + colores sky→gold→coral + pulso ≤5s) · **1.5** LifelineButton · **1.6** Badge (+locked) · **1.7** CountdownBanner (HH:MM:SS tabular) · **1.8** SocialProofPill (modo simulated con tabla horaria+jitter) · **1.9** CharacterSlot (3 tamaños; **placeholder = emoji gigante según 09 §3**, swap interno a Pixar sin cambiar API) · **1.10** ProgressDots (09 §2 — un solo color de relleno, jamás marca correctitud) · **1.11** Toast (success/error gradiente, 09 §2) · **1.12** XPFloat (+contador animado; solo Guía/BPA)
✅ Cada uno: visible en `/dev/ui` en todos sus estados; touch targets ≥48px; `prefers-reduced-motion` respetado; texto sobre gradientes cumple AA (navy/ink sobre fire/gold, white sobre royal)

## FASE 2 — TOF

**2.1 Screen 1 Home** — spec completa `02_TOF_SCREEN1_HOME.md`. Incluye: form+validación+honeypot, upsert lead, `/api/notify` (n8n server-side), secuencia bienvenida, retorno con prefill. **Captura UTM:** al montar `/`, leer `utm_source|medium|campaign|content` de los URL params y persistir en `sessionStorage.fp_utm`; al submit, incluirlos en el upsert del lead (columnas de F0.5). Sobrevive navegación interna; visita sin UTMs no sobreescribe valores ya capturados en la sesión.
✅ = los 10 criterios del doc 02 §7 + lead insertado con UTMs correctos al llegar con `?utm_source=fb&utm_medium=cpc&utm_campaign=test&utm_content=v1`
**2.2 Screen 2 Instructions** — doc 03. ✅ 3 bullets stagger, guard sin nombre→`/`, prefetch juego
**2.3 Pool de preguntas** — importar `questions_pool.json` de Build B; completar hasta 50 con schema doc 03 §3.1 (redactar faltantes siguiendo temas y tono; contexto California con tokens); crear `src/data/states/CA.json`
✅ 50 preguntas válidas contra schema (script de validación `scripts/validate_pool.ts`); distribución niveles ≥15/≥20/≥15; cero vocabulario prohibido
**2.4 Motor de juego** — máquina de estados doc 03 §3.3, sorteo §3.2, comodines §3.4, timer, reacciones Charlie
✅ criterios juego del doc 03; test unitario del sorteo (distribución 3/4/3, sin repetidos)
**2.5 Resultados WIN/LOSS** — doc 03 screens 4–5; corregir `getSegment()` a 0–4/5–7/8–10; update lead con score
✅ score ≤8 → LOSS sin score visible; ≥9 → WIN con confetti y score; segment correcto en DB
**2.6 Guide unlock** — doc 03 screen 6: `/api/guide/unlock`, cookie httpOnly, COALESCE 72h
✅ criterios doc 03 (re-visita no reinicia, expiración server-side testeada con timestamp manipulado en DB)
**2.7 Share P1** — doc 03 screen 7 tras flag. ✅ flag off = invisible; on = wa.me con ref
**2.8 Imágenes OG (3 rutas)** — `opengraph-image.tsx` con ImageResponse de `next/og`:
Archivos: `src/app/opengraph-image.tsx` (TOF), `src/app/guia/opengraph-image.tsx`, `src/app/bpa/opengraph-image.tsx`
Input: tokens F0.2, assets de personaje (placeholder silueta hasta `[CHARACTER_ASSETS_PENDING]`)
Output — spec común: **1200×630**, fondo gradiente navy (§1 DS), headline Nunito 900 white máx 2 líneas alineada a la izquierda ocupando ~60% del ancho, personaje a la DERECHA ocupando ~35% del ancho anclado al borde inferior (nunca recortado por arriba), wordmark "FIRE PASS™" 24px gold esquina inferior izquierda.
- TOF: Charlie `hero` + "¿Sabes lo que saben 100 latinos en USA?" ("100 latinos" en gold)
- Guía: Gloria `guide` + "La guía de dinero que se lee como chisme" — fondo cream, texto ink, wordmark navy
- BPA: ciudad-avatar + "Construye tu mapa financiero jugando" — fondo navy
✅ Las 3 rutas sirven imagen 1200×630 <300KB; validadas en opengraph.xyz o debugger de Meta; texto legible a 400px de ancho; metadata `title`/`description` por ruta coherente con la imagen

## FASE 3 — GUÍA (doc 04)

**3.1 Guardia + layout** `/guia/**` server-side + `/guia/expirada` ✅ imposible acceso sin cookie válida
**3.2 Player de cards** + barra segmentos + gestos ✅ interactivas bloquean avance
**3.3 Tipos de card** (9 componentes §4) ✅ todos en `/dev/ui`
**3.4 Contenido cap 1–7** — `src/content/guide/cap{1..7}.json` según beats §5 (redactar con tono especificado, reframes obligatorios, copys exactos marcados)
✅ script grep compliance pasa; cada capítulo 8–12 cards; cards clave con copy exacto verbatim
**3.5 Progreso + badges + índice Zeigarnik** ✅ retoma card exacta; preview borroso siguiente capítulo
**3.6 Calculadoras** (fórmulas §5) ✅ valores de prueba documentados en test unitario
**3.7 Cap 7 → CTA BPA** ✅ evento `bpa_cta_click`

## FASE 4 — BPA (doc 05)

**4.1 Landing $5 + checkout mock** ✅ mock solo dev; Pixel Purchase en confirm
**4.2 Supabase Auth** (magic link) + vínculo lead ✅ perfil creado con `lead_id` correcto y avatar A/B determinista
**4.3 Onboarding 5 pasos** ✅ recompensa visual por paso; datos prohibidos ausentes
**4.4 Ciudad SVG por capas** + estados placeholder ✅ render según perfil/nivel; morph en level-up
**4.5 Misiones niveles 1–5** (contenido según tabla §5; reutiliza cards de Guía) ✅ level-up solo con 3/3
**4.6 Retos diarios + racha** (`bpa_daily.json` 30 retos) ✅ reset medianoche local
**4.7 Nivel 5 → secuencia invitación** ✅ copy exacto 3 beats; banner persistente si pospone
**4.8 Niveles 6–10** (P1 — puede diferirse post-lanzamiento) ✅ flag
**4.9 Feedback 1/30** ✅ criterio doc 05 §7

## FASE 5 — BOF (doc 06)

**5.1 Landing completa** ✅ criterios doc 06 §6
**5.2 Cadena Calendly→WhatsApp→form** ✅ probada con cada combinación de envs
**5.3 `/api/webhooks/calendly`** → `call_bookings` + eventos ✅ [CALENDLY_PENDING]

## FASE 6 — QA TRANSVERSAL (gate de "hecho")

**6.1 Compliance grep CI:** script que falla el build si `src/content/**` o componentes contienen: `seguro(?! Social)`, IUL, póliza, anualidad, prima, insurance, WFG, WSB, "inteligencia artificial", `\bIA\b`, `\bAI\b`, "perdiste", o patrones de promesa económica (`gan(a|ar\w*).{0,15}\$`). Exención documentada: "Seguro Social". ✅ en CI
**6.2 Auditoría de eventos:** tabla Layer 1 del blueprint completa — cada evento dispara una y solo una vez, payload documentado en `blueprint/EVENTS.md` generado. ✅ checklist manual firmada
**6.3 Mobile QA 390×844:** todas las pantallas sin scroll horizontal, CTAs visibles, targets ≥48px. ✅ capturas en `blueprint/qa/`
**6.4 Lighthouse mobile** rutas `/`, `/juego`, `/guia/1`: LCP <2.5s, CLS <0.1. ✅ reporte adjunto
**6.5 Flujo E2E manual:** lead → juego → loss → guía cap 1–7 → BPA pago mock → nivel 5 → landing llamada. Grabar video. ✅ sin errores de consola

## PLACEHOLDERS ACTIVOS (no bloquean ninguna tarea)

`[SUPABASE_PENDING]` proyecto nuevo — crea AP · `[PIXEL_PENDING]` · `[GA4_PENDING]` · `[CALENDLY_PENDING]` · `[PAYMENT_PENDING]` Stripe/Wompi · `[WHATSAPP_PENDING]` · `[ADVISOR_PHOTO_PENDING]` · `[CHARACTER_ASSETS_PENDING]` Charlie/Gloria/George (prompts semilla en DS §6) · `[CITY_ASSETS_PENDING]`

## FUERA DE SCOPE DE CODEX (lo hace Claude Code)

Deploy Vercel · creación proyecto Supabase + correr migración · workflows n8n (new_lead→Telegram, nudge 48h guía, tamagotchi BPA, webhook Calendly) · credenciales · configuración Pixel/GA4 en las plataformas.
