# Floristería Valery - Plan Técnico

Estado: borrador para revisión. Este documento define la arquitectura y la ejecución técnica sin iniciar desarrollo.

## 1. Alcance y reglas

- Dominio fijo: `floristeriaenneiva.com`.
- La marca, el posicionamiento y el copy aprobado se preservan tal como quedaron definidos en el handoff creativo.
- El sitio debe ser mobile first desde el primer entregable.
- Todo el contenido visible y editable debe vivir en CMS o en una capa de configuración editable, no en texto duro del código.
- La primera fase debe funcionar como catálogo + WhatsApp asistido.
- La arquitectura debe quedar lista para evolucionar a ecommerce sin rehacer el sitio.
- No se publica en producción sin analítica activa, staging, QA y redirecciones validadas.
- Las URLs indexadas actuales se conservan; cualquier cambio de slug requiere redirección 301 uno a uno.
- Los cuatro datos aún abiertos - top ventas, ticket promedio, capacidad diaria y contactos B2B - no bloquean la arquitectura, pero sí bloquean el lanzamiento.

## 2. Stack recomendado

### Recomendación principal

- Frontend: Next.js 15 con App Router, React y TypeScript.
- Estilos: Tailwind CSS con variables de diseño en CSS custom properties.
- CMS: Sanity como CMS principal por su edición estructurada, preview y facilidad para contenido no técnico.
- Datos operativos ligeros: PostgreSQL o Supabase para formularios, leads, auditoría de cambios y tabla de redirecciones.
- Hosting web: Vercel para previews, staging y producción.
- Medios: CDN del CMS y optimización nativa con `next/image`.
- Analítica: GA4, Google Tag Manager, Search Console y Meta Pixel.

### Motivo de la elección

- Next.js cubre SEO, rutas dinámicas, pre-render y futuras extensiones de ecommerce.
- Sanity facilita edición por bloques y control de slugs, metadatos e imágenes.
- Supabase o PostgreSQL permiten guardar leads, formularios y redirecciones sin sobrecargar el CMS.
- Vercel simplifica staging, previews y rollback.

### Alternativa aceptable

- Si el cliente exige autoalojamiento del CMS, Directus puede reemplazar a Sanity sin cambiar la arquitectura pública.

## 3. Arquitectura del proyecto

### Capas

- Capa pública: páginas, listados, fichas, landings y páginas de soporte.
- Capa de contenido: modelos editables en CMS para páginas, categorías, productos, testimonios, campañas, FAQ y ajustes globales.
- Capa de integración: WhatsApp, formularios, analítica, Search Console y redirecciones.
- Capa operativa: staging, QA, revisión de contenido, publicación y rollback.
- Capa futura de comercio: carrito, checkout, pagos e inventario, diseñada pero no activada en la fase 1.

### Principios

- El contenido manda sobre la implementación.
- Las rutas deben ser estables y legibles.
- La compra remota se resuelve con WhatsApp asistido en fase 1.
- El backend público debe permanecer delgado para sostener buen rendimiento móvil.
- Cualquier futura capa de ecommerce debe acoplarse por módulos, no reemplazar la base existente.

## 4. Estructura del repositorio

### Propuesta de árbol

```text
floristeria-valery/
├── src/
│   ├── app/
│   ├── components/
│   ├── content/
│   ├── lib/
│   ├── hooks/
│   └── styles/
├── cms/
│   ├── schemas/
│   ├── plugins/
│   └── preview/
├── public/
│   ├── images/
│   ├── icons/
│   └── og/
├── redirects/
│   ├── current-urls.csv
│   └── redirect-map.csv
├── scripts/
│   ├── import-content.ts
│   ├── validate-redirects.ts
│   └── generate-sitemap.ts
├── tests/
│   ├── unit/
│   ├── e2e/
│   ├── a11y/
│   └── seo/
├── docs/
│   ├── technical-plan.md
│   ├── content-inventory.md
│   └── qa-checklists.md
└── .env.example
```

### Convención de organización

- `src/app` para rutas y layouts.
- `src/components` para UI reutilizable.
- `src/content` para utilidades de contenido y mapeo de modelos.
- `cms/schemas` para modelos editables.
- `redirects` para el inventario de URLs actuales y su mapa 301.
- `tests` para validación independiente de despliegue.

