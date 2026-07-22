# FIRE PASS™ — DESIGN SYSTEM v1.0
**Fecha:** 2026-07-06 · **Autor:** Fable (sesión blueprint) · **Consumidor:** Codex
**Regla:** Este documento es ley. Codex NO toma decisiones de diseño. Si algo no está aquí, se pregunta antes de inventar.

> ⚠️ **v2 (2026-07-08):** `09_UI_RADICAL_INTEGRATION.md` MANDA sobre este doc en §1 (paleta → v2 con gradientes), §4 (overrides Button/Input/AnswerCard + componentes nuevos ProgressDots/Toast/XPFloat) y recoloreo de §5. Todo lo demás de este doc sigue vigente. Leer AMBOS.

Estética global: **Duolingo × Candy Crush × Univision Prime Time.** Colorido, cálido, celebratorio. NUNCA corporativo, NUNCA banco, NUNCA clínico. Mobile-first en toda decisión.

---

## 1. TOKENS DE COLOR

Definir en `tailwind.config` / CSS vars. Nombres exactos:

| Token | Hex | Uso permitido | Uso PROHIBIDO |
|---|---|---|---|
| `gold` (Primary Gold) | `#F5A623` | CTAs primarios, victorias, logros, highlights, badges | Texto body, fondos grandes |
| `gold-hover` | `#E09612` | Estado hover/active de CTAs gold | — |
| `teal` (Secondary Teal) | `#00BFA5` | Progreso, estados positivos, level-ups, CTAs secundarios | Alertas |
| `teal-hover` | `#00A88F` | Hover de teal | — |
| `coral` (Accent Coral) | `#FF5252` | Urgencia, countdown timers, alertas importantes | CTAs de conversión, éxito |
| `navy` (Deep Navy) | `#1A1A2E` | Fondo TOF completo, pantallas oscuras | Texto sobre fondos oscuros |
| `navy-800` | `#232342` | Cards/paneles elevados sobre navy | — |
| `cream` (Warm Cream) | `#FFF8F0` | Fondo Guía (Stage 2), pantallas claras | Fondo TOF |
| `success` (Success Green) | `#4CAF50` | Respuestas correctas, hábitos completados | CTAs |
| `ink` (Neutral Dark) | `#1C1C1C` | Texto body sobre fondos claros | Texto sobre navy |
| `white` | `#FFFFFF` | Texto sobre fondos oscuros, fondos de card claros | — |

Derivados permitidos (únicos):
- `white/70` — texto secundario sobre navy
- `white/10` — bordes y separadores sobre navy
- `ink/60` — texto secundario sobre claro
- Gradiente hero TOF: `linear-gradient(180deg, #232342 0%, #1A1A2E 60%)`
- Glow CTA gold: `box-shadow: 0 0 24px rgba(245,166,35,0.35)`
- Overlay modal: `rgba(26,26,46,0.75)`

Contraste verificado (WCAG AA):
- `white` sobre `navy` ✓ · `ink` sobre `cream` ✓ · `navy` sobre `gold` ✓ (texto de botón gold = navy, NUNCA white)
- `white` sobre `teal` solo en ≥18px bold; texto normal sobre teal usa `navy`.

## 2. TIPOGRAFÍA

Fuentes vía `next/font/google` (self-hosted automático):
- **Display/Headlines:** Nunito, pesos 700, 800, 900 (Black para H1)
- **Body/UI:** Inter, pesos 400, 500, 600
- **Números/Stats/Timer:** Nunito 700/800 con `font-variant-numeric: tabular-nums`

Escala (mobile base; rem sobre 16px):

