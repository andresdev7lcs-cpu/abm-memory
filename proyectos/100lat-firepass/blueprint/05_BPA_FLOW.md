# MOF-2/BOF — BPA MINI APP ($5) — FLUJO UX COMPLETO
**Fecha:** 2026-07-06 · Referencias: `01_DESIGN_SYSTEM.md` · Metáfora: **Sims × Duolingo × Tamagotchi financiero.** El usuario construye su ciudad-avatar financiera. Personaje: GLORIA o GEORGE (A/B 50/50 por hash de user_id, persistido).
Fondo: `cream` con ciudad ilustrada; momentos de celebración sobre `navy`.

---

## 1. RUTAS

| Ruta | Contenido |
|---|---|
| `/bpa` | Landing de venta $5 (pre-pago) |
| `/bpa/pago` | Checkout [PAYMENT_PENDING: Stripe o Wompi] |
| `/bpa/onboarding` | Progressive disclosure (5 pasos) — post-pago, post-auth |
| `/bpa/ciudad` | Home: ciudad-avatar + nivel + retos del día |
| `/bpa/reto/[id]` | Player de reto/misión |
| `/bpa/nivel-5` | Celebración + invitación a llamada |

**Auth:** Supabase Auth OBLIGATORIA desde el pago (email magic link mínimo; OAuth Meta/Google placeholder). El lead TOF se vincula: `bpa_profiles.lead_id = leads.id` por email match.

## 2. LANDING $5 (`/bpa`)

- Hero: Gloria/George `invite` + "Tu Agente Financiero Personal" / sub: "No es un curso. No es un coach. Es la herramienta que construye TU mapa financiero, paso a paso."
- 3 bullets: 🗺 Tu mapa según TUS números · 🏙 Tu ciudad crece contigo · 🎯 Retos de 5 minutos al día
- Preview animado de la ciudad (asset estático v1 con parallax sutil)
- Precio ancla: `$5 · pago único · acceso completo` — CTA gold `EMPEZAR POR $5`
- Checkout: página placeholder con proveedor por env `NEXT_PUBLIC_PAYMENT_PROVIDER=stripe|wompi|mock`. Modo `mock` (default hasta credenciales): botón "Simular pago" que marca `bpa_profiles.paid=true` — SOLO detrás de `NEXT_PUBLIC_ENV=dev`.
- Eventos: `bpa_landing_view` · `bpa_checkout_start` · Pixel `Purchase {value:5, currency:'USD'}` al confirmar.

## 3. ONBOARDING — PROGRESSIVE DISCLOSURE (5 pasos, 1 pantalla c/u)

Regla: nunca pedir todo junto; cada dato paga recompensa visual INMEDIATA en la ciudad. NUNCA pedir: SSN, cuentas bancarias, saldos exactos, ID.

| Paso | Pregunta (input) | Recompensa visual | Campo |
|---|---|---|---|
| 1 | Confirma nombre + ciudad (texto, prellenado del lead) | Aparece el terreno con letrero "{Ciudad} de {Nombre}" | `city_name` |
| 2 | Rango de ingreso mensual (4 pills: <$1.5k / $1.5–3k / $3–4.5k / >$4.5k) | Aparece tu apartamento (tamaño NO varía por ingreso — sin shaming) | `income_range` |
| 3 | ¿Cuántas personas dependen de ti? (stepper 0–6+) | Figuras de familia aparecen frente a casa con animación | `dependents` |
| 4 | Tipos de deuda (multi-pill: tarjetas / carro / estudios / préstamos / ninguna) | Nubes grises de deuda flotan sobre la ciudad (una por tipo) — "las vamos a disolver juntas" | `debt_types[]` |
| 5 | ¿Tienes ahorros? (pills: nada / menos de 1 mes / 1–3 meses / 3+ meses de gastos) | Barra de ahorro (medidor) aparece en la ciudad | `savings_band` |

Cada paso: Gloria/George comenta con calidez (copy por paso en `es.json`). Al terminar: transición cinematográfica a `/bpa/ciudad` con la ciudad ya poblada + "Este es tu punto de partida. De aquí, solo se construye."

## 4. CIUDAD-AVATAR (`/bpa/ciudad`) — HOME

```
┌──────────────────────────────────┐
│  Nivel 3 · Constructor  [🔥 4]   │  ← nivel + racha días
│ ┌──────────────────────────────┐ │
│ │   ILUSTRACIÓN CIUDAD (SVG    │ │  ← capas por estado: terreno,
│ │   por capas, estado según    │ │    casa (5 estados), nubes deuda
│ │   nivel y datos)             │ │    (fade-out por hito), medidor
│ │        ☁️deuda  ☁️            │ │    ahorro, decoraciones por nivel
│ └──────────────────────────────┘ │
│  RETO DE HOY            ⏱ 09:41 │  ← countdown a medianoche local
│ ┌ 🎯 Anota tus gastos de ayer ─┐ │  ← card reto diario
│ ┌ 📖 Misión nivel 3 (2 de 3) ──┐ │  ← misión de nivel en curso
│  ─ insignias ─  🏠 🧮 ⚡ 🔒 🔒   │  ← fila badges, siguientes locked
│  ╭────────╮                      │
│  │GLORIA/ │ esquina, reactiva    │
│  ╰────────╯                      │
└──────────────────────────────────┘
```

