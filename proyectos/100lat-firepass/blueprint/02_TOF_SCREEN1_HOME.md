# TOF — SCREEN 1: HOME / ENTRY GATE
**Ruta:** `/` · **Componente:** `src/app/page.tsx` · **Fondo:** gradiente navy (§1 design system)
**Objetivo de conversión:** capturar Nombre + Email ANTES de cargar el juego. Pixel `Lead` + insert Supabase + webhook n8n.

Referencia obligada: `01_DESIGN_SYSTEM.md`. Cero decisiones nuevas de diseño.

---

## 1. WIREFRAME (mobile 390px, columna única)

```
┌──────────────────────────────────────┐
│ ▒▒▒ gradiente navy-800 → navy ▒▒▒▒▒ │
│                                      │
│   [SocialProofPill]                  │  ← 🔥 34 personas jugando en este momento
│   pill white/10, centrado, 14px     │
│                                      │
│        ╭────────────────╮            │
│        │    CHARLIE     │            │  ← CharacterSlot size=hero (280px)
│        │  pose "hero"   │            │    escenario TV: spots de luz sutiles
│        │  brazos abiertos│           │    detrás (CSS radial-gradients gold/10)
│        ╰────────────────╯            │
│                                      │
│  ¿Sabes lo que saben                 │  ← H1 32px Nunito 900 white centrado
│  100 latinos en USA?                 │    "100" en color gold
│                                      │
│  Juega y descubre si estás           │  ← sub 16px Inter 400 white/70 centrado
│  dentro de la media                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Tu nombre                      │  │  ← Input h-14, label flotante no:
│  └────────────────────────────────┘  │    placeholder="Tu nombre"
│  ┌────────────────────────────────┐  │
│  │ Tu email                       │  │  ← type=email inputmode=email
│  └────────────────────────────────┘  │
│                                      │
│  [✓] No soy un robot                 │  ← checkbox custom 24px, texto 14px white
│                                      │
│  ┌────────────────────────────────┐  │
│  │       JUGAR AHORA  →           │  │  ← Button primary gold h-14 w-full
│  └────────────────────────────────┘  │    glow pulsante (única animación loop)
│                                      │
│  ───────────  o  ───────────         │  ← divider white/10, "o" 12px white/40
│                                      │
│  [f Continuar con Facebook]          │  ← Button outline h-12 (2 botones)
│  [◎ Continuar con Instagram]         │    [OAUTH_PLACEHOLDER] — ver §6
│                                      │
│  Más de 4,270 latinos ya lo          │  ← 14px white/70 centrado, número
│  descubrieron                        │    gold Nunito 700 con count-up
│                                      │
│  Es gratis · Sin tarjeta · 2 min     │  ← microcopy 12px white/40 centrado
│                                      │
└──────────────────────────────────────┘
```

Orden vertical y gaps: pill (pt-4) → 16px → Charlie → 24px → H1 → 8px → sub → 32px → form (gap 16px) → 12px → checkbox → 20px → CTA → 24px → divider → 16px → social buttons (gap 12px) → 24px → social proof → 8px → microcopy → pb-8+safe-area.

En viewport 390×844 debe quedar above the fold hasta el CTA "JUGAR AHORA" inclusive. Si no cabe: reducir Charlie a 240px, NUNCA reducir el CTA ni los inputs.

## 2. COPY EXACTO (`src/content/es.json` → clave `home`)

```json
{
  "home": {
    "socialProofLive": "🔥 {count} personas jugando en este momento",
    "headline": "¿Sabes lo que saben <gold>100 latinos</gold> en USA?",
    "subheadline": "Juega y descubre si estás dentro de la media",
    "nameField": { "placeholder": "Tu nombre", "errorEmpty": "Dinos tu nombre para empezar", "errorShort": "Mínimo 2 letras" },
    "emailField": { "placeholder": "Tu email", "errorEmpty": "Necesitamos tu email para guardar tu resultado", "errorInvalid": "Revisa tu email — parece incompleto" },
    "robotCheckbox": "No soy un robot",
    "robotError": "Confirma que no eres un robot",
    "cta": "JUGAR AHORA",
    "ctaLoading": "Preparando tu juego…",
    "divider": "o",
    "facebook": "Continuar con Facebook",
    "instagram": "Continuar con Instagram",
    "socialProofTotal": "Más de {count} latinos ya lo descubrieron",
    "microcopy": "Es gratis · Sin tarjeta · 2 minutos",
    "welcome": "¡{name}! Bienvenido al show. ¿Listo para descubrir si estás en la media?"
  }
}
```

Errores: tono cálido, nunca culpa al usuario. Nada de "campo requerido".