| Rol | Tamaño | Peso | Line-height | Clase sugerida |
|---|---|---|---|---|
| H1 hero | 32px / 2rem | Nunito 900 | 1.15 | `text-[2rem] font-black leading-tight` |
| H2 sección | 24px / 1.5rem | Nunito 800 | 1.2 | |
| H3 / pregunta del juego | 22px / 1.375rem | Nunito 800 | 1.3 | |
| Body | 16px / 1rem | Inter 400 | 1.5 | mínimo absoluto body: 16px |
| Body strong | 16px | Inter 600 | 1.5 | |
| Label / input | 16px | Inter 500 | 1.4 | 16px evita zoom iOS en inputs |
| Small / helper | 14px | Inter 400 | 1.4 | |
| Microcopy / legal | 12px | Inter 400 | 1.4 | |
| Timer grande | 40px | Nunito 800 tabular | 1 | |
| Stat/score | 48px | Nunito 900 tabular | 1 | |

Reglas: headlines siempre Nunito, nunca Inter. Sin ALL-CAPS en body; permitido en botones y eyebrows (≤3 palabras, `tracking-wide`). Español primero; strings en `src/content/es.json`, cero strings hardcodeados en componentes.

## 3. ESPACIADO, RADIOS, SOMBRAS, LAYOUT

**Escala espaciado (base 4px):** usar solo 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Padding horizontal de pantalla: `px-6` (24px)
- Gap entre secciones de pantalla: 32px
- Gap entre elementos de formulario: 16px
- Gap entre opciones de respuesta: 12px

**Layout:**
- Contenedor: `max-w-[480px] mx-auto min-h-dvh flex flex-col` — centrado en desktop, columna única siempre
- Diseño target: iPhone 14 (390px). Sin scroll horizontal jamás.
- Safe areas: `pb-[env(safe-area-inset-bottom)]` en contenedores con CTA inferior
- CTA principal: cuando la pantalla lo permita, anclado zona inferior (thumb zone)

**Radios:**
- Botones: `rounded-2xl` (16px)
- Cards / opciones de respuesta: `rounded-2xl`
- Inputs: `rounded-xl` (12px)
- Modales / sheets: `rounded-3xl` (24px) solo esquinas superiores si es bottom-sheet
- Badges/pills: `rounded-full`

**Sombras:**
- Card sobre claro: `shadow-md`
- CTA gold: glow (ver tokens) + `shadow-lg`
- Sobre navy: elevación por color (`navy-800`) + borde `white/10`, NO sombras negras

## 4. COMPONENTES BASE

Todos en `src/components/ui/`. Props tipadas, variantes con literales.

### 4.1 Button
Variantes: `primary` (gold), `secondary` (teal), `outline` (borde white/30 sobre navy), `ghost`.
- Tamaño único `lg`: `h-14` (56px) mínimo, `w-full` en mobile, `px-8 text-lg font-extrabold` (Nunito), texto navy en gold/teal, white en outline/ghost
- Estados: hover `*-hover` + scale 1.05; tap `whileTap={{scale:0.97}}`; disabled `opacity-40 pointer-events-none`; loading = spinner + texto se mantiene (no layout shift)
- Touch target mínimo 48×48 en TODO elemento interactivo

### 4.2 Input (text/email/tel)
- `h-14 rounded-xl px-4 text-base` (16px), fondo `white`, texto `ink`
- Sobre navy: fondo `white`, no translúcido (legibilidad + autofill)
- Border: `border-2 border-transparent`; focus: `border-teal` + ring `teal/30`; error: `border-coral` + mensaje 14px coral debajo con icono ⚠, nunca solo color
- Label encima, 16px Inter 500, `white` sobre navy
- Placeholder `ink/40`. Autocomplete: `name`, `email` correctos.

### 4.3 AnswerCard (opciones del juego)
- `min-h-[64px] w-full rounded-2xl px-5 py-4 text-left` fondo `navy-800` borde `white/10`, texto white 17px Inter 600
- Letra de opción (A/B/C/D) en pill `white/10` 32px a la izquierda
- Tap: scale 0.97 + borde `gold` 150ms (feedback de selección SIN revelar correcto/incorrecto — regla de negocio)
- Deshabilitadas tras seleccionar. Estado eliminada (50/50): `opacity-30` + strike-through, no desaparece (evita layout shift)

