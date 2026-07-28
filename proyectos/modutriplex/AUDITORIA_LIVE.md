# Auditoría www.modutriplex.com — Estado en producción

**Fecha:** 2026-07-01
**Método:** fetch directo del HTML servido + verificación de assets, headers y rutas
**Commit en producción:** `cef12c4` (rama `main`)

---

## Veredicto

El sitio está **vivo y con el SEO técnico completo**. El problema grave no es SEO: es una **imagen de 25 MB en el hero** que destruye la velocidad de carga. Eso, más dos analíticas sin conectar, es lo que separa al sitio de estar listo para recibir pauta.

**Score: 6.5/10** — buena base, tres bloqueadores que impiden invertir en tráfico.

---

## Lo que está bien (verificado en vivo)

| Elemento | Estado |
|---|---|
| HTTP 200, sitio sirviendo | ✅ |
| `<title>` optimizado con keyword | ✅ "Tableros MDF y Melamínico a Medida \| Entrega 48h — Modutriplex" |
| Meta description con keywords locales | ✅ 174 chars |
| Open Graph (7 tags) | ✅ |
| Twitter Card (4 tags) | ✅ |
| Canonical | ✅ `https://modutriplex.com/` |
| Schema LocalBusiness | ✅ |
| Schema FAQPage | ✅ |
| robots.txt | ✅ HTTP 200, apunta al sitemap |
| sitemap.xml | ✅ HTTP 200 |
| WhatsApp real conectado | ✅ `573115856258` (ya no es placeholder) |
| Imágenes con atributo alt | ✅ presente |
| Redirect no-www → apex | ✅ 301 correcto |
| Video VSL cargando | ✅ 1.8 MB, tamaño sano |

El SEO técnico que faltaba ya está desplegado. Ese frente está cerrado.

---

## Bloqueadores (orden de impacto)

### 1. Imagen hero de 25 MB — CRÍTICO

```
assets/img/invitacion.webp   →  25.317.126 bytes (25 MB)  ·  5,9 s de descarga
```

Carga con `loading="eager"`, o sea que bloquea el render inicial. En 4G colombiano promedio esto es **20-40 segundos** hasta ver el hero. Un usuario de móvil se va antes.

Consecuencias directas:
- LCP arruinado → Google penaliza el ranking (Core Web Vitals es factor de posicionamiento)
- Rebote alto → cualquier peso invertido en ads se quema en gente que nunca vio la página
- Consumo de datos del cliente

**Fix:** recomprimir a WebP calidad 80, ancho máximo 1200px. Objetivo: **menos de 200 KB**. Es una reducción de ~99% sin pérdida visible a ese tamaño de despliegue.

```bash
cwebp -q 80 -resize 1200 0 invitacion_original.webp -o invitacion.webp
```

Además: servir un `srcset` con versión de 600px para móvil.

### 2. GA4 y Meta Pixel sin conectar — BLOQUEA LA PAUTA

```js
GA4_ID = 'G-XXXXXXXXXX'          // placeholder
FB_PIXEL_ID = 'XXXXXXXXXXXXXXX'  // placeholder
```

El sitio ya tiene los eventos instrumentados (`track('cotizador_inicio')`, `track('whatsapp_click')`), pero no hay dónde enviarlos. Hoy el sitio **no mide nada**.

Sin esto no se puede: medir conversiones, construir públicos de retargeting, ni saber el costo por lead. El plan de ads del mes 3 es imposible de ejecutar a ciegas.

**Fix:** pedir al cliente los IDs reales y reemplazar. 10 minutos de trabajo, desbloquea todo el plan de medición.

### 3. `og:image` apunta a un 404

```
https://modutriplex.com/assets/img/og-image.jpg  →  HTTP 404
```

Cuando alguien comparte el link por WhatsApp o Facebook, no aparece imagen de vista previa. Para un negocio cuyo canal principal de conversión **es WhatsApp**, esto es pérdida directa de clics.

**Fix:** crear `og-image.jpg` de 1200×630 px con logo, la promesa de 48h y un tablero cortado de fondo. Subir a `assets/img/`.

---

## Hallazgos secundarios

