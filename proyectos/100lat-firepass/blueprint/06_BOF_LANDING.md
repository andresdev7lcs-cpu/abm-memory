# BOF — LANDING DE LLAMADA (`/llamada`)
**Fecha:** 2026-07-06 · Referencias: `01_DESIGN_SYSTEM.md` · Trigger: nivel 5 BPA (también accesible por link directo de campañas de reactivación).
Página simple, emocional, alta confianza. Fondo `cream`, hero `navy`. UNA sola acción: agendar.

**Compliance máximo aquí:** cero mención de productos. La sesión = "sesión estratégica gratuita con un experto financiero certificado". Footer legal obligatorio.

---

## 1. WIREFRAME (mobile, secciones en orden)

```
┌──────────────────────────────────┐
│ ▒ HERO navy ▒                    │
│  Te has ganado esto.             │  ← H1 32px Nunito 900 white
│  Una sesión estratégica gratuita │  ← sub 18px Inter, "30 minutos"
│  de 30 minutos con un experto    │    y "gratuita" en gold
│  financiero certificado          │
│  [⭐ Solo 6 sesiones disponibles │  ← SocialProofPill coral
│     esta semana]                 │
│  ┌────────────────────────────┐  │
│  │   ELEGIR MI HORARIO  →     │  │  ← ancla scroll a #agenda
│  └────────────────────────────┘  │
├──────────────────────────────────┤
│  QUÉ TE LLEVAS DE LA SESIÓN      │  ← eyebrow 12px + 3 cards cream
│  🗺 Tu análisis personal de      │
│     brechas financieras          │
│  📋 Un plan concreto para tus    │
│     próximos 90 días             │
│  🔑 Una estrategia que la        │
│     mayoría de los latinos       │
│     nunca escucha — y que puede  │
│     cambiarlo todo               │
├──────────────────────────────────┤
│  ELLOS YA DIERON EL PASO         │
│  ┌ 💬 "Marlene, Houston" ──────┐ │  ← 3 cards testimonio (§2),
│  ┌ 💬 "Roberto, San José" ─────┐ │    carrusel swipe con dots
│  ┌ 💬 "Ana, Los Ángeles" ──────┐ │
├──────────────────────────────────┤
│  TU EXPERTO                      │
│  [FOTO/AVATAR                    │  ← [ADVISOR_PHOTO_PENDING]
│   PLACEHOLDER]                   │    circle 120px
│  {Nombre} · Asesor financiero    │  ← [ADVISOR_NAME_PENDING]
│  certificado · +X familias       │    credenciales SIN mencionar
│  acompañadas                     │    seguros
├──────────────────────────────────┤
│  #agenda                         │
│  ELIGE TU MOMENTO                │
│  ┌────────────────────────────┐  │
│  │   [CALENDLY EMBED]         │  │  ← [CALENDLY_PENDING] §3
│  └────────────────────────────┘  │
├──────────────────────────────────┤
│  footer legal 12px ink/60        │  ← §4
└──────────────────────────────────┘
```

## 2. TESTIMONIOS (copy exacto, ficticios pero verosímiles — marcar en código como `sample:true` para swap futuro por reales)

1. "Marlene de Houston pasó de $18K en deudas a su primer fondo de emergencia en 8 meses."
2. "Roberto de San José empezó a ahorrar $200/mes y proyecta $340K para su retiro."
3. "Ana de Los Ángeles protegió a su familia sin cambiar su estilo de vida."

Card: quote 16px Inter italic + nombre/ciudad 14px 600 + avatar inicial en círculo teal. Disclaimer bajo el carrusel, 12px: "Historias representativas de resultados de clientes."

## 3. CALENDLY

- Embed inline (`react-calendly` InlineWidget o iframe) con `NEXT_PUBLIC_CALENDLY_URL`.
- Sin URL configurada → card fallback: "Agenda por WhatsApp" → `https://wa.me/{WHATSAPP_PENDING}` ; si tampoco hay número → form mini (nombre+teléfono ya conocidos, botón "Que me contacten") → n8n webhook `{event:'call_request', user}`.
- Prefill Calendly: `?name={name}&email={email}` desde perfil.
- Escasez "Solo X sesiones esta semana": v1 valor de env `NEXT_PUBLIC_WEEKLY_SLOTS` (default 6) menos agendadas contadas por webhook Calendly→n8n→Supabase (`call_bookings`); hasta tener webhook, mostrar valor env estático.

```sql
CREATE TABLE IF NOT EXISTS call_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  calendly_event_id TEXT
);
```

## 4. FOOTER LEGAL (copy exacto v1 — AP revisa con su licencia antes de producción)

> Sesión educativa gratuita impartida por un asesor financiero con licencia activa en EE.UU. Este sitio y sus contenidos tienen fines exclusivamente educativos y no constituyen asesoría de inversión, legal ni fiscal. Los resultados individuales varían. FIRE PASS™ {año}.

## 5. EVENTOS

`call_landing_view` · `calendly_open` · `call_booked` (webhook server-side → Pixel `Schedule` + GA4 `call_booked` + n8n Telegram "🔥 LLAMADA AGENDADA: {email}") — el evento de conversión final del funnel completo.

## 6. CRITERIOS DE ACEPTACIÓN

- [ ] Una sola acción primaria; CTA hero ancla al embed
- [ ] Testimonios marcados `sample:true`; disclaimer visible
- [ ] Cadena de fallbacks Calendly → WhatsApp → form funciona según envs presentes
- [ ] Footer legal presente en build de producción
- [ ] `call_booked` notifica Telegram vía n8n en <1 min (con webhook configurado)
- [ ] Grep compliance: cero vocabulario prohibido