### 4.4 Timer (countdown 20s)
- Pill superior derecha: número Nunito 800 tabular 24px + anillo SVG circular de progreso 44px
- Color por tiempo restante: >10s `teal` → 6–10s `gold` → ≤5s `coral` + pulso (scale 1→1.08, 0.5s loop) + haptic si disponible (`navigator.vibrate(50)`)
- Transición de color animada, no salto

### 4.5 LifelineButton
- 2 unidades: `50/50` y `Pista` (icono + label 12px)
- Pill `rounded-full h-12 px-4` borde `white/20`, icono 20px
- Usada: `opacity-30` + check, disabled. Máx 1 uso c/u por sesión.

### 4.6 Badge (logros Guía/BPA)
- Círculo 64px gradiente gold, icono emoji/svg centrado, nombre debajo 12px
- Entrada: cae desde arriba con bounce (spring, ver §5)
- Bloqueado: silueta `white/10` + candado

### 4.7 CountdownBanner (urgencia 72h)
- Barra sticky top: fondo `coral` texto white 14px Inter 600, `⏳ Tu acceso expira en 71:23:45` (HH:MM:SS tabular)
- Altura 40px. Solo en Guía y pantalla 6 TOF.

### 4.8 SocialProofPill
- Pill `white/10` texto 14px: `🔥 {n} personas jugando en este momento`
- Modo `simulated`: n = base horaria (tabla fija 24 valores, rango 23–87) + jitter ±3 cada 8–15s con animación count-up. Flag env `NEXT_PUBLIC_SOCIAL_PROOF_MODE`.

### 4.9 CharacterSlot (avatar)
- Contenedor de personaje con estados de expresión (ver §6). Posición regla global: esquina inferior o panel lateral, NUNCA tapando contenido ni CTA.
- Tamaños: `hero` 280px alto (Screen 1), `game` 96px (esquina inferior-izquierda), `reaction` 160px (overlays de resultado)

## 5. MICRO-ANIMACIONES (Framer Motion — specs exactas)

Easing estándar: `[0.22, 1, 0.36, 1]` (easeOutExpo-like). Spring celebración: `{type:'spring', stiffness:260, damping:18}`.

| Evento | Animación | Duración |
|---|---|---|
| Transición de pantalla | slide-in horizontal: entra `x:40→0, opacity:0→1`; sale `x:-40, opacity:0` | 300ms |
| Respuesta seleccionada | scale 0.97 + borde gold | 150ms |
| Respuesta correcta (solo Guía/BPA, NUNCA en quiz TOF) | pulso verde + burst 12 partículas gold | 600ms |
| Badge desbloqueado | cae desde `y:-120` con spring bounce + burst | spring |
| Level up (BPA) | morph de ciudad: crossfade + scale 1.06→1 | 800ms |
| CTA idle (solo CTA primario de conversión) | glow pulsante `shadow 0.35→0.55` | 2s loop |
| Hover/tap botón | scale 1.05 / 0.97 | 120ms |
| Timer ≤5s | pulso scale 1→1.08 | 0.5s loop |
| Confetti WIN | `canvas-confetti`: 2 bursts (izq/der) 90 partículas, colores gold/teal/coral/white | al montar |
| Loading | Charlie/Gloria idle animado (asset loop) + texto rotativo entretenido | — |
| Error | personaje expresión empática + shake suave del form `x:[0,-8,8,-4,0]` | 400ms |
| Count-up de números | animate value con tabular-nums | 800ms |

Regla: `prefers-reduced-motion` → desactivar loops y confetti, mantener fades.

## 6. SISTEMA DE AVATARES