## 5. CMS o sistema de edición

### Elección

- Sanity como CMS editable por el equipo de Floristería Valery.

### Reglas de edición

- Todo texto público se edita desde CMS o configuración global.
- Los precios, horarios, descripciones, avisos y CTAs se actualizan sin tocar código.
- Las imágenes se administran desde el CMS con alt text obligatorio.
- Las fichas de producto deben permitir cambios de disponibilidad, variantes y mensajes de WhatsApp.
- Las páginas de campaña deben poder activarse y desactivarse por fecha.

### Funciones mínimas del CMS

- Preview antes de publicar.
- Slug fijo o validado por redirección.
- Historial de cambios.
- Campos condicionales por tipo de contenido.
- Bloqueo de publicación en staging si faltan campos obligatorios.
- Exportación de contenido para respaldo y migración.

## 6. Modelos de contenido

| Modelo | Propósito | Campos editables principales | Observaciones |
|---|---|---|---|
| SiteSettings | Ajustes globales del sitio | nombre, dominio, horarios, WhatsApp, redes, NAP, hero, textos legales, analytics IDs | Fuente única de información operativa pública |
| Product | Ficha de producto | nombre, slug, categoría, ocasión, precio, tamaños, composición, colores, imágenes, disponibilidad, tiempo de preparación, zonas, complementos, SEO, CTA WhatsApp | Debe soportar fase 1 y futura venta online |
| Category | Agrupación de catálogo | nombre, slug, intro, hero, filtros, SEO | Mantiene navegación y descubrimiento |
| Occasion | Agrupación por intención | nombre, slug, copy emocional, productos curados, FAQ, hero, SEO | Alineada al posicionamiento aprobado |
| Campaign | Landing temporal | nombre, fecha, objetivo, hero, CTA, productos destacados, UTM, estado activo/inactivo | Activación por temporada |
| Testimonial | Prueba social | fuente, nombre visible, rating, comentario, fecha, enlace original | Solo reseñas reales de Google Opiniones |
| FAQ | Objeciones y respuestas | pregunta, respuesta, ámbito de visibilidad | Reutilizable en home, ayuda y landings |
| LeadFormSubmission | Registro de formularios | tipo, nombre, contacto, fecha, mensaje, estado, consentimiento | Útil para seguimiento y auditoría |
| Redirect | Redirecciones 301 | origen, destino, código, motivo, activo | Necesario para conservar URLs indexadas |
| DeliveryRule | Reglas operativas | horario, tarifa máxima, zonas, excepciones, días cerrados | Debe reflejar la operación real aprobada |
| B2BContact | Contacto comercial | empresa, nombre, cargo, canal, notas, estado | Se carga cuando el cliente entregue la base |

### Campos pendientes que no bloquean la arquitectura

- Top ventas.
- Ticket promedio.
- Capacidad diaria.
- Contactos B2B.

### Campos que sí deben existir desde el inicio

- Nombre del producto.
- Slug.
- Precio.
- Disponibilidad.
- Tiempo de preparación.
- CTA a WhatsApp.
- SEO básico.
- Imagen principal.

## 7. Árbol de páginas

