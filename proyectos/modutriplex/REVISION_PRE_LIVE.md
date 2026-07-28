# Revisión pre-live — Modutriplex

**Fecha:** 2026-07-28
**Alcance:** home + 5 sub-páginas, antes de subir a Hostinger
**Paquete:** `~/Downloads/modutriplex-hostinger.zip` (2.4 MB, incluye `.htaccess`)

---

## Veredicto

El sitio está listo para subir. Pero hay **una contradicción de mensaje** que conviene resolver antes o justo después del deploy, porque afecta la conversión y la credibilidad.

---

## 🔴 Bloqueador de mensaje: la promesa no coincide con el CTA

El sitio promete, en el hero y en los 3 pasos:

> "Sabes el precio antes de pagar"
> "Ves el total antes de pagar, no después"
> "Sin llamadas. Sin visitas."
> "precio exacto online, sin ir al depósito"

Pero **los 6 CTAs principales abren WhatsApp**. El cotizador existe en el código y funciona, pero ningún botón lo abre (fue ocultado a propósito en el commit `ee173c8`).

**Por qué importa:** el visitante llega buscando "precio sin llamar", hace clic esperando una calculadora, y aterriza en un chat pidiendo datos. Eso es exactamente el dolor #2 del documento madre — "no saber el precio hasta preguntar" — reproducido dentro de nuestro propio sitio. Además, si la pauta se optimiza sobre esa promesa, el costo por lead sube: atrae gente que quería autoservicio.

**Tres salidas, en orden de preferencia:**

1. **Reactivar el cotizador** (si ya está confiable). El copy queda verdadero y el diferenciador frente a la competencia se sostiene. Es el único competidor que cotiza el proyecto completo online.
2. **Ajustar el copy a la realidad.** Cambiar a algo como *"Cotización en menos de 30 minutos por WhatsApp, con precio cerrado antes de pagar"*. Sigue siendo fuerte, y es cierto. Cinco ediciones de texto.
3. **Híbrido:** cotizador para proyectos simples, WhatsApp para los complejos. Es lo mejor a mediano plazo, pero requiere más trabajo.

> **Decisión pendiente del cliente.** Mientras no se resuelva, recomiendo no invertir en pauta: pagaríamos tráfico contra una promesa que el sitio no cumple.

---

## 🟡 Brecha para la estrategia regional

La prioridad comercial es **vender a ciudades intermedias**, donde hay menos competencia. Pero el sitio hoy:

- Menciona **departamentos** (Cundinamarca, Meta, Boyacá…)
- No menciona **ni una sola ciudad**: cero apariciones de Villavicencio, Ibagué, Tunja, Neiva, Bucaramanga, Manizales, Pereira, Armenia, Pasto

La gente no busca "tableros Meta". Busca **"tableros Villavicencio"**. Sin la ciudad en el texto, no competimos por esas búsquedas.

Se ataca con las landings departamentales del plan (sección de seguimiento), nombrando la ciudad capital en H1, title y cuerpo.

---

## 🟢 Lo que quedó bien

| Área | Estado |
|---|---|
| SEO técnico | Title con "Bogotá", meta descriptions, canonical, OG, Twitter Card |
| Schema | 12 bloques válidos: LocalBusiness, FAQPage ×3, Service ×2, Article, BreadcrumbList ×5 |
| Estructura | 1 H1 por página, H2 con keywords reales |
| Enlazado interno | Home ↔ 5 sub-páginas, circular entre ellas |
| Autoridad externa | Striebig, Holz-Her y KDT (los 3 responden 200) |
| Rendimiento | Hero de 25 MB → 152 KB; assets de 47 MB → 2.2 MB |
| URLs | Limpias sin `.html`, canonical y sitemap alineados |
| Servidor | `.htaccess` con gzip, caché, HTTPS forzado, cabeceras de seguridad |
| Honestidad | Claim falso de CNC corregido; CNC declarado como taller aliado |

### Storytelling

La narrativa dolor → solución está bien construida. Los 5 estados del bloque de storytelling cubren los dolores del documento madre y hablan en el lenguaje del carpintero, no en el de la empresa. El hero ataca los 3 dolores en una frase.

Lo que le falta es **prueba**. Hoy el sitio afirma que cumple, pero no lo demuestra: no hay ni una foto de proyecto real, ni un testimonio con nombre, ni un caso. Para un carpintero que va a arriesgar el material de su obra, eso pesa más que cualquier adjetivo. Es la mayor palanca de conversión pendiente y depende de material del cliente.

---

## Detalles menores

- **Emojis en la UI** (📐 🎯 ⏱ 🔒 📦). El `WEBSITE_REFRESH.md` los prohíbe explícitamente. Son 6 y no rompen nada, pero conviene decidir: o se quitan, o se actualiza el documento de diseño.
- **GA4 y Meta Pixel siguen en placeholder.** El código ya está listo; se activan solos al pegar los IDs.
- **"30 años" y "Garantía total"** aparecen 3 veces sin respaldo visible. Con una foto del taller o una línea sobre desde cuándo operan, el claim gana peso.

---

## Checklist de deploy

**Antes de subir**
- [ ] Decidir qué hacer con la contradicción cotizador/WhatsApp
- [ ] Pegar GA4 ID y Meta Pixel ID reales

**Al subir a Hostinger**
- [ ] Descomprimir el ZIP en `public_html/`
- [ ] **Verificar que `.htaccess` se copió** (es archivo oculto; en el File Manager hay que activar "mostrar ocultos")
- [ ] Probar una URL limpia: `modutriplex.com/maquinaria` debe cargar sin `.html`
- [ ] Confirmar que fuerza HTTPS y redirige `www` → apex

**Primeras 24 horas**
- [ ] Search Console: verificar propiedad y enviar `sitemap.xml`
- [ ] Inspección de URL en cada una de las 5 sub-páginas para forzar indexación
- [ ] Comprobar que GA4 registra eventos (`cotizador_inicio`, `whatsapp_click`)
- [ ] PageSpeed móvil: objetivo > 70
- [ ] Compartir el link por WhatsApp y ver que aparezca la vista previa con imagen