Universo visual único: **Pixar 3D**, mismo render, misma luz cálida de estudio, mismo nivel de estilización en los tres. Formato assets: PNG/WebP fondo transparente, 2x (retina), o video WebM alpha para loops. Nomenclatura: `/public/characters/{nombre}/{estado}.webp`.

### CHARLIE (TOF — host)
Latino, piel morena cálida, traje elegante azul oscuro con pañuelo gold en bolsillo, sonrisa icónica, cara MUY expresiva, micrófono en mano. Energía Steve Harvey: carismático, cálido, cómplice, NUNCA cruel.
Estados requeridos (8): `hero` (pose presentador brazos abiertos), `welcome` (señala al usuario), `idle` (loop sutil), `correct` (aplaude/señala "¡eso es!"), `wrong` (mano al pecho, "ay no…" empático), `lifeline` (guiño cómplice), `tension` (mira reloj, tenso), `win` (celebración total), `loss` (postura de abrazo, esperanzador).

### GLORIA (Guía + BPA opción A)
Latina, elegante blazer coral/crema, sonrisa cálida segura, glamorosa pero cercana — aspiracional, no hipersexualizada. Energía Gloria Pritchett × Anne Hathaway.
Estados (6): `guide` (presenta capítulo), `cheer` (celebra micro-win), `nudge` (te extraña — retención), `explain` (gesto didáctico), `proud` (badge), `invite` (CTA a BPA/llamada).

### GEORGE (BPA opción B — A/B test)
Hombre ~50s, canoso distinguido, lujo casual (camisa cuello abierto, reloj), mentor confiable. Energía George Clooney.
Estados (6): mismos roles que Gloria.

Prompts de generación (semilla, para el pipeline de assets — herramienta a definir por AP):
> "Pixar-style 3D character, warm studio lighting, [descripción], upper body, transparent background, expressive face, high detail, consistent character sheet"

Regla A/B: BPA renderiza `NEXT_PUBLIC_BPA_AVATAR=gloria|george`; asignación 50/50 por hash de user id, persistida en perfil.

## 7. REGLAS UX MOBILE (checklist dura)

- Touch target ≥48×48px; botones full-width `h-14` (56px)
- Columna única; sin scroll horizontal; contenido crítico above the fold en 390×844
- Inputs 16px (no zoom iOS); teclados correctos (`inputmode="email"`, `type="tel"`)
- Navegación: gestos swipe (Guía) o CTAs inferiores; sin header-nav
- Personajes nunca bloquean contenido ni CTAs
- Estados vacíos/carga/error SIEMPRE diseñados (personaje + copy, ver §5)
- Focus visible en todo interactivo (ring teal) — accesible con teclado
- Un solo CTA primario (gold) por pantalla; el resto secundarios

## 8. URGENCIA Y ESCASEZ (dónde va cada mecanismo)

| Mecanismo | Pantalla | Componente |
|---|---|---|
| "X personas jugando en este momento" | TOF Screen 1 | SocialProofPill |
| "Más de X,XXX latinos ya lo descubrieron" | TOF Screen 1 | contador count-up |
| Timer 20s por pregunta | TOF Screen 3 | Timer |
| "Tu guía expira en 72h" + countdown | TOF Screen 6 + header Guía | CountdownBanner |
| Nudge 48h "te quedan 24 horas" | Guía (push/in-app) | Gloria `nudge` |
| Daily challenge timer | BPA | Timer variante |
| "Solo X sesiones esta semana" | BOF landing | SocialProofPill variante coral |
| Zeigarnik: siguiente capítulo/nivel visible pero bloqueado | Guía + BPA | Card `locked` con candado + preview borroso |

## 9. COMPLIANCE (repetir en cada doc)

PROHIBIDO en cualquier UI/copy: seguro, IUL, anualidad, seguro de vida, póliza, prima, insurance. La llamada BOF se enmarca SOLO como "sesión estratégica gratuita con un experto financiero certificado". Footer legal en BOF: asesor licenciado, contenido educativo, no es consejo de inversión.