| Ruta | Intención |
|---|---|
| `/` | Home principal |
| `/comprar-flores` | Hub de catálogo |
| `/comprar-flores/bouquets` | Categoría |
| `/comprar-flores/rosas` | Categoría preservada |
| `/comprar-flores/topiarios` | Categoría preservada |
| `/comprar-flores/exoticos` | Categoría preservada |
| `/comprar-flores/fruteros` | Categoría preservada |
| `/comprar-flores/cajas-florales` | Categoría |
| `/comprar-flores/ramos-buchones` | Categoría |
| `/comprar-flores/tropicales` | Categoría |
| `/comprar-flores/condolencias` | Categoría sensible |
| `/comprar-flores/arreglos-corporativos` | Línea empresarial |
| `/comprar-flores/complementos` | Complementos |
| `/ocasiones` | Hub de ocasiones |
| `/ocasiones/cumpleanos` | Ocasión |
| `/ocasiones/aniversarios` | Ocasión |
| `/ocasiones/amor-reconciliacion` | Ocasión |
| `/ocasiones/felicitaciones` | Ocasión |
| `/ocasiones/nacimiento` | Ocasión |
| `/ocasiones/gracias` | Ocasión |
| `/ocasiones/recuperacion` | Ocasión |
| `/ocasiones/condolencias` | Ocasión |
| `/ocasiones/funerales` | Ocasión |
| `/ocasiones/eventos-empresariales` | Ocasión |
| `/ocasiones/bodas` | Ocasión |
| `/ocasiones/dia-de-la-madre` | Temporada |
| `/ocasiones/san-valentin` | Temporada |
| `/ocasiones/amor-y-amistad` | Temporada |
| `/ocasiones/dia-de-la-mujer` | Temporada |
| `/ocasiones/dia-del-padre` | Temporada |
| `/ocasiones/graduaciones` | Temporada |
| `/ocasiones/navidad` | Temporada |
| `/ocasiones/fin-de-ano` | Temporada |
| `/entrega-hoy` | Urgencia |
| `/comprar-desde-lejos` | Compra remota |
| `/personalizados` | Solicitud a medida |
| `/eventos` | Eventos |
| `/empresas` | Empresas |
| `/nosotros` | Marca |
| `/ayuda` | FAQ |
| `/contacto` | Contacto y WhatsApp |
| `/politicas/sustitucion` | Política |
| `/politicas/privacidad` | Política |
| `/politicas/datos` | Política |
| `/404` | Error |

### Regla de URLs

- Las URLs indexadas actuales deben mantenerse tal como están si ya existen.
- Si algún slug cambia, se registra en `redirect-map.csv` y se publica con 301.
- No se permiten cadenas de redirección.
- El dominio canónico debe ser `floristeriaenneiva.com`.

## 8. Componentes reutilizables

- Header sticky con navegación y acceso a WhatsApp.
- Mobile bottom bar con CTA de compra y CTA de WhatsApp.
- Hero principal.
- Hero de categoría.
- ProductCard.
- ProductGrid con filtros.
- ProductDetail.
- OccasionHero.
- GuaranteeList.
- StepsHowItWorks.
- TestimonialCard.
- FAQAccordion.
- ContactStrip.
- Breadcrumb.
- WhatsAppButton contextual.
- QuoteForm.
- LeadForm.
- Footer con NAP, horarios y enlaces útiles.
- DeliveryBadge.
- PriceBlock.
- AvailabilityBadge.
- RelatedProducts.
- EmptyState.
- ErrorState.

### Reglas de composición

- Los bloques deben servir tanto para home como para landings y fichas.
- Los componentes deben ser accesibles por teclado.
- Las variantes deben depender de datos, no de duplicación de markup.

## 9. Integración con WhatsApp

### Modalidad

- WhatsApp será el canal de cierre asistido en fase 1.
- El sitio generará mensajes precargados según contexto.
- El usuario siempre debe entender qué información se envía al tocar el CTA.

### Contextos mínimos

- Ficha de producto.
- Entrega hoy.
- Comprar desde lejos.
- Condolencias.
- Personalizados.
- Empresas y eventos.

### Reglas técnicas

- Usar enlaces `wa.me` o `api.whatsapp.com/send` con texto prellenado.
- Guardar el número y los templates en configuración editable.
- Registrar el clic como evento de analítica.
- Incluir fallback visible si el usuario no tiene WhatsApp instalado.
- No bloquear la navegación si WhatsApp falla.

### Reglas operativas

- Fase 1 solo asiste la venta, no la automatiza por completo.
- Los mensajes deben respetar la comunicación aprobada.
- No publicar promesas que el equipo no pueda sostener operativamente.

## 10. Formularios

### Formularios previstos

- Personalizados.
- Eventos.
- Empresas.
- Contacto general.

### Datos mínimos por formulario

- Nombre.
- Teléfono o WhatsApp.
- Email cuando aplique.
- Tipo de pedido o evento.
- Fecha requerida.
- Mensaje libre.
- Consentimiento de contacto.

### Reglas