**Ciudad = SVG por capas** (`/public/city/layer_{n}.svg`), render según `bpa_profiles` + nivel. Evolución: morph/crossfade 800ms (§5 DS). Assets: 5 estados de vivienda + 4 decoraciones + nubes + medidor = tarea de assets [CITY_ASSETS_PENDING], placeholder = ilustración plana con variantes de color hasta tenerlos.

## 5. SISTEMA DE NIVELES (10) Y RETOS

**Estructura:** cada nivel = 3 misiones (micro-lecciones interactivas de 3–5 min, mismos tipos de card de la Guía) + reto diario opcional (mantiene racha). Completar 3 misiones → level-up → ciudad evoluciona + badge.

| Nivel | Nombre | Misiones (tema) | Evolución ciudad |
|---|---|---|---|
| 1 | Cimientos | mapa de gastos: fijos/variables/hormiga | terreno limpio, luces |
| 2 | Detective | encontrar $50/mes (suscripciones, hormiga) | jardín aparece |
| 3 | Constructor | fondo de emergencia: tu meta 1 mes | casa mejora fachada |
| 4 | Escudo | plan bola de nieve con SUS deudas (usa `debt_types`) | 1ª nube de deuda se disuelve |
| 5 | **Estratega** | tu número (10/20) + mapa completo | ciudad ilumina + fuegos artificiales → **INVITACIÓN LLAMADA** |
| 6 | Multiplicador | interés compuesto aplicado a su plan | árbol de monedas |
| 7 | Jugador fiscal | 3 cubetas con SUS números | edificio banco propio |
| 8 | Protector | qué pasa con tu familia si faltas (sin producto) | familia con aura |
| 9 | Arquitecto | plan 90 días escrito | segunda planta casa |
| 10 | Leyenda | revisión mensual: el hábito del 1% | ciudad dorada completa |

Niveles 6–10 existen para retención POST-invitación (no bloquean el objetivo de negocio: la llamada dispara en 5).

**Reto diario:** 1 por día (pool de 30 en `src/data/bpa_daily.json`; acciones de 2 min: "cancela una suscripción", "anota gastos de ayer", "revisa un cargo que no reconozcas"). Completar = +racha 🔥. Countdown visible hasta medianoche (tz del navegador).

**Tamagotchi:** cron n8n — sin login 48h → mensaje Gloria/George: "Tu avatar te necesita. ¿Vienes?" (email; push web = P1). Sin login 7 días → "Tu ciudad sigue aquí. Nada se perdió." Nunca culpa.

## 6. NIVEL 5 — INVITACIÓN A LLAMADA (`/bpa/nivel-5`)

Trigger: completar 3ª misión de nivel 5. Secuencia:
1. Celebración full-screen navy: confetti + ciudad iluminándose + badge Estratega
2. Copy exacto (3 beats, tap para avanzar):
   - "¡Lo lograste! Llegaste más lejos que el 85% de los usuarios."
   - "Tienes el conocimiento. Tienes el mapa. Solo te falta alguien que lo ejecute contigo."
   - "Te has ganado una sesión estratégica gratuita con un experto financiero certificado."
3. CTA gold `AGENDAR MI SESIÓN GRATUITA` → `/llamada` (doc 06). Secundario ghost: "Más tarde" → ciudad (banner persistente de invitación queda en home).
4. Framing bajo CTA, 14px: "No es una venta. Es una conversación sobre TU futuro."

Eventos: `level_up {level}` · `level5_reached` (+ Pixel custom `Level5`) · `call_cta_click`.

## 7. MODELO DE DATOS

```sql
CREATE TABLE IF NOT EXISTS bpa_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  paid BOOLEAN NOT NULL DEFAULT false,
  paid_at TIMESTAMPTZ,
  avatar TEXT NOT NULL CHECK (avatar IN ('gloria','george')),
  city_name TEXT, income_range TEXT, dependents INT,
  debt_types TEXT[] DEFAULT '{}', savings_band TEXT,
  level INT NOT NULL DEFAULT 1, streak INT NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bpa_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,              -- mission_done | daily_done | level_up | badge
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  question TEXT NOT NULL, answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- RLS: usuario autenticado solo SELECT/UPDATE su propia fila (auth.uid() = user_id).
```
**Feedback cualitativo (Layer 2 auditoría):** cada 30º usuario pagado (`count % 30 = 0` al pagar, flag en perfil) recibe tras completar nivel 2 una card: "¿Qué fue lo más útil para ti?" (textarea, opcional, 1 vez) → tabla `feedback`.

## 8. CRITERIOS DE ACEPTACIÓN

- [ ] Sin `paid=true` → toda ruta `/bpa/**` (salvo landing y pago) redirect a `/bpa`
- [ ] A/B avatar: hash determinista de user_id, persistido, mismo avatar siempre
- [ ] Onboarding: cada paso pinta su recompensa en ciudad antes del siguiente
- [ ] Nunca se piden datos prohibidos (SSN, cuentas, saldos exactos)
- [ ] Level-up solo con 3 misiones del nivel completadas; ciudad evoluciona con morph
- [ ] Nivel 5 dispara secuencia exacta §6; banner de invitación persiste si pospone
- [ ] Racha: reto diario resetea a medianoche local; perder día → racha 0, sin castigo visual dramático
- [ ] Feedback pedido exactamente a 1 de cada 30 pagos, una sola vez
- [ ] Modo pago `mock` inaccesible fuera de dev
