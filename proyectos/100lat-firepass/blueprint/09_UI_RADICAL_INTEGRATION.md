# 09 — INTEGRACIÓN "UI RADICAL" (Candy Crush × Millonario)
**Fecha:** 2026-07-08 · **Precedencia:** este doc MANDA sobre `01_DESIGN_SYSTEM.md` §1/§4/§5 y sobre pantallas de docs 02–06 donde choquen. Todo lo no mencionado aquí queda como estaba.
**Decisiones AP 2026-07-08:** BPA = **$5 pago único** (sin suscripción) · Resultado = **LOSS gamificado** (WIN sigue ≥9/10) · Leaderboard = **P1 solo con datos reales**.

---

## 0. TRIAGE REGISTRADO (qué entró y qué no)

**ADOPTADO:** paleta v2 con gradientes, radios 20–32px, bordes 3px, sombras de color, shine, toasts, +XP flotante, celebraciones bounce/scale, Candy Crush selector en Guía, microcopy energético, emojis gigantes como assets interinos, XP system BPA, sound design (P1), trust signals BOF, sticky CTA BOF.

**RECHAZADO — compliance (no negociable):** mención "IA" en BPA (queda "Tu Agente Financiero Personal") · testimonios con cifras de ingreso/inversión (quedan los 3 de doc 06) · cita Kiyosaki.

**RECHAZADO — motor de conversión:** score visible durante quiz · verde/rojo + revelar correcta por pregunta · gate de guía por respuestas perfectas (guía es para TODOS los leads) · 7 preguntas (quedan 10) · trivia técnica tipo "¿qué es un 401k?" (pool cultural ya validado) · pista gratis (Pista = comodín) · everyone-wins · leaderboard simulado · reader de guía con scroll largo (queda modelo cards/reel) · huevo→águila reemplazando la ciudad BPA (la ciudad ES la personalización; ver §6).

## 1. PALETA v2 (reemplaza §1 de 01_DESIGN_SYSTEM)