- Los formularios deben ser cortos, móviles y accesibles.
- La validación debe ocurrir en cliente y servidor.
- El envío debe generar confirmación visible.
- El envío debe crear evento de analítica.
- Si el formulario alimenta WhatsApp, debe abrir la conversación con contexto completo.
- Los textos de ayuda y error deben ser editables.

### Persistencia

- Guardar envíos en base de datos o CMS según el tipo.
- Mantener registro de fecha, fuente y estado de atención.
- No almacenar información sensible sin necesidad real.

## 11. SEO técnico

### Fundamentos

- Títulos únicos por página.
- Meta descriptions consistentes con el contenido.
- H1 único por página.
- Enlaces internos claros entre home, categorías, ocasiones y fichas.
- Canonical por página.
- Open Graph y Twitter Cards.
- Sitemap XML dinámico.
- Robots.txt correcto.
- 404 útil y enlazada.

### SEO local

- NAP idéntico al de Google Business Profile.
- Horarios visibles y consistentes.
- WhatsApp prominente.
- Menciones geográficas naturales de Neiva.
- Schema para negocio local y floristería.

### Schema recomendado

- `Organization`.
- `LocalBusiness`.
- `Florist` si se implementa como tipo compatible.
- `Product`.
- `BreadcrumbList`.
- `FAQPage`.
- `WebSite`.

### Reglas de indexación

- Las landings de campaña deben indexarse solo si aportan valor estable.
- Las páginas de staging y preview deben ir con `noindex`.
- Las páginas vacías o incompletas no deben publicarse.
- El contenido debe quedar listo para búsqueda por ocasión, producto y urgencia.

## 12. Preservación de URLs y redirecciones

### Estrategia

- Auditar todas las URLs actuales antes de cualquier cambio.
- Congelar los slugs indexados más importantes.
- Crear un inventario de URLs activas, redirecciones y páginas obsoletas.
- Publicar 301 uno a uno cuando exista reemplazo.
- Validar que no haya loops, 404 rotos ni cadenas largas.

### Flujo de migración de URLs

1. Crawl del sitio actual.
2. Exportación de URLs desde Search Console.
3. Cruce con analytics y logs.
4. Mapa de equivalencias.
5. QA de redirecciones en staging.
6. Validación final antes de publicar.

### Reglas

- Preservar `floristeriaenneiva.com` como dominio principal.
- Mantener la estructura indexada que ya funciona cuando sea posible.
- No cambiar un slug solo por criterio estético.

## 13. Analítica

### Herramientas

- GA4.
- Google Tag Manager.
- Search Console.
- Meta Pixel.

### Eventos mínimos

- `page_view`.
- `view_item`.
- `select_item`.
- `view_category`.
- `view_occasion`.
- `click_whatsapp`.
- `submit_form`.
- `request_quote`.
- `click_phone`.
- `delivery_today_click`.
- `redirect_click`.

### Reglas

- No lanzar producción sin verificaciones de eventos.
- Documentar el plan de etiquetado antes de construir.
- Probar eventos en staging y production.
- Mantener un cuadro de mando simple para sesiones, clics a WhatsApp, formularios y conversiones.

### Consideraciones

- Si hay consentimiento de cookies requerido por la implementación, se debe resolver antes del lanzamiento.
- El tracking debe respetar privacidad y no romper la experiencia móvil.

## 14. Rendimiento

### Objetivos

- Prioridad absoluta a carga rápida en móvil.
- LCP y CLS bajo control.
- Poco JavaScript en páginas de marketing y catálogo.

### Medidas

- `next/image` para imágenes responsivas.
- AVIF y WebP con fallback.
- Lazy loading en medios secundarios.
- Pre-render de páginas de contenido.
- Componentes pequeños y reutilizables.
- Fuentes optimizadas.
- Animaciones ligeras y opcionales.
- CSS simple para evitar bloqueo de render.

### Reglas de contenido

- No usar video pesado en mobile si compromete la primera pintura.
- No incrustar texto importante dentro de imágenes.
- Priorizar fotos reales bien comprimidas.

## 15. Accesibilidad

### Criterios

- WCAG 2.2 AA como objetivo operativo.
- Navegación completa por teclado.
- Contraste suficiente.
- Focus visible.
- Labels en formularios.
- Mensajes de error claros.
- `prefers-reduced-motion` respetado.
- `alt` descriptivo en toda imagen informativa.

