# Design System — FIRE PASS™ / 100Lat

## Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-blue` | `#1D3557` | Color principal, fondos hero, textos |
| `brand-green` | `#2ECC71` | CTAs primarios, éxito, barra de progreso |
| `brand-gold` | `#F1C40F` | Acentos, score alto, badges |
| Blanco | `#FFFFFF` | Fondos de pantalla |
| Gris claro | `#F9FAFB` | Fondos de tarjetas |

## Tipografía

- **Fuente:** Poppins (Google Fonts)
- **Pesos:** 400 (body), 500 (medio), 600 (semibold), 700 (bold), 800 (extrabold)

| Elemento | Tamaño | Peso |
|----------|--------|------|
| H1 principal | `text-3xl` (30px) | extrabold |
| H2 sección | `text-2xl` (24px) | extrabold |
| Body | `text-base` (16px) | regular |
| Label / small | `text-sm` (14px) | medium |
| Microcopy | `text-xs` (12px) | regular |

## Componentes

### Button
- Variantes: `primary` (verde), `secondary` (azul), `gold`, `outline`
- Tamaño: `lg` por defecto (padding py-4 px-8, text-lg)
- Border radius: `rounded-2xl`
- Siempre `w-full` en mobile

### Cards
- `rounded-2xl` o `rounded-3xl`
- `shadow-md` para elevación
- Fondo blanco o `bg-gray-50`

### Inputs
- Border: `border-2 border-gray-200`
- Focus: `border-brand-green`
- Radius: `rounded-xl`
- Padding: `px-4 py-3`

## Animaciones

- Transiciones de pantalla: slide-in horizontal (Framer Motion)
- Respuestas: `whileTap scale(0.97)`
- Score 10/10: confetti (canvas-confetti)
- Timer warning (≤10s): pulso CSS

## Layout

- Max width: `480px` (centrado en desktop)
- Padding horizontal: `px-6` (24px)
- Mobile-first: diseñado para iPhone 14 (390px)