| Token | Hex | Uso |
|---|---|---|
| `fire` | `#FF6B35` | Primario de energía, gradiente CTA, level complete |
| `fire-light` | `#FFB627` | Hover, borde de CTA |
| `fire-dark` | `#D94520` | Active/pressed |
| `royal` | `#6C3FA0` | Headers, bordes de cards, fondos de sección |
| `royal-light` | `#8B5FBF` | Acciones secundarias |
| `royal-dark` | `#4A2961` | Fondos profundos |
| `gold` | `#FFD700` | Score, XP, badges, monedas (sustituye #F5A623 en todos los docs) |
| `gold-shine` | `#FFF44F` | Efecto shine |
| `gold-dark` | `#DAA520` | Sombras de gold |
| `magenta` | `#FF006E` | Acentos, CTAs secundarios de energía |
| `sky` | `#00D9FF` | Progreso, feedback positivo (sustituye `teal` en todos los docs: focus rings, barras) |
| `success` | `#4ADE80` | Correcto/completado (sustituye #4CAF50) |
| `success-dark` | `#22C55E` | Hover de success |
| `coral` | `#FF5252` | SE MANTIENE — urgencia/countdown exclusivamente (nada más compite con él) |
| `navy` | `#1A1A2E` | Base oscura (idéntico en ambos sistemas — sin cambio) |
| `navy-800` | `#2D2D44` | Cards sobre navy (actualizado desde #232342) |
| `cream` | `#FFF8F0` / `light #F0F0F8` | Fondos claros: Guía usa `light` con tinte violeta |
| `ink` | `#1C1C1C` | Texto sobre claro |

**Gradientes oficiales (únicos permitidos):**
```css
--grad-levelup: linear-gradient(135deg,#FF6B35 0%,#FFB627 50%,#FFD700 100%);
--grad-success: linear-gradient(135deg,#4ADE80 0%,#00D9FF 100%);
--grad-royal:   linear-gradient(135deg,#6C3FA0 0%,#8B5FBF 100%);
--grad-fire:    linear-gradient(135deg,#FF006E 0%,#FF6B35 100%);
--grad-card:    linear-gradient(135deg,#F0F0F8 0%,#E8E0F5 100%);
```
**Sombras de color (nunca gris puro):** CTA `0 0 20px rgba(255,107,53,.6), 0 8px 16px rgba(0,0,0,.2)` · card claro `0 8px 20px rgba(108,63,160,.2)` · hover card `0 16px 40px rgba(108,63,160,.4)`.
**Contraste AA obligatorio:** texto sobre gradientes fire/gold = `navy` o `ink`, NUNCA white. Sobre royal = white. Verificar cada combinación nueva en F6 QA.

## 2. COMPONENTES — OVERRIDES

- **Button primary:** fondo `--grad-levelup`, borde `3px solid #FFB627`, `rounded-3xl` (24px), texto navy Nunito 800 20px, glow fire + pulse infinito SOLO en el CTA primario de conversión de cada pantalla (regla ya existente). Secondary: `--grad-fire` texto white. Outline/ghost sin cambio.
- **Input:** borde gradiente royal→fire (2px, técnica border-image o wrapper), fondo `rgba(255,255,255,.95)`, focus glow royal `0 0 20px rgba(108,63,160,.4)`. Error sigue coral.
- **AnswerCard:** fondo `--grad-card`, borde `3px royal`, `rounded-[20px]`. Hover (desktop): scale 1.08 + translateY(-4px) + sombra royal + borde fire, easing `cubic-bezier(0.34,1.56,0.64,1)`. Tap: 0.97. **Selección = borde gold. PROHIBIDO estados verde/rojo y clases `selected-correct/wrong` del doc fuente** (violan mecánica del quiz). Eliminada por 50/50: opacity .3 + strike (sin cambio).
- **ProgressDots (NUEVO, sustituye texto "Pregunta 3 de 10"):** fila de 10 círculos 24px arriba del juego; contestadas = rellenas `sky`, actual = anillo gold pulsante, futuras = `white/15`. **UN SOLO color de relleno — jamás marcar ✓/✗ ni distinguir correctas** (el mockup fuente mostraba "3✓": rechazado).
- **Toast (NUEVO):** esquina superior, `rounded-xl`, borde izquierdo `5px gold`, slide-in right 400ms. Success = `--grad-success`; error = `--grad-fire` + wobble. Texto white bold 16px. Auto-dismiss 3s. Uso: feedback de sistema (guardado, racha, XP) — NO para correctitud en quiz.
- **XPFloat (NUEVO):** "+50 XP" Nunito 900 gold con sombra, sube 60px con arco hacia el contador y desaparece; contador hace scale 1→1.4→1. **Solo en Guía y BPA** — el TOF no muestra puntos (regla intacta).
- **Timer, Lifeline, Badge, CountdownBanner, SocialProofPill, CharacterSlot:** specs de 01 §4 intactas; recolorear con tokens v2 (timer: sky→gold→coral).

## 3. ASSETS INTERINOS — EMOJIS GIGANTES

Hasta resolver `[CHARACTER_ASSETS_PENDING]`: CharacterSlot renderiza emoji gigante (120–200px, `hero` con bounce sutil 3s loop) + nombre en pill: Charlie 😎🎤 · Gloria 💃 (o 🌟) · George 🤵. Estados se expresan con emoji secundario flotante (correct 👏, wrong 😬, win 🎉, tension 😰). Al llegar los renders Pixar se sustituye el componente interno — la API de CharacterSlot no cambia. Los bocadillos y copys funcionan igual desde hoy.

## 4. TOF — ENMIENDAS DE PANTALLA (sobre docs 02/03)

- **S1 Home:** header nuevo: logo "FIRE PASS™ 🔥" con spin suave al cargar + tagline `El Juego de la Riqueza` (12px gold, tracking-wide). CTA copy → `🎮 EMPEZAR EL JUEGO` con subline en el botón `Nivel 1 desbloqueado` (12px). Trust row bajo el CTA: `🔒 Tus datos 100% privados · 🏆 Únete a los 100 Latinos`. Todo lo demás de doc 02 (form, honeypot, UTMs, eventos, secuencia bienvenida) intacto.
- **S2 Instructions:** CTA → `🎯 ¡VAMOS A JUGAR!`. Los 3 bullets quedan (regla dura). PROHIBIDO añadir el bullet "responde todas correctas → unlock guía" del doc fuente.
- **S3 Game:** ProgressDots (§2) sustituye el texto de posición. Pregunta puede llevar UN emoji temático al final. Sin score, sin puntos, sin "⭐300 pts", sin reveal — mecánica intacta.
- **S4 RESULT LOSS → "LOSS GAMIFICADO" (decisión AP):** misma estructura y CTA de doc 03, con energía nueva:
  - Badge de perfil por segmento (spring + sparkles gold, NO confetti — confetti es exclusivo de WIN): low = **"CORAZÓN DE CALLE"** 🔥 ("Sabes sobrevivir. Ahora aprende a construir.") · medium = **"TALENTO NATURAL"** ⚡ ("Tienes el instinto. Te falta el mapa.")
  - H1 queda "No es tu culpa. Nadie nos enseñó esto." — la palabra "perdiste" sigue PROHIBIDA; tampoco "ganaste".
  - StatCard $340,000 intacta (es el trigger). CTA intacto.
- **S5 RESULT WIN:** adopta JACKPOT completo del doc fuente: confetti multicolor 3s (gold/royal/fire/success), score count-up 0→N visible (permitido en WIN), badge "TOP 10%" 96px giro+scale, CTA pulse. Copys de doc 03 intactos.
- **Leaderboard:** flag `NEXT_PUBLIC_LEADERBOARD=off` (default). P1: al activarse muestra top 3 real de `leads` (nombre de pila + estado + score) con consentimiento en el form ("mostrar mi nombre en el ranking", checkbox opcional). Cero datos simulados — decisión AP.

## 5. GUÍA — ENMIENDAS (sobre doc 04)

- **Índice `/guia` = Candy Crush level selector:** cards de capítulo elevadas (`--grad-card`, borde 3px royal, hover lift), completadas con check gold + mini-badge, bloqueadas en grises `#D2D2E0→#C0C0D4` opacity .6 con candado. Zeigarnik intacto (siguiente con preview blur). **Sin estrellas decorativas fijas** (el "⭐5/5 siempre" del doc fuente es ruido sin significado); en su lugar: `{cards vistas}/{total}` por capítulo.
- Barra de progreso global gradiente `--grad-success` con % arriba.
- **Reader:** modelo cards/reel de doc 04 INTACTO (el scroll largo del doc fuente queda rechazado). Dentro de las cards se adoptan: headers de sección con emoji, highlight box **"💡 CONSEJO DE ORO"** (fondo gold/15, borde gold — sustituye al "consejo millonario" con cita de autor) y callout "⚡ DATO RÁPIDO" (fondo sky/15). Cero citas de autores externos.
- +XP por card interactiva completada (XPFloat §2) — XP de Guía es cosmético v1 (no persiste a BPA).
- Tip de urgencia en índice: `💡 Complétala en 72h — después se cierra` (coral, honesto: sí expira).

## 6. BPA — ENMIENDAS (sobre doc 05)

- **Precio: $5 pago único — CONFIRMADO.** Nada de "/mes", nada de trial. Copys de landing y VSL quedan como están.
- **La CIUDAD SE QUEDA** como avatar central (es el motor de personalización atado al progressive disclosure). El huevo→águila del doc fuente queda descartado como reemplazo.
- **Se añade capa XP encima del sistema de niveles existente:** misión completada +150 XP · reto diario +50 XP · racha 7 días +100 XP bonus. Umbrales: Nivel 2 = 500 · N3 = 1,200 · N4 = 2,500 · N5 = 4,000 (del doc fuente; niveles 6–10 escalan +1,500 c/u). Barra XP gradiente `--grad-levelup` en home ciudad con "próxima recompensa" visible (edificio/decoración que viene — Zeigarnik).
- **Level-up ceremony (adoptada):** confetti gold 3s + ciudad morph + toast "¡SUBISTE A NIVEL {n}! 🎉" + sparkles ✨ en el elemento nuevo de la ciudad.
- Botón check-in diario grande `--grad-levelup`: `✅ CHECK-IN DIARIO · +50 XP + Consejo del Día` — ES el reto diario de doc 05 §5 con XP encima; "Consejo del Día" = card breve del pool `bpa_daily.json` (añadir campo `tip` a cada entrada).
- Onboarding: se mantienen los 5 pasos de doc 05. Checkbox "recordatorios por WhatsApp" = P1 tras `[WHATSAPP_PENDING]`.
- **Naming compliance:** "Tu Agente Financiero Personal". PROHIBIDO: "Asesor IA", "IA/AI" en cualquier copy de BPA.

## 7. BOF — ENMIENDAS (sobre doc 06)

- Adoptado: fila de trust signals sobre el embed: `🔒 100% confidencial · 🌟 Especialista que es latino como tú · ✅ Sin compromisos de venta` — y **CTA sticky inferior** (aparece tras scroll pasado el hero, ancla al embed).
- Testimonios: quedan los 3 de doc 06 verbatim. Los del doc fuente (cifras de ingresos/inversiones) RECHAZADOS por compliance.
- Escasez: valor real/env como estaba — "3 slots disponibles hoy" solo si es verdad.

## 8. MICROCOPY — PASS GLOBAL (reglas)

- Energía: emojis en headers y CTAs, exclamaciones en celebraciones, CAPS solo en botones y momentos de victoria.
- Siempre "tú", nunca "el usuario". Términos técnicos (401k, Roth) siempre con explicación simple en la misma frase.
- Errores del usuario = momentos de aprendizaje: "Hasta los que más saben se equivocan. Aquí viene la lección…" — nunca castigo.
- PROHIBIDO en cualquier copy: promesas de resultado económico ("ganarás $X", "de $0 a $15k"), "IA", vocabulario de compliance (§9 de 01), y la palabra "perdiste".
- Aplicar pass a `es.json` completo y contenido de guía al redactar.

## 9. SOUND DESIGN — P1 (flag `NEXT_PUBLIC_SOUND=off` default)

Archivos en `/public/sfx/` (mp3, ≤50KB c/u, volumen master -6dB): `tap.mp3` (ding corto) · `correct.mp3` (fanfare 0.8s — SOLO Guía/BPA, jamás en quiz TOF) · `soft.mp3` (bzzt suave) · `levelup.mp3` (1.5s) · `confetti.mp3` (whoosh). Reglas: nada suena antes de la primera interacción del usuario (política de autoplay móvil) · toggle 🔊/🔇 persistido en localStorage visible en header de juego/BPA · `prefers-reduced-motion` implica sonido off por default.

## 10. ENMIENDAS AL CHECKLIST (07) — resumen ejecutable

- **F0.2** tokens: implementar §1 de ESTE doc (v2). `/dev/tokens` muestra gradientes y sombras de color.
- **F1.x** componentes: AnswerCard/Button/Input según §2; NUEVOS: **1.10 ProgressDots**, **1.11 Toast**, **1.12 XPFloat**.
- **F2.x** TOF: enmiendas §4 (S1 header/CTA/trust row, S2 CTA, S3 dots, S4 LOSS gamificado con 2 badges de segmento, S5 JACKPOT). Leaderboard = flag off.
- **F3.x** Guía: índice selector §5, consejo de oro/dato rápido, XP cosmético.
- **F4.x** BPA: capa XP + check-in + level-up ceremony §6; campo `tip` en `bpa_daily.json`; $5 único sin cambios.
- **F5.x** BOF: trust row + sticky CTA §7.
- **F6.1** grep compliance añade: `\bIA\b`, `asesor.{0,10}(IA|AI)`, `perdiste`, patrones de promesa `gan(a|ar).{0,15}\$` sobre `src/content/**`.
- **F6.x** QA: verificación AA de cada texto sobre gradiente (tabla §1).
- **P1 (post-lanzamiento):** sonido §9 · leaderboard real con consentimiento · WhatsApp check-ins.
