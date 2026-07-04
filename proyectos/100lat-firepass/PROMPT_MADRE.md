# PROMPT MADRE — FIRE PASS™

> Documento de referencia original del producto. No modificar.

---

Create a mobile-first web app called:

**"FIRE PASS – 100 Latinos en USA dijeron…"**

## GOAL
Build a gamified financial awareness trivia app that captures cold leads and moves them to the next stage of a funnel.

## TARGET
- Latino adults in the U.S.
- Age 28–45
- Working class, families, single parents
- No advanced financial education
- Must feel fun, not educational

## TONE
- Entertaining
- Game show style
- Curious
- Not salesy
- No mention of insurance or investment products

---

## BRAND IDENTITY

Primary colors:
- Dark Blue `#1D3557`
- Green `#2ECC71`
- Gold accents `#F1C40F`
- White background

Typography: **Poppins** (clean, modern, rounded)

Design style:
- Modern fintech + game show
- Minimal but dynamic
- Mobile first
- Large buttons
- High contrast
- Playful but professional

---

## APP FLOW STRUCTURE

### SCREEN 1 – HOME
- Title: "100 Latinos en USA dijeron…"
- Subtitle: "¿Estás dentro del promedio… o dentro del 1%?"
- Button: "JUGAR AHORA"
- Include cartoon game show host (upper body, holding microphone, expressive face).

### SCREEN 2 – CHARACTER SELECTION
- Headline: "Elige tu compañero de juego"
- Two selectable avatars: Male coach (confident, friendly) / Female coach (intelligent, supportive)
- Button: "Comenzar"
- Optional: Allow login with email / Optional Facebook login (but not mandatory)

### SCREEN 3 – GAME INSTRUCTIONS
- "Responderás 10 preguntas."
- "Tienes 30 segundos por pregunta."
- "No sabrás cuáles acertaste hasta el final."
- "Solo 10/10 desbloquea la fórmula especial."
- Button: "Empezar"

### SCREEN 4 – QUESTIONS (10 total)
Each question screen must include:
- Question number (1/10)
- Timer countdown 30 seconds
- 4 answer options (large buttons)
- Game show host reaction animation
- No indication if answer is correct
- Automatically move to next question

---

## SCORING LOGIC

At the end:
- Score = 10 → "Has desbloqueado la Fórmula FIRE PASS™"
- Score 5–9 → "Buen intento. Tu resultado indica que podrías estar dejando dinero sobre la mesa."
- Score < 5 → "Tenemos una buena y una no tan buena noticia…"

## RESULT SCREEN
- Show total score (e.g. 6/10)
- Do NOT show which questions were wrong.

CTA BUTTON:
- 5–9: "Descargar guía gratuita"
- 10: "Acceder a la fórmula"
- Under 5: "Descubrir cómo mejorar"

---

## DATA CAPTURE

Before unlocking guide, collect:
- Name
- Email
- Optional phone

Store user score. Tag user based on:
- Low awareness (0–4)
- Medium awareness (5–7)
- High awareness (8–10)

---

## TECH STACK

Frontend: React or Next.js + Tailwind CSS
Backend: Firebase or Supabase

Database fields: User ID, Name, Email, Score, Date, Segment

---

## IMPORTANT RULES

- No mention of insurance.
- No mention of IUL.
- No mention of AI.
- Must feel like a game, not financial education.
- Smooth transitions.
- Confetti animation for 10/10.
- Subtle microcopy to create curiosity.

---

## FUTURE EXPANSION READY

App must allow:
- Adding leaderboard
- Referral challenge ("Reta a tus amigos")
- Unlock level 2
- Integration with payment page ($4.99 diagnostic)