### Reglas de UI

- Botones con tamaño táctil adecuado.
- CTA visibles sin depender de color solamente.
- Estructura semántica correcta de encabezados.
- Contenido sensible y urgente legible en pantallas pequeñas.

## 16. Seguridad

### Medidas mínimas

- HTTPS obligatorio.
- HSTS habilitado.
- CSP razonable.
- Variables secretas fuera del código.
- Validación de formularios en cliente y servidor.
- Rate limiting o protección antiabuso.
- Honeypot como primera línea para spam en formularios.
- Permisos mínimos para usuarios del CMS.
- Backup de contenido y configuración.

### Reglas operativas

- No exponer IDs sensibles en el frontend.
- No permitir edición pública sin autenticación.
- No confiar en datos enviados desde el navegador.
- Registrar cambios críticos del CMS.

## 17. Staging

### Requisitos

- Entorno separado de producción.
- `noindex` forzado.
- Acceso restringido.
- Misma estructura de rutas y datos que producción.
- Analítica en modo prueba o filtrada.

### Uso

- Validar contenido.
- Validar diseño responsive.
- Validar rendimiento.
- Validar SEO técnico.
- Validar WhatsApp y formularios.
- Validar redirecciones antes de publicar.

### Cierre de staging

- Staging no se considera aprobado hasta pasar QA completo y revisión funcional.

## 18. Migración

### Qué migrar

- Contenido visible aprobado.
- Imágenes y activos de marca.
- URLs indexadas.
- Metadatos SEO.
- FAQ.
- Testimonios reales.
- Ajustes globales.

### Qué no migrar sin validación

- Precios no confirmados.
- Top ventas no confirmados.
- Capacidad diaria no confirmada.
- Contactos B2B no entregados.
- Cualquier promesa operativa no aprobada.

### Orden recomendado

1. Inventario.
2. Limpieza.
3. Mapeo de slugs.
4. Carga en CMS.
5. QA de render.
6. QA de enlaces.
7. QA de analytics.
8. QA de redirecciones.
9. Publicación.

## 19. Pruebas

### Tipos de prueba

- Unitarias.
- Integración.
- End to end.
- Accesibilidad.
- SEO.
- Rendimiento.
- Redirecciones.
- Formularios.
- WhatsApp.

### Escenarios mínimos

- Home en móvil.
- Home en desktop.
- Ficha de producto.
- Compra desde lejos.
- Entrega hoy.
- Condolencias.
- Personalizados.
- Empresas y eventos.
- Error 404.
- Redirección de URL antigua a nueva.
- Envío de formulario.
- Clic a WhatsApp con contexto correcto.

### Criterio de pase

- Ninguna ruta crítica se publica sin pasar QA funcional y técnico.

## 20. Despliegue

### Flujo

- Pull request o equivalente.
- Preview.
- Revisión.
- Staging.
- QA final.
- Producción.

### Reglas

- No desplegar producción si analytics, staging o redirects no están validados.
- No publicar contenido incompleto.
- Publicar primero la capa de contenido base y luego ampliar catálogo.
- Registrar la versión exacta desplegada.

### Acciones post-despliegue

- Verificar Search Console.
- Verificar sitemap.
- Verificar eventos.
- Verificar WhatsApp.
- Verificar formularios.
- Verificar redirecciones.

## 21. Rollback

### Estrategia

- Cada despliegue debe quedar versionado.
- El CMS debe conservar la versión anterior de contenido.
- La infraestructura debe permitir volver al último build estable sin reescribir todo.

### Qué revertir

- Build de producción.
- Configuración de entorno.
- Mapa de redirecciones.
- Contenido publicado si el error viene del CMS.

### Criterio

- El rollback debe ser ejecutable rápido y sin pérdida de contenido crítico.

## 22. Fases de implementación

### Fase 0 - Preparación

- Confirmar accesos a dominio, hosting, CMS, GBP, GA4, GTM, Search Console y Meta Pixel.
- Inventariar URLs actuales.
- Reunir logo, fotografías, catálogo y políticas reales.
- Confirmar los cuatro datos abiertos.

