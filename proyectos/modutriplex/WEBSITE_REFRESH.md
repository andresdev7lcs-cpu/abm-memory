# WEBSITE REFRESH — Modutriplex
Última actualización: 2026-06-22

## Objetivo
Landing page de conversión regional. El cliente cotiza, paga y recibe 
sin salir de casa. Penetración en zonas desatendidas vía logística aliada.

## Cliente objetivo (todos simultáneos)
- Carpintero independiente
- Diseñador de interiores
- Constructor / contratista
- Persona natural con proyecto de remodelación

Característica común: urgencia. Todos tienen un proyecto en curso 
que se retrasa por el material.

## Los 3 dolores en orden de prioridad
1. Tiempos de entrega lentos que retrasan la obra
2. No saber el precio hasta ir al punto de venta
3. Material no disponible o sin el calibre que necesita
4. Problemas de terminados de baja calidad
5. Perder medio día tocando puertas físicas

## Storytelling — estructura narrativa
DOLOR: "Tu proyecto está parado esperando material"
DESEO: "Cotizar, pagar y recibir sin salir de la obra"
SOLUCIÓN: "Modutriplex — cotizador online + entrega en 48h"

## Propuesta de valor (en orden)
1. Entrega en menos de 48h — alianza logística regional
2. Precio exacto antes de comprar — cotizador automático con IA
3. Todas las referencias — MDF, melamínicos, cedro, wengue, RH
4. Calidad garantizada — respaldo por defectos y tiempos

## Arquitectura de bloques (orden de construcción)

### BLOQUE 1 — Hero
- Transiciones de fondo tipo Magnific.com (fade entre imágenes oscuras)
- Headline: dolor directo del cliente
- CTA principal → cotizador
- Sin texto de relleno — solo headline + subheadline + CTA

Copys propuestos:
Headline: "Tu proyecto no puede esperar"
Subheadline: "Material cortado a medida, precio exacto online, entrega en 48 horas."
CTA: "Cotizar ahora →"
CTA secundario: "Ver cómo funciona"

### BLOQUE 2 — Propuesta de valor
3 cards con ícono, título y descripción corta:
- "Entrega en 48h" — llegamos donde otros no llegan, alianza logística regional
- "Precio exacto antes de pagar" — cotizador automático, sin sorpresas
- "Calidad garantizada" — todas las referencias, respaldo por defectos

### BLOQUE 3 — Video
Sección para video embed (YouTube placeholder por ahora)
Propósito: resolver dudas, miedos y objeciones
Copy sobre el video: "¿Cómo funciona Modutriplex?"
Copy bajo el video: "Miles de carpinteros ya cotizan online. Sin filas, sin esperas."
Video script sugerido (para grabar después):
  Minuto 0-0:30: mostrar el dolor (carpintero esperando en punto físico)
  Minuto 0:30-1:00: mostrar la solución (cotizador en celular)
  Minuto 1:00-1:30: mostrar el resultado (entrega en obra)

### BLOQUE 4 — Cotizador 3 pasos
Sección de conversión principal.
Integración posterior del optimizador_v5.html
Por ahora: placeholder con los 3 pasos visuales + CTA
Paso 1: Selecciona tu material y medidas
Paso 2: Ingresa tus piezas y cantidades
Paso 3: Paga y recibe en 48h

### BLOQUE 5 — Materiales + Cobertura
Subsección A: Grid de materiales
- MDF crudo (9-25mm)
- Melamínico estándar (colores)
- Melamínico RH (resistente humedad)
- Maderas con veta: cedro, wengue, arena
- Tablex / Tablex RH

Subsección B: Mapa SVG Colombia
10 departamentos activos:
Cundinamarca, Meta, Boyacá, Tolima, Huila,
Santander, Caldas, Risaralda, Quindío, Nariño
Departamentos activos: color ámbar #F5A623
Departamentos inactivos: gris claro

### BLOQUE 6 — Footer + WhatsApp flotante
Footer: logo + links + créditos
WhatsApp flotante: botón verde fijo esquina inferior derecha
Número placeholder: 57XXXXXXXXXX

## Decisiones de diseño

### Paleta
- Hero y secciones oscuras: #0a0a0a
- Acento madera: #F5A623 (ámbar)
- Acento tecnología: #2563EB (azul)
- Secciones claras: #F8F6F0 (crema)
- Texto sobre oscuro: #FFFFFF
- Texto sobre claro: #1a1a1a

### Tipografía
- Font: Inter (Google Fonts)
- Hero headline: 64px desktop / 40px móvil
- Sección títulos: 40px
- Body: 18px
- Peso: 400 regular, 600 bold — nunca 700

### Componentes
- Botones: sólidos, sin gradientes, border-radius 8px
- Cards: border-radius 12px, sombra sutil
- Sin emojis en UI
- Sin gradientes decorativos

### Mascota Triplo
- Castor SVG geométrico simple
- Color: #F5A623 sobre fondo oscuro
- Aparece en: hero (esquina inferior derecha), footer
- NO en secciones de contenido — no distraer

### Transiciones hero (estilo Magnific)
- 3-4 imágenes de fondo en loop
- Fade suave entre imágenes (2s transition, 5s intervalo)
- Overlay oscuro semitransparente sobre cada imagen
- Las imágenes muestran: material apilado, corte CNC, entrega, proyecto terminado
- Sin imágenes reales aún — usar fondos oscuros sólidos con variación de tono

## Tracking (placeholders)
GA4_ID = 'G-XXXXXXXXXX'
FB_PIXEL_ID = 'XXXXXXXXXXXXXXX'

Eventos a trackear:
- hero_cta_click — clic en "Cotizar ahora"
- video_play — reproducción del video
- cotizador_inicio — apertura del cotizador
- cotizador_completado — clic en Optimizar
- whatsapp_click — clic en botón WhatsApp flotante

## SEO
title: "Modutriplex | Tableros cortados a medida — Entrega en 48h"
description: "Cotiza online tableros MDF, melamínicos y maderas con corte CNC.
Precio exacto antes de pagar. Entrega en menos de 48 horas en toda Colombia."

## Stack técnico
- Un solo archivo HTML por bloque durante construcción
- Merge al index.html final cuando todos los bloques estén aprobados
- Sin frameworks — vanilla JS + CSS
- CDN: Google Fonts, cdnjs.cloudflare.com únicamente
- Mobile first — breakpoint principal: 768px

## Estado de bloques
- [ ] B1: Hero
- [ ] B2: Propuesta de valor
- [ ] B3: Video
- [ ] B4: Cotizador (placeholder)
- [ ] B5: Materiales + Mapa
- [ ] B6: Footer + WhatsApp

## Prompt base para cada bloque
Al pedirle a Codex cada bloque, usar este formato:
"Construye el BLOQUE [N] de la landing Modutriplex.
Lee: /proyectos/modutriplex/WEBSITE_REFRESH.md
Archivo de salida: bloque_[N]_[nombre].html
Diseño: dark premium, Inter font, paleta del WEBSITE_REFRESH.md
Mobile first. Sin frameworks. Vanilla JS + CSS inline."
