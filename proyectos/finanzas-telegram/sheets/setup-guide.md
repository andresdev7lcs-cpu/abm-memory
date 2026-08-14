# Guía de creación del Google Sheet

Tiempo estimado: 25–35 minutos. Se hace una sola vez.
Prerrequisitos: cuenta de Google con Drive, y `sheets/schema.md` y `sheets/demo-data.csv` a la mano.

---

## Paso 1 — Crear el archivo

1. `sheets.new` o Drive → `Nuevo → Hoja de cálculo de Google`.
2. Nombre: **`finanzas-telegram — Control de gastos`**.
3. Guardarlo en una carpeta propia del proyecto, no suelto en "Mi unidad".

## Paso 2 — Configuración regional

`Archivo → Configuración`:

- **Configuración regional:** `Español (Colombia)`
- **Zona horaria:** `(GMT-05:00) Bogotá`
- **Recalculación:** `Al cambiar`

Esto fija `.` como separador de miles, `,` como decimal, y `;` como separador de argumentos en fórmulas. Si se salta este paso, las fórmulas de `formulas.md` fallan y los montos se ven mal.

## Paso 3 — Crear las 8 hojas

Renombrar `Hoja 1` a `Configuracion` y crear las otras siete. Nombres **exactos**, sin tildes ni espacios:

```
Configuracion
Categorias
Transacciones
Ingresos
Resumen
Alertas
Pendientes
Auditoria
```

Sugerencia: añadir una novena hoja `Aux` si se van a usar las fórmulas espejo.

## Paso 4 — Pegar los encabezados

Para cada hoja, copiar de `sheets/schema.md` la línea de encabezados (están separados por tabulaciones), hacer clic en **A1** y pegar. Sheets reparte cada nombre en su columna automáticamente.

Verificar en `Transacciones` que el último encabezado (`notas`) cae en la columna **AD**. Si cae en otra, faltó o sobra una columna.

## Paso 5 — Formatos

Por hoja, siguiendo las tablas de `schema.md`:

1. **Texto sin formato** en las columnas de ID, timestamps, hashes y IDs de Telegram.
   Seleccionar la columna → `Formato → Número → Texto sin formato`.
   Prueba rápida: escribir `TX-20260808-0001` en una celda. Debe quedar alineado a la izquierda y verse idéntico.
2. **Moneda** en `presupuesto`, `gastado`, `disponible`, `monto`, `monto_esperado`, `monto_recibido`:
   `Formato → Número → Formato de número personalizado` → `$ #.##0`
3. **Fecha** en `fecha_movimiento`, `fecha_inicio`, `fecha_fin`, `proxima_fecha`, `fecha_recibido`:
   `Formato → Número → Fecha y hora personalizadas` → `AAAA-MM-DD`
4. Inmovilizar la fila 1 en las 8 hojas: `Ver → Inmovilizar → 1 fila`.
5. Negrita y fondo gris en la fila 1.

## Paso 6 — Validaciones de lista

`Datos → Validación de datos` en cada columna ENUM (lista completa en `schema.md`). Configurar como *Lista de elementos*, con **Rechazar la entrada**.

Las críticas, si hay poco tiempo:

- `Transacciones!E` (`tipo`)
- `Transacciones!Z` (`estado`)
- `Transacciones!O` (`origen`)
- `Categorias!L` (`estado`)
- `Pendientes!J` (`estado`)

## Paso 7 — Rangos con nombre

`Datos → Rangos con nombre`. Crear los 13 de la tabla de `schema.md`. Sin ellos, las fórmulas de `formulas.md` no funcionan.

## Paso 8 — Cargar los datos de demostración

`sheets/demo-data.csv` está dividido en bloques marcados con `# HOJA: <nombre>`.

Para cada bloque:

1. Abrir el CSV en un editor de texto.
2. Copiar solo las líneas de datos del bloque — **sin** la línea `# HOJA:`, **sin** la línea de encabezados (ya está en la fila 1) y sin las líneas que empiezan por `#`.
3. En la hoja correspondiente, clic en **A2** → `Editar → Pegado especial → Pegar solo valores`.
4. Si todo quedó en una sola columna: `Datos → Dividir el texto en columnas → Separador: coma`.

⚠️ **No usar `Archivo → Importar`** con la opción *Reemplazar hoja*: borra los formatos y validaciones del paso anterior.

Los campos que contienen JSON van entre comillas dobles en el CSV. Al pegar deben quedar en una sola celda. Si se parten, el separador se resolvió mal — deshacer y repetir con `Pegado especial`.

## Paso 9 — Verificar la aritmética de la demo

Con los datos cargados, estos números deben cuadrar:

| Comprobación | Valor esperado |
|---|---|
| `SUM(Categorias!E2:E16)` (presupuestos) | `4.000.000` |
| `SUM(Categorias!I2:I16)` (gastado) | `1.290.750` |
| `Resumen → disponible_total` | `2.709.250` |
| Filas en `Transacciones` | 12 (11 activas + 1 anulada) |
| `CAT-004` porcentaje | `85,6 %` |
| Filas en `Alertas` | 3 |

Si el presupuesto no da exactamente 4.000.000, se perdió una fila al pegar.

## Paso 10 — Permisos

1. `Compartir` → debe decir **"Restringido"**. Si dice "Cualquier persona con el enlace", cambiarlo ya.
2. Añadir el `client_email` de la service account de n8n como **Editor** (ver `n8n/credentials-reference.md` §2).
3. Verificar que `Archivo → Compartir → Publicar en la Web` esté **apagado**.

## Paso 11 — Obtener el ID del documento

De la URL:

```
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J_kLmNoPqRsTuVwXyZ/edit#gid=0
                                      └──────────── esto es el ID ────────────┘
```

Va en `.env` como `GOOGLE_SHEETS_DOCUMENT_ID`. No es secreto, pero tampoco se publica.

## Paso 12 — Poner los datos reales

Antes de operar de verdad:

1. `Configuracion!autorizados_user_ids` — los `telegram_user_id` reales. Obtenerlos escribiéndole a `@userinfobot`. **Mientras esté vacío, el bot rechaza a todo el mundo** (fail-closed, a propósito).
2. `Configuracion!admin_chat_id` — el chat que recibe las alertas técnicas.
3. `Categorias!presupuesto` — los presupuestos reales. Los DEMO son de ejemplo.
4. `Ingresos` — las fuentes reales, con sus días y montos.
5. Confirmar `ciclo_dias_inicio` (default `1,16` — ver DEC-001).
6. Borrar las filas DEMO de `Transacciones`, `Alertas`, `Pendientes` y `Auditoria` cuando ya no hagan falta. Las de `Configuracion` y `Categorias` se **editan**, no se borran.

---

## Checklist final

- [ ] 8 hojas con nombres exactos, sin tildes
- [ ] Configuración regional `Español (Colombia)` y zona horaria `Bogotá`
- [ ] Encabezados en la fila 1; `Transacciones` termina en la columna `AD`
- [ ] Fila 1 inmovilizada en las 8 hojas
- [ ] IDs y timestamps en Texto sin formato (verificado escribiendo un ID)
- [ ] Montos con formato `$ #.##0`
- [ ] Fechas con formato `AAAA-MM-DD`
- [ ] Validaciones de lista en las columnas ENUM críticas
- [ ] 13 rangos con nombre creados
- [ ] Datos DEMO cargados y aritmética verificada (paso 9)
- [ ] `Compartir` = "Restringido"
- [ ] Service account añadida como Editor
- [ ] `GOOGLE_SHEETS_DOCUMENT_ID` en `.env`
- [ ] Historial de versiones activo (viene por defecto)
