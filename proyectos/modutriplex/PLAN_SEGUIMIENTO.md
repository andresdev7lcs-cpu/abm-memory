# Plan de seguimiento y mejoras — Modutriplex

**Inicio:** 2026-07-28 (deploy en Hostinger)
**Horizonte:** 12 semanas
**Objetivo:** posicionar en ciudades intermedias y llevar tráfico calificado al sitio

---

## Principio que ordena todo el plan

La operación es en Bogotá, pero **el mercado local está canibalizado por precio**. En ciudades intermedias hay menos competencia digital y el argumento cambia: allá no compites por ser el más barato, compites por **llegar**. Nadie más les entrega material cortado en 48 horas.

Por eso el plan prioriza búsquedas del tipo *"tableros Villavicencio"* sobre *"tableros Bogotá"*, aunque el volumen sea menor. Son más fáciles de ganar y convierten mejor.

---

## Qué medir

### Los 4 números que importan

Todo lo demás es contexto. Si solo puedes mirar cuatro cosas cada semana, mira estas:

| Métrica | Dónde se ve | Qué significa |
|---|---|---|
| **Conversaciones de WhatsApp iniciadas** | WhatsApp Business + evento `whatsapp_click` | La única métrica que se acerca a venta |
| **Tráfico orgánico** | GA4 → Adquisición → Orgánico | Si el SEO está funcionando |
| **Impresiones y posición media por ciudad** | Search Console → Rendimiento → filtro por consulta | Si estamos ganando el terreno regional |
| **Tasa de conversión a WhatsApp** | `whatsapp_click` ÷ sesiones | Si el sitio persuade o solo recibe visitas |

### Línea base (llenar la primera semana)

No hay datos históricos: GA4 nunca estuvo conectado. La primera semana no se juzga, se mide.

| Métrica | Semana 1 | Semana 4 | Semana 8 | Semana 12 |
|---|---|---|---|---|
| Sesiones orgánicas | | | | |
| Clics WhatsApp | | | | |
| Tasa de conversión | | | | |
| Keywords en top 20 | | | | |
| Consultas con ciudad intermedia | | | | |

**Metas a 12 semanas** (revisar tras la semana 2 con datos reales):
- 400+ sesiones orgánicas/mes
- 40+ conversaciones de WhatsApp/mes
- Tasa de conversión > 8%
- Al menos 3 keywords de ciudad intermedia en top 20

---

## Rutina de revisión

**Cada lunes, 20 minutos.** No más. Un reporte que toma dos horas se deja de hacer al mes.

1. Search Console → Rendimiento → últimos 7 días
   - ¿Qué consultas nuevas aparecieron?
   - ¿Alguna en posición 11-20? Esas son las que están a un empujón de la primera página
2. GA4 → sesiones orgánicas y clics de WhatsApp
3. Anotar en la tabla de arriba
4. Elegir **una** acción para la semana

**Cada mes, 1 hora.** Revisión de fondo: qué páginas traen tráfico, cuáles no, y de dónde vienen las conversaciones.

---

## Mejoras por semana

### Semanas 1-2 — Cimientos de medición

Sin esto, todo lo demás es adivinar.

| # | Acción | Impacto | Esfuerzo |
|---|---|---|---|
| 1 | Conectar GA4 y Meta Pixel con IDs reales | Crítico | 15 min |
| 2 | Verificar en Search Console y enviar sitemap | Crítico | 30 min |
| 3 | Inspección de URL en las 5 sub-páginas | Alto | 15 min |
| 4 | **Google Business Profile** completo | Crítico | 2 h |
| 5 | Resolver la contradicción cotizador/WhatsApp | Alto | Decisión |

**Sobre el Business Profile:** es la acción de mayor retorno del plan y es gratis. Para búsquedas locales aparece por encima de los resultados normales. Necesita: dirección, horario, teléfono, categoría ("Proveedor de madera"), 10+ fotos del taller y las máquinas, y descripción con las keywords. Pedir reseña a cada cliente satisfecho a partir de ahora.

### Semanas 3-6 — Landings por ciudad

Aquí se ataca la estrategia regional. **Una landing por ciudad, no por departamento**, porque la gente busca por ciudad.

| Semana | Ciudad | URL | Keyword objetivo |
|---|---|---|---|
| 3 | Villavicencio | `/tableros-villavicencio` | tableros melamínico Villavicencio |
| 4 | Ibagué | `/tableros-ibague` | tableros MDF Ibagué |
| 5 | Neiva | `/tableros-neiva` | melamínico a la medida Neiva |
| 6 | Tunja | `/tableros-tunja` | tableros carpintería Tunja |

