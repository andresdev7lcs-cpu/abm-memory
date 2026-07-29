# Auditoría SEO — modutriplex.com
**Fecha:** 2026-07-29 · **Método:** framework `seo-audit` (biblioteca USB) · **Alcance:** las 11 páginas en producción

---

## Resumen ejecutivo

El sitio está técnicamente sano: crawlable, indexable, con schema válido, títulos únicos y contenido con profundidad real. No hay bloqueadores de indexación.

**Top 3 prioridades:**
1. **Bug de servidor 500** en las 10 sub-páginas cuando se accede con `/` al final — puede pasar desapercibido, pero cualquier enlace externo o compartido con slash devuelve error a Google y al usuario.
2. **Inconsistencia NAP**: el horario en el schema (datos que lee Google) no coincide con el horario visible en el footer (lo que lee el humano).
3. **10 de 11 páginas sin ninguna imagen.** Afecta enganche, oportunidad de tráfico por Google Imágenes, y la señal de "Experiencia" (E-E-A-T) que Google evalúa — el contenido habla de máquinas y proyectos reales sin mostrar ni una foto.

Nada de esto bloquea la indexación. Son mejoras que suben el techo, no requisitos para salir a flote.

---

## 1. Crawlability e indexación — ✅ Sano

| Chequeo | Resultado |
|---|---|
| robots.txt | Correcto, permite todo, referencia el sitemap |
| sitemap.xml | 11 URLs, formato válido, incluye `image:image` en home |
| Todas las páginas | HTTP 200 en las 11 |
| HTTP → HTTPS | 301 correcto |
| www → sin www | 301 correcto |
| Canonical | Presente y auto-referenciado en las 11 páginas |

Sin páginas huérfanas: las 10 sub-páginas están a 1 clic del home vía el nuevo dropdown "Materiales".

---

## 2. Hallazgos técnicos

### 🔴 Alto — Error 500 con trailing slash en las 10 sub-páginas

```
https://modutriplex.com/maquinaria/              -> 500
https://modutriplex.com/melaminico-a-la-medida/  -> 500
https://modutriplex.com/canteado/                -> 500
https://modutriplex.com/materiales-closets/      -> 500
```

Confirmado en las 3 páginas probadas — es sistémico, no un caso aislado. La regla de `.htaccess` que agrega `.html` a las URLs limpias no maneja el caso de un slash final; en vez de dar 404, el servidor devuelve **500 Internal Server Error**.

**Impacto:** cualquiera que comparta o enlace con `/` al final (común: copiar la URL desde la barra del navegador con autocompletado, o un enlace externo mal formado) manda al visitante a un error de servidor, no a un 404 amigable. Un 500 también es peor señal de salud del sitio que un 404 si Googlebot lo encuentra.

**Fix recomendado:** en `.htaccess`, antes de la regla que añade `.html`, agregar una que quite el slash final con redirect 301:
```apache
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.+)/$ /$1 [L,R=301]
```

### 🟡 Medio — URLs duplicadas sin redirect (`.html` vs limpia)

```
/maquinaria.html      -> 200
/maquinaria           -> 200   (misma página, ambas activas)
```

Se repite en las 10 sub-páginas. El `canonical` está bien puesto en ambas variantes (apunta siempre a la versión limpia), así que el riesgo de contenido duplicado en el índice es bajo — Google consolida señales al canonical. Pero sigue gastando presupuesto de rastreo en dos URLs por página en vez de una, y no es la práctica más limpia.

**Fix:** agregar un 301 explícito de `X.html` → `/X` en el `.htaccess`.

### 🟡 Medio — HSTS ausente

No hay cabecera `Strict-Transport-Security`. El sitio ya fuerza HTTPS por redirect, pero sin HSTS el navegador vuelve a pedir HTTP en la próxima visita antes de redirigir. Es un "bonus" según el framework de auditoría, no crítico.

**Fix:** agregar en `.htaccess`:
```apache
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

### 🟢 Bien — Compresión, caché y seguridad

- Brotli activo (`content-encoding: br`)
- Imágenes con caché de 1 año, CSS de 1 mes — correcto
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` presentes

---

## 3. On-page SEO

### ✅ Títulos y meta descriptions

Las 11 páginas tienen title y description **únicos**, sin duplicados. Longitudes:

| Página | Title | Description |
|---|---|---|
| Home | 72 car. | 150 car. |
| Melamínico a la medida | 65 car. | 160 car. |
| MDF a la medida | 60 car. | 165 car. |
| Melamínico RH | 69 car. | 177 car. ⚠️ |
| Canteado | 71 car. | 169 car. |
| Maquinaria | 71 car. | 169 car. |
| Clima frío | 64 car. | 151 car. |
| Clima cálido | 67 car. | 151 car. |
| Colores tendencia | 74 car. ⚠️ | 173 car. |
| Alto tráfico | 63 car. | 169 car. |
| Clósets | 68 car. | 151 car. |

Dos títulos (69-74 car.) y varias descriptions (165-177 car.) están en el límite alto. No se truncan siempre — depende del ancho en píxeles de cada carácter — pero **"Melamínico RH..." (177 car.) y "Colores en Tendencia..." (74 car.) son las de mayor riesgo** de corte en el resultado de búsqueda.

### ✅ Estructura de encabezados

1 solo `<h1>` por página en las 11. Jerarquía H1→H2 respetada, sin saltos.

### ✅ Imágenes: alt text

