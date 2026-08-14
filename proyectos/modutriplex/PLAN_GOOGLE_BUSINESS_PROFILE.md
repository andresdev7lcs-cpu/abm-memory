# Plan Google Business Profile — Modutriplex

**Fecha:** 2026-08-05
**Estado de partida:** ficha existe pero NO verificada / sin acceso del cliente
**Tipo de negocio:** híbrido — atiende en local (Av. Calle 72 # 74A - 70, Bogotá) + despacha a 10 departamentos
**Objetivo:** ficha verificada, completa y consistente con el sitio, generando llamadas/WhatsApp desde búsqueda local

---

## 0. Por qué esto importa más que la pauta

Una búsqueda tipo "corte de melamínico Bogotá" o "tableros MDF cerca de mí" devuelve el **Local Pack** (los 3 resultados con mapa) por encima de todos los resultados orgánicos. Esa posición no se compra con SEO de sitio — se gana con la ficha. Modutriplex hoy no compite ahí porque la ficha no está bajo su control.

Además: la ficha alimenta el **panel de conocimiento** cuando alguien busca "Modutriplex" por nombre. Hoy ese panel muestra datos que nadie del negocio revisó.

---

## FASE 0 — Reclamación (BLOQUEANTE, todo lo demás depende de esto)

Nada de lo que sigue se puede ejecutar sin control de la ficha. Prioridad absoluta.

### Paso 1 — Localizar la ficha existente
Buscar en Google Maps: `Modutriplex` y `Av. Calle 72 # 74A - 70 Bogotá`.

Tres escenarios posibles:

| Escenario | Señal | Acción |
|---|---|---|
| Ficha autogenerada por Google | Dice "¿Eres el propietario de esta empresa?" | Reclamar directo — es el caso fácil |
| Ficha creada por un ex-empleado/agencia | No aparece el enlace de reclamación, o pide verificar acceso a un correo desconocido | Solicitar acceso → Google notifica al dueño actual, 7 días para responder → si no responde, se transfiere |
| Ficha duplicada | Aparecen 2+ resultados con el mismo NAP | Reclamar la de más reseñas/antigüedad, marcar las otras como duplicado |

### Paso 2 — Verificación
Métodos que Google ofrece hoy, en orden de rapidez:
1. **Video** — el más común en Colombia para servicios. Graban un recorrido continuo sin cortes: fachada con nomenclatura visible → letrero/señalética → interior con las máquinas (Striebig, Holz-Her, KDT) → alguien con acceso a caja/facturas. **Preparar el local antes de grabar.**
2. **Postal** — código por correo físico, 5-14 días hábiles. Fallback si el video se rechaza.
3. **Teléfono/correo** — raro para este rubro, solo si Google lo ofrece.

**Riesgo conocido:** la verificación por video se rechaza si no se ve conexión clara entre el letrero exterior y el interior del negocio. Si Modutriplex no tiene letrero visible desde la calle, **instalar uno antes de grabar** — es el fallo de verificación #1.

### Paso 3 — Reclamar el perfil de "Servicio" si aplica
Como es negocio híbrido, verificar que no haya una segunda ficha de área de servicio flotando por ahí.

**Responsable:** cliente (necesita acceso físico al local + correo corporativo)
**Tiempo estimado:** 3-14 días según método
**Sin esto:** el resto de este documento es teoría

---

## FASE 1 — NAP canónico (la fuente de verdad)

Antes de tocar la ficha, se congela un NAP único. Cualquier variación entre sitio, ficha y directorios diluye la señal local.

```
Nombre:     Modutriplex
Dirección:  Avenida Calle 72 # 74A - 70, Bogotá, Cundinamarca, Colombia
Teléfono:   +57 311 585 6258
Sitio:      https://modutriplex.com
Horario:    Lun-Vie 8:00-13:00 y 14:00-16:30 · Sáb 8:00-12:00
```

### 🔴 Fix pendiente del sitio que hay que hacer AHORA

La auditoría SEO del 2026-07-29 ya detectó el problema y sigue abierto: el schema JSON-LD de [index.html](proyectos/modutriplex/index.html) ya trae el horario partido en dos bloques (8-13, 14-16:30) — correcto. **Pero hay que replicar exactamente ese horario partido en la ficha, incluyendo el cierre de almuerzo.**

Si la ficha declara jornada continua 8am-4:30pm y el sitio declara cierre de 1 a 2, Google detecta la inconsistencia y, peor, muestra "Abierto ahora" a la 1:30pm cuando nadie contesta. Cliente frustrado = reseña de 1 estrella.

**Regla:** el horario de la ficha se copia del footer del sitio, carácter por carácter.

### Nombre del negocio — no inflar
Tentación típica: poner "Modutriplex - Corte de Melamínico y MDF a la Medida Bogotá". **Esto viola las directrices de Google** y es motivo de suspensión o de que un competidor lo reporte. El nombre va exactamente como aparece en la fachada y la facturación: `Modutriplex`.

---

## FASE 2 — Configuración completa de la ficha

### 2.1 Categorías

La categoría principal es el factor de ranking local más pesado después de la proximidad. Elegir mal cuesta visibilidad directa.

**Principal (elegir una):**
- `Proveedor de madera` — si el volumen es venta de tablero
- `Servicio de corte` / `Taller de carpintería` — si el volumen es el servicio CNC

*Recomendación:* la propuesta de valor del sitio es **corte a medida**, no venta de tablero al bulto. Probar `Proveedor de madera` primero (más volumen de búsqueda en Colombia) y medir en Insights; si las búsquedas que llegan no convierten, cambiar.

**Secundarias (hasta 9, agregar todas las que apliquen realmente):**
Tienda de materiales de construcción · Carpintería · Ebanistería · Proveedor de madera contrachapada · Servicio de diseño de cocinas · Tienda de muebles a medida

**No agregar** categorías donde no se presta el servicio — genera búsquedas que no convierten y reseñas negativas.

### 2.2 Área de servicio (crítico para el modelo híbrido)

Configuración correcta: dirección **visible** + áreas de servicio declaradas. Cargar los 10 departamentos que ya declara el schema `areaServed`:

```
Cundinamarca · Meta · Boyacá · Tolima · Huila
Santander · Caldas · Risaralda · Quindío · Nariño
```

Cargarlos por departamento, no por ciudad suelta — cubre más superficie con menos entradas.

**Nota realista:** declarar área de servicio NO hace que la ficha aparezca en el Local Pack de Villavicencio o Tunja. Google rankea el Local Pack por proximidad física. El área de servicio ayuda en búsquedas sin intención geográfica clara y da contexto, pero para ganar visibilidad en ciudades intermedias el canal es el contenido del sitio (los hubs ya escritos) y Facebook orgánico — no la ficha.

### 2.3 Descripción (750 caracteres)

Se escribe para humano que ya llegó, no para keyword stuffing. Google no la usa como factor de ranking directo, pero sí la lee el cliente que decide.

**Borrador propuesto:**

> Cortamos tableros de MDF y melamínico a la medida exacta que necesitas, con maquinaria CNC de precisión (Striebig, Holz-Her, KDT). Trabajamos con carpinteros, ebanistas, diseñadores de interiores y constructores que necesitan piezas listas para armar, sin desperdicio de retal y sin tener que calcular cortes.
>
> Envías tus medidas por WhatsApp, te cotizamos, y despachamos en 24-48 horas. Servicio de canteado incluido. Despachamos a Cundinamarca, Meta, Boyacá, Tolima, Huila, Santander, Caldas, Risaralda, Quindío y Nariño — sin que tengas que desplazarte hasta Bogotá.
>
> Atendemos también en nuestro local en la Avenida Calle 72.

*(Ajustar: verificar que "canteado incluido" sea cierto o si es servicio aparte — no prometer lo que no es.)*

### 2.4 Productos y Servicios

Sección subutilizada por casi todos los competidores locales. Cada entrada es superficie adicional en el panel.

Cargar como **Servicios**, aprovechando los hubs ya escritos como fuente de descripción:

| Servicio | Página fuente |
|---|---|
| Corte de MDF a la medida | mdf-a-la-medida.html |
| Corte de melamínico a la medida | melaminico-a-la-medida.html |
| Melamínico RH (resistente a humedad) | melaminico-rh.html |
| Canteado de bordes | canteado.html |
| Tableros para closets | materiales-closets.html |
| Materiales para alto tráfico | materiales-alto-trafico.html |
| Asesoría en materiales según clima | materiales-clima-frio/calido.html |

Cada servicio lleva descripción propia (300 caracteres aprox) reciclada del H1+intro de su hub. **No copiar-pegar idéntico** — parafrasear, para no duplicar contenido con el sitio.

### 2.5 Atributos

Marcar los que apliquen: `Se requiere cita` (si aplica) · `Estacionamiento en la calle` · `Entrega a domicilio` · `Retiro en tienda` · `Pagos con tarjeta` · `Pagos móviles` (Wompi ya está integrado en el sitio).

### 2.6 Enlaces de acción

- **Sitio web:** `https://modutriplex.com` — con UTM para poder medir: `?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- **Botón de cita/pedido:** apuntar al cotizador
- **Teléfono:** el mismo +57 311 585 6258 del schema

⚠️ **Pendiente que bloquea la medición:** según memoria del proyecto, Modutriplex sigue **sin GA4 ni Pixel instalados** (AP debía entregar IDs la semana del 2026-07-28). Sin GA4, los UTM no miden nada. Este pendiente sigue abierto y ahora bloquea también la atribución de la ficha.

---

## FASE 3 — Fotos (el mayor déficit del negocio online)

La auditoría SEO ya lo marcó como el hallazgo de mayor impacto: **10 de 11 páginas del sitio no tienen ni una imagen**. El mismo insumo faltante bloquea la ficha.

Las fichas con fotos reciben significativamente más solicitudes de ruta y clics que las que no. Y las fotos son el activo que se reutiliza en tres canales a la vez: ficha + sitio + Facebook orgánico.

### Sesión de fotos — lista de captura

Una sola sesión de 2-3 horas en el taller resuelve los tres canales.

| Tipo | Qué capturar | Cantidad mínima | Uso |
|---|---|---|---|
| **Exterior** | Fachada con nomenclatura y letrero visibles, en horario diurno | 3 | Ficha (obligatoria) + verificación por video |
| **Interior** | Área de atención, mostrador, zona de espera | 3 | Ficha |
| **Maquinaria en operación** | Striebig cortando, Holz-Her canteando, KDT. Con operario, no vacías | 6-8 | Ficha + hubs maquinaria.html + FB |
| **Producto** | Tableros apilados por color/acabado, muestrario | 6 | Ficha + hubs de material + freebie "tabla de colores" |
| **Proceso** | Pieza etiquetada, pedido empacado listo para despacho | 4 | Ficha + FB (dolor 1, ángulo D del plan orgánico) |
| **Proyectos terminados** | Cocinas/closets armados con material Modutriplex | 4-6 | Ficha + sitio |
| **Equipo** | El equipo trabajando, caras visibles | 2-3 | E-E-A-T, señal de negocio real |
| **Logo** | Fondo limpio | 1 | Ficha |
| **Portada** | La mejor foto del taller o fachada | 1 | Ficha |

**Especificación técnica:** JPG/PNG, mínimo 720x720px, sin marca de agua, sin texto sobrepuesto, sin filtros pesados. Google penaliza las fotos que parecen stock o publicidad.

### Video
Máximo 30 segundos, 100MB. Uno solo: recorrido del taller o una máquina cortando. Reutilizable como reel de Facebook.

### Cadencia post-lanzamiento
Subir 2-3 fotos nuevas al mes. La ficha con actividad reciente recibe mejor trato que la estática.

---

## FASE 4 — Reseñas (el motor de largo plazo)

Después de la proximidad y la categoría, las reseñas son el factor que más mueve la aguja en el Local Pack. Y es donde un negocio B2B como este tiene ventaja: cada carpintero satisfecho es una reseña con vocabulario específico ("me cortaron 40 piezas para un closet y llegaron exactas") que Google usa para hacer match con búsquedas de cola larga.

### Mecánica de solicitud

1. **Generar el enlace corto** desde el panel de la ficha (`Pedir reseñas` → copia el link `g.page/r/...`)
2. **Punto de contacto:** al confirmar entrega por WhatsApp — el canal que ya usan. Mensaje corto, sin plantilla corporativa:

> Listo el despacho. Si quedaste conforme con el corte, nos ayudas un montón con una reseña rápida en Google 👉 [link]

3. **Momento:** después de la entrega confirmada, no antes. Nunca al cotizar.
4. **Meta realista:** 10 reseñas en los primeros 3 meses, luego 3-5/mes sostenido. Un salto de 0 a 30 en una semana se detecta como spam.

### Lo que NO se hace
- No comprar reseñas ni pedirlas a conocidos que no compraron — Google las detecta y puede suspender la ficha
- No ofrecer descuento a cambio de reseña — viola directrices explícitamente
- No pedirlas todas el mismo día

### Respuesta a reseñas
**Todas** se responden, en menos de 48 horas. Las respuestas son públicas y las lee el próximo cliente.

- **Positiva:** agradecer + mencionar el servicio específico ("gracias por confiarnos el corte de tu closet"). Da contexto semántico adicional a Google sin sonar forzado.
- **Negativa:** no discutir en público. Reconocer, ofrecer resolver por privado, dejar el número. Una respuesta serena a una reseña de 2 estrellas convence más que 10 reseñas de 5.

---

## FASE 5 — Publicaciones (Google Posts)

Vencen a los 7 días (salvo ofertas y eventos, que respetan su fecha). Cadencia mínima: **1 por semana.**

Fuente de contenido: ya está escrita. Los hubs del sitio y el plan de Facebook orgánico se reciclan aquí sin trabajo adicional.

| Semana | Tipo | Contenido | Fuente |
|---|---|---|---|
| 1 | Novedad | "Cortamos melamínico RH para zonas húmedas" | melaminico-rh.html |
| 2 | Novedad | Colores en tendencia 2026 | colores-tendencia-cocinas.html |
| 3 | Oferta | Freebie: guía de calibres | Freebie del plan FB |
| 4 | Novedad | Foto de pedido despachado a ciudad intermedia | Sesión de fotos |

Cada post: 1 foto + 150-300 palabras + botón (`Más información` → hub correspondiente con UTM, o `Llamar`).

---

## FASE 6 — Preguntas y respuestas

Sección que casi nadie usa y que aparece prominente en el panel. **Se puede sembrar:** el negocio publica la pregunta desde otra cuenta y la responde desde la ficha. Es práctica aceptada por Google (no es reseña falsa, es FAQ).

Sembrar 6-8, tomadas del FAQPage que ya existe en el sitio:

- ¿Cuánto se demoran en entregar un pedido?
- ¿Hacen despachos fuera de Bogotá?
- ¿Cuál es el pedido mínimo?
- ¿Puedo llevar mis propias medidas o ustedes diseñan?
- ¿Qué diferencia hay entre MDF y melamínico?
- ¿El canteado tiene costo adicional?
- ¿Aceptan pago con tarjeta / transferencia?
- ¿Atienden sin cita en el local?

Votar positivamente las propias respuestas las fija arriba.

---

## FASE 7 — Citaciones y consistencia externa

Google contrasta el NAP de la ficha contra otras fuentes de la web. Cada coincidencia refuerza la confianza; cada variación la diluye.

**Directorios donde dar de alta con el NAP canónico exacto:**
- Páginas Amarillas Colombia
- Cylex / Guía Local
- Apple Maps (Apple Business Connect — gratis, mismo proceso)
- Bing Places
- Facebook — la página de Modutriplex debe tener la misma dirección y teléfono exactos
- Waze

**Regla:** copiar-pegar del bloque NAP canónico de la Fase 1. Ni una abreviatura distinta ("Av." vs "Avenida"), ni un formato de teléfono distinto.

---

## FASE 8 — Medición

**En la ficha (Insights/Rendimiento):**
- Búsquedas por descubrimiento vs. por nombre — el crecimiento del *descubrimiento* es la métrica de SEO local real
- Llamadas, clics al sitio, solicitudes de ruta
- Términos de búsqueda que traen la ficha — insumo directo para el contenido del sitio y para ajustar categorías

**En GA4** (cuando exista): tráfico con `utm_source=google&utm_medium=organic&utm_campaign=gbp`, y su conversión a WhatsApp.

**Revisión mensual:** 30 minutos. Si las búsquedas por descubrimiento no suben en 90 días con la ficha completa, el problema es la categoría principal — cambiarla y medir otro trimestre.

---

## Orden de ejecución

| # | Acción | Responsable | Bloquea a |
|---|---|---|---|
| 1 | Reclamar y verificar la ficha | Cliente | TODO |
| 1b | Instalar letrero visible si no existe | Cliente | Verificación por video |
| 2 | Congelar NAP canónico y replicar horario partido en la ficha | ABM | Fases 2, 7 |
| 3 | Sesión de fotos en el taller | Cliente + fotógrafo | Fase 3, sitio, Facebook |
| 4 | Cargar categorías, servicios, descripción, atributos, área de servicio | ABM | Fase 8 |
| 5 | Entregar IDs de GA4 / Pixel | Cliente (vencido desde 2026-07-28) | Medición |
| 6 | Sembrar Q&A | ABM | — |
| 7 | Arrancar solicitud de reseñas por WhatsApp | Cliente | Fase 8 |
| 8 | Publicaciones semanales | ABM | — |
| 9 | Alta en directorios externos | ABM | — |

---

## Los tres pendientes que valen más que todo el resto

1. **Reclamar la ficha.** Sin esto nada existe.
2. **Fotos reales del taller.** Bloquea simultáneamente la ficha, 10 páginas del sitio y el plan de Facebook orgánico. Un solo insumo, tres canales.
3. **IDs de GA4/Pixel.** Vencidos desde la semana del 2026-07-28. Sin esto no hay forma de saber si algo de esto funcionó.