## 3. FORMULARIO — VALIDACIÓN Y ESTADOS

**Campos:**
| Campo | Reglas | Momento de validación |
|---|---|---|
| `name` | trim, 2–60 chars | on blur + on submit |
| `email` | regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, lowercase, trim | on blur + on submit |
| `robot` checkbox | debe estar checked | on submit |
| `website` (honeypot) | input hidden `autocomplete=off tabindex=-1`; si tiene valor → descartar submit silenciosamente (mostrar éxito falso) | on submit |

**Estados del CTA:**
1. `idle` — habilitado siempre (validar al submit, no deshabilitar por vacío: mejor conversión + accesible)
2. `submitting` — spinner + "Preparando tu juego…", inputs disabled
3. `error-red` — si Supabase falla: guardar lead en `localStorage.pendingLead`, CONTINUAR al juego igual (no bloquear conversión por infra), reintento silencioso en background al llegar a resultados
4. `success` — transición a secuencia bienvenida (§5)

**Duplicado email (23505):** tratar como éxito (patrón ya existente en `saveLead`). Actualizar `name` si cambió: usar `upsert` on conflict email.

## 4. DATOS Y EVENTOS

**Supabase — extensión tabla `leads`** (migración sobre schema.sql existente):
```sql
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'tof_entry',
  ADD COLUMN IF NOT EXISTS state TEXT NOT NULL DEFAULT 'CA',
  ADD COLUMN IF NOT EXISTS guide_unlocked_at TIMESTAMPTZ,
  ALTER COLUMN score DROP NOT NULL,          -- lead entra ANTES de jugar
  ALTER COLUMN segment DROP NOT NULL;
```
Insert al submit: `{name, email, source:'tof_entry', state: NEXT_PUBLIC_DEFAULT_STATE}`. Score/segment se actualizan al terminar quiz (update por email).

**Eventos (orden exacto al submit válido):**
1. `fbq('track','Lead')` — Meta Pixel [PIXEL_PENDING: no-op con console.log si falta env]
2. `gtag('event','lead_captured')` — GA4 [GA4_PENDING: idem]
3. `POST ${N8N_WEBHOOK_URL}` body `{event:'new_lead', name, email, ts}` — fire-and-forget vía route handler `/api/notify` (server-side, no exponer URL n8n al cliente)
4. Insert/upsert Supabase
5. Guardar `{name,email}` en Zustand store + `localStorage.fp_lead`

Retorno de usuario (localStorage tiene lead): pre-llenar form + copy CTA cambia a "SEGUIR JUGANDO". No saltar el gate (email puede querer cambiarse).

## 5. SECUENCIA DE BIENVENIDA (post-submit)

1. Form hace fade-out (200ms)
2. Charlie cambia a estado `welcome` (señala al usuario), bocadillo con `welcome` copy interpolando `{name}` — entra con spring
3. Pausa 1.6s (auto, sin tap)
4. Slide-out → `router.push('/instructions')` (Screen 2)

Prefetch de `/instructions` y assets de juego durante la pausa.

## 6. PLACEHOLDERS EN ESTA PANTALLA

| Elemento | Token | Comportamiento hasta resolver |
|---|---|---|
| Meta Pixel ID | `[PIXEL_PENDING]` | wrapper `track()` hace console.log |
| GA4 ID | `[GA4_PENDING]` | idem |
| OAuth FB/IG | `[OAUTH_PLACEHOLDER]` | botones visibles; al tap → toast "Muy pronto — usa tu email 👆" + scroll suave al form. NO ocultar (miden demanda: evento `oauth_intent` GA4) |
| Supabase URL/key | `[SUPABASE_PENDING]` | `saveLead` fallback localStorage (§3.3) |

## 7. CRITERIOS DE ACEPTACIÓN (✅ para Codex)

- [ ] 390×844: CTA visible sin scroll
- [ ] Submit válido dispara los 5 pasos de §4 en orden; fallo de Supabase NO bloquea navegación
- [ ] Email duplicado → flujo continúa como éxito
- [ ] Honeypot lleno → no insert, navegación normal (éxito falso)
- [ ] Errores de validación con copy exacto de §2, color coral + icono
- [ ] Contadores sociales en modo `simulated` con jitter; flag env respetada
- [ ] Charlie `hero` → `welcome` con bocadillo interpolando nombre
- [ ] Sin strings hardcodeados; todo desde `es.json`
- [ ] Lighthouse mobile: LCP < 2.5s (Charlie como imagen optimizada `next/image` priority)
- [ ] Cero palabras prohibidas (compliance §9 design system)