Todas las imágenes existentes tienen `alt` descriptivo, ninguna vacía. (El problema no es la calidad del alt — es que casi no hay imágenes, ver sección 4.)

### ✅ Enlazado interno

Cero enlaces internos rotos en las 11 páginas. El dropdown "Materiales" conecta todo el sitio en 1 clic desde cualquier página.

### 🟡 Menor — Mismo `og:image` en las 11 páginas

Todas comparten `assets/img/og-image.jpg`. Funciona, pero una imagen social distinta por tipo de contenido (ej. una para "materiales" vs otra para "maquinaria") mejora el CTR al compartir en redes. Prioridad baja.

---

## 4. Contenido y E-E-A-T

### ✅ Profundidad de contenido

Nada de contenido delgado. Las páginas de guía tienen entre 496 y 670 palabras, la home 2059. Rango sano para el tipo de página.

### 🔴 Alto — 10 de 11 páginas sin ninguna imagen

```
index.html:                     1 imagen (el hero)
las otras 10 páginas:           0 imágenes
```

Este es el hallazgo de mayor impacto de la auditoría. Las páginas hablan de máquinas reales (Striebig, Holz-Her, KDT), de proyectos y de materiales — pero no muestran ni una foto. Consecuencias:

- **Cero oportunidad en Google Imágenes**, un canal de tráfico gratis que se está dejando en la mesa
- **Señal de "Experiencia" débil.** Google evalúa E-E-A-T (Experiencia, Pericia, Autoridad, Confianza); mostrar fotos reales del taller, las máquinas operando, piezas etiquetadas y proyectos terminados es la prueba más barata y efectiva de que el negocio es real y hace lo que dice
- **Menor tiempo en página.** Un muro de texto sin apoyo visual invita a salir más rápido

Esto coincide con un pendiente ya identificado en sesiones anteriores: falta material fotográfico real del cliente. No es un problema de código — es un insumo que falta.

**Fix:** en cuanto haya fotos reales (taller, máquinas, piezas etiquetadas, proyectos terminados), insertarlas en las 10 páginas de contenido con `loading="lazy"` (excepto la primera imagen visible) y alt descriptivo.

### 🟡 Menor — Inconsistencia NAP: horario en schema vs. footer visible

**Lo que lee Google (JSON-LD):**
```json
"openingHoursSpecification": [
  { "dayOfWeek": ["Monday",...,"Friday"], "opens": "08:00", "closes": "16:30" },
  { "dayOfWeek": "Saturday", "opens": "08:00", "closes": "12:00" }
]
```

**Lo que lee el humano (footer):**
```
Horario: Lun-Vie 8am–1pm, 2pm–4:30pm. Sábado 8am–12pm
```

El schema declara jornada continua de 8am a 4:30pm. El footer dice que hay un cierre de 1pm a 2pm (almuerzo). Si alguien busca "Modutriplex" a la 1:30pm, Google puede mostrar "Abierto ahora" basado en el schema cuando en realidad está cerrado — mala experiencia y golpe a la confianza en la ficha.

**Fix:** partir el bloque `Monday-Friday` en dos rangos horarios en el JSON-LD (`08:00-13:00` y `14:00-16:30`) para que coincida con el footer. Mismo ajuste aplica al Google Business Profile cuando se configure (pendiente del plan de seguimiento).

También: el campo `"postalCode": ""` está vacío — o se completa con el código postal real, o se elimina la propiedad completa. Un campo vacío no rompe nada, pero no aporta y es fácil de corregir.

---

## 5. Verificación pendiente (requiere navegador, no accesible por curl)

Según el propio framework de auditoría: `curl` no puede medir Core Web Vitals reales (LCP, INP, CLS) ni el reflow de layout — eso requiere una herramienta que renderice. Recomendado antes de invertir en pauta:

- [ ] **PageSpeed Insights** sobre `/` y sobre un hub (ej. `/canteado`) — objetivo móvil > 70
- [ ] **Mobile-Friendly Test** de Google
- [ ] **Rich Results Test** para confirmar que el FAQPage y el LocalBusiness se renderizan como rich snippet (el schema es válido por JSON, pero la prueba visual confirma que Google lo interpreta como se espera)

---

## Plan de acción priorizado

### Esta semana (bloqueante de salud técnica)
1. Fix del 500 en trailing slash — regla de `.htaccess`, 10 minutos
2. Corregir el horario del schema para que coincida con el footer (almuerzo 1-2pm)

### Este mes (alto impacto, bajo esfuerzo)
3. Redirect 301 de `.html` → URL limpia en `.htaccess`
4. Agregar HSTS
5. Conseguir y subir fotos reales del taller/máquinas/proyectos a las 10 páginas de contenido — es el pendiente de mayor impacto de todo el sitio

### Cuando haya tiempo (pulido)
6. Recortar el title de "Colores en Tendencia" y la description de "Melamínico RH" a rango más seguro
7. Rellenar o quitar `postalCode` vacío
8. Variar `og:image` por tipo de contenido
9. Ejecutar PageSpeed Insights y Rich Results Test una vez resuelto lo anterior

---

## Lo que ya está bien resuelto (no tocar)

Sitemap, robots.txt, redirects HTTPS/www, canonical, un solo H1 por página, cero enlaces rotos, alt text en imágenes existentes, schema válido en las 11 páginas, títulos y descriptions únicos, contenido con profundidad real, caché y compresión bien configuradas.