Estructura de cada una (~600 palabras, no más):
- **H1:** "Tableros MDF y melamínico a la medida en [Ciudad]"
- Cuánto tarda la entrega desde Bogotá a esa ciudad
- Qué materiales llegan
- **El argumento regional:** "no tienes que viajar a Bogotá ni conformarte con lo que haya en el depósito local"
- Enlace a las 5 páginas de material y a la home
- CTA a WhatsApp con mensaje pre-llenado mencionando la ciudad

> Ojo: **no duplicar el texto** cambiando solo el nombre de la ciudad. Google lo detecta y no las indexa. Cada una necesita datos propios: tiempo de entrega real, referencia a la zona, casos si los hay.

### Semanas 7-10 — Contenido que atrae

Las landings capturan a quien ya busca comprar. El contenido atrae a quien todavía está decidiendo, y ahí es donde Aglocol nos lleva ventaja hoy.

| Semana | Artículo | Keyword | Por qué |
|---|---|---|---|
| 7 | Cómo calcular cuántos tableros necesitas | cómo calcular tableros mueble | Alto volumen, poca competencia |
| 8 | Cuánto cuesta un clóset a la medida en 2026 | precio clóset a la medida Colombia | Búsqueda de alta intención |
| 9 | 7 errores al pedir material cortado | errores corte a medida | Posiciona la marca como experta |
| 10 | Guía de calibres: qué usar en cada mueble | qué calibre de MDF usar | Complementa las páginas de material |

Cada artículo enlaza a 2-3 páginas internas y termina en CTA de WhatsApp.

### Semanas 11-12 — Optimizar lo que ya funciona

Para esta altura hay datos. Toca aprovecharlos:

1. **Keywords en posición 11-20** → mejorar esa página: más contenido, mejor title, más enlaces internos. Subir del puesto 15 al 8 multiplica los clics.
2. **Páginas con tráfico pero sin conversión** → revisar el CTA
3. **Consultas inesperadas** en Search Console → si la gente llega buscando algo que no cubrimos, ahí hay una página nueva por crear
4. Primera pauta en Meta, solo si la medición ya funciona

---

## Mejoras técnicas pendientes

| Mejora | Cuándo | Por qué |
|---|---|---|
| Fotos reales del taller y proyectos | En cuanto haya material | **La mayor palanca de conversión.** El sitio afirma calidad pero no la muestra |
| Testimonios con nombre y ciudad | Tras los primeros pedidos | Prueba social real, no inventada |
| Convertir imágenes a WebP con `<picture>` | Semana 5 | Otro 30% menos de peso |
| Comprimir el video VSL (1.8 MB) | Semana 6 | Mejora el LCP en móvil |
| Schema `Review` | Cuando haya reseñas reales | Estrellas en resultados de Google |
| Blog como sección | Semana 7 | Estructura para el contenido |

> **Nunca** inventar testimonios ni poner `aggregateRating` sin reseñas verificables. Ya se eliminó uno falso (4.8 con 120 reseñas inexistentes). Google penaliza eso y con un cliente técnico el daño de credibilidad es peor que el beneficio.

---

## Señales de alarma

| Señal | Qué revisar |
|---|---|
| Sesiones orgánicas planas tras 6 semanas | ¿Se indexaron las páginas? Buscar `site:modutriplex.com` |
| Tráfico sube pero WhatsApp no | El CTA no funciona o el tráfico no es el correcto |
| Rebote > 75% en móvil | Velocidad o el mensaje no coincide con lo que buscaban |
| Las landings de ciudad no indexan | Probablemente contenido demasiado similar entre ellas |
| Muchas consultas de "empleo" o "trabajo" | El sitio se está posicionando para lo que no es |

---

## Lo que hace falta del cliente

**Bloquea el arranque:**
1. GA4 Measurement ID
2. Meta Pixel ID
3. Decisión sobre el cotizador (reactivar o ajustar el copy)
4. Acceso o creación del Google Business Profile

**Bloquea la conversión:**
5. Fotos del taller, las máquinas y proyectos terminados
6. Permiso de 2-3 clientes para publicar su caso
7. Tiempos de entrega reales por ciudad, para las landings

**Bloquea el contenido:**
8. Acceso a Instagram y Facebook
9. Media hora de conversación con alguien del taller para sacar historias reales