### Dos etiquetas H1
```html
<h1 class="hero-headline">Tu proyecto no puede esperar.</h1>
<h1>Optimizador de corte Modutriplex</h1>   ← dentro del popup del cotizador
```
El H1 del cotizador debe ser `<h2>` o `<div>`. Google espera un solo H1 por página. Impacto bajo pero es corrección de 1 línea.

### Alt de la imagen hero vacío
```html
<img src="assets/img/invitacion.webp" alt="" loading="eager">
```
Un `alt=""` le dice al buscador y al lector de pantalla que la imagen es decorativa. Como es la imagen principal de marca, debería describirla:
```html
alt="Triplo, la mascota de Modutriplex, junto a tableros cortados a medida"
```

### Página "About" prometida pero ausente
El commit `aa2cd7b` dice "About page", pero `/about`, `/nosotros` y `/sobre-nosotros` devuelven **404**. O nunca se desplegó, o la ruta es otra. Una página de "nosotros" con los 30 años de historia es contenido valioso para SEO y confianza — vale la pena publicarla.

### Sitemap con una sola URL
Correcto para hoy, pero cuando salgan los blogs y las landings departamentales del plan de marketing hay que ampliarlo. Ponerlo en el checklist de cada publicación.

### Sin cabecera `cache-control` visible
El servidor (`hcdn`) no expone política de caché en la respuesta. Con una imagen de 25 MB esto multiplica el daño: cada visita la vuelve a bajar. Al arreglar el peso de la imagen, verificar también que los assets estáticos tengan caché largo.

---

## Plan de acción

### Fase 0 — Antes de gastar un peso en pauta (esta semana)

| # | Acción | Responsable | Tiempo | Impacto |
|---|---|---|---|---|
| 1 | Recomprimir `invitacion.webp` a <200 KB + srcset móvil | Dev | 30 min | Crítico |
| 2 | Conectar GA4 ID real | Cliente + Dev | 15 min | Crítico |
| 3 | Conectar Meta Pixel ID real | Cliente + Dev | 15 min | Crítico |
| 4 | Crear y subir `og-image.jpg` 1200×630 | Diseño | 1 h | Alto |
| 5 | Segundo H1 → H2 | Dev | 2 min | Bajo |
| 6 | Alt descriptivo en imagen hero | Dev | 2 min | Bajo |

**Criterio de salida:** PageSpeed móvil > 70 y eventos llegando a GA4. Sin esto, no arranca la pauta del mes 3.

### Fase 1 — Semanas 2-4

7. Verificar el sitio en **Google Search Console** y enviar el sitemap
8. Crear y verificar **Google Business Profile** (es el mayor generador de leads locales para este negocio y es gratis)
9. Publicar la página "Nosotros" con los 30 años de trayectoria
10. Medir línea base real: tráfico, cotizaciones iniciadas, clics a WhatsApp

### Fase 2 — Mes 2 en adelante

Ejecutar `MARKETING_PLAN.md` tal como está. El plan sigue vigente: el calendario de contenido, el escalado de ads (0 → $100 → $200 USD) y la secuencia de email no cambian. Solo dependían de que la medición existiera y el sitio cargara rápido.

Actualizar el sitemap cada vez que se publique un blog o una landing departamental.

---

## Lo que hace falta del cliente

1. **GA4 Measurement ID** (`G-XXXXXXXXXX`)
2. **Meta Pixel ID**
3. **Archivo original de la imagen hero** en alta resolución, para recomprimir bien
4. **Confirmar si existe la página About** y en qué ruta
5. Accesos a Instagram y Facebook de la marca
6. Fotos y video reales del taller y del corte CNC para alimentar el calendario de contenido

---

## Resumen para el cliente

El sitio está bien construido y el SEO técnico está completo. Hay una imagen de 25 megabytes en la portada que hace que la página tarde casi 6 segundos en cargar solo ese archivo — arreglar eso es el trabajo más rentable de la semana. Además, las herramientas de medición todavía tienen datos de prueba, así que hoy no sabemos cuánta gente entra ni qué hace.

Con esas dos cosas resueltas y la imagen de vista previa de WhatsApp creada, el sitio queda listo para recibir tráfico pago y ejecutar el plan de marketing a 6 meses.
