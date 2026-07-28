# Mini proyecto: auditoría, seguimiento y control web

**Para:** Modutriplex
**Tiempo de montaje:** ~3 horas una sola vez
**Mantenimiento:** 20 minutos cada lunes
**Costo:** $0 (todo con herramientas gratuitas)

---

## Qué es esto

Un sistema mínimo para saber si el sitio está funcionando. No es un dashboard bonito: es lo indispensable para responder tres preguntas cada semana.

1. ¿Está entrando gente?
2. ¿De dónde viene?
3. ¿Está escribiendo por WhatsApp?

Todo lo demás es opcional. Un sistema que toma dos horas semanales se abandona al mes; este toma veinte minutos.

---

## FASE 0 — Antes de empezar

Reúne esto. Sin estos datos no se puede montar nada:

- [ ] Acceso a la cuenta de Google de la empresa (Gmail)
- [ ] Acceso al panel de Hostinger
- [ ] Acceso a Facebook Business (para el Pixel)
- [ ] Dirección exacta del taller y horario de atención
- [ ] El número de WhatsApp que atiende pedidos

---

## FASE 1 — Analítica (45 min)

### Paso 1.1 — Crear la propiedad de GA4

1. Entra a [analytics.google.com](https://analytics.google.com) con la cuenta de la empresa
2. Administrar → Crear → Propiedad
3. Nombre: `Modutriplex`, zona horaria **Colombia**, moneda **COP**
4. Sector: "Compras" · Tamaño: "Pequeña"
5. Plataforma: **Web** → URL `https://modutriplex.com` → nombre "Sitio principal"
6. Copia el **Measurement ID**. Se ve así: `G-ABC1234XYZ`

### Paso 1.2 — Crear el Pixel de Meta

1. Entra a [business.facebook.com](https://business.facebook.com)
2. Administrador de eventos → Conectar orígenes → Web → Pixel de Meta
3. Nombre: `Modutriplex Pixel`
4. Copia el **ID del Pixel** (solo números, ~15 dígitos)

### Paso 1.3 — Pegarlos en el sitio

Abre `index.html` y busca cerca de la línea 27:

```js
const GA4_ID = 'G-XXXXXXXXXX';
const FB_PIXEL_ID = 'XXXXXXXXXXXXXXX';
```

Reemplaza por los IDs reales:

```js
const GA4_ID = 'G-ABC1234XYZ';        // el tuyo
const FB_PIXEL_ID = '123456789012345'; // el tuyo
```

> El código ya está instalado y se activa solo. Mientras tengan `X`, no carga ni envía nada. En cuanto pongas los IDs reales, empieza a medir sin tocar nada más.

Sube el archivo por FTP o el File Manager de Hostinger.

### Paso 1.4 — Comprobar que funciona

1. Abre `modutriplex.com` en el navegador
2. En GA4: Informes → **Tiempo real**. Deberías verte a ti mismo
3. Haz clic en un botón de WhatsApp
4. Vuelve a Tiempo real → "Recuento de eventos": debe aparecer `whatsapp_click`

**Si no aparece nada:** revisa que el archivo subido tenga los IDs (a veces se sube el archivo viejo), y desactiva el bloqueador de anuncios.

---

## FASE 2 — Search Console (30 min)

Es la herramienta que dice **qué busca la gente antes de llegar**. Más útil que GA4 para SEO.

### Paso 2.1 — Verificar el sitio

1. Entra a [search.google.com/search-console](https://search.google.com/search-console)
2. Agregar propiedad → **Prefijo de URL** → `https://modutriplex.com`
3. Método de verificación: **Etiqueta HTML**
4. Copia la etiqueta que te da, se ve así:
   ```html
   <meta name="google-site-verification" content="abc123..." />
   ```
5. Pégala en `index.html` justo después de `<head>`
6. Sube el archivo y pulsa "Verificar"

### Paso 2.2 — Enviar el sitemap

1. En Search Console: menú lateral → **Sitemaps**
2. Escribe `sitemap.xml` y pulsa Enviar
3. Debe quedar en estado "Correcto" con **11 URLs detectadas**

### Paso 2.3 — Forzar la indexación

Esto acelera semanas de espera. Para **cada una de las 11 URLs**:

1. Pega la URL en la barra superior ("Inspeccionar cualquier URL")
2. Espera el análisis
3. Pulsa **"Solicitar indexación"**

Las 11 URLs:
```
https://modutriplex.com/
https://modutriplex.com/melaminico-a-la-medida
https://modutriplex.com/mdf-a-la-medida
https://modutriplex.com/melaminico-rh
https://modutriplex.com/canteado
https://modutriplex.com/maquinaria
https://modutriplex.com/materiales-clima-frio
https://modutriplex.com/materiales-clima-calido
https://modutriplex.com/colores-tendencia-cocinas
https://modutriplex.com/materiales-alto-trafico
https://modutriplex.com/materiales-closets
```

> Google limita a ~10 solicitudes diarias. Si te bloquea, sigue al día siguiente.

---

## FASE 3 — Google Business Profile (1 hora)

**Esta es la acción de mayor retorno de todo el proyecto, y es gratis.** Para búsquedas locales aparece por encima de los resultados normales, con mapa, teléfono y botón de cómo llegar.

### Paso 3.1 — Crear el perfil

1. [business.google.com](https://business.google.com) → Agregar empresa
2. Nombre: **Modutriplex**
3. Categoría principal: **Proveedor de madera**
4. Categorías adicionales: *Tienda de materiales de construcción*, *Servicio de carpintería*
5. Dirección del taller (aparece en el mapa)
6. Área de servicio: agrega **Tunja, Duitama, Zipaquirá, La Calera, Villavicencio, Ibagué, Melgar, Honda, La Mesa**
7. Teléfono y sitio web

### Paso 3.2 — Completarlo bien

Un perfil a medias no rankea. Necesita:

- [ ] **Horario** de atención real
- [ ] **10+ fotos**: fachada, las máquinas trabajando, piezas etiquetadas, material apilado, pedido empacado
- [ ] **Descripción** (750 caracteres) mencionando: tableros a la medida, MDF, melamínico, corte, canteado, Bogotá y las ciudades donde entregan
- [ ] **Productos**: melamínico, MDF, melamínico RH, canteado
- [ ] **Botón de acción** apuntando a WhatsApp

### Paso 3.3 — Verificación

Google envía una postal con código a la dirección física (tarda 1-2 semanas), o a veces permite verificación por video. Hasta verificar, el perfil no aparece.

### Paso 3.4 — Reseñas

Es lo que más pesa en el ranking local. A partir de ahora, **a cada cliente satisfecho se le pide reseña**. El link para pedirla sale del panel: Inicio → "Pedir reseñas".

Un mensaje que funciona por WhatsApp:
> "Quedamos atentos a cualquier cosa. Si el material llegó bien, nos ayudaría mucho una reseña en Google: [link]. Toma 30 segundos."

---

## FASE 4 — Hoja de seguimiento (20 min)

Crea una hoja de cálculo en Google Sheets llamada `Modutriplex — Seguimiento`.

### Pestaña 1: Semanal

| Semana | Sesiones orgánicas | Clics WhatsApp | Conversión % | Impresiones | Posición media | Nota |
|---|---|---|---|---|---|---|
| S1 | | | | | | Línea base |
| S2 | | | | | | |

La columna "Conversión %" es `clics WhatsApp ÷ sesiones × 100`.

### Pestaña 2: Keywords

| Keyword | Posición S1 | Posición S4 | Posición S8 | Posición S12 |
|---|---|---|---|---|
| tableros MDF Bogotá | | | | |
| melamínico a la medida | | | | |
| melamínico RH cocina | | | | |
| tableros Tunja | | | | |
| tableros Villavicencio | | | | |
| colores cocina tendencia | | | | |

### Pestaña 3: Oportunidades

Aquí va lo accionable. Cada lunes, en Search Console filtra por posición 11-20: son las keywords **a un empujón de la primera página**.

| Keyword | Posición | Página | Qué hacer |
|---|---|---|---|
| | | | |

---

## FASE 5 — La rutina semanal (20 min, cada lunes)

### Minuto 0-7 — Search Console

1. Rendimiento → últimos 7 días
2. Anota **impresiones** y **posición media** en la hoja
3. Ordena por impresiones: ¿qué consultas nuevas aparecieron?
4. Filtra posición **11-20** → apunta 1-2 en "Oportunidades"

### Minuto 7-14 — GA4

1. Informes → Adquisición → Adquisición de tráfico
2. Anota **sesiones orgánicas**
3. Interacción → Eventos → anota `whatsapp_click`
4. Calcula la conversión

### Minuto 14-20 — Decidir

Elige **una sola acción** para la semana. Una, no cinco.

Criterios:
- ¿Hay una keyword en posición 11-15? → mejorar esa página
- ¿Una página recibe tráfico pero nadie escribe? → revisar el CTA
- ¿Aparece una consulta que no cubrimos? → candidata a hub nuevo
- ¿Nada destacable? → publicar contenido según el plan

---

## FASE 6 — Auditoría mensual (1 hora)

Primer lunes de cada mes, además de la rutina:

### Rendimiento
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) sobre la home y un hub. Objetivo móvil: **> 70**
- [ ] Abrir el sitio en un celular real, con datos móviles

### Indexación
- [ ] Buscar en Google: `site:modutriplex.com` → deben aparecer las 11 páginas
- [ ] Search Console → Páginas → revisar "No indexadas" y por qué

### Contenido
- [ ] ¿Qué página trae más tráfico? Reforzarla
- [ ] ¿Alguna con cero visitas en un mes? Revisar title y enlaces internos
- [ ] ¿Hay consultas nuevas que merezcan un hub?

### Técnico
- [ ] Enlaces rotos: pasar el sitio por [validator.w3.org/checklink](https://validator.w3.org/checklink)
- [ ] Schema: probar 2 páginas en [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Confirmar que el certificado HTTPS sigue vigente

---

## Cómo escalar los hubs

Los 5 hubs actuales son plantilla. Cuando Search Console muestre consultas que no cubrimos, se crea uno nuevo. Ideas por eje:

| Eje | Hubs posibles |
|---|---|
| **Clima** | Clima seco, zona costera |
| **Uso** | Cocinas, baños, oficinas en casa, locales pequeños |
| **Estilo** | Minimalista, industrial, rústico, nórdico |
| **Durabilidad** | Mobiliario infantil, exteriores cubiertos |
| **Ciudad** | Tunja, Villavicencio, Ibagué (uno por ciudad) |

Estructura de cualquier hub nuevo: H1 con la keyword · 4-5 secciones H2 · tabla comparativa · marcas enlazadas · FAQPage schema · enlaces a 4 páginas internas · CTA a WhatsApp.

> **Regla:** cada hub necesita contenido propio. Duplicar el texto cambiando dos palabras hace que Google no lo indexe.

---

## Señales de alarma

| Señal | Qué revisar |
|---|---|
| GA4 en cero después de 3 días | Los IDs no quedaron bien, o se subió el archivo viejo |
| Search Console: 0 impresiones tras 2 semanas | ¿Se verificó? ¿Se envió el sitemap? |
| Páginas "Detectadas pero no indexadas" | Contenido demasiado similar entre hubs |
| Tráfico sube, WhatsApp no | El CTA falla o el tráfico no es del público correcto |
| Rebote > 80% en móvil | Velocidad o el mensaje no coincide con la búsqueda |
| Caída brusca de posiciones | Revisar si Google lanzó una actualización |

---

## Checklist de arranque

**Semana 1**
- [ ] GA4 creado y pegado
- [ ] Pixel creado y pegado
- [ ] Verificado en Tiempo real
- [ ] Search Console verificado
- [ ] Sitemap enviado
- [ ] Indexación solicitada en las 11 URLs
- [ ] Hoja de seguimiento creada

**Semana 2**
- [ ] Google Business Profile creado y completo
- [ ] 10+ fotos subidas
- [ ] Primera medición registrada
- [ ] Primera reseña pedida

**Semana 3 en adelante**
- [ ] Rutina de los lunes en marcha
- [ ] Primera auditoría mensual agendada