### Fase 1 - Base técnica

- Montar repositorio.
- Configurar Next.js, TypeScript, estilos y entorno.
- Definir layouts y componentes base.
- Configurar staging y previews.
- Preparar analítica y esquema de eventos.

### Fase 2 - CMS y contenido

- Crear modelos de contenido.
- Cargar ajustes globales.
- Cargar categorías, ocasiones, páginas institucionales y FAQ.
- Preparar plantillas editables.

### Fase 3 - Catálogo + WhatsApp asistido

- Crear hub de catálogo.
- Crear fichas de producto.
- Configurar mensajes precargados.
- Habilitar formularios mínimos.
- Publicar flujos de urgencia y compra remota.

### Fase 4 - SEO, redirecciones y QA

- Implementar metadatos y schema.
- Validar sitemap y robots.
- Validar 301.
- Ejecutar pruebas móviles, accesibilidad y rendimiento.
- Corregir problemas antes de lanzar.

### Fase 5 - Lanzamiento

- Publicar producción.
- Verificar Search Console, analytics y enlaces.
- Monitorear errores y formularios.

### Fase 6 - Evolución a ecommerce

- Activar modelos de variante, inventario y checkout.
- Integrar pagos.
- Agregar órdenes y confirmaciones automatizadas.
- Mantener URLs públicas y SEO existentes.

## 23. Riesgos

- Falta de top ventas, ticket promedio, capacidad diaria y contactos B2B antes de lanzar.
- Dependencia operativa de WhatsApp manual.
- Riesgo de sobreventa si no se fija capacidad diaria.
- Riesgo de pérdida de tráfico si se cambian slugs sin 301.
- Riesgo de publicar promesas no sostenibles.
- Riesgo de contenido no editable si se hardcodea copy.
- Riesgo de baja velocidad si se usan medios pesados.
- Riesgo de baja confianza si no se muestran precio, disponibilidad y tiempos con claridad.

## 24. Dependencias

- Dominio y DNS.
- Hosting y acceso al entorno de despliegue.
- Cuenta de CMS.
- Accesos a Google Business Profile.
- GA4, GTM y Search Console.
- Meta Pixel.
- Número de WhatsApp y propiedad de la línea.
- Logo y activos de marca.
- Banco de imágenes.
- Catálogo base.
- Políticas reales de sustitución, horarios, zonas y entregas.
- Inventario de URLs actuales.
- Los cuatro datos abiertos ya mencionados.

## 25. Preguntas técnicas pendientes

- Se confirma Sanity como CMS definitivo o se requiere autoalojamiento con Directus.
- Se usará un solo número de WhatsApp o múltiples líneas por flujo.
- Se publicará staging en subdominio propio o en entorno privado protegido.
- Se centralizarán leads en CMS, en base de datos o en ambas capas.
- Se necesita banner de consentimiento para tracking según revisión legal o técnica.
- Se cargarán redirecciones manualmente o desde un CSV importable.
- Se desea almacenar historial de cambio de precio y disponibilidad dentro del CMS.
- Se define una fuente única para fotos reales y fotos conceptuales.

## 26. Criterios de aceptación

- El sitio conserva `floristeriaenneiva.com`.
- Las URLs indexadas actuales quedan preservadas o redirigidas con 301.
- El home explica qué vende, dónde entrega y cómo comprar.
- El contenido es editable sin tocar código.
- El flujo catálogo + WhatsApp asistido funciona en móvil.
- Los formularios funcionan y confirman el envío.
- La analítica queda activa y verificada antes de producción.
- Staging y QA se completan antes de lanzar.
- El SEO técnico base está implementado.
- Las páginas clave pasan pruebas de accesibilidad y rendimiento.
- La arquitectura permite activar ecommerce después sin rehacer el sitio.
- Los cuatro datos abiertos quedan resueltos o formalmente aprobados antes del lanzamiento.
- No se publican productos, precios o capacidades no confirmados.

## 27. Decisión final

- La implementación debe arrancar solo cuando el cliente entregue los cuatro datos abiertos y confirme los accesos técnicos mínimos.
- Hasta entonces, este documento funciona como plan de trabajo y control de alcance.
